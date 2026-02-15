import { PortalBaseListForm } from '/portal/forms/portal/lib/base-list-form.js';
import { knowledgeRows } from '/portal/forms/portal/lib/portal-utils.js';

export default class PortalKnowledgeForm extends PortalBaseListForm {
  static properties = {
    ...PortalBaseListForm.properties,
    formTitle: { type: String, value: 'Портал: База знаний' },
    settingsKey: { type: String, value: 'portal.knowledge.table' }
  };

  getRows() {
    return knowledgeRows();
  }

  getColumns() {
    return [
    {
        id: "title",
        field: "title",
        header: "Документ",
        width: 340
    },
    {
        id: "category",
        field: "category",
        header: "Категория",
        width: 170
    },
    {
        id: "departmentNames",
        field: "departmentNames",
        header: "Подразделения",
        width: 280
    },
    {
        id: "updatedAtRu",
        field: "updatedAtRu",
        header: "Обновлено",
        width: 150
    },
    {
        id: "pinned",
        field: "pinned",
        header: "PIN",
        width: 90
    },
    {
        id: "isRegulation",
        field: "isRegulation",
        header: "Регламент",
        width: 110
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
        label: "Категория",
        field: "category"
    },
    {
        label: "Описание",
        field: "summary"
    },
    {
        label: "Подразделения",
        field: "departmentNames"
    },
    {
        label: "URL",
        field: "url"
    },
    {
        label: "Теги",
        field: "tags"
    },
    {
        label: "Контент",
        field: "contentHtml"
    }
];
  }
}
