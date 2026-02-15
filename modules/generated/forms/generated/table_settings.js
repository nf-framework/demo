import { html, css } from 'polylib';
import { PlForm } from '@nfjs/front-pl/components/pl-form.js';
import '@plcmp/pl-flex-layout';
import '@plcmp/pl-input';
import '@plcmp/pl-combobox';
import '@plcmp/pl-icon-button';
import '/generated/components/pl-table-pro.js';

const SETTINGS_ENV_OPTIONS = [
  { value: '', text: 'Все среды' },
  { value: 'prod', text: 'prod' },
  { value: 'stage', text: 'stage' },
  { value: 'dev', text: 'dev' }
];

const SETTINGS_STATUS_OPTIONS = [
  { value: '', text: 'Все статусы' },
  { value: 'В работе', text: 'В работе' },
  { value: 'Наблюдение', text: 'Наблюдение' },
  { value: 'Решен', text: 'Решен' },
  { value: 'Эскалация', text: 'Эскалация' }
];

export default class GeneratedTableSettings extends PlForm {
  static properties = {
    formTitle: {
      type: String,
      value: 'Generated: pl-table / Settings'
    },
    pr: { value: () => ({}) },
    data: { value: () => [] },
    selected: { value: () => null },
    fltIncident: { type: String, value: '' },
    fltService: { type: String, value: '' },
    fltOwnerName: { type: String, value: '' },
    fltEnvironment: { type: String, value: '' },
    fltStatus: { type: String, value: '' },
    environmentOptions: { type: Array, value: () => SETTINGS_ENV_OPTIONS },
    statusOptions: { type: Array, value: () => SETTINGS_STATUS_OPTIONS },
    groupRowTemplate: {
      type: Object,
      value: () => ((group) => {
        const rows = Array.isArray(group.rows) ? group.rows : [];
        const p1 = rows.filter((row) => String(row.severity || '').toUpperCase() === 'P1').length;
        const inWork = rows.filter((row) => String(row.status || '').toLowerCase().includes('работ')).length;
        const totalFactHours = rows.reduce((sum, row) => sum + Number(row.fact_hours || 0), 0);
        const totalPlanHours = rows.reduce((sum, row) => sum + Number(row.plan_hours || 0), 0);
        const tone = p1 > 0 ? 'bad' : (inWork > 1 ? 'warn' : 'ok');

        return `
          <div class="group-template">
            <div class="group-template-main">
              <span class="group-field">${group.escape(group.groupField || 'Группа')}</span>
              <span class="group-key">${group.escape(group.groupKey || 'Без значения')}</span>
            </div>
            <div class="group-template-meta">
              <span class="group-template-pill ${tone}">P1: ${p1}</span>
              <span class="group-template-pill warn">В работе: ${inWork}</span>
              <span class="group-template-pill ok">Итого факт, ч: ${totalFactHours.toFixed(1)}</span>
              <span class="group-template-pill">Итого план, ч: ${totalPlanHours.toFixed(1)}</span>
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
      <pl-table-pro
        id="tblSettings"
        data="{{data}}"
        selected="{{selected}}"
        group-row-template="[[groupRowTemplate]]"
        settings-key="generated.table_pro.table_settings">
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
          <pl-icon-button variant="ghost" iconset="pl-default" icon="search" on-click="[[onSearchClick]]"></pl-icon-button>
          <pl-icon-button variant="ghost" iconset="pl-default" icon="close-s" on-click="[[onClearClick]]"></pl-icon-button>
        </pl-flex-layout>
        <pl-table-pro-column id="incident_id" field="incident_id" header="Инцидент" width="140">
          <template is="filter">
            <pl-input stretch value="{{fltIncident}}" placeholder="Инцидент"></pl-input>
          </template>
        </pl-table-pro-column>
        <pl-table-pro-column id="created_at" field="created_at" header="Создан" kind="date" format="DD.MM.YYYY HH:mm" width="160"></pl-table-pro-column>
        <pl-table-pro-column id="service" field="service" header="Сервис" width="160">
          <template is="filter">
            <pl-input stretch value="{{fltService}}" placeholder="Сервис"></pl-input>
          </template>
        </pl-table-pro-column>
        <pl-table-pro-column id="environment" field="environment" header="Среда" width="95" cell-align="center">
          <template is="filter">
            <pl-combobox
              stretch
              value="{{fltEnvironment}}"
              data="[[environmentOptions]]"
              text-property="text"
              value-property="value"></pl-combobox>
          </template>
        </pl-table-pro-column>
        <pl-table-pro-column id="severity" field="severity" header="Серьезность" width="110" cell-align="center"></pl-table-pro-column>
        <pl-table-pro-column id="status" field="status" header="Статус" width="130" cell-align="center">
          <template is="filter">
            <pl-combobox
              stretch
              value="{{fltStatus}}"
              data="[[statusOptions]]"
              text-property="text"
              value-property="value"></pl-combobox>
          </template>
        </pl-table-pro-column>
        <pl-table-pro-column id="region" field="region" header="Регион" width="120"></pl-table-pro-column>
        <pl-table-pro-column id="channel" field="channel" header="Канал" width="120"></pl-table-pro-column>
        <pl-table-pro-column id="category" field="category" header="Категория" width="160"></pl-table-pro-column>
        <pl-table-pro-column id="summary" field="summary" header="Описание" width="260"></pl-table-pro-column>
        <pl-table-pro-column id="updated_at" field="updated_at" header="Обновлен" kind="date" format="DD.MM.YYYY HH:mm" width="160"></pl-table-pro-column>
        <pl-table-pro-column id="team_group" header="Команда">
          <pl-table-pro-column id="owner_name" field="owner_name" header="Ответственный" width="170">
            <template is="filter">
              <pl-input stretch value="{{fltOwnerName}}" placeholder="Ответственный"></pl-input>
            </template>
          </pl-table-pro-column>
          <pl-table-pro-column id="squad" field="squad" header="Подразделение" width="170"></pl-table-pro-column>
          <pl-table-pro-column id="owner_role" field="owner_role" header="Роль" width="120"></pl-table-pro-column>
        </pl-table-pro-column>
        <pl-table-pro-column id="sla_group" header="SLA, мин">
          <pl-table-pro-column id="sla_response_min" field="sla_response_min" header="Реакция" align="right" width="110"></pl-table-pro-column>
          <pl-table-pro-column id="sla_repair_min" field="sla_repair_min" header="Восстановление" align="right" width="140"></pl-table-pro-column>
          <pl-table-pro-column id="sla_risk" field="sla_risk" header="Риск" width="100"></pl-table-pro-column>
        </pl-table-pro-column>
        <pl-table-pro-column id="effort_group" header="Трудозатраты, ч">
          <pl-table-pro-column id="plan_hours" field="plan_hours" header="План" align="right" width="90"></pl-table-pro-column>
          <pl-table-pro-column id="fact_hours" field="fact_hours" header="Факт" align="right" width="90"></pl-table-pro-column>
          <pl-table-pro-column id="variance_hours" field="variance_hours" header="Отклонение" align="right" width="110"></pl-table-pro-column>
        </pl-table-pro-column>
      </pl-table-pro>
    </pl-flex-layout>
    <pl-access id="acPrivs" data="{{pr}}"></pl-access>
    <pl-dataset
      partial-data
      id="dsTableSettings"
      data="{{data}}"
      args="[[_compose('incident_id;service;owner_name;environment;status', fltIncident, fltService, fltOwnerName, fltEnvironment, fltStatus)]]"></pl-dataset>
  `;

  onConnect() {
    this.$.dsTableSettings.execute(this._datasetArgs());
  }

  onSearchClick() {
    this.$.dsTableSettings.execute(this._datasetArgs());
  }

  onClearClick() {
    this.fltIncident = '';
    this.fltService = '';
    this.fltOwnerName = '';
    this.fltEnvironment = '';
    this.fltStatus = '';
    this.$.dsTableSettings.execute(this._datasetArgs());
  }

  _datasetArgs() {
    return {
      incident_id: this.fltIncident || '',
      service: this.fltService || '',
      owner_name: this.fltOwnerName || '',
      environment: this.fltEnvironment || '',
      status: this.fltStatus || ''
    };
  }

  serverEndpoints = {
    access: {
      acPrivs: {
        privs: ['generated.table_settings.add', 'generated.table_settings.upd', 'generated.table_settings.del']
      }
    },
    dataset: {
      dsTableSettings: {
        text: `
          select *
            from generated.v4table_settings t
           where (coalesce(:incident_id::text, '') = '' or t.incident_id ilike ('%' || :incident_id::text || '%'))
             and (coalesce(:service::text, '') = '' or t.service ilike ('%' || :service::text || '%'))
             and (coalesce(:owner_name::text, '') = '' or t.owner_name ilike ('%' || :owner_name::text || '%'))
             and (coalesce(:environment::text, '') = '' or t.environment = :environment::text)
             and (coalesce(:status::text, '') = '' or t.status = :status::text)
        `
      }
    }
  }//serverEndpoints
}
