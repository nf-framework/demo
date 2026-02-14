import { PlElement, html, css } from 'polylib';
import { escapeHtml, fmt, ppm, ruWeekdayFull, snap15, toISODate } from '/generated/components/calendar/helpers/date-time.js';
import { isAllDay, isPast, layoutDay } from '/generated/components/calendar/helpers/layout.js';
import {
  applyResizeEnd,
  applyResizeStart,
  getBlockedIntervals,
  intersectsBlocked,
  minutesRangeByEvent,
  moveTimedEventByMinutes
} from '/generated/components/calendar/helpers/operations.js';

class PlProCalendarDayView extends PlElement {
  static properties = {
    currentDate: { type: Object, value: () => new Date(), observer: '_stateChanged' },
    events: { type: Array, value: () => [], observer: '_stateChanged' },
    currentTime: { type: Number, value: 0, observer: '_stateChanged' },
    people: { type: Array, value: () => [], observer: '_stateChanged' },
    calendarMode: { type: String, value: 'self', observer: '_stateChanged' },
    selfPersonId: { type: String, value: 'self', observer: '_stateChanged' },
    blockedSlots: { type: Array, value: () => [], observer: '_stateChanged' }
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
      --day-head-h: 62px;
      --day-allday-h: 58px;
      --day-person-h: 56px;
      --day-time-col-w: 88px;
      --day-sticky-offset: calc(var(--day-head-h) + var(--day-allday-h));
      --cal-bg-soft: var(--pl-grey-lightest, #f5f6f7);
      --cal-bg-softer: var(--pl-background-color, #fff);
      --cal-border: var(--pl-grey-light, #e9edf0);
      --cal-border-strong: var(--pl-grey-base, #cad0d6);
      --cal-divider: color-mix(in srgb, var(--cal-border-strong), var(--cal-text) 10%);
      --cal-divider-strong: color-mix(in srgb, var(--cal-text), white 72%);
      --cal-muted: var(--muted, var(--pl-grey-darkest, #85919c));
      --cal-text: var(--text, var(--pl-text-color, #2a3143));
      --cal-accent: var(--accent, var(--pl-primary-base, #3A817D));
      --cal-negative: var(--pl-negative-base, #F54A4B);
      --cal-attention: var(--pl-attention, #F2D26E);
    }

    .day-head {
      display: grid;
      grid-template-columns: var(--day-time-col-w) 1fr;
      width: 100%;
      min-width: 760px;
      background: var(--cal-bg-soft);
      border-bottom: 1px solid var(--cal-border);
      position: sticky;
      top: 0;
      z-index: 40;
      height: var(--day-head-h);
    }

    .day-head-time {
      display: flex;
      align-items: center;
      justify-content: center;
      border-right: 1px solid var(--cal-divider-strong);
      color: var(--cal-muted);
      font-size: 24px;
      font-weight: 700;
      letter-spacing: -.01em;
      position: sticky;
      left: 0;
      z-index: 41;
      background: var(--cal-bg-soft);
    }

    .day-head-title {
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 15px;
      font-weight: 700;
      color: var(--cal-text);
      box-sizing: border-box;
      padding: 0 16px;
    }

    .day-head-title.today {
      color: var(--cal-accent);
    }

    .allday {
      display: grid;
      grid-template-columns: var(--day-time-col-w) 1fr;
      width: 100%;
      min-width: 760px;
      border-bottom: 1px solid var(--cal-border);
      background: var(--cal-bg-soft);
      position: sticky;
      top: var(--day-head-h);
      z-index: 38;
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
      position: sticky;
      left: 0;
      z-index: 39;
      background: var(--cal-bg-soft);
      text-align: center;
      line-height: 1.2;
      padding: 0 6px;
      box-sizing: border-box;
    }

    .allday-grid {
      display: grid;
      width: 100%;
      gap: 0;
      min-height: var(--day-allday-h);
      overflow: hidden;
      border-inline-start: 1px solid var(--cal-divider-strong);
    }

    .allday-col {
      min-width: 240px;
      padding: 8px;
      box-sizing: border-box;
      display: flex;
      flex-wrap: wrap;
      align-content: center;
      align-items: center;
      gap: 6px;
      background: #fff;
      position: relative;
    }

    .allday-col::after {
      content: '';
      position: absolute;
      top: 0;
      bottom: 0;
      right: 0;
      width: 1px;
      background: var(--cal-divider-strong);
      pointer-events: none;
      z-index: 2;
    }

    .allday-item {
      --ev-color: var(--type-default, var(--pl-primary-base, #3A817D));
      --ev-bg: var(--pl-primary-lightest, #EAF4EF);
      color: var(--cal-text);
      border-radius: 10px;
      padding: 5px 8px;
      font-size: 12px;
      font-weight: 600;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      box-shadow: 0 2px 6px rgba(15, 23, 42, .08);
      cursor: pointer;
      background: var(--ev-bg);
      border: 1px solid var(--cal-border-strong);
      border-inline-start: 4px solid var(--ev-color);
      max-width: 100%;
    }

    .allday-item.past {
      opacity: .6;
    }

    .allday-item[type="default"] { --ev-color: var(--type-default, var(--pl-primary-base, #3A817D)); --ev-bg: var(--pl-primary-lightest, #EAF4EF); }
    .allday-item[type="tech"] { --ev-color: var(--type-tech, var(--pl-primary-dark, #1C635F)); --ev-bg: color-mix(in srgb, var(--pl-primary-light, #BBD8CB), white 55%); }
    .allday-item[type="screen"] { --ev-color: var(--type-screen, var(--pl-grey-darkest, #85919C)); --ev-bg: var(--pl-grey-lightest, #F5F6F7); }
    .allday-item[type="manager"] { --ev-color: var(--type-manager, var(--pl-attention, #F2D26E)); --ev-bg: color-mix(in srgb, var(--pl-attention, #F2D26E), white 76%); }
    .allday-item[type="offer"] { --ev-color: var(--type-offer, var(--pl-negative-base, #F54A4B)); --ev-bg: var(--pl-negative-lightest, #FFECED); }

    .day {
      display: grid;
      grid-template-columns: var(--day-time-col-w) 1fr;
      width: 100%;
      min-width: 760px;
    }

    .timecol {
      position: sticky;
      left: 0;
      z-index: 14;
      width: var(--day-time-col-w);
      min-width: var(--day-time-col-w);
      max-width: var(--day-time-col-w);
      background: var(--cal-bg-soft);
      border-right: 1px solid var(--cal-divider-strong);
    }

    .timecol-head {
      height: var(--day-person-h);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      font-weight: 700;
      color: var(--cal-muted);
      border-bottom: 1px solid var(--cal-border);
      letter-spacing: .02em;
      box-sizing: border-box;
      position: sticky;
      top: var(--day-sticky-offset);
      left: 0;
      z-index: 15;
      background: var(--cal-bg-soft);
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
      background: var(--cal-bg-soft);
    }

    .day-columns {
      display: grid;
      width: 100%;
      gap: 0;
      min-width: 0;
      border-inline-start: 1px solid var(--cal-divider-strong);
    }

    .col-wrap {
      min-width: 240px;
      background: #fff;
      position: relative;
    }

    .col-wrap::after {
      content: '';
      position: absolute;
      top: 0;
      bottom: 0;
      right: 0;
      width: 1px;
      background: var(--cal-divider-strong);
      pointer-events: none;
      z-index: 11;
    }

    .person-head {
      height: var(--day-person-h);
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 0 10px;
      border-bottom: 1px solid var(--cal-border);
      border-inline-end: 1px solid var(--cal-divider-strong);
      background: #fff;
      box-sizing: border-box;
      position: sticky;
      top: var(--day-sticky-offset);
      z-index: 12;
    }

    .person-avatar {
      width: 30px;
      height: 30px;
      border-radius: 50%;
      background: var(--pl-primary-lightest, #EAF4EF);
      color: var(--pl-primary-dark, #1C635F);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      font-weight: 700;
      flex: 0 0 auto;
    }

    .person-meta {
      min-width: 0;
    }

    .person-name {
      font-size: 14px;
      font-weight: 700;
      color: var(--cal-text);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .person-sub {
      font-size: 12px;
      color: var(--cal-muted);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .day-grid {
      position: relative;
      height: calc(24 * var(--hour-height, 84px));
      background-color: #fff;
      border-inline-end: 1px solid var(--cal-divider-strong);
      overflow: hidden;
    }

    .day-grid::before {
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

    .drop-zone {
      user-select: none;
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
      font-size: 12px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: .02em;
      text-align: center;
      padding: 0 6px;
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
      z-index: 7;
    }

    .ind {
      position: absolute;
      left: 6px;
      right: 6px;
      height: 3px;
      border-radius: 2px;
      background: var(--cal-accent);
      pointer-events: none;
      z-index: 8;
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
      z-index: 6;
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
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
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

    .allday-empty {
      color: var(--cal-muted);
      font-size: 12px;
      font-weight: 600;
      width: 100%;
      min-height: calc(var(--day-allday-h) - 16px);
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
    }
  `;

  static template = html`<div id="root"></div>`;

  constructor() {
    super();

    this._dropIndicator = null;
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
        if (/auto|scroll/.test(st.overflowY) || /auto|scroll/.test(st.overflowX)) {
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
    const top = Math.max(0, (this.currentTime || 0) * ppm() - 160);
    this._scrollEl.scrollTop = top;
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

  _timezoneLabel() {
    return 'GMT +03:00';
  }

  _personInitials(name) {
    const parts = String(name || '').trim().split(/\s+/).filter(Boolean);
    if (!parts.length) return 'Я';
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return `${parts[0][0] || ''}${parts[1][0] || ''}`.toUpperCase();
  }

  _normalizedPeople() {
    const source = Array.isArray(this.people) ? this.people : [];
    const seen = new Set();
    const mapped = source
      .filter(Boolean)
      .map((person, idx) => {
        const id = String(person.id || person.code || person.login || `person-${idx + 1}`);
        return {
          id,
          name: String(person.name || person.title || `Сотрудник ${idx + 1}`),
          subtitle: String(person.subtitle || ''),
          avatar: String(person.avatar || '').trim()
        };
      })
      .filter((person) => {
        if (seen.has(person.id)) return false;
        seen.add(person.id);
        return true;
      });

    const fallbackId = String(this.selfPersonId || mapped[0]?.id || 'self');

    if (String(this.calendarMode) !== 'team') {
      const self = mapped.find((person) => person.id === fallbackId);
      return [self || {
        id: fallbackId,
        name: 'Я',
        subtitle: 'Личный календарь',
        avatar: ''
      }];
    }

    if (!mapped.length) {
      return [{
        id: fallbackId,
        name: 'Я',
        subtitle: 'Личный календарь',
        avatar: ''
      }];
    }

    return mapped;
  }

  _defaultPersonId(people) {
    return String(people?.[0]?.id || this.selfPersonId || 'self');
  }

  _matchesPerson(event, personId, defaultPersonId) {
    const assigned = event?.personId ? String(event.personId) : null;
    if (assigned === 'team' || assigned === 'all') return true;
    if (assigned) return assigned === String(personId);
    return String(personId) === String(defaultPersonId);
  }

  _blockedFor(dayIso, personId) {
    return getBlockedIntervals(this.blockedSlots || [], dayIso, personId);
  }

  _isBlockedRange(dayIso, personId, startMin, endMin) {
    if (endMin <= startMin) return true;
    const blocked = this._blockedFor(dayIso, personId);
    return intersectsBlocked(blocked, startMin, endMin);
  }

  _renderBlocked(blocked, pxPerMinute) {
    return blocked.map((slot) => {
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

    const dayStart = new Date(this.currentDate || new Date());
    dayStart.setHours(0, 0, 0, 0);
    const dayIso = toISODate(dayStart);

    const isToday = new Date().toDateString() === dayStart.toDateString();
    const pxPerMinute = ppm();

    const people = this._normalizedPeople();
    const defaultPersonId = this._defaultPersonId(people);
    const colsMinWidth = Math.max(240, people.length * 240);
    const gridMinWidth = 88 + colsMinWidth;
    const columnsStyle = `grid-template-columns: repeat(${people.length}, minmax(240px, 1fr)); min-width:${colsMinWidth}px;`;

    const timedEvents = (this.events || []).filter((ev) => {
      return new Date(ev.start).toDateString() === dayStart.toDateString() && !isAllDay(ev);
    });

    const nextDay = new Date(dayStart);
    nextDay.setDate(nextDay.getDate() + 1);
    const allDayEvents = (this.events || []).filter((ev) => {
      if (!isAllDay(ev)) return false;
      const start = new Date(ev.start);
      const end = new Date(ev.end);
      return start < nextDay && end > dayStart;
    });

    const dayTitle = `${ruWeekdayFull(dayStart)}, ${dayStart.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: 'long'
    })}`;

    this.$.root.innerHTML = `
      <div class="day-head" style="min-width:${gridMinWidth}px;">
        <div class="day-head-time">Время</div>
        <div class="day-head-title ${isToday ? 'today' : ''}">${escapeHtml(dayTitle)}</div>
      </div>

      <div class="allday" style="min-width:${gridMinWidth}px;">
        <div class="allday-scale">На весь день</div>
        <div class="allday-grid" style="${columnsStyle}">
          ${people.map((person) => {
            const list = allDayEvents.filter((ev) => this._matchesPerson(ev, person.id, defaultPersonId));
            return `
              <div class="allday-col" data-person="${person.id}">
                ${list.length ? list.map((ev) => `
                  <div class="allday-item ${isPast(ev) ? 'past' : ''}" type="${ev.type || 'default'}" data-ev-id="${ev.id}">
                    ${escapeHtml(ev.title)}
                  </div>
                `).join('') : '<span class="allday-empty">Нет событий</span>'}
              </div>
            `;
          }).join('')}
        </div>
      </div>

      <div class="day" style="min-width:${gridMinWidth}px;">
        <div class="timecol">
          <div class="timecol-head">${this._timezoneLabel()}</div>
          ${this._renderTimeScale()}
        </div>

        <div class="day-columns" style="${columnsStyle}">
          ${people.map((person) => {
            const personTimed = timedEvents.filter((ev) => this._matchesPerson(ev, person.id, defaultPersonId));
            const placed = layoutDay(personTimed);
            const blocked = this._blockedFor(dayIso, person.id);

            return `
              <div class="col-wrap">
                <div class="person-head">
                  <div class="person-avatar">${escapeHtml(person.avatar || this._personInitials(person.name))}</div>
                  <div class="person-meta">
                    <div class="person-name">${escapeHtml(person.name)}</div>
                    <div class="person-sub">Встреч: ${personTimed.length}${person.subtitle ? ` · ${escapeHtml(person.subtitle)}` : ''}</div>
                  </div>
                </div>

                <div class="day-grid drop-zone" data-day="${dayIso}" data-person="${person.id}">
                  ${this._renderBlocked(blocked, pxPerMinute)}
                  ${isToday ? `<div class="now" style="top:${this.currentTime * pxPerMinute}px"></div>` : ''}
                  ${placed.map((item) => this._renderEventBlock(item, pxPerMinute)).join('')}
                  <div class="ind" data-indicator-day="${dayIso}" data-indicator-person="${person.id}"></div>
                </div>
              </div>
            `;
          }).join('')}
        </div>
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
      const personId = String(indicator.dataset.indicatorPerson || '');

      if (this._dropIndicator
        && this._dropIndicator.dayIso === dayIso
        && String(this._dropIndicator.personId || '') === personId) {
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
    return this._defaultPersonId(this._normalizedPeople());
  }

  _onClick(e) {
    const allDayEventEl = e.target.closest('.allday-item');
    if (allDayEventEl) {
      this._emit('calendarEdit', { id: allDayEventEl.dataset.evId });
      return;
    }

    const eventEl = e.target.closest('.ev');
    if (!eventEl) return;
    if (this._dragging || this._resizing || this._resizingTop) return;

    this._emit('calendarEdit', { id: eventEl.dataset.evId });
  }

  _onDblClick(e) {
    const zone = e.target.closest('.drop-zone');
    if (!zone) return;

    const rect = zone.getBoundingClientRect();
    const y = e.clientY - rect.top;
    const minuteHint = snap15(y / ppm());
    const personId = zone.dataset.person;
    const dayIso = zone.dataset.day;

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
    const personId = String(zone.dataset.person || this.selfPersonId || 'self');

    this._autoScrollByPointer(e.clientY);

    try {
      const data = JSON.parse(e.dataTransfer?.getData('text/plain') || '{}');
      if (data && data.__kind !== 'allday' && data.id) {
        const range = minutesRangeByEvent(data);
        const durationMin = Math.max(15, range.endMin - range.startMin);
        if (this._isBlockedRange(dayIso, personId, minuteTop, minuteTop + durationMin)) {
          this._dropIndicator = null;
          this._updateDropIndicator();
          if (e.dataTransfer) e.dataTransfer.dropEffect = 'none';
          return;
        }
      }
    } catch {
      // ignore parse errors in drag payload
    }

    this._dropIndicator = {
      top: minuteTop,
      dayIso,
      personId
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
      const dayIso = toISODate(day);
      const minutes = this._dropIndicator?.top ?? 0;
      const personId = String(zone.dataset.person || '');

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

      const updated = moveTimedEventByMinutes(this.events || [], {
        id: data.id,
        dayIso,
        minutes,
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

        const startMin = start.getHours() * 60 + start.getMinutes();
        const endMin = end.getHours() * 60 + end.getMinutes();
        const dayIso = toISODate(start);
        const personId = this._eventPersonId(ev);

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

        const startMin = start.getHours() * 60 + start.getMinutes();
        const endMin = end.getHours() * 60 + end.getMinutes();
        const dayIso = toISODate(start);
        const personId = this._eventPersonId(ev);

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

if (!customElements.get('pl-pro-calendar-day-view')) {
  customElements.define('pl-pro-calendar-day-view', PlProCalendarDayView);
}

export default PlProCalendarDayView;
