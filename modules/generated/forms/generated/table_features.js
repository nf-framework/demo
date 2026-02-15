import { html, css } from 'polylib';
import { PlForm } from '@nfjs/front-pl/components/pl-form.js';
import '@plcmp/pl-flex-layout';
import '@plcmp/pl-badge';
import '@plcmp/pl-input';
import '@plcmp/pl-combobox';
import '@plcmp/pl-icon-button';
import '/generated/components/pl-table-pro.js';

const ENV_OPTIONS = [
  { value: '', text: 'Все среды' },
  { value: 'prod', text: 'prod' },
  { value: 'stage', text: 'stage' },
  { value: 'dev', text: 'dev' }
];

const STATUS_OPTIONS = [
  { value: '', text: 'Все статусы' },
  { value: 'В работе', text: 'В работе' },
  { value: 'Наблюдение', text: 'Наблюдение' },
  { value: 'Решен', text: 'Решен' },
  { value: 'Эскалация', text: 'Эскалация' }
];

export default class GeneratedTableFeatures extends PlForm {
  static properties = {
    formTitle: {
      type: String,
      value: 'Generated: pl-table / Features'
    },
    pr: { value: () => ({}) },
    data: { type: Array, value: () => [] },
    selected: { value: () => null },
    fltSearch: { type: String, value: '' },
    fltEnvironment: { type: String, value: '' },
    fltStatus: { type: String, value: '' },
    environmentOptions: { type: Array, value: () => ENV_OPTIONS },
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
        id="tblFeatures"
        data="{{data}}"
        selected="{{selected}}"
        settings-key="generated.table_pro.table_features">
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
          <pl-input label="Поиск" value="{{fltSearch}}" placeholder="Инцидент, сервис, ответственный"></pl-input>
          <pl-combobox
            label="Среда"
            value="{{fltEnvironment}}"
            data="[[environmentOptions]]"
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
          <pl-badge>Fixed: слева и справа</pl-badge>
          <pl-badge>Sort: клик по стрелкам в заголовке</pl-badge>
          <pl-badge>Resize: тянуть правый край заголовка</pl-badge>
          <pl-badge>Footer: итоги внизу</pl-badge>
        </pl-flex-layout>

        <pl-table-pro-column id="incident_id" field="incident_id" header="Инцидент" width="160" fixed="left" sortable resizable footer="ИТОГО"></pl-table-pro-column>
        <pl-table-pro-column id="service" field="service" header="Сервис" width="170" fixed="left" sortable resizable></pl-table-pro-column>
        <pl-table-pro-column id="environment" field="environment" header="Среда" width="105" cell-align="center" sortable resizable></pl-table-pro-column>
        <pl-table-pro-column id="severity" field="severity" header="Критичность" width="120" cell-align="center" sortable resizable sort="asc"></pl-table-pro-column>
        <pl-table-pro-column id="status" field="status" header="Статус" width="140" cell-align="center" cell-valign="middle" sortable resizable></pl-table-pro-column>
        <pl-table-pro-column id="owner_name" field="owner_name" header="Ответственный" width="170" sortable resizable></pl-table-pro-column>
        <pl-table-pro-column id="squad" field="squad" header="Подразделение" width="170" sortable resizable></pl-table-pro-column>
        <pl-table-pro-column id="plan_hours" field="plan_hours" header="План, ч" align="right" width="105" sortable resizable>
          <template is="footer">[[footNumericValue(summary.plan_hours)]]</template>
        </pl-table-pro-column>
        <pl-table-pro-column id="fact_hours" field="fact_hours" header="Факт, ч" align="right" width="105" sortable resizable>
          <template is="footer">[[footNumericValue(summary.fact_hours)]]</template>
        </pl-table-pro-column>
        <pl-table-pro-column id="variance_hours" field="variance_hours" header="Отклонение, ч" align="right" width="130" sortable resizable>
          <template is="footer">[[footNumericValue(summary.variance_hours)]]</template>
        </pl-table-pro-column>
        <pl-table-pro-column id="sla_response_min" field="sla_response_min" header="SLA реакция, мин" align="right" width="140" sortable resizable>
          <template is="footer">[[footNumericValue(summary.sla_response_min)]]</template>
        </pl-table-pro-column>
        <pl-table-pro-column id="sla_repair_min" field="sla_repair_min" header="SLA ремонт, мин" align="right" width="145" sortable resizable>
          <template is="footer">[[footNumericValue(summary.sla_repair_min)]]</template>
        </pl-table-pro-column>
        <pl-table-pro-column id="created_at" field="created_at" header="Создан" kind="date" format="DD.MM.YYYY HH:mm" width="170" sortable resizable></pl-table-pro-column>
        <pl-table-pro-column id="updated_at" field="updated_at" header="Обновлен" kind="date" format="DD.MM.YYYY HH:mm" width="170" sortable resizable></pl-table-pro-column>

        <pl-table-pro-column id="actions" header="" width="56" action fixed="right">
          <pl-icon-button slot="header" variant="link" iconset="pl-default" icon="settings-2"></pl-icon-button>
          <template>
            <pl-icon-button variant="link" iconset="pl-default" icon="more-horizontal"></pl-icon-button>
          </template>
        </pl-table-pro-column>
      </pl-table-pro>
    </pl-flex-layout>
    <pl-access id="acPrivs" data="{{pr}}"></pl-access>
    <pl-dataset
      partial-data
      id="dsFeatures"
      data="{{data}}"
      args="[[_compose('search;environment;status', fltSearch, fltEnvironment, fltStatus)]]"></pl-dataset>
  `;

  onConnect() {
    this.$.dsFeatures.execute(this._datasetArgs());
  }

  onSearchClick() {
    this.$.dsFeatures.execute(this._datasetArgs());
  }

  onClearClick() {
    this.fltSearch = '';
    this.fltEnvironment = '';
    this.fltStatus = '';
    this.$.dsFeatures.execute(this._datasetArgs());
  }

  _datasetArgs() {
    return {
      search: this.fltSearch || '',
      environment: this.fltEnvironment || '',
      status: this.fltStatus || ''
    };
  }

  footNumericValue(value) {
    const n = Number(value);
    if (!Number.isFinite(n)) return '0';
    return n.toLocaleString('ru-RU', { maximumFractionDigits: 2 });
  }

  serverEndpoints = {
    access: {
      acPrivs: {
        privs: ['generated.table_settings.add', 'generated.table_settings.upd', 'generated.table_settings.del']
      }
    },
    dataset: {
      dsFeatures: {
        text: `
          select *
            from generated.v4table_settings t
           where (coalesce(:environment::text, '') = '' or t.environment = :environment::text)
             and (coalesce(:status::text, '') = '' or t.status = :status::text)
             and (
               coalesce(:search::text, '') = ''
               or t.incident_id ilike ('%' || :search::text || '%')
               or t.service ilike ('%' || :search::text || '%')
               or t.owner_name ilike ('%' || :search::text || '%')
             )
        `
      }
    }
  }//serverEndpoints
}
