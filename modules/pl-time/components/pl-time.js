import { PlElement, html, css } from 'polylib';

import '@plcmp/pl-input';
import '@plcmp/pl-dropdown';
import '@plcmp/pl-icon-button';
import '@plcmp/pl-iconset-default';
import { calcNextMinutes, calcScrollTopForOption } from './helpers/navigation.js';

class PlTime extends PlElement {
  static properties = {
    value: { type: String, value: '', observer: '_valueObserver' },
    label: { type: String },
    orientation: { type: String },
    contentWidth: { type: Number },
    labelWidth: { type: Number },
    placeholder: { type: String, value: 'HH:MM' },
    min: { type: String, value: '00:00', observer: '_limitsChanged' },
    max: { type: String, value: '23:59', observer: '_limitsChanged' },
    step: { type: Number, value: 15, observer: '_limitsChanged' },
    required: { type: Boolean },
    invalid: { type: Boolean, value: false },
    disabled: { type: Boolean, reflectToAttribute: true },
    readonly: { type: Boolean, reflectToAttribute: true },
    hidden: { type: Boolean, reflectToAttribute: true },
    stretch: { type: Boolean, reflectToAttribute: true },
    fitInto: { value: null },
    _display: { type: String, value: '', observer: '_displayObserver' },
    _opened: { type: Boolean, value: false }
  };

  static css = css`
    :host {
      display: inline-block;
      min-width: 0;
    }

    :host([hidden]) {
      display: none;
    }

    :host([stretch]) {
      display: block;
      width: 100%;
    }

    :host([stretch]) pl-input {
      width: 100%;
    }

    pl-dropdown {
      background: var(--pl-surface-color);
      box-shadow: 0px 8px 24px rgba(0, 0, 0, 0.12);
      border-radius: var(--pl-border-radius);
      box-sizing: border-box;
      padding: var(--pl-space-sm);
      min-width: 148px;
    }

    pl-dropdown::part(popover) {
      background: var(--pl-surface-color);
      box-shadow: 0px 8px 24px rgba(0, 0, 0, 0.12);
      border-radius: var(--pl-border-radius);
      box-sizing: border-box;
      padding: var(--pl-space-sm);
      min-width: 148px;
    }

    .dropdown-head {
      font: var(--pl-caption-font);
      color: var(--pl-grey-darkest);
      padding: 0 var(--pl-space-xs) var(--pl-space-xs);
    }

    .options {
      display: grid;
      grid-template-columns: 1fr;
      gap: 2px;
      min-width: 120px;
      max-height: 248px;
      overflow: auto;
      scrollbar-width: thin;
    }

    .opt {
      border: 1px solid transparent;
      border-radius: var(--pl-border-radius);
      background: transparent;
      color: var(--pl-text-color);
      font: var(--pl-text-font);
      line-height: 1.2;
      text-align: left;
      height: calc(var(--pl-base-size) - 6px);
      padding: 0 var(--pl-space-sm);
      cursor: pointer;
      transition: background .2s ease, border .2s ease, color .2s ease;
    }

    .opt:hover {
      background: var(--pl-primary-lightest);
      border-color: var(--pl-primary-light);
      color: var(--pl-primary-dark);
    }

    .opt.selected {
      background: var(--pl-primary-base);
      color: var(--pl-background-color);
      border-color: var(--pl-primary-base);
      font-weight: 600;
    }

    .empty {
      font: var(--pl-caption-font);
      color: var(--pl-grey-darkest);
      padding: var(--pl-space-xs);
      text-align: center;
    }
  `;

  static template = html`
    <pl-input
      id="input"
      stretch="[[stretch]]"
      label="[[label]]"
      orientation="[[orientation]]"
      content-width="[[contentWidth]]"
      label-width="[[labelWidth]]"
      placeholder="[[placeholder]]"
      value="{{_display}}"
      required="[[required]]"
      invalid="{{invalid}}"
      disabled="[[disabled]]"
      readonly="[[readonly]]"
      on-keydown="[[_onInputKeydown]]"
      on-blur="[[_onInputBlur]]">
      <pl-icon-button
        slot="suffix"
        variant="link"
        hidden="[[readonly]]"
        disabled="[[disabled]]"
        iconset="pl-default"
        size="16"
        icon="time"
        on-click="[[_onToggleClick]]"></pl-icon-button>
    </pl-input>

    <pl-dropdown id="dd">
      <div class="dropdown-head">Выберите время</div>
      <div id="options" class="options"></div>
    </pl-dropdown>
  `;

  constructor() {
    super();
    this._silentDisplay = false;
    this._silentValue = false;

    this._boundOnOptionsClick = this._onOptionsClick.bind(this);
    this._boundOnDropdownShow = this._onDropdownShow.bind(this);
    this._boundOnDropdownHide = this._onDropdownHide.bind(this);
  }

  _el(id) {
    return this.root?.querySelector(`#${id}`);
  }

  connectedCallback() {
    super.connectedCallback();
    this._el('options')?.addEventListener('click', this._boundOnOptionsClick);
    this._el('dd')?.addEventListener('pl-dropdown-show', this._boundOnDropdownShow);
    this._el('dd')?.addEventListener('pl-dropdown-hide', this._boundOnDropdownHide);
    this._syncDisplayFromValue();
    this._renderOptions();
  }

  disconnectedCallback() {
    this._el('options')?.removeEventListener('click', this._boundOnOptionsClick);
    this._el('dd')?.removeEventListener('pl-dropdown-show', this._boundOnDropdownShow);
    this._el('dd')?.removeEventListener('pl-dropdown-hide', this._boundOnDropdownHide);
    super.disconnectedCallback();
  }

  _limitsChanged() {
    if (!this.isConnected) return;
    this._syncDisplayFromValue();
    this._renderOptions();
  }

  _stepMinutes() {
    const raw = Number(this.step);
    if (!Number.isFinite(raw)) return 15;
    return Math.max(1, Math.min(60, Math.floor(raw)));
  }

  _parseMinutes(value) {
    const source = String(value || '').trim();
    if (!source) return null;

    let hh;
    let mm;

    const compact = source.match(/^(\d{1,2})(\d{2})$/);
    if (compact) {
      hh = Number(compact[1]);
      mm = Number(compact[2]);
    } else {
      const withColon = source.match(/^(\d{1,2}):(\d{1,2})$/);
      if (!withColon) return null;
      hh = Number(withColon[1]);
      mm = Number(withColon[2]);
    }

    if (!Number.isFinite(hh) || !Number.isFinite(mm)) return null;
    if (hh < 0 || hh > 23 || mm < 0 || mm > 59) return null;

    return hh * 60 + mm;
  }

  _formatMinutes(totalMinutes) {
    const normalized = Math.max(0, Math.min(1439, Math.floor(Number(totalMinutes) || 0)));
    const hh = String(Math.floor(normalized / 60)).padStart(2, '0');
    const mm = String(normalized % 60).padStart(2, '0');
    return `${hh}:${mm}`;
  }

  _minMax() {
    let min = this._parseMinutes(this.min);
    let max = this._parseMinutes(this.max);

    if (min === null) min = 0;
    if (max === null) max = 1439;

    if (min > max) {
      const tmp = min;
      min = max;
      max = tmp;
    }

    return { min, max };
  }

  _normalizeMinutes(minutes) {
    const { min, max } = this._minMax();
    const step = this._stepMinutes();

    let next = Math.round(minutes / step) * step;
    next = Math.max(min, Math.min(max, next));

    return next;
  }

  _setDisplaySafely(nextDisplay) {
    this._silentDisplay = true;
    this._display = String(nextDisplay || '');
    this._silentDisplay = false;
  }

  _setValueSafely(nextValue) {
    this._silentValue = true;
    this.value = String(nextValue || '');
    this._silentValue = false;
  }

  _syncDisplayFromValue() {
    const parsed = this._parseMinutes(this.value);
    if (parsed === null) {
      if (!this.value) {
        this._setDisplaySafely('');
        this.invalid = Boolean(this.required && !this.disabled);
      } else {
        this.invalid = !this.disabled;
      }
      this._renderOptions();
      return;
    }

    const normalized = this._formatMinutes(this._normalizeMinutes(parsed));
    if (this.value !== normalized) {
      this._setValueSafely(normalized);
    }

    this._setDisplaySafely(normalized);
    this.invalid = false;
    this._renderOptions();
  }

  _valueObserver() {
    if (this._silentValue) return;
    this._syncDisplayFromValue();
  }

  _displayObserver(nextDisplay) {
    if (this._silentDisplay) return;

    const text = String(nextDisplay || '').trim();
    if (!text) {
      if (this.value !== '') {
        this._setValueSafely('');
        this._emitValueChanged();
      }
      this.invalid = false;
      this._renderOptions();
      return;
    }

    if (/^\d{1,2}:\d{2}$/.test(text) || /^\d{3,4}$/.test(text)) {
      this._commitDisplay(false);
      return;
    }

    this._renderOptions();
  }

  _emitValueChanged() {
    this.dispatchEvent(new CustomEvent('change', {
      detail: { value: this.value },
      bubbles: true,
      composed: true
    }));

    this.dispatchEvent(new CustomEvent('value-changed', {
      detail: { value: this.value },
      bubbles: true,
      composed: true
    }));
  }

  _commitDisplay(forceValidation = false) {
    const text = String(this._display || '').trim();

    if (!text) {
      const hadValue = !!this.value;
      this._setValueSafely('');
      this.invalid = Boolean(forceValidation && this.required && !this.disabled);
      if (hadValue) this._emitValueChanged();
      this._renderOptions();
      return;
    }

    const parsed = this._parseMinutes(text);
    if (parsed === null) {
      if (forceValidation && !this.disabled) this.invalid = true;
      this._renderOptions();
      return;
    }

    const normalized = this._formatMinutes(this._normalizeMinutes(parsed));
    const changed = normalized !== this.value;

    this._setDisplaySafely(normalized);
    this._setValueSafely(normalized);
    this.invalid = false;

    if (changed) this._emitValueChanged();
    this._renderOptions();
  }

  _onInputBlur() {
    this._commitDisplay(true);
  }

  _onToggleClick(event) {
    event.stopPropagation();
    event.preventDefault();

    if (this.disabled || this.readonly) return;
    const dd = this._el('dd');
    if (!dd) return;

    if (dd.opened) {
      dd.close();
      this._opened = false;
      return;
    }

    this._renderOptions();
    const input = this._el('input');
    const target = input?.$?.inputContainer || input;
    dd.open(target, this.fitInto);
    this._opened = true;
    this._scheduleScrollToSelected();
  }

  _onDropdownShow() {
    this._opened = true;
    this._scheduleScrollToSelected();
  }

  _onDropdownHide() {
    this._opened = false;
  }

  _onInputKeydown(event) {
    if (this.disabled || this.readonly) return;
    const dd = this._el('dd');

    const step = this._stepMinutes();

    if (event.key === 'Enter') {
      this._commitDisplay(true);
      if (dd?.opened) dd.close();
      return;
    }

    if (event.key === 'Escape') {
      this._syncDisplayFromValue();
      if (dd?.opened) dd.close();
      return;
    }

    if (event.key !== 'ArrowUp' && event.key !== 'ArrowDown') return;

    event.preventDefault();

    const parsedDisplay = this._parseMinutes(this._display);
    const parsedValue = this._parseMinutes(this.value);
    const { min } = this._minMax();

    const base = parsedDisplay ?? parsedValue ?? min;
    const next = this._normalizeMinutes(calcNextMinutes(base, event.key, step));

    const normalized = this._formatMinutes(next);
    const changed = normalized !== this.value;

    this._setDisplaySafely(normalized);
    this._setValueSafely(normalized);
    this.invalid = false;

    if (changed) this._emitValueChanged();
    this._renderOptions();
    if (dd?.opened || this._opened) this._scheduleScrollToSelected();
  }

  _buildOptions() {
    const { min, max } = this._minMax();
    const step = this._stepMinutes();

    const result = [];
    for (let minutes = min; minutes <= max; minutes += step) {
      result.push(this._formatMinutes(minutes));
    }

    const tail = this._formatMinutes(max);
    if (result[result.length - 1] !== tail) {
      result.push(tail);
    }

    return result;
  }

  _renderOptions() {
    if (!this.isConnected) return;
    const optionsEl = this._el('options');
    if (!optionsEl) return;

    const selected = this._parseMinutes(this.value) !== null
      ? this._formatMinutes(this._normalizeMinutes(this._parseMinutes(this.value)))
      : '';

    const options = this._buildOptions();
    if (!options.length) {
      optionsEl.innerHTML = '<div class="empty">Нет доступного времени</div>';
      return;
    }

    optionsEl.innerHTML = options.map((time) => {
      const selectedClass = time === selected ? ' selected' : '';
      return `<button type="button" class="opt${selectedClass}" data-time="${time}">${time}</button>`;
    }).join('');

    if (this._opened) this._scheduleScrollToSelected();
  }

  _scheduleScrollToSelected() {
    if (!this._opened) return;

    queueMicrotask(() => {
      this._scrollToSelectedOption();
      requestAnimationFrame(() => this._scrollToSelectedOption());
    });
  }

  _scrollToSelectedOption() {
    const optionsEl = this._el('options');
    if (!optionsEl) return;
    if (optionsEl.clientHeight <= 0) return;

    const selectedEl = optionsEl.querySelector('.opt.selected');
    if (!selectedEl) return;

    const nextTop = calcScrollTopForOption({
      viewTop: optionsEl.scrollTop,
      viewHeight: optionsEl.clientHeight,
      optionTop: selectedEl.offsetTop,
      optionHeight: selectedEl.offsetHeight
    });
    if (nextTop !== optionsEl.scrollTop) {
      optionsEl.scrollTop = nextTop;
      return;
    }

    const itemRect = selectedEl.getBoundingClientRect();
    const viewRect = optionsEl.getBoundingClientRect();
    if (itemRect.top < viewRect.top || itemRect.bottom > viewRect.bottom) {
      selectedEl.scrollIntoView({ block: 'nearest' });
    }
  }

  _onOptionsClick(event) {
    const option = event.target.closest('[data-time]');
    if (!option) return;

    const time = option.dataset.time;
    if (!time) return;

    const changed = time !== this.value;

    this._setDisplaySafely(time);
    this._setValueSafely(time);
    this.invalid = false;
    this._renderOptions();

    if (changed) this._emitValueChanged();

    const dd = this._el('dd');
    if (dd?.opened) dd.close();
  }
}

if (!customElements.get('pl-time')) {
  customElements.define('pl-time', PlTime);
}

export default PlTime;
