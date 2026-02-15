import { PortalBaseListForm } from '/portal/forms/portal/lib/base-list-form.js';
import { productsRows } from '/portal/forms/portal/lib/portal-utils.js';

export default class PortalProductsForm extends PortalBaseListForm {
  static properties = {
    ...PortalBaseListForm.properties,
    formTitle: { type: String, value: 'Портал: Продукты' },
    settingsKey: { type: String, value: 'portal.products.table' }
  };

  getRows() {
    return productsRows();
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
        header: "Продукт",
        width: 280
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
    },
    {
        id: "visibility",
        field: "visibility",
        header: "Видимость",
        width: 140
    }
];
  }

  getDetailFields() {
    return [
    {
        label: "Продукт",
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
        label: "Статус",
        field: "status"
    },
    {
        label: "Теги",
        field: "tags"
    },
    {
        label: "Ссылка",
        field: "legalLink"
    }
];
  }
}
