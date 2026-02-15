import { PortalBaseDetailForm } from '/portal/forms/portal/lib/base-detail-form.js';
import { portalData, pickKnowledge, knowledgeRows, fmtDateTime } from '/portal/forms/portal/lib/portal-utils.js';

export default class PortalKnowledgeDetailForm extends PortalBaseDetailForm {
  static properties = {
    ...PortalBaseDetailForm.properties,
    formTitle: { type: String, value: 'Портал: Документ БЗ (карточка)' },
    settingsKey: { type: String, value: 'portal.knowledge_detail.table' }
  };

  getOptions() {
    return knowledgeRows().map((row) => ({ value: row.id, text: row.title }));
  }

  getSelectedRow(id) {
    return pickKnowledge(id);
  }

  getDetailFields() {
    return [
      { label: 'Документ', field: 'title' },
      { label: 'Категория', field: 'category' },
      { label: 'Описание', field: 'summary' },
      { label: 'Подразделения', field: 'departmentNames' },
      { label: 'Доступ', field: 'access.type' },
      { label: 'URL', field: 'url' },
      { label: 'Теги', field: 'tags' },
      { label: 'Контент', field: 'contentHtml' }
    ];
  }

  getRelatedTitle() {
    return 'История изменений';
  }

  getRelatedRows(row) {
    if (!row) return [];
    return (portalData.auditLog || [])
      .filter((item) => item.entityType === 'knowledge' && item.entityId === row.id)
      .map((item) => ({
        action: item.action,
        actorId: item.actorId,
        timestamp: fmtDateTime(item.timestamp),
        contentHtml: item.contentHtml ? 'Есть HTML' : '—'
      }));
  }

  getRelatedColumns() {
    return [
      { id: 'action', field: 'action', header: 'Действие', width: 130 },
      { id: 'actorId', field: 'actorId', header: 'Исполнитель', width: 150 },
      { id: 'timestamp', field: 'timestamp', header: 'Дата', width: 170 },
      { id: 'contentHtml', field: 'contentHtml', header: 'Контент', width: 130 }
    ];
  }
}
