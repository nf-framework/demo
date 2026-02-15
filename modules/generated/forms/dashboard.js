import { html, css } from 'polylib';
import { PlForm } from '@nfjs/front-pl/components/pl-form.js';
import '@plcmp/pl-flex-layout';
import '@plcmp/pl-input';
import '@plcmp/pl-combobox';
import '@plcmp/pl-icon-button';
import '@plcmp/pl-badge';
import '@plcmp/pl-checkbox';
import '/generated/components/pl-table-pro.js';
import '/generated/components/pl-gantt.js';

const TEAMS = [
  'Платформа',
  'Клиентские приложения',
  'Платформа данных',
  'DevOps',
  'QA',
  'Инфобез'
];

const STATUSES = [
  'Планирование',
  'В работе',
  'На контроле',
  'Риск',
  'Завершено'
];

const ENVIRONMENTS = ['prod', 'stage', 'dev'];

function toIsoDate(baseDate, offsetDays, hours = 9, minutes = 0) {
  const date = new Date(baseDate.getTime());
  date.setDate(date.getDate() + offsetDays);
  date.setHours(hours, minutes, 0, 0);
  return date.toISOString();
}

function toDateOnly(baseDate, offsetDays) {
  const date = new Date(baseDate.getTime());
  date.setDate(date.getDate() + offsetDays);
  date.setHours(0, 0, 0, 0);
  return date.toISOString();
}

function containsText(value, search) {
  return String(value || '').toLowerCase().includes(search);
}

export default class GeneratedDashboard extends PlForm {
  static properties = {
    formTitle: {
      type: String,
      value: 'Generated: Dashboard'
    },
    search: { type: String, value: '', observer: '_filtersChanged' },
    filterTeam: { type: String, value: '', observer: '_filtersChanged' },
    filterStatus: { type: String, value: '', observer: '_filtersChanged' },
    showDone: { type: Boolean, value: true, observer: '_filtersChanged' },

    teamOptions: {
      type: Array,
      value: () => [
        { value: '', text: 'Все команды' },
        ...TEAMS.map((team) => ({ value: team, text: team }))
      ]
    },
    statusOptions: {
      type: Array,
      value: () => [
        { value: '', text: 'Все статусы' },
        ...STATUSES.map((status) => ({ value: status, text: status }))
      ]
    },

    allRoadmap: { type: Array, value: () => [] },
    allReleases: { type: Array, value: () => [] },
    allWorkItems: { type: Array, value: () => [] },

    roadmap: { type: Array, value: () => [] },
    releaseRows: { type: Array, value: () => [] },
    workItems: { type: Array, value: () => [] },

    selectedRelease: { value: () => null },
    selectedWorkItem: { value: () => null },

    summary: {
      type: Object,
      value: () => ({
        projects: 0,
        atRisk: 0,
        dueWeek: 0,
        workload: 0
      })
    }
  };

  static css = css`
    :host {
      display: block;
      width: 100%;
      height: 100%;
      min-width: 0;
      min-height: 0;
      overflow: hidden;
    }

    .dashboard-shell {
      width: 100%;
      height: 100%;
      min-width: 0;
      min-height: 0;
      box-sizing: border-box;
      overflow: hidden;
      align-items: stretch;
    }

    pl-flex-layout.dashboard-shell {
      min-width: 0;
      min-height: 0;
    }

    .toolbar {
      border: 1px solid var(--pl-grey-light);
      border-radius: var(--pl-border-radius);
      background: var(--pl-background-color);
      padding: 8px;
      box-sizing: border-box;
    }

    .toolbar pl-input {
      min-width: 280px;
      flex: 1;
    }

    .toggle-label {
      color: var(--pl-grey-darkest);
      font: var(--pl-text-font);
      white-space: nowrap;
    }

    .kpi-grid {
      display: grid;
      grid-template-columns: repeat(4, minmax(180px, 1fr));
      gap: 8px;
      width: 100%;
    }

    .kpi-card {
      min-height: 88px;
      border: 1px solid var(--pl-grey-light);
      border-radius: var(--pl-border-radius);
      background: var(--pl-background-color);
      padding: 8px 10px;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      justify-content: center;
      gap: 4px;
    }

    .kpi-title {
      font: var(--pl-text-font);
      color: var(--pl-grey-darkest);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .kpi-value {
      font: var(--pl-header-font);
      color: var(--pl-header-color);
      font-size: 22px;
      line-height: 1;
      font-weight: 700;
    }

    .main-row,
    .bottom-row {
      width: 100%;
      min-width: 0;
      min-height: 0;
      flex: 1 1 0;
      display: flex;
      gap: 8px;
      overflow: hidden;
      align-items: stretch;
    }

    .panel {
      border: 1px solid var(--pl-grey-light);
      border-radius: var(--pl-border-radius);
      background: var(--pl-background-color);
      min-width: 0;
      min-height: 0;
      overflow: hidden;
      box-sizing: border-box;
      align-items: stretch;
    }

    .panel-main {
      flex: 1;
      min-width: 0;
    }

    .panel-side {
      width: min(38%, 460px);
      min-width: 320px;
      max-width: 460px;
    }

    .panel-head {
      min-height: var(--pl-base-size);
      border-bottom: 1px solid var(--pl-grey-light);
      background: var(--pl-grey-lightest);
      padding: 6px 8px;
      box-sizing: border-box;
    }

    .panel-title {
      font: var(--pl-header-font);
      color: var(--pl-header-color);
      font-weight: 700;
    }

    .panel-body {
      display: block;
      position: relative;
      flex: 1;
      min-height: 0;
      min-width: 0;
      overflow: hidden;
    }

    .panel-body pl-gantt,
    .panel-body pl-table-pro {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      min-width: 0;
      min-height: 0;
      border: 0;
      border-radius: 0;
      --pl-table-pro-pill-ok-color: #136a4b;
      --pl-table-pro-pill-ok-border: #8fd0b4;
      --pl-table-pro-pill-ok-bg: #e7f7ee;
      --pl-table-pro-pill-warn-color: #8c6200;
      --pl-table-pro-pill-warn-border: #f2ca78;
      --pl-table-pro-pill-warn-bg: #fff4de;
      --pl-table-pro-pill-bad-color: #a33434;
      --pl-table-pro-pill-bad-border: #efaaaa;
      --pl-table-pro-pill-bad-bg: #ffe8e8;
      --pl-table-pro-pill-info-color: #2f5daa;
      --pl-table-pro-pill-info-border: #a9bff2;
      --pl-table-pro-pill-info-bg: #e9f1ff;
    }

    .panel-body pl-gantt {
      --pl-gantt-ok-color: #136a4b;
      --pl-gantt-ok-border: #8fd0b4;
      --pl-gantt-ok-bg: #e7f7ee;
      --pl-gantt-warn-color: #8c6200;
      --pl-gantt-warn-border: #f2ca78;
      --pl-gantt-warn-bg: #fff4de;
      --pl-gantt-bad-color: #a33434;
      --pl-gantt-bad-border: #efaaaa;
      --pl-gantt-bad-bg: #ffe8e8;
      --pl-gantt-info-color: #2f5daa;
      --pl-gantt-info-border: #a9bff2;
      --pl-gantt-info-bg: #e9f1ff;
    }

    @media (max-width: 1320px) {
      .kpi-grid {
        grid-template-columns: repeat(2, minmax(180px, 1fr));
      }

      .main-row {
        flex-direction: column;
      }

      .panel-side {
        width: 100%;
        min-width: 0;
        max-width: none;
        min-height: 260px;
      }
    }

    @media (max-width: 860px) {
      .kpi-grid {
        grid-template-columns: 1fr;
      }

      .bottom-row {
        min-height: 280px;
      }
    }
  `;

  static template = html`
    <pl-flex-layout vertical fit class="dashboard-shell" gap="8">
      <pl-flex-layout class="toolbar" wrap gap="8" align="flex-end">
        <pl-input label="Поиск" value="{{search}}" placeholder="Проект, команда, исполнитель"></pl-input>
        <pl-combobox
          label="Команда"
          value="{{filterTeam}}"
          data="[[teamOptions]]"
          text-property="text"
          value-property="value"></pl-combobox>
        <pl-combobox
          label="Статус"
          value="{{filterStatus}}"
          data="[[statusOptions]]"
          text-property="text"
          value-property="value"></pl-combobox>
        <pl-flex-layout align="center" gap="6">
          <pl-checkbox checked="{{showDone}}"></pl-checkbox>
          <span class="toggle-label">Показывать завершенные</span>
        </pl-flex-layout>
        <pl-icon-button variant="ghost" iconset="pl-default" icon="reload" on-click="[[onReloadClick]]"></pl-icon-button>
      </pl-flex-layout>

      <div class="kpi-grid">
        <div class="kpi-card">
          <div class="kpi-title">Инициатив в портфеле</div>
          <div class="kpi-value">[[summary.projects]]</div>
          <pl-badge>Roadmap</pl-badge>
        </div>
        <div class="kpi-card">
          <div class="kpi-title">Зоны риска</div>
          <div class="kpi-value">[[summary.atRisk]]</div>
          <pl-badge>Контроль</pl-badge>
        </div>
        <div class="kpi-card">
          <div class="kpi-title">Релизов на неделе</div>
          <div class="kpi-value">[[summary.dueWeek]]</div>
          <pl-badge>Поставка</pl-badge>
        </div>
        <div class="kpi-card">
          <div class="kpi-title">Средняя загрузка, %</div>
          <div class="kpi-value">[[summary.workload]]</div>
          <pl-badge>Операции</pl-badge>
        </div>
      </div>

      <pl-flex-layout class="main-row" gap="8">
        <pl-flex-layout vertical class="panel panel-main" fit>
          <pl-flex-layout class="panel-head" align="center" gap="8">
            <div class="panel-title">Программа проектов (Gantt)</div>
            <pl-badge>[[roadmap.length]] инициатив</pl-badge>
          </pl-flex-layout>
          <div class="panel-body">
            <pl-gantt data="[[roadmap]]" day-width="30" side-width="300"></pl-gantt>
          </div>
        </pl-flex-layout>

        <pl-flex-layout vertical class="panel panel-side" fit>
          <pl-flex-layout class="panel-head" align="center" gap="8">
            <div class="panel-title">Ближайшие релизы</div>
            <pl-badge>[[releaseRows.length]] записей</pl-badge>
          </pl-flex-layout>
          <div class="panel-body">
            <pl-table-pro
              id="tblRelease"
              data="{{releaseRows}}"
              selected="{{selectedRelease}}"
              settings-key="generated.dashboard.releases">
              <template is="extra styles">
                <style>
                  .cell-pill,
                  .group-template-pill,
                  .detail-pill {
                    font-weight: 600;
                  }

                  .cell-pill.ok,
                  .group-template-pill.ok,
                  .detail-pill.ok,
                  .metric.ok {
                    color: #136a4b;
                    border-color: #8fd0b4;
                    background: #e7f7ee;
                  }

                  .cell-pill.warn,
                  .group-template-pill.warn,
                  .detail-pill.warn,
                  .metric.warn {
                    color: #8c6200;
                    border-color: #f2ca78;
                    background: #fff4de;
                  }

                  .cell-pill.bad,
                  .group-template-pill.bad,
                  .detail-pill.bad,
                  .metric.bad {
                    color: #a33434;
                    border-color: #efaaaa;
                    background: #ffe8e8;
                  }

                  .cell-pill.info,
                  .group-template-pill.info,
                  .detail-pill.info,
                  .metric.info {
                    color: #2f5daa;
                    border-color: #a9bff2;
                    background: #e9f1ff;
                  }
                </style>
              </template>
              <pl-table-pro-column id="release_code" field="release_code" header="Релиз" width="120"></pl-table-pro-column>
              <pl-table-pro-column id="product" field="product" header="Продукт" width="170"></pl-table-pro-column>
              <pl-table-pro-column id="team" field="team" header="Команда" width="150"></pl-table-pro-column>
              <pl-table-pro-column id="status" field="status" header="Статус" width="130" cell-align="center"></pl-table-pro-column>
              <pl-table-pro-column id="window_start" field="window_start" header="Окно" kind="date" format="DD.MM.YYYY HH:mm" width="170"></pl-table-pro-column>
            </pl-table-pro>
          </div>
        </pl-flex-layout>
      </pl-flex-layout>

      <pl-flex-layout class="bottom-row">
        <pl-flex-layout vertical class="panel" fit>
          <pl-flex-layout class="panel-head" align="center" gap="8">
            <div class="panel-title">Операционный бэклог</div>
            <pl-badge>[[workItems.length]] задач</pl-badge>
          </pl-flex-layout>
          <div class="panel-body">
            <pl-table-pro
              id="tblBacklog"
              data="{{workItems}}"
              selected="{{selectedWorkItem}}"
              settings-key="generated.dashboard.backlog">
              <template is="extra styles">
                <style>
                  .cell-pill,
                  .group-template-pill,
                  .detail-pill {
                    font-weight: 600;
                  }

                  .cell-pill.ok,
                  .group-template-pill.ok,
                  .detail-pill.ok,
                  .metric.ok {
                    color: #136a4b;
                    border-color: #8fd0b4;
                    background: #e7f7ee;
                  }

                  .cell-pill.warn,
                  .group-template-pill.warn,
                  .detail-pill.warn,
                  .metric.warn {
                    color: #8c6200;
                    border-color: #f2ca78;
                    background: #fff4de;
                  }

                  .cell-pill.bad,
                  .group-template-pill.bad,
                  .detail-pill.bad,
                  .metric.bad {
                    color: #a33434;
                    border-color: #efaaaa;
                    background: #ffe8e8;
                  }

                  .cell-pill.info,
                  .group-template-pill.info,
                  .detail-pill.info,
                  .metric.info {
                    color: #2f5daa;
                    border-color: #a9bff2;
                    background: #e9f1ff;
                  }
                </style>
              </template>
              <pl-table-pro-column id="ticket" field="ticket" header="Тикет" width="120" fixed="left"></pl-table-pro-column>
              <pl-table-pro-column id="title" field="title" header="Задача" width="320" fixed="left"></pl-table-pro-column>
              <pl-table-pro-column id="owner" field="owner" header="Исполнитель" width="170"></pl-table-pro-column>
              <pl-table-pro-column id="team" field="team" header="Команда" width="160"></pl-table-pro-column>
              <pl-table-pro-column id="environment" field="environment" header="Среда" width="110" cell-align="center"></pl-table-pro-column>
              <pl-table-pro-column id="priority" field="priority" header="Приоритет" width="120" cell-align="center"></pl-table-pro-column>
              <pl-table-pro-column id="status" field="status" header="Статус" width="140" cell-align="center"></pl-table-pro-column>
              <pl-table-pro-column id="progress_pct" field="progress_pct" header="Прогресс, %" width="120" align="right"></pl-table-pro-column>
              <pl-table-pro-column id="start_at" field="start_at" header="Старт" kind="date" format="DD.MM.YYYY HH:mm" width="170"></pl-table-pro-column>
              <pl-table-pro-column id="due_date" field="due_date" header="Дедлайн" kind="date" width="130"></pl-table-pro-column>
              <pl-table-pro-column id="estimate_hours" field="estimate_hours" header="Оценка, ч" width="110" align="right"></pl-table-pro-column>
            </pl-table-pro>
          </div>
        </pl-flex-layout>
      </pl-flex-layout>
    </pl-flex-layout>
  `;

  onConnect() {
    this._seedMemoryData();
  }

  onReloadClick() {
    this._seedMemoryData();
  }

  _filtersChanged() {
    this._applyFilters();
  }

  _seedMemoryData() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const roadmap = [
      { id: 'road-1', title: 'Единый профиль клиента', owner: 'Иван Петров', team: 'Клиентские приложения', status: 'В работе', progress: 58, start: toDateOnly(today, -10), end: toDateOnly(today, 18) },
      { id: 'road-2', title: 'Каталог API v2', owner: 'Анна Смирнова', team: 'Платформа', status: 'На контроле', progress: 41, start: toDateOnly(today, -5), end: toDateOnly(today, 24) },
      { id: 'road-3', title: 'Платформа данных: DQ rules', owner: 'Дмитрий Кузнецов', team: 'Платформа данных', status: 'Риск', progress: 27, start: toDateOnly(today, -3), end: toDateOnly(today, 30) },
      { id: 'road-4', title: 'CI/CD ускорение сборок', owner: 'Ольга Иванова', team: 'DevOps', status: 'В работе', progress: 66, start: toDateOnly(today, -16), end: toDateOnly(today, 12) },
      { id: 'road-5', title: 'QA автотесты биллинга', owner: 'Сергей Волков', team: 'QA', status: 'Планирование', progress: 14, start: toDateOnly(today, 1), end: toDateOnly(today, 22) },
      { id: 'road-6', title: 'Ролевая модель доступа', owner: 'Мария Федорова', team: 'Инфобез', status: 'На контроле', progress: 49, start: toDateOnly(today, -8), end: toDateOnly(today, 16) },
      { id: 'road-7', title: 'Сервис уведомлений 2.0', owner: 'Павел Егоров', team: 'Платформа', status: 'В работе', progress: 61, start: toDateOnly(today, -14), end: toDateOnly(today, 10) },
      { id: 'road-8', title: 'Новый онбординг', owner: 'Екатерина Орлова', team: 'Клиентские приложения', status: 'Завершено', progress: 100, start: toDateOnly(today, -28), end: toDateOnly(today, -2) },
      { id: 'road-9', title: 'Аудит API периметра', owner: 'Денис Логинов', team: 'Инфобез', status: 'Риск', progress: 33, start: toDateOnly(today, -6), end: toDateOnly(today, 14) },
      { id: 'road-10', title: 'SLO/SLI мониторинг', owner: 'Никита Соловьев', team: 'DevOps', status: 'В работе', progress: 54, start: toDateOnly(today, -4), end: toDateOnly(today, 20) }
    ];

    const releases = [
      { id: 1, release_code: 'REL-2026.02.1', product: 'Профиль клиента', team: 'Клиентские приложения', status: 'На контроле', window_start: toIsoDate(today, 2, 20, 0) },
      { id: 2, release_code: 'REL-2026.02.2', product: 'API Gateway', team: 'Платформа', status: 'В работе', window_start: toIsoDate(today, 4, 22, 0) },
      { id: 3, release_code: 'REL-2026.02.3', product: 'Data Quality', team: 'Платформа данных', status: 'Риск', window_start: toIsoDate(today, 6, 19, 30) },
      { id: 4, release_code: 'REL-2026.02.4', product: 'Инфобез-политики', team: 'Инфобез', status: 'Планирование', window_start: toIsoDate(today, 8, 21, 0) },
      { id: 5, release_code: 'REL-2026.03.1', product: 'QA toolkit', team: 'QA', status: 'Планирование', window_start: toIsoDate(today, 13, 20, 0) },
      { id: 6, release_code: 'REL-2026.03.2', product: 'SRE stack', team: 'DevOps', status: 'В работе', window_start: toIsoDate(today, 16, 20, 30) }
    ];

    const workItems = Array.from({ length: 72 }, (_, index) => {
      const n = index + 1;
      const team = TEAMS[index % TEAMS.length];
      const status = STATUSES[index % STATUSES.length];
      const priority = ['P1', 'P2', 'P3'][index % 3];
      const owner = ['Иван Петров', 'Анна Смирнова', 'Дмитрий Кузнецов', 'Ольга Иванова', 'Сергей Волков', 'Мария Федорова'][index % 6];
      const environment = ENVIRONMENTS[index % ENVIRONMENTS.length];
      const progressPct = status === 'Завершено' ? 100 : Math.min(95, 15 + (index * 7) % 80);

      return {
        id: n,
        ticket: `OPS-${String(1000 + n)}`,
        title: `Задача #${n}: ${team} / итерация ${Math.floor(index / 6) + 1}`,
        owner,
        team,
        environment,
        priority,
        status,
        progress_pct: progressPct,
        start_at: toIsoDate(today, -12 + (index % 21), 9 + (index % 6), index % 2 ? 30 : 0),
        due_date: toDateOnly(today, -2 + (index % 25)),
        estimate_hours: 6 + (index % 9)
      };
    });

    this.allRoadmap = roadmap;
    this.allReleases = releases;
    this.allWorkItems = workItems;
    this._applyFilters();
  }

  _applyFilters() {
    const search = String(this.search || '').trim().toLowerCase();
    const teamFilter = String(this.filterTeam || '');
    const statusFilter = String(this.filterStatus || '');
    const includeDone = Boolean(this.showDone);

    const passes = (row) => {
      if (!row) return false;
      if (teamFilter && String(row.team || '') !== teamFilter) return false;
      if (statusFilter && String(row.status || '') !== statusFilter) return false;
      if (!includeDone && String(row.status || '').toLowerCase().includes('заверш')) return false;
      if (!search) return true;

      return (
        containsText(row.title, search)
        || containsText(row.product, search)
        || containsText(row.owner, search)
        || containsText(row.team, search)
        || containsText(row.ticket, search)
        || containsText(row.release_code, search)
      );
    };

    const roadmap = (this.allRoadmap || []).filter((row) => passes(row));
    const releaseRows = (this.allReleases || []).filter((row) => passes(row));
    const workItems = (this.allWorkItems || []).filter((row) => passes(row));

    this.roadmap = roadmap;
    this.releaseRows = releaseRows;
    this.workItems = workItems;

    const now = new Date();
    const weekEnd = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    const dueWeek = releaseRows.filter((row) => {
      const date = new Date(row.window_start);
      return date >= now && date <= weekEnd;
    }).length;

    const atRisk = roadmap.filter((row) => String(row.status || '').toLowerCase().includes('риск')).length;
    const workload = workItems.length
      ? Math.round(workItems.reduce((sum, row) => sum + Number(row.progress_pct || 0), 0) / workItems.length)
      : 0;

    this.summary = {
      projects: roadmap.length,
      atRisk,
      dueWeek,
      workload
    };
  }
}
