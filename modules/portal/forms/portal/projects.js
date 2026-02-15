import { PortalBaseListForm } from '/portal/forms/portal/lib/base-list-form.js';
import { projectsRows } from '/portal/forms/portal/lib/portal-utils.js';

export default class PortalProjectsForm extends PortalBaseListForm {
  static properties = {
    ...PortalBaseListForm.properties,
    formTitle: { type: String, value: 'Портал: Проекты' },
    settingsKey: { type: String, value: 'portal.projects.table' }
  };

  getRows() {
    return projectsRows();
  }

  getColumns() {
    return [
    {
        id: "code",
        field: "code",
        header: "Код",
        width: 130
    },
    {
        id: "name",
        field: "name",
        header: "Проект",
        width: 300
    },
    {
        id: "productName",
        field: "productName",
        header: "Продукт",
        width: 210
    },
    {
        id: "ownerName",
        field: "ownerName",
        header: "Владелец",
        width: 180
    },
    {
        id: "status",
        field: "status",
        header: "Статус",
        width: 130
    },
    {
        id: "startDateRu",
        field: "startDateRu",
        header: "Старт",
        width: 120
    },
    {
        id: "endDateRu",
        field: "endDateRu",
        header: "Финиш",
        width: 120
    }
];
  }

  getDetailFields() {
    return [
    {
        label: "Проект",
        field: "name"
    },
    {
        label: "Код",
        field: "code"
    },
    {
        label: "Описание",
        field: "description"
    },
    {
        label: "Владелец",
        field: "ownerName"
    },
    {
        label: "Продукт",
        field: "productName"
    },
    {
        label: "Статус",
        field: "status"
    },
    {
        label: "Теги",
        field: "tags"
    },
    {
        label: "Видимость",
        field: "visibility"
    }
];
  }
}
