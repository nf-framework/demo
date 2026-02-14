import { PlElement, html, css } from 'polylib';
import '@plcmp/pl-button';
import '@plcmp/pl-icon-button';
import '@plcmp/pl-iconset-default';
import '@plcmp/pl-input';
import '@plcmp/pl-flex-layout';
import '@plcmp/pl-datetime';
import '@plcmp/pl-combobox';
import '@plcmp/pl-checkbox';
import '@plcmp/pl-textarea';

import '/generated/components/table-pro/pl-table-settings.js';

import { applySettingsToColumns } from '/generated/components/table-pro/helpers/columns.js';
import { buildMergeMap, buildRowsModel } from '/generated/components/table-pro/helpers/rows.js';
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

class PlTablePro extends PlElement {
  static properties = {
    columns: { type: Array, value: () => [], observer: '_stateChanged' },
    data: { type: Array, value: () => [], observer: '_stateChanged' },
    selected: { type: Object, value: null },
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
      color: var(--pl-text-color, #2a3143);
      background: var(--pl-surface-color, #fff);
      border: 1px solid var(--pl-grey-light, #e5e7eb);
      border-radius: var(--pl-border-radius, 10px);
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
      border-bottom: 1px solid var(--pl-grey-light, #e5e7eb);
      background: var(--pl-grey-lightest, #f8fafc);
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
      background:
        linear-gradient(
          180deg,
          color-mix(in srgb, var(--pl-grey-lightest, #f8fafc), white 45%) 0%,
          var(--pl-background-color, #fff) 38%
        );
    }

    table {
      width: max-content;
      min-width: 100%;
      border-collapse: separate;
      border-spacing: 0;
      table-layout: fixed;
    }

    thead th {
      position: sticky;
      top: 0;
      z-index: 5;
      background:
        linear-gradient(
          180deg,
          color-mix(in srgb, var(--pl-grey-lightest, #f8fafc), white 35%) 0%,
          var(--pl-grey-lightest, #f8fafc) 100%
        );
      border-bottom: 1px solid var(--pl-grey-light, #e5e7eb);
      border-right: 1px solid var(--pl-grey-light, #e5e7eb);
      color: var(--pl-header-color, #4b5b6a);
      font: var(--pl-header-font);
      text-align: left;
      white-space: nowrap;
      padding: 8px 10px;
      box-sizing: border-box;
      min-height: var(--pl-base-size);
    }

    thead th.group {
      text-align: center;
      font-weight: 700;
    }

    thead th:last-child,
    tbody td:last-child {
      border-right: 0;
    }

    tbody td {
      border-bottom: 1px solid var(--pl-grey-light, #e5e7eb);
      border-right: 1px solid var(--pl-grey-light, #e5e7eb);
      padding: 6px 10px;
      box-sizing: border-box;
      font: var(--pl-text-font);
      color: var(--pl-text-color, #2a3143);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      height: var(--pl-base-size);
      background: var(--pl-background-color, #fff);
      transition: background .16s ease-out;
    }

    tbody tr.data-row.row-even td {
      background: color-mix(in srgb, var(--pl-grey-lightest, #f8fafc), white 40%);
    }

    tbody tr.data-row.row-odd td {
      background: var(--pl-background-color, #fff);
    }

    tbody tr.data-row:hover td {
      background: color-mix(in srgb, var(--pl-primary-lightest, #eaf4ef), white 22%);
    }

    tbody tr.data-row.merge-hover td {
      background: color-mix(in srgb, var(--pl-primary-lightest, #eaf4ef), white 18%);
    }

    tbody tr.data-row.selected td {
      background: color-mix(in srgb, var(--pl-primary-lightest, #eaf4ef), white 12%);
      box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--pl-primary-light, #b8d8d0), white 20%);
    }

    .align-right {
      text-align: right;
    }

    .group-row td {
      background:
        linear-gradient(
          90deg,
          color-mix(in srgb, var(--pl-grey-lightest, #f8fafc), white 28%) 0%,
          color-mix(in srgb, var(--pl-primary-lightest, #eaf4ef), white 55%) 100%
        );
      font-weight: 700;
      color: var(--pl-header-color, #4b5b6a);
      border-bottom: 1px solid var(--pl-grey-light, #e5e7eb);
      padding: 8px 10px;
    }

    .group-row .group-count {
      margin-inline-start: 8px;
      color: var(--pl-grey-darkest, #85919c);
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
      color: var(--pl-header-color, #4b5b6a);
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
      border: 1px solid color-mix(in srgb, var(--pl-primary-light, #b8d8d0), white 30%);
      background: color-mix(in srgb, var(--pl-primary-lightest, #eaf4ef), white 28%);
      font: var(--pl-text-font);
      font-size: 12px;
      color: var(--pl-primary-dark, #2f6d69);
      flex-shrink: 0;
    }

    .group-count-pill {
      margin-inline-start: auto;
      display: inline-flex;
      align-items: center;
      height: 20px;
      padding: 0 8px;
      border-radius: 999px;
      border: 1px solid var(--pl-grey-light, #e5e7eb);
      background: color-mix(in srgb, var(--pl-background-color, #fff), var(--pl-grey-lightest, #f8fafc) 18%);
      font: var(--pl-text-font);
      font-size: 12px;
      color: var(--pl-grey-darkest, #85919c);
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
      border: 1px solid var(--pl-grey-light, #e5e7eb);
      background: var(--pl-background-color, #fff);
      font: var(--pl-text-font);
      font-size: 12px;
      color: var(--pl-grey-darkest, #85919c);
      white-space: nowrap;
    }

    .group-template-pill.ok {
      color: var(--pl-primary-dark, #2f6d69);
      border-color: color-mix(in srgb, var(--pl-primary-light, #b8d8d0), white 35%);
      background: color-mix(in srgb, var(--pl-primary-lightest, #eaf4ef), white 35%);
    }

    .group-template-pill.warn {
      color: #8f6a00;
      border-color: #f5df9e;
      background: #fff8e1;
    }

    .group-template-pill.bad {
      color: #8b2d2d;
      border-color: #f6b9b5;
      background: #ffeceb;
    }

    .cell-pill {
      display: inline-flex;
      align-items: center;
      max-width: 100%;
      height: 22px;
      padding: 0 10px;
      box-sizing: border-box;
      border-radius: 999px;
      border: 1px solid var(--pl-grey-light, #e5e7eb);
      background: var(--pl-grey-lightest, #f8fafc);
      color: var(--pl-header-color, #4b5b6a);
      font: var(--pl-text-font);
      font-size: 12px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .cell-pill.ok {
      color: var(--pl-primary-dark, #2f6d69);
      border-color: color-mix(in srgb, var(--pl-primary-light, #b8d8d0), white 35%);
      background: color-mix(in srgb, var(--pl-primary-lightest, #eaf4ef), white 35%);
    }

    .cell-pill.warn {
      color: #8f6a00;
      border-color: #f5df9e;
      background: #fff8e1;
    }

    .cell-pill.bad {
      color: #8b2d2d;
      border-color: #f6b9b5;
      background: #ffeceb;
    }

    .cell-pill.info {
      color: #31517d;
      border-color: #c6d6f6;
      background: #edf3ff;
    }

    td.editable-cell {
      cursor: pointer;
    }

    td.inline-editing {
      padding: 4px 6px;
      white-space: normal;
      overflow: visible;
      text-overflow: clip;
      background: color-mix(in srgb, var(--pl-primary-lightest, #eaf4ef), white 14%);
    }

    .inline-edit-wrap {
      display: flex;
      align-items: center;
      gap: 4px;
      width: 100%;
      min-width: 0;
    }

    .inline-edit-field {
      flex: 1;
      min-width: 120px;
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
      background: var(--pl-grey-lightest, #f8fafc);
    }

    .detail-shell {
      padding: 10px;
      border-top: 1px dashed var(--pl-grey-base, #cad0d6);
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
      border: 1px solid var(--pl-grey-light, #e5e7eb);
      border-radius: calc(var(--pl-border-radius, 10px) + 2px);
      background:
        linear-gradient(
          130deg,
          color-mix(in srgb, var(--pl-primary-lightest, #eaf4ef), white 65%) 0%,
          color-mix(in srgb, var(--pl-grey-lightest, #f8fafc), white 45%) 100%
        );
    }

    .detail-title {
      min-width: 0;
    }

    .detail-name {
      font: var(--pl-header-font);
      color: var(--pl-header-color, #4b5b6a);
      font-weight: 700;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .detail-sub {
      margin-top: 2px;
      font: var(--pl-text-font);
      color: var(--pl-grey-darkest, #85919c);
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
      color: var(--pl-header-color, #4b5b6a);
      background: var(--pl-grey-lightest, #f8fafc);
    }

    .detail-pill.ok {
      color: var(--pl-primary-dark, #2f6d69);
      background: color-mix(in srgb, var(--pl-primary-lightest, #eaf4ef), white 30%);
      border-color: color-mix(in srgb, var(--pl-primary-light, #b8d8d0), white 35%);
    }

    .detail-pill.warn {
      color: #8f6a00;
      background: #fff8e1;
      border-color: #f5df9e;
    }

    .detail-pill.bad {
      color: #8b2d2d;
      background: #ffeceb;
      border-color: #f6b9b5;
    }

    .detail-pill.info {
      color: #31517d;
      background: #edf3ff;
      border-color: #c6d6f6;
    }

    .detail-pill.neutral {
      color: var(--pl-grey-darkest, #85919c);
      background: var(--pl-grey-lightest, #f8fafc);
      border-color: var(--pl-grey-light, #e5e7eb);
    }

    .detail-metrics {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 8px;
    }

    .metric {
      border: 1px solid var(--pl-grey-light, #e5e7eb);
      border-radius: var(--pl-border-radius, 10px);
      background: var(--pl-surface-color, #fff);
      padding: 8px 10px;
      box-sizing: border-box;
      min-height: 68px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      gap: 2px;
      box-shadow: 0 1px 0 color-mix(in srgb, var(--pl-grey-light, #e5e7eb), white 25%);
    }

    .metric.ok {
      border-color: color-mix(in srgb, var(--pl-primary-light, #b8d8d0), white 20%);
      background: color-mix(in srgb, var(--pl-primary-lightest, #eaf4ef), white 55%);
    }

    .metric.warn {
      border-color: #f5df9e;
      background: #fffbf0;
    }

    .metric.bad {
      border-color: #f6b9b5;
      background: #fff3f2;
    }

    .metric.info {
      border-color: #c6d6f6;
      background: #f5f8ff;
    }

    .metric-label {
      font: var(--pl-text-font);
      color: var(--pl-grey-darkest, #85919c);
      font-size: 12px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .metric-value {
      font: var(--pl-header-font);
      color: var(--pl-header-color, #4b5b6a);
      font-weight: 700;
      font-size: 18px;
      line-height: 1.1;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .metric-hint {
      font: var(--pl-text-font);
      color: var(--pl-grey-darkest, #85919c);
      font-size: 12px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .detail-section-title {
      font: var(--pl-header-font);
      color: var(--pl-header-color, #4b5b6a);
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
      color: var(--pl-grey-darkest, #85919c);
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
      background: color-mix(in srgb, var(--pl-grey-darkest, #85919c), transparent 72%);
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
      <div id="tableHost" class="table-host"></div>
    </div>

    <div id="settingsLayer" class="settings-layer" hidden>
      <div class="settings-backdrop" data-action="close-settings"></div>
      <pl-table-settings id="settingsPanel"></pl-table-settings>
    </div>
  `;

  constructor() {
    super();
    this._mergeHoverToken = null;

    this._bound = {
      onClick: this._onClick.bind(this),
      onDblClick: this._onDblClick.bind(this),
      onKeyDown: this._onKeyDown.bind(this),
      onSettingsChange: this._onSettingsChange.bind(this),
      onSettingsClose: this._onSettingsClose.bind(this),
      onTableMouseOver: this._onTableMouseOver.bind(this),
      onTableMouseLeave: this._onTableMouseLeave.bind(this)
    };
  }

  connectedCallback() {
    super.connectedCallback();
    this.addEventListener('click', this._bound.onClick);
    this.addEventListener('dblclick', this._bound.onDblClick);
    this.$.settingsPanel?.addEventListener('table-settings-change', this._bound.onSettingsChange);
    this.$.settingsPanel?.addEventListener('table-settings-close', this._bound.onSettingsClose);
    this.$.tableHost?.addEventListener('mouseover', this._bound.onTableMouseOver);
    this.$.tableHost?.addEventListener('mouseleave', this._bound.onTableMouseLeave);
    this.$.tableHost?.addEventListener('keydown', this._bound.onKeyDown);

    this._syncSettingsPanel();
    this._settingsUiChanged();
    this._renderTable();
  }

  disconnectedCallback() {
    this.removeEventListener('click', this._bound.onClick);
    this.removeEventListener('dblclick', this._bound.onDblClick);
    this.$.settingsPanel?.removeEventListener('table-settings-change', this._bound.onSettingsChange);
    this.$.settingsPanel?.removeEventListener('table-settings-close', this._bound.onSettingsClose);
    this.$.tableHost?.removeEventListener('mouseover', this._bound.onTableMouseOver);
    this.$.tableHost?.removeEventListener('mouseleave', this._bound.onTableMouseLeave);
    this.$.tableHost?.removeEventListener('keydown', this._bound.onKeyDown);
    super.disconnectedCallback();
  }

  _stateChanged() {
    if (!this.isConnected) return;
    this._syncSettingsPanel();
    this._renderTable();
  }

  _settingsUiChanged() {
    if (!this.$?.btnSettings || !this.$?.settingsLayer) return;
    this.$.btnSettings.hidden = !this.enableSettings;
    this.$.settingsLayer.hidden = !this._settingsOpen;
  }

  _syncSettingsPanel() {
    if (!this.$?.settingsPanel) return;
    this.$.settingsPanel.columns = Array.isArray(this.columns) ? this.columns : [];
    this.$.settingsPanel.settingsKey = this.settingsKey || 'generated.pl-table-pro.default';
    if (this.settings) {
      this.$.settingsPanel.settings = this.settings;
    } else {
      this.$.settingsPanel.reload();
      this.settings = this.$.settingsPanel.getSettings();
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
    const field = this.rowKeyField || 'id';
    if (row && row[field] != null && row[field] !== '') return String(row[field]);
    return String(sourceIndex);
  }

  _selectedRowKey() {
    if (!this.selected) return '';

    const field = this.rowKeyField || 'id';
    const value = this.selected?.[field];
    if (value != null && value !== '') return String(value);

    const source = Array.isArray(this.data) ? this.data : [];
    const index = source.indexOf(this.selected);
    return index >= 0 ? String(index) : '';
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
    return Boolean(this._normalizeEditor(column));
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
    if (!editor) return this._renderCellContent(column, row);

    const rawValue = row?.[column.field];
    const currentValue = rawValue == null ? '' : String(rawValue);
    const tag = this._editorComponentTag(editor);

    let inputHtml = '';
    if (tag === 'pl-checkbox') {
      inputHtml = `<pl-checkbox data-inline-input="true"${rawValue ? ' checked' : ''}></pl-checkbox>`;
    } else if (tag === 'pl-datetime') {
      const dateType = editor.type === 'date' ? 'date' : (String(editor.datetimeType || 'datetime').toLowerCase() === 'date' ? 'date' : 'datetime');
      inputHtml = `<pl-datetime data-inline-input="true" type="${dateType}" value="${escapeHtml(currentValue)}"></pl-datetime>`;
    } else {
      const valueAttr = currentValue === '' ? '' : ` value="${escapeHtml(currentValue)}"`;
      const inputTypeAttr = (tag === 'pl-input' && editor.type === 'number') ? ' type="number"' : '';
      const propsAttr = this._editorPropsToAttributes(editor);
      inputHtml = `<${tag} data-inline-input="true"${inputTypeAttr}${valueAttr}${propsAttr}></${tag}>`;
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

  _focusInlineEditor() {
    if (!this._editingCell || !this.$?.tableHost) return;
    const input = this.$.tableHost.querySelector('[data-inline-editor="true"] [data-inline-input="true"]');
    if (!input) return;
    input.focus?.();
    const nativeInput = input.shadowRoot?.querySelector('input, textarea');
    nativeInput?.focus?.();
    nativeInput?.select?.();
  }

  _syncInlineEditorRuntime(leafColumns) {
    if (!this._editingCell || !Array.isArray(leafColumns)) return;
    const column = leafColumns.find((item) => item.field === this._editingCell.field);
    const editor = this._normalizeEditor(column);
    if (!editor) return;

    const input = this.$?.tableHost?.querySelector('[data-inline-editor="true"] [data-inline-input="true"]');
    if (!input) return;

    if (editor.type === 'combobox' || editor.type === 'select') {
      const options = Array.isArray(editor.options) ? editor.options : [];
      input.data = options;
      input.textProperty = editor.textProperty || 'text';
      input.valueProperty = editor.valueProperty || 'value';
      const value = this.data?.[this._editingCell.sourceIndex]?.[column.field];
      input.value = value == null ? null : String(value);
    }

    if (editor.type === 'custom' && editor.props && typeof editor.props === 'object') {
      Object.entries(editor.props).forEach(([key, value]) => {
        try {
          input[key] = value;
        } catch {
          // ignore unsupported props on custom editors
        }
      });
    }

    setTimeout(() => this._focusInlineEditor(), 0);
  }

  _startInlineEdit(sourceIndex, column) {
    if (!this.inlineEdit || !column?.field) return;
    const editor = this._normalizeEditor(column);
    if (!editor) return;

    const next = {
      sourceIndex: Number(sourceIndex),
      field: column.field,
      columnId: column.id,
      editorType: editor.type
    };

    const same = this._editingCell
      && Number(this._editingCell.sourceIndex) === next.sourceIndex
      && this._editingCell.field === next.field;
    if (same) return;
    this._editingCell = next;
  }

  _cancelInlineEdit() {
    if (!this._editingCell) return;
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
      return Boolean(value);
    }
    return value;
  }

  _readInlineEditorValue() {
    const wrap = this.$?.tableHost?.querySelector('[data-inline-editor="true"]');
    const input = wrap?.querySelector('[data-inline-input="true"]');
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

    const applied = applySettingsToColumns(this.columns || [], this.settings);
    const leafColumns = applied.leafColumns || [];
    const column = leafColumns.find((item) => item.field === field);
    const editor = this._normalizeEditor(column);

    const rawValue = this._readInlineEditorValue();
    const nextValue = this._coerceEditorValue(rawValue, editor);
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

  _renderTable() {
    if (!this.$?.tableHost) return;

    const applied = applySettingsToColumns(this.columns || [], this.settings);
    const topColumns = applied.columns;
    const leafColumns = applied.leafColumns;
    const settings = applied.settings;

    if (!leafColumns.length) {
      this.$.tableHost.innerHTML = '<div class="empty">Нет видимых колонок. Включите нужные в настройках.</div>';
      return;
    }

    const groupByColumn = leafColumns.find((column) => column.id === settings.groupBy);
    const groupByField = groupByColumn?.field || null;

    const rowsModel = buildRowsModel(this.data || [], groupByField);
    const mergeColumns = leafColumns.filter((column) => Boolean(column.merge));
    const mergeMap = buildMergeMap(rowsModel, mergeColumns);
    const selectedRowKey = this._selectedRowKey();

    const headerRows = buildHeaderMatrix(topColumns);
    const headerDepth = Math.max(1, headerRows.length);
    const thExpand = this.masterDetail ? `<th class="expander-col" rowspan="${headerDepth}"></th>` : '';

    const headerHtml = headerRows.map((row, rowIndex) => {
      const cells = row.map((cell) => {
        const { column, isGroup, rowSpan, colSpan } = cell;
        const width = !isGroup && column.width
          ? ` style="min-width:${Number(column.width)}px;max-width:${Number(column.width)}px;"`
          : '';
        const className = isGroup ? ' class="group"' : '';
        const rowSpanAttr = rowSpan > 1 ? ` rowspan="${rowSpan}"` : '';
        const colSpanAttr = colSpan > 1 ? ` colspan="${colSpan}"` : '';

        return `<th${className}${rowSpanAttr}${colSpanAttr}${width}>${escapeHtml(column.header || column.field || column.id)}</th>`;
      }).join('');

      return `<tr>${rowIndex === 0 ? thExpand : ''}${cells}</tr>`;
    }).join('');

    let dataRowOrder = 0;
    const rowsHtml = rowsModel.map((entry, rowModelIndex) => {
      if (entry.kind === 'group') {
        const colSpan = leafColumns.length + (this.masterDetail ? 1 : 0);
        return this._renderGroupRow(entry, colSpan);
      }

      const row = entry.row;
      const rowKey = this._rowKey(row, entry.sourceIndex);
      const isSelected = selectedRowKey !== '' && selectedRowKey === rowKey;
      const zebraClass = (dataRowOrder % 2 === 0) ? ' row-even' : ' row-odd';
      dataRowOrder += 1;
      const selectedClass = isSelected ? ' selected' : '';

      const cells = [];
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

      leafColumns.forEach((column) => {
        const merge = mergeMap.get(`${rowModelIndex}:${column.id}`);
        if (merge?.skip) return;

        const rowSpan = merge?.rowSpan > 1 ? ` rowspan="${merge.rowSpan}"` : '';
        const mergeAttrs = merge?.rowSpan > 1 ? ` data-merge-start="${rowModelIndex}" data-merge-span="${merge.rowSpan}"` : '';
        const alignClass = column.align === 'right' ? 'align-right' : '';
        const isEditing = this._isCellEditing(entry.sourceIndex, column);
        const isEditable = this._isEditableColumn(column, merge);
        const editableClass = isEditable ? ' editable-cell' : '';
        const editingClass = isEditing ? ' inline-editing' : '';
        const width = column.width ? ` style="min-width:${Number(column.width)}px;max-width:${Number(column.width)}px;"` : '';
        const dataAttrs = column.field
          ? ` data-field="${escapeHtml(column.field)}" data-column-id="${escapeHtml(column.id)}" data-source-index="${entry.sourceIndex}" data-editable="${isEditable ? 'true' : 'false'}"`
          : '';
        const content = isEditing
          ? this._renderInlineEditorCell(column, row, entry.sourceIndex)
          : this._renderCellContent(column, row);

        cells.push(`<td${rowSpan}${mergeAttrs}${dataAttrs} class="${alignClass}${editableClass}${editingClass}"${width}>${content}</td>`);
      });

      const dataRow = `
        <tr class="data-row${zebraClass}${selectedClass}" data-model-index="${rowModelIndex}" data-row-key="${escapeHtml(rowKey)}" data-source-index="${entry.sourceIndex}">
          ${cells.join('')}
        </tr>
      `;

      if (!this.masterDetail || this._expandedKey !== rowKey) return dataRow;

      const detailRow = `
        <tr class="detail-row" data-row-key="${escapeHtml(rowKey)}">
          <td colspan="${leafColumns.length + 1}">
            <div class="detail-shell">
              ${this._detailFormHtml(row, rowKey, entry.sourceIndex, leafColumns)}
            </div>
          </td>
        </tr>
      `;
      return dataRow + detailRow;
    }).join('');

    this.$.tableHost.innerHTML = `
      <table>
        <thead>
          ${headerHtml}
        </thead>
        <tbody>${rowsHtml}</tbody>
      </table>
    `;
    this._mergeHoverToken = null;
    this._syncInlineEditorRuntime(leafColumns);
  }

  _renderGroupRow(entry, colSpan) {
    if (typeof this.groupRowTemplate === 'function') {
      try {
        const rendered = this.groupRowTemplate({
          groupKey: entry.groupKey,
          key: entry.groupKey,
          count: entry.count,
          groupField: entry.groupField,
          rows: Array.isArray(entry.rows) ? entry.rows : [],
          escape: escapeHtml
        });

        if (rendered && typeof rendered === 'object') {
          const htmlContent = String(rendered.content ?? '');
          const extraClass = rendered.className ? ` ${String(rendered.className)}` : '';
          return `<tr class="group-row${extraClass}"><td colspan="${colSpan}">${htmlContent}</td></tr>`;
        }

        if (rendered != null && rendered !== '') {
          return `<tr class="group-row"><td colspan="${colSpan}">${String(rendered)}</td></tr>`;
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

    return `
      <tr class="group-row">
        <td colspan="${colSpan}">
          <div class="group-cell">${fieldLabel}${keyLabel}${countLabel}</div>
        </td>
      </tr>
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

  _renderCellContent(column, row) {
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
      const checked = Boolean(rawValue);
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

        <pl-flex-layout wrap stretch class="detail-edit-grid">
          <pl-input data-field="team_name" label="Команда" value="${escapeHtml(row.team_name || '')}"></pl-input>
          <pl-input data-field="manager" label="Руководитель" value="${escapeHtml(row.manager || '')}"></pl-input>
          <pl-input data-field="status" label="Статус" value="${escapeHtml(row.status || '')}"></pl-input>
          <pl-input data-field="direction" label="Направление" value="${escapeHtml(row.direction || '')}"></pl-input>
          <pl-input data-field="next_milestone" label="Майлстоун" value="${escapeHtml(row.next_milestone || '')}"></pl-input>
        </pl-flex-layout>

        <pl-flex-layout class="detail-actions" gap="8">
          <pl-button variant="primary" label="Применить" data-action="save-detail" data-row-key="${escapeHtml(rowKey)}" data-source-index="${sourceIndex}"></pl-button>
          <pl-button variant="secondary" label="Свернуть" data-action="toggle-detail" data-row-key="${escapeHtml(rowKey)}" data-source-index="${sourceIndex}"></pl-button>
        </pl-flex-layout>
      </pl-flex-layout>
    `;
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
        form.querySelectorAll('pl-input[data-field]').forEach((input) => {
          const field = input.dataset.field;
          if (field) patch[field] = input.value;
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
    this._renderTable();
  }

  _onDblClick(event) {
    if (this.inlineEdit) {
      const cell = this._pathTarget(event, (node) => node.tagName === 'TD' && node.dataset?.editable === 'true');
      if (cell) {
        const sourceIndex = Number(cell.dataset.sourceIndex);
        const field = String(cell.dataset.field || '');
        if (Number.isInteger(sourceIndex) && sourceIndex >= 0 && field) {
          const applied = applySettingsToColumns(this.columns || [], this.settings);
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
}

if (!customElements.get('pl-table-pro')) {
  customElements.define('pl-table-pro', PlTablePro);
}
