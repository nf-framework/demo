import { html, css } from 'polylib';
import { PlForm } from '@nfjs/front-pl/components/pl-form.js';
import '@plcmp/pl-flex-layout';
import '@plcmp/pl-badge';
import '@plcmp/pl-icon-button';
import '@plcmp/pl-data-tree';
import '/generated/components/pl-table-pro.js';

export default class GeneratedTableTree extends PlForm {
  static properties = {
    formTitle: {
      type: String,
      value: 'Generated: pl-table / Tree'
    },
    pr: { value: () => ({}) },
    dataRaw: { type: Array, value: () => [], observer: '_dataRawChanged' },
    data: { type: Array, value: () => [] },
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
        id="tblTree"
        data="{{data}}"
        selected="{{selected}}"
        tree
        key-field="id"
        pkey-field="pid"
        has-child-field="_haschildren"
        settings-key="generated.table_pro.table_tree">
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

            .node-title {
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
              min-width: 0;
            }
          </style>
        </template>
        <pl-flex-layout slot="top-toolbar" wrap gap="8" align="center">
          <pl-icon-button variant="ghost" iconset="pl-default" icon="reload" on-click="[[onReloadClick]]"></pl-icon-button>
          <pl-badge>Источник: таблица generated.table_tree</pl-badge>
          <pl-badge>Модель: id/pid, 5 уровней</pl-badge>
          <pl-badge>Раскрытие узлов через pl-data-tree</pl-badge>
          <pl-badge>Загружено: [[dataRaw.length]]</pl-badge>
        </pl-flex-layout>

        <pl-table-pro-column id="node_name" field="node_name" header="Узел" width="420" sortable="false">
          <template>
            <div class="node-title">[[model.row.node_name]]</div>
          </template>
        </pl-table-pro-column>
        <pl-table-pro-column id="node_type" field="node_type" header="Тип" width="160" sortable="false"></pl-table-pro-column>
        <pl-table-pro-column id="environment" field="environment" header="Среда" width="110" sortable="false"></pl-table-pro-column>
        <pl-table-pro-column id="severity" field="severity" header="Приоритет" width="120" sortable="false"></pl-table-pro-column>
        <pl-table-pro-column id="assignee" field="assignee" header="Исполнитель" width="180" sortable="false"></pl-table-pro-column>
        <pl-table-pro-column id="status" field="status" header="Статус" width="150" sortable="false"></pl-table-pro-column>
        <pl-table-pro-column id="start_at" field="start_at" header="Старт" kind="date" format="DD.MM.YYYY HH:mm" width="170" sortable="false"></pl-table-pro-column>
        <pl-table-pro-column id="due_date" field="due_date" header="Дедлайн" kind="date" width="130" sortable="false"></pl-table-pro-column>
      </pl-table-pro>
    </pl-flex-layout>

    <pl-access id="acPrivs" data="{{pr}}"></pl-access>
    <pl-dataset partial-data id="dsTree" data="{{dataRaw}}"></pl-dataset>
    <pl-data-tree
      key-field="id"
      pkey-field="pid"
      has-child-field="_haschildren"
      in="{{dataRaw}}"
      out="{{data}}"></pl-data-tree>
  `;

  onConnect() {
    this._ensureTreeMode();
    this.$.dsTree.execute({});
  }

  onReloadClick() {
    this._ensureTreeMode();
    this.$.dsTree.execute({});
  }

  _dataRawChanged(_val, _old, mutation) {
    const path = Array.isArray(mutation?.path)
      ? mutation.path.join('.')
      : String(mutation?.path || '');
    if (!path || path === 'dataRaw') this._ensureTreeMode();
  }

  _ensureTreeMode() {
    const raw = this.dataRaw;
    if (!raw?.control) return;
    raw.control.treeMode = {
      hidValue: undefined,
      keyField: 'id',
      hidField: 'pid',
      filterByHid: false
    };
  }

  serverEndpoints = {
    access: {
      acPrivs: {
        privs: ['generated.table_tree.add', 'generated.table_tree.upd', 'generated.table_tree.del']
      }
    },
    dataset: {
      dsTree: {
        text: `
          select id,
                 pid,
                 node_name,
                 node_type,
                 environment,
                 severity,
                 assignee,
                 status,
                 start_at,
                 due_date,
                 _haschildren,
                 _opened,
                 sort_order
            from generated.v4table_tree t
           order by t.sort_order
        `
      }
    }
  }//serverEndpoints
}
