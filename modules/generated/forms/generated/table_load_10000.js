import { html, css } from 'polylib';
import { PlForm } from '@nfjs/front-pl/components/pl-form.js';
import '@plcmp/pl-flex-layout';
import '@plcmp/pl-badge';
import '@plcmp/pl-icon-button';
import '/generated/components/pl-table-pro.js';

const COLUMN_COUNT = 50;

function colCode(index) {
  return String(index).padStart(2, '0');
}

function createColumns() {
  const columns = [
    {
      id: 'id',
      field: 'id',
      header: 'ID',
      width: 110,
      sortable: true,
      resizable: true,
      align: 'right',
      fixed: 'left'
    }
  ];

  for (let i = 1; i < COLUMN_COUNT; i += 1) {
    const code = colCode(i);
    columns.push({
      id: `c${code}`,
      field: `c${code}`,
      header: `Колонка ${code}`,
      width: 150,
      sortable: true,
      resizable: true,
      align: i % 3 === 0 ? 'right' : 'left',
      fixed: i === COLUMN_COUNT - 1 ? 'right' : ''
    });
  }

  return columns;
}

export default class GeneratedTableLoad10000 extends PlForm {
  static properties = {
    formTitle: {
      type: String,
      value: 'Generated: pl-table / Load 10k x 50'
    },
    pr: { value: () => ({}) },
    columns: {
      type: Array,
      value: () => createColumns()
    },
    data: {
      type: Array,
      value: () => []
    },
    selected: {
      value: () => null
    }
  };

  static css = css`
    :host {
      display: block;
      height: 100%;
      min-height: 0;
    }

    .screen {
      width: 100%;
      height: 100%;
      min-height: 0;
      min-width: 0;
      overflow: hidden;
      align-items: stretch;
    }

    .toolbar {
      border-bottom: 1px solid var(--pl-grey-light);
      padding: var(--pl-space-sm);
      background: var(--pl-background-color);
      width: 100%;
      min-width: 0;
      box-sizing: border-box;
    }

    .table-wrap {
      flex: 1;
      min-height: 0;
      min-width: 0;
      width: 100%;
      overflow: hidden;
    }

    pl-table-pro {
      width: 100%;
      height: 100%;
      min-height: 0;
      min-width: 0;
    }
  `;

  static template = html`
    <pl-flex-layout vertical fit class="screen">
      <pl-flex-layout class="toolbar" align="center" gap="8" wrap>
        <pl-icon-button
          variant="ghost"
          iconset="pl-default"
          icon="reload"
          title="Перезагрузить данные"
          on-click="[[onReloadClick]]"></pl-icon-button>
        <pl-badge>Бэкенд: 10 000 записей</pl-badge>
        <pl-badge>Колонок: [[columns.length]]</pl-badge>
        <pl-badge>Загружено: [[data.length]]</pl-badge>
      </pl-flex-layout>

      <div class="table-wrap">
        <pl-table-pro
          id="tblLoad"
          columns="{{columns}}"
          data="{{data}}"
          selected="{{selected}}"
          settings-key="generated.table_pro.table_load_10000">
          <pl-flex-layout slot="top-toolbar" align="center">
          </pl-flex-layout>
        </pl-table-pro>
      </div>
    </pl-flex-layout>

    <pl-access id="acPrivs" data="{{pr}}"></pl-access>
    <pl-dataset partial-data id="dsLoad" data="{{data}}"></pl-dataset>
  `;

  onConnect() {
    this.$.dsLoad.execute({});
  }

  onReloadClick() {
    this.$.dsLoad.execute({});
  }

  serverEndpoints = {
    access: {
      acPrivs: {
        privs: ['generated.table_load_10000.add', 'generated.table_load_10000.upd', 'generated.table_load_10000.del']
      }
    },
    dataset: {
      dsLoad: {
        text: `
          select *
            from generated.v4table_load_10000 t
           order by t.id
        `
      }
    }
  }//serverEndpoints
}
