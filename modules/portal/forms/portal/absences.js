import { PortalBaseListForm } from '/portal/forms/portal/lib/base-list-form.js';
import { absencesRows } from '/portal/forms/portal/lib/portal-utils.js';

export default class PortalAbsencesForm extends PortalBaseListForm {
  static properties = {
    ...PortalBaseListForm.properties,
    formTitle: { type: String, value: 'Портал: Отсутствия' },
    settingsKey: { type: String, value: 'portal.absences.table' }
  };

  getRows() {
    return absencesRows();
  }

  getColumns() {
    return [
    {
        id: "employeeName",
        field: "employeeName",
        header: "Сотрудник",
        width: 220
    },
    {
        id: "type",
        field: "type",
        header: "Тип",
        width: 150
    },
    {
        id: "approvalStatus",
        field: "approvalStatus",
        header: "Статус",
        width: 150
    },
    {
        id: "visibility",
        field: "visibility",
        header: "Видимость",
        width: 140
    },
    {
        id: "startDateRu",
        field: "startDateRu",
        header: "С",
        width: 120
    },
    {
        id: "endDateRu",
        field: "endDateRu",
        header: "По",
        width: 120
    }
];
  }

  getDetailFields() {
    return [
    {
        label: "Сотрудник",
        field: "employeeName"
    },
    {
        label: "Тип",
        field: "type"
    },
    {
        label: "Статус",
        field: "approvalStatus"
    },
    {
        label: "Видимость",
        field: "visibility"
    },
    {
        label: "С",
        field: "startDateRu"
    },
    {
        label: "По",
        field: "endDateRu"
    }
];
  }
}
