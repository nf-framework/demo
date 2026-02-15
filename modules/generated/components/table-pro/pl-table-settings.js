import { PlElement, html, css } from 'polylib';
import '@plcmp/pl-button';
import '@plcmp/pl-checkbox';
import '@plcmp/pl-combobox';
import '@plcmp/pl-flex-layout';
import '@plcmp/pl-icon-button';
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
    _groupByValue: { type: String, value: '' }
  };

  static css = css`
    :host {
      display: block;
      width: 360px;
      max-width: min(92vw, 360px);
      height: 100%;
      background: var(--pl-background-color);
      border-inline-start: 1px solid var(--pl-grey-light);
      box-sizing: border-box;
      overflow: hidden;
      color: var(--pl-text-color);
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
      border-bottom: 1px solid var(--pl-grey-light);
      background: var(--pl-grey-lightest);
    }

    .title {
      font: var(--pl-header-font);
      color: var(--pl-header-color);
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
      color: var(--pl-grey-darkest);
      line-height: 1.35;
    }

    .list {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .group, .leaf {
      border: 1px solid var(--pl-grey-light);
      border-radius: 8px;
      background: var(--pl-background-color);
      overflow: hidden;
    }

    .item-line {
      display: grid;
      grid-template-columns: 20px 1fr auto;
      align-items: center;
      gap: 8px;
      padding: 8px 10px;
      padding-inline-start: calc(10px + (var(--depth, 0) * 12px));
      box-sizing: border-box;
    }

    .group > .item-line {
      background: var(--pl-grey-lightest);
      font-weight: 700;
    }

    .drag {
      color: var(--pl-grey-darkest);
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

    .item-controls {
      display: inline-flex;
      align-items: center;
      gap: 6px;
    }

    .children {
      display: flex;
      flex-direction: column;
      gap: 6px;
      padding: 6px;
      box-sizing: border-box;
      border-top: 1px solid var(--pl-grey-light);
      background: var(--pl-grey-lightest);
    }

    [data-col-id][data-drag-over="true"] {
      outline: 2px dashed var(--pl-primary-base);
      outline-offset: -2px;
    }

    .grouping {
      border: 1px solid var(--pl-grey-light);
      border-radius: 8px;
      background: var(--pl-background-color);
      padding: 8px;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .grouping-actions {
      display: flex;
      gap: 8px;
      align-items: center;
    }

    .grouping-list {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .grouping-empty {
      font-size: 12px;
      color: var(--pl-grey-darkest);
      line-height: 1.3;
      padding: 4px 2px;
    }

    .grouping-item {
      display: grid;
      grid-template-columns: 1fr auto;
      align-items: center;
      gap: 8px;
      border: 1px solid var(--pl-grey-light);
      border-radius: 8px;
      background: var(--pl-grey-lightest);
      padding: 6px 8px;
      box-sizing: border-box;
      min-height: var(--pl-base-size);
    }

    .grouping-label {
      min-width: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      font: var(--pl-text-font);
      color: var(--pl-header-color);
      font-size: 13px;
    }

    .grouping-controls {
      display: inline-flex;
      align-items: center;
      gap: 2px;
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
        <div class="grouping">
          <pl-combobox id="groupByCombo" value="{{_groupByValue}}" label="Добавить уровень группировки"></pl-combobox>
          <div class="grouping-actions">
            <pl-button variant="ghost" label="Добавить" data-action="group-add"></pl-button>
            <pl-button variant="ghost" label="Очистить" data-action="group-clear"></pl-button>
          </div>
          <div id="groupByList" class="grouping-list"></div>
        </div>
        <div class="hint">
          Перетаскивание работает на любом уровне вложенности.
          Перемещать можно только внутри одного родителя (группа в своей группе, корень в корне).
          Чекбокс у колонки отвечает за видимость. Кнопка - / L / R переключает закрепление колонки.
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
    this._groupByOptionsSignature = '';

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
    this._renderGroupByList();

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
    const options = [
      { value: '', text: 'Выберите колонку' },
      ...this._leafColumns.map((column) => ({
        value: column.id,
        text: column.groupHeader ? `${column.groupHeader} / ${column.header || column.field || column.id}` : (column.header || column.field || column.id)
      }))
    ];

    const signature = JSON.stringify(options);
    if (this._groupByOptionsSignature !== signature) {
      this._groupByOptionsSignature = signature;
      this.$.groupByCombo.data = options;
    }

    if (!this._leafColumns.some((column) => column.id === this._groupByValue)) {
      this._groupByValue = '';
    }
    if (this.$.groupByCombo.value !== this._groupByValue) {
      this.$.groupByCombo.value = this._groupByValue;
    }
  }

  _getGroupByIds() {
    const source = this.settings?.groupBy;
    if (Array.isArray(source)) return source.map((id) => String(id || '')).filter(Boolean);
    if (source) return [String(source)];
    return [];
  }

  _setGroupByIds(ids) {
    const normalized = normalizeSettings(this._schema, {
      ...(this.settings || {}),
      groupBy: ids
    });
    this._setSettings(normalized);
  }

  _renderGroupByList() {
    if (!this.$?.groupByList) return;

    const groupBy = this._getGroupByIds();
    if (!groupBy.length) {
      this.$.groupByList.innerHTML = '<div class="grouping-empty">Без группировки</div>';
      return;
    }

    const htmlItems = groupBy.map((columnId, index) => {
      const column = this._leafColumns.find((item) => item.id === columnId);
      const label = escapeHtml(
        column
          ? (column.groupHeader
            ? `${column.groupHeader} / ${column.header || column.field || column.id}`
            : (column.header || column.field || column.id))
          : columnId
      );

      return `
        <div class="grouping-item">
          <div class="grouping-label">${index + 1}. ${label}</div>
          <div class="grouping-controls">
            <pl-icon-button
              variant="link"
              iconset="pl-default"
              icon="arrow-up"
              title="Сдвинуть вверх"
              data-action="group-up"
              data-index="${index}"></pl-icon-button>
            <pl-icon-button
              variant="link"
              iconset="pl-default"
              icon="arrow-down"
              title="Сдвинуть вниз"
              data-action="group-down"
              data-index="${index}"></pl-icon-button>
            <pl-icon-button
              variant="link"
              iconset="pl-default"
              icon="close-s"
              title="Удалить уровень"
              data-action="group-remove"
              data-index="${index}"></pl-icon-button>
          </div>
        </div>
      `;
    }).join('');

    this.$.groupByList.innerHTML = htmlItems;
  }

  _renderList() {
    if (!this.$?.list) return;
    const settings = this.settings || createDefaultSettings(this._schema);
    const top = reorderByOrder(this._schema, settings.topOrder);

    const renderNode = (column, parentId = null, depth = 0) => {
      const hasChildren = Array.isArray(column.children) && column.children.length > 0;
      const parentValue = parentId ? escapeHtml(parentId) : '';
      const colId = escapeHtml(column.id);
      const label = escapeHtml(column.header || column.field || column.id);
      const depthStyle = ` style="--depth:${Number(depth)}"`;

      if (hasChildren) {
        const children = reorderByOrder(column.children, settings.childOrder?.[column.id]);
        const leafIds = collectLeafColumns([column]).map((leaf) => leaf.id);
        const allVisible = leafIds.every((leafId) => !settings.hidden?.[leafId]);

        return `
          <div class="group" draggable="true" data-col-id="${colId}" data-parent-id="${parentValue}"${depthStyle}>
            <div class="item-line" data-col-id="${colId}" data-parent-id="${parentValue}"${depthStyle}>
              <div class="drag">⋮⋮</div>
              <div class="item-label">${label}</div>
              <div class="item-controls">
                <pl-checkbox data-action="visibility" data-col-id="${colId}" data-is-group="1" data-initial-checked="${allVisible ? '1' : '0'}"></pl-checkbox>
              </div>
            </div>
            <div class="children" data-parent-id="${colId}">
              ${children.map((child) => renderNode(child, column.id, depth + 1)).join('')}
            </div>
          </div>
        `;
      }

      return `
        <div class="leaf" draggable="true" data-col-id="${colId}" data-parent-id="${parentValue}"${depthStyle}>
          <div class="item-line" data-col-id="${colId}" data-parent-id="${parentValue}"${depthStyle}>
            <div class="drag">⋮⋮</div>
            <div class="item-label">${label}</div>
            <div class="item-controls">
              <pl-button
                variant="ghost"
                data-action="fixed-cycle"
                data-col-id="${colId}"
                label="${settings.fixed?.[column.id] === 'left' ? 'L' : (settings.fixed?.[column.id] === 'right' ? 'R' : '-')}"></pl-button>
              <pl-checkbox
                title="Видимость"
                data-action="visibility"
                data-col-id="${colId}"
                data-initial-checked="${!settings.hidden?.[column.id] ? '1' : '0'}"></pl-checkbox>
            </div>
          </div>
        </div>
      `;
    };

    const htmlItems = top.map((column) => renderNode(column, null, 0)).join('');

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

    if (action === 'fixed-cycle') {
      const colId = actionEl.dataset.colId;
      if (!colId) return;
      const current = String(this.settings?.fixed?.[colId] || '');
      const nextValue = current === 'left' ? 'right' : (current === 'right' ? '' : 'left');
      const next = normalizeSettings(this._schema, {
        ...(this.settings || {}),
        fixed: {
          ...(this.settings?.fixed || {}),
          [colId]: nextValue
        }
      });
      this._setSettings(next);
      return;
    }

    if (action === 'group-add') {
      const columnId = String(this._groupByValue || '').trim();
      if (!columnId) return;
      const groupBy = this._getGroupByIds();
      if (!groupBy.includes(columnId)) groupBy.push(columnId);
      this._setGroupByIds(groupBy);
      this._groupByValue = '';
      this.$.groupByCombo.value = '';
      return;
    }

    if (action === 'group-clear') {
      this._setGroupByIds([]);
      this._groupByValue = '';
      this.$.groupByCombo.value = '';
      return;
    }

    if (action === 'group-up' || action === 'group-down' || action === 'group-remove') {
      const groupBy = this._getGroupByIds();
      const index = Number(actionEl.dataset.index);
      if (!Number.isInteger(index) || index < 0 || index >= groupBy.length) return;

      if (action === 'group-remove') {
        groupBy.splice(index, 1);
        this._setGroupByIds(groupBy);
        return;
      }

      const nextIndex = action === 'group-up' ? index - 1 : index + 1;
      if (nextIndex < 0 || nextIndex >= groupBy.length) return;
      const [item] = groupBy.splice(index, 1);
      groupBy.splice(nextIndex, 0, item);
      this._setGroupByIds(groupBy);
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
