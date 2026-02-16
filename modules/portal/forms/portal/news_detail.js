import { PortalBaseDetailForm } from '/portal/forms/portal/lib/base-detail-form.js';
import { pickNews, newsRows, fmtDateTime, portalData } from '/portal/forms/portal/lib/portal-utils.js';

export default class PortalNewsDetailForm extends PortalBaseDetailForm {
  static properties = {
    ...PortalBaseDetailForm.properties,
    formTitle: { type: String, value: 'Портал: Новость (карточка)' },
    settingsKey: { type: String, value: 'portal.news_detail.table' }
  };

  getOptions() {
    return newsRows().map((row) => ({ value: row.id, text: row.title }));
  }

  getSelectedRow(id) {
    return pickNews(id);
  }

  getDetailFields() {
    return [
      { label: 'Новость', field: 'title' },
      { label: 'Автор', field: 'authorName' },
      { label: 'Приоритет', field: 'priority' },
      { label: 'Опубликовано', field: 'publishedAtRu' },
      { label: 'Аудитория', field: 'audience.type' },
      { label: 'Теги', field: 'tags' },
      { label: 'Контент', field: 'bodyHtml', type: 'html' }
    ];
  }

  getRelatedTitle(row) {
    if (!row) return 'Связанные статьи БЗ';
    return `Связанные статьи БЗ к теме: ${row.title}`;
  }

  getRelatedRows(row) {
    if (!row) return [];
    const tags = new Set(row.tags || []);
    return (portalData.knowledgeBase || [])
      .filter((item) => (item.tags || []).some((tag) => tags.has(tag)))
      .map((item) => ({
        title: item.title,
        category: item.category,
        updatedAt: fmtDateTime(item.updatedAt),
        pinned: item.pinned ? 'Да' : 'Нет'
      }));
  }

  getRelatedColumns() {
    return [
      { id: 'title', field: 'title', header: 'Статья', width: 300 },
      { id: 'category', field: 'category', header: 'Категория', width: 170 },
      { id: 'updatedAt', field: 'updatedAt', header: 'Обновлено', width: 170 },
      { id: 'pinned', field: 'pinned', header: 'PIN', width: 90 }
    ];
  }
}
