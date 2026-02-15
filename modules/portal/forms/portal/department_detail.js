import { PortalBaseDetailForm } from '/portal/forms/portal/lib/base-detail-form.js';
import {
  pickDepartment,
  orgTreeRows,
  departmentPeopleRows,
  departmentTasksRows,
  departmentKnowledgeRows,
  fmtDate
} from '/portal/forms/portal/lib/portal-utils.js';

export default class PortalDepartmentDetailForm extends PortalBaseDetailForm {
  static properties = {
    ...PortalBaseDetailForm.properties,
    formTitle: { type: String, value: 'Портал: Отдел (карточка)' },
    settingsKey: { type: String, value: 'portal.department_detail.table' }
  };

  getOptions() {
    return orgTreeRows().map((row) => ({ value: row.id, text: row.name }));
  }

  getSelectedRow(id) {
    return pickDepartment(id);
  }

  getDetailFields() {
    return [
      { label: 'Название', field: 'name' },
      { label: 'ID', field: 'id' },
      { label: 'Руководитель', field: 'headName' },
      { label: 'Родитель', field: 'parentName' },
      { label: 'Cost center', field: 'costCenter' },
      { label: 'Юрлицо', field: 'legalEntity' },
      { label: 'Описание', field: 'description' },
      { label: 'Ссылки', field: 'links.wiki' }
    ];
  }

  getRelatedTitle(row) {
    if (!row) return 'Сотрудники';
    const employees = departmentPeopleRows(row.id).length;
    const tasks = departmentTasksRows(row.id).length;
    const docs = departmentKnowledgeRows(row.id).length;
    return `Сотрудники: ${employees} · Задачи: ${tasks} · Регламенты: ${docs}`;
  }

  getRelatedRows(row) {
    if (!row) return [];
    return departmentPeopleRows(row.id).map((item) => ({
      displayName: item.displayName,
      title: item.title,
      managerName: item.managerName,
      statusToday: item.statusToday,
      hiredOn: fmtDate(item.hiredOn)
    }));
  }

  getRelatedColumns() {
    return [
      { id: 'displayName', field: 'displayName', header: 'Сотрудник', width: 220 },
      { id: 'title', field: 'title', header: 'Должность', width: 200 },
      { id: 'managerName', field: 'managerName', header: 'Руководитель', width: 180 },
      { id: 'statusToday', field: 'statusToday', header: 'Статус', width: 120 },
      { id: 'hiredOn', field: 'hiredOn', header: 'Найм', width: 120 }
    ];
  }
}
