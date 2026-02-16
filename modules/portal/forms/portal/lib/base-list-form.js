import { PlForm } from '@nfjs/front-pl/components/pl-form.js';
import { css, html } from 'polylib';
import '/generated/components/pl-table-pro.js';
import '@plcmp/pl-flex-layout';
import '@plcmp/pl-input';
import '@plcmp/pl-icon';
import '@plcmp/pl-icon-button';
import '@plcmp/pl-badge';
import { sanitizeRichHtml } from '/portal/forms/portal/lib/sanitize-html.js';

export class PortalBaseListForm extends PlForm {
  static properties = {
    formTitle: { type: String, value: 'Portal' },
    search: { type: String, value: '', observer: '_searchObserver' },
    rows: { type: Array, value: () => [], observer: '_rowsObserver' },
    filteredRows: { type: Array, value: () => [], observer: '_filteredRowsObserver' },
    columns: { type: Array, value: () => [] },
    selected: { value: () => null, observer: '_selectedObserver' },
    activeRow: { value: () => null },
    detailPairs: { type: Array, value: () => [] },
    settingsKey: { type: String, value: 'portal.default.table' }
  };

  static css = css`
    :host {
      display: block;
      width: 100%;
      height: 100%;
      min-width: 0;
      min-height: 0;
    }

    .shell {
      width: 100%;
      height: 100%;
      min-width: 0;
      min-height: 0;
      box-sizing: border-box;
      overflow: hidden;
    }

    .toolbar {
      border: 1px solid var(--pl-grey-base);
      border-radius: var(--pl-border-radius);
      background: var(--pl-background-color);
      padding: 8px;
      box-sizing: border-box;
      gap: 8px;
      align-items: center;
      flex-wrap: wrap;
    }

    .toolbar pl-input {
      min-width: 260px;
      max-width: 640px;
      flex: 1;
    }

    .content {
      flex: 1;
      min-width: 0;
      min-height: 0;
      gap: 8px;
      overflow: hidden;
    }

    .grid-wrap {
      flex: 1;
      min-width: 0;
      min-height: 0;
      border: 1px solid var(--pl-grey-base);
      border-radius: var(--pl-border-radius);
      background: var(--pl-background-color);
      overflow: hidden;
    }

    .grid-wrap pl-table-pro {
      width: 100%;
      height: 100%;
      border: 0;
      border-radius: 0;
    }

    .details {
      width: min(32%, 420px);
      min-width: 300px;
      min-height: 0;
      border: 1px solid var(--pl-grey-base);
      border-radius: var(--pl-border-radius);
      background: var(--pl-background-color);
      box-sizing: border-box;
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }

    .details-head {
      min-height: var(--pl-base-size);
      border-bottom: 1px solid var(--pl-grey-light);
      padding: 8px 10px;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
    }

    .details-title {
      font: var(--pl-header-font);
      color: var(--pl-header-color);
      font-size: 15px;
      font-weight: 700;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .details-body {
      min-height: 0;
      overflow: auto;
      padding: 10px;
      box-sizing: border-box;
      display: grid;
      grid-template-columns: 1fr;
      gap: 8px;
      align-content: start;
    }

    .pair {
      border: 1px solid var(--pl-grey-light);
      border-radius: 10px;
      padding: 8px;
      box-sizing: border-box;
      background: var(--pl-grey-lightest);
    }

    .pair-label {
      color: var(--pl-grey-darkest);
      font: var(--pl-text-font);
      font-size: 12px;
      margin-bottom: 2px;
    }

    .pair-value {
      color: var(--pl-header-color);
      font: var(--pl-header-font);
      font-size: 14px;
      font-weight: 600;
      word-break: break-word;
      white-space: pre-wrap;
    }

    .pair-value-html {
      font-weight: 400;
      white-space: normal;
    }

    .safe-html-content {
      color: var(--pl-header-color);
      font: var(--pl-text-font);
      font-size: 14px;
      line-height: 1.45;
    }

    .safe-html-content h1,
    .safe-html-content h2,
    .safe-html-content h3,
    .safe-html-content h4,
    .safe-html-content h5,
    .safe-html-content h6 {
      margin: 10px 0 6px;
      font: var(--pl-header-font);
      color: var(--pl-header-color);
      font-weight: 700;
    }

    .safe-html-content p,
    .safe-html-content ul,
    .safe-html-content ol,
    .safe-html-content blockquote {
      margin: 8px 0;
    }

    .safe-html-content table {
      width: 100%;
      border-collapse: collapse;
      margin: 8px 0;
      table-layout: fixed;
    }

    .safe-html-content th,
    .safe-html-content td {
      border: 1px solid var(--pl-grey-base);
      padding: 6px 8px;
      text-align: left;
      vertical-align: top;
    }

    .safe-html-content a {
      color: var(--pl-primary-base);
      text-decoration: underline;
      text-underline-offset: 2px;
      word-break: break-all;
    }

    .empty {
      color: var(--pl-grey-darkest);
      font: var(--pl-text-font);
      font-size: 13px;
      padding: 6px;
    }

    @media (max-width: 1220px) {
      .content {
        flex-direction: column;
      }

      .details {
        width: 100%;
        min-width: 0;
        max-height: 40%;
      }
    }
  `;

  static template = html`
    <pl-flex-layout class="shell" vertical fit gap="8">
      <pl-flex-layout class="toolbar">
        <pl-input placeholder="Поиск" value="{{search}}">
          <pl-icon slot="prefix" iconset="pl-default" icon="search" size="16"></pl-icon>
        </pl-input>
        <pl-badge>[[filteredRows.length]] записей</pl-badge>
        <pl-icon-button variant="ghost" iconset="pl-default" icon="reload" on-click="[[onReloadClick]]"></pl-icon-button>
      </pl-flex-layout>

      <pl-flex-layout class="content" fit>
        <div class="grid-wrap">
          <pl-table-pro data="{{filteredRows}}" selected="{{selected}}" columns="[[columns]]" settings-key="[[settingsKey]]">
            <pl-flex-layout slot="top-toolbar" align="center">
            </pl-flex-layout>
          </pl-table-pro>
        </div>

        <div class="details">
          <div class="details-head">
            <div class="details-title">[[detailTitle(activeRow)]]</div>
          </div>
          <div class="details-body">
            <template d:repeat="[[detailPairs]]">
              <div class="pair">
                <div class="pair-label">[[item.label]]</div>
                <div class="pair-value" hidden$="[[_hideTextValue(item)]]">[[item.value]]</div>
                <div class="pair-value pair-value-html" hidden$="[[_hideHtmlValue(item)]]">
                  <div class="safe-html-content" inner-h-t-m-l="[[item.htmlValue]]"></div>
                </div>
              </div>
            </template>
            <div class="empty" hidden$="[[detailPairs.length]]">Выберите запись в таблице.</div>
          </div>
        </div>
      </pl-flex-layout>
    </pl-flex-layout>
  `;

  onConnect() {
    this.reloadData();
  }

  onReloadClick() {
    this.reloadData();
  }

  reloadData() {
    this.columns = this.getColumns();
    this.rows = (this.getRows() || []).map((row) => this.decorateRow(row));
    this._applyFilter();
  }

  getRows() {
    return [];
  }

  getColumns() {
    return [];
  }

  getDetailFields() {
    return [];
  }

  decorateRow(row) {
    return row;
  }

  detailTitle(row) {
    if (!row) return this.formTitle || 'Карточка';
    return row.title || row.name || row.displayName || row.id || this.formTitle || 'Карточка';
  }

  _searchObserver() {
    this._applyFilter();
  }

  _rowsObserver() {
    this._applyFilter();
  }

  _selectedObserver() {
    this._syncDetails();
  }

  _filteredRowsObserver() {
    if (!this.selected && this.filteredRows?.length) {
      [this.selected] = this.filteredRows;
    }
    if (this.selected && this.filteredRows && !this.filteredRows.includes(this.selected)) {
      [this.selected] = this.filteredRows;
    }
    this._syncDetails();
  }

  _applyFilter() {
    const query = String(this.search || '').trim().toLowerCase();
    const rows = Array.isArray(this.rows) ? this.rows : [];
    if (!query) {
      this.filteredRows = rows.slice();
      return;
    }

    this.filteredRows = rows.filter((row) => this._rowSearchText(row).includes(query));
  }

  _rowSearchText(row) {
    return Object.values(row || {})
      .map((value) => String(value ?? '').toLowerCase())
      .join(' ');
  }

  _syncDetails() {
    const row = this.selected || (this.filteredRows?.[0] || null);
    this.activeRow = row;
    if (!row) {
      this.detailPairs = [];
      return;
    }

    const pairs = (this.getDetailFields() || [])
      .map((item) => {
        const isHtml = item?.type === 'html';
        const rawValue = this._resolveRawValue(row, item?.field);
        const value = this._resolveValue(row, item?.field);
        if (!isHtml) {
          return {
            label: item?.label,
            value,
            isHtml: false
          };
        }

        const htmlValue = sanitizeRichHtml(rawValue);
        return {
          label: item?.label,
          value,
          isHtml: true,
          htmlValue
        };
      })
      .filter((pair) => pair.label);

    this.detailPairs = pairs;
  }

  _resolveRawValue(row, field) {
    if (!field) return undefined;
    return String(field).split('.').reduce((acc, key) => (acc ? acc[key] : undefined), row);
  }

  _hideTextValue(item) {
    return Boolean(item?.isHtml);
  }

  _hideHtmlValue(item) {
    return !Boolean(item?.isHtml);
  }

  _resolveValue(row, field) {
    const value = this._resolveRawValue(row, field);
    if (value === undefined || value === null || value === '') return '—';
    if (Array.isArray(value)) return value.join(', ');
    if (typeof value === 'object') return JSON.stringify(value);
    return String(value);
  }
}
