import { PortalBaseListForm } from '/portal/forms/portal/lib/base-list-form.js';
import { knowledgeRows, orgTreeRows, peopleRows, projectsRows } from '/portal/forms/portal/lib/portal-utils.js';
import { html } from 'polylib';
import '/generated/components/pl-table-pro.js';

function initials(name) {
  const parts = String(name || '').trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return '—';
  return `${parts[0][0] || ''}${parts[1]?.[0] || ''}`.toUpperCase();
}

const HERO_THEME_DEFAULT = {
  border: 'rgba(46, 84, 102, 0.84)',
  background: 'radial-gradient(circle at 6% 98%, rgba(84, 176, 204, 0.34), transparent 38%), radial-gradient(circle at 92% 6%, rgba(108, 211, 164, 0.28), transparent 42%), radial-gradient(circle at 60% 74%, rgba(64, 125, 188, 0.25), transparent 46%), linear-gradient(118deg, #17344f 0%, #28445e 55%, #2c4f53 100%)'
};

const HERO_THEME_BY_DEPARTMENT = {
  'dep-exec': {
    border: 'rgba(61, 89, 153, 0.84)',
    background: 'radial-gradient(circle at 6% 102%, rgba(89, 133, 255, 0.36), transparent 38%), radial-gradient(circle at 92% 8%, rgba(129, 197, 255, 0.26), transparent 40%), radial-gradient(circle at 58% 72%, rgba(95, 129, 214, 0.24), transparent 42%), linear-gradient(118deg, #202f5c 0%, #2a3f6b 55%, #31516a 100%)'
  },
  'dep-prod': {
    border: 'rgba(33, 128, 101, 0.84)',
    background: 'radial-gradient(circle at 7% 100%, rgba(74, 197, 174, 0.38), transparent 38%), radial-gradient(circle at 91% 10%, rgba(150, 224, 152, 0.28), transparent 40%), radial-gradient(circle at 61% 78%, rgba(76, 164, 141, 0.22), transparent 44%), linear-gradient(118deg, #154f4c 0%, #1f6758 55%, #2b7b63 100%)'
  },
  'dep-eng': {
    border: 'rgba(36, 114, 154, 0.84)',
    background: 'radial-gradient(circle at 8% 102%, rgba(92, 174, 255, 0.36), transparent 40%), radial-gradient(circle at 91% 8%, rgba(120, 222, 255, 0.25), transparent 40%), radial-gradient(circle at 60% 75%, rgba(64, 147, 206, 0.22), transparent 44%), linear-gradient(118deg, #15456b 0%, #20597e 55%, #236a80 100%)'
  },
  'dep-design': {
    border: 'rgba(122, 77, 151, 0.84)',
    background: 'radial-gradient(circle at 8% 102%, rgba(197, 130, 255, 0.34), transparent 38%), radial-gradient(circle at 90% 8%, rgba(255, 168, 212, 0.27), transparent 40%), radial-gradient(circle at 58% 74%, rgba(142, 125, 212, 0.22), transparent 44%), linear-gradient(118deg, #4f335f 0%, #664074 55%, #7a4e7d 100%)'
  },
  'dep-data': {
    border: 'rgba(76, 104, 165, 0.84)',
    background: 'radial-gradient(circle at 7% 102%, rgba(140, 166, 255, 0.34), transparent 38%), radial-gradient(circle at 91% 7%, rgba(154, 212, 255, 0.28), transparent 40%), radial-gradient(circle at 60% 76%, rgba(126, 148, 214, 0.22), transparent 44%), linear-gradient(118deg, #2d3e62 0%, #3b4f76 55%, #486389 100%)'
  },
  'dep-ops': {
    border: 'rgba(166, 101, 52, 0.84)',
    background: 'radial-gradient(circle at 9% 100%, rgba(236, 172, 103, 0.37), transparent 38%), radial-gradient(circle at 92% 8%, rgba(245, 145, 108, 0.26), transparent 40%), radial-gradient(circle at 58% 76%, rgba(203, 137, 84, 0.21), transparent 44%), linear-gradient(118deg, #5b402c 0%, #72503a 55%, #865e45 100%)'
  },
  'dep-hr': {
    border: 'rgba(52, 132, 91, 0.84)',
    background: 'radial-gradient(circle at 8% 102%, rgba(106, 203, 139, 0.36), transparent 38%), radial-gradient(circle at 91% 8%, rgba(168, 229, 152, 0.28), transparent 40%), radial-gradient(circle at 60% 74%, rgba(111, 176, 125, 0.22), transparent 44%), linear-gradient(118deg, #2e5443 0%, #3e6951 55%, #4f7d61 100%)'
  }
};

export default class PortalOrgForm extends PortalBaseListForm {
  static properties = {
    ...PortalBaseListForm.properties,
    formTitle: { type: String, value: 'Портал: Оргструктура' },
    cardRows: { type: Array, value: () => [] },
    cardNavRows: { type: Array, value: () => [] },
    cardTreeRows: { type: Array, value: () => [] },
    cardTreeSelected: { value: () => null, observer: '_cardTreeSelectedObserver' },
    cardExpanded: { type: Object, value: () => ({}) },
    cardSelectedId: { type: String, value: '', observer: '_cardSelectedIdObserver' },
    cardCurrent: { type: Object, value: () => null },
    cardParent: { type: Object, value: () => ({}) },
    cardParentHead: { type: Object, value: () => ({}) },
    cardLeaders: { type: Array, value: () => [] },
    cardEmployees: { type: Array, value: () => [] },
    cardRegulations: { type: Array, value: () => [] },
    cardProjects: { type: Array, value: () => [] }
  };

  static template = html`
    <style>
      [hidden] {
        display: none !important;
      }

      .toolbar {
        width: 100%;
        align-self: stretch;
        box-sizing: border-box;
      }

      .cards-layout {
        flex: 1;
        min-width: 0;
        min-height: 0;
        height: 100%;
        width: 100%;
        align-self: stretch;
        border: 1px solid var(--pl-grey-base);
        border-radius: var(--pl-border-radius);
        background: var(--pl-background-color);
        overflow: hidden;
      }

      .cards-nav {
        width: 360px;
        min-width: 320px;
        height: 100%;
        border-right: 1px solid var(--pl-grey-light);
        background: var(--pl-background-color);
        display: flex;
        flex-direction: column;
        min-height: 0;
      }

      .cards-nav-head {
        min-height: var(--pl-base-size);
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
        padding: 8px 10px;
        box-sizing: border-box;
        border-bottom: 1px solid var(--pl-grey-light);
      }

      .cards-nav-title {
        font: var(--pl-header-font);
        color: var(--pl-header-color);
        font-size: 14px;
        font-weight: 700;
      }

      .cards-tree {
        flex: 1;
        min-height: 0;
        padding: 0 0 1px;
        box-sizing: border-box;
        overflow: hidden;
      }

      .org-tree-grid {
        width: 100%;
        height: 100%;
        min-height: 0;
        border: 0;
        border-radius: 0;
        --pl-table-cell-height: 36px;
        background: var(--pl-background-color);
      }

      .cards-main {
        flex: 1;
        min-width: 0;
        min-height: 0;
        height: 100%;
        overflow: auto;
        padding: 10px;
        box-sizing: border-box;
        border-right: 1px solid var(--pl-grey-light);
        background: var(--pl-background-color);
      }

      .cards-main-inner {
        display: flex;
        flex-direction: column;
        gap: 10px;
      }

      .dept-hero {
        position: relative;
        min-height: 170px;
        border-radius: 14px;
        overflow: hidden;
        border: 1px solid rgba(33, 76, 90, 0.78);
        background:
          radial-gradient(circle at 10% 110%, rgba(91, 170, 255, 0.34), transparent 38%),
          radial-gradient(circle at 84% 16%, rgba(112, 221, 166, 0.36), transparent 44%),
          radial-gradient(circle at 63% 90%, rgba(118, 197, 255, 0.28), transparent 40%),
          linear-gradient(120deg, #1b3f60 0%, #2a6073 45%, #2d7b69 100%);
        color: #f7fbfa;
        padding: 14px;
        box-sizing: border-box;
      }

      .dept-title {
        margin: 0;
        font: var(--pl-header-font);
        font-size: 36px;
        font-weight: 800;
        line-height: 1.1;
      }

      .dept-desc {
        margin-top: 10px;
        max-width: 980px;
        font: var(--pl-text-font);
        font-size: 15px;
        line-height: 1.45;
        color: rgba(247, 251, 250, 0.92);
        white-space: pre-wrap;
      }

      .dept-rich-grid {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 10px;
      }

      .dept-rich-card {
        border: 1px solid var(--pl-grey-base);
        border-radius: var(--pl-border-radius);
        background: var(--pl-background-color);
        padding: 10px;
        box-sizing: border-box;
        min-height: 136px;
      }

      .dept-rich-head {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 8px;
      }

      .dept-rich-title {
        font: var(--pl-header-font);
        color: var(--pl-header-color);
        font-size: 18px;
        font-weight: 700;
      }

      .dept-list {
        margin: 0;
        padding: 0;
        display: grid;
        gap: 6px;
      }

      .dept-list-item {
        border: 1px solid transparent;
        border-radius: 10px;
        background: var(--pl-background-color);
        padding: 8px;
        box-sizing: border-box;
        cursor: pointer;
      }

      .dept-list-item:hover {
        border-color: var(--pl-primary-light);
      }

      .dept-list-name {
        font: var(--pl-header-font);
        color: var(--pl-header-color);
        font-size: 13px;
        font-weight: 700;
        line-height: 1.35;
      }

      .dept-list-meta {
        margin-top: 2px;
        font: var(--pl-text-font);
        color: var(--pl-grey-darkest);
        font-size: 12px;
      }

      .staff-list {
        margin-top: 8px;
        display: grid;
        gap: 6px;
      }

      .staff-person {
        border: 1px solid transparent;
        border-radius: var(--pl-border-radius);
        background: var(--pl-background-color);
        padding: 7px 8px;
        box-sizing: border-box;
        display: grid;
        grid-template-columns: 34px minmax(0, 1fr) 24px;
        gap: 8px;
        align-items: center;
        cursor: pointer;
      }

      .staff-person:hover {
        border-color: var(--pl-primary-light);
      }

      .staff-avatar {
        width: 34px;
        height: 34px;
        border-radius: 999px;
        border: 1px solid var(--pl-grey-base);
        background: var(--pl-background-color);
        overflow: hidden;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        font: var(--pl-text-font);
        color: var(--pl-grey-darkest);
        font-size: 11px;
        font-weight: 700;
      }

      .staff-avatar img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
      }

      .staff-avatar span,
      .leader-avatar span {
        width: 100%;
        height: 100%;
        display: inline-flex;
        align-items: center;
        justify-content: center;
      }

      .staff-person-main {
        min-width: 0;
      }

      .staff-name {
        font: var(--pl-header-font);
        color: var(--pl-header-color);
        font-size: 14px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .staff-role {
        margin-top: 2px;
        font: var(--pl-text-font);
        color: var(--pl-grey-darkest);
        font-size: 12px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .staff-arrow {
        color: var(--pl-grey-darkest);
        text-align: center;
        font-size: 18px;
        line-height: 1;
      }

      .cards-side {
        width: 390px;
        min-width: 340px;
        min-height: 0;
        height: 100%;
        max-height: 100%;
        overflow-y: auto;
        overflow-x: hidden;
        padding: 10px;
        box-sizing: border-box;
        background: var(--pl-background-color);
      }

      .side-widget {
        border: 1px solid var(--pl-grey-base);
        border-radius: var(--pl-border-radius);
        background: var(--pl-background-color);
        padding: 10px;
        box-sizing: border-box;
        margin-bottom: 10px;
      }

      .side-widget:last-child {
        margin-bottom: 0;
      }

      .side-title {
        font: var(--pl-header-font);
        color: var(--pl-header-color);
        font-size: 16px;
        font-weight: 700;
      }

      .side-dep-row {
        margin-top: 8px;
        border: 1px solid var(--pl-grey-base);
        border-radius: var(--pl-border-radius);
        padding: 8px;
        box-sizing: border-box;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
        cursor: pointer;
      }

      .side-dep-row:hover {
        border-color: var(--pl-primary-light);
      }

      .side-dep-name {
        font: var(--pl-header-font);
        color: var(--pl-header-color);
        font-size: 14px;
      }

      .leader-list {
        margin-top: 8px;
        display: grid;
        gap: 6px;
      }

      .leader-card {
        border: 1px solid transparent;
        border-radius: var(--pl-border-radius);
        padding: 7px;
        box-sizing: border-box;
        display: grid;
        grid-template-columns: 38px minmax(0, 1fr);
        gap: 8px;
        align-items: center;
        cursor: pointer;
        background: var(--pl-background-color);
      }

      .leader-card:hover {
        border-color: var(--pl-primary-light);
      }

      .leader-avatar {
        width: 38px;
        height: 38px;
        border-radius: 999px;
        overflow: hidden;
        border: 1px solid var(--pl-grey-base);
        background: var(--pl-background-color);
      }

      .leader-avatar img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
      }

      .leader-name {
        font: var(--pl-header-font);
        color: var(--pl-header-color);
        font-size: 13px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .leader-role {
        margin-top: 2px;
        font: var(--pl-text-font);
        color: var(--pl-grey-darkest);
        font-size: 12px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .cards-empty {
        color: var(--pl-grey-darkest);
        font: var(--pl-text-font);
        font-size: 13px;
        padding: 8px;
      }

      @media (max-width: 1420px) {
        .cards-side {
          width: 320px;
          min-width: 300px;
        }

        .dept-rich-grid {
          grid-template-columns: 1fr;
        }
      }

      @media (max-width: 1260px) {
        .cards-layout {
          flex-direction: column;
        }

        .cards-nav,
        .cards-side {
          width: 100%;
          min-width: 0;
          height: auto;
          max-height: none;
          border-right: 0;
          border-top: 1px solid var(--pl-grey-light);
        }

        .cards-main {
          height: auto;
          border-right: 0;
        }
      }

      @media (max-width: 1200px) {
        .dept-title {
          font-size: 28px;
        }

        .dept-desc {
          font-size: 16px;
        }
      }
    </style>

    <pl-flex-layout class="shell" vertical fit gap="8">
      <pl-flex-layout class="toolbar">
        <pl-input placeholder="Поиск" value="{{search}}">
          <pl-icon slot="prefix" iconset="pl-default" icon="search" size="16"></pl-icon>
        </pl-input>
      </pl-flex-layout>

      <pl-flex-layout class="cards-layout">
        <div class="cards-nav">
          <div class="cards-nav-head">
            <span class="cards-nav-title">Структура отделов</span>
          </div>
          <div class="cards-tree">
            <pl-table-pro
              id="orgTreeGrid"
              class="org-tree-grid"
              data="{{cardTreeRows}}"
              selected="{{cardTreeSelected}}"
              tree
              key-field="id"
              pkey-field="pid"
              has-child-field="_haschildren"
              enable-settings="false">
              <pl-table-pro-column id="node_name" field="name" header="Узел" width="420" sortable="false"></pl-table-pro-column>
            </pl-table-pro>
          </div>
        </div>

        <div class="cards-main">
          <div class="cards-main-inner">
            <section class="dept-hero" style$="[[cardHeroStyle(cardCurrent)]]">
              <h2 class="dept-title">[[cardDisplayTitle(cardCurrent)]]</h2>
              <div class="dept-desc">[[departmentLongDescription(cardCurrent)]]</div>
            </section>

            <section class="dept-rich-grid">
              <article class="dept-rich-card">
                <div class="dept-rich-head">
                  <span class="dept-rich-title">Регламенты</span>
                  <pl-badge>[[cardRegulations.length]]</pl-badge>
                </div>
                <div class="dept-list">
                  <template d:repeat="[[cardRegulations]]">
                    <div class="dept-list-item" data-knowledge-id$="[[item.id]]" on-click="[[onOpenKnowledge]]">
                      <div class="dept-list-name">[[item.title]]</div>
                      <div class="dept-list-meta">[[item.category]] · Обновлено [[item.updatedAtRu]]</div>
                    </div>
                  </template>
                  <div class="cards-empty" hidden$="[[cardRegulations.length]]">Регламенты не найдены</div>
                </div>
              </article>

              <article class="dept-rich-card">
                <div class="dept-rich-head">
                  <span class="dept-rich-title">Проекты отдела</span>
                  <pl-badge>[[cardProjects.length]]</pl-badge>
                </div>
                <div class="dept-list">
                  <template d:repeat="[[cardProjects]]">
                    <div class="dept-list-item" data-project-id$="[[item.id]]" on-click="[[onOpenProject]]">
                      <div class="dept-list-name">[[item.name]]</div>
                      <div class="dept-list-meta">[[item.code]] · [[item.statusLabel]]</div>
                    </div>
                  </template>
                  <div class="cards-empty" hidden$="[[cardProjects.length]]">У отдела пока нет активных проектов</div>
                </div>
              </article>
            </section>

          </div>
        </div>

        <div class="cards-side">
          <section class="side-widget">
            <div class="side-title">Вышестоящее подразделение</div>
            <div class="side-dep-row" hidden$="[[isEmpty(cardParent.id)]]" data-department-id$="[[cardParent.id]]" on-click="[[onSelectDepartment]]">
              <span class="side-dep-name">[[cardParent.name]]</span>
              <span>›</span>
            </div>
            <div class="cards-empty" hidden$="[[hasValue(cardParent.id)]]">Нет родительского подразделения</div>

            <div class="leader-list">
              <div class="leader-card" hidden$="[[isEmpty(cardParentHead.id)]]" data-employee-id$="[[cardParentHead.id]]" on-click="[[onOpenEmployee]]">
                <div class="leader-avatar">
                  <img src$="[[cardParentHead.photoUrl]]" alt$="[[cardParentHead.displayName]]" hidden$="[[isEmpty(cardParentHead.photoUrl)]]">
                  <span hidden$="[[hasValue(cardParentHead.photoUrl)]]">[[cardParentHead.initials]]</span>
                </div>
                <div>
                  <div class="leader-name">[[cardParentHead.displayName]]</div>
                  <div class="leader-role">Руководитель</div>
                </div>
              </div>
            </div>
          </section>

          <section class="side-widget">
            <div class="side-title">Руководство подразделения</div>
            <div class="leader-list">
              <template d:repeat="[[cardLeaders]]">
                <div class="leader-card" data-employee-id$="[[item.id]]" on-click="[[onOpenEmployee]]">
                  <div class="leader-avatar">
                    <img src$="[[item.photoUrl]]" alt$="[[item.displayName]]" hidden$="[[isEmpty(item.photoUrl)]]">
                    <span hidden$="[[hasValue(item.photoUrl)]]">[[item.initials]]</span>
                  </div>
                  <div>
                    <div class="leader-name">[[item.displayName]]</div>
                    <div class="leader-role">[[item.title]]</div>
                  </div>
                </div>
              </template>
              <div class="cards-empty" hidden$="[[cardLeaders.length]]">Руководители не определены</div>
            </div>
          </section>

          <section class="side-widget">
            <div class="side-title">Сотрудники подразделения</div>
            <div class="staff-list">
              <template d:repeat="[[cardEmployees]]">
                <div class="staff-person" data-employee-id$="[[item.id]]" on-click="[[onOpenEmployee]]">
                  <span class="staff-avatar">
                    <img src$="[[item.photoUrl]]" alt$="[[item.displayName]]" hidden$="[[isEmpty(item.photoUrl)]]">
                    <span hidden$="[[hasValue(item.photoUrl)]]">[[item.initials]]</span>
                  </span>
                  <span class="staff-person-main">
                    <span class="staff-name">[[item.displayName]]</span>
                    <span class="staff-role">[[item.title]]</span>
                  </span>
                  <span class="staff-arrow">›</span>
                </div>
              </template>
              <div class="cards-empty" hidden$="[[cardEmployees.length]]">Сотрудники не найдены</div>
            </div>
          </section>
        </div>
      </pl-flex-layout>
    </pl-flex-layout>
  `;

  onConnect() {
    super.onConnect();
  }

  getRows() {
    const rows = orgTreeRows();
    const people = peopleRows();

    const childCountByParent = rows.reduce((acc, row) => {
      const pid = row.parentId;
      if (pid) acc[pid] = (acc[pid] || 0) + 1;
      return acc;
    }, {});

    const teamByDepartment = people.reduce((acc, person) => {
      const dep = person.departmentId;
      if (!dep) return acc;
      if (!acc[dep]) acc[dep] = [];
      acc[dep].push({
        id: person.id,
        displayName: person.displayName,
        title: person.title,
        photoUrl: person.photoUrl,
        initials: initials(person.displayName)
      });
      return acc;
    }, {});

    return rows.map((row, index) => ({
      ...row,
      description: row.description || 'Описание подразделения не заполнено',
      pid: row.parentId || null,
      _haschildren: Number(childCountByParent[row.id] || 0) > 0,
      _opened: index === 0 || !row.parentId,
      teamPreview: (teamByDepartment[row.id] || []).slice(0, 4)
    }));
  }

  isEmpty(value) {
    return value === undefined || value === null || value === '';
  }

  hasValue(value) {
    return !this.isEmpty(value);
  }

  isEmptyArray(value) {
    return !Array.isArray(value) || value.length === 0;
  }

  _filteredRowsObserver() {
    super._filteredRowsObserver();
    const cards = this._buildCardRows(this.filteredRows);
    this.cardRows = cards;
    this.cardNavRows = cards;
    this._syncExpandedState(cards);

    if (!cards.length) {
      this.cardSelectedId = '';
      this.cardCurrent = null;
      this.cardParent = {};
      this.cardParentHead = {};
      this.cardLeaders = [];
      this.cardEmployees = [];
      this.cardRegulations = [];
      this.cardProjects = [];
      this.cardTreeRows = [];
      this.cardTreeSelected = null;
      return;
    }

    const activeId = this.activeRow?.id;
    const selectedId = this.cardSelectedId;
    const hasActive = activeId && cards.some((row) => row.id === activeId);
    const hasSelected = selectedId && cards.some((row) => row.id === selectedId);
    const nextSelectedId = hasSelected ? selectedId : hasActive ? activeId : cards[0].id;

    if (nextSelectedId !== this.cardSelectedId) {
      this.cardSelectedId = nextSelectedId;
      return;
    }
    this._expandParentChain(nextSelectedId);
    this._rebuildTreeRows();
    this._syncCardState();
  }

  _cardSelectedIdObserver() {
    this._expandParentChain(this.cardSelectedId);
    this._rebuildTreeRows();
    this._syncCardState();
    this._syncTreeSelection();
  }

  _cardTreeSelectedObserver(next) {
    const nextId = next?.id;
    if (!nextId || nextId === this.cardSelectedId) return;
    this.cardSelectedId = nextId;
  }

  _syncExpandedState(rows) {
    const list = Array.isArray(rows) ? rows : [];
    const prev = this.cardExpanded || {};
    const next = {};
    list.forEach((row) => {
      if (Object.prototype.hasOwnProperty.call(prev, row.id)) {
        next[row.id] = !!prev[row.id];
      } else {
        next[row.id] = row.level === 0;
      }
    });
    this.cardExpanded = next;
  }

  _expandParentChain(selectedId) {
    if (!selectedId) return;
    const byId = new Map((this.cardNavRows || []).map((row) => [row.id, row]));
    if (!byId.has(selectedId)) return;
    const next = { ...(this.cardExpanded || {}) };
    let cursor = byId.get(selectedId);
    let changed = false;
    let guard = 0;
    while (cursor?.pid && guard < 30) {
      if (!next[cursor.pid]) {
        next[cursor.pid] = true;
        changed = true;
      }
      cursor = byId.get(cursor.pid);
      guard += 1;
    }
    if (changed) this.cardExpanded = next;
  }

  _rebuildTreeRows() {
    const source = Array.isArray(this.cardNavRows) ? this.cardNavRows : [];
    if (!source.length) {
      this.cardTreeRows = [];
      this.cardTreeSelected = null;
      return;
    }

    const prevOpened = new Map((this.cardTreeRows || []).map((row) => [row.id, !!row._opened]));
    const expanded = this.cardExpanded || {};
    const rows = source.map((row) => {
      const opened = prevOpened.has(row.id) ? prevOpened.get(row.id) : !!expanded[row.id];
      return { ...row, _opened: opened };
    });
    this.cardTreeRows = rows;
    this.cardExpanded = rows.reduce((acc, row) => {
      acc[row.id] = !!row._opened;
      return acc;
    }, {});
  }

  _syncTreeSelection() {
    const selectedId = this.cardSelectedId;
    const selectedRow = (this.cardTreeRows || []).find((row) => row.id === selectedId) || null;
    if (this.cardTreeSelected?.id === selectedRow?.id) return;
    this.cardTreeSelected = selectedRow;
  }

  _syncCardState() {
    const rows = Array.isArray(this.cardRows) ? this.cardRows : [];
    if (!rows.length || !this.cardSelectedId) {
      this.cardCurrent = null;
      this.cardParent = {};
      this.cardParentHead = {};
      this.cardLeaders = [];
      this.cardEmployees = [];
      this.cardRegulations = [];
      this.cardProjects = [];
      return;
    }

    const byDepartment = new Map(rows.map((row) => [row.id, row]));
    const current = byDepartment.get(this.cardSelectedId) || rows[0] || null;
    if (!current) {
      this.cardCurrent = null;
      this.cardParent = {};
      this.cardParentHead = {};
      this.cardLeaders = [];
      this.cardEmployees = [];
      this.cardRegulations = [];
      this.cardProjects = [];
      return;
    }

    const parent = current.pid ? (byDepartment.get(current.pid) || null) : null;
    const people = peopleRows();
    const peopleById = new Map(people.map((row) => [row.id, row]));
    const regulations = knowledgeRows()
      .filter((row) => row.isRegulation && (row.departmentIds || []).includes(current.id))
      .sort((a, b) => new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0))
      .slice(0, 6);
    const projects = projectsRows()
      .filter((row) => {
        const owner = peopleById.get(row.ownerId);
        return owner?.departmentId === current.id;
      })
      .map((row) => ({
        ...row,
        statusLabel: this.projectStatusLabel(row.status)
      }))
      .sort((a, b) => String(a.name || '').localeCompare(String(b.name || ''), 'ru'));

    const departmentEmployees = people
      .filter((row) => row.departmentId === current.id)
      .map((row) => this._personCardRow(row))
      .sort((a, b) => a.displayName.localeCompare(b.displayName, 'ru'));

    const leadersRaw = departmentEmployees.filter((row) => row.id === current.headId || this._isLeaderTitle(row.title));
    if (!leadersRaw.length && current.headId && peopleById.has(current.headId)) {
      leadersRaw.push(this._personCardRow(peopleById.get(current.headId)));
    }
    const leaders = [];
    const leaderIds = new Set();
    leadersRaw.forEach((row) => {
      if (!leaderIds.has(row.id)) {
        leaderIds.add(row.id);
        leaders.push(row);
      }
    });
    if (!leaders.length && departmentEmployees.length) {
      leaders.push(departmentEmployees[0]);
      leaderIds.add(departmentEmployees[0].id);
    }
    const employees = departmentEmployees.filter((row) => !leaderIds.has(row.id));

    const parentHead = parent?.headId && peopleById.has(parent.headId)
      ? this._personCardRow(peopleById.get(parent.headId))
      : null;

    this.cardCurrent = current;
    this.cardParent = parent || {};
    this.cardParentHead = parentHead || {};
    this.cardLeaders = leaders;
    this.cardEmployees = employees;
    this.cardRegulations = regulations;
    this.cardProjects = projects;
  }

  _buildCardRows(rows) {
    const source = Array.isArray(rows) ? rows : [];
    const map = new Map(source.map((row) => [row.id, { ...row, children: [] }]));

    source.forEach((row) => {
      if (row.pid && map.has(row.pid)) {
        map.get(row.pid).children.push(map.get(row.id));
      }
    });

    const roots = source
      .map((row) => map.get(row.id))
      .filter((row) => !row.pid || !map.has(row.pid));

    const flat = [];
    const walk = (row, level) => {
      flat.push({
        ...row,
        level
      });
      (row.children || []).forEach((child) => walk(child, level + 1));
    };

    roots.forEach((row) => walk(row, 0));
    return flat;
  }

  _resolveDepartmentId(event) {
    const currentId = event?.currentTarget?.dataset?.departmentId;
    if (currentId) return currentId;
    const target = event?.target?.closest?.('[data-department-id]');
    if (target?.dataset?.departmentId) return target.dataset.departmentId;
    const modelId = event?.model?.item?.id || event?.detail?.item?.id || event?.detail?.id;
    return modelId || '';
  }

  _resolveEmployeeId(event) {
    const currentId = event?.currentTarget?.dataset?.employeeId;
    if (currentId) return currentId;
    const target = event?.target?.closest?.('[data-employee-id]');
    if (target?.dataset?.employeeId) return target.dataset.employeeId;
    const modelId = event?.model?.item?.id || event?.detail?.item?.id || event?.detail?.id;
    return modelId || '';
  }

  _resolveKnowledgeId(event) {
    const currentId = event?.currentTarget?.dataset?.knowledgeId;
    if (currentId) return currentId;
    const target = event?.target?.closest?.('[data-knowledge-id]');
    if (target?.dataset?.knowledgeId) return target.dataset.knowledgeId;
    const modelId = event?.model?.item?.id || event?.detail?.item?.id || event?.detail?.id;
    return modelId || '';
  }

  _resolveProjectId(event) {
    const currentId = event?.currentTarget?.dataset?.projectId;
    if (currentId) return currentId;
    const target = event?.target?.closest?.('[data-project-id]');
    if (target?.dataset?.projectId) return target.dataset.projectId;
    const modelId = event?.model?.item?.id || event?.detail?.item?.id || event?.detail?.id;
    return modelId || '';
  }

  _personCardRow(person) {
    return {
      id: person.id,
      displayName: person.displayName || person.name || 'Без имени',
      title: person.title || 'Сотрудник',
      photoUrl: person.photoUrl || '',
      initials: initials(person.displayName || person.name)
    };
  }

  _isLeaderTitle(title) {
    const value = String(title || '').toLowerCase();
    return value.includes('руковод') || value.includes('директор') || value.includes('head') || value.includes('lead');
  }


  cardDisplayTitle(current) {
    return current?.name || 'Подразделение';
  }

  cardHeroStyle(current) {
    const departmentId = current?.id || '';
    const theme = HERO_THEME_BY_DEPARTMENT[departmentId] || HERO_THEME_DEFAULT;
    return `border-color: ${theme.border}; background: ${theme.background};`;
  }

  departmentLongDescription(current) {
    if (!current) return 'Выберите подразделение в дереве отделов.';
    const name = current.name || 'Подразделение';
    const description = current.description || 'Описание подразделения пока не заполнено.';
    const head = current.headName || 'не назначен';
    const locations = current.locationNames || 'не указаны';
    return `${name} отвечает за достижение целей направления и устойчивость ключевых процессов.

${description}

Руководитель: ${head}. Локации работы: ${locations}. Внутри подразделения ${this.cardEmployees.length} сотрудник(ов), фокус на стандартизации процессов, исполнении KPI и взаимодействии со смежными командами.`;
  }

  projectStatusLabel(status) {
    const dict = {
      active: 'Активный',
      onHold: 'На паузе',
      done: 'Завершен',
      planned: 'Планируется',
      cancelled: 'Отменен'
    };
    return dict[status] || 'Без статуса';
  }

  treeRowClass(id, selectedId) {
    return id === selectedId ? 'tree-row is-active' : 'tree-row';
  }

  treeToggleClass(hasChildren) {
    return hasChildren ? 'tree-toggle' : 'tree-toggle is-empty';
  }

  treeToggleLabel(hasChildren, isOpen) {
    if (!hasChildren) return '';
    return isOpen ? '▾' : '▸';
  }

  onToggleTreeNode(event) {
    event?.stopPropagation?.();
    const id = this._resolveDepartmentId(event);
    if (!id) return;
    const row = (this.cardNavRows || []).find((item) => item.id === id);
    if (!row?._haschildren) return;

    const next = { ...(this.cardExpanded || {}) };
    next[id] = !next[id];
    this.cardExpanded = next;
    this._rebuildTreeRows();
  }

  onSelectDepartment(event) {
    event?.stopPropagation?.();
    const id = this._resolveDepartmentId(event);
    if (!id || id === this.cardSelectedId) return;
    this.cardSelectedId = id;
  }

  async onOpenEmployee(event) {
    event?.stopPropagation?.();
    const id = this._resolveEmployeeId(event);
    if (!id) return;
    await this.open('portal.employee_detail', { selectedId: id });
  }

  async onOpenKnowledge(event) {
    event?.stopPropagation?.();
    const id = this._resolveKnowledgeId(event);
    if (!id) return;
    await this.open('portal.knowledge_detail', { selectedId: id });
  }

  async onOpenProject(event) {
    event?.stopPropagation?.();
    const id = this._resolveProjectId(event);
    if (!id) return;
    await this.open('portal.project_detail', { selectedId: id });
  }
}
