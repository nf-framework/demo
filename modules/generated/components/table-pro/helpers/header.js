function hasChildren(column) {
  return Array.isArray(column?.children) && column.children.length > 0;
}

export function getColumnDepth(column) {
  if (!hasChildren(column)) return 1;
  return 1 + Math.max(...column.children.map((child) => getColumnDepth(child)));
}

export function getHeaderDepth(columns) {
  const source = Array.isArray(columns) ? columns : [];
  if (!source.length) return 1;
  return Math.max(...source.map((column) => getColumnDepth(column)));
}

export function countLeafColumns(column) {
  if (!hasChildren(column)) return 1;
  return column.children.reduce((sum, child) => sum + countLeafColumns(child), 0);
}

export function buildHeaderMatrix(columns) {
  const source = Array.isArray(columns) ? columns : [];
  const depth = getHeaderDepth(source);
  const rows = Array.from({ length: depth }, () => []);

  function walk(items, level) {
    items.forEach((column) => {
      if (hasChildren(column)) {
        rows[level].push({
          column,
          isGroup: true,
          rowSpan: 1,
          colSpan: countLeafColumns(column)
        });
        walk(column.children, level + 1);
      } else {
        rows[level].push({
          column,
          isGroup: false,
          rowSpan: depth - level,
          colSpan: 1
        });
      }
    });
  }

  walk(source, 0);
  return rows;
}
