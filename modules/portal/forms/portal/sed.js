import { PortalBaseListForm } from '/portal/forms/portal/lib/base-list-form.js';
import { sedRows } from '/portal/forms/portal/lib/portal-utils.js';

export default class PortalSedForm extends PortalBaseListForm {
  static properties = {
    ...PortalBaseListForm.properties,
    formTitle: { type: String, value: 'Портал: СЭД' },
    settingsKey: { type: String, value: 'portal.sed.table' }
  };

  getRows() {
    return sedRows();
  }

  getColumns() {
    return [
    {
        id: "regNumber",
        field: "regNumber",
        header: "Рег. номер",
        width: 150
    },
    {
        id: "title",
        field: "title",
        header: "Документ",
        width: 320
    },
    {
        id: "type",
        field: "type",
        header: "Тип",
        width: 130
    },
    {
        id: "status",
        field: "status",
        header: "Статус",
        width: 130
    },
    {
        id: "assigneeName",
        field: "assigneeName",
        header: "Ответственный",
        width: 170
    },
    {
        id: "departmentName",
        field: "departmentName",
        header: "Подразделение",
        width: 180
    },
    {
        id: "dueDateRu",
        field: "dueDateRu",
        header: "Срок",
        width: 120
    }
];
  }

  getDetailFields() {
    return [
    {
        label: "Документ",
        field: "title"
    },
    {
        label: "Рег. номер",
        field: "regNumber"
    },
    {
        label: "Тип",
        field: "type"
    },
    {
        label: "Статус",
        field: "status"
    },
    {
        label: "Инициатор",
        field: "initiatorName"
    },
    {
        label: "Ответственный",
        field: "assigneeName"
    },
    {
        label: "Подразделение",
        field: "departmentName"
    },
    {
        label: "Описание",
        field: "summary"
    },
    {
        label: "Теги",
        field: "tags"
    }
];
  }
}
