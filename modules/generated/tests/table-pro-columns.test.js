import test from 'node:test';
import assert from 'node:assert/strict';

import {
  applySettingsToColumns,
  collectColumnMap,
  collectLeafColumns,
  createDefaultSettings,
  isTopLevelOrSameGroup,
  moveColumnInSettings,
  normalizeColumns,
  normalizeSettings,
  toggleColumnVisibility
} from '../components/table-pro/helpers/columns.js';

function makeColumns() {
  return [
    { id: 'system', field: 'system', header: 'System' },
    {
      id: 'team',
      header: 'Team',
      children: [
        { id: 'owner', field: 'owner', header: 'Owner' },
        { id: 'squad', field: 'squad', header: 'Squad' }
      ]
    },
    {
      id: 'metrics',
      header: 'Metrics',
      children: [
        { id: 'errors', field: 'errors', header: 'Errors' },
        { id: 'latency', field: 'latency', header: 'Latency' }
      ]
    },
    { id: 'status', field: 'status', header: 'Status' }
  ];
}

test('toggleColumnVisibility hides full group and removes it from applied columns', () => {
  const schema = normalizeColumns(makeColumns());
  const map = collectColumnMap(schema);
  const group = schema.find((column) => column.header === 'Team');

  const base = createDefaultSettings(schema);
  const next = normalizeSettings(schema, toggleColumnVisibility(base, group.id, true, map));

  const teamChildren = group.children.map((child) => child.id);
  teamChildren.forEach((id) => assert.equal(next.hidden[id], true));

  const applied = applySettingsToColumns(schema, next);
  assert.equal(applied.columns.some((column) => column.id === group.id), false);
});

test('toggleColumnVisibility hides one leaf only', () => {
  const schema = normalizeColumns(makeColumns());
  const map = collectColumnMap(schema);
  const leaf = collectLeafColumns(schema).find((column) => column.field === 'owner');

  const base = createDefaultSettings(schema);
  const next = normalizeSettings(schema, toggleColumnVisibility(base, leaf.id, true, map));
  assert.equal(next.hidden[leaf.id], true);

  const applied = applySettingsToColumns(schema, next);
  const visibleLeafIds = applied.leafColumns.map((column) => column.id);
  assert.equal(visibleLeafIds.includes(leaf.id), false);
});

test('moveColumnInSettings moves top-level column order', () => {
  const schema = normalizeColumns(makeColumns());
  const settings = createDefaultSettings(schema);
  const first = settings.topOrder[0];
  const last = settings.topOrder[settings.topOrder.length - 1];

  const moved = moveColumnInSettings(
    settings,
    { id: first, parentId: null },
    { id: last, parentId: null }
  );

  assert.equal(moved.changed, true);
  assert.equal(moved.settings.topOrder[moved.settings.topOrder.length - 1], first);
});

test('moveColumnInSettings moves child only inside same group', () => {
  const schema = normalizeColumns(makeColumns());
  const settings = createDefaultSettings(schema);
  const teamGroup = schema.find((column) => column.header === 'Team');
  const metricsGroup = schema.find((column) => column.header === 'Metrics');

  const [teamFirst, teamSecond] = settings.childOrder[teamGroup.id];
  const [metricsFirst] = settings.childOrder[metricsGroup.id];

  const withinGroup = moveColumnInSettings(
    settings,
    { id: teamFirst, parentId: teamGroup.id },
    { id: teamSecond, parentId: teamGroup.id }
  );

  assert.equal(withinGroup.changed, true);
  assert.deepEqual(withinGroup.settings.childOrder[teamGroup.id], [teamSecond, teamFirst]);

  const crossGroup = moveColumnInSettings(
    settings,
    { id: teamFirst, parentId: teamGroup.id },
    { id: metricsFirst, parentId: metricsGroup.id }
  );

  assert.equal(crossGroup.changed, false);
});

test('normalizeSettings keeps groupBy only for existing leaf columns', () => {
  const schema = normalizeColumns(makeColumns());
  const leaf = collectLeafColumns(schema).find((column) => column.field === 'status');

  const invalid = normalizeSettings(schema, { groupBy: 'missing-column' });
  assert.equal(invalid.groupBy, null);

  const valid = normalizeSettings(schema, { groupBy: leaf.id });
  assert.equal(valid.groupBy, leaf.id);
});

test('isTopLevelOrSameGroup allows only same parent container', () => {
  const schema = normalizeColumns(makeColumns());
  const map = collectColumnMap(schema);
  const team = schema.find((column) => column.header === 'Team');
  const metrics = schema.find((column) => column.header === 'Metrics');

  const teamOwner = team.children.find((column) => column.field === 'owner');
  const teamSquad = team.children.find((column) => column.field === 'squad');
  const metricsErrors = metrics.children.find((column) => column.field === 'errors');

  assert.equal(isTopLevelOrSameGroup(map, teamOwner.id, teamSquad.id), true);
  assert.equal(isTopLevelOrSameGroup(map, teamOwner.id, metricsErrors.id), false);
  assert.equal(isTopLevelOrSameGroup(map, team.id, metrics.id), true);
});

test('normalizeColumns builds tree from flat columns with groupPath metadata', () => {
  const schema = normalizeColumns([
    { id: 'portfolio', field: 'portfolio', header: 'Портфель' },
    { id: 'jan', field: 'jan_k', header: 'Янв', groupPath: ['Q1', 'Январь'] },
    { id: 'feb', field: 'feb_k', header: 'Фев', groupPath: ['Q1', 'Февраль'] },
    { id: 'apr', field: 'apr_k', header: 'Апр', groupPath: 'Q2/Апрель' }
  ]);

  const q1 = schema.find((column) => column.header === 'Q1');
  const q2 = schema.find((column) => column.header === 'Q2');
  const portfolio = schema.find((column) => column.field === 'portfolio');

  assert.ok(portfolio);
  assert.ok(q1);
  assert.ok(q2);
  assert.equal(Array.isArray(q1.children), true);
  assert.equal(q1.children.length, 2);
  assert.equal(q1.children[0].children.length, 1);
  assert.equal(q1.children[1].children.length, 1);
});
