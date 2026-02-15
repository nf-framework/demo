import { PortalBaseListForm } from '/portal/forms/portal/lib/base-list-form.js';
import { peopleRows } from '/portal/forms/portal/lib/portal-utils.js';

export default class PortalPeopleForm extends PortalBaseListForm {
  static properties = {
    ...PortalBaseListForm.properties,
    formTitle: { type: String, value: 'Портал: Сотрудники' },
    settingsKey: { type: String, value: 'portal.people.table' }
  };

  getRows() {
    return peopleRows();
  }

  getColumns() {
    return [
    {
        id: "displayName",
        field: "displayName",
        header: "Сотрудник",
        width: 220
    },
    {
        id: "title",
        field: "title",
        header: "Должность",
        width: 220
    },
    {
        id: "departmentName",
        field: "departmentName",
        header: "Подразделение",
        width: 200
    },
    {
        id: "locationName",
        field: "locationName",
        header: "Локация",
        width: 170
    },
    {
        id: "statusToday",
        field: "statusToday",
        header: "Статус",
        width: 130
    },
    {
        id: "hiredOnRu",
        field: "hiredOnRu",
        header: "Дата найма",
        width: 140
    }
];
  }

  getDetailFields() {
    return [
    {
        label: "Таб. номер",
        field: "employeeNumber"
    },
    {
        label: "Сотрудник",
        field: "displayName"
    },
    {
        label: "Должность",
        field: "title"
    },
    {
        label: "Grade",
        field: "grade"
    },
    {
        label: "Подразделение",
        field: "departmentName"
    },
    {
        label: "Локация",
        field: "locationName"
    },
    {
        label: "Руководитель",
        field: "managerName"
    },
    {
        label: "Email",
        field: "contacts.email"
    },
    {
        label: "Телефон",
        field: "contacts.phone"
    }
];
  }
}
