import { html, css } from 'polylib';
import { PlForm } from '@nfjs/front-pl/components/pl-form.js';
import '@plcmp/pl-flex-layout';
import '@plcmp/pl-input';
import '@plcmp/pl-combobox';
import '@plcmp/pl-icon-button';
import '/generated/components/pl-table-pro.js';

const STATUS_OPTIONS = [
  { value: '', text: 'Все статусы' },
  { value: 'Стабильно', text: 'Стабильно' },
  { value: 'На контроле', text: 'На контроле' },
  { value: 'Риск', text: 'Риск' }
];

const DIRECTION_OPTIONS = [
  { value: '', text: 'Все направления' },
  { value: 'Платформа', text: 'Платформа' },
  { value: 'Клиентские приложения', text: 'Клиентские приложения' },
  { value: 'Платформа данных', text: 'Платформа данных' },
  { value: 'DevOps', text: 'DevOps' },
  { value: 'QA', text: 'QA' }
];

export default class GeneratedTableMasterDetail extends PlForm {
  static properties = {
    formTitle: {
      type: String,
      value: 'Generated: pl-table / Master Detail'
    },
    detailFields: {
      type: Array,
      value: () => ([
        'team_name',
        'manager',
        'direction',
        'current_sprint',
        'next_milestone',
        'status'
      ])
    },
    pr: { value: () => ({}) },
    data: { value: () => [] },
    selected: { value: () => null },
    fltSearch: { type: String, value: '' },
    fltStatus: { type: String, value: '' },
    fltDirection: { type: String, value: '' },
    statusOptions: { type: Array, value: () => STATUS_OPTIONS },
    directionOptions: { type: Array, value: () => DIRECTION_OPTIONS }
  };

  constructor() {
    super();
    this._boundOnDetailSave = this._onDetailSave.bind(this);
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
        id="tblMasterDetail"
        data="{{data}}"
        selected="{{selected}}"
        detail-fields="[[detailFields]]"
        detail-variant="team"
        master-detail
        settings-key="generated.table_pro.table_master_detail">
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
        <pl-flex-layout slot="top-toolbar" wrap gap="8" align="flex-end">
          <pl-input label="Поиск" value="{{fltSearch}}" placeholder="Команда или руководитель"></pl-input>
          <pl-combobox
            label="Направление"
            value="{{fltDirection}}"
            data="[[directionOptions]]"
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
        </pl-flex-layout>
        <pl-table-pro-column id="team_id" field="team_id" header="ID" width="95"></pl-table-pro-column>
        <pl-table-pro-column id="team_name" field="team_name" header="Команда" width="180"></pl-table-pro-column>
        <pl-table-pro-column id="manager" field="manager" header="Руководитель" width="165"></pl-table-pro-column>
        <pl-table-pro-column id="direction" field="direction" header="Направление" width="135"></pl-table-pro-column>
        <pl-table-pro-column id="status" field="status" header="Статус" width="95" cell-align="center"></pl-table-pro-column>
        <pl-table-pro-column id="current_sprint" field="current_sprint" header="Спринт" width="95"></pl-table-pro-column>
        <pl-table-pro-column id="velocity" field="velocity" header="Velocity" align="right" width="95"></pl-table-pro-column>
        <pl-table-pro-column id="tech_debt_pct" field="tech_debt_pct" header="Техдолг, %" align="right" width="110"></pl-table-pro-column>
        <pl-table-pro-column id="vacation_load_pct" field="vacation_load_pct" header="Отпуска, %" align="right" width="110"></pl-table-pro-column>
        <pl-table-pro-column id="capacity_pct" field="capacity_pct" header="Capacity, %" align="right" width="105"></pl-table-pro-column>
        <pl-table-pro-column id="next_milestone" field="next_milestone" header="Майлстоун" width="125"></pl-table-pro-column>
        <pl-table-pro-column id="sprint_group" header="Спринт, шт">
          <pl-table-pro-column id="open_tasks" field="open_tasks" header="Открыто" align="right" width="95"></pl-table-pro-column>
          <pl-table-pro-column id="in_progress_tasks" field="in_progress_tasks" header="В работе" align="right" width="95"></pl-table-pro-column>
          <pl-table-pro-column id="done_tasks" field="done_tasks" header="Готово" align="right" width="95"></pl-table-pro-column>
        </pl-table-pro-column>
        <pl-table-pro-column id="reliability_group" header="Надежность">
          <pl-table-pro-column id="sla_violations" field="sla_violations" header="SLA" align="right" width="85"></pl-table-pro-column>
          <pl-table-pro-column id="incident_rate" field="incident_rate" header="Inc./нед" align="right" width="95"></pl-table-pro-column>
          <pl-table-pro-column id="oncall_count" field="oncall_count" header="On-call" align="right" width="95"></pl-table-pro-column>
        </pl-table-pro-column>
        <pl-table-pro-column id="delivery_group" header="Поставка">
          <pl-table-pro-column id="deploy_frequency" field="deploy_frequency" header="Deploy/нед" align="right" width="105"></pl-table-pro-column>
          <pl-table-pro-column id="cycle_time_days" field="cycle_time_days" header="Cycle, дн" align="right" width="95"></pl-table-pro-column>
          <pl-table-pro-column id="last_release" field="last_release" header="Last release" width="120"></pl-table-pro-column>
        </pl-table-pro-column>
      </pl-table-pro>
    </pl-flex-layout>
    <pl-access id="acPrivs" data="{{pr}}"></pl-access>
    <pl-dataset
      partial-data
      id="dsMaster"
      data="{{data}}"
      args="[[_compose('search;direction;status;environment', fltSearch, fltDirection, fltStatus, '')]]"></pl-dataset>
    <pl-action id="aSaveDetail"></pl-action>
  `;

  onConnect() {
    this.$.tblMasterDetail?.addEventListener('tableDetailSave', this._boundOnDetailSave);
    this.$.dsMaster.execute(this._datasetArgs());
  }

  onSearchClick() {
    this.$.dsMaster.execute(this._datasetArgs());
  }

  onClearClick() {
    this.fltSearch = '';
    this.fltDirection = '';
    this.fltStatus = '';
    this.$.dsMaster.execute(this._datasetArgs());
  }

  disconnectedCallback() {
    this.$.tblMasterDetail?.removeEventListener('tableDetailSave', this._boundOnDetailSave);
    super.disconnectedCallback();
  }

  async _onDetailSave(event) {
    const row = event.detail?.row;
    if (!row?.id) return;
    await this.$.aSaveDetail.execute(row);
  }

  _datasetArgs() {
    return {
      search: this.fltSearch || '',
      direction: this.fltDirection || '',
      status: this.fltStatus || '',
      environment: ''
    };
  }

  serverEndpoints = {
    access: {
      acPrivs: {
        privs: ['generated.table_master.add', 'generated.table_master.upd', 'generated.table_master.del']
      }
    },
    dataset: {
      dsMaster: {
        text: `
          select *
            from generated.v4table_master t
           where (coalesce(:direction::text, '') = '' or t.direction = :direction::text)
             and (coalesce(:status::text, '') = '' or t.status = :status::text)
             and (
               coalesce(:search::text, '') = ''
               or t.team_name ilike ('%' || :search::text || '%')
               or t.manager ilike ('%' || :search::text || '%')
               or t.team_id ilike ('%' || :search::text || '%')
             )
        `
      }
    },
    action: {
      aSaveDetail: {
        '@main': {
          action: 'generated.table_master.upd',
          type: 'broker'
        }
      }
    }
  }//serverEndpoints
}
