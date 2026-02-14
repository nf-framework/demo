import { PlElement, html, css } from 'polylib';
import { escapeHtml, fmt, pad, ppm, ruWeekdayFull, snap15, toISODate } from '/generated/components/calendar/helpers/date-time.js';
import { isAllDay, isPast, layoutDay, packWeekSpans } from '/generated/components/calendar/helpers/layout.js';
import {
  applyResizeEnd,
  applyResizeStart,
  getBlockedIntervals,
  intersectsBlocked,
  minutesRangeByEvent,
  moveTimedEventByMinutes
} from '/generated/components/calendar/helpers/operations.js';

class PlProCalendarWeekView extends PlElement {
  static properties = {
    currentDate: { type: Object, value: () => new Date(), observer: '_stateChanged' },
    events: { type: Array, value: () => [], observer: '_stateChanged' },
    currentTime: { type: Number, value: 0, observer: '_stateChanged' },
    blockedSlots: { type: Array, value: () => [], observer: '_stateChanged' },
    selfPersonId: { type: String, value: 'self', observer: '_stateChanged' }
  };

  static css = css`
    :host {
      display: block;
      color: var(--text, #1f2937);
      background: var(--surface, #fff);
      width: 100%;
      max-width: 100%;
      min-width: 0;
      height: 100%;
      min-height: 100%;
      --week-time-col-w: 88px;
      --week-header-h: 62px;
      --week-all-day-h: 56px;
      --cal-bg-soft: var(--pl-grey-lightest, #f5f6f7);
      --cal-bg-softer: var(--pl-background-color, #fff);
      --cal-border: var(--pl-grey-light, #e9edf0);
      --cal-border-strong: var(--pl-grey-base, #cad0d6);
      --cal-muted: var(--muted, var(--pl-grey-darkest, #85919c));
      --cal-text: var(--text, var(--pl-text-color, #2a3143));
      --cal-accent: var(--accent, var(--pl-primary-base, #3A817D));
      --cal-negative: var(--pl-negative-base, #F54A4B);
      --cal-attention: var(--pl-attention, #F2D26E);
    }

    .header {
      position: sticky;
      top: 0;
      z-index: 20;
      display: grid;
      grid-template-columns: var(--week-time-col-w) repeat(7, minmax(0, 1fr));
      width: 100%;
      min-width: 0;
      background: var(--cal-bg-soft);
      border-bottom: 1px solid var(--cal-border);
      height: var(--week-header-h);
    }

    .h-time {
      display: flex;
      align-items: center;
      justify-content: center;
      border-right: 1px solid var(--cal-border);
      color: var(--cal-muted);
      font-size: 24px;
      font-weight: 700;
      letter-spacing: -.01em;
    }

    .hcell {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      gap: 2px;
      padding: 0 8px;
      border-right: 1px solid var(--cal-border);
      background: var(--cal-bg-soft);
      box-sizing: border-box;
      text-align: center;
    }

    .hcell.weekend {
      background:
        repeating-linear-gradient(
          -45deg,
          var(--cal-bg-soft),
          var(--cal-bg-soft) 8px,
          var(--cal-bg-softer) 8px,
          var(--cal-bg-softer) 16px
        );
    }

    .hlabel {
      font-size: 14px;
      font-weight: 700;
      color: var(--cal-text);
      line-height: 1.2;
      white-space: nowrap;
    }

    .hnum {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border-radius: 999px;
      min-width: 34px;
      height: 26px;
      padding: 0 10px;
      font-size: 14px;
      line-height: 1;
      color: var(--cal-muted);
      font-weight: 700;
    }

    .hcell.today .hnum {
      background: var(--cal-accent);
      color: var(--pl-background-color, #fff);
      box-shadow: 0 2px 8px rgba(15, 118, 110, .28);
    }

    .allday {
      display: grid;
      grid-template-columns: var(--week-time-col-w) 1fr;
      width: 100%;
      min-width: 0;
      border-bottom: 1px solid var(--cal-border);
      background: var(--cal-bg-soft);
      position: sticky;
      top: var(--week-header-h);
      z-index: 19;
      min-height: var(--week-all-day-h);
    }

    .allday-scale {
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 13px;
      color: var(--cal-muted);
      border-right: 1px solid var(--cal-border);
      font-weight: 700;
      letter-spacing: .02em;
      text-transform: uppercase;
      text-align: center;
      line-height: 1.2;
      padding: 0 6px;
      box-sizing: border-box;
    }

    .allday-grid {
      position: relative;
      display: grid;
      grid-template-columns: repeat(7, minmax(0, 1fr));
      width: 100%;
      gap: 6px;
      padding: 10px;
      box-sizing: border-box;
    }

    .allday-row {
      display: contents;
    }

    .allday-span {
      --ev-color: var(--type-default, var(--pl-primary-base, #3A817D));
      --ev-bg: var(--pl-primary-lightest, #EAF4EF);
      background: var(--ev-bg);
      border: 1px solid var(--cal-border-strong);
      border-inline-start: 4px solid var(--ev-color);
      color: var(--cal-text);
      border-radius: 10px;
      padding: 5px 8px;
      font-size: 12px;
      font-weight: 600;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      box-shadow: 0 2px 6px rgba(15, 23, 42, .08);
      pointer-events: auto;
      cursor: move;
    }

    .allday-span.past { opacity: .6; }
    .allday-span[type="default"] { --ev-color: var(--type-default, var(--pl-primary-base, #3A817D)); --ev-bg: var(--pl-primary-lightest, #EAF4EF); }
    .allday-span[type="tech"] { --ev-color: var(--type-tech, var(--pl-primary-dark, #1C635F)); --ev-bg: color-mix(in srgb, var(--pl-primary-light, #BBD8CB), white 55%); }
    .allday-span[type="screen"] { --ev-color: var(--type-screen, var(--pl-grey-darkest, #85919C)); --ev-bg: var(--pl-grey-lightest, #F5F6F7); }
    .allday-span[type="manager"] { --ev-color: var(--type-manager, var(--pl-attention, #F2D26E)); --ev-bg: color-mix(in srgb, var(--pl-attention, #F2D26E), white 76%); }
    .allday-span[type="offer"] { --ev-color: var(--type-offer, var(--pl-negative-base, #F54A4B)); --ev-bg: var(--pl-negative-lightest, #FFECED); }

    .allday-more { position: relative; }

    .allday-more .badge {
      position: absolute;
      right: 6px;
      top: -1px;
      font-size: 11px;
      line-height: 18px;
      padding: 0 6px;
      border-radius: 999px;
      background: var(--cal-bg-soft);
      color: var(--cal-muted);
      border: 1px solid var(--cal-border);
      cursor: pointer;
      user-select: none;
      font-weight: 700;
    }

    .week {
      display: grid;
      grid-template-columns: var(--week-time-col-w) repeat(7, minmax(0, 1fr));
      width: 100%;
      min-width: 0;
    }

    .timecol {
      position: sticky;
      left: 0;
      z-index: 10;
      background: var(--cal-bg-soft);
      border-right: 1px solid var(--cal-border);
    }

    .slot {
      height: var(--hour-height, 84px);
      padding-right: 14px;
      padding-top: 5px;
      color: var(--cal-muted);
      font-size: 13px;
      font-weight: 700;
      display: flex;
      align-items: flex-start;
      justify-content: flex-end;
      border-top: 1px solid var(--cal-border);
      box-sizing: border-box;
      font-variant-numeric: tabular-nums;
    }

    .wcol {
      position: relative;
      min-height: calc(24 * var(--hour-height, 84px));
      border-left: 1px solid var(--cal-border);
      user-select: none;
      background-color: var(--cal-bg-softer);
      overflow: hidden;
    }

    .wcol::before {
      content: '';
      position: absolute;
      inset: 0;
      background-image:
        repeating-linear-gradient(
          to bottom,
          transparent,
          transparent calc(var(--hour-height, 84px) - 1px),
          var(--cal-border) calc(var(--hour-height, 84px) - 1px),
          var(--cal-border) var(--hour-height, 84px)
        );
      pointer-events: none;
      z-index: 1;
    }

    .wcol.weekend {
      background-image:
        repeating-linear-gradient(
          -45deg,
          var(--cal-bg-soft),
          var(--cal-bg-soft) 8px,
          var(--cal-bg-softer) 8px,
          var(--cal-bg-softer) 16px
        );
    }

    .blocked {
      position: absolute;
      left: 0;
      right: 0;
      border-top: 1px solid var(--cal-border-strong);
      border-bottom: 1px solid var(--cal-border-strong);
      z-index: 4;
      display: flex;
      align-items: center;
      justify-content: center;
      pointer-events: none;
      color: var(--cal-muted);
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: .02em;
      text-align: center;
      padding: 0 4px;
      box-sizing: border-box;
    }

    .blocked.break {
      background:
        repeating-linear-gradient(
          -45deg,
          color-mix(in srgb, var(--pl-attention, #F2D26E), var(--cal-bg-softer) 86%),
          color-mix(in srgb, var(--pl-attention, #F2D26E), var(--cal-bg-softer) 86%) 10px,
          color-mix(in srgb, var(--pl-attention, #F2D26E), var(--cal-bg-softer) 92%) 10px,
          color-mix(in srgb, var(--pl-attention, #F2D26E), var(--cal-bg-softer) 92%) 20px
        );
      border-top-color: var(--cal-attention);
      border-bottom-color: var(--cal-attention);
    }

    .blocked.unavailable {
      background:
        repeating-linear-gradient(
          -45deg,
          color-mix(in srgb, var(--pl-negative-light, #FEC3C4), var(--cal-bg-softer) 88%),
          color-mix(in srgb, var(--pl-negative-light, #FEC3C4), var(--cal-bg-softer) 88%) 10px,
          color-mix(in srgb, var(--pl-negative-lightest, #FFECED), var(--cal-bg-softer) 90%) 10px,
          color-mix(in srgb, var(--pl-negative-lightest, #FFECED), var(--cal-bg-softer) 90%) 20px
        );
      color: var(--pl-negative-dark, #C83739);
      border-top-color: var(--pl-negative-light, #FEC3C4);
      border-bottom-color: var(--pl-negative-light, #FEC3C4);
    }

    .now {
      position: absolute;
      left: 0;
      right: 0;
      height: 2px;
      background: var(--cal-negative);
      z-index: 6;
    }

    .ind {
      position: absolute;
      left: 6px;
      right: 6px;
      height: 3px;
      border-radius: 2px;
      background: var(--cal-accent);
      pointer-events: none;
      z-index: 7;
      display: none;
    }

    .ev {
      --ev-color: var(--type-default, var(--pl-primary-base, #3A817D));
      --ev-bg: var(--pl-primary-lightest, #EAF4EF);
      position: absolute;
      margin: 0 4px;
      border-radius: 10px;
      overflow: hidden;
      color: var(--cal-text);
      background: var(--ev-bg);
      border: 1px solid var(--cal-border-strong);
      border-inline-start: 4px solid var(--ev-color);
      box-shadow: 0 4px 10px rgba(15, 23, 42, .12);
      cursor: pointer;
      z-index: 5;
    }

    .ev.sm { min-height: 26px; }
    .ev.md { min-height: 40px; }
    .ev.lg { min-height: 54px; }

    .ev::after {
      content: '';
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      height: 4px;
      background-image:
        repeating-linear-gradient(
          -45deg,
          var(--ev-color),
          var(--ev-color) 4px,
          transparent 4px,
          transparent 7px
        );
      opacity: .35;
      pointer-events: none;
    }

    .ev.past {
      filter: grayscale(0.25);
      opacity: .6;
    }

    .ev[type="default"] { --ev-color: var(--type-default, var(--pl-primary-base, #3A817D)); --ev-bg: var(--pl-primary-lightest, #EAF4EF); }
    .ev[type="tech"] { --ev-color: var(--type-tech, var(--pl-primary-dark, #1C635F)); --ev-bg: color-mix(in srgb, var(--pl-primary-light, #BBD8CB), white 55%); }
    .ev[type="screen"] { --ev-color: var(--type-screen, var(--pl-grey-darkest, #85919C)); --ev-bg: var(--pl-grey-lightest, #F5F6F7); }
    .ev[type="manager"] { --ev-color: var(--type-manager, var(--pl-attention, #F2D26E)); --ev-bg: color-mix(in srgb, var(--pl-attention, #F2D26E), white 76%); }
    .ev[type="offer"] { --ev-color: var(--type-offer, var(--pl-negative-base, #F54A4B)); --ev-bg: var(--pl-negative-lightest, #FFECED); }

    .ev-body {
      padding: 8px 10px 10px;
      font-size: 12px;
      line-height: 1.35;
    }

    .ev-title {
      font-weight: 700;
      margin-bottom: 4px;
    }

    .ev-meta {
      opacity: .9;
      font-variant-numeric: tabular-nums;
      font-weight: 600;
    }

    .ev .resize-handle {
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      height: 8px;
      cursor: ns-resize;
      background: linear-gradient(to bottom, transparent, color-mix(in srgb, var(--cal-text), transparent 86%));
      border-bottom-left-radius: 10px;
      border-bottom-right-radius: 10px;
    }

    .ev .resize-handle-top {
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      height: 8px;
      cursor: ns-resize;
      background: linear-gradient(to top, transparent, color-mix(in srgb, var(--cal-text), transparent 86%));
      border-top-left-radius: 10px;
      border-top-right-radius: 10px;
    }

    .ev.resizing {
      outline: 2px dashed color-mix(in srgb, var(--cal-accent), transparent 45%);
      outline-offset: -2px;
    }
  `;

  static template = html`<div id="root"></div>`;

  constructor() {
    super();

    this._dropIndicator = null;
    this._expandedWeeks = new Set();

    this._dragging = false;
    this._resizing = null;
    this._resizeDraft = null;
    this._resizingTop = null;
    this._resizeDraftTop = null;

    this._scrollEl = null;
    this._handlers = {};
    this._activeResizeListeners = null;
  }

  connectedCallback() {
    super.connectedCallback();
    this._detectScrollEl();
    this._bindDelegates();
    this._render();
    queueMicrotask(() => this._scrollToCurrentTime());
  }

  disconnectedCallback() {
    this._unbindDelegates();
    this._removeResizeListeners();
    super.disconnectedCallback();
  }

  _stateChanged() {
    this._render();
  }

  _detectScrollEl() {
    try {
      let p = this.parentElement;
      while (p) {
        const st = getComputedStyle(p);
        if (/auto|scroll/.test(st.overflowY)) {
          this._scrollEl = p;
          break;
        }
        p = p.parentElement;
      }
    } catch {
      this._scrollEl = null;
    }
  }

  _bindDelegates() {
    if (!this.$?.root) return;

    this._handlers.click = this._onClick.bind(this);
    this._handlers.dblclick = this._onDblClick.bind(this);
    this._handlers.mousedown = this._onMouseDown.bind(this);
    this._handlers.dragstart = this._onDragStart.bind(this);
    this._handlers.dragend = this._onDragEnd.bind(this);
    this._handlers.dragover = this._onDragOver.bind(this);
    this._handlers.dragleave = this._onDragLeave.bind(this);
    this._handlers.drop = this._onDrop.bind(this);

    this.$.root.addEventListener('click', this._handlers.click);
    this.$.root.addEventListener('dblclick', this._handlers.dblclick);
    this.$.root.addEventListener('mousedown', this._handlers.mousedown);
    this.$.root.addEventListener('dragstart', this._handlers.dragstart);
    this.$.root.addEventListener('dragend', this._handlers.dragend);
    this.$.root.addEventListener('dragover', this._handlers.dragover);
    this.$.root.addEventListener('dragleave', this._handlers.dragleave);
    this.$.root.addEventListener('drop', this._handlers.drop);
  }

  _unbindDelegates() {
    if (!this.$?.root) return;

    this.$.root.removeEventListener('click', this._handlers.click);
    this.$.root.removeEventListener('dblclick', this._handlers.dblclick);
    this.$.root.removeEventListener('mousedown', this._handlers.mousedown);
    this.$.root.removeEventListener('dragstart', this._handlers.dragstart);
    this.$.root.removeEventListener('dragend', this._handlers.dragend);
    this.$.root.removeEventListener('dragover', this._handlers.dragover);
    this.$.root.removeEventListener('dragleave', this._handlers.dragleave);
    this.$.root.removeEventListener('drop', this._handlers.drop);
  }

  _removeResizeListeners() {
    if (!this._activeResizeListeners) return;

    window.removeEventListener('mousemove', this._activeResizeListeners.onMove);
    window.removeEventListener('mouseup', this._activeResizeListeners.onUp);
    this._activeResizeListeners = null;
  }

  _emit(name, detail) {
    this.dispatchEvent(new CustomEvent(name, {
      detail,
      bubbles: true,
      composed: true
    }));
  }

  _scrollToCurrentTime() {
    if (!this._scrollEl) return;
    const top = Math.max(0, (this.currentTime || 0) * ppm() - 180);
    this._scrollEl.scrollTop = top;
  }

  _weekStartOf(dateLike) {
    const date = new Date(dateLike || new Date());
    const dow = date.getDay();
    const shift = dow === 0 ? 6 : dow - 1;
    date.setDate(date.getDate() - shift);
    date.setHours(0, 0, 0, 0);
    return date;
  }

  _autoScrollByPointer(clientY) {
    const el = this._scrollEl;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const threshold = 40;
    const speed = 16;

    if (clientY < rect.top + threshold) {
      el.scrollTop -= speed;
    } else if (clientY > rect.bottom - threshold) {
      el.scrollTop += speed;
    }
  }

  _renderTimeScale() {
    return Array.from({ length: 24 }, (_, i) => `<div class="slot">${String(i).padStart(2, '0')}:00</div>`).join('');
  }

  _renderEventBlock(item, pxPerMinute) {
    const ev = item.ev;
    const size = item.height < 45 ? 'sm' : (item.height < 90 ? 'md' : 'lg');

    const left = `calc(${item.leftPct}% + var(--event-gap, 4px)/2)`;
    const width = `calc(${item.widthPct}% - var(--event-gap, 4px))`;

    const topPx = Math.round(item.top * pxPerMinute);
    const hPx = Math.round(item.height * pxPerMinute);

    const draftEnd = this._resizeDraft && this._resizeDraft.id === ev.id ? new Date(this._resizeDraft.end) : null;
    const draftStart = this._resizeDraftTop && this._resizeDraftTop.id === ev.id ? new Date(this._resizeDraftTop.start) : null;

    const startBase = draftStart || new Date(ev.start);
    const startMin = startBase.getHours() * 60 + startBase.getMinutes();

    const draftHeight = draftEnd
      ? Math.round(((draftEnd.getHours() * 60 + draftEnd.getMinutes()) - startMin) * pxPerMinute)
      : hPx;

    const draftTop = draftStart
      ? Math.round(startMin * pxPerMinute)
      : topPx;

    const isResizing = (this._resizeDraft && this._resizeDraft.id === ev.id)
      || (this._resizeDraftTop && this._resizeDraftTop.id === ev.id);

    return `
      <div class="ev ${isPast(ev) ? 'past' : ''} ${size} ${isResizing ? 'resizing' : ''}"
           type="${ev.type || 'default'}"
           style="top:${draftTop}px;height:${draftHeight}px;left:${left};width:${width}"
           draggable="true"
           data-ev-id="${ev.id}">
        <div class="ev-body">
          <div class="ev-title">${escapeHtml(ev.title)}</div>
          <div class="ev-meta">${fmt(draftStart || new Date(ev.start))} - ${fmt(draftEnd || new Date(ev.end))}</div>
        </div>
        <div class="resize-handle-top" data-action="resize-top" data-ev-id="${ev.id}"></div>
        <div class="resize-handle" data-action="resize-bottom" data-ev-id="${ev.id}"></div>
      </div>
    `;
  }

  _render() {
    if (!this.isConnected || !this._ti || !this.$?.root) return;

    const weekStart = this._weekStartOf(this.currentDate);
    const days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(weekStart);
      d.setDate(weekStart.getDate() + i);
      return d;
    });

    const weekRows = packWeekSpans(weekStart, this.events || []);
    const weekKey = weekStart.toDateString();
    const expanded = this._expandedWeeks.has(weekKey);
    const maxRows = 2;

    const shownRows = expanded ? weekRows : weekRows.slice(0, maxRows);
    const hiddenRows = expanded ? [] : weekRows.slice(maxRows);

    const hiddenCount = Array(7).fill(0);
    hiddenRows.forEach((row) => row.forEach((span) => {
      for (let i = Math.max(0, span.startIdx); i <= Math.min(6, span.endIdx); i++) {
        hiddenCount[i] += 1;
      }
    }));

    const pxPerMinute = ppm();

    const dayColumns = days.map((day) => {
      const dayIso = toISODate(day);
      const timedEvents = (this.events || []).filter((ev) => {
        return new Date(ev.start).toDateString() === day.toDateString() && !isAllDay(ev);
      });

      const placed = layoutDay(timedEvents);
      const blocked = this._blockedFor(dayIso, this.selfPersonId);
      const isToday = new Date().toDateString() === day.toDateString();
      const dow = day.getDay();
      const isWeekend = dow === 0 || dow === 6;

      return `
        <div class="wcol drop-zone ${isWeekend ? 'weekend' : ''}" data-day="${dayIso}">
          ${this._renderBlocked(blocked, pxPerMinute)}
          ${isToday ? `<div class="now" style="top:${this.currentTime * pxPerMinute}px"></div>` : ''}
          ${placed.map((item) => this._renderEventBlock(item, pxPerMinute)).join('')}
          <div class="ind" data-indicator-day="${dayIso}"></div>
        </div>
      `;
    }).join('');

    this.$.root.innerHTML = `
      <div class="header">
        <div class="h-time">Время</div>
        ${days.map((day) => `
          <div class="hcell ${new Date().toDateString() === day.toDateString() ? 'today' : ''} ${(day.getDay() === 0 || day.getDay() === 6) ? 'weekend' : ''}">
            <div class="hlabel">${ruWeekdayFull(day)}</div>
            <div class="hnum">${pad(day.getDate())}</div>
          </div>
        `).join('')}
      </div>

      <div class="allday">
        <div class="allday-scale">На весь день</div>
        <div class="allday-grid">
          ${shownRows.map((row) => `
            <div class="allday-row">
              ${row.map((span) => {
                const s = Math.max(0, span.startIdx);
                const e = Math.min(6, span.endIdx);
                return `
                    <div class="allday-span all-day-drag ${isPast(span) ? 'past' : ''}"
                       type="${span.ev.type || 'default'}"
                       style="grid-column:${s + 1} / ${e + 2}"
                       draggable="true"
                       data-ev-id="${span.ev.id}"
                       data-days="${span.endIdx - span.startIdx + 1}">
                    ${escapeHtml(span.ev.title)}
                  </div>
                `;
              }).join('')}
            </div>
          `).join('')}

          <div class="allday-row">
            ${[0, 1, 2, 3, 4, 5, 6].map((i) => `
              <div class="allday-more" style="grid-column:${i + 1} / ${i + 2}">
                ${hiddenCount[i] > 0
                  ? `<span class="badge" data-action="toggle-week-expand" data-week="${toISODate(weekStart)}">+${hiddenCount[i]}</span>`
                  : ''}
              </div>
            `).join('')}
          </div>
        </div>
      </div>

      <div class="week">
        <div class="timecol">${this._renderTimeScale()}</div>
        ${dayColumns}
      </div>
    `;
    this._updateDropIndicator();
  }

  _updateDropIndicator() {
    if (!this.$?.root) return;
    const indicators = this.$.root.querySelectorAll('[data-indicator-day]');
    if (!indicators.length) return;

    indicators.forEach((indicator) => {
      const dayIso = indicator.dataset.indicatorDay;
      const dayKey = new Date(`${dayIso}T00:00:00`).toDateString();
      if (this._dropIndicator && this._dropIndicator.dayKey === dayKey) {
        indicator.style.display = 'block';
        indicator.style.top = `${this._dropIndicator.top * ppm()}px`;
      } else {
        indicator.style.display = 'none';
      }
    });
  }

  _applyEvents(newEvents) {
    this.events = newEvents;
    this._emit('calendarEventsChange', { events: newEvents });
  }

  _eventPersonId(ev) {
    if (ev?.personId) return String(ev.personId);
    return String(this.selfPersonId || 'self');
  }

  _isBlockedRange(dayIso, personId, startMin, endMin) {
    if (endMin <= startMin) return true;
    const blocked = getBlockedIntervals(this.blockedSlots || [], dayIso, personId || this.selfPersonId || 'self');
    return intersectsBlocked(blocked, startMin, endMin);
  }

  _blockedFor(dayIso, personId) {
    return getBlockedIntervals(this.blockedSlots || [], dayIso, personId || this.selfPersonId || 'self');
  }

  _renderBlocked(blocked, pxPerMinute) {
    return (blocked || []).map((slot) => {
      const top = Math.round(slot.startMin * pxPerMinute);
      const height = Math.max(2, Math.round((slot.endMin - slot.startMin) * pxPerMinute));
      const kind = slot.kind === 'unavailable' ? 'unavailable' : 'break';
      return `
        <div class="blocked ${kind}" style="top:${top}px;height:${height}px">
          <span>${escapeHtml(slot.title)}</span>
        </div>
      `;
    }).join('');
  }

  _getDragData(e) {
    try {
      return JSON.parse(e.dataTransfer?.getData('text/plain') || '{}');
    } catch {
      return null;
    }
  }

  _onClick(e) {
    const toggle = e.target.closest('[data-action="toggle-week-expand"]');
    if (toggle) {
      const key = new Date(toggle.dataset.week).toDateString();
      if (this._expandedWeeks.has(key)) this._expandedWeeks.delete(key);
      else this._expandedWeeks.add(key);
      this._render();
      return;
    }

    const timedEvent = e.target.closest('.ev');
    if (timedEvent && !this._dragging && !this._resizing && !this._resizingTop) {
      this._emit('calendarEdit', { id: timedEvent.dataset.evId });
      return;
    }

    const allDayEvent = e.target.closest('.all-day-drag');
    if (allDayEvent && !this._dragging) {
      this._emit('calendarEdit', { id: allDayEvent.dataset.evId });
    }
  }

  _onDblClick(e) {
    const zone = e.target.closest('.drop-zone');
    if (!zone) return;

    const rect = zone.getBoundingClientRect();
    const y = e.clientY - rect.top;
    const minuteHint = snap15(y / ppm());
    const dayIso = zone.dataset.day;
    const personId = String(this.selfPersonId || 'self');

    if (this._isBlockedRange(dayIso, personId, minuteHint, minuteHint + 60)) {
      this._emit('calendarBlocked', {
        dayIso,
        personId,
        startMin: minuteHint,
        endMin: minuteHint + 60,
        reason: 'blocked-slot'
      });
      return;
    }

    this._emit('calendarCreate', { dayIso, minuteHint, personId });
  }

  _onMouseDown(e) {
    const topHandle = e.target.closest('[data-action="resize-top"]');
    if (topHandle) {
      const ev = (this.events || []).find((x) => x.id === topHandle.dataset.evId);
      if (ev) this._onResizeStartTop(e, ev);
      return;
    }

    const bottomHandle = e.target.closest('[data-action="resize-bottom"]');
    if (bottomHandle) {
      const ev = (this.events || []).find((x) => x.id === bottomHandle.dataset.evId);
      if (ev) this._onResizeStartBottom(e, ev);
    }
  }

  _onDragStart(e) {
    const allDayEl = e.target.closest('.all-day-drag');
    if (allDayEl) {
      const payload = {
        id: allDayEl.dataset.evId,
        __kind: 'allday',
        days: parseInt(allDayEl.dataset.days || '1', 10)
      };

      e.dataTransfer.setData('text/plain', JSON.stringify(payload));
      e.dataTransfer.effectAllowed = 'move';
      this._dragging = true;
      return;
    }

    const eventEl = e.target.closest('.ev');
    if (!eventEl) return;

    const ev = (this.events || []).find((x) => x.id === eventEl.dataset.evId);
    if (!ev) return;

    e.dataTransfer.setData('text/plain', JSON.stringify(ev));
    e.dataTransfer.effectAllowed = 'move';
    this._dragging = true;
  }

  _onDragEnd() {
    this._dragging = false;
    this._dropIndicator = null;
    this._updateDropIndicator();
  }

  _onDragOver(e) {
    const zone = e.target.closest('.drop-zone');
    if (!zone) return;

    e.preventDefault();

    const rect = zone.getBoundingClientRect();
    const y = e.clientY - rect.top;
    const minuteTop = snap15(y / ppm());
    const dayIso = zone.dataset.day;

    this._autoScrollByPointer(e.clientY);

    const payload = this._getDragData(e);
    if (payload && payload.__kind !== 'allday') {
      const range = minutesRangeByEvent(payload);
      const durationMin = Math.max(15, range.endMin - range.startMin);
      const personId = this._eventPersonId(payload);
      const blocked = this._isBlockedRange(dayIso, personId, minuteTop, minuteTop + durationMin);
      if (blocked) {
        this._dropIndicator = null;
        this._updateDropIndicator();
        if (e.dataTransfer) e.dataTransfer.dropEffect = 'none';
        return;
      }
    }

    this._dropIndicator = {
      top: minuteTop,
      dayKey: new Date(`${zone.dataset.day}T00:00:00`).toDateString()
    };
    this._updateDropIndicator();
  }

  _onDragLeave(e) {
    const zone = e.target.closest('.drop-zone');
    if (!zone) return;

    const within = zone.contains(e.relatedTarget);
    if (!within) {
      this._dropIndicator = null;
      this._updateDropIndicator();
    }
  }

  _onDrop(e) {
    const zone = e.target.closest('.drop-zone');
    if (!zone) return;

    e.preventDefault();

    try {
      const data = JSON.parse(e.dataTransfer.getData('text/plain'));
      if (data.__kind === 'allday') return;

      const day = new Date(zone.dataset.day);
      const minutes = this._dropIndicator?.top ?? 0;
      const dayIso = toISODate(day);
      const personId = this._eventPersonId(data);
      const range = minutesRangeByEvent(data);
      const durationMin = Math.max(15, range.endMin - range.startMin);

      if (this._isBlockedRange(dayIso, personId, minutes, minutes + durationMin)) {
        this._emit('calendarBlocked', {
          dayIso,
          personId,
          startMin: minutes,
          endMin: minutes + durationMin,
          reason: 'blocked-slot'
        });
        return;
      }

      const h = Math.floor(minutes / 60);
      const m = minutes % 60;

      const updated = moveTimedEventByMinutes(this.events || [], {
        id: data.id,
        dayIso,
        minutes: h * 60 + m,
        personId
      });

      this._applyEvents(updated);
    } catch (error) {
      console.error(error);
    } finally {
      this._dragging = false;
      this._dropIndicator = null;
      this._updateDropIndicator();
    }
  }

  _onResizeStartTop(e, ev) {
    e.preventDefault();

    this._removeResizeListeners();

    this._resizingTop = {
      id: ev.id,
      start: new Date(ev.start),
      end: new Date(ev.end),
      startClientY: e.clientY
    };

    this._resizeDraftTop = { id: ev.id, start: new Date(ev.start).toISOString() };

    const onMove = (moveEvent) => {
      this._autoScrollByPointer(moveEvent.clientY);

      const dy = moveEvent.clientY - this._resizingTop.startClientY;
      const minutesDelta = dy / ppm();

      const startMinOrig = this._resizingTop.start.getHours() * 60 + this._resizingTop.start.getMinutes();
      const endMin = this._resizingTop.end.getHours() * 60 + this._resizingTop.end.getMinutes();

      const raw = startMinOrig + minutesDelta;
      const snapped = Math.min(endMin - 15, snap15(raw));

      const h = Math.floor(snapped / 60);
      const m = snapped % 60;

      const newStart = new Date(this._resizingTop.start);
      newStart.setHours(h, m, 0, 0);

      this._resizeDraftTop = { id: ev.id, start: newStart.toISOString() };
      this._render();
    };

    const onUp = () => {
      if (this._resizeDraftTop) {
        const startIso = this._resizeDraftTop.start;
        const start = new Date(startIso);
        const end = new Date(ev.end);
        const dayIso = toISODate(start);
        const personId = this._eventPersonId(ev);
        const startMin = start.getHours() * 60 + start.getMinutes();
        const endMin = end.getHours() * 60 + end.getMinutes();

        if (!this._isBlockedRange(dayIso, personId, startMin, endMin)) {
          const updated = applyResizeStart(this.events || [], { id: ev.id, startIso });
          this._applyEvents(updated);
        } else {
          this._emit('calendarBlocked', {
            dayIso,
            personId,
            startMin,
            endMin,
            reason: 'blocked-slot'
          });
        }
      }

      this._resizingTop = null;
      this._resizeDraftTop = null;
      this._removeResizeListeners();
      this._render();
    };

    this._activeResizeListeners = { onMove, onUp };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  }

  _onResizeStartBottom(e, ev) {
    e.preventDefault();

    this._removeResizeListeners();

    this._resizing = {
      id: ev.id,
      start: new Date(ev.start),
      end: new Date(ev.end),
      startClientY: e.clientY
    };

    this._resizeDraft = { id: ev.id, end: new Date(ev.end).toISOString() };

    const onMove = (moveEvent) => {
      this._autoScrollByPointer(moveEvent.clientY);

      const dy = moveEvent.clientY - this._resizing.startClientY;
      const minutesDelta = dy / ppm();

      const startMin = this._resizing.start.getHours() * 60 + this._resizing.start.getMinutes();
      const endMinOrig = this._resizing.end.getHours() * 60 + this._resizing.end.getMinutes();

      const raw = endMinOrig + minutesDelta;
      const snapped = Math.max(startMin + 15, snap15(raw));

      const h = Math.floor(snapped / 60);
      const m = snapped % 60;

      const newEnd = new Date(this._resizing.start);
      newEnd.setHours(h, m, 0, 0);

      this._resizeDraft = { id: ev.id, end: newEnd.toISOString() };
      this._render();
    };

    const onUp = () => {
      if (this._resizeDraft) {
        const endIso = this._resizeDraft.end;
        const start = new Date(ev.start);
        const end = new Date(endIso);
        const dayIso = toISODate(start);
        const personId = this._eventPersonId(ev);
        const startMin = start.getHours() * 60 + start.getMinutes();
        const endMin = end.getHours() * 60 + end.getMinutes();

        if (!this._isBlockedRange(dayIso, personId, startMin, endMin)) {
          const updated = applyResizeEnd(this.events || [], { id: ev.id, endIso });
          this._applyEvents(updated);
        } else {
          this._emit('calendarBlocked', {
            dayIso,
            personId,
            startMin,
            endMin,
            reason: 'blocked-slot'
          });
        }
      }

      this._resizing = null;
      this._resizeDraft = null;
      this._removeResizeListeners();
      this._render();
    };

    this._activeResizeListeners = { onMove, onUp };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  }
}

if (!customElements.get('pl-pro-calendar-week-view')) {
  customElements.define('pl-pro-calendar-week-view', PlProCalendarWeekView);
}

export default PlProCalendarWeekView;
