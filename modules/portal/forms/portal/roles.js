import { PortalBaseListForm } from '/portal/forms/portal/lib/base-list-form.js';
import { rolesRows } from '/portal/forms/portal/lib/portal-utils.js';

export default class PortalRolesForm extends PortalBaseListForm {
  static properties = {
    ...PortalBaseListForm.properties,
    formTitle: { type: String, value: 'Портал: Роли' },
    settingsKey: { type: String, value: 'portal.roles.table' }
  };

  getRows() {
    return rolesRows();
  }

  getColumns() {
    return [
    {
        id: "name",
        field: "name",
        header: "Роль",
        width: 280
    },
    {
        id: "category",
        field: "category",
        header: "Категория",
        width: 180
    },
    {
        id: "isLeadRole",
        field: "isLeadRole",
        header: "Lead",
        width: 100
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
        label: "Роль",
        field: "name"
    },
    {
        label: "Категория",
        field: "category"
    },
    {
        label: "Lead",
        field: "isLeadRole"
    }
];
  }
}
