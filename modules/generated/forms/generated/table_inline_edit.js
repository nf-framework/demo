import { html, css } from 'polylib';
import { PlForm } from '@nfjs/front-pl/components/pl-form.js';
import '@plcmp/pl-flex-layout';
import '@plcmp/pl-badge';
import '@plcmp/pl-input';
import '@plcmp/pl-combobox';
import '@plcmp/pl-checkbox';
import '@plcmp/pl-icon-button';
import '/generated/components/pl-table-pro.js';
import '/pl-time/components/pl-time.js';

const PEOPLE = [
  'Иван Петров',
  'Анна Смирнова',
  'Дмитрий Кузнецов',
  'Ольга Иванова',
  'Сергей Волков',
  'Мария Федорова',
  'Павел Егоров',
  'Екатерина Орлова'
];

const TEAMS = [
  'Платформа',
  'Клиентские приложения',
  'Платформа данных',
  'DevOps',
  'QA'
];

const PRIORITIES = ['P1', 'P2', 'P3'];
const STATUSES = ['Активно', 'В работе', 'На контроле', 'Готово'];
const CALL_TIMES = ['09:00', '09:30', '10:00', '11:30', '13:00', '15:30', '17:00'];

function comboOptions(values) {
  return values.map((item) => ({ value: item, text: item }));
}

export default class GeneratedTableInlineEdit extends PlForm {
  static properties = {
    formTitle: {
      type: String,
      value: 'Generated: pl-table / Inline Edit'
    },
    assigneeOptions: {
      type: Array,
      value: () => comboOptions(PEOPLE)
    },
    teamOptions: {
      type: Array,
      value: () => comboOptions(TEAMS)
    },
    priorityOptions: {
      type: Array,
      value: () => comboOptions(PRIORITIES)
    },
    statusOptions: {
      type: Array,
      value: () => comboOptions(STATUSES)
    },
    pr: { value: () => ({}) },
    data: { type: Array, value: () => [] },
    selected: { value: () => null },
    fltSearch: { type: String, value: '' },
    fltAssignee: { type: String, value: '' },
    fltStatus: { type: String, value: '' }
  };

  constructor() {
    super();
    this._boundOnCellSave = this._onCellSave.bind(this);
  }

  static css = css`
    :host {
      display: block;
      height: 100%;
    }

    pl-table-pro {
      width: 100%;
      height: 100%;
      min-height: 0;
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
  `;

  static template = html`
    <pl-flex-layout vertical fit>
      <pl-table-pro
        id="tblInline"
        data="{{data}}"
        selected="{{selected}}"
        inline-edit
        settings-key="generated.table_pro.table_inline_edit">
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
        <pl-flex-layout slot="top-toolbar" wrap gap="8">
          <pl-input label="Поиск" value="{{fltSearch}}" placeholder="Тикет или задача"></pl-input>
          <pl-combobox
            label="Исполнитель"
            value="{{fltAssignee}}"
            data="[[assigneeOptions]]"
            text-property="text"
            value-property="value"></pl-combobox>
          <pl-combobox
            label="Статус"
            value="{{fltStatus}}"
            data="[[statusOptions]]"
            text-property="text"
            value-property="value"></pl-combobox>
          <pl-icon-button variant="ghost" iconset="pl-default" icon="search" on-click="[[onSearchClick]]"></pl-icon-button>
          <pl-icon-button variant="ghost" iconset="pl-default" icon="close-s" on-click="[[onClearClick]]"></pl-icon-button>
          <pl-badge>Двойной клик по ячейке для редактирования</pl-badge>
          <pl-badge>Enter или ✓ сохранить</pl-badge>
          <pl-badge>Esc или × отменить</pl-badge>
        </pl-flex-layout>
        <pl-table-pro-column id="ticket" field="ticket" header="Тикет" width="110"></pl-table-pro-column>
        <pl-table-pro-column id="title" field="title" header="Задача" width="260">
          <template is="inline">
            <pl-input data-inline-input stretch placeholder="Название задачи"></pl-input>
          </template>
        </pl-table-pro-column>
        <pl-table-pro-column id="assignee" field="assignee" header="Исполнитель" width="180">
          <template is="inline">
            <pl-combobox
              data-inline-input
              stretch
              data="[[assigneeOptions]]"
              text-property="text"
              value-property="value"></pl-combobox>
          </template>
        </pl-table-pro-column>
        <pl-table-pro-column id="team" field="team" header="Команда" width="150">
          <template is="inline">
            <pl-combobox
              data-inline-input
              stretch
              data="[[teamOptions]]"
              text-property="text"
              value-property="value"></pl-combobox>
          </template>
        </pl-table-pro-column>
        <pl-table-pro-column id="priority" field="priority" header="Приоритет" width="115">
          <template is="inline">
            <pl-combobox
              data-inline-input
              stretch
              data="[[priorityOptions]]"
              text-property="text"
              value-property="value"></pl-combobox>
          </template>
        </pl-table-pro-column>
        <pl-table-pro-column id="status" field="status" header="Статус" width="130">
          <template is="inline">
            <pl-combobox
              data-inline-input
              stretch
              data="[[statusOptions]]"
              text-property="text"
              value-property="value"></pl-combobox>
          </template>
        </pl-table-pro-column>
        <pl-table-pro-column id="start_at" field="start_at" header="Старт" kind="date" format="DD.MM.YYYY HH:mm" width="170">
          <template is="inline">
            <pl-datetime data-inline-input stretch type="datetime"></pl-datetime>
          </template>
        </pl-table-pro-column>
        <pl-table-pro-column id="due_date" field="due_date" header="Дедлайн" kind="date" width="130">
          <template is="inline">
            <pl-datetime data-inline-input stretch type="date"></pl-datetime>
          </template>
        </pl-table-pro-column>
        <pl-table-pro-column id="meeting_time" field="meeting_time" header="Созвон" width="120">
          <template is="inline">
            <pl-time data-inline-input stretch step="15" placeholder="HH:MM"></pl-time>
          </template>
        </pl-table-pro-column>
        <pl-table-pro-column id="estimate_hours" field="estimate_hours" header="Оценка, ч" align="right" width="110">
          <template is="inline">
            <pl-input data-inline-input stretch type="number"></pl-input>
          </template>
        </pl-table-pro-column>
        <pl-table-pro-column id="progress_pct" field="progress_pct" header="Прогресс, %" align="right" width="120">
          <template is="inline">
            <pl-input data-inline-input stretch type="number"></pl-input>
          </template>
        </pl-table-pro-column>
        <pl-table-pro-column id="remote" field="remote" header="Удалено" width="120" cell-align="center">
          <template>
            <pl-checkbox checked$="[[_checkboxToken(model.row.remote)]]" readonly></pl-checkbox>
          </template>
          <template is="inline">
            <pl-checkbox data-inline-input></pl-checkbox>
          </template>
        </pl-table-pro-column>
        <pl-table-pro-column id="notes" field="notes" header="Комментарий" width="280">
          <template is="inline">
            <pl-textarea data-inline-input stretch placeholder="Комментарий к задаче"></pl-textarea>
          </template>
        </pl-table-pro-column>
      </pl-table-pro>
    </pl-flex-layout>
    <pl-access id="acPrivs" data="{{pr}}"></pl-access>
    <pl-dataset
      partial-data
      id="dsInline"
      data="{{data}}"
      args="[[_compose('search;assignee;status;environment', fltSearch, fltAssignee, fltStatus, '')]]"></pl-dataset>
    <pl-action id="aSaveInline"></pl-action>
  `;

  onConnect() {
    this.$.tblInline?.addEventListener('tableCellSave', this._boundOnCellSave);
    this.$.dsInline.execute(this._datasetArgs());
  }

  onSearchClick() {
    this.$.dsInline.execute(this._datasetArgs());
  }

  onClearClick() {
    this.fltSearch = '';
    this.fltAssignee = '';
    this.fltStatus = '';
    this.$.dsInline.execute(this._datasetArgs());
  }

  disconnectedCallback() {
    this.$.tblInline?.removeEventListener('tableCellSave', this._boundOnCellSave);
    super.disconnectedCallback();
  }

  async _onCellSave(event) {
    const row = event.detail?.row;
    if (!row?.id) return;
    await this.$.aSaveInline.execute(row);
  }

  _datasetArgs() {
    return {
      search: this.fltSearch || '',
      assignee: this.fltAssignee || '',
      status: this.fltStatus || '',
      environment: ''
    };
  }

  _checkboxToken(value) {
    if (value === true || value === false) return value ? true : false;
    if (typeof value === 'number') return value !== 0 ? true : false;
    const normalized = String(value ?? '').trim().toLowerCase();
    if (['1', 'true', 't', 'yes', 'y', 'on', 'да'].includes(normalized)) return true;
    return false;
  }

  serverEndpoints = {
    access: {
      acPrivs: {
        privs: ['generated.table_inline_edit.add', 'generated.table_inline_edit.upd', 'generated.table_inline_edit.del']
      }
    },
    dataset: {
      dsInline: {
        text: `
          select *
            from generated.v4table_inline_edit t
           where (coalesce(:assignee::text, '') = '' or t.assignee = :assignee::text)
             and (coalesce(:status::text, '') = '' or t.status = :status::text)
             and (
               coalesce(:search::text, '') = ''
               or t.ticket ilike ('%' || :search::text || '%')
               or t.title ilike ('%' || :search::text || '%')
             )
        `
      }
    },
    action: {
      aSaveInline: {
        '@main': {
          action: 'generated.table_inline_edit.upd',
          type: 'broker'
        }
      }
    }
  }//serverEndpoints
}
