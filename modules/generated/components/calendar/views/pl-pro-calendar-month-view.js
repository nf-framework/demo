import { PlElement, html, css } from 'polylib';
import { escapeHtml, fmt, sameDate, toISODate } from '/generated/components/calendar/helpers/date-time.js';
import { isAllDay, isPast, isoWeek, packWeekSpans } from '/generated/components/calendar/helpers/layout.js';

const DAY_NAMES = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

class PlProCalendarMonthView extends PlElement {
  static properties = {
    currentDate: { type: Object, value: () => new Date(), observer: '_stateChanged' },
    events: { type: Array, value: () => [], observer: '_stateChanged' }
  };

  static css = css`
    :host {
      display: block;
      color: var(--text, var(--pl-text-color, #1f2937));
      background: var(--surface, var(--pl-surface-color, #fff));
      width: 100%;
      max-width: 100%;
      min-width: 0;
      height: 100%;
      min-height: 100%;
      --cal-bg-soft: var(--pl-grey-lightest, #f5f6f7);
      --cal-bg-softer: var(--pl-background-color, #fff);
      --cal-border: var(--pl-grey-light, #e9edf0);
      --cal-border-strong: var(--pl-grey-base, #cad0d6);
      --cal-muted: var(--muted, var(--pl-grey-darkest, #85919c));
      --cal-text: var(--text, var(--pl-text-color, #2a3143));
      --cal-accent: var(--accent, var(--pl-primary-base, #3A817D));
    }

    .month-head {
      display: grid;
      grid-template-columns: 64px repeat(7, minmax(120px, 1fr));
      gap: 8px;
      padding: 10px;
      background: var(--cal-bg-soft);
      border-bottom: 1px solid var(--cal-border);
      position: sticky;
      top: 0;
      z-index: 12;
      min-width: 1020px;
    }

    .wnum, .wnum-head {
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      color: var(--cal-muted);
      background: var(--cal-bg-soft);
      border: 1px solid var(--cal-border);
      border-radius: 10px;
      min-height: 40px;
    }

    .wnum-head {
      background: transparent;
      border: none;
      color: var(--cal-muted);
      font-weight: 600;
    }

    .mweek {
      position: relative;
    }

    .mw {
      display: grid;
      grid-template-columns: 64px repeat(7, minmax(120px, 1fr));
      gap: 8px;
      padding: 10px;
      min-width: 1020px;
    }

    .mcell {
      border: 1px solid var(--cal-border);
      border-radius: 12px;
      min-height: 132px;
      background: var(--cal-bg-softer);
      display: flex;
      flex-direction: column;
      overflow: hidden;
      cursor: pointer;
      user-select: none;
    }

    .mhead {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 6px 8px;
      border-bottom: 1px solid var(--cal-border);
      background: var(--cal-bg-soft);
      font-size: 12px;
    }

    .mday {
      font-weight: 700;
      color: var(--cal-text);
    }

    .mday.today {
      color: var(--pl-background-color, #fff);
      background: var(--cal-accent);
      border-radius: 999px;
      padding: 2px 8px;
    }

    .mlist {
      padding: 6px 8px;
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .mitem {
      --ev-color: var(--type-default, var(--pl-primary-base, #3A817D));
      --ev-bg: var(--pl-primary-lightest, #EAF4EF);
      background: var(--ev-bg);
      color: var(--cal-text);
      border-radius: 8px;
      padding: 4px 6px;
      border: 1px solid var(--cal-border-strong);
      border-inline-start: 4px solid var(--ev-color);
      font-size: 12px;
      font-weight: 600;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      cursor: move;
    }

    .mitem.past {
      opacity: .6;
      text-decoration: line-through;
    }

    .mitem[type="default"] { --ev-color: var(--type-default, var(--pl-primary-base, #3A817D)); --ev-bg: var(--pl-primary-lightest, #EAF4EF); }
    .mitem[type="tech"] { --ev-color: var(--type-tech, var(--pl-primary-dark, #1C635F)); --ev-bg: color-mix(in srgb, var(--pl-primary-light, #BBD8CB), white 55%); }
    .mitem[type="screen"] { --ev-color: var(--type-screen, var(--pl-grey-darkest, #85919C)); --ev-bg: var(--pl-grey-lightest, #F5F6F7); }
    .mitem[type="manager"] { --ev-color: var(--type-manager, var(--pl-attention, #F2D26E)); --ev-bg: color-mix(in srgb, var(--pl-attention, #F2D26E), white 76%); }
    .mitem[type="offer"] { --ev-color: var(--type-offer, var(--pl-negative-base, #F54A4B)); --ev-bg: var(--pl-negative-lightest, #FFECED); }

    .mdim {
      background: color-mix(in srgb, var(--cal-bg-soft), var(--cal-bg-softer) 35%);
      color: var(--cal-muted);
      filter: saturate(.75);
    }

    .mspans {
      position: absolute;
      left: 74px;
      right: 10px;
      top: 38px;
      display: grid;
      grid-template-columns: repeat(7, 1fr);
      pointer-events: none;
      gap: 4px;
    }

    .mspan {
      --ev-color: var(--type-default, var(--pl-primary-base, #3A817D));
      --ev-bg: var(--pl-primary-lightest, #EAF4EF);
      color: var(--cal-text);
      background: var(--ev-bg);
      border-radius: 8px;
      padding: 4px 6px;
      border: 1px solid var(--cal-border-strong);
      border-inline-start: 4px solid var(--ev-color);
      font-size: 12px;
      font-weight: 600;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      box-shadow: 0 2px 6px rgba(15, 23, 42, .08);
      pointer-events: auto;
      cursor: move;
    }

    .mspan.past { opacity: .5; }
    .mspan[type="default"] { --ev-color: var(--type-default, var(--pl-primary-base, #3A817D)); --ev-bg: var(--pl-primary-lightest, #EAF4EF); }
    .mspan[type="tech"] { --ev-color: var(--type-tech, var(--pl-primary-dark, #1C635F)); --ev-bg: color-mix(in srgb, var(--pl-primary-light, #BBD8CB), white 55%); }
    .mspan[type="screen"] { --ev-color: var(--type-screen, var(--pl-grey-darkest, #85919C)); --ev-bg: var(--pl-grey-lightest, #F5F6F7); }
    .mspan[type="manager"] { --ev-color: var(--type-manager, var(--pl-attention, #F2D26E)); --ev-bg: color-mix(in srgb, var(--pl-attention, #F2D26E), white 76%); }
    .mspan[type="offer"] { --ev-color: var(--type-offer, var(--pl-negative-base, #F54A4B)); --ev-bg: var(--pl-negative-lightest, #FFECED); }

    .mmore {
      font-size: 11px;
      font-weight: 600;
      color: var(--cal-muted);
      padding: 0 2px;
    }
  `;

  static template = html`<div id="root"></div>`;

  constructor() {
    super();
    this._handlers = {};
  }

  connectedCallback() {
    super.connectedCallback();
    this._bindDelegates();
    this._render();
  }

  disconnectedCallback() {
    this._unbindDelegates();
    super.disconnectedCallback();
  }

  _stateChanged() {
    this._render();
  }

  _bindDelegates() {
    if (!this.$?.root) return;

    this._handlers.click = this._onClick.bind(this);
    this._handlers.dblclick = this._onDblClick.bind(this);
    this._handlers.dragstart = this._onDragStart.bind(this);
    this._handlers.dragover = this._onDragOver.bind(this);
    this._handlers.drop = this._onDrop.bind(this);

    this.$.root.addEventListener('click', this._handlers.click);
    this.$.root.addEventListener('dblclick', this._handlers.dblclick);
    this.$.root.addEventListener('dragstart', this._handlers.dragstart);
    this.$.root.addEventListener('dragover', this._handlers.dragover);
    this.$.root.addEventListener('drop', this._handlers.drop);
  }

  _unbindDelegates() {
    if (!this.$?.root) return;

    this.$.root.removeEventListener('click', this._handlers.click);
    this.$.root.removeEventListener('dblclick', this._handlers.dblclick);
    this.$.root.removeEventListener('dragstart', this._handlers.dragstart);
    this.$.root.removeEventListener('dragover', this._handlers.dragover);
    this.$.root.removeEventListener('drop', this._handlers.drop);
  }

  _emit(name, detail) {
    this.dispatchEvent(new CustomEvent(name, {
      detail,
      bubbles: true,
      composed: true
    }));
  }

  _render() {
    if (!this.isConnected || !this._ti || !this.$?.root) return;

    const current = new Date(this.currentDate || new Date());
    const first = new Date(current.getFullYear(), current.getMonth(), 1);

    const startDow = (first.getDay() + 6) % 7;
    const startDate = new Date(first);
    startDate.setDate(first.getDate() - startDow);

    const head = `
      <div class="month-head">
        <div class="wnum-head">ISO</div>
        ${DAY_NAMES.map((n) => `<div style="text-align:center;color:var(--muted, var(--pl-grey-darkest, #85919c));font-weight:600">${n}</div>`).join('')}
      </div>
    `;

    const weeks = Array.from({ length: 6 }, (_, weekIndex) => {
      const weekStart = new Date(startDate);
      weekStart.setDate(startDate.getDate() + weekIndex * 7);

      const days = Array.from({ length: 7 }, (_, i) => {
        const d = new Date(weekStart);
        d.setDate(weekStart.getDate() + i);
        return d;
      });

      const spansRows = packWeekSpans(weekStart, this.events || []);

      return `
        <div class="mweek">
          <div class="mw">
            <div class="wnum">${isoWeek(weekStart)}</div>

            ${days.map((day) => {
              const inMonth = day.getMonth() === current.getMonth();

              const dayTimedEvents = (this.events || []).filter((ev) => {
                return sameDate(new Date(ev.start), day) && !isAllDay(ev);
              });

              const extra = Math.max(0, dayTimedEvents.length - 2);

              return `
                <div class="mcell month-drop-zone ${inMonth ? '' : 'mdim'}" data-day="${toISODate(day)}">
                  <div class="mhead">
                    <div class="mday ${sameDate(day, new Date()) ? 'today' : ''}">${day.getDate()}</div>
                    <div style="color:var(--muted, var(--pl-grey-darkest, #85919c));font-size:12px">${DAY_NAMES[(day.getDay() + 6) % 7]}</div>
                  </div>

                  <div class="mlist">
                    ${dayTimedEvents.slice(0, 2).map((ev) => `
                      <div class="mitem timed-drag ${isPast(ev) ? 'past' : ''}"
                           type="${ev.type || 'default'}"
                           draggable="true"
                           data-ev-id="${ev.id}">
                        ${fmt(new Date(ev.start))} ${escapeHtml(ev.title)}
                      </div>
                    `).join('')}

                    ${extra > 0 ? `<div class="mmore">+ ещё ${extra}</div>` : ''}
                  </div>
                </div>
              `;
            }).join('')}
          </div>

          <div class="mspans">
            ${spansRows.map((row) => `
              <div style="display:contents">
                ${row.map((span) => {
                  const s = Math.max(0, span.startIdx);
                  const e = Math.min(6, span.endIdx);

                  return `
                    <div class="mspan all-day-drag ${isPast(span) ? 'past' : ''}"
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
          </div>
        </div>
      `;
    }).join('');

    this.$.root.innerHTML = `${head}${weeks}`;
  }

  _onClick(e) {
    const cell = e.target.closest('.mcell');
    if (!cell) return;

    this._emit('calendarNavigate', {
      view: 'day',
      dateIso: cell.dataset.day
    });
  }

  _onDblClick(e) {
    const cell = e.target.closest('.mcell');
    if (!cell) return;

    e.stopPropagation();
    this._emit('calendarCreate', {
      dayIso: cell.dataset.day,
      minuteHint: 540
    });
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
      return;
    }

    const timedEl = e.target.closest('.timed-drag');
    if (!timedEl) return;

    const ev = (this.events || []).find((x) => x.id === timedEl.dataset.evId);
    if (!ev) return;

    e.dataTransfer.setData('text/plain', JSON.stringify(ev));
    e.dataTransfer.effectAllowed = 'move';
  }

  _onDragOver(e) {
    const zone = e.target.closest('.month-drop-zone');
    if (!zone) return;

    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  }

  _onDrop(e) {
    const zone = e.target.closest('.month-drop-zone');
    if (!zone) return;

    e.preventDefault();

    try {
      const data = JSON.parse(e.dataTransfer.getData('text/plain'));
      const dayIso = zone.dataset.day;

      if (data.__kind === 'allday') {
        this._emit('calendarMonthDropAllDay', {
          id: data.id,
          dayIso,
          days: data.days || 1
        });
      } else {
        this._emit('calendarMonthDropTime', {
          id: data.id,
          dayIso,
          start: data.start,
          end: data.end
        });
      }
    } catch (error) {
      console.error(error);
    }
  }
}

if (!customElements.get('pl-pro-calendar-month-view')) {
  customElements.define('pl-pro-calendar-month-view', PlProCalendarMonthView);
}

export default PlProCalendarMonthView;
