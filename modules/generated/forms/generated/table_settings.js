import { html, css } from 'polylib';
import { PlForm } from '@nfjs/front-pl/components/pl-form.js';
import '@plcmp/pl-flex-layout';
import '/generated/components/pl-table-pro.js';

export default class GeneratedTableSettings extends PlForm {
  static properties = {
    formTitle: {
      type: String,
      value: 'Generated: pl-table / Settings'
    },
    columns: {
      type: Array,
      value: () => ([
        { id: 'incident_id', field: 'incident_id', header: 'Инцидент', width: 140 },
        { id: 'created_at', field: 'created_at', header: 'Создан', kind: 'date', format: 'DD.MM.YYYY HH:mm', width: 160 },
        { id: 'service', field: 'service', header: 'Сервис', width: 160 },
        { id: 'environment', field: 'environment', header: 'Среда', width: 95 },
        { id: 'severity', field: 'severity', header: 'Серьезность', width: 110 },
        { id: 'status', field: 'status', header: 'Статус', width: 130 },
        { id: 'region', field: 'region', header: 'Регион', width: 120 },
        { id: 'channel', field: 'channel', header: 'Канал', width: 120 },
        { id: 'category', field: 'category', header: 'Категория', width: 160 },
        { id: 'summary', field: 'summary', header: 'Описание', width: 260 },
        { id: 'updated_at', field: 'updated_at', header: 'Обновлен', kind: 'date', format: 'DD.MM.YYYY HH:mm', width: 160 },
        {
          id: 'team_group',
          header: 'Команда',
          children: [
            { id: 'owner_name', field: 'owner_name', header: 'Ответственный', width: 170 },
            { id: 'squad', field: 'squad', header: 'Подразделение', width: 170 },
            { id: 'owner_role', field: 'owner_role', header: 'Роль', width: 120 }
          ]
        },
        {
          id: 'sla_group',
          header: 'SLA, мин',
          children: [
            { id: 'sla_response_min', field: 'sla_response_min', header: 'Реакция', align: 'right', width: 110 },
            { id: 'sla_repair_min', field: 'sla_repair_min', header: 'Восстановление', align: 'right', width: 140 },
            { id: 'sla_risk', field: 'sla_risk', header: 'Риск', width: 100 }
          ]
        },
        {
          id: 'effort_group',
          header: 'Трудозатраты, ч',
          children: [
            { id: 'plan_hours', field: 'plan_hours', header: 'План', align: 'right', width: 90 },
            { id: 'fact_hours', field: 'fact_hours', header: 'Факт', align: 'right', width: 90 },
            { id: 'variance_hours', field: 'variance_hours', header: 'Отклонение', align: 'right', width: 110 }
          ]
        }
      ])
    },
    data: { value: () => [] },
    selected: { value: () => null },
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
    }
  `;

  static template = html`
    <pl-flex-layout vertical fit>
      <pl-table-pro
        id="tblSettings"
        data="{{data}}"
        selected="{{selected}}"
        columns="[[columns]]"
        group-row-template="[[groupRowTemplate]]"
        settings-key="generated.table_pro.table_settings"></pl-table-pro>
      <pl-dataset id="dsTableSettings" endpoint="/generated/table/settings" data="{{data}}"></pl-dataset>
    </pl-flex-layout>
  `;

  onConnect() {
    this.$.dsTableSettings.execute();
  }
}
