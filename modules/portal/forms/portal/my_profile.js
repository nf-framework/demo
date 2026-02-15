import { PortalBaseListForm } from '/portal/forms/portal/lib/base-list-form.js';
import { peopleRows } from '/portal/forms/portal/lib/portal-utils.js';

export default class PortalMyProfileForm extends PortalBaseListForm {
  static properties = {
    ...PortalBaseListForm.properties,
    formTitle: { type: String, value: 'Портал: Мой профиль' },
    settingsKey: { type: String, value: 'portal.my_profile.table' }
  };

  getRows() {
    const rows = peopleRows();
    return rows.filter((row)=>row.id==='emp-001');
  }

  getColumns() {
    return [
    {
        id: "displayName",
        field: "displayName",
        header: "Сотрудник",
        width: 240
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
        width: 220
    },
    {
        id: "locationName",
        field: "locationName",
        header: "Локация",
        width: 180
    },
    {
        id: "hiredOnRu",
        field: "hiredOnRu",
        header: "Дата найма",
        width: 130
    }
];
  }

  getDetailFields() {
    return [
    {
        label: "ФИО",
        field: "displayName"
    },
    {
        label: "Должность",
        field: "title"
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
        label: "Email",
        field: "contacts.email"
    },
    {
        label: "Телефон",
        field: "contacts.phone"
    },
    {
        label: "Timezone",
        field: "timezone"
    },
    {
        label: "Hire date",
        field: "hiredOnRu"
    }
];
  }
}
