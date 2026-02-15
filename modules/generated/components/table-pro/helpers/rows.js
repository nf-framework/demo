function compareValues(a, b) {
  if (a == null && b == null) return 0;
  if (a == null) return -1;
  if (b == null) return 1;

  if (typeof a === 'number' && typeof b === 'number') return a - b;
  return String(a).localeCompare(String(b), 'ru', { sensitivity: 'base', numeric: true });
}

function toGroupKey(value) {
  if (value == null || value === '') return 'Без значения';
  return String(value);
}

function normalizeGroupByFields(groupBy) {
  const source = Array.isArray(groupBy)
    ? groupBy
    : (groupBy ? [groupBy] : []);

  const unique = [];
  source.forEach((field) => {
    const next = String(field || '').trim();
    if (!next || unique.includes(next)) return;
    unique.push(next);
  });
  return unique;
}

export function buildRowsModel(data, groupBy) {
  const source = Array.isArray(data) ? data : [];
  const rows = source.map((item, index) => {
    if (item && typeof item === 'object' && 'row' in item && 'sourceIndex' in item) {
      const sourceIndex = Number(item.sourceIndex);
      return {
        row: item.row,
        sourceIndex: Number.isInteger(sourceIndex) ? sourceIndex : index
      };
    }
    return { row: item, sourceIndex: index };
  });
  const groupByFields = normalizeGroupByFields(groupBy);

  if (!groupByFields.length) {
    return rows.map(({ row, sourceIndex }) => ({
      kind: 'data',
      row,
      sourceIndex
    }));
  }

  function groupRows(items, level = 0, pathValues = [], pathFields = []) {
    const field = groupByFields[level];
    if (!field) {
      return items.map(({ row, sourceIndex }) => ({
        kind: 'data',
        row,
        sourceIndex
      }));
    }

    const buckets = new Map();
    items.forEach((item) => {
      const raw = item.row?.[field];
      const key = toGroupKey(raw);
      const bucket = buckets.get(key);
      if (bucket) {
        bucket.items.push(item);
      } else {
        buckets.set(key, { key, rawValue: raw, items: [item] });
      }
    });

    const orderedGroups = Array.from(buckets.values()).sort((a, b) => compareValues(a.rawValue, b.rawValue));
    const model = [];

    orderedGroups.forEach((group) => {
      const nextPathValues = [...pathValues, group.key];
      const nextPathFields = [...pathFields, field];

      model.push({
        kind: 'group',
        groupKey: group.key,
        groupField: field,
        groupLevel: level,
        groupPath: nextPathValues,
        groupFieldPath: nextPathFields,
        count: group.items.length,
        rows: group.items.map((item) => item.row)
      });

      if (level >= groupByFields.length - 1) {
        group.items.forEach(({ row, sourceIndex }) => {
          model.push({
            kind: 'data',
            row,
            sourceIndex
          });
        });
      } else {
        model.push(...groupRows(group.items, level + 1, nextPathValues, nextPathFields));
      }
    });

    return model;
  }

  return groupRows(rows, 0, [], []);
}

function nodeKey(value, fallbackIndex) {
  if (value == null || value === '') return `__row_${fallbackIndex}`;
  return String(value);
}

export function buildTreeRowsModel(entries, options = {}) {
  const source = Array.isArray(entries) ? entries : [];
  const keyField = String(options.keyField || 'id').trim() || 'id';
  const pkeyField = String(options.pkeyField || 'parent_id').trim() || 'parent_id';
  const hasChildField = String(options.hasChildField || '_haschildren').trim() || '_haschildren';

  const nodes = [];
  const nodeMap = new Map();

  source.forEach((item, index) => {
    const sourceIndex = Number(item?.sourceIndex);
    const normalizedSourceIndex = Number.isInteger(sourceIndex) ? sourceIndex : index;
    const row = item?.row;
    const key = nodeKey(row?.[keyField], normalizedSourceIndex);
    const parentRaw = row?.[pkeyField];
    const parentKey = parentRaw == null || parentRaw === '' ? '' : String(parentRaw);

    const node = {
      key,
      parentKey,
      row,
      sourceIndex: normalizedSourceIndex,
      order: index,
      children: []
    };

    nodes.push(node);
    nodeMap.set(key, node);
  });

  const roots = [];
  nodes.forEach((node) => {
    if (node.parentKey && node.parentKey !== node.key) {
      const parent = nodeMap.get(node.parentKey);
      if (parent) {
        parent.children.push(node);
        return;
      }
    }
    roots.push(node);
  });

  const result = [];
  const visited = new Set();

  function visit(node, level = 0) {
    if (!node || visited.has(node.key)) return;
    visited.add(node.key);

    const hasChildren = Boolean(node.row?.[hasChildField]) || node.children.length > 0;
    const opened = Object.prototype.hasOwnProperty.call(node.row || {}, '_opened')
      ? Boolean(node.row?._opened)
      : false;

    result.push({
      kind: 'data',
      row: node.row,
      sourceIndex: node.sourceIndex,
      treeLevel: level,
      treeHasChildren: hasChildren,
      treeOpened: opened,
      treeKey: node.key,
      treeParentKey: node.parentKey
    });

    if (!hasChildren || !opened) return;

    node.children
      .slice()
      .sort((a, b) => a.order - b.order)
      .forEach((child) => visit(child, level + 1));
  }

  roots
    .slice()
    .sort((a, b) => a.order - b.order)
    .forEach((root) => visit(root, 0));

  return result;
}

function cellValue(row, field) {
  return row?.[field] ?? '';
}

export function buildMergeMap(rowsModel, mergeColumns) {
  const mergeMap = new Map();
  const mergeList = Array.isArray(mergeColumns) ? mergeColumns : [];
  if (!mergeList.length) return mergeMap;

  mergeList.forEach((column) => {
    const field = column.field;
    if (!field) return;

    let i = 0;
    while (i < rowsModel.length) {
      if (rowsModel[i].kind !== 'data') {
        i += 1;
        continue;
      }

      const baseValue = cellValue(rowsModel[i].row, field);
      if (baseValue === '' || baseValue == null) {
        i += 1;
        continue;
      }

      let j = i + 1;
      while (j < rowsModel.length) {
        if (rowsModel[j].kind !== 'data') break;
        const nextValue = cellValue(rowsModel[j].row, field);
        if (nextValue !== baseValue) break;
        j += 1;
      }

      const rowSpan = j - i;
      if (rowSpan > 1) {
        mergeMap.set(`${i}:${column.id}`, { skip: false, rowSpan });
        for (let k = i + 1; k < j; k += 1) {
          mergeMap.set(`${k}:${column.id}`, { skip: true, rowSpan: 0 });
        }
      }

      i = j;
    }
  });

  return mergeMap;
}
