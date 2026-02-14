import { PlElement, html, css } from 'polylib';
import '@plcmp/pl-button';
import '@plcmp/pl-input';
import '@plcmp/pl-flex-layout';
import '@plcmp/pl-datetime';
import '@plcmp/pl-combobox';
import '@plcmp/pl-checkbox';
import '/pl-time/components/pl-time.js';

import '/generated/components/calendar/views/pl-pro-calendar-day-view.js';
import '/generated/components/calendar/views/pl-pro-calendar-week-view.js';
import '/generated/components/calendar/views/pl-pro-calendar-month-view.js';

import { escapeHtml, fromISODate, hm, ruFullDate, toISODate } from '/generated/components/calendar/helpers/date-time.js';
import {
  buildEventFromForm,
  deleteEventById,
  getBlockedIntervals,
  intersectsBlocked,
  minutesRangeByEvent,
  moveAllDaySpan,
  moveTimedEventByClock,
  upsertEvent
} from '/generated/components/calendar/helpers/operations.js';

class PlProCalendar extends PlElement {
  static properties = {
    view: { type: String, value: 'month', observer: '_viewStateChanged' },
    currentDate: { type: Object, value: () => new Date(), observer: '_viewStateChanged' },
    events: { type: Array, value: () => [], observer: '_viewStateChanged' },
    currentTime: { type: Number, value: 0, observer: '_viewStateChanged' },
    people: { type: Array, value: () => [], observer: '_viewStateChanged' },
    calendarMode: { type: String, value: 'self', observer: '_viewStateChanged' },
    selfPersonId: { type: String, value: 'self', observer: '_viewStateChanged' },
    blockedSlots: { type: Array, value: () => [], observer: '_viewStateChanged' },
    modal: { type: Object, value: null, observer: '_overlayStateChanged' }
  };

  static css = css`
    :host {
      display: block;
      position: relative;
      color: var(--text, var(--pl-text-color, #2c3e50));
      background: var(--surface, var(--pl-surface-color, #fff));
      --cal-border: var(--pl-grey-light, #e9edf0);
      --cal-overlay: color-mix(in srgb, var(--pl-grey-darkest, #85919c), transparent 58%);
      width: 100%;
      max-width: 100%;
      height: 100%;
      min-height: 100%;
      min-width: 0;
      box-sizing: border-box;
    }

    #viewHost {
      height: 100%;
      min-height: 0;
      width: 100%;
      max-width: 100%;
      min-width: 0;
      overflow: auto;
      overscroll-behavior: contain;
    }

    .modal-backdrop {
      position: fixed;
      inset: 0;
      background: var(--cal-overlay);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 9999;
    }

    .modal {
      background: var(--pl-surface-color, #fff);
      border: 1px solid var(--cal-border);
      border-radius: 12px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, .25);
      width: 360px;
      max-width: calc(100vw - 24px);
      padding: 16px;
      color: var(--text, var(--pl-text-color, #2c3e50));
    }

    .modal h3 {
      margin: 0 0 8px 0;
      font-size: 16px;
    }

    .modal .actions {
      display: flex;
      align-items: center;
      gap: 8px;
      justify-content: flex-end;
      margin-top: 12px;
    }

    .modal [data-action="close-modal"] {
      margin-left: auto;
    }

    .modal pl-input,
    .modal pl-datetime,
    .modal pl-time,
    .modal pl-combobox,
    .modal pl-checkbox {
      width: 100%;
    }
  `;

  static template = html`
    <div id="viewHost"></div>
    <div id="overlayRoot"></div>
  `;

  constructor() {
    super();

    const now = new Date();
    this.currentTime = now.getHours() * 60 + now.getMinutes();

    this._activeViewTag = null;
    this._activeViewEl = null;

    this._bound = {
      onViewEdit: this._onViewEdit.bind(this),
      onViewCreate: this._onViewCreate.bind(this),
      onViewEventsChange: this._onViewEventsChange.bind(this),
      onViewNavigate: this._onViewNavigate.bind(this),
      onMonthDropTime: this._onMonthDropTime.bind(this),
      onMonthDropAllDay: this._onMonthDropAllDay.bind(this),
      onOverlayClick: this._onOverlayClick.bind(this),
      onOverlayInput: this._onOverlayInput.bind(this)
    };
  }

  connectedCallback() {
    super.connectedCallback();

    this._bindOverlayHandlers();
    this._mountView();
    this._renderOverlay();

    this._clock = setInterval(() => {
      const now = new Date();
      this.currentTime = now.getHours() * 60 + now.getMinutes();
    }, 60000);
  }

  disconnectedCallback() {
    clearInterval(this._clock);
    this._unbindOverlayHandlers();
    this._detachFromView(this._activeViewEl);
    super.disconnectedCallback();
  }

  _viewStateChanged() {
    this._mountView();
  }

  _overlayStateChanged() {
    this._renderOverlay();
  }

  _getViewTag() {
    if (this.view === 'day') return 'pl-pro-calendar-day-view';
    if (this.view === 'week') return 'pl-pro-calendar-week-view';
    return 'pl-pro-calendar-month-view';
  }

  _mountView() {
    if (!this.isConnected || !this._ti || !this.$?.viewHost) return;

    const tag = this._getViewTag();

    if (!this._activeViewEl || this._activeViewTag !== tag) {
      const next = document.createElement(tag);
      this._attachToView(next);

      this._detachFromView(this._activeViewEl);
      this.$.viewHost.replaceChildren(next);

      this._activeViewEl = next;
      this._activeViewTag = tag;
    }

    this._activeViewEl.currentDate = this.currentDate;
    // Прокидываем новый reference, чтобы child-view гарантированно ререндерился
    // даже при in-place мутациях массива событий (ControlledArray / splice).
    this._activeViewEl.events = Array.isArray(this.events) ? [...this.events] : [];
    this._activeViewEl.currentTime = this.currentTime;
    this._activeViewEl.people = Array.isArray(this.people) ? [...this.people] : [];
    this._activeViewEl.calendarMode = this.calendarMode || 'self';
    this._activeViewEl.selfPersonId = this.selfPersonId || 'self';
    this._activeViewEl.blockedSlots = Array.isArray(this.blockedSlots) ? [...this.blockedSlots] : [];
  }

  _attachToView(el) {
    if (!el) return;

    el.addEventListener('calendarEdit', this._bound.onViewEdit);
    el.addEventListener('calendarCreate', this._bound.onViewCreate);
    el.addEventListener('calendarEventsChange', this._bound.onViewEventsChange);
    el.addEventListener('calendarNavigate', this._bound.onViewNavigate);
    el.addEventListener('calendarMonthDropTime', this._bound.onMonthDropTime);
    el.addEventListener('calendarMonthDropAllDay', this._bound.onMonthDropAllDay);
  }

  _detachFromView(el) {
    if (!el) return;

    el.removeEventListener('calendarEdit', this._bound.onViewEdit);
    el.removeEventListener('calendarCreate', this._bound.onViewCreate);
    el.removeEventListener('calendarEventsChange', this._bound.onViewEventsChange);
    el.removeEventListener('calendarNavigate', this._bound.onViewNavigate);
    el.removeEventListener('calendarMonthDropTime', this._bound.onMonthDropTime);
    el.removeEventListener('calendarMonthDropAllDay', this._bound.onMonthDropAllDay);
  }

  _bindOverlayHandlers() {
    if (!this.$?.overlayRoot) return;

    this.$.overlayRoot.addEventListener('click', this._bound.onOverlayClick);
    this.$.overlayRoot.addEventListener('input', this._bound.onOverlayInput);
    this.$.overlayRoot.addEventListener('change', this._bound.onOverlayInput);
  }

  _unbindOverlayHandlers() {
    if (!this.$?.overlayRoot) return;

    this.$.overlayRoot.removeEventListener('click', this._bound.onOverlayClick);
    this.$.overlayRoot.removeEventListener('input', this._bound.onOverlayInput);
    this.$.overlayRoot.removeEventListener('change', this._bound.onOverlayInput);
  }

  _effectivePeople() {
    const source = Array.isArray(this.people) ? this.people : [];
    const mapped = source.map((person, idx) => ({
      id: String(person?.id || person?.code || person?.login || `person-${idx + 1}`),
      name: String(person?.name || person?.title || `Сотрудник ${idx + 1}`)
    }));

    const selfId = String(this.selfPersonId || mapped[0]?.id || 'self');
    if (String(this.calendarMode) !== 'team') {
      const self = mapped.find((person) => person.id === selfId);
      return [self || { id: selfId, name: 'Я' }];
    }

    return mapped.length ? mapped : [{ id: selfId, name: 'Я' }];
  }

  _defaultPersonId() {
    return String(this._effectivePeople()?.[0]?.id || this.selfPersonId || 'self');
  }

  _renderOverlay() {
    if (!this.isConnected || !this._ti || !this.$?.overlayRoot) return;

    if (!this.modal) {
      this.$.overlayRoot.innerHTML = '';
      return;
    }

    if (this.modal.kind === 'edit') {
      const f = this.modal.form;
      const people = this._effectivePeople();
      const personOptions = [
        ...(String(this.calendarMode) === 'team' ? [{ value: 'team', text: 'Вся команда' }] : []),
        ...people.map((person) => ({ value: String(person.id), text: String(person.name) }))
      ];
      const startDate = this._modalFormToDate(f, 'start-date');
      const endDate = this._modalFormToDate(f, 'end-date');
      this.$.overlayRoot.innerHTML = `
        <div class="modal-backdrop">
          <div class="modal" data-modal="1">
            <h3>${this.modal.mode === 'create' ? 'Новое событие' : 'Редактирование'}</h3>
            <pl-flex-layout vertical gap="10" stretch>
              <pl-input stretch label="Название" data-field="title" value="${escapeHtml(f.title)}"></pl-input>

              <pl-flex-layout gap="8" stretch>
                <pl-combobox stretch data-field="type" label="Тип"></pl-combobox>
                <pl-combobox stretch data-field="personId" label="Сотрудник"></pl-combobox>
              </pl-flex-layout>

              <pl-checkbox data-field="allDay" caption="Весь день"></pl-checkbox>

              <pl-flex-layout gap="8" stretch>
                <pl-datetime stretch data-field="sDate" type="date" label="Начало (дата)"></pl-datetime>
                <pl-time stretch data-field="sTime" label="Начало (время)" value="${escapeHtml(f.sTime || '00:00')}"></pl-time>
              </pl-flex-layout>

              <pl-flex-layout gap="8" stretch>
                <pl-datetime stretch data-field="eDate" type="date" label="Конец (дата)"></pl-datetime>
                <pl-time stretch data-field="eTime" label="Конец (время)" value="${escapeHtml(f.eTime || '00:00')}"></pl-time>
              </pl-flex-layout>
            </pl-flex-layout>

            <div class="actions">
              ${this.modal.mode === 'edit' ? '<pl-button variant="ghost" negative label="Удалить" data-action="delete-event"></pl-button>' : ''}
              <pl-button variant="secondary" label="Отмена" data-action="close-modal"></pl-button>
              <pl-button variant="primary" label="Сохранить" data-action="save-event"></pl-button>
            </div>
          </div>
        </div>
      `;
      this._setOverlayDateTimeValue('[data-field="sDate"]', startDate);
      this._setOverlayDateTimeValue('[data-field="eDate"]', endDate);
      this._setOverlayCombobox('[data-field="type"]', this._typeOptions(), f.type || 'default');
      this._setOverlayCombobox('[data-field="personId"]', personOptions, f.personId || this._defaultPersonId());
      this._setOverlayCheckbox('[data-field="allDay"]', Boolean(f.allDay));
      return;
    }

    if (this.modal.kind === 'move-time') {
      this.$.overlayRoot.innerHTML = `
        <div class="modal-backdrop">
          <div class="modal" data-modal="1">
            <h3>Перенос события</h3>
            <pl-flex-layout vertical gap="10" stretch>
              <pl-flex-layout gap="8" align="center">
                <span>Дата:</span>
                <b>${ruFullDate(fromISODate(this.modal.dayIso))}</b>
              </pl-flex-layout>
              <pl-time id="moveTimeInput" stretch label="Новое начало" value="${escapeHtml(this.modal.time || '00:00')}"></pl-time>
            </pl-flex-layout>
            <div class="actions">
              <pl-button variant="secondary" label="Отмена" data-action="close-modal"></pl-button>
              <pl-button variant="primary" label="OK" data-action="confirm-move-time"></pl-button>
            </div>
          </div>
        </div>
      `;
      return;
    }

    if (this.modal.kind === 'move-allday') {
      this.$.overlayRoot.innerHTML = `
        <div class="modal-backdrop">
          <div class="modal" data-modal="1">
            <h3>Перенос события на весь день</h3>
            <pl-flex-layout vertical gap="10" stretch>
              <pl-flex-layout gap="8" align="center">
                <span>Начало:</span>
                <b>${ruFullDate(fromISODate(this.modal.dayIso))}</b>
              </pl-flex-layout>
              <pl-flex-layout gap="8" align="center">
                <span>Длительность:</span>
                <b>${Math.max(1, this.modal.days || 1)}</b>
                <span>дн.</span>
              </pl-flex-layout>
            </pl-flex-layout>
            <div class="actions">
              <pl-button variant="secondary" label="Отмена" data-action="close-modal"></pl-button>
              <pl-button variant="primary" label="OK" data-action="confirm-move-allday"></pl-button>
            </div>
          </div>
        </div>
      `;
      return;
    }

    this.$.overlayRoot.innerHTML = '';
  }

  _onViewEdit(e) {
    const id = e.detail?.id;
    const ev = (this.events || []).find((x) => x.id === id);
    if (ev) this._openEdit(ev);
  }

  _onViewCreate(e) {
    const dayIso = e.detail?.dayIso;
    const minuteHint = e.detail?.minuteHint;
    const personId = e.detail?.personId;
    this._openCreateInit(dayIso ? fromISODate(dayIso) : this.currentDate, minuteHint, personId);
  }

  _onViewEventsChange(e) {
    this.events = e.detail?.events || [];
  }

  _onViewNavigate(e) {
    if (e.detail?.view) this.view = e.detail.view;
    if (e.detail?.dateIso) this.currentDate = fromISODate(e.detail.dateIso);
  }

  _onMonthDropTime(e) {
    const { id, dayIso, start, end } = e.detail || {};
    const srcStart = new Date(start);

    this.modal = {
      kind: 'move-time',
      id,
      dayIso,
      dur: new Date(end) - new Date(start),
      time: hm(srcStart)
    };
  }

  _onMonthDropAllDay(e) {
    const { id, dayIso, days } = e.detail || {};
    this.modal = {
      kind: 'move-allday',
      id,
      dayIso,
      days: days || 1
    };
  }

  _openCreateInit(baseDay = null, minuteHint = null, personId = null) {
    const day = baseDay ? new Date(baseDay) : new Date(this.currentDate);
    const minute = minuteHint ?? 600;

    const start = new Date(day.getFullYear(), day.getMonth(), day.getDate(), Math.floor(minute / 60), minute % 60, 0, 0);
    const end = new Date(start.getTime() + 60 * 60 * 1000);

    this.modal = {
      kind: 'edit',
      mode: 'create',
      form: {
        id: Math.random().toString(36).slice(2),
        title: '',
        type: 'default',
        personId: String(personId || this._defaultPersonId()),
        allDay: false,
        sDate: toISODate(start),
        sTime: hm(start),
        eDate: toISODate(end),
        eTime: hm(end)
      }
    };
  }

  _openEdit(ev) {
    const start = new Date(ev.start);
    const end = new Date(ev.end);

    this.modal = {
      kind: 'edit',
      mode: 'edit',
      form: {
        id: ev.id,
        title: ev.title || '',
        type: ev.type || 'default',
        personId: String(ev.personId || this._defaultPersonId()),
        allDay: Boolean(ev.allDay),
        sDate: toISODate(start),
        sTime: hm(start),
        eDate: toISODate(end),
        eTime: hm(end)
      }
    };
  }

  _setOverlayDateTimeValue(selector, value) {
    queueMicrotask(() => {
      const el = this.$?.overlayRoot?.querySelector(selector);
      if (el) el.value = value || null;
    });
  }

  _setOverlayCombobox(selector, data, value) {
    queueMicrotask(() => {
      const el = this.$?.overlayRoot?.querySelector(selector);
      if (!el) return;
      el.data = Array.isArray(data) ? data : [];
      el.value = value == null ? null : String(value);
    });
  }

  _setOverlayCheckbox(selector, checked) {
    queueMicrotask(() => {
      const el = this.$?.overlayRoot?.querySelector(selector);
      if (el) el.checked = Boolean(checked);
    });
  }

  _typeOptions() {
    return [
      { value: 'default', text: 'Онлайн-синк' },
      { value: 'tech', text: 'Разработка' },
      { value: 'screen', text: 'Код-ревью' },
      { value: 'manager', text: 'Планирование' },
      { value: 'offer', text: 'Релиз' }
    ];
  }

  _modalFormToDate(form, mode = 'start-date') {
    const f = form || {};
    const date = mode === 'end-date' ? f.eDate : f.sDate;
    const raw = `${date || toISODate(new Date())}T00:00:00`;
    const dt = new Date(raw);
    return Number.isNaN(dt.getTime()) ? new Date() : dt;
  }

  _normalizeDateLike(value) {
    if (!value) return null;
    const dt = value instanceof Date ? new Date(value) : new Date(value);
    if (Number.isNaN(dt.getTime())) return null;
    return dt;
  }

  _collectModalForm() {
    const fallback = this.modal?.form || {};
    const root = this.$?.overlayRoot;
    if (!root) return fallback;

    const title = root.querySelector('[data-field="title"]')?.value ?? fallback.title;
    const type = root.querySelector('[data-field="type"]')?.value ?? fallback.type;
    const personId = root.querySelector('[data-field="personId"]')?.value ?? fallback.personId;
    const allDay = Boolean(root.querySelector('[data-field="allDay"]')?.checked ?? fallback.allDay);

    const sDateValue = root.querySelector('[data-field="sDate"]')?.value;
    const eDateValue = root.querySelector('[data-field="eDate"]')?.value;
    const sDateObj = this._normalizeDateLike(sDateValue) || this._modalFormToDate(fallback, 'start-date');
    const eDateObj = this._normalizeDateLike(eDateValue) || this._modalFormToDate(fallback, 'end-date');

    const sTime = String(root.querySelector('[data-field="sTime"]')?.value || fallback.sTime || '00:00');
    const eTime = String(root.querySelector('[data-field="eTime"]')?.value || fallback.eTime || '00:00');

    const [sh, sm] = sTime.split(':').map((x) => parseInt(x, 10));
    const [eh, em] = eTime.split(':').map((x) => parseInt(x, 10));

    const startAt = new Date(sDateObj);
    const endAt = new Date(eDateObj);

    if (allDay) {
      startAt.setHours(0, 0, 0, 0);
      endAt.setHours(0, 0, 0, 0);
      if (endAt <= startAt) {
        endAt.setDate(endAt.getDate() + 1);
      }
    } else {
      startAt.setHours(Number.isFinite(sh) ? sh : 0, Number.isFinite(sm) ? sm : 0, 0, 0);
      endAt.setHours(Number.isFinite(eh) ? eh : 0, Number.isFinite(em) ? em : 0, 0, 0);
      if (endAt <= startAt) {
        endAt.setTime(startAt.getTime() + 30 * 60 * 1000);
      }
    }

    return {
      ...fallback,
      title,
      type,
      personId,
      allDay,
      sDate: toISODate(startAt),
      sTime: hm(startAt),
      eDate: toISODate(endAt),
      eTime: hm(endAt)
    };
  }

  _saveForm() {
    const f = this._collectModalForm();
    if (!f) return;
    const newEvent = buildEventFromForm({
      ...f,
      personId: f.personId || this._defaultPersonId()
    });

    if (!newEvent.allDay) {
      const start = new Date(newEvent.start);
      const dayIso = toISODate(start);
      const personId = String(newEvent.personId || this._defaultPersonId());
      const range = minutesRangeByEvent(newEvent);
      const blocked = getBlockedIntervals(this.blockedSlots || [], dayIso, personId);

      if (intersectsBlocked(blocked, range.startMin, range.endMin)) {
        this.dispatchEvent(new CustomEvent('calendarBlocked', {
          detail: {
            dayIso,
            personId,
            startMin: range.startMin,
            endMin: range.endMin,
            reason: 'blocked-slot'
          },
          bubbles: true,
          composed: true
        }));
        return;
      }
    }

    this.events = upsertEvent(this.events || [], newEvent, this.modal.mode);

    this.modal = null;
  }

  _deleteEvent(id) {
    this.events = deleteEventById(this.events || [], id);
    this.modal = null;
  }

  _onOverlayInput(e) {
    if (!this.modal || this.modal.kind !== 'edit') return;

    const field = e.target.dataset?.field;
    if (field !== 'allDay') return;

    const value = e.target.checked;
    if (value === Boolean(this.modal.form?.allDay)) return;
    const draft = this._collectModalForm();

    this.modal = {
      ...this.modal,
      form: {
        ...draft,
        allDay: value
      }
    };
  }

  _onOverlayClick(e) {
    const backdropClicked = e.target.classList.contains('modal-backdrop');
    if (backdropClicked) {
      this.modal = null;
      return;
    }

    const actionEl = e.target.closest('[data-action]');
    if (!actionEl) return;

    switch (actionEl.dataset.action) {
      case 'close-modal':
        this.modal = null;
        return;
      case 'save-event':
        this._saveForm();
        return;
      case 'delete-event':
        this._deleteEvent(this.modal?.form?.id);
        return;
      case 'confirm-move-time': {
        if (!this.modal || this.modal.kind !== 'move-time') return;

        const inp = this.$.overlayRoot.querySelector('#moveTimeInput');
        const current = (this.events || []).find((ev) => String(ev.id) === String(this.modal.id));
        const personId = String(current?.personId || this._defaultPersonId());
        const [hh, mm] = String(inp?.value || '00:00').split(':').map((x) => parseInt(x, 10));
        const startMin = (hh || 0) * 60 + (mm || 0);
        const durationMin = Math.max(15, Math.round((this.modal.dur || 0) / 60000));
        const endMin = startMin + durationMin;
        const blocked = getBlockedIntervals(this.blockedSlots || [], this.modal.dayIso, personId);
        if (intersectsBlocked(blocked, startMin, endMin)) {
          this.dispatchEvent(new CustomEvent('calendarBlocked', {
            detail: {
              dayIso: this.modal.dayIso,
              personId,
              startMin,
              endMin,
              reason: 'blocked-slot'
            },
            bubbles: true,
            composed: true
          }));
          return;
        }

        this.events = moveTimedEventByClock(this.events || [], {
          id: this.modal.id,
          dayIso: this.modal.dayIso,
          time: `${String(hh).padStart(2, '0')}:${String(mm).padStart(2, '0')}`,
          durationMs: this.modal.dur || 0,
          personId
        });

        this.modal = null;
        return;
      }
      case 'confirm-move-allday': {
        if (!this.modal || this.modal.kind !== 'move-allday') return;
        this.events = moveAllDaySpan(this.events || [], {
          id: this.modal.id,
          dayIso: this.modal.dayIso,
          days: this.modal.days || 1
        });

        this.modal = null;
        return;
      }
      default:
        return;
    }
  }
}

if (!customElements.get('pl-pro-calendar')) {
  customElements.define('pl-pro-calendar', PlProCalendar);
}

export default PlProCalendar;
