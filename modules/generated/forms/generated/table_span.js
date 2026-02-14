import { html, css } from 'polylib';
import { PlForm } from '@nfjs/front-pl/components/pl-form.js';
import '@plcmp/pl-flex-layout';
import '/generated/components/pl-table-pro.js';

export default class GeneratedTableSpan extends PlForm {
  static properties = {
    formTitle: {
      type: String,
      value: 'Generated: pl-table / Span'
    },
    columns: {
      type: Array,
      value: () => ([
        { id: 'portfolio', field: 'portfolio', header: 'Портфель', width: 170, merge: true },
        { id: 'project_code', field: 'project_code', header: 'Код проекта', width: 120 },
        { id: 'project_name', field: 'project_name', header: 'Проект', width: 230 },
        { id: 'customer', field: 'customer', header: 'Заказчик', width: 110, merge: true },
        { id: 'project_manager', field: 'project_manager', header: 'Менеджер', width: 170 },
        { id: 'stage', field: 'stage', header: 'Этап', width: 120 },
        { id: 'priority', field: 'priority', header: 'Приоритет', width: 115 },
        { id: 'annual_plan_k', field: 'annual_plan_k', header: 'Год, ч', width: 95, align: 'right' },
        { id: 'jan_k', field: 'jan_k', header: 'Янв', width: 85, align: 'right', groupPath: ['Q1: Янв-Мар'] },
        { id: 'feb_k', field: 'feb_k', header: 'Фев', width: 85, align: 'right', groupPath: ['Q1: Янв-Мар'] },
        { id: 'mar_k', field: 'mar_k', header: 'Мар', width: 85, align: 'right', groupPath: ['Q1: Янв-Мар'] },
        { id: 'apr_k', field: 'apr_k', header: 'Апр', width: 85, align: 'right', groupPath: ['Q2: Апр-Июн'] },
        { id: 'may_k', field: 'may_k', header: 'Май', width: 85, align: 'right', groupPath: ['Q2: Апр-Июн'] },
        { id: 'jun_k', field: 'jun_k', header: 'Июн', width: 85, align: 'right', groupPath: ['Q2: Апр-Июн'] },
        { id: 'jul_k', field: 'jul_k', header: 'Июл', width: 85, align: 'right', groupPath: ['Q3: Июл-Сен'] },
        { id: 'aug_k', field: 'aug_k', header: 'Авг', width: 85, align: 'right', groupPath: ['Q3: Июл-Сен'] },
        { id: 'sep_k', field: 'sep_k', header: 'Сен', width: 85, align: 'right', groupPath: ['Q3: Июл-Сен'] },
        { id: 'oct_k', field: 'oct_k', header: 'Окт', width: 85, align: 'right', groupPath: ['Q4: Окт-Дек'] },
        { id: 'nov_k', field: 'nov_k', header: 'Ноя', width: 85, align: 'right', groupPath: ['Q4: Окт-Дек'] },
        { id: 'dec_k', field: 'dec_k', header: 'Дек', width: 85, align: 'right', groupPath: ['Q4: Окт-Дек'] }
      ])
    },
    data: { value: () => [] },
    selected: { value: () => null },
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
    }
  `;

  static template = html`
    <pl-flex-layout vertical fit>
      <pl-table-pro
        id="tblSpan"
        data="{{data}}"
        selected="{{selected}}"
        columns="[[columns]]"
        group-row-template="[[groupRowTemplate]]"
        settings-key="generated.table_pro.table_span"></pl-table-pro>
      <pl-dataset id="dsTableSpan" endpoint="/generated/table/span" data="{{data}}"></pl-dataset>
    </pl-flex-layout>
  `;

  onConnect() {
    this.$.dsTableSpan.execute();
  }
}
