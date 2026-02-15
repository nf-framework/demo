import { PortalBaseListForm } from '/portal/forms/portal/lib/base-list-form.js';
import { tasksRows } from '/portal/forms/portal/lib/portal-utils.js';

export default class PortalTasksForm extends PortalBaseListForm {
  static properties = {
    ...PortalBaseListForm.properties,
    formTitle: { type: String, value: 'Портал: Задачи' },
    settingsKey: { type: String, value: 'portal.tasks.table' }
  };

  getRows() {
    return tasksRows();
  }

  getColumns() {
    return [
    {
        id: "title",
        field: "title",
        header: "Задача",
        width: 360
    },
    {
        id: "assigneeName",
        field: "assigneeName",
        header: "Исполнитель",
        width: 180
    },
    {
        id: "reporterName",
        field: "reporterName",
        header: "Постановщик",
        width: 180
    },
    {
        id: "status",
        field: "status",
        header: "Статус",
        width: 120
    },
    {
        id: "priority",
        field: "priority",
        header: "Приоритет",
        width: 110
    },
    {
        id: "dueDateRu",
        field: "dueDateRu",
        header: "Срок",
        width: 120
    },
    {
        id: "relatedName",
        field: "relatedName",
        header: "Связь",
        width: 220
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
        label: "Задача",
        field: "title"
    },
    {
        label: "Описание",
        field: "description"
    },
    {
        label: "Статус",
        field: "status"
    },
    {
        label: "Приоритет",
        field: "priority"
    },
    {
        label: "Исполнитель",
        field: "assigneeName"
    },
    {
        label: "Срок",
        field: "dueDateRu"
    },
    {
        label: "Обновлено",
        field: "updatedAtRu"
    },
    {
        label: "Теги",
        field: "tags"
    }
];
  }
}
