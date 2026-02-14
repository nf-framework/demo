import test from 'node:test';
import assert from 'node:assert/strict';

import { buildMergeMap, buildRowsModel } from '../components/table-pro/helpers/rows.js';

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
