import { PortalBaseListForm } from '/portal/forms/portal/lib/base-list-form.js';
import { orgTreeRows } from '/portal/forms/portal/lib/portal-utils.js';
import { html } from 'polylib';
import '@plcmp/pl-data-tree';

export default class PortalOrgForm extends PortalBaseListForm {
  static properties = {
    ...PortalBaseListForm.properties,
    formTitle: { type: String, value: 'Портал: Оргструктура' },
    treeRows: { type: Array, value: () => [] }
  };

  static template = html`
    <pl-flex-layout class="shell" vertical fit gap="8">
      <pl-flex-layout class="toolbar">
        <pl-input placeholder="Поиск" value="{{search}}">
          <pl-icon slot="prefix" iconset="pl-default" icon="search" size="16"></pl-icon>
        </pl-input>
        <pl-badge>[[filteredRows.length]] подразделений</pl-badge>
        <pl-icon-button variant="ghost" iconset="pl-default" icon="reload" on-click="[[onReloadClick]]"></pl-icon-button>
      </pl-flex-layout>

      <pl-flex-layout class="content" fit>
        <div class="grid-wrap">
          <pl-table-pro
            data="{{treeRows}}"
            selected="{{selected}}"
            columns="[[columns]]"
            tree
            key-field="id"
            pkey-field="pid"
            has-child-field="_haschildren"
            enable-settings="false"></pl-table-pro>
        </div>

        <div class="details">
          <div class="details-head">
            <div class="details-title">[[detailTitle(activeRow)]]</div>
          </div>
          <div class="details-body">
            <template d:repeat="[[detailPairs]]">
              <div class="pair">
                <div class="pair-label">[[item.label]]</div>
                <div class="pair-value">[[item.value]]</div>
              </div>
            </template>
            <div class="empty" hidden$="[[detailPairs.length]]">Выберите подразделение в дереве.</div>
          </div>
        </div>
      </pl-flex-layout>

      <pl-data-tree
        key-field="id"
        pkey-field="pid"
        has-child-field="_haschildren"
        in="{{filteredRows}}"
        out="{{treeRows}}"></pl-data-tree>
    </pl-flex-layout>
  `;

  getRows() {
    const rows = orgTreeRows();
    const childCountByParent = rows.reduce((acc, row) => {
      const pid = row.parentId;
      if (pid) acc[pid] = (acc[pid] || 0) + 1;
      return acc;
    }, {});

    return rows.map((row, index) => ({
      ...row,
      pid: row.parentId || null,
      _haschildren: Number(childCountByParent[row.id] || 0) > 0,
      _opened: index === 0 || !row.parentId
    }));
  }

  getColumns() {
    return [
    {
        id: "name",
        field: "name",
        header: "Подразделение",
        width: 260
    },
    {
        id: "headName",
        field: "headName",
        header: "Руководитель",
        width: 210
    },
    {
        id: "parentName",
        field: "parentName",
        header: "Родитель",
        width: 230
    },
    {
        id: "employeeCount",
        field: "employeeCount",
        header: "Сотрудники",
        width: 120,
        align: "right"
    },
    {
        id: "locationNames",
        field: "locationNames",
        header: "Локации",
        width: 260
    }
];
  }

  getDetailFields() {
    return [
    {
        label: "ID",
        field: "id"
    },
    {
        label: "Название",
        field: "name"
    },
    {
        label: "Описание",
        field: "description"
    },
    {
        label: "Head",
        field: "headName"
    },
    {
        label: "Cost center",
        field: "costCenter"
    },
    {
        label: "Юрлицо",
        field: "legalEntity"
    },
    {
        label: "Локации",
        field: "locationNames"
    }
];
  }
}
