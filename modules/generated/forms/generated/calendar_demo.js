import { html, css } from 'polylib';
import { PlForm } from '@nfjs/front-pl/components/pl-form.js';
import '@plcmp/pl-button';
import '@plcmp/pl-icon-button';
import '@plcmp/pl-iconset-default';
import '@plcmp/pl-flex-layout';
import '@plcmp/pl-radio-group';
import '@plcmp/pl-radio-button';
import { ruDayMonth, ruFullDate, ruMonthYear } from '/generated/components/calendar/helpers/date-time.js';

export default class GeneratedCalendarDemo extends PlForm {
  static properties = {
    formTitle: {
      type: String,
      value: 'Generated: Календарь (Polylib)'
    },
    events: {
      type: Array,
      value: () => []
    },
    currentDate: {
      type: Object,
      value: () => new Date()
    },
    view: {
      type: String,
      value: 'day'
    },
    calendarMode: {
      type: String,
      value: 'team'
    },
    selfPersonId: {
      type: String,
      value: 'self'
    },
    people: {
      type: Array,
      value: () => ([
        { id: 'self', name: 'Я', subtitle: 'Личный календарь', avatar: 'Я' },
        { id: 'ivan_petrov', name: 'Иван Петров', subtitle: 'Frontend-разработчик', avatar: 'ИП' },
        { id: 'anna_smirnova', name: 'Анна Смирнова', subtitle: 'Backend-разработчик', avatar: 'АС' },
        { id: 'dmitry_kuznetsov', name: 'Дмитрий Кузнецов', subtitle: 'DevOps-инженер', avatar: 'ДК' },
        { id: 'olga_ivanova', name: 'Ольга Иванова', subtitle: 'QA-инженер', avatar: 'ОИ' },
        { id: 'sergey_volkov', name: 'Сергей Волков', subtitle: 'Team Lead', avatar: 'СВ' },
        { id: 'maria_fedorova', name: 'Мария Фёдорова', subtitle: 'Product Manager', avatar: 'МФ' },
        { id: 'pavel_egorov', name: 'Павел Егоров', subtitle: 'UI/UX дизайнер', avatar: 'ПЕ' },
        { id: 'natalia_orlova', name: 'Наталья Орлова', subtitle: 'Data Analyst', avatar: 'НО' },
        { id: 'alexey_morozov', name: 'Алексей Морозов', subtitle: 'Mobile-разработчик', avatar: 'АМ' },
        { id: 'elena_zhukova', name: 'Елена Жукова', subtitle: 'SRE-инженер', avatar: 'ЕЖ' },
        { id: 'roman_belov', name: 'Роман Белов', subtitle: 'Solution Architect', avatar: 'РБ' },
        { id: 'viktoria_nikitina', name: 'Виктория Никитина', subtitle: 'QA Automation', avatar: 'ВН' },
        { id: 'kirill_sokolov', name: 'Кирилл Соколов', subtitle: 'Security Engineer', avatar: 'КС' },
        { id: 'irina_lebedeva', name: 'Ирина Лебедева', subtitle: 'Scrum Master', avatar: 'ИЛ' }
      ])
    },
    blockedSlots: {
      type: Array,
      value: () => ([
        { id: 'break_lunch', title: 'Обеденный перерыв', kind: 'break', start: '13:00', end: '14:00', daysOfWeek: [1, 2, 3, 4, 5, 6, 7] },
        { id: 'team_sync', title: 'Общий тех-брифинг', kind: 'break', start: '17:00', end: '17:30', daysOfWeek: [1, 2, 3, 4, 5, 6, 7] },
        { id: 'self_busy', title: 'Фокус-блок', kind: 'unavailable', personId: 'self', start: '09:30', end: '10:30', daysOfWeek: [1, 2, 3, 4, 5, 6, 7] },
        { id: 'anna_busy', title: 'Недоступна', kind: 'unavailable', personId: 'anna_smirnova', start: '10:00', end: '11:30', daysOfWeek: [1, 2, 3, 4, 5, 6, 7] },
        { id: 'roman_break', title: 'Архитектурный разбор', kind: 'break', personId: 'roman_belov', start: '11:45', end: '12:30', daysOfWeek: [1, 2, 3, 4, 5, 6, 7] }
      ])
    }
  };

  static css = css`
    :host {
      display: block;
      height: 100%;
      background: var(--pl-grey-lightest);
      --cal-border: var(--pl-grey-light);
      --cal-border-strong: var(--pl-grey-base);
      --cal-surface: var(--pl-surface-color);
      --cal-muted: var(--pl-grey-darkest);
      --cal-text: var(--pl-text-color);
      --hour-height: 84px;
    }

    .calendar-shell {
      width: 100%;
      height: 100%;
      min-height: 0;
      min-width: 0;
      max-height: 100%;
      max-width: 100%;
      border: 1px solid var(--cal-border);
      border-radius: 14px;
      background: var(--cal-surface);
      overflow: hidden;
      display: flex;
      flex-direction: column;
      box-shadow: 0 12px 20px color-mix(in srgb, var(--pl-grey-darkest, #85919c), transparent 88%);
    }

    .topbar {
      display: grid;
      grid-template-columns: auto 1fr auto;
      align-items: center;
      gap: 14px;
      padding: 14px 18px;
      border-bottom: 1px solid var(--cal-border);
      background: linear-gradient(180deg, var(--pl-grey-lightest) 0%, var(--pl-background-color) 100%);
      min-height: 70px;
      box-sizing: border-box;
    }

    .period-title {
      font-size: 36px;
      line-height: 1;
      font-weight: 700;
      text-align: center;
      color: var(--cal-text);
      justify-self: center;
      letter-spacing: -.02em;
    }

    .nav-actions {
      justify-self: end;
    }

    .legend-row {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 10px 18px;
      border-bottom: 1px solid var(--cal-border);
      background: var(--pl-background-color);
      overflow-x: auto;
      scrollbar-width: thin;
    }

    .chip {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      border: 1px solid var(--cal-border-strong);
      border-radius: 9px;
      background: var(--pl-grey-lightest);
      height: 34px;
      padding: 0 12px 0 10px;
      font-size: 14px;
      font-weight: 600;
      white-space: nowrap;
      color: var(--cal-text);
    }

    .chip::before {
      content: '';
      width: 4px;
      align-self: stretch;
      border-radius: 999px;
      margin-block: 7px;
      background: var(--pl-grey-dark);
    }

    .chip.default::before { background: var(--pl-primary-base); }
    .chip.tech::before { background: var(--pl-primary-dark); }
    .chip.screen::before { background: var(--pl-grey-darkest); }
    .chip.manager::before { background: var(--pl-attention); }
    .chip.offer::before { background: var(--pl-negative-base); }
    .chip.muted {
      opacity: .52;
      filter: grayscale(.2);
    }

    .meta {
      margin-inline-start: auto;
      font-size: 13px;
      font-weight: 600;
      color: var(--cal-muted);
      white-space: nowrap;
    }

    .meta-actions {
      margin-inline-start: 10px;
    }

    .calendar-host {
      flex: 1;
      min-height: 0;
      min-width: 0;
      overflow: hidden;
      background: var(--pl-grey-lightest);
    }

    pl-pro-calendar {
      display: block;
      width: 100%;
      max-width: 100%;
      height: 100%;
      min-height: 0;
      min-width: 0;
      overflow: hidden;
      border: 0;
      --surface: var(--pl-surface-color);
      --text: var(--pl-text-color);
      --muted: var(--pl-grey-darkest);
      --border: var(--pl-grey-light);
      --accent: var(--pl-primary-base);
      --type-default: var(--pl-primary-base);
      --type-tech: var(--pl-primary-dark);
      --type-screen: var(--pl-grey-darkest);
      --type-manager: var(--pl-attention);
      --type-offer: var(--pl-negative-base);
      --event-gap: 6px;
      --hour-height: 84px;
      --px-per-minute: 1.4;
    }

    @media (max-width: 1180px) {
      .topbar {
        grid-template-columns: 1fr;
        gap: 10px;
      }

      .period-title {
        justify-self: start;
        text-align: left;
      }

      .nav-actions {
        justify-self: start;
      }

      .meta {
        margin-inline-start: 0;
      }
    }
  `;

  static template = html`
    <pl-flex-layout vertical fit>
      <div class="calendar-shell">
        <div class="topbar">
          <pl-flex-layout class="left-controls" align="center" wrap gap="8">
            <pl-radio-group class="view-tabs" selected="{{view}}">
              <pl-radio-button name="day" label="День"></pl-radio-button>
              <pl-radio-button name="week" label="Неделя"></pl-radio-button>
              <pl-radio-button name="month" label="Месяц"></pl-radio-button>
            </pl-radio-group>

            <pl-radio-group class="mode-tabs" selected="{{calendarMode}}" hidden="[[_isNotDayView(view)]]">
              <pl-radio-button name="self" label="Я"></pl-radio-button>
              <pl-radio-button name="team" label="Команда"></pl-radio-button>
            </pl-radio-group>
          </pl-flex-layout>

          <div class="period-title">[[_periodTitle(view, currentDate)]]</div>

          <pl-flex-layout class="nav-actions" align="center" gap="8">
            <pl-button variant="secondary" label="Сегодня" on-click="[[onTodayClick]]"></pl-button>
            <pl-icon-button variant="secondary" iconset="pl-default" icon="chevron-left" on-click="[[onPrevClick]]"></pl-icon-button>
            <pl-icon-button variant="secondary" iconset="pl-default" icon="chevron-right" on-click="[[onNextClick]]"></pl-icon-button>
          </pl-flex-layout>
        </div>

        <div class="legend-row">
          <span class="chip default">Онлайн</span>
          <span class="chip screen">Код-ревью</span>
          <span class="chip tech">Разработка</span>
          <span class="chip manager">Планирование</span>
          <span class="chip offer">Релиз</span>
          <span class="chip default">Перерыв</span>
          <span class="chip muted">Ресурс недоступен</span>

          <pl-flex-layout class="meta" align="center" gap="12">
            <span>Событий: [[_count(events)]]</span>
            <span>Дата: [[_formatDate(currentDate)]]</span>
            <pl-flex-layout class="meta-actions" align="center" gap="6">
              <pl-button variant="ghost" label="Обновить" on-click="[[onReloadClick]]"></pl-button>
              <pl-button variant="primary" label="Сохранить" on-click="[[onSaveClick]]"></pl-button>
              <pl-button variant="link" label="Сброс" on-click="[[onResetClick]]"></pl-button>
            </pl-flex-layout>
          </pl-flex-layout>
        </div>

        <div class="calendar-host">
          <pl-pro-calendar
            id="calendar"
            view="{{view}}"
            current-date="{{currentDate}}"
            events="{{events}}"
            people="[[people]]"
            calendar-mode="[[_effectiveCalendarMode(calendarMode, view)]]"
            self-person-id="[[selfPersonId]]"
            blocked-slots="[[blockedSlots]]"></pl-pro-calendar>
        </div>
      </div>

      <pl-dataset id="dsEvents" endpoint="/generated/calendar/events" data="{{events}}"></pl-dataset>
      <pl-action id="aSave" endpoint="/generated/calendar/save"></pl-action>
      <pl-action id="aReset" endpoint="/generated/calendar/reset"></pl-action>
    </pl-flex-layout>
  `;

  onConnect() {
    this._onCalendarBlockedBound = this._onCalendarBlocked.bind(this);
    queueMicrotask(() => {
      this.$.calendar?.addEventListener('calendarBlocked', this._onCalendarBlockedBound);
    });
    this.reload();
  }

  onDisconnect() {
    this.$.calendar?.removeEventListener('calendarBlocked', this._onCalendarBlockedBound);
  }

  reload() {
    return this.$.dsEvents.execute();
  }

  _count(events) {
    return Array.isArray(events) ? events.length : 0;
  }

  _formatDate(date) {
    if (!date) return '';
    return ruFullDate(date);
  }

  _isNotDayView(view) {
    return view !== 'day';
  }

  _effectiveCalendarMode(calendarMode, view) {
    return view === 'day' ? (calendarMode || 'self') : 'self';
  }

  _periodTitle(view, date) {
    if (!date) return '';
    const current = new Date(date);

    if (view === 'day') return ruFullDate(current);
    if (view === 'week') {
      const start = new Date(current);
      const dow = start.getDay();
      const shift = dow === 0 ? 6 : dow - 1;
      start.setDate(start.getDate() - shift);
      const end = new Date(start);
      end.setDate(end.getDate() + 6);

      if (start.getMonth() === end.getMonth()) {
        return `${ruMonthYear(start)} · ${start.getDate()}-${end.getDate()}`;
      }

      return `${ruDayMonth(start)} - ${ruDayMonth(end)}`;
    }

    return ruMonthYear(current);
  }

  onPrevClick() {
    const d = new Date(this.currentDate);
    if (this.view === 'month') d.setMonth(d.getMonth() - 1);
    else d.setDate(d.getDate() - (this.view === 'week' ? 7 : 1));
    this.currentDate = d;
  }

  onNextClick() {
    const d = new Date(this.currentDate);
    if (this.view === 'month') d.setMonth(d.getMonth() + 1);
    else d.setDate(d.getDate() + (this.view === 'week' ? 7 : 1));
    this.currentDate = d;
  }

  onTodayClick() {
    this.currentDate = new Date();
  }

  async onReloadClick() {
    await this.reload();
  }

  async onSaveClick() {
    const result = await this.$.aSave.execute({ events: this.events });
    this.notify(`Сохранено событий: ${result?.count ?? this._count(this.events)}`);
  }

  async onResetClick() {
    await this.$.aReset.execute();
    await this.reload();
    this.notify('Демо-данные восстановлены');
  }

  _hm(minutes = 0) {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
  }

  _onCalendarBlocked(e) {
    const start = this._hm(e.detail?.startMin ?? 0);
    const end = this._hm(e.detail?.endMin ?? 0);
    this.notify(`Нельзя создать встречу: интервал ${start}-${end} заблокирован`);
  }
}
