import { PortalBaseListForm } from '/portal/forms/portal/lib/base-list-form.js';
import { newsRows } from '/portal/forms/portal/lib/portal-utils.js';

export default class PortalNewsForm extends PortalBaseListForm {
  static properties = {
    ...PortalBaseListForm.properties,
    formTitle: { type: String, value: 'Портал: Новости' },
    settingsKey: { type: String, value: 'portal.news.table' }
  };

  getRows() {
    return newsRows();
  }

  getColumns() {
    return [
    {
        id: "title",
        field: "title",
        header: "Новость",
        width: 360
    },
    {
        id: "authorName",
        field: "authorName",
        header: "Автор",
        width: 170
    },
    {
        id: "priority",
        field: "priority",
        header: "Приоритет",
        width: 120
    },
    {
        id: "publishedAtRu",
        field: "publishedAtRu",
        header: "Опубликовано",
        width: 170
    },
    {
        id: "pinned",
        field: "pinned",
        header: "PIN",
        width: 90
    },
    {
        id: "readReceiptRequired",
        field: "readReceiptRequired",
        header: "Read receipt",
        width: 130
    }
];
  }

  getDetailFields() {
    return [
    {
        label: "Новость",
        field: "title"
    },
    {
        label: "Автор",
        field: "authorName"
    },
    {
        label: "Приоритет",
        field: "priority"
    },
    {
        label: "Теги",
        field: "tags"
    },
    {
        label: "Опубликовано",
        field: "publishedAtRu"
    },
    {
        label: "Контент",
        field: "bodyHtml"
    }
];
  }
}
