import { html, css } from 'polylib';
import { PlForm } from '@nfjs/front-pl/components/pl-form.js';
import '@plcmp/pl-flex-layout';
import '/generated/components/pl-table-pro.js';

export default class GeneratedTableGroupDeep extends PlForm {
  static properties = {
    formTitle: {
      type: String,
      value: 'Generated: pl-table / Deep Groups'
    },
    columns: {
      type: Array,
      value: () => ([
        { id: 'service', field: 'service', header: 'Сервис', width: 170 },
        { id: 'owner', field: 'owner', header: 'Ответственный', width: 170 },
        {
          id: 'finance_2026',
          header: 'Финансы 2026, ч',
          children: [
            {
              id: 'q1',
              header: 'Q1',
              children: [
                {
                  id: 'jan',
                  header: 'Январь',
                  children: [
                    { id: 'jan_plan', field: 'jan_plan', header: 'План', align: 'right', width: 95 },
                    { id: 'jan_fact', field: 'jan_fact', header: 'Факт', align: 'right', width: 95 }
                  ]
                },
                {
                  id: 'feb',
                  header: 'Февраль',
                  children: [
                    { id: 'feb_plan', field: 'feb_plan', header: 'План', align: 'right', width: 95 },
                    { id: 'feb_fact', field: 'feb_fact', header: 'Факт', align: 'right', width: 95 }
                  ]
                }
              ]
            },
            {
              id: 'q2',
              header: 'Q2',
              children: [
                {
                  id: 'apr',
                  header: 'Апрель',
                  children: [
                    { id: 'apr_plan', field: 'apr_plan', header: 'План', align: 'right', width: 95 },
                    { id: 'apr_fact', field: 'apr_fact', header: 'Факт', align: 'right', width: 95 }
                  ]
                },
                {
                  id: 'may',
                  header: 'Май',
                  children: [
                    { id: 'may_plan', field: 'may_plan', header: 'План', align: 'right', width: 95 },
                    { id: 'may_fact', field: 'may_fact', header: 'Факт', align: 'right', width: 95 }
                  ]
                }
              ]
            }
          ]
        },
        {
          id: 'stability',
          header: 'Надежность',
          children: [
            {
              id: 'incidents',
              header: 'Инциденты',
              children: [
                { id: 'inc_open', field: 'inc_open', header: 'Открыто', align: 'right', width: 95 },
                { id: 'inc_closed', field: 'inc_closed', header: 'Закрыто', align: 'right', width: 95 }
              ]
            },
            {
              id: 'sla',
              header: 'SLA',
              children: [
                { id: 'sla_hit_pct', field: 'sla_hit_pct', header: 'В срок, %', align: 'right', width: 95 }
              ]
            }
          ]
        },
        { id: 'status', field: 'status', header: 'Статус', width: 120 }
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
        id="tblDeep"
        data="{{data}}"
        selected="{{selected}}"
        columns="[[columns]]"
        settings-key="generated.table_pro.table_group_deep"></pl-table-pro>
      <pl-dataset id="dsDeep" endpoint="/generated/table/deep-groups" data="{{data}}"></pl-dataset>
    </pl-flex-layout>
  `;

  onConnect() {
    this.$.dsDeep.execute();
  }
}
