import { PlElement, html, css, TemplateInstance } from 'polylib';
import '@plcmp/pl-button';
import '@plcmp/pl-icon-button';
import '@plcmp/pl-iconset-default';
import '@plcmp/pl-input';
import '@plcmp/pl-flex-layout';
import '@plcmp/pl-datetime';
import '@plcmp/pl-combobox';
import '@plcmp/pl-checkbox';
import '@plcmp/pl-textarea';
import { PlaceHolder } from '@plcmp/utils';

import '/generated/components/table-pro/pl-table-settings.js';
import '/generated/components/pl-table-pro-column.js';

import { applySettingsToColumns, normalizeFixed } from '/generated/components/table-pro/helpers/columns.js';
import { buildMergeMap, buildRowsModel, buildTreeRowsModel } from '/generated/components/table-pro/helpers/rows.js';
import { buildHeaderMatrix } from '/generated/components/table-pro/helpers/header.js';

function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function formatValue(column, row) {
  if (!column?.field) return '';
  const value = row?.[column.field];
  if (value == null) return '';

  if (column.kind === 'date') {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return String(value);
    const dd = String(date.getDate()).padStart(2, '0');
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const yyyy = date.getFullYear();
    const hh = String(date.getHours()).padStart(2, '0');
    const mi = String(date.getMinutes()).padStart(2, '0');

    if (column.format === 'DD.MM.YYYY HH:mm') return `${dd}.${mm}.${yyyy} ${hh}:${mi}`;
    return `${dd}.${mm}.${yyyy}`;
  }

  return String(value);
}

function normalizeBoolean(value) {
  if (value === true || value === false) return value;
  if (value == null) return false;
  if (typeof value === 'number') return value !== 0;
  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase();
    if (!normalized) return false;
    if (['1', 'true', 't', 'yes', 'y', 'on', 'да'].includes(normalized)) return true;
    if (['0', 'false', 'f', 'no', 'n', 'off', 'нет'].includes(normalized)) return false;
  }
  return Boolean(value);
}

function getByPath(source, path) {
  if (!path) return source;
  const parts = String(path).split('.').filter(Boolean);
  let current = source;
  for (let i = 0; i < parts.length; i += 1) {
    if (current == null) return undefined;
    current = current[parts[i]];
  }
  return current;
}

function setByPath(target, path, value) {
  const parts = String(path || '').split('.').filter(Boolean);
  if (parts.length === 0) return;
  let current = target;
  for (let i = 0; i < parts.length - 1; i += 1) {
    const key = parts[i];
    if (current[key] == null || typeof current[key] !== 'object') current[key] = {};
    current = current[key];
  }
  current[parts[parts.length - 1]] = value;
}

function createTemplateScopeContext(scope = {}) {
  const ctx = { ...scope };
  Object.defineProperty(ctx, '_em', {
    value: {},
    writable: true,
    enumerable: false
  });
  Object.defineProperties(ctx, {
    hasProp: {
      value(name) {
        return name in ctx;
      }
    },
    get: {
      value(path) {
        return getByPath(ctx, path);
      }
    },
    set: {
      value(path, value) {
        setByPath(ctx, path, value);
      }
    },
    addEffect: {
      value(path, effect) {
        if (!path || typeof effect !== 'function') return;
        if (!Array.isArray(ctx._em[path])) ctx._em[path] = [];
        ctx._em[path].push(effect);
      }
    }
  });
  return ctx;
}

const DETAIL_STATUS_OPTIONS = [
  { value: 'Стабильно', text: 'Стабильно' },
  { value: 'На контроле', text: 'На контроле' },
  { value: 'Риск', text: 'Риск' }
];

const DETAIL_DIRECTION_OPTIONS = [
  { value: 'Платформа', text: 'Платформа' },
  { value: 'Клиентские приложения', text: 'Клиентские приложения' },
  { value: 'Платформа данных', text: 'Платформа данных' },
  { value: 'DevOps', text: 'DevOps' },
  { value: 'QA', text: 'QA' }
];

class PlTablePro extends PlElement {
  static properties = {
    columns: { type: Array, value: () => [], observer: '_stateChanged' },
    data: { type: Array, value: () => [], observer: '_stateChanged' },
    selected: { type: Object, value: null, observer: '_selectedChanged' },
    selectedList: { type: Array, value: () => [], observer: '_selectedListChanged' },
    multiSelect: { type: Boolean, value: false, observer: '_stateChanged' },
    tree: { type: Boolean, value: false, observer: '_stateChanged' },
    keyField: { type: String, value: 'id' },
    pkeyField: { type: String, value: 'parent_id' },
    hasChildField: { type: String, value: '_haschildren' },
    sortState: { type: Object, value: null, observer: '_stateChanged' },
    columnWidths: { type: Object, value: () => ({}), observer: '_stateChanged' },
    settings: { type: Object, value: null, observer: '_stateChanged' },
    settingsKey: { type: String, observer: '_stateChanged' },
    enableSettings: { type: Boolean, value: true, observer: '_settingsUiChanged' },
    masterDetail: { type: Boolean, value: false, observer: '_stateChanged' },
    inlineEdit: { type: Boolean, value: false, observer: '_stateChanged' },
    rowKeyField: { type: String, value: 'id' },
    detailFields: { type: Array, value: () => [] },
    groupRowTemplate: { type: Object, value: null },
    detailVariant: { type: String, value: '' },
    _settingsOpen: { type: Boolean, value: false, observer: '_settingsUiChanged' },
    _expandedKey: { type: String, value: '', observer: '_stateChanged' },
    _editingCell: { type: Object, value: null, observer: '_stateChanged' }
  };

  static css = css`
    :host {
      display: block;
      width: 100%;
      height: 100%;
      min-width: 0;
      min-height: 0;
      color: var(--pl-text-color);
      background: var(--pl-background-color);
      border: 1px solid var(--pl-grey-light);
      border-radius: var(--pl-border-radius);
      position: relative;
      overflow: hidden;
      box-sizing: border-box;
    }

    .shell {
      width: 100%;
      height: 100%;
      min-height: 0;
      display: flex;
      flex-direction: column;
      box-sizing: border-box;
    }

    .toolbar {
      min-height: var(--pl-base-size);
      border-bottom: 1px solid var(--pl-grey-light);
      background: var(--pl-background-color);
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 6px 8px;
      box-sizing: border-box;
    }

    .toolbar slot[name="top-toolbar"]::slotted(*) {
      width: 100%;
    }

    .toolbar-spacer {
      margin-inline-start: auto;
    }

    .table-host {
      flex: 1;
      min-height: 0;
      min-width: 0;
      overflow: auto;
      background: var(--pl-background-color);
    }

    .legacy-host {
      min-width: max-content;
      min-height: 100%;
      display: block;
    }

    table {
      width: max-content;
      min-width: 100%;
      border-collapse: separate;
      border-spacing: 0;
      table-layout: fixed;
    }

    thead {
      position: sticky;
      top: 0;
      z-index: 5;
    }

    thead th {
      position: relative;
      background: var(--pl-grey-lightest);
      border-bottom: 1px solid var(--pl-grey-light);
      border-right: 1px solid var(--pl-grey-light);
      color: var(--text-secondary-black);
      font: var(--pl-header-font);
      text-align: left;
      white-space: nowrap;
      padding: var(--pl-space-sm);
      box-sizing: border-box;
      min-height: var(--pl-base-size);
    }

    .th-inner {
      display: flex;
      align-items: center;
      gap: 6px;
      min-width: 0;
    }

    .th-label {
      min-width: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      flex: 1;
    }

    .sort-btn {
      flex: 0 0 auto;
      border: 0;
      padding: 0;
      margin: 0;
      width: 18px;
      height: 18px;
      border-radius: 4px;
      font: var(--pl-header-font);
      color: var(--text-secondary-black);
      background: transparent;
      cursor: pointer;
      line-height: 1;
    }

    .sort-btn:hover {
      background: transparent;
      color: var(--pl-text-color);
    }

    .header-resizer {
      position: absolute;
      top: 0;
      right: 0;
      width: 6px;
      height: 100%;
      cursor: col-resize;
      user-select: none;
    }

    .header-resizer:hover {
      box-shadow: inset -2px 0 0 var(--pl-primary-base);
    }

    thead tr.filter-row th {
      padding: 6px 8px;
      height: auto;
      background: var(--pl-grey-lightest);
      border-top: 1px solid var(--pl-grey-light);
      vertical-align: middle;
    }

    .filter-cell-content {
      display: flex;
      align-items: center;
      min-width: 0;
      width: 100%;
    }

    .filter-cell-content > * {
      width: 100%;
      min-width: 0;
    }

    thead th.group {
      text-align: center;
      font-weight: 700;
    }

    thead th:last-child:not(.fixed-right),
    tbody td:last-child:not(.fixed-right),
    tfoot td:last-child:not(.fixed-right) {
      border-right: 0;
    }

    tbody td {
      border-bottom: 1px solid var(--pl-grey-light);
      border-right: 1px solid var(--pl-grey-light);
      padding: var(--pl-space-xs) var(--pl-space-sm);
      box-sizing: border-box;
      font: var(--pl-text-font);
      color: var(--pl-text-color);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      height: var(--pl-table-cell-height, var(--pl-base-size));
      background: var(--pl-background-color);
      transition: background .16s ease-out;
    }

    tfoot td {
      position: sticky;
      bottom: 0;
      z-index: 4;
      border-top: 1px solid var(--pl-grey-light);
      border-right: 1px solid var(--pl-grey-light);
      padding: var(--pl-space-xs) var(--pl-space-sm);
      box-sizing: border-box;
      font: var(--pl-header-font);
      color: var(--pl-header-color);
      background: var(--pl-grey-lightest);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      height: var(--pl-base-size);
    }

    .fixed-cell {
      background-clip: padding-box;
    }

    .fixed-cell.fixed-left {
      box-shadow: inset -1px 0 0 var(--pl-grey-base);
    }

    .fixed-cell.fixed-right {
      box-shadow:
        inset 1px 0 0 var(--pl-grey-base),
        inset -1px 0 0 var(--pl-grey-base);
    }

    thead th.fixed-cell {
      z-index: 12;
    }

    tbody td.fixed-cell {
      z-index: 4;
    }

    tfoot td.fixed-cell {
      z-index: 10;
    }

    thead th.action-cell {
      z-index: 14;
    }

    tbody td.action-cell {
      z-index: 6;
    }

    tfoot td.action-cell {
      z-index: 12;
    }

    tbody tr.data-row.row-even td {
      background: var(--pl-background-color);
    }

    tbody tr.data-row.row-odd td {
      background: var(--pl-background-color);
    }

    tbody tr.data-row:hover td {
      background: var(--pl-primary-lightest);
    }

    tbody tr.data-row.merge-hover td {
      background: var(--pl-primary-lightest);
    }

    tbody tr.data-row.selected td {
      background: var(--pl-primary-lightest);
      box-shadow: inset 0 0 0 1px var(--pl-primary-light);
    }

    .align-right {
      text-align: right;
    }

    .align-center {
      text-align: center;
    }

    .align-left {
      text-align: left;
    }

    .valign-top {
      vertical-align: top;
    }

    .valign-middle {
      vertical-align: middle;
    }

    .valign-bottom {
      vertical-align: bottom;
    }

    th.select-col,
    td.select-col {
      width: 44px;
      min-width: 44px;
      max-width: 44px;
      text-align: center;
      padding: 0 6px;
    }

    th.select-col pl-checkbox,
    td.select-col pl-checkbox {
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }

    .tree-cell {
      display: flex;
      align-items: center;
      min-width: 0;
      width: 100%;
      gap: 4px;
    }

    .tree-indent {
      flex: 0 0 auto;
      width: var(--tree-indent, 0px);
    }

    .tree-toggle,
    .tree-spacer {
      flex: 0 0 20px;
      width: 20px;
      min-width: 20px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }

    .tree-value {
      min-width: 0;
      flex: 1;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .group-row td {
      padding: 0;
      border-bottom: 1px solid var(--pl-grey-light);
      background: transparent;
      position: sticky;
      top: var(--pl-group-row-top, 0px);
      z-index: 8;
    }

    .group-row-inner {
      position: relative;
      left: 0;
      z-index: 9;
      width: var(--pl-group-row-width, 100%);
      min-width: var(--pl-group-row-width, 100%);
      max-width: var(--pl-group-row-width, 100%);
      transform: translate3d(var(--pl-group-row-offset, 0px), 0, 0);
      will-change: transform;
      box-sizing: border-box;
      padding: 8px 10px;
      background: var(--pl-grey-lightest);
      font-weight: 700;
      color: var(--pl-header-color);
      overflow: hidden;
    }

    .placeholder-row td {
      text-align: center;
      font: var(--pl-text-font);
      color: var(--pl-grey-darkest);
      background: var(--pl-grey-lightest);
      font-style: italic;
    }

    .group-row .group-count {
      margin-inline-start: 8px;
      color: var(--pl-grey-darkest);
      font-weight: 500;
      font-size: 12px;
    }

    .group-cell {
      display: flex;
      align-items: center;
      gap: 8px;
      min-height: 18px;
      min-width: 0;
    }

    .group-key {
      min-width: 0;
      font: var(--pl-header-font);
      font-weight: 700;
      color: var(--pl-header-color);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .group-field {
      display: inline-flex;
      align-items: center;
      height: 20px;
      padding: 0 8px;
      border-radius: 999px;
      border: 1px solid var(--pl-grey-light);
      background: var(--pl-background-color);
      font: var(--pl-text-font);
      font-size: 12px;
      color: var(--pl-header-color);
      flex-shrink: 0;
    }

    .group-count-pill {
      margin-inline-start: auto;
      display: inline-flex;
      align-items: center;
      height: 20px;
      padding: 0 8px;
      border-radius: 999px;
      border: 1px solid var(--pl-grey-light);
      background: var(--pl-background-color);
      font: var(--pl-text-font);
      font-size: 12px;
      color: var(--pl-grey-darkest);
      flex-shrink: 0;
    }

    .group-template {
      display: flex;
      align-items: center;
      gap: 8px;
      min-width: 0;
    }

    .group-template-main {
      min-width: 0;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .group-template-meta {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      flex-wrap: wrap;
      margin-inline-start: auto;
    }

    .group-template-pill {
      display: inline-flex;
      align-items: center;
      height: 20px;
      padding: 0 8px;
      border-radius: 999px;
      border: 1px solid var(--pl-grey-light);
      background: var(--pl-background-color);
      font: var(--pl-text-font);
      font-size: 12px;
      color: var(--pl-grey-darkest);
      white-space: nowrap;
    }

    .group-template-pill.ok {
      color: var(--pl-table-pro-pill-ok-color, var(--pl-header-color));
      border-color: var(--pl-table-pro-pill-ok-border, var(--pl-grey-light));
      background: var(--pl-table-pro-pill-ok-bg, var(--pl-background-color));
    }

    .group-template-pill.warn {
      color: var(--pl-table-pro-pill-warn-color, var(--pl-header-color));
      border-color: var(--pl-table-pro-pill-warn-border, var(--pl-grey-light));
      background: var(--pl-table-pro-pill-warn-bg, var(--pl-background-color));
    }

    .group-template-pill.bad {
      color: var(--pl-table-pro-pill-bad-color, var(--pl-header-color));
      border-color: var(--pl-table-pro-pill-bad-border, var(--pl-grey-light));
      background: var(--pl-table-pro-pill-bad-bg, var(--pl-background-color));
    }

    .group-template-pill.info {
      color: var(--pl-table-pro-pill-info-color, var(--pl-header-color));
      border-color: var(--pl-table-pro-pill-info-border, var(--pl-grey-light));
      background: var(--pl-table-pro-pill-info-bg, var(--pl-background-color));
    }

    .cell-pill {
      display: inline-flex;
      align-items: center;
      max-width: 100%;
      height: 22px;
      padding: 0 10px;
      box-sizing: border-box;
      border-radius: 999px;
      border: 1px solid var(--pl-grey-light);
      background: var(--pl-grey-lightest);
      color: var(--pl-header-color);
      font: var(--pl-text-font);
      font-size: 12px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .cell-pill.ok {
      color: var(--pl-table-pro-pill-ok-color, var(--pl-header-color));
      border-color: var(--pl-table-pro-pill-ok-border, var(--pl-grey-light));
      background: var(--pl-table-pro-pill-ok-bg, var(--pl-grey-lightest));
    }

    .cell-pill.warn {
      color: var(--pl-table-pro-pill-warn-color, var(--pl-header-color));
      border-color: var(--pl-table-pro-pill-warn-border, var(--pl-grey-light));
      background: var(--pl-table-pro-pill-warn-bg, var(--pl-grey-lightest));
    }

    .cell-pill.bad {
      color: var(--pl-table-pro-pill-bad-color, var(--pl-header-color));
      border-color: var(--pl-table-pro-pill-bad-border, var(--pl-grey-light));
      background: var(--pl-table-pro-pill-bad-bg, var(--pl-grey-lightest));
    }

    .cell-pill.info {
      color: var(--pl-table-pro-pill-info-color, var(--pl-header-color));
      border-color: var(--pl-table-pro-pill-info-border, var(--pl-grey-light));
      background: var(--pl-table-pro-pill-info-bg, var(--pl-grey-lightest));
    }

    td.editable-cell {
      cursor: pointer;
    }

    td.inline-editing {
      padding: 4px 6px;
      white-space: normal;
      overflow: visible;
      text-overflow: clip;
      background: var(--pl-grey-lightest);
    }

    .inline-edit-wrap {
      display: flex;
      align-items: center;
      gap: 4px;
      width: 100%;
      min-width: 0;
      overflow: hidden;
    }

    .inline-edit-field {
      flex: 1;
      min-width: 0;
    }

    .inline-edit-field pl-input,
    .inline-edit-field pl-datetime,
    .inline-edit-field pl-combobox,
    .inline-edit-field pl-textarea {
      width: 100%;
      --pl-content-width: 100%;
    }

    .inline-edit-field pl-checkbox {
      display: flex;
      align-items: center;
      height: var(--pl-base-size);
      padding-inline-start: 4px;
    }

    .inline-edit-field pl-combobox {
      min-width: 0;
      flex-shrink: 1;
      --pl-content-width: 100%;
    }

    .inline-edit-actions {
      display: inline-flex;
      align-items: center;
      gap: 2px;
      flex-shrink: 0;
    }

    .expander-col {
      width: 42px;
      min-width: 42px;
      max-width: 42px;
      text-align: center;
      padding: 0;
    }

    .detail-row td {
      padding: 0;
      background: var(--pl-grey-lightest);
    }

    .detail-shell {
      padding: 10px;
      border-top: 1px dashed var(--pl-grey-base);
      animation: detail-enter .16s ease-out;
    }

    @keyframes detail-enter {
      from { opacity: 0; transform: translateY(-4px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .detail-form {
      width: 100%;
      gap: 8px;
    }

    .detail-form pl-input {
      min-width: 210px;
      flex: 1;
    }

    .detail-form.rich {
      gap: 10px;
    }

    .detail-head {
      display: grid;
      grid-template-columns: minmax(220px, 1fr) auto;
      align-items: center;
      gap: 10px;
      padding: 10px 12px;
      border: 1px solid var(--pl-grey-light);
      border-radius: var(--pl-border-radius);
      background: var(--pl-background-color);
    }

    .detail-title {
      min-width: 0;
    }

    .detail-name {
      font: var(--pl-header-font);
      color: var(--pl-header-color);
      font-weight: 700;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .detail-sub {
      margin-top: 2px;
      font: var(--pl-text-font);
      color: var(--pl-grey-darkest);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .detail-tags {
      display: flex;
      flex-wrap: wrap;
      justify-content: flex-end;
      gap: 6px;
    }

    .detail-pill {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      min-height: 22px;
      border-radius: 999px;
      padding: 0 10px;
      border: 1px solid transparent;
      font: var(--pl-text-font);
      font-size: 12px;
      line-height: 1;
      white-space: nowrap;
      box-sizing: border-box;
      color: var(--pl-header-color);
      background: var(--pl-grey-lightest);
    }

    .detail-pill.ok {
      color: var(--pl-table-pro-pill-ok-color, var(--pl-header-color));
      background: var(--pl-table-pro-pill-ok-bg, var(--pl-grey-lightest));
      border-color: var(--pl-table-pro-pill-ok-border, var(--pl-grey-light));
    }

    .detail-pill.warn {
      color: var(--pl-table-pro-pill-warn-color, var(--pl-header-color));
      background: var(--pl-table-pro-pill-warn-bg, var(--pl-grey-lightest));
      border-color: var(--pl-table-pro-pill-warn-border, var(--pl-grey-light));
    }

    .detail-pill.bad {
      color: var(--pl-table-pro-pill-bad-color, var(--pl-header-color));
      background: var(--pl-table-pro-pill-bad-bg, var(--pl-grey-lightest));
      border-color: var(--pl-table-pro-pill-bad-border, var(--pl-grey-light));
    }

    .detail-pill.info {
      color: var(--pl-table-pro-pill-info-color, var(--pl-header-color));
      background: var(--pl-table-pro-pill-info-bg, var(--pl-grey-lightest));
      border-color: var(--pl-table-pro-pill-info-border, var(--pl-grey-light));
    }

    .detail-pill.neutral {
      color: var(--pl-grey-darkest);
      background: var(--pl-grey-lightest);
      border-color: var(--pl-grey-light);
    }

    .detail-metrics {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 8px;
    }

    .metric {
      border: 1px solid var(--pl-grey-light);
      border-radius: var(--pl-border-radius);
      background: var(--pl-background-color);
      padding: 8px 10px;
      box-sizing: border-box;
      min-height: 68px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      gap: 2px;
      box-shadow: none;
    }

    .metric.ok {
      border-color: var(--pl-table-pro-pill-ok-border, var(--pl-grey-light));
      background: var(--pl-table-pro-pill-ok-bg, var(--pl-background-color));
    }

    .metric.warn {
      border-color: var(--pl-table-pro-pill-warn-border, var(--pl-grey-light));
      background: var(--pl-table-pro-pill-warn-bg, var(--pl-background-color));
    }

    .metric.bad {
      border-color: var(--pl-table-pro-pill-bad-border, var(--pl-grey-light));
      background: var(--pl-table-pro-pill-bad-bg, var(--pl-background-color));
    }

    .metric.info {
      border-color: var(--pl-table-pro-pill-info-border, var(--pl-grey-light));
      background: var(--pl-table-pro-pill-info-bg, var(--pl-background-color));
    }

    .metric-label {
      font: var(--pl-text-font);
      color: var(--pl-grey-darkest);
      font-size: 12px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .metric-value {
      font: var(--pl-header-font);
      color: var(--pl-header-color);
      font-weight: 700;
      font-size: 18px;
      line-height: 1.1;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .metric-hint {
      font: var(--pl-text-font);
      color: var(--pl-grey-darkest);
      font-size: 12px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .detail-section-title {
      font: var(--pl-header-font);
      color: var(--pl-header-color);
      font-size: 13px;
      margin-top: 2px;
      letter-spacing: 0.02em;
    }

    .detail-edit-grid {
      gap: 8px;
    }

    .detail-edit-grid pl-input {
      min-width: 190px;
      flex: 1;
    }

    .detail-edit-grid pl-combobox {
      min-width: 190px;
      flex: 1;
    }

    .detail-edit-row {
      width: 100%;
      min-width: 0;
      align-items: flex-end;
      gap: 8px;
    }

    .detail-edit-row > * {
      min-width: 190px;
      flex: 1;
    }

    .detail-actions {
      margin-top: 2px;
    }

    @media (max-width: 980px) {
      .detail-head {
        grid-template-columns: 1fr;
      }

      .detail-tags {
        justify-content: flex-start;
      }
    }

    .empty {
      padding: 20px;
      text-align: center;
      color: var(--pl-grey-darkest);
    }

    .settings-layer {
      position: absolute;
      inset: 0;
      display: flex;
      justify-content: flex-end;
      z-index: 30;
    }

    .settings-layer[hidden] {
      display: none;
    }

    .settings-backdrop {
      flex: 1;
      background: var(--pl-grey-darkest);
      opacity: .28;
    }
  `;

  static template = html`
    <div class="shell">
      <div class="toolbar">
        <slot name="top-toolbar"></slot>
        <div class="toolbar-spacer"></div>
        <pl-icon-button
          id="btnSettings"
          variant="secondary"
          iconset="pl-default"
          icon="settings-2"
          title="Настройки колонок"></pl-icon-button>
      </div>
      <div id="tableHost" class="table-host">
        <div id="legacyHost" class="legacy-host"></div>
      </div>
    </div>

    <div id="settingsLayer" class="settings-layer" hidden>
      <div class="settings-backdrop" data-action="close-settings"></div>
      <pl-table-settings id="settingsPanel"></pl-table-settings>
    </div>
  `;

  constructor() {
    super();
    this._mergeHoverToken = null;
    this._inlineTemplateMap = new Map();
    this._columnInlineTemplateMap = new Map();
    this._cellTemplateMap = new Map();
    this._headerTemplateMap = new Map();
    this._footerTemplateMap = new Map();
    this._filterTemplateMap = new Map();
    this._headerNodeMap = new Map();
    this._inlineTemplateInstance = null;
    this._cellTemplateInstances = [];
    this._headerTemplateInstances = [];
    this._footerTemplateInstances = [];
    this._activeColumns = [];
    this._extraStylesHost = null;
    this._settingsColumnsSignature = '';
    this._settingsSignature = '';
    this._pendingLoadPlaceholder = null;
    this._lastVisibleDataRows = [];
    this._checkboxSyncTimer = 0;
    this._resizeState = null;
    this._stateSyncScheduled = false;
    this._stateSyncRaf = 0;
    this._hostResizeObserver = null;
    this._groupRowOffsetRaf = 0;
    this._pendingGroupRowOffset = 0;
    this._runtimeVersion = 0;
    this._headerRuntimeRaf = 0;

    this._bound = {
      onClick: this._onClick.bind(this),
      onDblClick: this._onDblClick.bind(this),
      onKeyDown: this._onKeyDown.bind(this),
      onSettingsChange: this._onSettingsChange.bind(this),
      onSettingsClose: this._onSettingsClose.bind(this),
      onTableMouseOver: this._onTableMouseOver.bind(this),
      onTableMouseLeave: this._onTableMouseLeave.bind(this),
      onTableScroll: this._onTableScroll.bind(this),
      onHostResize: this._syncViewportWidthVar.bind(this),
      onMouseDown: this._onMouseDown.bind(this),
      onResizeMove: this._onResizeMove.bind(this),
      onResizeEnd: this._onResizeEnd.bind(this)
    };
  }

  connectedCallback() {
    super.connectedCallback();
    this._syncColumnsSource();
    this._syncExtraStyles();

    this.addEventListener('click', this._bound.onClick);
    this.addEventListener('dblclick', this._bound.onDblClick);
    this.$.settingsPanel?.addEventListener('table-settings-change', this._bound.onSettingsChange);
    this.$.settingsPanel?.addEventListener('table-settings-close', this._bound.onSettingsClose);
    this.$.tableHost?.addEventListener('mouseover', this._bound.onTableMouseOver);
    this.$.tableHost?.addEventListener('mouseleave', this._bound.onTableMouseLeave);
    this.$.tableHost?.addEventListener('keydown', this._bound.onKeyDown);
    this.$.tableHost?.addEventListener('mousedown', this._bound.onMouseDown);
    this.$.tableHost?.addEventListener('scroll', this._bound.onTableScroll, { passive: true });

    if (typeof ResizeObserver !== 'undefined' && this.$?.tableHost) {
      this._hostResizeObserver = new ResizeObserver(this._bound.onHostResize);
      this._hostResizeObserver.observe(this.$.tableHost);
    }
    this._syncGroupRowOffset(true);

    this._settingsUiChanged();
    this._scheduleStateSync();
  }

  disconnectedCallback() {
    this._disposeInlineTemplateInstance();
    this._disposeCellTemplateInstances();
    this._disposeHeaderTemplateInstances();
    this._disposeFooterTemplateInstances();

    this.removeEventListener('click', this._bound.onClick);
    this.removeEventListener('dblclick', this._bound.onDblClick);
    this.$.settingsPanel?.removeEventListener('table-settings-change', this._bound.onSettingsChange);
    this.$.settingsPanel?.removeEventListener('table-settings-close', this._bound.onSettingsClose);
    this.$.tableHost?.removeEventListener('mouseover', this._bound.onTableMouseOver);
    this.$.tableHost?.removeEventListener('mouseleave', this._bound.onTableMouseLeave);
    this.$.tableHost?.removeEventListener('keydown', this._bound.onKeyDown);
    this.$.tableHost?.removeEventListener('mousedown', this._bound.onMouseDown);
    this.$.tableHost?.removeEventListener('scroll', this._bound.onTableScroll);
    this._hostResizeObserver?.disconnect?.();
    this._hostResizeObserver = null;
    if (this._groupRowOffsetRaf) {
      cancelAnimationFrame(this._groupRowOffsetRaf);
      this._groupRowOffsetRaf = 0;
    }
    if (this._headerRuntimeRaf) {
      cancelAnimationFrame(this._headerRuntimeRaf);
      this._headerRuntimeRaf = 0;
    }
    if (this._checkboxSyncTimer) {
      clearTimeout(this._checkboxSyncTimer);
      this._checkboxSyncTimer = 0;
    }
    if (this._stateSyncRaf) {
      cancelAnimationFrame(this._stateSyncRaf);
      this._stateSyncRaf = 0;
    }
    window.removeEventListener('mousemove', this._bound.onResizeMove);
    window.removeEventListener('mouseup', this._bound.onResizeEnd);
    this._stateSyncScheduled = false;
    super.disconnectedCallback();
  }

  _scheduleStateSync() {
    if (!this.isConnected || this._stateSyncScheduled) return;
    this._stateSyncScheduled = true;
    this._stateSyncRaf = requestAnimationFrame(() => {
      this._stateSyncRaf = 0;
      this._stateSyncScheduled = false;
      if (!this.isConnected) return;
      this._syncSettingsPanel();
      this._renderTable();
    });
  }

  _stateChanged() {
    this._scheduleStateSync();
  }

  _selectedChanged() {
    this._syncSelectedRowHighlight();
    this._syncSelectionControls();
  }

  _selectedListChanged() {
    this._syncSelectedRowHighlight();
    this._syncSelectionControls();
  }

  _settingsUiChanged() {
    if (!this.$?.btnSettings || !this.$?.settingsLayer) return;
    this.$.btnSettings.hidden = !this.enableSettings;
    this.$.settingsLayer.hidden = !this._settingsOpen;
  }

  _syncExtraStyles() {
    if (!this.shadowRoot) return;
    if (this._extraStylesHost) {
      this._extraStylesHost.remove();
      this._extraStylesHost = null;
    }

    const styleComment = Array.from(this.childNodes || []).find((node) => {
      return node?.nodeType === Node.COMMENT_NODE
        && node._tpl?.tpl?.matches?.('[is="extra styles"]');
    });
    if (!styleComment?._tpl?.tpl?.content) return;

    const host = document.createElement('div');
    host.style.display = 'none';
    host.dataset.extraStyles = 'true';
    host.append(styleComment._tpl.tpl.content.cloneNode(true));
    this.shadowRoot.append(host);
    this._extraStylesHost = host;
  }

  _sanitizeIdPart(value) {
    return String(value ?? '')
      .trim()
      .toLowerCase()
      .replace(/[^a-zA-Z0-9_а-яА-Я-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  _readBooleanAttribute(element, name) {
    if (!element?.hasAttribute?.(name)) return null;
    const raw = String(element.getAttribute(name) ?? '').trim().toLowerCase();
    if (raw === '' || raw === name.toLowerCase()) return true;
    if (['false', '0', 'off', 'no'].includes(raw)) return false;
    return true;
  }

  _readNumberAttribute(element, name) {
    if (!element?.hasAttribute?.(name)) return null;
    const n = Number(element.getAttribute(name));
    return Number.isFinite(n) ? n : null;
  }

  _templateKeys(column) {
    return [column?.id, column?.field]
      .map((key) => String(key || '').trim())
      .filter(Boolean);
  }

  _registerColumnTemplate(map, column, templateNode) {
    if (!map || !templateNode || !column) return;
    this._templateKeys(column).forEach((key) => map.set(key, templateNode));
  }

  _registerHeaderNode(column, headerNode) {
    if (!headerNode || !column) return;
    this._templateKeys(column).forEach((key) => this._headerNodeMap.set(key, headerNode));
  }

  _directColumnChildren(node) {
    return Array.from(node?.children || []).filter((child) => child.tagName === 'PL-TABLE-PRO-COLUMN');
  }

  _parseDeclarativeColumnElement(columnEl, index, parentPath, usedIds) {
    const explicitId = this._sanitizeIdPart(columnEl?.getAttribute?.('id'));
    const field = String(columnEl?.getAttribute?.('field') || '').trim();
    const header = String(columnEl?.getAttribute?.('header') || '').trim();
    const kind = String(columnEl?.getAttribute?.('kind') || '').trim();
    const format = String(columnEl?.getAttribute?.('format') || '').trim();
    const align = String(columnEl?.getAttribute?.('align') || '').trim()
      || String(columnEl?.getAttribute?.('justify') || '').trim();
    const cellAlign = String(columnEl?.getAttribute?.('cell-align') || columnEl?.getAttribute?.('cellAlign') || '').trim();
    const cellVAlign = String(columnEl?.getAttribute?.('cell-valign') || columnEl?.getAttribute?.('cellVAlign') || '').trim();
    const titleField = String(columnEl?.getAttribute?.('title-field') || columnEl?.getAttribute?.('titleField') || '').trim();
    const headerTextAlign = String(columnEl?.getAttribute?.('header-text-align') || columnEl?.getAttribute?.('headerTextAlign') || '').trim();

    const basePart = this._sanitizeIdPart(field || header || `column-${index + 1}`) || `column-${index + 1}`;
    const rootId = explicitId || `${parentPath}-${basePart}`;
    let nextId = rootId;
    let duplicate = 2;
    while (usedIds.has(nextId)) {
      nextId = `${rootId}-${duplicate}`;
      duplicate += 1;
    }
    usedIds.add(nextId);

    const column = { id: nextId };
    if (field) column.field = field;
    if (header) column.header = header;
    if (kind) column.kind = kind;
    if (format) column.format = format;
    if (align) column.align = align;
    if (cellAlign) column.cellAlign = cellAlign;
    if (cellVAlign) column.cellVAlign = cellVAlign;
    if (titleField) column.titleField = titleField;
    if (headerTextAlign) column.headerTextAlign = headerTextAlign;

    const width = this._readNumberAttribute(columnEl, 'width');
    if (width != null) column.width = width;

    const sortable = this._readBooleanAttribute(columnEl, 'sortable');
    if (sortable != null) column.sortable = sortable;
    const sort = String(columnEl?.getAttribute?.('sort') || '').trim().toLowerCase();
    if (sort === 'asc' || sort === 'desc') column.sort = sort;
    const resizable = this._readBooleanAttribute(columnEl, 'resizable');
    if (resizable != null) column.resizable = resizable;
    const hidden = this._readBooleanAttribute(columnEl, 'hidden');
    if (hidden != null) column.hidden = hidden;
    const fixedAttr = String(columnEl?.getAttribute?.('fixed') || '').trim().toLowerCase();
    if (fixedAttr) {
      if (fixedAttr === 'true') column.fixed = 'left';
      else column.fixed = fixedAttr;
    } else {
      const fixed = this._readBooleanAttribute(columnEl, 'fixed');
      if (fixed != null) column.fixed = fixed;
    }
    const action = this._readBooleanAttribute(columnEl, 'action');
    if (action != null) column.action = action;

    const merge = this._readBooleanAttribute(columnEl, 'merge');
    if (merge != null) {
      column.merge = merge;
      column.settings = { ...(column.settings || {}), merge };
    }

    const footerAttr = columnEl?.getAttribute?.('footer');
    if (footerAttr != null) {
      column.footer = String(footerAttr);
    }

    const settingsAttr = String(columnEl?.getAttribute?.('settings') || '').trim();
    if (settingsAttr && !settingsAttr.includes('[[') && !settingsAttr.includes('{{')) {
      try {
        const parsed = JSON.parse(settingsAttr);
        if (parsed && typeof parsed === 'object') {
          column.settings = { ...(column.settings || {}), ...parsed };
        }
      } catch {
        // Ignore invalid inline JSON settings.
      }
    }

    const comments = Array.from(columnEl?.childNodes || []).filter((node) => {
      return node?.nodeType === Node.COMMENT_NODE
        && node.textContent?.startsWith?.('tpl:')
        && node._tpl?.tpl;
    });
    const cellTpl = comments.find((node) => !node._tpl?.tpl?.getAttribute?.('is'));
    const inlineTpl = comments.find((node) => node._tpl?.tpl?.getAttribute?.('is') === 'inline');
    const headerTpl = comments.find((node) => node._tpl?.tpl?.getAttribute?.('is') === 'header');
    const footerTpl = comments.find((node) => node._tpl?.tpl?.getAttribute?.('is') === 'footer');
    const filterTpl = comments.find((node) => node._tpl?.tpl?.getAttribute?.('is') === 'filter');
    this._registerColumnTemplate(this._cellTemplateMap, column, cellTpl);
    this._registerColumnTemplate(this._columnInlineTemplateMap, column, inlineTpl);
    this._registerColumnTemplate(this._headerTemplateMap, column, headerTpl);
    this._registerColumnTemplate(this._footerTemplateMap, column, footerTpl);
    this._registerColumnTemplate(this._filterTemplateMap, column, filterTpl);

    const headerNode = Array.from(columnEl?.children || []).find((node) => {
      return node.tagName !== 'PL-TABLE-PRO-COLUMN' && node.getAttribute?.('slot') === 'header';
    });
    this._registerHeaderNode(column, headerNode);

    const childColumns = this._directColumnChildren(columnEl).map((child, childIndex) => {
      return this._parseDeclarativeColumnElement(child, childIndex, nextId, usedIds);
    });
    if (childColumns.length > 0) {
      column.children = childColumns;
    } else if (field) {
      if (sortable == null) column.sortable = true;
      if (resizable == null) column.resizable = true;
    }

    return column;
  }

  _parseDeclarativeColumns() {
    const usedIds = new Set();
    return this._directColumnChildren(this).map((columnEl, index) => {
      return this._parseDeclarativeColumnElement(columnEl, index, 'col', usedIds);
    });
  }

  _applyColumnDefaults(columns) {
    const source = Array.isArray(columns) ? columns : [];
    return source.map((column) => {
      const next = { ...column };
      const children = Array.isArray(next.children) ? next.children : [];
      if (children.length > 0) {
        next.children = this._applyColumnDefaults(children);
      } else if (next.field) {
        if (!Object.prototype.hasOwnProperty.call(next, 'sortable')) next.sortable = true;
        if (!Object.prototype.hasOwnProperty.call(next, 'resizable')) next.resizable = true;
      }
      return next;
    });
  }

  _syncColumnsSource() {
    const previousHeaderNodeMap = this._headerNodeMap instanceof Map ? this._headerNodeMap : new Map();

    this._columnInlineTemplateMap = new Map();
    this._cellTemplateMap = new Map();
    this._headerTemplateMap = new Map();
    this._footerTemplateMap = new Map();
    this._filterTemplateMap = new Map();
    this._headerNodeMap = new Map();

    const propColumns = Array.isArray(this.columns) ? this.columns : [];
    const sourceColumns = propColumns.length > 0 ? propColumns : this._parseDeclarativeColumns();
    this._activeColumns = this._applyColumnDefaults(sourceColumns);

    if (propColumns.length === 0 && previousHeaderNodeMap.size > 0) {
      previousHeaderNodeMap.forEach((node, key) => {
        if (!this._headerNodeMap.has(key)) this._headerNodeMap.set(key, node);
      });
    }

    this._collectInlineTemplates();
    return this._activeColumns;
  }

  _syncSettingsPanel() {
    if (!this.$?.settingsPanel) return;
    const columns = this._syncColumnsSource();
    const nextSignature = JSON.stringify(Array.isArray(columns) ? columns : []);
    if (this._settingsColumnsSignature !== nextSignature) {
      this._settingsColumnsSignature = nextSignature;
      this.$.settingsPanel.columns = Array.isArray(columns) ? columns : [];
    }
    this.$.settingsPanel.settingsKey = this.settingsKey || 'generated.pl-table-pro.default';
    if (this.settings) {
      const nextSettingsSignature = JSON.stringify(this.settings || null);
      if (this._settingsSignature !== nextSettingsSignature) {
        this._settingsSignature = nextSettingsSignature;
        this.$.settingsPanel.settings = this.settings;
      }
    } else {
      this.$.settingsPanel.reload();
      this.settings = this.$.settingsPanel.getSettings();
      this._settingsSignature = JSON.stringify(this.settings || null);
    }
  }

  _onSettingsChange(event) {
    this.settings = event.detail?.settings || null;
    this.dispatchEvent(new CustomEvent('tableSettingsChange', {
      detail: { settings: this.settings },
      bubbles: true,
      composed: true
    }));
  }

  _onSettingsClose() {
    this._settingsOpen = false;
  }

  _rowKey(row, sourceIndex) {
    const field = this.rowKeyField || this.keyField || 'id';
    if (row && row[field] != null && row[field] !== '') return String(row[field]);
    return String(sourceIndex);
  }

  _selectedRowKey() {
    if (!this.selected) return '';

    const field = this.rowKeyField || this.keyField || 'id';
    const value = this.selected?.[field];
    if (value != null && value !== '') return String(value);

    const source = Array.isArray(this.data) ? this.data : [];
    const index = source.indexOf(this.selected);
    return index >= 0 ? String(index) : '';
  }

  _selectedRowKeySet() {
    const source = Array.isArray(this.data) ? this.data : [];
    const selectedRows = Array.isArray(this.selectedList) ? this.selectedList : [];
    const keys = new Set();
    selectedRows.forEach((row) => {
      if (!row) return;
      const index = source.indexOf(row);
      keys.add(this._rowKey(row, index >= 0 ? index : -1));
    });
    return keys;
  }

  _setSelectedList(rows) {
    const source = Array.isArray(this.data) ? this.data : [];
    const items = Array.isArray(rows) ? rows : [];
    const keys = new Set();
    const next = [];

    items.forEach((row) => {
      if (!row) return;
      const index = source.indexOf(row);
      const key = this._rowKey(row, index >= 0 ? index : -1);
      if (keys.has(key)) return;
      keys.add(key);
      next.push(row);
    });

    this.selectedList = next;
    this.dispatchEvent(new CustomEvent('selectionChange', {
      detail: { selectedList: next },
      bubbles: true,
      composed: true
    }));
  }

  _isRowMultiSelected(row, sourceIndex) {
    if (!this.multiSelect) return false;
    const keys = this._selectedRowKeySet();
    return keys.has(this._rowKey(row, sourceIndex));
  }

  _toggleRowSelection(row, sourceIndex, forceChecked = null) {
    if (!this.multiSelect || !row) return;
    const key = this._rowKey(row, sourceIndex);
    const current = Array.isArray(this.selectedList) ? this.selectedList : [];
    const map = new Map();
    current.forEach((item) => {
      const index = (Array.isArray(this.data) ? this.data : []).indexOf(item);
      map.set(this._rowKey(item, index >= 0 ? index : -1), item);
    });

    const shouldSelect = forceChecked == null ? !map.has(key) : Boolean(forceChecked);
    if (shouldSelect) map.set(key, row);
    else map.delete(key);

    this._setSelectedList(Array.from(map.values()));
  }

  _toggleSelectAllVisible(forceChecked = null) {
    if (!this.multiSelect) return;
    const visibleRows = Array.isArray(this._lastVisibleDataRows) ? this._lastVisibleDataRows : [];
    const current = Array.isArray(this.selectedList) ? this.selectedList : [];
    const map = new Map();
    current.forEach((item) => {
      const index = (Array.isArray(this.data) ? this.data : []).indexOf(item);
      map.set(this._rowKey(item, index >= 0 ? index : -1), item);
    });

    const visibleKeys = visibleRows.map((entry) => this._rowKey(entry.row, entry.sourceIndex));
    const allSelected = visibleKeys.length > 0 && visibleKeys.every((key) => map.has(key));
    const shouldSelect = forceChecked == null ? !allSelected : Boolean(forceChecked);

    if (shouldSelect) {
      visibleRows.forEach((entry) => {
        map.set(this._rowKey(entry.row, entry.sourceIndex), entry.row);
      });
    } else {
      visibleKeys.forEach((key) => map.delete(key));
    }

    this._setSelectedList(Array.from(map.values()));
  }

  _toggleTreeRow(sourceIndex) {
    if (!this.tree) return;
    if (!Number.isInteger(sourceIndex) || sourceIndex < 0) return;

    const row = this.data?.[sourceIndex];
    if (!row || this._isPlaceHolderRow(row)) return;
    if (row._haschildren === false) return;

    const opened = Object.prototype.hasOwnProperty.call(row, '_opened')
      ? Boolean(row._opened)
      : false;
    const nextOpened = !opened;
    this.set(`data.${sourceIndex}._opened`, nextOpened);
    if (nextOpened) this._loadTreeChildren(row);
  }

  _loadTreeChildren(parentRow) {
    const source = this.data;
    if (!Array.isArray(source) || typeof source.load !== 'function') return;

    const keyField = String(this.keyField || this.rowKeyField || 'id').trim() || 'id';
    const pkeyField = String(this.pkeyField || 'parent_id').trim() || 'parent_id';
    const parentKey = parentRow?.[keyField];
    if (parentKey == null || parentKey === '') return;

    let attempt = 0;
    const maxAttempts = 10;
    const parentToken = String(parentKey);

    const tryLoad = () => {
      const placeHolder = source.find((row) => {
        if (!this._isPlaceHolderRow(row)) return false;
        const token = row?.[pkeyField];
        return token != null && String(token) === parentToken;
      });

      if (!placeHolder) {
        attempt += 1;
        if (attempt < maxAttempts) setTimeout(tryLoad, 16);
        return;
      }

      if (this._pendingLoadPlaceholder === placeHolder) return;

      this._pendingLoadPlaceholder = placeHolder;
      Promise.resolve(source.load(placeHolder))
        .catch(() => {
          // Dataset will emit toast on error.
        })
        .finally(() => {
          if (this._pendingLoadPlaceholder === placeHolder) {
            this._pendingLoadPlaceholder = null;
          }
        });
    };

    setTimeout(tryLoad, 0);
  }

  _syncSelectedRowHighlight() {
    if (!this.$?.tableHost) return;
    const selectedRowKey = this._selectedRowKey();
    const selectedRowKeySet = this._selectedRowKeySet();
    this.$.tableHost.querySelectorAll('tr.data-row').forEach((row) => {
      const rowKey = row.dataset.rowKey || '';
      const isSelected = (selectedRowKey !== '' && rowKey === selectedRowKey)
        || selectedRowKeySet.has(rowKey);
      row.classList.toggle('selected', isSelected);
    });
  }

  _syncSelectionControls() {
    if (!this.$?.tableHost || !this.multiSelect) return;

    const selectedRowKeySet = this._selectedRowKeySet();
    const visibleRows = this.$.tableHost.querySelectorAll('tr.data-row');

    visibleRows.forEach((tr) => {
      const sourceIndex = Number(tr.dataset.sourceIndex);
      if (!Number.isInteger(sourceIndex) || sourceIndex < 0) return;

      const row = this.data?.[sourceIndex];
      const checked = row ? selectedRowKeySet.has(this._rowKey(row, sourceIndex)) : false;
      const checkbox = tr.querySelector('pl-checkbox[data-action="toggle-select-row"]');
      if (checkbox && checkbox.checked !== checked) checkbox.checked = checked;
    });

    const visibleDataRows = Array.from(visibleRows)
      .map((tr) => Number(tr.dataset.sourceIndex))
      .filter((idx) => Number.isInteger(idx) && idx >= 0)
      .map((idx) => ({ idx, row: this.data?.[idx] }))
      .filter((entry) => Boolean(entry.row));

    const selectAllChecked = visibleDataRows.length > 0
      && visibleDataRows.every((entry) => selectedRowKeySet.has(this._rowKey(entry.row, entry.idx)));
    const selectAll = this.$.tableHost.querySelector('pl-checkbox[data-action="toggle-select-all"]');
    if (selectAll && selectAll.checked !== selectAllChecked) selectAll.checked = selectAllChecked;
  }

  _collectInlineTemplates() {
    const map = new Map();
    const templates = [...this.childNodes].filter((node) => {
      return node?.nodeType === Node.COMMENT_NODE
        && node.textContent?.startsWith?.('tpl:')
        && node._tpl?.tpl?.getAttribute?.('is') === 'inline';
    });

    templates.forEach((commentNode) => {
      const tpl = commentNode._tpl?.tpl;
      const keys = [
        tpl?.getAttribute?.('column'),
        tpl?.getAttribute?.('field'),
        tpl?.getAttribute?.('for'),
        tpl?.getAttribute?.('name')
      ].map((key) => String(key || '').trim()).filter(Boolean);

      keys.forEach((key) => map.set(key, commentNode));
    });

    if (this._columnInlineTemplateMap instanceof Map) {
      this._columnInlineTemplateMap.forEach((tpl, key) => {
        if (!key || !tpl) return;
        map.set(String(key), tpl);
      });
    }

    this._inlineTemplateMap = map;
  }

  _inlineTemplateForColumn(column) {
    if (!column) return null;
    const byId = this._inlineTemplateMap.get(String(column.id || ''));
    if (byId) return byId;
    const byField = this._inlineTemplateMap.get(String(column.field || ''));
    if (byField) return byField;
    return null;
  }

  _templateForColumn(map, column) {
    if (!(map instanceof Map) || !column) return null;
    const byId = map.get(String(column.id || ''));
    if (byId) return byId;
    const byField = map.get(String(column.field || ''));
    if (byField) return byField;
    return null;
  }

  _cellTemplateForColumn(column) {
    return this._templateForColumn(this._cellTemplateMap, column);
  }

  _headerTemplateForColumn(column) {
    return this._templateForColumn(this._headerTemplateMap, column);
  }

  _footerTemplateForColumn(column) {
    return this._templateForColumn(this._footerTemplateMap, column);
  }

  _filterTemplateForColumn(column) {
    return this._templateForColumn(this._filterTemplateMap, column);
  }

  _headerNodeForColumn(column) {
    return this._templateForColumn(this._headerNodeMap, column);
  }

  _disposeInlineTemplateInstance() {
    if (!this._inlineTemplateInstance) return;
    this._inlineTemplateInstance.detach?.();
    this._inlineTemplateInstance = null;
  }

  _disposeCellTemplateInstances() {
    if (!Array.isArray(this._cellTemplateInstances) || this._cellTemplateInstances.length === 0) return;
    this._cellTemplateInstances.forEach((instance) => instance?.detach?.());
    this._cellTemplateInstances = [];
  }

  _disposeHeaderTemplateInstances() {
    if (!Array.isArray(this._headerTemplateInstances) || this._headerTemplateInstances.length === 0) return;
    this._headerTemplateInstances.forEach((instance) => instance?.detach?.());
    this._headerTemplateInstances = [];
  }

  _disposeFooterTemplateInstances() {
    if (!Array.isArray(this._footerTemplateInstances) || this._footerTemplateInstances.length === 0) return;
    this._footerTemplateInstances.forEach((instance) => instance?.detach?.());
    this._footerTemplateInstances = [];
  }

  _normalizeEditor(column) {
    if (!column?.editor || typeof column.editor !== 'object') return null;
    const type = String(column.editor.type || 'input').trim().toLowerCase();
    if (!type) return null;
    return { ...column.editor, type };
  }

  _isEditableColumn(column, merge) {
    if (!this.inlineEdit) return false;
    if (!column?.field) return false;
    if (merge?.rowSpan > 1) return false;
    return Boolean(this._normalizeEditor(column) || this._inlineTemplateForColumn(column));
  }

  _isCellEditing(sourceIndex, column) {
    if (!this._editingCell || !column?.field) return false;
    return Number(this._editingCell.sourceIndex) === Number(sourceIndex)
      && this._editingCell.field === column.field;
  }

  _editorComponentTag(editor) {
    if (!editor) return 'pl-input';
    if (editor.type === 'input' || editor.type === 'text' || editor.type === 'number') return 'pl-input';
    if (editor.type === 'textarea') return 'pl-textarea';
    if (editor.type === 'datetime' || editor.type === 'date') return 'pl-datetime';
    if (editor.type === 'combobox' || editor.type === 'select') return 'pl-combobox';
    if (editor.type === 'checkbox' || editor.type === 'boolean') return 'pl-checkbox';
    if (editor.type === 'custom') {
      const component = String(editor.component || '').trim().toLowerCase();
      if (/^[a-z0-9]+(?:-[a-z0-9]+)+$/i.test(component)) return component;
    }
    return 'pl-input';
  }

  _editorPropsToAttributes(editor) {
    const props = (editor && typeof editor.props === 'object' && editor.props) ? editor.props : {};
    return Object.entries(props).map(([key, value]) => {
      if (value == null || typeof value === 'object') return '';
      if (typeof value === 'boolean') return value ? ` ${key}` : '';
      return ` ${key}="${escapeHtml(String(value))}"`;
    }).join('');
  }

  _renderInlineEditorCell(column, row, sourceIndex) {
    const editor = this._normalizeEditor(column);
    const inlineTpl = this._inlineTemplateForColumn(column);
    if (!editor && !inlineTpl) return this._renderCellContent(column, row);

    if (inlineTpl) {
      const slotKey = `${sourceIndex}:${column.id || column.field}`;
      return `
        <div class="inline-edit-wrap" data-inline-editor="true" data-source-index="${sourceIndex}" data-field="${escapeHtml(column.field)}">
          <div class="inline-edit-field" data-inline-template-slot="${escapeHtml(slotKey)}"></div>
          <div class="inline-edit-actions">
            <pl-icon-button
              variant="link"
              iconset="pl-default"
              icon="check"
              title="Сохранить"
              data-action="save-inline"></pl-icon-button>
            <pl-icon-button
              variant="link"
              iconset="pl-default"
              icon="close-s"
              title="Отменить"
              data-action="cancel-inline"></pl-icon-button>
          </div>
        </div>
      `;
    }

    const rawValue = row?.[column.field];
    const currentValue = rawValue == null ? '' : String(rawValue);
    const tag = this._editorComponentTag(editor);

    let inputHtml = '';
    if (tag === 'pl-checkbox') {
      inputHtml = `<pl-checkbox data-inline-input="true"${normalizeBoolean(rawValue) ? ' checked' : ''}></pl-checkbox>`;
    } else if (tag === 'pl-datetime') {
      const dateType = editor.type === 'date' ? 'date' : (String(editor.datetimeType || 'datetime').toLowerCase() === 'date' ? 'date' : 'datetime');
      inputHtml = `<pl-datetime data-inline-input="true" stretch type="${dateType}" value="${escapeHtml(currentValue)}"></pl-datetime>`;
    } else {
      const valueAttr = currentValue === '' ? '' : ` value="${escapeHtml(currentValue)}"`;
      const inputTypeAttr = (tag === 'pl-input' && editor.type === 'number') ? ' type="number"' : '';
      const propsAttr = this._editorPropsToAttributes(editor);
      const stretchAttr = (tag === 'pl-input' || tag === 'pl-textarea' || tag === 'pl-combobox' || tag === 'pl-time') ? ' stretch' : '';
      const comboStyleAttr = tag === 'pl-combobox' ? ' style="--pl-content-width:100%;min-width:0;"' : '';
      inputHtml = `<${tag} data-inline-input="true"${stretchAttr}${comboStyleAttr}${inputTypeAttr}${valueAttr}${propsAttr}></${tag}>`;
    }

    return `
      <div class="inline-edit-wrap" data-inline-editor="true" data-source-index="${sourceIndex}" data-field="${escapeHtml(column.field)}">
        <div class="inline-edit-field">${inputHtml}</div>
        <div class="inline-edit-actions">
          <pl-icon-button
            variant="link"
            iconset="pl-default"
            icon="check"
            title="Сохранить"
            data-action="save-inline"></pl-icon-button>
          <pl-icon-button
            variant="link"
            iconset="pl-default"
            icon="close-s"
            title="Отменить"
            data-action="cancel-inline"></pl-icon-button>
        </div>
      </div>
    `;
  }

  _inlineEditorSelector() {
    if (!this._editingCell) return '[data-inline-editor="true"]';
    const sourceIndex = Number(this._editingCell.sourceIndex);
    const field = String(this._editingCell.field || '').replaceAll('\\', '\\\\').replaceAll('"', '\\"');
    if (!Number.isInteger(sourceIndex) || !field) return '[data-inline-editor="true"]';
    return `[data-inline-editor="true"][data-source-index="${sourceIndex}"][data-field="${field}"]`;
  }

  _focusInlineEditor() {
    if (!this._editingCell || !this.$?.tableHost) return;
    const selector = `${this._inlineEditorSelector()} [data-inline-input="true"]`;
    const input = this.$.tableHost.querySelector(selector);
    if (!input) return;
    input.focus?.();
    const nativeInput = input.shadowRoot?.querySelector('input, textarea');
    nativeInput?.focus?.();
    nativeInput?.select?.();
  }

  _syncInlineEditorRuntime(leafColumns) {
    if (!this._editingCell || !Array.isArray(leafColumns)) return;
    const column = leafColumns.find((item) => item.field === this._editingCell.field);
    if (!column) return;

    const editor = this._normalizeEditor(column);
    const inlineTpl = this._inlineTemplateForColumn(column);

    this._disposeInlineTemplateInstance();
    if (inlineTpl) {
      const slotKey = `${this._editingCell.sourceIndex}:${column.id || column.field}`;
      const slot = this.$?.tableHost?.querySelector(`[data-inline-template-slot="${slotKey}"]`);
      if (slot) {
        const baseCtx = Array.isArray(inlineTpl._hctx) ? inlineTpl._hctx : [];
        const row = this.data?.[this._editingCell.sourceIndex] || null;
        const scopeCtx = createTemplateScopeContext({
          row,
          column,
          sourceIndex: this._editingCell.sourceIndex,
          model: {
            row,
            column,
            sourceIndex: this._editingCell.sourceIndex
          }
        });
        const ti = new TemplateInstance(inlineTpl._tpl);
        ti.attach(slot, undefined, [scopeCtx, ...baseCtx, this]);
        this._inlineTemplateInstance = ti;
      }
    }

    const editorSelector = this._inlineEditorSelector();
    const input = this.$?.tableHost?.querySelector(`${editorSelector} [data-inline-input="true"]`);
    const fallback = this.$?.tableHost?.querySelector(`${editorSelector} pl-input, ${editorSelector} pl-datetime, ${editorSelector} pl-combobox, ${editorSelector} pl-checkbox, ${editorSelector} pl-textarea, ${editorSelector} pl-time, ${editorSelector} input, ${editorSelector} textarea, ${editorSelector} select`);
    const targetInput = input || fallback;
    if (!targetInput) return;
    if (!targetInput.dataset.inlineInput) targetInput.dataset.inlineInput = 'true';

    const value = this.data?.[this._editingCell.sourceIndex]?.[column.field];

    if (targetInput.tagName === 'PL-COMBOBOX' && (editor?.type === 'combobox' || editor?.type === 'select')) {
      const options = Array.isArray(editor.options) ? editor.options : [];
      targetInput.data = options;
      targetInput.textProperty = editor.textProperty || 'text';
      targetInput.valueProperty = editor.valueProperty || 'value';
    }

    if (editor?.type === 'custom' && editor.props && typeof editor.props === 'object') {
      Object.entries(editor.props).forEach(([key, value]) => {
        try {
          targetInput[key] = value;
        } catch {
          // ignore unsupported props on custom editors
        }
      });
    }

    if (targetInput.tagName === 'PL-CHECKBOX') {
      targetInput.checked = normalizeBoolean(value);
    } else if (targetInput.tagName === 'PL-COMBOBOX') {
      targetInput.value = value == null ? null : String(value);
    } else if (targetInput.tagName === 'PL-DATETIME') {
      targetInput.value = value || null;
    } else if (targetInput.tagName === 'PL-TIME') {
      targetInput.value = value == null ? '' : String(value);
    } else if ('value' in targetInput) {
      targetInput.value = value == null ? '' : String(value);
    }

    setTimeout(() => this._focusInlineEditor(), 0);
  }

  _startInlineEdit(sourceIndex, column) {
    if (!this.inlineEdit || !column?.field) return;
    const editor = this._normalizeEditor(column);
    const inlineTpl = this._inlineTemplateForColumn(column);
    if (!editor && !inlineTpl) return;

    const next = {
      sourceIndex: Number(sourceIndex),
      field: column.field,
      columnId: column.id,
      editorType: editor?.type || 'template'
    };

    const same = this._editingCell
      && Number(this._editingCell.sourceIndex) === next.sourceIndex
      && this._editingCell.field === next.field;
    if (same) return;
    this._editingCell = next;
  }

  _cancelInlineEdit() {
    if (!this._editingCell) return;
    this._disposeInlineTemplateInstance();
    this._editingCell = null;
  }

  _coerceEditorValue(value, editor) {
    const type = String(editor?.type || '').toLowerCase();
    if (type === 'number') {
      if (value == null || value === '') return null;
      const n = Number(value);
      return Number.isFinite(n) ? n : null;
    }
    if (type === 'checkbox' || type === 'boolean') {
      return normalizeBoolean(value);
    }
    return value;
  }

  _getInlineInputElement() {
    const wrap = this.$?.tableHost?.querySelector(this._inlineEditorSelector());
    return wrap?.querySelector('[data-inline-input="true"]') || null;
  }

  _readInlineEditorValue(input) {
    if (!input) return undefined;
    if (input.tagName === 'PL-CHECKBOX') return Boolean(input.checked);
    return input.value;
  }

  _commitInlineEdit() {
    if (!this._editingCell) return;
    const sourceIndex = Number(this._editingCell.sourceIndex);
    if (!Number.isInteger(sourceIndex) || sourceIndex < 0) {
      this._editingCell = null;
      return;
    }

    const current = this.data?.[sourceIndex];
    if (!current) {
      this._editingCell = null;
      return;
    }

    const field = this._editingCell.field;
    if (!field) {
      this._editingCell = null;
      return;
    }

    const applied = applySettingsToColumns(this._activeColumns || [], this.settings);
    const leafColumns = applied.leafColumns || [];
    const column = leafColumns.find((item) => item.field === field);
    const editor = this._normalizeEditor(column);

    const input = this._getInlineInputElement();
    const rawValue = this._readInlineEditorValue(input);
    const inferredType = editor?.type
      || (input?.tagName === 'PL-CHECKBOX' ? 'checkbox' : '')
      || ((input?.type || '').toLowerCase() === 'number' ? 'number' : '');
    const nextValue = this._coerceEditorValue(rawValue, { type: inferredType });
    const updated = { ...current, [field]: nextValue };
    this.splice('data', sourceIndex, 1, updated);
    if (this.selected === current) this.selected = updated;

    this.dispatchEvent(new CustomEvent('tableCellSave', {
      detail: {
        sourceIndex,
        field,
        row: updated,
        value: nextValue
      },
      bubbles: true,
      composed: true
    }));

    this._disposeInlineTemplateInstance();
    this._editingCell = null;
  }

  _onKeyDown(event) {
    if (!this._editingCell) return;
    const inlineInput = this._pathTarget(event, (node) => node.dataset?.inlineInput === 'true');
    if (!inlineInput) return;

    if (event.key === 'Escape') {
      event.preventDefault();
      event.stopPropagation();
      this._cancelInlineEdit();
      return;
    }

    if (event.key !== 'Enter') return;
    if (inlineInput.tagName === 'PL-TEXTAREA' && event.shiftKey) return;
    event.preventDefault();
    event.stopPropagation();
    this._commitInlineEdit();
  }

  _isPlaceHolderRow(row) {
    return row instanceof PlaceHolder || row?.constructor?.name === 'PlaceHolder';
  }

  _nextPlaceHolder() {
    const source = Array.isArray(this.data) ? this.data : [];
    return source.find((row) => this._isPlaceHolderRow(row)) || null;
  }

  _tryLoadMore() {
    if (!this.$?.tableHost) return;
    const source = this.data;
    if (!source || typeof source.load !== 'function') return;

    const nearBottom = this.$.tableHost.scrollTop + this.$.tableHost.clientHeight >= (this.$.tableHost.scrollHeight - 180);
    if (!nearBottom) return;

    const placeHolder = this._nextPlaceHolder();
    if (!placeHolder) return;
    if (this._pendingLoadPlaceholder === placeHolder) return;

    this._pendingLoadPlaceholder = placeHolder;
    Promise.resolve(source.load(placeHolder))
      .catch(() => {
        // Dataset will emit toast on error.
      })
      .finally(() => {
        if (this._pendingLoadPlaceholder === placeHolder) {
          this._pendingLoadPlaceholder = null;
        }
      });
  }

  _syncViewportWidthVar() {
    const host = this.$?.tableHost;
    if (!host) return;

    const width = Number(host.clientWidth || 0);
    if (Number.isFinite(width) && width > 0) {
      host.style.setProperty('--pl-group-row-width', `${Math.round(width)}px`);
    }

    const headerHeight = Math.max(0, Math.round(host.querySelector('thead')?.getBoundingClientRect?.().height || 0));
    host.style.setProperty('--pl-group-row-top', `${headerHeight}px`);

    this._syncGroupRowOffset(true);
  }

  _syncGroupRowOffset(immediate = false) {
    const host = this.$?.tableHost;
    if (!host) return;

    const nextOffset = Number(host.scrollLeft || 0);
    this._pendingGroupRowOffset = Number.isFinite(nextOffset) ? nextOffset : 0;

    const apply = () => {
      this._groupRowOffsetRaf = 0;
      host.style.setProperty('--pl-group-row-offset', `${this._pendingGroupRowOffset}px`);
    };

    if (immediate) {
      if (this._groupRowOffsetRaf) {
        cancelAnimationFrame(this._groupRowOffsetRaf);
        this._groupRowOffsetRaf = 0;
      }
      apply();
      return;
    }

    if (this._groupRowOffsetRaf) return;
    this._groupRowOffsetRaf = requestAnimationFrame(apply);
  }

  _columnWidth(column) {
    const runtime = Number(this.columnWidths?.[column?.id]);
    if (Number.isFinite(runtime) && runtime > 0) return runtime;

    const columnWidth = Number(column?.width);
    if (Number.isFinite(columnWidth) && columnWidth > 0) return columnWidth;

    if (column?.action) return 56;
    return 140;
  }

  _columnFixedSide(column) {
    if (column?.action) return 'right';
    return normalizeFixed(column?.fixed);
  }

  _columnAlignClass(column) {
    const align = String(column?.cellAlign || column?.align || '').trim().toLowerCase();
    if (align === 'right' || align === 'end' || align === 'flex-end') return 'align-right';
    if (align === 'center' || align === 'middle') return 'align-center';
    if (!align || align === 'left' || align === 'start' || align === 'flex-start') return 'align-left';
    return 'align-left';
  }

  _columnVAlignClass(column) {
    const vAlign = String(column?.cellVAlign || '').trim().toLowerCase();
    if (vAlign === 'top' || vAlign === 'start' || vAlign === 'flex-start') return 'valign-top';
    if (vAlign === 'bottom' || vAlign === 'end' || vAlign === 'flex-end') return 'valign-bottom';
    return 'valign-middle';
  }

  _buildLeafLayout(leafColumns) {
    const columns = Array.isArray(leafColumns) ? leafColumns : [];
    const widthMap = new Map();
    columns.forEach((column) => widthMap.set(column.id, this._columnWidth(column)));

    const leftMap = new Map();
    const rightMap = new Map();

    let left = 0;
    columns.forEach((column) => {
      if (this._columnFixedSide(column) !== 'left') return;
      leftMap.set(column.id, left);
      left += widthMap.get(column.id) || 0;
    });

    let right = 0;
    [...columns].reverse().forEach((column) => {
      if (this._columnFixedSide(column) !== 'right') return;
      rightMap.set(column.id, right);
      right += widthMap.get(column.id) || 0;
    });

    return { widthMap, leftMap, rightMap };
  }

  _buildGroupLayout(columns, leafLayout) {
    const map = new Map();
    const source = Array.isArray(columns) ? columns : [];

    const walk = (column) => {
      const children = Array.isArray(column?.children) ? column.children : [];
      if (children.length === 0) {
        const side = this._columnFixedSide(column);
        const width = leafLayout.widthMap.get(column.id) || this._columnWidth(column);
        const info = {
          width,
          side,
          left: side === 'left' ? (leafLayout.leftMap.get(column.id) || 0) : null,
          right: side === 'right' ? (leafLayout.rightMap.get(column.id) || 0) : null
        };
        return info;
      }

      const childInfo = children.map((child) => walk(child));
      const width = childInfo.reduce((sum, info) => sum + (Number(info?.width) || 0), 0);
      const uniqueSides = [...new Set(childInfo.map((info) => info?.side).filter(Boolean))];

      let side = '';
      let left = null;
      let right = null;

      if (uniqueSides.length === 1) {
        side = uniqueSides[0];
        if (side === 'left') {
          const offsets = childInfo.map((info) => info?.left).filter((value) => Number.isFinite(value));
          if (offsets.length === childInfo.length) left = Math.min(...offsets);
          else side = '';
        } else if (side === 'right') {
          const offsets = childInfo.map((info) => info?.right).filter((value) => Number.isFinite(value));
          if (offsets.length === childInfo.length) right = Math.min(...offsets);
          else side = '';
        } else {
          side = '';
        }
      }

      const info = { width, side, left, right };
      map.set(column.id, info);
      return info;
    };

    source.forEach((column) => walk(column));
    return map;
  }

  _useBackendSort() {
    return Boolean(this.data && typeof this.data === 'object' && this.data.control);
  }

  _sortStateFromData(leafColumns) {
    const datasetSorts = Array.isArray(this.data?.sorts) ? this.data.sorts : [];
    if (datasetSorts.length === 0) return null;

    const sourceSort = datasetSorts.find((item) => item?.field && (item?.sort === 'asc' || item?.sort === 'desc'));
    if (!sourceSort) return null;

    const column = (leafColumns || []).find((item) => item.field === sourceSort.field);
    if (!column) return null;

    return {
      columnId: column.id,
      field: column.field,
      direction: sourceSort.sort
    };
  }

  _ensureInitialSort(leafColumns) {
    const initial = (leafColumns || []).find((item) => item.field && (item.sort === 'asc' || item.sort === 'desc'));
    if (!initial) return;

    const currentSorts = Array.isArray(this.data?.sorts) ? this.data.sorts : [];
    if (this._useBackendSort()) {
      if (currentSorts.length > 0) return;
      this.set('data.sorts', [{ field: initial.field, sort: initial.sort }]);
      return;
    }

    if (this.sortState?.columnId) return;
    this.sortState = { columnId: initial.id, field: initial.field, direction: initial.sort };
  }

  _normalizeSortState(leafColumns) {
    const fromData = this._sortStateFromData(leafColumns);
    if (fromData) return fromData;

    const source = this.sortState;
    if (source?.columnId && (source.direction === 'asc' || source.direction === 'desc')) {
      const column = (leafColumns || []).find((item) => item.id === source.columnId && item.field);
      if (column) return { columnId: column.id, field: column.field, direction: source.direction };
    }

    const initial = (leafColumns || []).find((item) => item.field && (item.sort === 'asc' || item.sort === 'desc'));
    if (initial) return { columnId: initial.id, field: initial.field, direction: initial.sort };
    return null;
  }

  _sortDirectionForColumn(columnId, sortState) {
    if (!columnId || !sortState) return '';
    return sortState.columnId === columnId ? sortState.direction : '';
  }

  _nextSortDirection(current) {
    if (current === 'asc') return 'desc';
    if (current === 'desc') return '';
    return 'asc';
  }

  _toggleSortByColumn(columnId) {
    if (!columnId) return;
    const applied = applySettingsToColumns(this._activeColumns || [], this.settings);
    const leaf = (applied.leafColumns || []).find((column) => column.id === columnId);
    if (!leaf?.field || !leaf.sortable) return;

    if (this._useBackendSort()) {
      const sorts = [...(Array.isArray(this.data?.sorts) ? this.data.sorts : [])];
      const index = sorts.findIndex((item) => item?.field === leaf.field);
      const current = index >= 0 ? String(sorts[index]?.sort || '') : '';
      const next = this._nextSortDirection(current);

      if (index >= 0) sorts.splice(index, 1);
      if (next) sorts.unshift({ field: leaf.field, sort: next });

      this.set('data.sorts', sorts);
      return;
    }

    const current = this._sortDirectionForColumn(columnId, this._normalizeSortState(applied.leafColumns));
    const next = this._nextSortDirection(current);
    this.sortState = next ? { columnId: leaf.id, field: leaf.field, direction: next } : null;
  }

  _sortEntries(entries, sortState) {
    const source = Array.isArray(entries) ? entries : [];
    if (!sortState?.field || !sortState?.direction) return source;

    const direction = sortState.direction === 'desc' ? -1 : 1;
    const field = sortState.field;

    return [...source].sort((a, b) => {
      const av = a?.row?.[field];
      const bv = b?.row?.[field];

      if (av == null && bv == null) return (a?.sourceIndex ?? 0) - (b?.sourceIndex ?? 0);
      if (av == null) return -1 * direction;
      if (bv == null) return 1 * direction;

      const ad = av instanceof Date ? av.getTime() : NaN;
      const bd = bv instanceof Date ? bv.getTime() : NaN;
      if (Number.isFinite(ad) && Number.isFinite(bd)) return (ad - bd) * direction;

      if (typeof av === 'number' && typeof bv === 'number') return (av - bv) * direction;

      const cmp = String(av).localeCompare(String(bv), 'ru', { sensitivity: 'base', numeric: true });
      if (cmp !== 0) return cmp * direction;
      return (a?.sourceIndex ?? 0) - (b?.sourceIndex ?? 0);
    });
  }

  _buildSummary(rows, leafColumns) {
    const source = Array.isArray(rows) ? rows : [];
    const summary = { count: source.length };

    (Array.isArray(leafColumns) ? leafColumns : []).forEach((column) => {
      const field = column?.field;
      if (!field) return;

      let hasNumeric = false;
      let sum = 0;
      source.forEach((row) => {
        const n = Number(row?.[field]);
        if (!Number.isFinite(n)) return;
        hasNumeric = true;
        sum += n;
      });
      if (hasNumeric) summary[field] = sum;
    });

    return summary;
  }

  _headerCellStyle(column, layout, isGroup = false, groupInfo = null) {
    const styleParts = [];
    if (isGroup) {
      const width = Number(groupInfo?.width);
      if (Number.isFinite(width) && width > 0) {
        styleParts.push(`min-width:${width}px`, `max-width:${width}px`, `width:${width}px`);
      }

      const fixedSide = String(groupInfo?.side || '');
      if (fixedSide === 'left') {
        styleParts.push(`position:sticky`, `left:${groupInfo?.left || 0}px`, 'z-index:11');
      } else if (fixedSide === 'right') {
        styleParts.push(`position:sticky`, `right:${groupInfo?.right || 0}px`, 'z-index:11');
      }
    } else {
      const width = layout.widthMap.get(column.id) || this._columnWidth(column);
      styleParts.push(`min-width:${width}px`, `max-width:${width}px`, `width:${width}px`);

      const fixedSide = this._columnFixedSide(column);
      if (fixedSide === 'left') {
        styleParts.push(
          `position:sticky`,
          `left:${layout.leftMap.get(column.id) || 0}px`,
          `z-index:${column.action ? 14 : 12}`
        );
      } else if (fixedSide === 'right') {
        styleParts.push(
          `position:sticky`,
          `right:${layout.rightMap.get(column.id) || 0}px`,
          `z-index:${column.action ? 14 : 12}`
        );
      }
    }
    if (column.headerTextAlign) styleParts.push(`text-align:${escapeHtml(String(column.headerTextAlign))}`);
    return styleParts.length > 0 ? ` style="${styleParts.join(';')};"` : '';
  }

  _bodyCellStyle(column, layout) {
    const styleParts = [];
    const width = layout.widthMap.get(column.id) || this._columnWidth(column);
    styleParts.push(`min-width:${width}px`, `max-width:${width}px`, `width:${width}px`);

    const fixedSide = this._columnFixedSide(column);
    if (fixedSide === 'left') {
      styleParts.push(
        `position:sticky`,
        `left:${layout.leftMap.get(column.id) || 0}px`,
        `z-index:${column.action ? 6 : 4}`
      );
    } else if (fixedSide === 'right') {
      styleParts.push(
        `position:sticky`,
        `right:${layout.rightMap.get(column.id) || 0}px`,
        `z-index:${column.action ? 6 : 4}`
      );
    }
    return ` style="${styleParts.join(';')};"`;
  }

  _footerCellStyle(column, layout) {
    const styleParts = [];
    const width = layout.widthMap.get(column.id) || this._columnWidth(column);
    styleParts.push(`min-width:${width}px`, `max-width:${width}px`, `width:${width}px`);

    const fixedSide = this._columnFixedSide(column);
    if (fixedSide === 'left') {
      styleParts.push(`left:${layout.leftMap.get(column.id) || 0}px`, `z-index:${column.action ? 12 : 10}`);
    } else if (fixedSide === 'right') {
      styleParts.push(`right:${layout.rightMap.get(column.id) || 0}px`, `z-index:${column.action ? 12 : 10}`);
    }
    return ` style="${styleParts.join(';')};"`;
  }

  _renderTable() {
    if (!this.$?.tableHost) return;
    this._syncColumnsSource();
    this._syncExtraStyles();
    this._disposeInlineTemplateInstance();
    this._disposeCellTemplateInstances();
    this._disposeHeaderTemplateInstances();
    this._disposeFooterTemplateInstances();

    const applied = applySettingsToColumns(this._activeColumns || [], this.settings);
    const topColumns = applied.columns;
    const leafColumns = applied.leafColumns;
    const settings = applied.settings;

    if (!leafColumns.length) {
      if (this.$?.legacyHost) this.$.legacyHost.innerHTML = '<div class="empty">Нет видимых колонок. Включите нужные в настройках.</div>';
      return;
    }

    const sourceRows = Array.isArray(this.data) ? this.data : [];
    const sourceEntries = sourceRows.map((row, sourceIndex) => ({ row, sourceIndex }));
    const placeHolderEntries = sourceEntries.filter((entry) => this._isPlaceHolderRow(entry.row));
    const materializedEntries = sourceEntries.filter((entry) => !this._isPlaceHolderRow(entry.row));
    const layout = this._buildLeafLayout(leafColumns);
    const groupLayout = this._buildGroupLayout(topColumns, layout);
    this._ensureInitialSort(leafColumns);
    const sortState = this._normalizeSortState(leafColumns);
    const sortedEntries = (this.tree || this._useBackendSort())
      ? materializedEntries
      : this._sortEntries(materializedEntries, sortState);

    const groupByIds = Array.isArray(settings.groupBy)
      ? settings.groupBy
      : (settings.groupBy ? [settings.groupBy] : []);
    const groupByFields = groupByIds
      .map((columnId) => leafColumns.find((column) => column.id === columnId)?.field)
      .filter(Boolean);

    const rowsModel = this.tree
      ? buildTreeRowsModel(sortedEntries, {
        keyField: this.keyField || this.rowKeyField || 'id',
        pkeyField: this.pkeyField || 'parent_id',
        hasChildField: this.hasChildField || '_haschildren'
      })
      : buildRowsModel(
        sortedEntries,
        groupByFields
      );
    const headerRows = buildHeaderMatrix(topColumns);
    const headerDepth = Math.max(1, headerRows.length);
    const hasFilterRow = leafColumns.some((column) => Boolean(this._filterTemplateForColumn(column)));
    const mergeColumns = this.tree ? [] : leafColumns.filter((column) => Boolean(column.merge));
    const mergeMap = buildMergeMap(rowsModel, mergeColumns);
    const selectedRowKey = this._selectedRowKey();
    const selectedRowKeySet = this._selectedRowKeySet();
    const visibleDataRows = rowsModel
      .filter((entry) => entry.kind === 'data')
      .map((entry) => ({ row: entry.row, sourceIndex: entry.sourceIndex }));
    this._lastVisibleDataRows = visibleDataRows;
    const selectedVisibleCount = visibleDataRows.reduce((count, entry) => {
      return count + (selectedRowKeySet.has(this._rowKey(entry.row, entry.sourceIndex)) ? 1 : 0);
    }, 0);
    const selectAllChecked = this.multiSelect
      && visibleDataRows.length > 0
      && selectedVisibleCount === visibleDataRows.length;

    const extraHeaderRows = hasFilterRow ? 1 : 0;
    const thSelect = this.multiSelect
      ? `<th class="select-col" rowspan="${headerDepth + extraHeaderRows}">
          <pl-checkbox
            data-action="toggle-select-all"
            data-initial-checked="${selectAllChecked ? '1' : '0'}"
            title="Выделить все"></pl-checkbox>
        </th>`
      : '';
    const thExpand = this.masterDetail ? `<th class="expander-col" rowspan="${headerDepth + extraHeaderRows}"></th>` : '';
    const headerTemplateBindings = [];
    const headerNodeBindings = [];
    const filterTemplateBindings = [];

    const headerRowsHtml = headerRows.map((row, rowIndex) => {
      const cells = row.map((cell) => {
        const { column, isGroup, rowSpan, colSpan } = cell;
        const groupInfo = isGroup ? groupLayout.get(column.id) : null;
        const styleAttr = this._headerCellStyle(column, layout, isGroup, groupInfo);
        const fixedSide = isGroup ? String(groupInfo?.side || '') : this._columnFixedSide(column);
        const classParts = [];
        if (isGroup) classParts.push('group');
        if (fixedSide) classParts.push('fixed-cell', `fixed-${fixedSide}`);
        if (column.action) classParts.push('action-cell');
        const className = classParts.length > 0 ? ` class="${classParts.join(' ')}"` : '';
        const rowSpanAttr = rowSpan > 1 ? ` rowspan="${rowSpan}"` : '';
        const colSpanAttr = colSpan > 1 ? ` colspan="${colSpan}"` : '';
        const headerTpl = this._headerTemplateForColumn(column);
        const headerNode = this._headerNodeForColumn(column);
        const sortDir = this._sortDirectionForColumn(column.id, sortState);
        const canSort = !isGroup && Boolean(column.sortable && column.field);

        let headerContent = escapeHtml(column.header || column.field || column.id);
        if (headerTpl) {
          const slotKey = `${rowIndex}:${column.id}`;
          headerTemplateBindings.push({ slotKey, tpl: headerTpl, column, rowIndex });
          headerContent = `<div data-header-template-slot="${escapeHtml(slotKey)}"></div>`;
        } else if (headerNode) {
          const slotKey = `${rowIndex}:${column.id}`;
          headerNodeBindings.push({ slotKey, node: headerNode });
          headerContent = `<div data-header-node-slot="${escapeHtml(slotKey)}"></div>`;
        }

        const sortButton = canSort
          ? `
            <button
              type="button"
              class="sort-btn"
              data-action="sort-column"
              data-column-id="${escapeHtml(column.id)}"
              title="Сортировка">${sortDir === 'asc' ? '↑' : (sortDir === 'desc' ? '↓' : '↕')}</button>
          `
          : '';
        const resizer = (!isGroup && column.resizable)
          ? `<span class="header-resizer" data-action="resize-column" data-column-id="${escapeHtml(column.id)}"></span>`
          : '';
        headerContent = `<div class="th-inner"><div class="th-label">${headerContent}</div>${sortButton}</div>${resizer}`;

        return `<th${className}${rowSpanAttr}${colSpanAttr}${styleAttr}>${headerContent}</th>`;
      }).join('');

      return `<tr>${rowIndex === 0 ? `${thSelect}${thExpand}` : ''}${cells}</tr>`;
    }).join('');

    const filterRowHtml = hasFilterRow
      ? `<tr class="filter-row">${leafColumns.map((column) => {
        const filterTpl = this._filterTemplateForColumn(column);
        const styleAttr = this._headerCellStyle(column, layout, false, null);
        const fixedSide = this._columnFixedSide(column);
        const classParts = ['filter-cell'];
        if (fixedSide) classParts.push('fixed-cell', `fixed-${fixedSide}`);
        if (column.action) classParts.push('action-cell');
        const className = ` class="${classParts.join(' ')}"`;
        let filterContent = '';
        if (filterTpl) {
          const slotKey = `filter:${column.id}`;
          filterTemplateBindings.push({ slotKey, tpl: filterTpl, column });
          filterContent = `<div class="filter-cell-content" data-filter-template-slot="${escapeHtml(slotKey)}"></div>`;
        }
        return `<th${className}${styleAttr}>${filterContent}</th>`;
      }).join('')}</tr>`
      : '';
    const headerHtml = `${headerRowsHtml}${filterRowHtml}`;

    let dataRowOrder = 0;
    const cellTemplateBindings = [];
    const bodyRows = rowsModel.map((entry, rowModelIndex) => {
      if (entry.kind === 'group') {
        const colSpan = leafColumns.length + (this.masterDetail ? 1 : 0) + (this.multiSelect ? 1 : 0);
        return this._renderGroupRow(entry, colSpan);
      }

      const row = entry.row;
      const rowKey = this._rowKey(row, entry.sourceIndex);
      const isSelected = (selectedRowKey !== '' && selectedRowKey === rowKey)
        || (this.multiSelect && selectedRowKeySet.has(rowKey));
      const zebraClass = (dataRowOrder % 2 === 0) ? ' row-even' : ' row-odd';
      dataRowOrder += 1;
      const selectedClass = isSelected ? ' selected' : '';

      const cells = [];
      if (this.multiSelect) {
        const checked = selectedRowKeySet.has(rowKey);
        cells.push(`
          <td class="select-col">
            <pl-checkbox
              data-action="toggle-select-row"
              data-source-index="${entry.sourceIndex}"
              data-initial-checked="${checked ? '1' : '0'}"
              title="Выбрать строку"></pl-checkbox>
          </td>
        `);
      }
      if (this.masterDetail) {
        const icon = this._expandedKey === rowKey ? 'chevron-down' : 'chevron-right';
        cells.push(`
          <td class="expander-col">
            <pl-icon-button
              variant="link"
              iconset="pl-default"
              icon="${icon}"
              data-action="toggle-detail"
              data-row-key="${escapeHtml(rowKey)}"
              data-source-index="${entry.sourceIndex}"></pl-icon-button>
          </td>
        `);
      }

      leafColumns.forEach((column, columnIndex) => {
        const merge = mergeMap.get(`${rowModelIndex}:${column.id}`);
        if (merge?.skip) return;

        const rowSpan = merge?.rowSpan > 1 ? ` rowspan="${merge.rowSpan}"` : '';
        const mergeAttrs = merge?.rowSpan > 1 ? ` data-merge-start="${rowModelIndex}" data-merge-span="${merge.rowSpan}"` : '';
        const alignClass = this._columnAlignClass(column);
        const vAlignClass = this._columnVAlignClass(column);
        const fixedSide = this._columnFixedSide(column);
        const fixedClass = fixedSide ? ` fixed-cell fixed-${fixedSide}` : '';
        const actionClass = column.action ? ' action-cell' : '';
        const isEditing = this._isCellEditing(entry.sourceIndex, column);
        const isEditable = this._isEditableColumn(column, merge);
        const editableClass = isEditable ? ' editable-cell' : '';
        const editingClass = isEditing ? ' inline-editing' : '';
        const width = this._bodyCellStyle(column, layout);
        const dataAttrs = column.field
          ? ` data-field="${escapeHtml(column.field)}" data-column-id="${escapeHtml(column.id)}" data-source-index="${entry.sourceIndex}" data-editable="${isEditable ? 'true' : 'false'}"`
          : '';
        let content = isEditing
          ? this._renderInlineEditorCell(column, row, entry.sourceIndex)
          : this._renderCellContent(column, row, {
            rowModelIndex,
            sourceIndex: entry.sourceIndex,
            bindings: cellTemplateBindings
          });
        if (this.tree && columnIndex === 0) {
          content = this._renderTreeCellContent(entry, content);
        }

        cells.push(`<td${rowSpan}${mergeAttrs}${dataAttrs} class="${alignClass} ${vAlignClass}${fixedClass}${actionClass}${editableClass}${editingClass}"${width}>${content}</td>`);
      });

      const dataRow = `
        <tr class="data-row${zebraClass}${selectedClass}" data-model-index="${rowModelIndex}" data-row-key="${escapeHtml(rowKey)}" data-source-index="${entry.sourceIndex}">
          ${cells.join('')}
        </tr>
      `;

      if (!this.masterDetail || this._expandedKey !== rowKey) return dataRow;

      const detailRow = `
        <tr class="detail-row" data-row-key="${escapeHtml(rowKey)}">
          <td colspan="${leafColumns.length + (this.masterDetail ? 1 : 0) + (this.multiSelect ? 1 : 0)}">
            <div class="detail-shell">
              ${this._detailFormHtml(row, rowKey, entry.sourceIndex, leafColumns)}
            </div>
          </td>
        </tr>
      `;
      return dataRow + detailRow;
    });

    const placeHolderRows = placeHolderEntries.map((entry) => {
      const colSpan = leafColumns.length + (this.masterDetail ? 1 : 0) + (this.multiSelect ? 1 : 0);
      return `
        <tr class="placeholder-row" data-source-index="${entry.sourceIndex}">
          <td colspan="${colSpan}">Загрузка данных...</td>
        </tr>
      `;
    });

    const footerTemplateBindings = [];
    const summaryRows = visibleDataRows.map((entry) => entry.row);
    const summary = this._buildSummary(summaryRows, leafColumns);

    const footerCells = leafColumns.map((column) => {
      const footerTpl = this._footerTemplateForColumn(column);
      let footerContent = '';
      if (footerTpl) {
        const slotKey = `footer:${column.id}`;
        footerTemplateBindings.push({ slotKey, tpl: footerTpl, column, summary, rows: summaryRows });
        footerContent = `<div data-footer-template-slot="${escapeHtml(slotKey)}"></div>`;
      } else if (typeof column.footer === 'function') {
        try {
          footerContent = String(column.footer({ summary, rows: summaryRows, column }) || '');
        } catch {
          footerContent = '';
        }
      } else if (column.footer != null && column.footer !== '') {
        footerContent = escapeHtml(String(column.footer));
      }

      const fixedSide = this._columnFixedSide(column);
      const fixedClass = fixedSide ? ` fixed-cell fixed-${fixedSide}` : '';
      const actionClass = column.action ? ' action-cell' : '';
      const alignClass = this._columnAlignClass(column);
      const style = this._footerCellStyle(column, layout);
      return `<td class="${alignClass}${fixedClass}${actionClass}"${style}>${footerContent}</td>`;
    });

    const hasFooter = footerTemplateBindings.length > 0
      || leafColumns.some((column) => typeof column.footer === 'function' || (column.footer != null && column.footer !== ''));
    const footerHtml = hasFooter
      ? `
        <tfoot>
          <tr>
            ${this.multiSelect ? '<td class="select-col"></td>' : ''}
            ${this.masterDetail ? '<td class="expander-col"></td>' : ''}
            ${footerCells.join('')}
          </tr>
        </tfoot>
      `
      : '';

    if (this.$?.legacyHost) {
      this.$.legacyHost.innerHTML = `
        <table>
          <thead>
            ${headerHtml}
          </thead>
          <tbody>${bodyRows.join('')}${placeHolderRows.join('')}</tbody>
          ${footerHtml}
        </table>
      `;
    }
    const runtimeVersion = ++this._runtimeVersion;
    this._syncViewportWidthVar();
    this._mergeHoverToken = null;
    this._syncTableCheckboxes();
    this._syncHeaderRuntime(headerTemplateBindings, headerNodeBindings, filterTemplateBindings, runtimeVersion);
    this._syncFooterRuntime(footerTemplateBindings);
    this._syncCellTemplateRuntime(cellTemplateBindings);
    this._syncInlineEditorRuntime(leafColumns);
    this._syncDetailEditors();
    this._syncSelectedRowHighlight();
    this._tryLoadMore();
  }

  _syncTableCheckboxes() {
    if (this._checkboxSyncTimer) return;
    this._checkboxSyncTimer = setTimeout(() => {
      this._checkboxSyncTimer = 0;
      this.$.tableHost?.querySelectorAll?.('pl-checkbox[data-initial-checked]').forEach((checkbox) => {
        const nextChecked = checkbox.dataset.initialChecked === '1';
        if (checkbox.checked !== nextChecked) checkbox.checked = nextChecked;
        delete checkbox.dataset.initialChecked;
      });
    }, 0);
  }

  _syncHeaderRuntime(templateBindings, nodeBindings, filterBindings, runtimeVersion = this._runtimeVersion) {
    if (this._headerRuntimeRaf) {
      cancelAnimationFrame(this._headerRuntimeRaf);
      this._headerRuntimeRaf = 0;
    }
    this._disposeHeaderTemplateInstances();

    this._headerRuntimeRaf = requestAnimationFrame(() => {
      this._headerRuntimeRaf = 0;
      if (!this.isConnected || runtimeVersion !== this._runtimeVersion) return;

      const instances = [];
      if (Array.isArray(templateBindings) && templateBindings.length > 0) {
        templateBindings.forEach((binding) => {
          const slot = this.$?.tableHost?.querySelector?.(`[data-header-template-slot="${binding.slotKey}"]`);
          if (!slot || !slot.isConnected || !binding.tpl?._tpl) return;

          const baseCtx = Array.isArray(binding.tpl._hctx) ? binding.tpl._hctx : [];
          const scope = {
            column: binding.column,
            rowIndex: binding.rowIndex,
            model: {
              column: binding.column,
              rowIndex: binding.rowIndex
            }
          };
          const scopeCtx = createTemplateScopeContext(scope);

          const instance = new TemplateInstance(binding.tpl._tpl);
          instance.attach(slot, undefined, [scopeCtx, ...baseCtx, this]);
          instances.push(instance);
        });
      }

      if (Array.isArray(filterBindings) && filterBindings.length > 0) {
        filterBindings.forEach((binding) => {
          const slot = this.$?.tableHost?.querySelector?.(`[data-filter-template-slot="${binding.slotKey}"]`);
          if (!slot || !slot.isConnected || !binding.tpl?._tpl) return;

          const baseCtx = Array.isArray(binding.tpl._hctx) ? binding.tpl._hctx : [];
          const scope = {
            column: binding.column,
            model: {
              column: binding.column
            }
          };
          const scopeCtx = createTemplateScopeContext(scope);

          const instance = new TemplateInstance(binding.tpl._tpl);
          instance.attach(slot, undefined, [scopeCtx, ...baseCtx, this]);
          instances.push(instance);
        });
      }
      this._headerTemplateInstances = instances;

      if (Array.isArray(nodeBindings) && nodeBindings.length > 0) {
        nodeBindings.forEach((binding) => {
          const slot = this.$?.tableHost?.querySelector?.(`[data-header-node-slot="${binding.slotKey}"]`);
          if (!slot || !slot.isConnected || !binding.node) return;
          slot.replaceChildren();
          slot.append(binding.node.cloneNode(true));
        });
      }
    });
  }

  _syncFooterRuntime(bindings) {
    this._disposeFooterTemplateInstances();
    if (!Array.isArray(bindings) || bindings.length === 0) return;

    const instances = [];
    bindings.forEach((binding) => {
      const slot = this.$?.tableHost?.querySelector?.(`[data-footer-template-slot="${binding.slotKey}"]`);
      if (!slot || !binding.tpl?._tpl) return;

      const baseCtx = Array.isArray(binding.tpl._hctx) ? binding.tpl._hctx : [];
      const scope = {
        summary: binding.summary,
        rows: binding.rows,
        column: binding.column,
        model: {
          summary: binding.summary,
          rows: binding.rows,
          column: binding.column
        }
      };
      const scopeCtx = createTemplateScopeContext(scope);

      const instance = new TemplateInstance(binding.tpl._tpl);
      instance.attach(slot, undefined, [scopeCtx, ...baseCtx, this]);
      instances.push(instance);
    });

    this._footerTemplateInstances = instances;
  }

  _syncCellTemplateRuntime(bindings) {
    this._disposeCellTemplateInstances();
    if (!Array.isArray(bindings) || bindings.length === 0) return;

    const instances = [];
    bindings.forEach((binding) => {
      const slot = this.$?.tableHost?.querySelector?.(`[data-cell-template-slot="${binding.slotKey}"]`);
      if (!slot || !binding.tpl?._tpl) return;

      const baseCtx = Array.isArray(binding.tpl._hctx) ? binding.tpl._hctx : [];
      const scope = {
        row: binding.row,
        column: binding.column,
        sourceIndex: binding.sourceIndex,
        rowIndex: binding.rowModelIndex,
        model: {
          row: binding.row,
          column: binding.column,
          sourceIndex: binding.sourceIndex,
          rowIndex: binding.rowModelIndex
        }
      };
      const scopeCtx = createTemplateScopeContext(scope);

      const instance = new TemplateInstance(binding.tpl._tpl);
      instance.attach(slot, undefined, [scopeCtx, ...baseCtx, this]);
      instances.push(instance);
    });

    this._cellTemplateInstances = instances;
  }

  _renderGroupRow(entry, colSpan) {
    if (typeof this.groupRowTemplate === 'function') {
      try {
        const rendered = this.groupRowTemplate({
          groupKey: entry.groupKey,
          key: entry.groupKey,
          count: entry.count,
          groupField: entry.groupField,
          groupLevel: entry.groupLevel || 0,
          groupPath: Array.isArray(entry.groupPath) ? entry.groupPath : [entry.groupKey],
          groupFieldPath: Array.isArray(entry.groupFieldPath) ? entry.groupFieldPath : [entry.groupField].filter(Boolean),
          rows: Array.isArray(entry.rows) ? entry.rows : [],
          escape: escapeHtml
        });

        if (rendered && typeof rendered === 'object') {
          const htmlContent = String(rendered.content ?? '');
          const extraClass = rendered.className ? ` ${String(rendered.className)}` : '';
          return `<tr class="group-row${extraClass}"><td colspan="${colSpan}"><div class="group-row-inner">${htmlContent}</div></td></tr>`;
        }

        if (rendered != null && rendered !== '') {
          return `<tr class="group-row"><td colspan="${colSpan}"><div class="group-row-inner">${String(rendered)}</div></td></tr>`;
        }
      } catch (error) {
        // Fallback to default template.
      }
    }

    const fieldLabel = entry.groupField
      ? `<span class="group-field">${escapeHtml(entry.groupField)}</span>`
      : '';
    const keyLabel = `<span class="group-key">${escapeHtml(entry.groupKey)}</span>`;
    const countLabel = `<span class="group-count-pill">Записей: ${entry.count}</span>`;
    const level = Math.max(0, Number(entry.groupLevel || 0));
    const indent = level > 0 ? ` style="padding-inline-start:${(level * 14) + 2}px"` : '';

    return `
      <tr class="group-row">
        <td colspan="${colSpan}">
          <div class="group-row-inner">
            <div class="group-cell"${indent}>${fieldLabel}${keyLabel}${countLabel}</div>
          </div>
        </td>
      </tr>
    `;
  }

  _renderTreeCellContent(entry, content) {
    const level = Math.max(0, Number(entry?.treeLevel || 0));
    const hasChildren = Boolean(entry?.treeHasChildren);
    const opened = Boolean(entry?.treeOpened);
    const icon = opened ? 'chevron-down-s' : 'chevron-right-s';
    const sourceIndex = Number(entry?.sourceIndex);

    const toggle = hasChildren
      ? `
        <pl-icon-button
          class="tree-toggle"
          variant="link"
          iconset="pl-default"
          icon="${icon}"
          data-action="tree-toggle"
          data-source-index="${Number.isInteger(sourceIndex) ? sourceIndex : -1}"
          title="${opened ? 'Свернуть' : 'Развернуть'}"></pl-icon-button>
      `
      : '<span class="tree-spacer"></span>';

    return `
      <div class="tree-cell">
        <span class="tree-indent" style="--tree-indent:${level * 16}px"></span>
        ${toggle}
        <div class="tree-value">${content}</div>
      </div>
    `;
  }

  _isValueToken(value, tokens) {
    const normalized = String(value || '').trim().toLowerCase();
    if (!normalized) return false;
    return tokens.some((token) => normalized.includes(token));
  }

  _cellTone(field, value) {
    const f = String(field || '').toLowerCase();
    const v = String(value || '').trim().toLowerCase();

    if (!v) return 'info';

    if (f.includes('status')) return this._statusTone(v);

    if (f.includes('severity') || f.includes('priority')) {
      if (this._isValueToken(v, ['p1', 'critical', 'high', 'высок'])) return 'bad';
      if (this._isValueToken(v, ['p2', 'medium', 'средн'])) return 'warn';
      if (this._isValueToken(v, ['p3', 'low', 'низк'])) return 'ok';
      return 'info';
    }

    if (f.includes('risk')) {
      if (this._isValueToken(v, ['high', 'высок'])) return 'bad';
      if (this._isValueToken(v, ['medium', 'средн'])) return 'warn';
      if (this._isValueToken(v, ['low', 'низк'])) return 'ok';
      return 'info';
    }

    if (f.includes('environment')) {
      if (this._isValueToken(v, ['prod'])) return 'bad';
      if (this._isValueToken(v, ['stage', 'stg', 'preprod'])) return 'warn';
      return 'info';
    }

    if (this._isValueToken(v, ['active', 'resolved', 'done', 'готов', 'решен', 'стабил'])) return 'ok';
    if (this._isValueToken(v, ['progress', 'work', 'наблю', 'контрол', 'в работе'])) return 'warn';
    if (this._isValueToken(v, ['risk', 'block', 'эскала', 'ошиб', 'проблем'])) return 'bad';
    return 'info';
  }

  _renderCellContent(column, row, runtime = null) {
    const cellTpl = this._cellTemplateForColumn(column);
    if (cellTpl && runtime?.bindings) {
      const slotKey = `${runtime.rowModelIndex}:${runtime.sourceIndex}:${column.id || column.field || 'col'}`;
      runtime.bindings.push({
        slotKey,
        tpl: cellTpl,
        row,
        column,
        sourceIndex: runtime.sourceIndex,
        rowModelIndex: runtime.rowModelIndex
      });
      return `<div data-cell-template-slot="${escapeHtml(slotKey)}"></div>`;
    }

    const editor = this._normalizeEditor(column);
    const rawValue = column?.field ? row?.[column.field] : '';
    let value = formatValue(column, row);
    const field = String(column?.field || '').toLowerCase();
    if (!field) return escapeHtml(value);

    if ((editor?.type === 'combobox' || editor?.type === 'select') && Array.isArray(editor.options)) {
      const textProperty = editor.textProperty || 'text';
      const valueProperty = editor.valueProperty || 'value';
      const option = editor.options.find((item) => String(item?.[valueProperty]) === String(rawValue ?? ''));
      if (option?.[textProperty] != null) value = String(option[textProperty]);
    }

    if (editor?.type === 'checkbox' || editor?.type === 'boolean') {
      const checked = normalizeBoolean(rawValue);
      const tone = checked ? 'ok' : 'info';
      return `<span class="cell-pill ${tone}">${checked ? 'Да' : 'Нет'}</span>`;
    }

    const asPill = [
      'status',
      'priority',
      'severity',
      'environment',
      'risk',
      'qa_status',
      'type'
    ].some((token) => field.includes(token));

    if (!asPill) return escapeHtml(value);

    const tone = this._cellTone(field, value);
    return `<span class="cell-pill ${tone}">${escapeHtml(value)}</span>`;
  }

  _detailFormHtml(row, rowKey, sourceIndex, leafColumns) {
    if (this.detailVariant === 'team') {
      return this._detailTeamFormHtml(row, rowKey, sourceIndex);
    }

    const detailLeaf = Array.isArray(this.detailFields) && this.detailFields.length > 0
      ? leafColumns.filter((column) => this.detailFields.includes(column.field))
      : leafColumns.slice(0, 6);

    const fields = detailLeaf.map((column) => `
      <pl-input
        data-field="${escapeHtml(column.field)}"
        label="${escapeHtml(column.header || column.field || column.id)}"
        value="${escapeHtml(formatValue(column, row))}"></pl-input>
    `).join('');

    return `
      <pl-flex-layout vertical stretch class="detail-form" data-row-key="${escapeHtml(rowKey)}" data-source-index="${sourceIndex}">
        <pl-flex-layout wrap gap="8" stretch>${fields}</pl-flex-layout>
        <pl-flex-layout class="detail-actions" gap="8">
          <pl-button variant="primary" label="Применить" data-action="save-detail" data-row-key="${escapeHtml(rowKey)}" data-source-index="${sourceIndex}"></pl-button>
          <pl-button variant="secondary" label="Свернуть" data-action="toggle-detail" data-row-key="${escapeHtml(rowKey)}" data-source-index="${sourceIndex}"></pl-button>
        </pl-flex-layout>
      </pl-flex-layout>
    `;
  }

  _asNumber(value, fallback = 0) {
    const n = Number(value);
    return Number.isFinite(n) ? n : fallback;
  }

  _statusTone(status) {
    const normalized = String(status || '').trim().toLowerCase();
    if (!normalized) return 'neutral';
    if (normalized.includes('active') || normalized.includes('стаб')) return 'ok';
    if (normalized.includes('риск') || normalized.includes('эскал') || normalized.includes('block')) return 'bad';
    if (normalized.includes('контроль') || normalized.includes('warning')) return 'warn';
    return 'info';
  }

  _toneHighGood(value, goodFrom, warnFrom) {
    if (value >= goodFrom) return 'ok';
    if (value >= warnFrom) return 'warn';
    return 'bad';
  }

  _toneLowGood(value, goodTo, warnTo) {
    if (value <= goodTo) return 'ok';
    if (value <= warnTo) return 'warn';
    return 'bad';
  }

  _detailPill(text, tone = 'neutral') {
    return `<span class="detail-pill ${tone}">${escapeHtml(text)}</span>`;
  }

  _metricCard(label, value, hint, tone = 'neutral') {
    return `
      <div class="metric ${tone}">
        <div class="metric-label">${escapeHtml(label)}</div>
        <div class="metric-value">${escapeHtml(value)}</div>
        <div class="metric-hint">${escapeHtml(hint)}</div>
      </div>
    `;
  }

  _detailTeamFormHtml(row, rowKey, sourceIndex) {
    const velocity = this._asNumber(row.velocity);
    const capacity = this._asNumber(row.capacity_pct);
    const incidents = this._asNumber(row.incident_rate);
    const deployFreq = this._asNumber(row.deploy_frequency);

    const statusTone = this._statusTone(row.status);
    const capacityTone = this._toneHighGood(capacity, 90, 80);
    const velocityTone = this._toneHighGood(velocity, 35, 25);
    const incidentsTone = this._toneLowGood(incidents, 0.5, 1.1);
    const deployTone = this._toneHighGood(deployFreq, 7, 4);

    const tags = [
      this._detailPill(`Статус: ${row.status || '—'}`, statusTone),
      this._detailPill(`Спринт: ${row.current_sprint || '—'}`, 'info'),
      this._detailPill(`Майлстоун: ${row.next_milestone || '—'}`, 'warn')
    ].join('');

    const metrics = [
      this._metricCard('Velocity', String(velocity), 'историй / спринт', velocityTone),
      this._metricCard('Capacity', `${capacity}%`, 'ресурс команды', capacityTone),
      this._metricCard('Incidents', incidents.toFixed(1), 'в неделю', incidentsTone),
      this._metricCard('Deploy', String(deployFreq), 'в неделю', deployTone)
    ].join('');

    return `
      <pl-flex-layout vertical stretch class="detail-form rich" data-row-key="${escapeHtml(rowKey)}" data-source-index="${sourceIndex}">
        <div class="detail-head">
          <div class="detail-title">
            <div class="detail-name">${escapeHtml(row.team_name || 'Команда')}</div>
            <div class="detail-sub">${escapeHtml(row.direction || 'Без направления')} · Руководитель: ${escapeHtml(row.manager || '—')} · Релиз: ${escapeHtml(row.last_release || '—')}</div>
          </div>
          <div class="detail-tags">${tags}</div>
        </div>

        <div class="detail-metrics">${metrics}</div>

        <pl-flex-layout wrap stretch class="detail-edit-grid detail-edit-row">
          <pl-input data-field="team_name" label="Команда" value="${escapeHtml(row.team_name || '')}"></pl-input>
          <pl-input data-field="manager" label="Руководитель" value="${escapeHtml(row.manager || '')}"></pl-input>
          <pl-combobox data-field="status" data-detail-field="status" label="Статус"></pl-combobox>
          <pl-combobox data-field="direction" data-detail-field="direction" label="Направление"></pl-combobox>
        </pl-flex-layout>

        <pl-flex-layout wrap stretch class="detail-edit-grid detail-edit-row">
          <pl-input data-field="current_sprint" label="Спринт" value="${escapeHtml(row.current_sprint || '')}"></pl-input>
          <pl-input data-field="next_milestone" label="Майлстоун" value="${escapeHtml(row.next_milestone || '')}"></pl-input>
          <pl-input data-field="last_release" label="Последний релиз" value="${escapeHtml(row.last_release || '')}"></pl-input>
        </pl-flex-layout>

        <pl-flex-layout class="detail-actions" gap="8">
          <pl-button variant="primary" label="Применить" data-action="save-detail" data-row-key="${escapeHtml(rowKey)}" data-source-index="${sourceIndex}"></pl-button>
          <pl-button variant="secondary" label="Свернуть" data-action="toggle-detail" data-row-key="${escapeHtml(rowKey)}" data-source-index="${sourceIndex}"></pl-button>
        </pl-flex-layout>
      </pl-flex-layout>
    `;
  }

  _detailOptionsByField(field) {
    if (field === 'status') return DETAIL_STATUS_OPTIONS;
    if (field === 'direction') return DETAIL_DIRECTION_OPTIONS;
    return [];
  }

  _syncDetailEditors() {
    if (!this.$?.tableHost) return;
    this.$.tableHost.querySelectorAll('.detail-form[data-source-index]').forEach((form) => {
      const sourceIndex = Number(form.dataset.sourceIndex);
      const row = this.data?.[sourceIndex] || {};
      form.querySelectorAll('pl-combobox[data-detail-field]').forEach((combobox) => {
        const field = String(combobox.dataset.detailField || combobox.dataset.field || '').trim();
        if (!field) return;
        combobox.data = this._detailOptionsByField(field);
        combobox.textProperty = 'text';
        combobox.valueProperty = 'value';
        combobox.value = row[field] == null ? null : String(row[field]);
      });
    });
  }

  _pathTarget(event, predicate) {
    return event.composedPath().find((node) => node instanceof HTMLElement && predicate(node)) || null;
  }

  _onClick(event) {
    const settingsBtn = this._pathTarget(event, (node) => node.id === 'btnSettings');
    if (settingsBtn && this.enableSettings) {
      this._settingsOpen = !this._settingsOpen;
      return;
    }

    const actionEl = this._pathTarget(event, (node) => Boolean(node.dataset?.action));
    if (actionEl) {
      const action = actionEl.dataset.action;
      if (action === 'close-settings') {
        this._settingsOpen = false;
        return;
      }
      if (action === 'save-inline') {
        this._commitInlineEdit();
        return;
      }
      if (action === 'cancel-inline') {
        this._cancelInlineEdit();
        return;
      }
      if (action === 'sort-column') {
        const columnId = String(actionEl.dataset.columnId || '');
        this._toggleSortByColumn(columnId);
        return;
      }
      if (action === 'toggle-select-all') {
        this._toggleSelectAllVisible(Boolean(actionEl.checked));
        this._syncSelectedRowHighlight();
        return;
      }
      if (action === 'toggle-select-row') {
        const sourceIndex = Number(actionEl.dataset.sourceIndex);
        if (!Number.isInteger(sourceIndex) || sourceIndex < 0) return;
        const row = this.data?.[sourceIndex];
        if (!row) return;
        this._toggleRowSelection(row, sourceIndex, Boolean(actionEl.checked));
        this._syncSelectedRowHighlight();
        return;
      }
      if (action === 'tree-toggle') {
        const sourceIndex = Number(actionEl.dataset.sourceIndex);
        this._toggleTreeRow(sourceIndex);
        return;
      }
      if (action === 'toggle-detail') {
        const key = String(actionEl.dataset.rowKey || '');
        this._expandedKey = this._expandedKey === key ? '' : key;
        return;
      }
      if (action === 'save-detail') {
        const sourceIndex = Number(actionEl.dataset.sourceIndex);
        if (!Number.isInteger(sourceIndex) || sourceIndex < 0) return;

        const form = this.$.tableHost.querySelector(`.detail-form[data-source-index="${sourceIndex}"]`);
        if (!form) return;

        const patch = {};
        form.querySelectorAll('pl-input[data-field], pl-combobox[data-field], pl-datetime[data-field], pl-time[data-field], pl-checkbox[data-field], pl-textarea[data-field]').forEach((control) => {
          const field = control.dataset.field;
          if (!field) return;
          if (control.tagName === 'PL-CHECKBOX') {
            patch[field] = Boolean(control.checked);
            return;
          }
          patch[field] = control.value;
        });

        const currentRow = this.data?.[sourceIndex] || {};
        const updated = { ...currentRow, ...patch };
        this.splice('data', sourceIndex, 1, updated);
        this.dispatchEvent(new CustomEvent('tableDetailSave', {
          detail: { row: updated, sourceIndex, patch },
          bubbles: true,
          composed: true
        }));
        return;
      }
      return;
    }

    const inlineEditor = this._pathTarget(event, (node) => node.dataset?.inlineEditor === 'true');
    if (inlineEditor) return;

    const dataRow = this._pathTarget(event, (node) => node.classList?.contains('data-row'));
    if (!dataRow) return;
    const sourceIndex = Number(dataRow.dataset.sourceIndex);
    if (!Number.isInteger(sourceIndex) || sourceIndex < 0) return;

    const row = this.data?.[sourceIndex];
    if (!row) return;

    this.selected = row;
    this.dispatchEvent(new CustomEvent('rowClick', {
      detail: { model: { row } },
      bubbles: true,
      composed: true
    }));
    this._syncSelectedRowHighlight();
  }

  _onDblClick(event) {
    if (this.inlineEdit) {
      const cell = this._pathTarget(event, (node) => node.tagName === 'TD' && node.dataset?.editable === 'true');
      if (cell) {
        const sourceIndex = Number(cell.dataset.sourceIndex);
        const field = String(cell.dataset.field || '');
        if (Number.isInteger(sourceIndex) && sourceIndex >= 0 && field) {
          this._syncColumnsSource();
          const applied = applySettingsToColumns(this._activeColumns || [], this.settings);
          const column = (applied.leafColumns || []).find((item) => item.field === field);
          if (column) {
            this._startInlineEdit(sourceIndex, column);
            event.preventDefault();
            event.stopPropagation();
            return;
          }
        }
      }
    }

    const dataRow = this._pathTarget(event, (node) => node.classList?.contains('data-row'));
    if (!dataRow) return;
    const sourceIndex = Number(dataRow.dataset.sourceIndex);
    if (!Number.isInteger(sourceIndex) || sourceIndex < 0) return;
    const row = this.data?.[sourceIndex];
    if (!row) return;

    this.dispatchEvent(new CustomEvent('rowDblClick', {
      detail: { model: { row } },
      bubbles: true,
      composed: true
    }));

    const legacyEvent = new CustomEvent('rowDblclick', {
      bubbles: true,
      composed: true
    });
    legacyEvent.model = { row };
    this.dispatchEvent(legacyEvent);

    if (this.tree) this._toggleTreeRow(sourceIndex);
  }

  _clearMergeHover() {
    this.$.tableHost?.querySelectorAll('tr.data-row.merge-hover').forEach((row) => {
      row.classList.remove('merge-hover');
    });
    this._mergeHoverToken = null;
  }

  _setMergeHover(startIndex, span) {
    const token = `${startIndex}:${span}`;
    if (this._mergeHoverToken === token) return;

    this._clearMergeHover();
    this._mergeHoverToken = token;

    for (let i = startIndex; i < startIndex + span; i += 1) {
      const row = this.$.tableHost?.querySelector(`tr.data-row[data-model-index="${i}"]`);
      if (row) row.classList.add('merge-hover');
    }
  }

  _onTableMouseOver(event) {
    const td = event.composedPath().find((node) => node instanceof HTMLElement && node.tagName === 'TD');
    if (!td) {
      this._clearMergeHover();
      return;
    }

    const span = Number(td.dataset.mergeSpan || '0');
    const start = Number(td.dataset.mergeStart || '-1');
    if (span > 1 && start >= 0) {
      this._setMergeHover(start, span);
    } else {
      this._clearMergeHover();
    }
  }

  _onTableMouseLeave() {
    this._clearMergeHover();
  }

  _onTableScroll() {
    this._syncGroupRowOffset();
    this._tryLoadMore();
  }

  _onMouseDown(event) {
    const handle = this._pathTarget(event, (node) => node.dataset?.action === 'resize-column');
    if (!handle) return;

    const columnId = String(handle.dataset.columnId || '').trim();
    if (!columnId) return;

    const applied = applySettingsToColumns(this._activeColumns || [], this.settings);
    const column = (applied.leafColumns || []).find((item) => item.id === columnId);
    if (!column?.resizable) return;

    event.preventDefault();
    event.stopPropagation();

    this._resizeState = {
      columnId,
      startX: event.clientX,
      startWidth: this._columnWidth(column)
    };

    window.addEventListener('mousemove', this._bound.onResizeMove);
    window.addEventListener('mouseup', this._bound.onResizeEnd);
  }

  _onResizeMove(event) {
    if (!this._resizeState) return;
    const delta = Number(event.clientX) - Number(this._resizeState.startX);
    const nextWidth = Math.max(56, Math.round(Number(this._resizeState.startWidth) + delta));
    this.columnWidths = {
      ...(this.columnWidths || {}),
      [this._resizeState.columnId]: nextWidth
    };
  }

  _onResizeEnd() {
    if (!this._resizeState) return;
    this._resizeState = null;
    window.removeEventListener('mousemove', this._bound.onResizeMove);
    window.removeEventListener('mouseup', this._bound.onResizeEnd);
  }
}

if (!customElements.get('pl-table-pro')) {
  customElements.define('pl-table-pro', PlTablePro);
}
