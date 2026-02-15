import { PortalBaseListForm } from '/portal/forms/portal/lib/base-list-form.js';
import { organizationRows } from '/portal/forms/portal/lib/portal-utils.js';

export default class PortalOrganizationForm extends PortalBaseListForm {
  static properties = {
    ...PortalBaseListForm.properties,
    formTitle: { type: String, value: 'Портал: Организация' },
    settingsKey: { type: String, value: 'portal.organization.table' }
  };

  getRows() {
    return organizationRows();
  }

  getColumns() {
    return [
    {
        id: "shortName",
        field: "shortName",
        header: "Короткое имя",
        width: 220
    },
    {
        id: "legalName",
        field: "legalName",
        header: "Юр. название",
        width: 420
    },
    {
        id: "inn",
        field: "inn",
        header: "ИНН",
        width: 140
    },
    {
        id: "kpp",
        field: "kpp",
        header: "КПП",
        width: 140
    },
    {
        id: "ogrn",
        field: "ogrn",
        header: "ОГРН",
        width: 180
    },
    {
        id: "registrationDateRu",
        field: "registrationDateRu",
        header: "Регистрация",
        width: 150
    }
];
  }

  getDetailFields() {
    return [
    {
        label: "Полное название",
        field: "legalName"
    },
    {
        label: "Короткое название",
        field: "shortName"
    },
    {
        label: "Форма",
        field: "legalForm"
    },
    {
        label: "ИНН",
        field: "inn"
    },
    {
        label: "КПП",
        field: "kpp"
    },
    {
        label: "ОГРН",
        field: "ogrn"
    },
    {
        label: "ОКПО",
        field: "okpo"
    },
    {
        label: "ОКВЭД",
        field: "okved"
    },
    {
        label: "Налоговая",
        field: "taxOffice"
    },
    {
        label: "Сайт",
        field: "website"
    }
];
  }
}
