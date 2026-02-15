import { html, css } from 'polylib';
import { PlForm } from '@nfjs/front-pl/components/pl-form.js';
import '@plcmp/pl-flex-layout';
import '@plcmp/pl-input';
import '@plcmp/pl-combobox';
import '@plcmp/pl-icon-button';
import '/generated/components/pl-table-pro.js';

const PORTFOLIO_OPTIONS = [
  { value: '', text: 'Все портфели' },
  { value: 'Core Platform', text: 'Core Platform' },
  { value: 'Client Apps', text: 'Client Apps' },
  { value: 'Platform Data', text: 'Platform Data' }
];

const STAGE_OPTIONS = [
  { value: '', text: 'Все этапы' },
  { value: 'Discovery', text: 'Discovery' },
  { value: 'MVP', text: 'MVP' },
  { value: 'Development', text: 'Development' },
  { value: 'Stabilization', text: 'Stabilization' }
];

export default class GeneratedTableSpan extends PlForm {
  static properties = {
    formTitle: {
      type: String,
      value: 'Generated: pl-table / Span'
    },
    pr: { value: () => ({}) },
    data: { value: () => [] },
    selected: { value: () => null },
    fltSearch: { type: String, value: '' },
    fltPortfolio: { type: String, value: '' },
    fltStage: { type: String, value: '' },
    portfolioOptions: { type: Array, value: () => PORTFOLIO_OPTIONS },
    stageOptions: { type: Array, value: () => STAGE_OPTIONS },
    groupRowTemplate: {
      type: Object,
      value: () => ((group) => {
        const rows = Array.isArray(group.rows) ? group.rows : [];
        const annual = rows.reduce((sum, row) => sum + Number(row.annual_plan_k || 0), 0);
        const q1Total = rows.reduce((sum, row) => {
          return sum + Number(row.jan_k || 0) + Number(row.feb_k || 0) + Number(row.mar_k || 0);
        }, 0);
        const q2Total = rows.reduce((sum, row) => {
          return sum + Number(row.apr_k || 0) + Number(row.may_k || 0) + Number(row.jun_k || 0);
        }, 0);

        return `
          <div class="group-template">
            <div class="group-template-main">
              <span class="group-field">${group.escape(group.groupField || 'Группа')}</span>
              <span class="group-key">${group.escape(group.groupKey || 'Без значения')}</span>
            </div>
            <div class="group-template-meta">
              <span class="group-template-pill ok">План, ч: ${annual}</span>
              <span class="group-template-pill info">Q1, ч: ${q1Total}</span>
              <span class="group-template-pill warn">Q2, ч: ${q2Total}</span>
            </div>
          </div>
        `;
      })
    }
  };

  static css = css`
    :host {
      display: block;
      height: 100%;
    }

    pl-table-pro {
      width: 100%;
      height: 100%;
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
      <pl-table-pro         id="tblSpan"          data="{{data}}"         selected="{{selected}}"         group-row-template="[[groupRowTemplate]]"         settings-key="generated.table_pro.table_span.v2">
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
          <pl-input label="Поиск" value="{{fltSearch}}" placeholder="Проект, код, заказчик"></pl-input>
          <pl-combobox
            label="Портфель"
            value="{{fltPortfolio}}"
            data="[[portfolioOptions]]"
            text-property="text"
            value-property="value"></pl-combobox>
          <pl-combobox
            label="Этап"
            value="{{fltStage}}"
            data="[[stageOptions]]"
            text-property="text"
            value-property="value"></pl-combobox>
          <pl-icon-button variant="ghost" iconset="pl-default" icon="search" on-click="[[onSearchClick]]"></pl-icon-button>
          <pl-icon-button variant="ghost" iconset="pl-default" icon="close-s" on-click="[[onClearClick]]"></pl-icon-button>
        </pl-flex-layout>
        <pl-table-pro-column id="portfolio" field="portfolio" header="Портфель" width="170" merge></pl-table-pro-column>
        <pl-table-pro-column id="project_code" field="project_code" header="Код проекта" width="120"></pl-table-pro-column>
        <pl-table-pro-column id="project_name" field="project_name" header="Проект" width="230"></pl-table-pro-column>
        <pl-table-pro-column id="customer" field="customer" header="Заказчик" width="110" ></pl-table-pro-column>
        <pl-table-pro-column id="project_manager" field="project_manager" header="Менеджер" width="170"></pl-table-pro-column>
        <pl-table-pro-column id="stage" field="stage" header="Этап" width="120"></pl-table-pro-column>
        <pl-table-pro-column id="priority" field="priority" header="Приоритет" width="115"></pl-table-pro-column>
        <pl-table-pro-column id="annual_plan_k" field="annual_plan_k" header="Год, ч" width="95" align="right"></pl-table-pro-column>
        <pl-table-pro-column id="q1_group" header="Q1: Янв-Мар">
          <pl-table-pro-column id="jan_k" field="jan_k" header="Янв" width="85" align="right"></pl-table-pro-column>
          <pl-table-pro-column id="feb_k" field="feb_k" header="Фев" width="85" align="right"></pl-table-pro-column>
          <pl-table-pro-column id="mar_k" field="mar_k" header="Мар" width="85" align="right"></pl-table-pro-column>
        </pl-table-pro-column>
        <pl-table-pro-column id="q2_group" header="Q2: Апр-Июн">
          <pl-table-pro-column id="apr_k" field="apr_k" header="Апр" width="85" align="right"></pl-table-pro-column>
          <pl-table-pro-column id="may_k" field="may_k" header="Май" width="85" align="right"></pl-table-pro-column>
          <pl-table-pro-column id="jun_k" field="jun_k" header="Июн" width="85" align="right"></pl-table-pro-column>
        </pl-table-pro-column>
        <pl-table-pro-column id="q3_group" header="Q3: Июл-Сен">
          <pl-table-pro-column id="jul_k" field="jul_k" header="Июл" width="85" align="right"></pl-table-pro-column>
          <pl-table-pro-column id="aug_k" field="aug_k" header="Авг" width="85" align="right"></pl-table-pro-column>
          <pl-table-pro-column id="sep_k" field="sep_k" header="Сен" width="85" align="right"></pl-table-pro-column>
        </pl-table-pro-column>
        <pl-table-pro-column id="q4_group" header="Q4: Окт-Дек">
          <pl-table-pro-column id="oct_k" field="oct_k" header="Окт" width="85" align="right"></pl-table-pro-column>
          <pl-table-pro-column id="nov_k" field="nov_k" header="Ноя" width="85" align="right"></pl-table-pro-column>
          <pl-table-pro-column id="dec_k" field="dec_k" header="Дек" width="85" align="right"></pl-table-pro-column>
        </pl-table-pro-column>
      </pl-table-pro>
    </pl-flex-layout>
    <pl-access id="acPrivs" data="{{pr}}"></pl-access>
    <pl-dataset
      partial-data
      id="dsTableSpan"
      data="{{data}}"
      args="[[_compose('search;portfolio;stage;environment;status', fltSearch, fltPortfolio, fltStage, '', '')]]"></pl-dataset>
  `;

  onConnect() {
    this.$.dsTableSpan.execute(this._datasetArgs());
  }

  onSearchClick() {
    this.$.dsTableSpan.execute(this._datasetArgs());
  }

  onClearClick() {
    this.fltSearch = '';
    this.fltPortfolio = '';
    this.fltStage = '';
    this.$.dsTableSpan.execute(this._datasetArgs());
  }

  _datasetArgs() {
    return {
      search: this.fltSearch || '',
      portfolio: this.fltPortfolio || '',
      stage: this.fltStage || '',
      environment: '',
      status: ''
    };
  }

  serverEndpoints = {
    access: {
      acPrivs: {
        privs: ['generated.table_span.add', 'generated.table_span.upd', 'generated.table_span.del']
      }
    },
    dataset: {
      dsTableSpan: {
        text: `
          select *
            from generated.v4table_span t
           where (coalesce(:portfolio::text, '') = '' or t.portfolio = :portfolio::text)
             and (coalesce(:stage::text, '') = '' or t.stage = :stage::text)
             and (
               coalesce(:search::text, '') = ''
               or t.project_code ilike ('%' || :search::text || '%')
               or t.project_name ilike ('%' || :search::text || '%')
               or t.customer ilike ('%' || :search::text || '%')
             )
        `
      }
    }
  }//serverEndpoints
}
