import { PortalBaseListForm } from '/portal/forms/portal/lib/base-list-form.js';
import { settingsRows } from '/portal/forms/portal/lib/portal-utils.js';

export default class PortalSettingsForm extends PortalBaseListForm {
  static properties = {
    ...PortalBaseListForm.properties,
    formTitle: { type: String, value: 'Портал: Настройки' },
    settingsKey: { type: String, value: 'portal.settings.table' }
  };

  getRows() {
    return settingsRows();
  }

  getColumns() {
    return [
    {
        id: "name",
        field: "name",
        header: "Параметр",
        width: 300
    },
    {
        id: "value",
        field: "value",
        header: "Значение",
        width: 220
    },
    {
        id: "type",
        field: "type",
        header: "Категория",
        width: 180
    }
];
  }

  getDetailFields() {
    return [
    {
        label: "Параметр",
        field: "name"
    },
    {
        label: "Значение",
        field: "value"
    },
    {
        label: "Категория",
        field: "type"
    },
    {
        label: "ID",
        field: "id"
    }
];
  }
}
