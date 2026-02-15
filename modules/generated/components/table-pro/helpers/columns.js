function toIdPart(value) {
  return String(value ?? '')
    .trim()
    .toLowerCase()
    .replace(/[^a-zA-Z0-9_а-яА-Я-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function cloneColumns(columns) {
  return JSON.parse(JSON.stringify(Array.isArray(columns) ? columns : []));
}

export function normalizeFixed(value) {
  if (value === true) return 'left';
  if (value === false || value == null) return '';
  const normalized = String(value).trim().toLowerCase();
  if (normalized === 'left' || normalized === 'start') return 'left';
  if (normalized === 'right' || normalized === 'end') return 'right';
  return '';
}

function resolveGroupPath(column) {
  if (Array.isArray(column?.groupPath)) {
    return column.groupPath.map((part) => String(part || '').trim()).filter(Boolean);
  }

  if (typeof column?.groupPath === 'string' && column.groupPath.trim()) {
    return column.groupPath
      .split(/\s*(?:\/|>|\\)\s*/g)
      .map((part) => String(part || '').trim())
      .filter(Boolean);
  }

  if (Array.isArray(column?.groups)) {
    return column.groups.map((part) => String(part || '').trim()).filter(Boolean);
  }

  if (typeof column?.group === 'string' && column.group.trim()) {
    return [column.group.trim()];
  }

  if (typeof column?.groupHeader === 'string' && column.groupHeader.trim()) {
    return [column.groupHeader.trim()];
  }

  return [];
}

function hasGroupingMeta(column) {
  return resolveGroupPath(column).length > 0;
}

function buildTreeFromFlat(columns) {
  const source = cloneColumns(columns);
  const hasExplicitTree = source.some((column) => Array.isArray(column?.children) && column.children.length > 0);
  if (hasExplicitTree) return source;

  const hasMeta = source.some((column) => hasGroupingMeta(column));
  if (!hasMeta) return source;

  const root = [];
  const groupMap = new Map();

  source.forEach((column) => {
    const path = resolveGroupPath(column);
    const leaf = { ...column };
    delete leaf.groupPath;
    delete leaf.group;
    delete leaf.groups;

    let container = root;
    let parentKey = 'root';

    path.forEach((header) => {
      const key = `${parentKey}>${header}`;
      let groupNode = groupMap.get(key);
      if (!groupNode) {
        groupNode = {
          id: `grp-${toIdPart(key) || String(groupMap.size + 1)}`,
          header,
          children: []
        };
        groupMap.set(key, groupNode);
        container.push(groupNode);
      }
      container = groupNode.children;
      parentKey = key;
    });

    container.push(leaf);
  });

  return root;
}

export function normalizeColumns(columns) {
  const next = buildTreeFromFlat(columns);

  function walk(items, parentPath = 'col') {
    return items.map((item, index) => {
      const normalized = { ...item };
      const ownId = toIdPart(normalized.id);
      if (ownId) {
        // Preserve explicit IDs so repeated normalization stays stable.
        normalized.id = ownId;
      } else {
        const rawId = normalized.field || normalized.header || `${parentPath}-${index + 1}`;
        normalized.id = `${toIdPart(parentPath)}-${toIdPart(rawId) || index + 1}`;
      }

      if (Array.isArray(normalized.children) && normalized.children.length > 0) {
        normalized.children = walk(normalized.children, normalized.id);
      }

      return normalized;
    });
  }

  return walk(next);
}

export function collectLeafColumns(columns, parentId = null, groupHeader = null) {
  const leaf = [];
  (Array.isArray(columns) ? columns : []).forEach((column) => {
    if (Array.isArray(column.children) && column.children.length > 0) {
      leaf.push(...collectLeafColumns(column.children, column.id, column.header || groupHeader));
    } else {
      leaf.push({
        ...column,
        parentId,
        groupHeader
      });
    }
  });
  return leaf;
}

export function collectColumnMap(columns) {
  const map = new Map();
  function walk(items, parentId = null) {
    items.forEach((item) => {
      map.set(item.id, { ...item, parentId });
      if (Array.isArray(item.children) && item.children.length > 0) {
        walk(item.children, item.id);
      }
    });
  }
  walk(Array.isArray(columns) ? columns : []);
  return map;
}

function reorderByOrder(items, order) {
  const source = Array.isArray(items) ? items : [];
  const indexById = new Map(source.map((item) => [item.id, item]));
  const result = [];

  (Array.isArray(order) ? order : []).forEach((id) => {
    if (indexById.has(id)) {
      result.push(indexById.get(id));
      indexById.delete(id);
    }
  });

  source.forEach((item) => {
    if (indexById.has(item.id)) result.push(item);
  });

  return result;
}

function mergeOrder(base, current) {
  const baseIds = Array.isArray(base) ? base : [];
  const currentIds = Array.isArray(current) ? current : [];
  const inBase = new Set(baseIds);
  const kept = currentIds.filter((id) => inBase.has(id));
  baseIds.forEach((id) => {
    if (!kept.includes(id)) kept.push(id);
  });
  return kept;
}

function readFixedDefault(column) {
  if (column?.settings && typeof column.settings === 'object'
    && Object.prototype.hasOwnProperty.call(column.settings, 'fixed')) {
    return normalizeFixed(column.settings.fixed);
  }
  if (Object.prototype.hasOwnProperty.call(column || {}, 'fixed')) {
    return normalizeFixed(column.fixed);
  }
  return '';
}

export function createDefaultSettings(columns) {
  const normalized = normalizeColumns(columns);
  const topOrder = normalized.map((column) => column.id);
  const hidden = {};
  const merge = {};
  const fixed = {};
  const childOrder = {};

  function readMergeDefault(column) {
    if (column?.settings && typeof column.settings === 'object'
      && Object.prototype.hasOwnProperty.call(column.settings, 'merge')) {
      return Boolean(column.settings.merge);
    }
    if (Object.prototype.hasOwnProperty.call(column || {}, 'merge')) {
      return Boolean(column.merge);
    }
    return false;
  }

  function walk(items) {
    items.forEach((column) => {
      if (Array.isArray(column.children) && column.children.length > 0) {
        childOrder[column.id] = column.children.map((child) => child.id);
        walk(column.children);
      } else {
        hidden[column.id] = Boolean(column.hidden);
        merge[column.id] = readMergeDefault(column);
        fixed[column.id] = readFixedDefault(column);
      }
    });
  }
  walk(normalized);

  return {
    topOrder,
    childOrder,
    hidden,
    merge,
    fixed,
    groupBy: []
  };
}

export function normalizeSettings(columns, inputSettings) {
  const normalized = normalizeColumns(columns);
  const defaults = createDefaultSettings(normalized);
  const provided = inputSettings && typeof inputSettings === 'object' ? inputSettings : {};

  const hidden = { ...defaults.hidden };
  Object.keys(hidden).forEach((id) => {
    if (Object.prototype.hasOwnProperty.call(provided.hidden || {}, id)) {
      hidden[id] = Boolean(provided.hidden[id]);
    }
  });

  const merge = { ...defaults.merge };
  Object.keys(merge).forEach((id) => {
    if (Object.prototype.hasOwnProperty.call(provided.merge || {}, id)) {
      merge[id] = Boolean(provided.merge[id]);
    }
  });

  const fixed = { ...defaults.fixed };
  Object.keys(fixed).forEach((id) => {
    if (Object.prototype.hasOwnProperty.call(provided.fixed || {}, id)) {
      fixed[id] = normalizeFixed(provided.fixed[id]);
    }
  });

  const childOrder = { ...defaults.childOrder };
  Object.keys(childOrder).forEach((groupId) => {
    childOrder[groupId] = mergeOrder(childOrder[groupId], provided.childOrder?.[groupId]);
  });

  const topOrder = mergeOrder(defaults.topOrder, provided.topOrder);

  const leafIds = new Set(collectLeafColumns(normalized).map((column) => column.id));
  const groupBySource = Array.isArray(provided.groupBy)
    ? provided.groupBy
    : (provided.groupBy ? [provided.groupBy] : []);
  const groupBy = [];
  groupBySource.forEach((columnId) => {
    const nextId = String(columnId || '').trim();
    if (!nextId || !leafIds.has(nextId) || groupBy.includes(nextId)) return;
    groupBy.push(nextId);
  });

  return {
    topOrder,
    childOrder,
    hidden,
    merge,
    fixed,
    groupBy
  };
}

export function applySettingsToColumns(columns, settings) {
  const schema = normalizeColumns(columns);
  const normalizedSettings = normalizeSettings(schema, settings);

  function walk(items, parentId = null) {
    const order = parentId ? normalizedSettings.childOrder[parentId] : normalizedSettings.topOrder;
    const arranged = reorderByOrder(items, order);

    const visible = arranged.map((column) => {
      const next = { ...column };
      if (Array.isArray(next.children) && next.children.length > 0) {
        next.children = walk(next.children, next.id);
        next._isGroup = true;
        next._leafCount = collectLeafColumns(next.children).length;
        next._hidden = next._leafCount === 0;
      } else {
        next._isGroup = false;
        next._hidden = Boolean(normalizedSettings.hidden[next.id]);
        next.merge = Boolean(normalizedSettings.merge?.[next.id]);
        next.fixed = normalizeFixed(normalizedSettings.fixed?.[next.id]);
      }
      return next;
    }).filter((column) => !column._hidden);

    return visible;
  }

  const orderedColumns = walk(schema);
  const leafColumns = collectLeafColumns(orderedColumns);

  return {
    columns: orderedColumns,
    leafColumns,
    settings: normalizedSettings
  };
}

export function moveColumnInSettings(settings, from, to) {
  const next = JSON.parse(JSON.stringify(settings || {}));
  const fromParent = from?.parentId || null;
  const toParent = to?.parentId || null;

  if (fromParent !== toParent) return { changed: false, settings: next };

  const containerPath = fromParent ? ['childOrder', fromParent] : ['topOrder'];
  const order = fromParent
    ? Array.isArray(next.childOrder?.[fromParent]) ? [...next.childOrder[fromParent]] : []
    : Array.isArray(next.topOrder) ? [...next.topOrder] : [];

  const fromIndex = order.indexOf(from.id);
  const toIndex = order.indexOf(to.id);
  if (fromIndex < 0 || toIndex < 0 || fromIndex === toIndex) return { changed: false, settings: next };

  order.splice(fromIndex, 1);
  order.splice(toIndex, 0, from.id);

  if (containerPath.length === 1) {
    next.topOrder = order;
  } else {
    next.childOrder = next.childOrder || {};
    next.childOrder[fromParent] = order;
  }

  return { changed: true, settings: next };
}

export function toggleColumnVisibility(settings, columnId, hidden, schemaMap) {
  const next = JSON.parse(JSON.stringify(settings || {}));
  const column = schemaMap.get(columnId);
  if (!column) return next;

  next.hidden = next.hidden || {};

  if (Array.isArray(column.children) && column.children.length > 0) {
    collectLeafColumns([column]).forEach((leaf) => {
      next.hidden[leaf.id] = hidden;
    });
    return next;
  }

  next.hidden[columnId] = hidden;
  return next;
}

export function isTopLevelOrSameGroup(schemaMap, sourceId, targetId) {
  const source = schemaMap.get(sourceId);
  const target = schemaMap.get(targetId);
  if (!source || !target) return false;

  const sourceParent = source.parentId || null;
  const targetParent = target.parentId || null;
  return sourceParent === targetParent;
}

export function getColumnById(columns, id) {
  return collectLeafColumns(normalizeColumns(columns)).find((column) => column.id === id) || null;
}
