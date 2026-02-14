function compareValues(a, b) {
  if (a == null && b == null) return 0;
  if (a == null) return -1;
  if (b == null) return 1;

  if (typeof a === 'number' && typeof b === 'number') return a - b;
  return String(a).localeCompare(String(b), 'ru', { sensitivity: 'base', numeric: true });
}

export function buildRowsModel(data, groupByField) {
  const source = Array.isArray(data) ? data : [];
  const rows = source.map((row, sourceIndex) => ({ row, sourceIndex }));

  if (!groupByField) {
    return rows.map(({ row, sourceIndex }) => ({
      kind: 'data',
      row,
      sourceIndex
    }));
  }

  const sorted = [...rows].sort((a, b) => compareValues(a.row[groupByField], b.row[groupByField]));
  const model = [];

  let currentGroup = Symbol('initial');
  let groupStart = -1;

  sorted.forEach(({ row, sourceIndex }, index) => {
    const value = row[groupByField];
    const key = value == null || value === '' ? 'Без значения' : String(value);
    if (key !== currentGroup) {
      model.push({
        kind: 'group',
        groupKey: key,
        groupField: groupByField,
        count: 0,
        rows: []
      });
      groupStart = model.length - 1;
      currentGroup = key;
    }

    model[groupStart].count += 1;
    model[groupStart].rows.push(row);
    model.push({
      kind: 'data',
      row,
      sourceIndex
    });
  });

  return model;
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
