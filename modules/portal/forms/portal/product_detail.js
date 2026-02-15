import { PortalBaseDetailForm } from '/portal/forms/portal/lib/base-detail-form.js';
import {
  assignmentsByEntity,
  pickProduct,
  productsRows,
  fmtDate
} from '/portal/forms/portal/lib/portal-utils.js';

export default class PortalProductDetailForm extends PortalBaseDetailForm {
  static properties = {
    ...PortalBaseDetailForm.properties,
    formTitle: { type: String, value: 'Портал: Продукт (карточка)' },
    settingsKey: { type: String, value: 'portal.product_detail.table' }
  };

  getOptions() {
    return productsRows().map((row) => ({ value: row.id, text: `${row.code} · ${row.name}` }));
  }

  getSelectedRow(id) {
    return pickProduct(id);
  }

  getDetailFields() {
    return [
      { label: 'Продукт', field: 'name' },
      { label: 'Код', field: 'code' },
      { label: 'Описание', field: 'description' },
      { label: 'Владелец', field: 'ownerName' },
      { label: 'Статус', field: 'status' },
      { label: 'С', field: 'startDateRu' },
      { label: 'По', field: 'endDateRu' },
      { label: 'Теги', field: 'tags' },
      { label: 'Ссылка', field: 'legalLink' }
    ];
  }

  getRelatedTitle(row) {
    if (!row) return 'Команда продукта';
    return `Команда продукта: ${row.name}`;
  }

  getRelatedRows(row) {
    if (!row) return [];
    return assignmentsByEntity('product', row.id).map((item) => ({
      employeeName: item.employeeName,
      roleName: item.roleName,
      allocationPercent: item.allocationPercent,
      lineType: item.lineType,
      validFrom: fmtDate(item.validFrom),
      validTo: fmtDate(item.validTo)
    }));
  }

  getRelatedColumns() {
    return [
      { id: 'employeeName', field: 'employeeName', header: 'Сотрудник', width: 220 },
      { id: 'roleName', field: 'roleName', header: 'Роль', width: 180 },
      { id: 'allocationPercent', field: 'allocationPercent', header: '%', width: 80, align: 'right' },
      { id: 'lineType', field: 'lineType', header: 'Линия', width: 100 },
      { id: 'validFrom', field: 'validFrom', header: 'С', width: 110 },
      { id: 'validTo', field: 'validTo', header: 'По', width: 110 }
    ];
  }
}
