import { PlElement, html, css } from 'polylib';

const DAY_MS = 24 * 60 * 60 * 1000;
const MONTHS_RU = ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'];
const WEEKDAY_RU = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];

function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function atStartOfDay(value) {
  const date = value instanceof Date ? new Date(value.getTime()) : new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  date.setHours(0, 0, 0, 0);
  return date;
}

function addDays(date, days) {
  return new Date(date.getTime() + (Number(days) || 0) * DAY_MS);
}

function dayDiff(start, end) {
  return Math.round((end.getTime() - start.getTime()) / DAY_MS);
}

function monthTitleRu(date) {
  if (!(date instanceof Date) || Number.isNaN(date.getTime())) return '';
  const month = date.toLocaleDateString('ru-RU', { month: 'long' });
  const year = date.getFullYear();
  return `${month} ${year} г.`;
}

function clamp(value, min, max) {
  if (value < min) return min;
  if (value > max) return max;
  return value;
}

function formatShortRuDate(date) {
  if (!(date instanceof Date) || Number.isNaN(date.getTime())) return '';
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  return `${day}.${month}`;
}

class PlGantt extends PlElement {
  static properties = {
    data: { type: Array, value: () => [], observer: '_queueRender' },
    dayWidth: { type: Number, value: 28, observer: '_queueRender' },
    sideWidth: { type: Number, value: 280, observer: '_queueRender' },
    minTimelineWidth: { type: Number, value: 960, observer: '_queueRender' },
    startField: { type: String, value: 'start', observer: '_queueRender' },
    endField: { type: String, value: 'end', observer: '_queueRender' },
    titleField: { type: String, value: 'title', observer: '_queueRender' },
    employeeIdField: { type: String, value: 'employeeId', observer: '_queueRender' },
    avatarField: { type: String, value: 'photo_url', observer: '_queueRender' },
    ownerField: { type: String, value: 'owner', observer: '_queueRender' },
    statusField: { type: String, value: 'status', observer: '_queueRender' },
    progressField: { type: String, value: 'progress', observer: '_queueRender' },
    segmentsField: { type: String, value: 'segments', observer: '_queueRender' },
    headCaption: { type: String, value: 'Портфель работ', observer: '_queueRender' },
    variant: { type: String, value: 'default', observer: '_queueRender' },
    barLabelMode: { type: String, value: 'full', observer: '_queueRender' },
    hideLegend: { type: Boolean, value: false, observer: '_queueRender' },
    hideMetaBadge: { type: Boolean, value: false, observer: '_queueRender' },
    hideTodayLine: { type: Boolean, value: false, observer: '_queueRender' }
  };

  static css = css`
    :host {
      display: block;
      width: 100%;
      height: 100%;
      max-width: 100%;
      min-width: 0;
      min-height: 0;
      border: 1px solid var(--pl-grey-light);
      border-radius: var(--pl-border-radius);
      background: var(--pl-background-color);
      box-sizing: border-box;
      overflow: hidden;
    }

    .scroller {
      width: 100%;
      height: 100%;
      max-width: 100%;
      overflow: auto;
      min-width: 0;
      min-height: 0;
      position: relative;
      background: var(--pl-background-color);
    }

    .gantt {
      min-width: calc(var(--side-width, 280px) + var(--timeline-width, 800px));
      width: calc(var(--side-width, 280px) + var(--timeline-width, 800px));
      min-height: 100%;
      box-sizing: border-box;
      position: relative;
    }

    .row {
      display: grid;
      grid-template-columns: var(--side-width, 280px) var(--timeline-width, 800px);
      border-bottom: 1px solid var(--pl-grey-light);
      min-height: 56px;
      box-sizing: border-box;
      position: relative;
    }

    .row.head {
      position: sticky;
      top: 0;
      z-index: 20;
      min-height: 0;
      border-bottom: 1px solid var(--pl-grey-base);
      background: var(--pl-grey-lightest);
    }

    .side {
      position: sticky;
      left: 0;
      z-index: 10;
      border-right: 1px solid var(--pl-grey-light);
      background: var(--pl-background-color);
      padding: 8px 10px;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      justify-content: center;
      gap: 2px;
      min-width: 0;
    }

    .row.head .side {
      z-index: 25;
      background: var(--pl-grey-lightest);
      justify-content: center;
      min-height: var(--pl-base-size);
    }

    .head-side-content {
      display: flex;
      flex-direction: column;
      gap: 6px;
      min-width: 0;
    }

    .head-caption {
      font: var(--pl-header-font);
      color: var(--text-secondary-black);
      font-weight: 700;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .legend {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      gap: 6px;
      min-width: 0;
    }

    .legend-item {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      height: 20px;
      padding: 0 8px;
      border-radius: 999px;
      border: 1px solid var(--pl-grey-light);
      background: var(--pl-background-color);
      font: var(--pl-text-font);
      font-size: 12px;
      color: var(--pl-grey-darkest);
      white-space: nowrap;
      box-sizing: border-box;
    }

    .legend-dot {
      width: 8px;
      height: 8px;
      border-radius: 999px;
      flex: 0 0 auto;
    }

    .title {
      font: var(--pl-header-font);
      color: var(--pl-header-color);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .side-main {
      display: flex;
      align-items: center;
      gap: 8px;
      min-width: 0;
    }

    .side-main.employee-link {
      cursor: pointer;
    }

    .side-text {
      min-width: 0;
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .side-avatar {
      display: inline-flex;
      width: 28px;
      height: 28px;
      border-radius: 999px;
      overflow: hidden;
      border: 1px solid var(--pl-grey-base);
      background: var(--pl-grey-lightest);
      flex: 0 0 auto;
    }

    .side-avatar img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    }

    .meta {
      font: var(--pl-text-font);
      color: var(--pl-grey-darkest);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .meta-badge {
      display: inline-flex;
      align-items: center;
      height: 18px;
      padding: 0 8px;
      border-radius: 999px;
      border: 1px solid var(--pl-grey-light);
      font-size: 11px;
      font-weight: 600;
      line-height: 1;
    }

    .timeline-head {
      background: var(--pl-grey-lightest);
      min-width: 0;
      box-sizing: border-box;
    }

    .months {
      display: flex;
      border-bottom: 1px solid var(--pl-grey-light);
      min-height: 28px;
      align-items: center;
    }

    .month-cell {
      height: 28px;
      border-right: 1px solid var(--pl-grey-light);
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font: var(--pl-header-font);
      color: var(--pl-header-color);
      box-sizing: border-box;
    }

    .days {
      display: flex;
      min-height: 28px;
      align-items: center;
    }

    .day-cell {
      height: 28px;
      border-right: 1px solid var(--pl-grey-light);
      display: inline-flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 1px;
      box-sizing: border-box;
      color: var(--pl-grey-darkest);
    }

    .day-num {
      font-size: 11px;
      line-height: 1;
      font-weight: 600;
    }

    .day-week {
      font-size: 10px;
      line-height: 1;
    }

    .track {
      position: relative;
      min-height: 56px;
      box-sizing: border-box;
      background: var(--pl-background-color);
      overflow: hidden;
    }

    .ticks {
      position: absolute;
      inset: 0;
      display: flex;
      pointer-events: none;
    }

    .tick {
      border-right: 1px solid var(--pl-grey-light);
      height: 100%;
      box-sizing: border-box;
      flex: 0 0 var(--day-width, 28px);
    }

    .bar {
      position: absolute;
      top: 12px;
      height: 32px;
      border-radius: 8px;
      border: 1px solid var(--pl-grey-light);
      background: var(--pl-grey-lightest);
      overflow: hidden;
      box-sizing: border-box;
      min-width: 20px;
      z-index: 2;
    }

    .bar-progress {
      position: absolute;
      inset: 0 auto 0 0;
      background: var(--pl-primary-lightest);
      border-right: 1px solid var(--pl-primary-light);
      pointer-events: none;
    }

    .bar-label {
      position: absolute;
      inset: 0 8px;
      display: inline-flex;
      align-items: center;
      justify-content: space-between;
      font: var(--pl-text-font);
      font-size: 12px;
      font-weight: 600;
      color: var(--pl-header-color);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      z-index: 2;
    }

    .bar.no-label .bar-label {
      display: none;
    }

    .bar.no-label .bar-progress {
      border-right: 0;
    }

    .bar.ok,
    .meta-badge.ok {
      background: var(--pl-gantt-ok-bg, #e7f7ee);
      border-color: var(--pl-gantt-ok-border, #8fd0b4);
      color: var(--pl-gantt-ok-color, #136a4b);
    }

    .bar.warn,
    .meta-badge.warn {
      background: var(--pl-gantt-warn-bg, #fff4de);
      border-color: var(--pl-gantt-warn-border, #f2ca78);
      color: var(--pl-gantt-warn-color, #8c6200);
    }

    .bar.bad,
    .meta-badge.bad {
      background: var(--pl-gantt-bad-bg, #ffe8e8);
      border-color: var(--pl-gantt-bad-border, #efaaaa);
      color: var(--pl-gantt-bad-color, #a33434);
    }

    .bar.info,
    .meta-badge.info {
      background: var(--pl-gantt-info-bg, #e9f1ff);
      border-color: var(--pl-gantt-info-border, #a9bff2);
      color: var(--pl-gantt-info-color, #2f5daa);
    }

    .legend-dot.ok {
      background: var(--pl-gantt-ok-color, #136a4b);
    }

    .legend-dot.warn {
      background: var(--pl-gantt-warn-color, #8c6200);
    }

    .legend-dot.bad {
      background: var(--pl-gantt-bad-color, #a33434);
    }

    .legend-dot.info {
      background: var(--pl-gantt-info-color, #2f5daa);
    }

    .bar.vacation {
      background: var(--pl-gantt-vacation-bg, #fff4de);
      border-color: var(--pl-gantt-vacation-border, #f2ca78);
      color: var(--pl-gantt-vacation-color, #8c6200);
    }

    .bar.trip {
      background: var(--pl-gantt-trip-bg, #e9f1ff);
      border-color: var(--pl-gantt-trip-border, #a9bff2);
      color: var(--pl-gantt-trip-color, #2f5daa);
    }

    .bar.sick {
      background: var(--pl-gantt-sick-bg, #ffe8e8);
      border-color: var(--pl-gantt-sick-border, #efaaaa);
      color: var(--pl-gantt-sick-color, #a33434);
    }

    .bar.remote {
      background: var(--pl-gantt-remote-bg, #e8f7ef);
      border-color: var(--pl-gantt-remote-border, #9fd1b8);
      color: var(--pl-gantt-remote-color, #21603f);
    }

    .bar.unpaid {
      background: var(--pl-gantt-unpaid-bg, #f3f5f9);
      border-color: var(--pl-gantt-unpaid-border, #d2d8e3);
      color: var(--pl-gantt-unpaid-color, #5f6370);
    }

    .legend-dot.vacation {
      background: var(--pl-gantt-vacation-color, #8c6200);
    }

    .legend-dot.trip {
      background: var(--pl-gantt-trip-color, #2f5daa);
    }

    .legend-dot.sick {
      background: var(--pl-gantt-sick-color, #a33434);
    }

    .legend-dot.remote {
      background: var(--pl-gantt-remote-color, #21603f);
    }

    .legend-dot.unpaid {
      background: var(--pl-gantt-unpaid-color, #5f6370);
    }

    .bar.planned {
      background: var(--pl-gantt-vacation-bg, #fff4de);
      border-color: var(--pl-gantt-vacation-border, #f2ca78);
      color: var(--pl-gantt-vacation-color, #8c6200);
    }

    .bar.approved {
      background: var(--pl-gantt-vacation-bg, #fff4de);
      border-color: var(--pl-gantt-vacation-border, #f2ca78);
      color: var(--pl-gantt-vacation-color, #8c6200);
    }

    .legend-dot.planned,
    .legend-dot.approved {
      background: var(--pl-gantt-vacation-color, #8c6200);
    }

    .today-line {
      position: absolute;
      top: 0;
      bottom: 0;
      width: 2px;
      background: var(--pl-red, var(--pl-negative-base, #d24e4e));
      box-shadow: 0 0 0 1px rgba(210, 78, 78, 0.2);
      z-index: 6;
      pointer-events: none;
    }

    .body {
      position: relative;
    }

    .gantt.variant-portal .row {
      min-height: 52px;
    }

    .gantt.variant-portal .track {
      background: #fcfdfe;
    }

    .gantt.variant-portal .bar {
      top: 10px;
      height: 30px;
      border-radius: 10px;
    }

    .gantt.variant-portal .title {
      font-size: 14px;
      font-weight: 700;
    }

    .gantt.variant-portal .meta {
      font-size: 12px;
      color: var(--pl-grey-darkest);
    }

    .gantt.mode-vacation .row {
      min-height: 40px;
    }

    .gantt.mode-vacation .row.head {
      min-height: 0;
    }

    .gantt.mode-vacation .row.head .side {
      justify-content: center;
      padding-top: 10px;
      padding-bottom: 8px;
    }

    .gantt.mode-vacation .head-caption {
      font-size: 18px;
      font-weight: 600;
      color: var(--pl-header-color);
      line-height: 1;
    }

    .gantt.mode-vacation .timeline-head {
      display: flex;
      align-items: flex-end;
      padding-bottom: 6px;
    }

    .gantt.mode-vacation .days {
      border-bottom: 0;
    }

    .gantt.mode-vacation .day-cell {
      height: 22px;
      border-right: 0;
      padding: 0;
      gap: 0;
    }

    .gantt.mode-vacation .day-num {
      font-size: 11px;
      font-weight: 600;
      color: #6a7873;
    }

    .gantt.mode-vacation .side {
      padding-top: 0;
      padding-bottom: 0;
      justify-content: center;
      border-right-color: transparent;
    }

    .gantt.mode-vacation .title {
      font-size: 13px;
      font-weight: 600;
      color: #32443f;
    }

    .gantt.mode-vacation .side-avatar {
      width: 26px;
      height: 26px;
    }

    .gantt.mode-vacation .meta {
      display: none;
    }

    .gantt.mode-vacation .track {
      min-height: 30px;
      background:
        linear-gradient(to right, rgba(110, 134, 125, 0.17) 1px, transparent 1px) 0 0 / var(--day-width, 28px) 100%,
        #f0f5f2;
      border: 1px solid #dce6e1;
      border-radius: 7px;
      overflow: hidden;
      margin-block: 4px;
    }

    .gantt.mode-vacation .tick {
      border-right: 0;
    }

    .gantt.mode-vacation .bar {
      top: 3px;
      height: calc(100% - 6px);
      border-radius: 6px;
      min-width: 0;
    }

    .gantt.mode-vacation .bar-progress {
      display: none;
    }

    .gantt.mode-vacation .bar-label {
      inset: 0 10px;
      justify-content: space-between;
      gap: 10px;
      font-size: 12px;
      font-weight: 700;
      color: inherit;
    }

    .gantt.mode-vacation .bar-label span {
      min-width: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .gantt.mode-vacation .bar-label span:last-child {
      flex: 0 0 auto;
      font-weight: 600;
      opacity: 0.92;
    }

    .gantt.mode-vacation .legend {
      padding: 8px 0 0;
      gap: 12px;
    }

    .gantt.mode-vacation .legend-item {
      border: 0;
      background: transparent;
      height: auto;
      padding: 0;
      font-size: 12px;
      color: #5b6a65;
      gap: 6px;
    }

    .gantt.mode-vacation .legend-dot {
      width: 12px;
      height: 12px;
      border-radius: 3px;
    }

    .gantt.mode-vacation .row:last-of-type {
      border-bottom: 0;
    }

    .empty {
      padding: 18px;
      text-align: center;
      color: var(--pl-grey-darkest);
      font: var(--pl-text-font);
    }
  `;

  static template = html`
    <div id="scroller" class="scroller"></div>
  `;

  constructor() {
    super();
    this._renderRaf = 0;
    this._resizeObserver = null;
    this._lastHostWidth = 0;
    this._lastHostHeight = 0;
    this._bound = {
      onClick: this._onRootClick.bind(this),
      onResize: this._onResize.bind(this)
    };
  }

  connectedCallback() {
    super.connectedCallback();
    this.$?.scroller?.addEventListener('click', this._bound.onClick);
    this._observeResize();
    this._queueRender();
  }

  disconnectedCallback() {
    this.$?.scroller?.removeEventListener('click', this._bound.onClick);
    this._resizeObserver?.disconnect?.();
    this._resizeObserver = null;
    if (this._renderRaf) {
      cancelAnimationFrame(this._renderRaf);
      this._renderRaf = 0;
    }
    super.disconnectedCallback();
  }

  _queueRender() {
    if (!this.isConnected || !this.$?.scroller) return;
    if (this._renderRaf) cancelAnimationFrame(this._renderRaf);
    this._renderRaf = requestAnimationFrame(() => {
      this._renderRaf = 0;
      this._render();
    });
  }

  _observeResize() {
    if (typeof ResizeObserver === 'undefined' || this._resizeObserver) return;
    this._resizeObserver = new ResizeObserver(this._bound.onResize);
    this._resizeObserver.observe(this);
  }

  _onResize(entries) {
    if (!Array.isArray(entries) || entries.length === 0) return;
    const entry = entries[0];
    const width = Math.round(entry?.contentRect?.width || this.clientWidth || 0);
    const height = Math.round(entry?.contentRect?.height || this.clientHeight || 0);
    if (width === this._lastHostWidth && height === this._lastHostHeight) return;
    this._lastHostWidth = width;
    this._lastHostHeight = height;
    this._queueRender();
  }

  _onRootClick(event) {
    const target = event?.target?.closest?.('[data-employee-id]');
    if (!target) return;
    const employeeId = String(target.getAttribute('data-employee-id') || '').trim();
    if (!employeeId) return;
    const detail = {
      employeeId,
      rowKey: String(target.getAttribute('data-row-key') || '')
    };
    this.dispatchEvent(new CustomEvent('employee-click', {
      detail,
      bubbles: true,
      composed: true
    }));
    this.dispatchEvent(new CustomEvent('employeeClick', {
      detail,
      bubbles: true,
      composed: true
    }));
  }

  _statusTone(status) {
    const normalized = String(status || '').trim().toLowerCase();
    if (!normalized) return 'info';
    if (normalized.includes('риск') || normalized.includes('эскал')) return 'bad';
    if (normalized.includes('заверш') || normalized.includes('готов') || normalized.includes('стабил')) return 'ok';
    if (normalized.includes('контрол') || normalized.includes('наблю') || normalized.includes('план') || normalized.includes('завис')) return 'warn';
    if (normalized.includes('работ') || normalized.includes('work') || normalized.includes('progress')) return 'info';
    return 'info';
  }

  _segmentTone(type) {
    const normalized = String(type || '').trim().toLowerCase();
    if (normalized === 'vacation' || normalized.includes('отпуск') || normalized === 'approved' || normalized === 'planned' || normalized.includes('подтверж') || normalized.includes('план')) return 'vacation';
    if (normalized === 'trip' || normalized.includes('команд')) return 'trip';
    if (normalized === 'sick' || normalized.includes('больнич')) return 'sick';
    if (normalized === 'remote' || normalized.includes('удален')) return 'remote';
    if (normalized === 'unpaid' || normalized.includes('за свой счет') || normalized.includes('отгул')) return 'unpaid';
    return 'vacation';
  }

  _segmentDate(value, anchorDate) {
    if (typeof value === 'number' && Number.isFinite(value)) {
      const day = clamp(Math.round(value), 1, 31);
      return atStartOfDay(new Date(anchorDate.getFullYear(), anchorDate.getMonth(), day));
    }
    return atStartOfDay(value);
  }

  _legendItems(segmentMode = false) {
    if (segmentMode) {
      return [
        { tone: 'vacation', label: 'Отпуск' },
        { tone: 'trip', label: 'Командировка' },
        { tone: 'sick', label: 'Больничный' },
        { tone: 'remote', label: 'Удаленная работа' },
        { tone: 'unpaid', label: 'Отгул за свой счет' }
      ];
    }
    return [
      { tone: 'info', label: 'В работе' },
      { tone: 'warn', label: 'План / На контроле' },
      { tone: 'bad', label: 'Риск / Эскалация' },
      { tone: 'ok', label: 'Завершено / Стабильно' }
    ];
  }

  _segmentLabel(type, tone, startDate, endDate) {
    const normalized = String(type || '').trim().toLowerCase();
    const fromText = formatShortRuDate(startDate);
    const toText = formatShortRuDate(endDate);
    const periodText = fromText && toText ? ` с ${fromText} по ${toText}` : '';
    if (normalized === 'trip' || normalized.includes('команд') || tone === 'trip') return `Командировка${periodText}`;
    if (normalized === 'sick' || normalized.includes('больнич') || tone === 'sick') return `Больничный${periodText}`;
    if (normalized === 'remote' || normalized.includes('удален') || tone === 'remote') return `Удаленная работа${periodText}`;
    if (normalized === 'unpaid' || normalized.includes('за свой счет') || normalized.includes('отгул') || tone === 'unpaid') return `Отгул за свой счет${periodText}`;
    return `В отпуске${periodText}`;
  }

  _segmentRemainderLabel(startDate, endDate, todayDate) {
    const start = atStartOfDay(startDate);
    const end = atStartOfDay(endDate);
    const today = atStartOfDay(todayDate);
    if (!start || !end || !today) return '';
    if (today > end) return 'завершено';
    if (today < start) {
      const daysBefore = dayDiff(today, start);
      return `через ${daysBefore} дн.`;
    }
    const daysLeft = dayDiff(today, end) + 1;
    return `осталось ${daysLeft} дн.`;
  }

  _renderLegendItem(item) {
    const tone = String(item?.tone || 'info');
    const label = String(item?.label || '');
    return `<span class="legend-item"><span class="legend-dot ${tone}"></span>${escapeHtml(label)}</span>`;
  }

  _normalizeRows() {
    const rows = Array.isArray(this.data) ? this.data : [];
    const titleField = this.titleField || 'title';
    const employeeIdField = this.employeeIdField || 'employeeId';
    const avatarField = this.avatarField || 'photo_url';
    const ownerField = this.ownerField || 'owner';
    const statusField = this.statusField || 'status';
    const startField = this.startField || 'start';
    const endField = this.endField || 'end';
    const progressField = this.progressField || 'progress';
    const segmentsField = this.segmentsField || 'segments';
    const today = atStartOfDay(new Date());

    return rows.map((item, index) => {
      const start = atStartOfDay(item?.[startField]);
      const end = atStartOfDay(item?.[endField]);
      const safeStart = start || atStartOfDay(new Date());
      const safeEnd = end && end >= safeStart ? end : safeStart;
      const progress = clamp(Number(item?.[progressField] || 0), 0, 100);
      const status = String(item?.[statusField] || '');
      const tone = this._statusTone(status);
      const rawSegments = Array.isArray(item?.[segmentsField]) ? item[segmentsField] : [];
      const anchor = safeStart || today;
      const segments = rawSegments
        .map((segment) => {
          const segmentStart = this._segmentDate(segment?.start, anchor);
          const segmentEnd = this._segmentDate(segment?.end, segmentStart || anchor);
          if (!segmentStart || !segmentEnd) return null;
          const safeSegmentEnd = segmentEnd < segmentStart ? segmentStart : segmentEnd;
          return {
            start: segmentStart,
            end: safeSegmentEnd,
            tone: this._segmentTone(segment?.type),
            type: String(segment?.type || '')
          };
        })
        .filter(Boolean);

      let finalStart = safeStart;
      let finalEnd = safeEnd;
      if (segments.length) {
        finalStart = segments[0].start;
        finalEnd = segments[0].end;
        segments.forEach((segment) => {
          if (segment.start < finalStart) finalStart = segment.start;
          if (segment.end > finalEnd) finalEnd = segment.end;
        });
      }

      return {
        key: String(item?.id ?? index),
        employeeId: String(item?.[employeeIdField] || item?.employeeId || ''),
        title: String(item?.[titleField] || `Задача ${index + 1}`),
        avatar: String(item?.[avatarField] || item?.avatar || ''),
        owner: String(item?.[ownerField] || 'Не назначен'),
        status,
        tone,
        progress,
        start: finalStart,
        end: finalEnd,
        segments
      };
    });
  }

  _timelineBounds(rows, segmentMode = false) {
    const today = atStartOfDay(new Date());
    if (!rows.length) {
      return {
        start: addDays(today, -2),
        end: addDays(today, 14)
      };
    }

    if (segmentMode) {
      const reference = rows.find((row) => row?.segments?.length)?.segments?.[0]?.start || rows[0].start || today;
      const monthStart = new Date(reference.getFullYear(), reference.getMonth(), 1);
      const monthEnd = new Date(reference.getFullYear(), reference.getMonth() + 1, 0);
      return { start: monthStart, end: monthEnd };
    }

    let min = rows[0].start;
    let max = rows[0].end;
    rows.forEach((row) => {
      if (row.start < min) min = row.start;
      if (row.end > max) max = row.end;
    });

    return {
      start: addDays(min, -1),
      end: addDays(max, 1)
    };
  }

  _buildDays(start, end) {
    const days = [];
    let cursor = start;
    while (cursor <= end) {
      days.push(cursor);
      cursor = addDays(cursor, 1);
    }
    return days;
  }

  _buildMonthSpans(days) {
    const spans = [];
    days.forEach((date) => {
      const year = date.getFullYear();
      const month = date.getMonth();
      const key = `${year}-${month}`;
      const current = spans[spans.length - 1];
      if (!current || current.key !== key) {
        spans.push({
          key,
          month,
          year,
          span: 1
        });
      } else {
        current.span += 1;
      }
    });
    return spans;
  }

  _render() {
    const root = this.$?.scroller;
    if (!root) return;

    const rows = this._normalizeRows();
    const segmentMode = rows.some((row) => Array.isArray(row?.segments) && row.segments.length);
    const { start, end } = this._timelineBounds(rows, segmentMode);
    const days = this._buildDays(start, end);
    const monthSpans = this._buildMonthSpans(days);

    const baseDayWidth = Math.max(20, Number(this.dayWidth) || 28);
    const sideWidth = Math.max(180, Number(this.sideWidth) || 280);
    const minTimelineWidth = Math.max(360, Number(this.minTimelineWidth) || 960);
    let dayWidth = baseDayWidth;
    if (segmentMode) {
      const availableWidth = Math.max(0, (root.clientWidth || 0) - sideWidth);
      const fitWidth = days.length ? Math.floor(availableWidth / days.length) : baseDayWidth;
      dayWidth = Math.max(baseDayWidth, fitWidth);
    }
    if (days.length > 0) {
      const minDayWidthByTimeline = Math.ceil(minTimelineWidth / days.length);
      dayWidth = Math.max(dayWidth, minDayWidthByTimeline);
    }
    const timelineWidth = days.length * dayWidth;
    const ticksHtml = days.map(() => `<span class="tick"></span>`).join('');
    const legendHtml = this._legendItems(segmentMode).map((item) => this._renderLegendItem(item)).join('');
    const isPortalVariant = String(this.variant || '').trim().toLowerCase() === 'portal';
    const labelMode = String(this.barLabelMode || 'full').trim().toLowerCase();
    const showLegend = !this.hideLegend;
    const showMetaBadge = !this.hideMetaBadge;
    const fallbackCaption = segmentMode ? monthTitleRu(start) : 'Портфель работ';
    const headCaption = escapeHtml(this.headCaption || fallbackCaption);
    const finalHeadCaption = segmentMode ? escapeHtml(monthTitleRu(start)) : headCaption;

    const today = atStartOfDay(new Date());
    const todayOffset = dayDiff(start, today);
    const showTodayLine = !this.hideTodayLine && todayOffset >= 0 && todayOffset <= days.length;

    if (!rows.length) {
      root.innerHTML = '<div class="empty">Нет задач для отображения</div>';
      return;
    }

    const monthHtml = monthSpans.map((m) => {
      const width = m.span * dayWidth;
      return `<div class="month-cell" style="width:${width}px">${MONTHS_RU[m.month]} ${m.year}</div>`;
    }).join('');

    const dayHtml = days.map((date) => {
      if (segmentMode) {
        return `
          <div class="day-cell" style="width:${dayWidth}px">
            <span class="day-num">${String(date.getDate())}</span>
          </div>
        `;
      }
      return `
        <div class="day-cell" style="width:${dayWidth}px">
          <span class="day-num">${String(date.getDate()).padStart(2, '0')}</span>
          <span class="day-week">${WEEKDAY_RU[date.getDay()]}</span>
        </div>
      `;
    }).join('');

    const rowsHtml = rows.map((row) => {
      const metaBadgeHtml = showMetaBadge ? `<span class="meta-badge ${row.tone}">${escapeHtml(row.status || 'Без статуса')}</span>` : '';
      const avatarHtml = row.avatar
        ? `<span class="side-avatar"><img src="${escapeHtml(row.avatar)}" alt="${escapeHtml(row.title)}"></span>`
        : '';
      const employeeAttrs = row.employeeId
        ? `data-employee-id="${escapeHtml(row.employeeId)}" data-row-key="${escapeHtml(row.key)}"`
        : '';
      const sideMainClass = row.employeeId ? 'side-main employee-link' : 'side-main';
      let barsHtml = '';
      if (segmentMode && row.segments.length) {
        barsHtml = row.segments.map((segment) => {
          const barLeft = dayDiff(start, segment.start) * dayWidth;
          const barWidth = (dayDiff(segment.start, segment.end) + 1) * dayWidth;
          const barClass = labelMode === 'none' ? `bar ${segment.tone} no-label` : `bar ${segment.tone}`;
          const leftLabel = this._segmentLabel(segment.type, segment.tone, segment.start, segment.end);
          const rightLabel = this._segmentRemainderLabel(segment.start, segment.end, today);
          const barLabel = labelMode === 'none'
            ? ''
            : `
              <div class="bar-label">
                <span>${escapeHtml(leftLabel)}</span>
                <span>${escapeHtml(rightLabel)}</span>
              </div>
            `;
          return `
            <div class="${barClass}" style="left:${barLeft}px;width:${barWidth}px;">
              ${barLabel}
            </div>
          `;
        }).join('');
      } else {
        const barLeft = dayDiff(start, row.start) * dayWidth;
        const barWidth = (dayDiff(row.start, row.end) + 1) * dayWidth;
        const progressWidth = Math.round((barWidth * row.progress) / 100);
        const barClass = labelMode === 'none' ? `bar ${row.tone} no-label` : `bar ${row.tone}`;
        const barLabelHtml = labelMode === 'none'
          ? ''
          : labelMode === 'status'
            ? `<div class="bar-label">${escapeHtml(row.status || 'План')}</div>`
            : `<div class="bar-label">${escapeHtml(row.status || 'План')}<span>${row.progress}%</span></div>`;
        barsHtml = `
          <div class="${barClass}" style="left:${barLeft}px;width:${barWidth}px;">
            <div class="bar-progress" style="width:${progressWidth}px;"></div>
            ${barLabelHtml}
          </div>
        `;
      }

      return `
        <div class="row">
          <div class="side">
            <div class="${sideMainClass}" ${employeeAttrs}>
              ${avatarHtml}
              <div class="side-text">
                <div class="title">${escapeHtml(row.title)}</div>
                <div class="meta">
                  <span>${escapeHtml(row.owner)}</span>
                  ${metaBadgeHtml}
                </div>
              </div>
            </div>
          </div>
          <div class="track">
            <div class="ticks">${ticksHtml}</div>
            ${barsHtml}
          </div>
        </div>
      `;
    }).join('');

    const legendBlock = showLegend ? `<div class="legend">${legendHtml}</div>` : '';
    const variantClass = isPortalVariant ? ' variant-portal' : '';
    const modeClass = segmentMode ? ' mode-vacation' : '';
    const monthsBlock = segmentMode ? '' : `<div class="months">${monthHtml}</div>`;
    const headLegendBlock = segmentMode ? '' : legendBlock;
    const footLegendBlock = segmentMode ? legendBlock : '';

    root.innerHTML = `
        <div
        class="gantt${variantClass}${modeClass}"
        style="--timeline-width:${timelineWidth}px;--side-width:${sideWidth}px;--day-width:${dayWidth}px;">
        <div class="row head">
          <div class="side">
            <div class="head-side-content">
              <div class="head-caption">${finalHeadCaption}</div>
              ${headLegendBlock}
            </div>
          </div>
          <div class="timeline-head">
            ${monthsBlock}
            <div class="days">${dayHtml}</div>
          </div>
        </div>
        <div class="body">
          ${showTodayLine ? `<div class="today-line" style="left:${sideWidth + todayOffset * dayWidth}px"></div>` : ''}
          ${rowsHtml}
          ${footLegendBlock}
        </div>
      </div>
    `;
  }
}

if (!customElements.get('pl-gantt')) {
  customElements.define('pl-gantt', PlGantt);
}
