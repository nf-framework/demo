import {
  absences,
  assignments,
  auditLog,
  corporateEvents,
  departments,
  documents,
  employees,
  knowledgeBase,
  locations,
  news,
  organization,
  products,
  projectRoles,
  projects,
  tasks,
  cloneRows
} from '../data/portal-memory.js';

export const portalData = {
  absences,
  assignments,
  auditLog,
  corporateEvents,
  departments,
  documents,
  employees,
  knowledgeBase,
  locations,
  news,
  organization,
  products,
  projectRoles,
  projects,
  tasks
};

function byId(list) {
  return new Map((Array.isArray(list) ? list : []).map((item) => [item.id, item]));
}

const employeeById = byId(employees);
const departmentById = byId(departments);
const locationById = byId(locations);
const projectById = byId(projects);
const productById = byId(products);
const roleById = byId(projectRoles);

export const fmtDate = (value) => {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleDateString('ru-RU');
};

export const fmtDateTime = (value) => {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const initials = (value) => {
  const parts = String(value || '').trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return '';
  return `${parts[0][0] || ''}${parts[1]?.[0] || ''}`.toUpperCase();
};

export const employeeName = (id) => employeeById.get(id)?.displayName || '—';
export const departmentName = (id) => departmentById.get(id)?.name || '—';
export const locationName = (id) => locationById.get(id)?.name || '—';
export const projectName = (id) => projectById.get(id)?.name || '—';
export const productName = (id) => productById.get(id)?.name || '—';
export const roleName = (id) => roleById.get(id)?.name || '—';

export function clone(list) {
  return cloneRows(list);
}

export function orgTreeRows() {
  return clone(departments).map((row) => ({
    ...row,
    parentName: row.parentId ? departmentName(row.parentId) : '—',
    headName: employeeName(row.headId),
    employeeCount: employees.filter((item) => item.departmentId === row.id).length,
    locationNames: (row.links?.locationIds || []).map((id) => locationName(id)).filter(Boolean).join(', ') || '—'
  }));
}

export function peopleRows() {
  return clone(employees).map((row) => ({
    ...row,
    departmentName: departmentName(row.departmentId),
    locationName: locationName(row.locationId),
    managerName: employeeName(row.managerId),
    hiredOnRu: fmtDate(row.hiredOn)
  }));
}

export function tasksRows() {
  return clone(tasks).map((row) => ({
    ...row,
    assigneeName: employeeName(row.assigneeId),
    reporterName: employeeName(row.reporterId),
    dueDateRu: fmtDate(row.dueDate),
    updatedAtRu: fmtDateTime(row.updatedAt),
    relatedName: row.relatedType === 'project'
      ? projectName(row.relatedId)
      : row.relatedType === 'product'
        ? productName(row.relatedId)
        : row.relatedId || '—'
  }));
}

export function sedRows() {
  return clone(documents).map((row) => ({
    ...row,
    initiatorName: employeeName(row.initiatorId),
    assigneeName: employeeName(row.assigneeId),
    departmentName: departmentName(row.departmentId),
    dueDateRu: fmtDate(row.dueDate),
    updatedAtRu: fmtDateTime(row.updatedAt)
  }));
}

export function absencesRows() {
  return clone(absences).map((row) => ({
    ...row,
    employeeName: employeeName(row.employeeId),
    startDateRu: fmtDate(row.startDate),
    endDateRu: fmtDate(row.endDate)
  }));
}

export function projectsRows() {
  return clone(projects).map((row) => ({
    ...row,
    ownerName: employeeName(row.ownerId),
    productName: productName(row.productId),
    startDateRu: fmtDate(row.startDate),
    endDateRu: fmtDate(row.endDate)
  }));
}

export function productsRows() {
  return clone(products).map((row) => ({
    ...row,
    ownerName: employeeName(row.ownerId),
    startDateRu: fmtDate(row.startDate),
    endDateRu: fmtDate(row.endDate)
  }));
}

export function knowledgeRows() {
  return clone(knowledgeBase).map((row) => ({
    ...row,
    departmentNames: (row.departmentIds || []).map((id) => departmentName(id)).join(', ') || '—',
    updatedAtRu: fmtDateTime(row.updatedAt)
  }));
}

export function newsRows() {
  return clone(news).map((row) => ({
    ...row,
    authorName: employeeName(row.authorId),
    publishedAtRu: fmtDateTime(row.publishedAt)
  }));
}

export function rolesRows() {
  return clone(projectRoles);
}

export function organizationRows() {
  const org = clone(organization)[0] || {};
  return [
    {
      ...org,
      registrationDateRu: fmtDate(org.registrationDate),
      updatedAtRu: fmtDateTime(org.updatedAt)
    }
  ];
}

export function settingsRows() {
  return [
    { id: 'theme', name: 'Тема интерфейса', value: 'light', type: 'ui' },
    { id: 'lang', name: 'Язык системы', value: 'ru-RU', type: 'ui' },
    { id: 'notify-email', name: 'Email-уведомления', value: 'enabled', type: 'notifications' },
    { id: 'notify-push', name: 'Push-уведомления', value: 'enabled', type: 'notifications' },
    { id: 'security-mfa', name: 'MFA для привилегированных', value: 'required', type: 'security' },
    { id: 'security-timeout', name: 'Авто-логаут (мин)', value: '30', type: 'security' }
  ];
}

export function assignmentsByEmployee(employeeId) {
  return clone(assignments)
    .filter((row) => row.employeeId === employeeId)
    .map((row) => ({
      ...row,
      roleName: roleName(row.roleId),
      entityName: row.entityType === 'project' ? projectName(row.entityId) : productName(row.entityId)
    }));
}

export function assignmentsByEntity(type, entityId) {
  return clone(assignments)
    .filter((row) => row.entityType === type && row.entityId === entityId)
    .map((row) => ({
      ...row,
      employeeName: employeeName(row.employeeId),
      roleName: roleName(row.roleId)
    }));
}

export function departmentPeopleRows(departmentId) {
  return peopleRows().filter((row) => row.departmentId === departmentId);
}

export function departmentTasksRows(departmentId) {
  return tasksRows().filter((row) => {
    const assignee = employees.find((item) => item.id === row.assigneeId);
    return assignee?.departmentId === departmentId;
  });
}

export function departmentKnowledgeRows(departmentId) {
  return knowledgeRows().filter((row) => (row.departmentIds || []).includes(departmentId));
}

export function pickEmployee(employeeId) {
  const all = peopleRows();
  return all.find((row) => row.id === employeeId) || all[0] || null;
}

export function pickDepartment(departmentId) {
  const all = orgTreeRows();
  return all.find((row) => row.id === departmentId) || all[0] || null;
}

export function pickProject(projectId) {
  const all = projectsRows();
  return all.find((row) => row.id === projectId) || all[0] || null;
}

export function pickProduct(productId) {
  const all = productsRows();
  return all.find((row) => row.id === productId) || all[0] || null;
}

export function pickKnowledge(knowledgeId) {
  const all = knowledgeRows();
  return all.find((row) => row.id === knowledgeId) || all[0] || null;
}

export function pickNews(newsId) {
  const all = newsRows();
  return all.find((row) => row.id === newsId) || all[0] || null;
}
