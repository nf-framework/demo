import { html, css } from 'polylib';
import { PlForm } from '@nfjs/front-pl/components/pl-form.js';
import '@plcmp/pl-flex-layout';
import '/generated/components/pl-table-pro.js';

export default class GeneratedTableMasterDetail extends PlForm {
  static properties = {
    formTitle: {
      type: String,
      value: 'Generated: pl-table / Master Detail'
    },
    columns: {
      type: Array,
      value: () => ([
        { id: 'team_id', field: 'team_id', header: 'ID', width: 95 },
        { id: 'team_name', field: 'team_name', header: 'Команда', width: 180 },
        { id: 'manager', field: 'manager', header: 'Руководитель', width: 165 },
        { id: 'direction', field: 'direction', header: 'Направление', width: 135 },
        { id: 'status', field: 'status', header: 'Статус', width: 95 },
        { id: 'current_sprint', field: 'current_sprint', header: 'Спринт', width: 95 },
        { id: 'velocity', field: 'velocity', header: 'Velocity', align: 'right', width: 95 },
        { id: 'tech_debt_pct', field: 'tech_debt_pct', header: 'Техдолг, %', align: 'right', width: 110 },
        { id: 'vacation_load_pct', field: 'vacation_load_pct', header: 'Отпуска, %', align: 'right', width: 110 },
        { id: 'capacity_pct', field: 'capacity_pct', header: 'Capacity, %', align: 'right', width: 105 },
        { id: 'next_milestone', field: 'next_milestone', header: 'Майлстоун', width: 125 },
        {
          id: 'sprint_group',
          header: 'Спринт, шт',
          children: [
            { id: 'open_tasks', field: 'open_tasks', header: 'Открыто', align: 'right', width: 95 },
            { id: 'in_progress_tasks', field: 'in_progress_tasks', header: 'В работе', align: 'right', width: 95 },
            { id: 'done_tasks', field: 'done_tasks', header: 'Готово', align: 'right', width: 95 }
          ]
        },
        {
          id: 'reliability_group',
          header: 'Надежность',
          children: [
            { id: 'sla_violations', field: 'sla_violations', header: 'SLA', align: 'right', width: 85 },
            { id: 'incident_rate', field: 'incident_rate', header: 'Inc./нед', align: 'right', width: 95 },
            { id: 'oncall_count', field: 'oncall_count', header: 'On-call', align: 'right', width: 95 }
          ]
        },
        {
          id: 'delivery_group',
          header: 'Поставка',
          children: [
            { id: 'deploy_frequency', field: 'deploy_frequency', header: 'Deploy/нед', align: 'right', width: 105 },
            { id: 'cycle_time_days', field: 'cycle_time_days', header: 'Cycle, дн', align: 'right', width: 95 },
            { id: 'last_release', field: 'last_release', header: 'Last release', width: 120 }
          ]
        }
      ])
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
    data: { value: () => [] },
    selected: { value: () => null }
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
    }
  `;

  static template = html`
    <pl-flex-layout vertical fit>
      <pl-table-pro
        id="tblMasterDetail"
        data="{{data}}"
        selected="{{selected}}"
        columns="[[columns]]"
        detail-fields="[[detailFields]]"
        detail-variant="team"
        master-detail
        settings-key="generated.table_pro.table_master_detail"></pl-table-pro>
      <pl-dataset id="dsMaster" endpoint="/generated/table/master-detail/masters" data="{{data}}"></pl-dataset>
    </pl-flex-layout>
  `;

  onConnect() {
    this.$.dsMaster.execute();
  }
}
