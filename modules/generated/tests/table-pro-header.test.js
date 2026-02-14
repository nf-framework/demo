import test from 'node:test';
import assert from 'node:assert/strict';

import {
  buildHeaderMatrix,
  countLeafColumns,
  getColumnDepth,
  getHeaderDepth
} from '../components/table-pro/helpers/header.js';

const deepColumns = [
  { id: 'service', field: 'service', header: 'Сервис' },
  {
    id: 'delivery',
    header: 'Поставка',
    children: [
      {
        id: 'q1',
        header: 'Q1',
        children: [
          { id: 'jan_plan', field: 'jan_plan', header: 'Янв план' },
          { id: 'jan_fact', field: 'jan_fact', header: 'Янв факт' }
        ]
      },
      {
        id: 'q2',
        header: 'Q2',
        children: [
          {
            id: 'apr',
            header: 'Апрель',
            children: [
              { id: 'apr_plan', field: 'apr_plan', header: 'План' },
              { id: 'apr_fact', field: 'apr_fact', header: 'Факт' }
            ]
          }
        ]
      }
    ]
  }
];

test('header helpers support deep nesting', () => {
  assert.equal(getColumnDepth(deepColumns[0]), 1);
  assert.equal(getColumnDepth(deepColumns[1]), 4);
  assert.equal(getHeaderDepth(deepColumns), 4);
  assert.equal(countLeafColumns(deepColumns[1]), 4);
});

test('buildHeaderMatrix builds row/col spans for mixed depth tree', () => {
  const matrix = buildHeaderMatrix(deepColumns);
  assert.equal(matrix.length, 4);

  const row0 = matrix[0].map((cell) => ({ id: cell.column.id, rowSpan: cell.rowSpan, colSpan: cell.colSpan }));
  assert.deepEqual(row0, [
    { id: 'service', rowSpan: 4, colSpan: 1 },
    { id: 'delivery', rowSpan: 1, colSpan: 4 }
  ]);

  const row1 = matrix[1].map((cell) => ({ id: cell.column.id, rowSpan: cell.rowSpan, colSpan: cell.colSpan }));
  assert.deepEqual(row1, [
    { id: 'q1', rowSpan: 1, colSpan: 2 },
    { id: 'q2', rowSpan: 1, colSpan: 2 }
  ]);

  const row2 = matrix[2].map((cell) => ({ id: cell.column.id, rowSpan: cell.rowSpan, colSpan: cell.colSpan }));
  assert.deepEqual(row2, [
    { id: 'jan_plan', rowSpan: 2, colSpan: 1 },
    { id: 'jan_fact', rowSpan: 2, colSpan: 1 },
    { id: 'apr', rowSpan: 1, colSpan: 2 }
  ]);

  const row3 = matrix[3].map((cell) => ({ id: cell.column.id, rowSpan: cell.rowSpan, colSpan: cell.colSpan }));
  assert.deepEqual(row3, [
    { id: 'apr_plan', rowSpan: 1, colSpan: 1 },
    { id: 'apr_fact', rowSpan: 1, colSpan: 1 }
  ]);
});
