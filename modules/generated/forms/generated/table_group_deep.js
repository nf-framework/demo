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
  { value: 'Под наблюдением', text: 'Под наблюдением' },
  { value: 'Риск', text: 'Риск' }
];

export default class GeneratedTableGroupDeep extends PlForm {
  static properties = {
    formTitle: {
      type: String,
      value: 'Generated: pl-table / Deep Groups'
    },
    pr: { value: () => ({}) },
    data: { value: () => [] },
    selected: { value: () => null },
    fltSearch: { type: String, value: '' },
    fltStatus: { type: String, value: '' },
    statusOptions: { type: Array, value: () => STATUS_OPTIONS }
  };

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
        id="tblDeep"
        data="{{data}}"
        selected="{{selected}}"
        settings-key="generated.table_pro.table_group_deep.v2">
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
          <pl-input label="Поиск" value="{{fltSearch}}" placeholder="Сервис или ответственный"></pl-input>
          <pl-combobox
            label="Статус"
            value="{{fltStatus}}"
            data="[[statusOptions]]"
            text-property="text"
            value-property="value"></pl-combobox>
          <pl-icon-button variant="ghost" iconset="pl-default" icon="search" on-click="[[onSearchClick]]"></pl-icon-button>
          <pl-icon-button variant="ghost" iconset="pl-default" icon="close-s" on-click="[[onClearClick]]"></pl-icon-button>
        </pl-flex-layout>
        <pl-table-pro-column id="service" field="service" header="Сервис" width="170"></pl-table-pro-column>
        <pl-table-pro-column id="owner" field="owner" header="Ответственный" width="170"></pl-table-pro-column>
        <pl-table-pro-column id="finance_2026" header="Финансы 2026, ч">
          <pl-table-pro-column id="q1" header="Q1">
            <pl-table-pro-column id="jan" header="Январь">
              <pl-table-pro-column id="jan_plan" field="jan_plan" header="План" align="right" width="95"></pl-table-pro-column>
              <pl-table-pro-column id="jan_fact" field="jan_fact" header="Факт" align="right" width="95"></pl-table-pro-column>
            </pl-table-pro-column>
            <pl-table-pro-column id="feb" header="Февраль">
              <pl-table-pro-column id="feb_plan" field="feb_plan" header="План" align="right" width="95"></pl-table-pro-column>
              <pl-table-pro-column id="feb_fact" field="feb_fact" header="Факт" align="right" width="95"></pl-table-pro-column>
            </pl-table-pro-column>
          </pl-table-pro-column>
          <pl-table-pro-column id="q2" header="Q2">
            <pl-table-pro-column id="apr" header="Апрель">
              <pl-table-pro-column id="apr_plan" field="apr_plan" header="План" align="right" width="95"></pl-table-pro-column>
              <pl-table-pro-column id="apr_fact" field="apr_fact" header="Факт" align="right" width="95"></pl-table-pro-column>
            </pl-table-pro-column>
            <pl-table-pro-column id="may" header="Май">
              <pl-table-pro-column id="may_plan" field="may_plan" header="План" align="right" width="95"></pl-table-pro-column>
              <pl-table-pro-column id="may_fact" field="may_fact" header="Факт" align="right" width="95"></pl-table-pro-column>
            </pl-table-pro-column>
          </pl-table-pro-column>
        </pl-table-pro-column>
        <pl-table-pro-column id="stability" header="Надежность">
          <pl-table-pro-column id="incidents" header="Инциденты">
            <pl-table-pro-column id="inc_open" field="inc_open" header="Открыто" align="right" width="95"></pl-table-pro-column>
            <pl-table-pro-column id="inc_closed" field="inc_closed" header="Закрыто" align="right" width="95"></pl-table-pro-column>
          </pl-table-pro-column>
          <pl-table-pro-column id="sla" header="SLA">
            <pl-table-pro-column id="sla_hit_pct" field="sla_hit_pct" header="В срок, %" align="right" width="95"></pl-table-pro-column>
          </pl-table-pro-column>
        </pl-table-pro-column>
        <pl-table-pro-column id="status" field="status" header="Статус" width="120"></pl-table-pro-column>
      </pl-table-pro>
    </pl-flex-layout>
    <pl-access id="acPrivs" data="{{pr}}"></pl-access>
    <pl-dataset
      partial-data
      id="dsDeep"
      data="{{data}}"
      args="[[_compose('search;status;environment', fltSearch, fltStatus, '')]]"></pl-dataset>
  `;

  onConnect() {
    this.$.dsDeep.execute(this._datasetArgs());
  }

  onSearchClick() {
    this.$.dsDeep.execute(this._datasetArgs());
  }

  onClearClick() {
    this.fltSearch = '';
    this.fltStatus = '';
    this.$.dsDeep.execute(this._datasetArgs());
  }

  _datasetArgs() {
    return {
      search: this.fltSearch || '',
      status: this.fltStatus || '',
      environment: ''
    };
  }

  serverEndpoints = {
    access: {
      acPrivs: {
        privs: ['generated.table_deep_groups.add', 'generated.table_deep_groups.upd', 'generated.table_deep_groups.del']
      }
    },
    dataset: {
      dsDeep: {
        text: `
          select *
            from generated.v4table_deep_groups t
           where (coalesce(:status::text, '') = '' or t.status = :status::text)
             and (
               coalesce(:search::text, '') = ''
               or t.service ilike ('%' || :search::text || '%')
               or t.owner ilike ('%' || :search::text || '%')
             )
        `
      }
    }
  }//serverEndpoints
}
