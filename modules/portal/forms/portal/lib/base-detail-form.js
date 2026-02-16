import { PlForm } from '@nfjs/front-pl/components/pl-form.js';
import { css, html } from 'polylib';
import '/generated/components/pl-table-pro.js';
import '@plcmp/pl-flex-layout';
import '@plcmp/pl-input';
import '@plcmp/pl-icon';
import '@plcmp/pl-combobox';
import '@plcmp/pl-badge';
import { sanitizeRichHtml } from '/portal/forms/portal/lib/sanitize-html.js';

export class PortalBaseDetailForm extends PlForm {
  static properties = {
    formTitle: { type: String, value: 'Portal Detail' },
    search: { type: String, value: '' },
    options: { type: Array, value: () => [] },
    selectedId: { type: String, value: '', observer: '_selectedIdObserver' },
    selectedRow: { value: () => null },
    detailPairs: { type: Array, value: () => [] },
    relatedRows: { type: Array, value: () => [] },
    relatedColumns: { type: Array, value: () => [] },
    relatedTitle: { type: String, value: 'Связанные записи' },
    settingsKey: { type: String, value: 'portal.detail.table' }
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
      overflow: hidden;
      box-sizing: border-box;
    }

    .toolbar {
      border: 1px solid var(--pl-grey-base);
      border-radius: var(--pl-border-radius);
      background: var(--pl-background-color);
      padding: 8px;
      box-sizing: border-box;
      gap: 8px;
      flex-wrap: wrap;
      align-items: center;
    }

    .toolbar pl-combobox {
      min-width: 280px;
      max-width: 540px;
      flex: 1;
    }

    .content {
      flex: 1;
      min-width: 0;
      min-height: 0;
      gap: 8px;
      overflow: hidden;
    }

    .card {
      width: min(36%, 460px);
      min-width: 320px;
      min-height: 0;
      border: 1px solid var(--pl-grey-base);
      border-radius: var(--pl-border-radius);
      background: var(--pl-background-color);
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }

    .card-head {
      min-height: var(--pl-base-size);
      border-bottom: 1px solid var(--pl-grey-light);
      padding: 8px 10px;
      box-sizing: border-box;
      display: flex;
      align-items: center;
    }

    .card-title {
      font: var(--pl-header-font);
      color: var(--pl-header-color);
      font-size: 15px;
      font-weight: 700;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .card-body {
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
      white-space: pre-wrap;
      word-break: break-word;
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

    .related {
      flex: 1;
      min-width: 0;
      min-height: 0;
      border: 1px solid var(--pl-grey-base);
      border-radius: var(--pl-border-radius);
      background: var(--pl-background-color);
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }

    .related-head {
      min-height: var(--pl-base-size);
      border-bottom: 1px solid var(--pl-grey-light);
      padding: 8px 10px;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
    }

    .related-title {
      font: var(--pl-header-font);
      color: var(--pl-header-color);
      font-size: 15px;
      font-weight: 700;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .related pl-table-pro {
      width: 100%;
      height: 100%;
      border: 0;
      border-radius: 0;
      min-height: 0;
      flex: 1;
    }

    @media (max-width: 1240px) {
      .content {
        flex-direction: column;
      }

      .card {
        width: 100%;
        min-width: 0;
        max-height: 42%;
      }
    }
  `;

  static template = html`
    <pl-flex-layout class="shell" vertical fit gap="8">
      <pl-flex-layout class="toolbar">
        <pl-combobox
          value="{{selectedId}}"
          data="[[options]]"
          text-property="text"
          value-property="value"
          placeholder="Выберите запись"></pl-combobox>
        <pl-badge>[[options.length]] вариантов</pl-badge>
      </pl-flex-layout>

      <pl-flex-layout class="content" fit>
        <div class="card">
          <div class="card-head">
            <div class="card-title">[[detailTitle(selectedRow)]]</div>
          </div>
          <div class="card-body">
            <template d:repeat="[[detailPairs]]">
              <div class="pair">
                <div class="pair-label">[[item.label]]</div>
                <div class="pair-value" hidden$="[[_hideTextValue(item)]]">[[item.value]]</div>
                <div class="pair-value pair-value-html" hidden$="[[_hideHtmlValue(item)]]">
                  <div class="safe-html-content" inner-h-t-m-l="[[item.htmlValue]]"></div>
                </div>
              </div>
            </template>
          </div>
        </div>

        <div class="related">
          <div class="related-head">
            <div class="related-title">[[relatedTitle]]</div>
            <pl-badge>[[relatedRows.length]]</pl-badge>
          </div>
          <pl-table-pro data="{{relatedRows}}" columns="[[relatedColumns]]" settings-key="[[settingsKey]]">
            <pl-flex-layout slot="top-toolbar" align="center">
            </pl-flex-layout>
          </pl-table-pro>
        </div>
      </pl-flex-layout>
    </pl-flex-layout>
  `;

  onConnect() {
    this.options = this.getOptions();
    this.relatedColumns = this.getRelatedColumns();
    if (!this.selectedId && this.options.length) {
      this.selectedId = this.options[0].value;
    } else {
      this._selectedIdObserver();
    }
  }

  getOptions() {
    return [];
  }

  getSelectedRow(_id) {
    return null;
  }

  getDetailFields() {
    return [];
  }

  getRelatedTitle() {
    return 'Связанные записи';
  }

  getRelatedRows(_row) {
    return [];
  }

  getRelatedColumns() {
    return [];
  }

  detailTitle(row) {
    if (!row) return this.formTitle;
    return row.title || row.name || row.displayName || row.id || this.formTitle;
  }

  _selectedIdObserver() {
    const row = this.getSelectedRow(this.selectedId);
    this.selectedRow = row;
    this.relatedTitle = this.getRelatedTitle(row);
    this.relatedRows = this.getRelatedRows(row);

    const pairs = (this.getDetailFields() || [])
      .map((field) => {
        const isHtml = field?.type === 'html';
        const rawValue = this._resolveRawValue(row, field?.field);
        const value = this._resolveValue(row, field?.field);
        if (!isHtml) {
          return {
            label: field?.label,
            value,
            isHtml: false
          };
        }

        const htmlValue = sanitizeRichHtml(rawValue);
        return {
          label: field?.label,
          value,
          isHtml: true,
          htmlValue
        };
      })
      .filter((pair) => pair.label);
    this.detailPairs = pairs;
  }

  _resolveRawValue(row, field) {
    if (!row || !field) return undefined;
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
