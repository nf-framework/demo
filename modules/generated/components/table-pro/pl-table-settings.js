import { PlElement, html, css } from 'polylib';
import '@plcmp/pl-button';
import '@plcmp/pl-checkbox';
import '@plcmp/pl-combobox';
import '@plcmp/pl-flex-layout';
import '@plcmp/pl-icon';
import '@plcmp/pl-iconset-default';

import {
  collectColumnMap,
  collectLeafColumns,
  createDefaultSettings,
  isTopLevelOrSameGroup,
  moveColumnInSettings,
  normalizeColumns,
  normalizeSettings,
  toggleColumnVisibility
} from '/generated/components/table-pro/helpers/columns.js';
import { clearTableSettings, loadTableSettings, saveTableSettings } from '/generated/components/table-pro/helpers/storage.js';

function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function reorderByOrder(items, order) {
  const source = Array.isArray(items) ? items : [];
  const map = new Map(source.map((item) => [item.id, item]));
  const result = [];

  (Array.isArray(order) ? order : []).forEach((id) => {
    const item = map.get(id);
    if (item) {
      result.push(item);
      map.delete(id);
    }
  });

  source.forEach((item) => {
    if (map.has(item.id)) result.push(item);
  });

  return result;
}

class PlTableSettings extends PlElement {
  static properties = {
    columns: { type: Array, value: () => [], observer: '_inputsChanged' },
    settingsKey: { type: String, observer: '_inputsChanged' },
    settings: { type: Object, value: null, observer: '_externalSettingsChanged' },
    _groupByValue: { type: String, value: '', observer: '_groupByValueObserver' }
  };

  static css = css`
    :host {
      display: block;
      width: 360px;
      max-width: min(92vw, 360px);
      height: 100%;
      background: var(--pl-surface-color, #fff);
      border-inline-start: 1px solid var(--pl-grey-light, #e5e7eb);
      box-sizing: border-box;
      overflow: hidden;
      color: var(--pl-text-color, #2a3143);
    }

    .panel {
      height: 100%;
      display: flex;
      flex-direction: column;
      min-height: 0;
    }

    .head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
      padding: 10px 12px;
      border-bottom: 1px solid var(--pl-grey-light, #e5e7eb);
      background: var(--pl-grey-lightest, #f8fafc);
    }

    .title {
      font: var(--pl-header-font);
      color: var(--pl-header-color, #3e4b59);
    }

    .body {
      flex: 1;
      min-height: 0;
      overflow: auto;
      padding: 10px 12px 14px;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .hint {
      font-size: 12px;
      color: var(--pl-grey-darkest, #85919c);
      line-height: 1.35;
    }

    .list {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .group, .leaf {
      border: 1px solid var(--pl-grey-light, #e5e7eb);
      border-radius: 8px;
      background: var(--pl-background-color, #fff);
      overflow: hidden;
    }

    .item-line {
      display: grid;
      grid-template-columns: 20px 1fr auto;
      align-items: center;
      gap: 8px;
      padding: 8px 10px;
      box-sizing: border-box;
    }

    .group > .item-line {
      background: var(--pl-grey-lightest, #f8fafc);
      font-weight: 700;
    }

    .drag {
      color: var(--pl-grey-darkest, #85919c);
      font-size: 13px;
      line-height: 1;
      user-select: none;
      cursor: grab;
      text-align: center;
    }

    .item-label {
      font-size: 13px;
      line-height: 1.3;
      min-width: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .children {
      display: flex;
      flex-direction: column;
      gap: 6px;
      padding: 6px;
      box-sizing: border-box;
      border-top: 1px solid var(--pl-grey-light, #e5e7eb);
      background: color-mix(in srgb, var(--pl-grey-lightest, #f8fafc), white 38%);
    }

    [data-col-id][data-drag-over="true"] {
      outline: 2px dashed var(--pl-primary-base, #3A817D);
      outline-offset: -2px;
    }
  `;

  static template = html`
    <div class="panel">
      <div class="head">
        <div class="title">Настройки колонок</div>
        <pl-flex-layout align="center" gap="8">
          <pl-button variant="ghost" label="Сбросить" data-action="reset"></pl-button>
          <pl-button variant="secondary" label="Закрыть" data-action="close"></pl-button>
        </pl-flex-layout>
      </div>
      <div class="body">
        <pl-combobox id="groupByCombo" value="{{_groupByValue}}" label="Группировка по колонке"></pl-combobox>
        <div class="hint">
          Перетаскивание: дочерние колонки двигаются только внутри своей группы.
          Группы и одиночные колонки двигаются на верхнем уровне.
        </div>
        <div id="list" class="list"></div>
      </div>
    </div>
  `;

  constructor() {
    super();
    this._schema = [];
    this._schemaMap = new Map();
    this._leafColumns = [];
    this._suppressSettingsObserver = false;
    this._dragState = null;

    this._bound = {
      onClick: this._onClick.bind(this),
      onDragStart: this._onDragStart.bind(this),
      onDragOver: this._onDragOver.bind(this),
      onDragLeave: this._onDragLeave.bind(this),
      onDrop: this._onDrop.bind(this),
      onDragEnd: this._onDragEnd.bind(this)
    };
  }

  connectedCallback() {
    super.connectedCallback();
    this.shadowRoot?.addEventListener('click', this._bound.onClick);
    this.shadowRoot?.addEventListener('dragstart', this._bound.onDragStart);
    this.shadowRoot?.addEventListener('dragover', this._bound.onDragOver);
    this.shadowRoot?.addEventListener('dragleave', this._bound.onDragLeave);
    this.shadowRoot?.addEventListener('drop', this._bound.onDrop);
    this.shadowRoot?.addEventListener('dragend', this._bound.onDragEnd);

    this._inputsChanged();
  }

  disconnectedCallback() {
    this.shadowRoot?.removeEventListener('click', this._bound.onClick);
    this.shadowRoot?.removeEventListener('dragstart', this._bound.onDragStart);
    this.shadowRoot?.removeEventListener('dragover', this._bound.onDragOver);
    this.shadowRoot?.removeEventListener('dragleave', this._bound.onDragLeave);
    this.shadowRoot?.removeEventListener('drop', this._bound.onDrop);
    this.shadowRoot?.removeEventListener('dragend', this._bound.onDragEnd);
    super.disconnectedCallback();
  }

  reload() {
    this._inputsChanged();
  }

  getSettings() {
    return JSON.parse(JSON.stringify(this.settings || {}));
  }

  _externalSettingsChanged(value) {
    if (this._suppressSettingsObserver || !this._schema.length) return;
    const normalized = normalizeSettings(this._schema, value);
    this._setSettings(normalized, { persist: false, emit: false });
  }

  _inputsChanged() {
    this._schema = normalizeColumns(this.columns || []);
    this._schemaMap = collectColumnMap(this._schema);
    this._leafColumns = collectLeafColumns(this._schema);

    const fromStorage = loadTableSettings(this.settingsKey);
    const baseSettings = fromStorage || this.settings || createDefaultSettings(this._schema);
    const normalized = normalizeSettings(this._schema, baseSettings);
    this._setSettings(normalized, { persist: false, emit: true });
  }

  _setSettings(nextSettings, { persist = true, emit = true } = {}) {
    this._suppressSettingsObserver = true;
    this.settings = nextSettings;
    this._suppressSettingsObserver = false;

    if (persist) saveTableSettings(this.settingsKey, nextSettings);
    this._renderList();
    this._renderGroupByOptions();

    if (emit) {
      this.dispatchEvent(new CustomEvent('table-settings-change', {
        detail: { settings: this.getSettings() },
        bubbles: true,
        composed: true
      }));
    }
  }

  _renderGroupByOptions() {
    if (!this.$?.groupByCombo) return;
    this.$.groupByCombo.data = [
      { value: '', text: 'Без группировки' },
      ...this._leafColumns.map((column) => ({
        value: column.id,
        text: column.groupHeader ? `${column.groupHeader} / ${column.header || column.field || column.id}` : (column.header || column.field || column.id)
      }))
    ];
    this._groupByValue = this.settings?.groupBy || '';
    this.$.groupByCombo.value = this._groupByValue;
  }

  _renderList() {
    if (!this.$?.list) return;
    const settings = this.settings || createDefaultSettings(this._schema);
    const top = reorderByOrder(this._schema, settings.topOrder);

    const htmlItems = top.map((column) => {
      if (Array.isArray(column.children) && column.children.length > 0) {
        const children = reorderByOrder(column.children, settings.childOrder?.[column.id]);
        const allVisible = children.every((child) => !settings.hidden?.[child.id]);
        return `
          <div class="group" draggable="true" data-col-id="${escapeHtml(column.id)}" data-parent-id="">
            <div class="item-line" data-col-id="${escapeHtml(column.id)}" data-parent-id="">
              <div class="drag">⋮⋮</div>
              <div class="item-label">${escapeHtml(column.header || column.id)}</div>
              <pl-checkbox data-action="visibility" data-col-id="${escapeHtml(column.id)}" data-is-group="1" data-initial-checked="${allVisible ? '1' : '0'}"></pl-checkbox>
            </div>
            <div class="children">
              ${children.map((child) => `
                <div class="leaf" draggable="true" data-col-id="${escapeHtml(child.id)}" data-parent-id="${escapeHtml(column.id)}">
                  <div class="item-line" data-col-id="${escapeHtml(child.id)}" data-parent-id="${escapeHtml(column.id)}">
                    <div class="drag">⋮⋮</div>
                    <div class="item-label">${escapeHtml(child.header || child.field || child.id)}</div>
                    <pl-checkbox data-action="visibility" data-col-id="${escapeHtml(child.id)}" data-initial-checked="${!settings.hidden?.[child.id] ? '1' : '0'}"></pl-checkbox>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        `;
      }

      return `
        <div class="leaf" draggable="true" data-col-id="${escapeHtml(column.id)}" data-parent-id="">
          <div class="item-line" data-col-id="${escapeHtml(column.id)}" data-parent-id="">
            <div class="drag">⋮⋮</div>
            <div class="item-label">${escapeHtml(column.header || column.field || column.id)}</div>
            <pl-checkbox data-action="visibility" data-col-id="${escapeHtml(column.id)}" data-initial-checked="${!settings.hidden?.[column.id] ? '1' : '0'}"></pl-checkbox>
          </div>
        </div>
      `;
    }).join('');

    this.$.list.innerHTML = htmlItems;
    this._syncInitialCheckboxes();
  }

  _syncInitialCheckboxes() {
    setTimeout(() => {
      this.$.list?.querySelectorAll?.('pl-checkbox[data-initial-checked]').forEach((checkbox) => {
        const nextChecked = checkbox.dataset.initialChecked === '1';
        if (checkbox.checked !== nextChecked) checkbox.checked = nextChecked;
        delete checkbox.dataset.initialChecked;
      });
    }, 0);
  }

  _pathTarget(event, predicate) {
    return event.composedPath().find((node) => {
      return node && node instanceof HTMLElement && predicate(node);
    }) || null;
  }

  _onClick(event) {
    const actionEl = this._pathTarget(event, (node) => Boolean(node.dataset?.action));
    if (!actionEl) return;

    const action = actionEl.dataset.action;
    if (action === 'visibility') {
      const colId = actionEl.dataset.colId;
      if (!colId) return;

      const next = normalizeSettings(
        this._schema,
        toggleColumnVisibility(
          this.settings || createDefaultSettings(this._schema),
          colId,
          !Boolean(actionEl.checked),
          this._schemaMap
        )
      );
      this._setSettings(next);
      return;
    }

    if (action === 'close') {
      this.dispatchEvent(new CustomEvent('table-settings-close', { bubbles: true, composed: true }));
      return;
    }
    if (action === 'reset') {
      clearTableSettings(this.settingsKey);
      const normalized = normalizeSettings(this._schema, createDefaultSettings(this._schema));
      this._setSettings(normalized);
    }
  }

  _groupByValueObserver(value) {
    if (!this._schema?.length) return;
    const current = this.settings?.groupBy || '';
    const nextValue = value || '';
    if (current === nextValue) return;

    const next = normalizeSettings(this._schema, {
      ...(this.settings || {}),
      groupBy: nextValue || null
    });
    this._setSettings(next);
  }

  _onDragStart(event) {
    const item = this._pathTarget(event, (node) => node.hasAttribute?.('draggable') && node.dataset?.colId);
    if (!item) return;
    this._dragState = {
      id: item.dataset.colId,
      parentId: item.dataset.parentId || null
    };
    if (event.dataTransfer) {
      event.dataTransfer.effectAllowed = 'move';
      event.dataTransfer.setData('text/plain', this._dragState.id);
    }
  }

  _resolveDropTarget(event) {
    const sourceParentId = this._dragState?.parentId || null;
    const candidates = event.composedPath().filter((node) => {
      return node instanceof HTMLElement && Boolean(node.dataset?.colId);
    });
    if (!candidates.length) return null;

    if (sourceParentId == null) {
      return candidates.find((node) => !node.dataset.parentId) || null;
    }

    return candidates.find((node) => (node.dataset.parentId || null) === sourceParentId) || null;
  }

  _clearDragOverMarks() {
    this.shadowRoot?.querySelectorAll?.('[data-drag-over="true"]').forEach((node) => {
      delete node.dataset.dragOver;
    });
  }

  _onDragOver(event) {
    const target = this._resolveDropTarget(event);
    if (!target || !this._dragState) return;

    event.preventDefault();
    this._clearDragOverMarks();
    target.dataset.dragOver = 'true';
    if (event.dataTransfer) event.dataTransfer.dropEffect = 'move';
  }

  _onDragLeave(event) {
    const target = this._resolveDropTarget(event);
    if (!target) return;
    delete target.dataset.dragOver;
  }

  _onDrop(event) {
    const target = this._resolveDropTarget(event);
    if (!target || !this._dragState) return;

    event.preventDefault();
    delete target.dataset.dragOver;

    const source = this._dragState;
    const destination = {
      id: target.dataset.colId,
      parentId: target.dataset.parentId || null
    };
    if (source.id === destination.id) return;
    if (!isTopLevelOrSameGroup(this._schemaMap, source.id, destination.id)) return;

    const move = moveColumnInSettings(this.settings, source, destination);
    if (!move.changed) return;

    const normalized = normalizeSettings(this._schema, move.settings);
    this._setSettings(normalized);
  }

  _onDragEnd() {
    this._dragState = null;
    this._clearDragOverMarks();
  }
}

if (!customElements.get('pl-table-settings')) {
  customElements.define('pl-table-settings', PlTableSettings);
}
