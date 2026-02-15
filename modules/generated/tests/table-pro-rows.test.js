import test from 'node:test';
import assert from 'node:assert/strict';

import { buildMergeMap, buildRowsModel, buildTreeRowsModel } from '../components/table-pro/helpers/rows.js';

test('buildRowsModel returns plain data rows when groupBy is empty', () => {
  const data = [
    { id: 1, env: 'prod' },
    { id: 2, env: 'dev' }
  ];

  const model = buildRowsModel(data, null);
  assert.equal(model.length, 2);
  assert.deepEqual(model.map((item) => item.kind), ['data', 'data']);
  assert.deepEqual(model.map((item) => item.sourceIndex), [0, 1]);
});

test('buildRowsModel preserves sourceIndex for pre-built row entries', () => {
  const sourceRows = [
    { id: 10, env: 'prod' },
    { id: 11, env: 'dev' }
  ];
  const entries = [
    { row: sourceRows[0], sourceIndex: 15 },
    { row: sourceRows[1], sourceIndex: 27 }
  ];

  const model = buildRowsModel(entries, null);
  assert.equal(model.length, 2);
  assert.deepEqual(model.map((item) => item.kind), ['data', 'data']);
  assert.equal(model[0].row, sourceRows[0]);
  assert.equal(model[1].row, sourceRows[1]);
  assert.deepEqual(model.map((item) => item.sourceIndex), [15, 27]);
});

test('buildRowsModel creates grouped rows with counters', () => {
  const data = [
    { id: 1, env: 'prod' },
    { id: 2, env: 'dev' },
    { id: 3, env: 'dev' }
  ];

  const model = buildRowsModel(data, 'env');
  const groups = model.filter((item) => item.kind === 'group');

  assert.equal(groups.length, 2);
  assert.deepEqual(groups.map((item) => item.groupKey), ['dev', 'prod']);
  assert.deepEqual(groups.map((item) => item.count), [2, 1]);
});

test('buildRowsModel supports multi-level grouping with nested group rows', () => {
  const data = [
    { id: 1, priority: 'P1', status: 'В работе', env: 'prod' },
    { id: 2, priority: 'P1', status: 'Готово', env: 'stage' },
    { id: 3, priority: 'P1', status: 'В работе', env: 'stage' },
    { id: 4, priority: 'P2', status: 'Готово', env: 'prod' }
  ];

  const model = buildRowsModel(data, ['priority', 'status', 'env']);
  const groups = model.filter((item) => item.kind === 'group');
  const dataRows = model.filter((item) => item.kind === 'data');

  assert.equal(dataRows.length, data.length);
  assert.ok(groups.some((item) => item.groupField === 'priority' && item.groupKey === 'P1' && item.groupLevel === 0));
  assert.ok(groups.some((item) => item.groupField === 'status' && item.groupKey === 'В работе' && item.groupLevel === 1));
  assert.ok(groups.some((item) => item.groupField === 'env' && item.groupKey === 'prod' && item.groupLevel === 2));
});

test('buildMergeMap merges only contiguous data rows with same value', () => {
  const rowsModel = [
    { kind: 'data', row: { portfolio: 'Core', env: 'prod' }, sourceIndex: 0 },
    { kind: 'data', row: { portfolio: 'Core', env: 'prod' }, sourceIndex: 1 },
    { kind: 'data', row: { portfolio: 'Apps', env: 'prod' }, sourceIndex: 2 }
  ];

  const mergeMap = buildMergeMap(rowsModel, [{ id: 'portfolio', field: 'portfolio' }]);

  assert.deepEqual(mergeMap.get('0:portfolio'), { skip: false, rowSpan: 2 });
  assert.deepEqual(mergeMap.get('1:portfolio'), { skip: true, rowSpan: 0 });
  assert.equal(mergeMap.has('2:portfolio'), false);
});

test('buildMergeMap does not merge across group rows', () => {
  const rowsModel = [
    { kind: 'group', groupKey: 'dev', count: 2 },
    { kind: 'data', row: { portfolio: 'Core', env: 'dev' }, sourceIndex: 0 },
    { kind: 'data', row: { portfolio: 'Core', env: 'dev' }, sourceIndex: 1 },
    { kind: 'group', groupKey: 'prod', count: 1 },
    { kind: 'data', row: { portfolio: 'Core', env: 'prod' }, sourceIndex: 2 }
  ];

  const mergeMap = buildMergeMap(rowsModel, [{ id: 'portfolio', field: 'portfolio' }]);

  assert.deepEqual(mergeMap.get('1:portfolio'), { skip: false, rowSpan: 2 });
  assert.deepEqual(mergeMap.get('2:portfolio'), { skip: true, rowSpan: 0 });
  assert.equal(mergeMap.has('4:portfolio'), false);
});

test('buildTreeRowsModel builds visible tree rows when parent nodes are explicitly opened', () => {
  const entries = [
    { sourceIndex: 0, row: { id: 10, parent_id: null, name: 'Root A', _haschildren: true, _opened: true } },
    { sourceIndex: 1, row: { id: 11, parent_id: 10, name: 'Child A-1', _haschildren: false } },
    { sourceIndex: 2, row: { id: 12, parent_id: 10, name: 'Child A-2', _haschildren: false } },
    { sourceIndex: 3, row: { id: 20, parent_id: null, name: 'Root B', _haschildren: false } }
  ];

  const model = buildTreeRowsModel(entries, {
    keyField: 'id',
    pkeyField: 'parent_id',
    hasChildField: '_haschildren'
  });

  assert.deepEqual(model.map((item) => item.row.name), ['Root A', 'Child A-1', 'Child A-2', 'Root B']);
  assert.deepEqual(model.map((item) => item.treeLevel), [0, 1, 1, 0]);
});

test('buildTreeRowsModel keeps children hidden when _opened is not specified', () => {
  const entries = [
    { sourceIndex: 0, row: { id: 10, parent_id: null, name: 'Root A', _haschildren: true } },
    { sourceIndex: 1, row: { id: 11, parent_id: 10, name: 'Child A-1', _haschildren: false } },
    { sourceIndex: 2, row: { id: 20, parent_id: null, name: 'Root B', _haschildren: false } }
  ];

  const model = buildTreeRowsModel(entries, {
    keyField: 'id',
    pkeyField: 'parent_id',
    hasChildField: '_haschildren'
  });

  assert.deepEqual(model.map((item) => item.row.name), ['Root A', 'Root B']);
  assert.deepEqual(model.map((item) => item.treeLevel), [0, 0]);
});

test('buildTreeRowsModel hides children when parent is collapsed', () => {
  const entries = [
    { sourceIndex: 0, row: { id: 10, parent_id: null, name: 'Root A', _haschildren: true, _opened: false } },
    { sourceIndex: 1, row: { id: 11, parent_id: 10, name: 'Child A-1', _haschildren: false } },
    { sourceIndex: 2, row: { id: 20, parent_id: null, name: 'Root B', _haschildren: false } }
  ];

  const model = buildTreeRowsModel(entries, {
    keyField: 'id',
    pkeyField: 'parent_id',
    hasChildField: '_haschildren'
  });

  assert.deepEqual(model.map((item) => item.row.name), ['Root A', 'Root B']);
  assert.deepEqual(model.map((item) => item.treeLevel), [0, 0]);
});
