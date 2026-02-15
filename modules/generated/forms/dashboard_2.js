import { html, css } from 'polylib';
import { PlForm } from '@nfjs/front-pl/components/pl-form.js';
import '@plcmp/pl-flex-layout';
import '@plcmp/pl-icon';
import '@plcmp/pl-icon-button';
import '@plcmp/pl-input';
import '@plcmp/pl-checkbox';
import '/generated/components/pl-table-pro.js';
import '/generated/components/pl-gantt.js';

function formatRuDate(date) {
  if (!(date instanceof Date)) return '';
  const weekday = date.toLocaleDateString('ru-RU', { weekday: 'long' });
  const day = date.toLocaleDateString('ru-RU', { day: 'numeric' });
  const month = date.toLocaleDateString('ru-RU', { month: 'long' });
  const year = date.toLocaleDateString('ru-RU', { year: 'numeric' });
  const capWeekday = weekday ? weekday[0].toUpperCase() + weekday.slice(1) : '';
  return `${capWeekday}, ${day} ${month} ${year} г.`;
}

function createWeekDays(baseDate) {
  const days = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
  return Array.from({ length: 7 }, (_, idx) => {
    const date = new Date(baseDate.getTime());
    date.setDate(baseDate.getDate() + idx);
    return {
      code: days[date.getDay()],
      day: String(date.getDate()),
      selected: idx === 0
    };
  });
}

function initials(name) {
  const parts = String(name || '').trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return '';
  const first = parts[0][0] || '';
  const second = parts[1]?.[0] || '';
  return `${first}${second}`.toUpperCase();
}

function statusTone(status) {
  const normalized = String(status || '').trim().toLowerCase();
  if (normalized.includes('работ')) return 'in-work';
  return 'todo';
}

export default class GeneratedDashboard2 extends PlForm {
  static properties = {
    formTitle: { type: String, value: 'Generated: Dashboard 2' },
    search: { type: String, value: '' },
    todayLine: { type: String, value: '' },
    stats: { type: Array, value: () => [] },
    highlights: { type: Array, value: () => [] },
    tasks: { type: Array, value: () => [] },
    selectedTask: { value: () => null },
    docs: { type: Array, value: () => [] },
    calendarDays: { type: Array, value: () => [] },
    calendarEvents: { type: Array, value: () => [] },
    birthdays: { type: Array, value: () => [] },
    hrAbsenceSummary: { type: Array, value: () => [] },
    hrAbsences: { type: Array, value: () => [] },
    hrEvents: { type: Array, value: () => [] },
    vacationPlan: { type: Array, value: () => [] }
  };

  static css = css`
    :host {
      display: block;
      width: 100%;
      height: 100%;
      min-width: 0;
      min-height: 0;
      background: var(--pl-grey-lightest);
      color: var(--pl-text-color);
      overflow: hidden;
    }

    .layout {
      width: 100%;
      height: 100%;
      min-width: 0;
      min-height: 0;
      overflow: hidden;
    }

    .topbar {
      min-height: calc(var(--pl-base-size) + 8px);
      border-bottom: 1px solid var(--pl-grey-light);
      background: var(--pl-background-color);
      padding: 8px 14px;
      box-sizing: border-box;
      gap: 10px;
      align-items: center;
      flex-wrap: nowrap;
    }

    .page-title {
      font: var(--pl-header-font);
      color: var(--pl-header-color);
      font-size: 22px;
      font-weight: 700;
      line-height: 1;
      white-space: nowrap;
      flex-shrink: 0;
    }

    .portal-search {
      min-width: 260px;
      max-width: 620px;
      flex: 1;
    }

    .search-hint {
      color: var(--pl-grey-darkest);
      font: var(--pl-text-font);
      font-size: 12px;
      white-space: nowrap;
      user-select: none;
      padding-inline-end: 6px;
    }

    .add-btn {
      border-radius: 999px;
    }

    .notif-wrap {
      position: relative;
      display: inline-flex;
      flex-shrink: 0;
    }

    .notif-dot {
      position: absolute;
      top: -2px;
      right: -2px;
      min-width: 16px;
      height: 16px;
      border-radius: 999px;
      background: var(--pl-negative-base);
      color: #fff;
      font: var(--pl-text-font);
      font-size: 10px;
      font-weight: 700;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border: 2px solid var(--pl-background-color);
      box-sizing: border-box;
      line-height: 1;
    }

    .profile-card {
      min-height: var(--pl-base-size);
      border: 1px solid var(--pl-grey-base);
      border-radius: 999px;
      background: var(--pl-background-color);
      box-sizing: border-box;
      padding: 4px 8px;
      gap: 8px;
      min-width: 220px;
      max-width: 320px;
      flex-shrink: 0;
    }

    .profile-avatar {
      width: 32px;
      height: 32px;
      border-radius: 999px;
      background: linear-gradient(135deg, #7db8f0 0%, #4f8fcf 100%);
      color: var(--pl-background-color);
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font: var(--pl-header-font);
      font-size: 13px;
      font-weight: 700;
      flex-shrink: 0;
    }

    .profile-name {
      min-width: 0;
      font: var(--pl-header-font);
      color: var(--pl-header-color);
      font-weight: 700;
      font-size: 14px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .profile-role {
      min-width: 0;
      color: var(--pl-grey-darkest);
      font: var(--pl-text-font);
      font-size: 12px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .content-scroll {
      flex: 1;
      min-height: 0;
      overflow: auto;
      padding: 14px;
      box-sizing: border-box;
    }

    .welcome-title {
      font: var(--pl-header-font);
      color: var(--pl-header-color);
      font-size: 44px;
      font-weight: 700;
      line-height: 1.08;
      margin: 0;
    }

    .welcome-date {
      font: var(--pl-text-font);
      color: var(--pl-grey-darkest);
      font-size: 18px;
      margin-top: 2px;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(4, minmax(180px, 1fr));
      gap: 8px;
      margin-top: 10px;
    }

    .stat-card {
      border: 1px solid var(--pl-grey-base);
      border-radius: 16px;
      background: var(--pl-background-color);
      padding: 10px 12px;
      box-sizing: border-box;
      min-height: 112px;
    }

    .stat-title {
      font: var(--pl-header-font);
      color: var(--pl-grey-darkest);
      font-size: 15px;
      font-weight: 600;
    }

    .stat-value {
      margin-top: 4px;
      font: var(--pl-header-font);
      color: var(--pl-header-color);
      font-size: 42px;
      line-height: 1;
      font-weight: 800;
    }

    .stat-sub {
      margin-top: 2px;
      font: var(--pl-text-font);
      color: var(--pl-grey-darkest);
      font-size: 13px;
    }

    .highlight-grid {
      display: grid;
      grid-template-columns: repeat(4, minmax(220px, 1fr));
      gap: 8px;
      margin-top: 8px;
    }

    .highlight {
      border-radius: 20px;
      min-height: 174px;
      color: #fff;
      padding: 18px 18px 16px;
      box-sizing: border-box;
      position: relative;
      overflow: hidden;
    }

    .highlight::before {
      content: '';
      position: absolute;
      left: -38px;
      bottom: -44px;
      width: 170px;
      height: 112px;
      border-radius: 999px;
      background: rgba(255, 255, 255, 0.11);
    }

    .highlight::after {
      content: '';
      position: absolute;
      right: -30px;
      top: -24px;
      width: 176px;
      height: 176px;
      border-radius: 999px;
      background: rgba(255, 255, 255, 0.14);
    }

    .highlight.teal {
      background: linear-gradient(120deg, #2f9388 0%, #67b9a7 100%);
    }

    .highlight.blue {
      background: linear-gradient(120deg, #5f82a6 0%, #89acc7 100%);
    }

    .highlight.green {
      background: linear-gradient(120deg, #4a9164 0%, #81b979 100%);
    }

    .highlight-tag {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-height: 26px;
      border-radius: 999px;
      background: rgba(255, 255, 255, 0.24);
      padding: 0 12px;
      font: var(--pl-text-font);
      font-size: 12px;
      font-weight: 700;
      letter-spacing: .03em;
      text-transform: uppercase;
      margin-bottom: 10px;
    }

    .highlight-title {
      position: relative;
      z-index: 1;
      font: var(--pl-header-font);
      font-size: 22px;
      line-height: 1.14;
      font-weight: 700;
      max-width: 94%;
    }

    .highlight-date {
      position: absolute;
      left: 18px;
      bottom: 12px;
      font: var(--pl-text-font);
      font-size: 14px;
      color: rgba(255, 255, 255, 0.88);
      z-index: 1;
      font-weight: 600;
    }

    .content-grid {
      display: grid;
      grid-template-columns: minmax(420px, 1.2fr) minmax(360px, 0.95fr) minmax(280px, 0.62fr);
      gap: 8px;
      margin-top: 8px;
      align-items: stretch;
    }

    .right-column {
      display: grid;
      gap: 8px;
      align-content: start;
    }

    .lower-grid {
      display: grid;
      grid-template-columns: minmax(560px, 1.45fr) minmax(280px, 0.62fr);
      gap: 8px;
      margin-top: 8px;
      align-items: stretch;
    }

    .panel {
      border: 1px solid var(--pl-grey-base);
      border-radius: 14px;
      background: var(--pl-background-color);
      min-height: 120px;
      box-sizing: border-box;
      overflow: hidden;
    }

    .panel-head {
      min-height: 40px;
      border-bottom: 1px solid var(--pl-grey-light);
      padding: 8px 12px;
      box-sizing: border-box;
      background: var(--pl-background-color);
    }

    .panel-title {
      font: var(--pl-header-font);
      font-size: 16px;
      font-weight: 700;
      color: var(--pl-header-color);
      line-height: 1.15;
    }

    .panel-link {
      color: var(--pl-primary-dark);
      font: var(--pl-header-font);
      font-size: 14px;
      font-weight: 700;
      white-space: nowrap;
      cursor: pointer;
    }

    .task-grid-wrap {
      height: 356px;
      min-height: 260px;
    }

    .task-grid-wrap pl-table-pro {
      width: 100%;
      height: 100%;
      border: 0;
      border-radius: 0;
    }

    .doc-list {
      padding: 10px 12px;
      box-sizing: border-box;
      height: 356px;
      overflow: auto;
    }

    .doc-item {
      border: 1px solid var(--pl-grey-base);
      border-radius: 12px;
      padding: 10px;
      margin-bottom: 8px;
      box-sizing: border-box;
      background: var(--pl-background-color);
    }

    .doc-title {
      font: var(--pl-header-font);
      font-size: 14px;
      color: var(--pl-header-color);
      font-weight: 700;
      line-height: 1.15;
    }

    .doc-title.accent {
      color: var(--pl-primary-dark);
    }

    .doc-sub {
      margin-top: 2px;
      color: var(--pl-grey-darkest);
      font: var(--pl-text-font);
      font-size: 13px;
    }

    .doc-date {
      margin-top: 4px;
      color: var(--pl-grey-darkest);
      font: var(--pl-text-font);
      font-size: 12px;
    }

    .calendar-wrap {
      padding: 10px 12px;
      box-sizing: border-box;
    }

    .calendar-sub {
      color: var(--pl-grey-darkest);
      font: var(--pl-text-font);
      font-size: 14px;
      margin-bottom: 8px;
    }

    .days {
      display: grid;
      grid-template-columns: repeat(7, minmax(38px, 1fr));
      gap: 4px;
      margin-bottom: 8px;
    }

    .day-cell {
      border: 1px solid var(--pl-grey-base);
      border-radius: 10px;
      background: var(--pl-background-color);
      min-height: 56px;
      padding: 4px 2px;
      box-sizing: border-box;
      text-align: center;
      color: var(--pl-header-color);
    }

    .day-cell.selected {
      background: var(--pl-primary-lightest);
      border-color: var(--pl-primary-light);
      color: var(--pl-primary-dark);
      font-weight: 700;
    }

    .day-code {
      font: var(--pl-text-font);
      font-size: 12px;
      color: var(--pl-grey-darkest);
    }

    .day-num {
      font: var(--pl-header-font);
      font-size: 16px;
      margin-top: 2px;
      font-weight: 700;
    }

    .agenda-item {
      border: 1px solid var(--pl-grey-base);
      border-radius: 10px;
      background: var(--pl-background-color);
      padding: 8px;
      margin-bottom: 8px;
      box-sizing: border-box;
    }

    .agenda-tag {
      display: inline-flex;
      align-items: center;
      min-height: 22px;
      border-radius: 999px;
      padding: 0 8px;
      font: var(--pl-text-font);
      font-size: 12px;
      font-weight: 700;
      color: #fff;
      margin-bottom: 6px;
      background: #2c8f62;
    }

    .agenda-tag.warn {
      background: #bd7a2e;
    }

    .agenda-time {
      font: var(--pl-header-font);
      font-size: 15px;
      color: var(--pl-header-color);
      font-weight: 700;
      line-height: 1.2;
    }

    .agenda-text {
      margin-top: 2px;
      font: var(--pl-text-font);
      font-size: 14px;
      color: var(--pl-header-color);
      line-height: 1.2;
    }

    .birthday-list {
      padding: 10px 12px;
      box-sizing: border-box;
    }

    .birthday-panel {
      display: flex;
      flex-direction: column;
      min-height: 0;
    }

    .birthday-panel .birthday-list {
      flex: 1;
      min-height: 0;
      overflow: auto;
    }

    .birthday-item {
      border: 1px solid var(--pl-grey-base);
      border-radius: 12px;
      background: var(--pl-background-color);
      padding: 8px 10px;
      margin-bottom: 8px;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .birthday-avatar {
      width: 56px;
      height: 56px;
      border-radius: 999px;
      color: #fff;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font: var(--pl-header-font);
      font-size: 16px;
      font-weight: 700;
      flex-shrink: 0;
      background: linear-gradient(140deg, #4f8fcf 0%, #7db8f0 100%);
    }

    .birthday-avatar.t2 {
      background: linear-gradient(140deg, #635f8f 0%, #a39cd6 100%);
    }

    .birthday-avatar.t3 {
      background: linear-gradient(140deg, #6a7a4c 0%, #92b86a 100%);
    }

    .birthday-info {
      min-width: 0;
    }

    .birthday-name {
      font: var(--pl-header-font);
      font-size: 15px;
      font-weight: 700;
      color: var(--pl-primary-dark);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .birthday-date {
      margin-top: 2px;
      font: var(--pl-text-font);
      font-size: 13px;
      color: var(--pl-grey-darkest);
    }

    .hr-panel {
      margin-top: 0;
    }

    .hr-widgets {
      padding: 10px 12px 14px;
      box-sizing: border-box;
      display: grid;
      grid-template-columns: minmax(280px, 1fr) minmax(320px, 1fr);
      gap: 12px;
    }

    .hr-widget {
      border: 1px solid var(--pl-grey-base);
      border-radius: 12px;
      background: var(--pl-background-color);
      min-height: 220px;
      padding: 10px;
      box-sizing: border-box;
    }

    .hr-list-title,
    .hr-widget-title {
      font: var(--pl-header-font);
      font-size: 15px;
      color: var(--pl-header-color);
      font-weight: 700;
      margin-bottom: 4px;
    }

    .hr-widget-link {
      color: var(--pl-primary-dark);
      font: var(--pl-header-font);
      font-size: 14px;
      font-weight: 700;
      white-space: nowrap;
      cursor: pointer;
    }

    .hr-chips {
      display: flex;
      gap: 6px;
      flex-wrap: wrap;
      margin-bottom: 10px;
    }

    .hr-chip {
      display: inline-flex;
      align-items: center;
      min-height: 22px;
      border-radius: 999px;
      padding: 0 10px;
      border: 1px solid var(--pl-primary-light);
      background: var(--pl-primary-lightest);
      color: var(--pl-primary-dark);
      font: var(--pl-text-font);
      font-size: 12px;
      white-space: nowrap;
    }

    .absence-item {
      border: 1px solid var(--pl-grey-base);
      border-radius: 12px;
      padding: 8px;
      margin-bottom: 8px;
      display: flex;
      align-items: center;
      gap: 10px;
      box-sizing: border-box;
      background: var(--pl-background-color);
    }

    .absence-avatar {
      width: 38px;
      height: 38px;
      border-radius: 999px;
      background: linear-gradient(140deg, #4f8fcf 0%, #7db8f0 100%);
      color: #fff;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font: var(--pl-header-font);
      font-size: 12px;
      font-weight: 700;
      flex-shrink: 0;
    }

    .absence-avatar.t2 {
      background: linear-gradient(140deg, #635f8f 0%, #a39cd6 100%);
    }

    .absence-avatar.t3 {
      background: linear-gradient(140deg, #7f6f4e 0%, #d6b779 100%);
    }

    .absence-avatar.t4 {
      background: linear-gradient(140deg, #5d6f56 0%, #82a776 100%);
    }

    .absence-main {
      min-width: 0;
    }

    .absence-name {
      font: var(--pl-header-font);
      font-size: 15px;
      color: var(--pl-primary-dark);
      font-weight: 700;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .absence-meta {
      margin-top: 2px;
      font: var(--pl-text-font);
      font-size: 13px;
      color: var(--pl-grey-darkest);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .corp-item {
      border: 1px solid var(--pl-grey-base);
      border-radius: 12px;
      padding: 8px 10px;
      margin-bottom: 8px;
      box-sizing: border-box;
      background: var(--pl-background-color);
    }

    .corp-title {
      font: var(--pl-header-font);
      font-size: 15px;
      color: var(--pl-header-color);
      font-weight: 700;
    }

    .corp-meta,
    .corp-place {
      margin-top: 2px;
      font: var(--pl-text-font);
      font-size: 13px;
      color: var(--pl-grey-darkest);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .corp-bottom {
      margin-top: 8px;
    }

    .participants {
      display: inline-flex;
      align-items: center;
      gap: 4px;
    }

    .participant {
      width: 24px;
      height: 24px;
      border-radius: 999px;
      background: linear-gradient(140deg, #4f8fcf 0%, #7db8f0 100%);
      color: #fff;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font: var(--pl-text-font);
      font-size: 10px;
      font-weight: 700;
      border: 1px solid var(--pl-background-color);
      margin-inline-start: -4px;
      box-sizing: border-box;
    }

    .participant:first-child {
      margin-inline-start: 0;
    }

    .participant.t2 {
      background: linear-gradient(140deg, #635f8f 0%, #a39cd6 100%);
    }

    .participant.t3 {
      background: linear-gradient(140deg, #7f6f4e 0%, #d6b779 100%);
    }

    .participant.t4 {
      background: linear-gradient(140deg, #5d6f56 0%, #82a776 100%);
    }

    .corp-stats {
      text-align: right;
      font: var(--pl-text-font);
      font-size: 13px;
      color: var(--pl-primary-dark);
      line-height: 1.2;
      white-space: nowrap;
    }

    .vacation-panel {
      margin-top: 8px;
    }

    .vacation-body {
      padding: 0;
      box-sizing: border-box;
    }

    .vacation-gantt-wrap {
      width: 100%;
      height: 360px;
      min-height: 300px;
    }

    .vacation-gantt-wrap pl-gantt {
      width: 100%;
      height: 100%;
      border: 0;
      border-radius: 0;
      --pl-gantt-ok-color: #2c8f62;
      --pl-gantt-ok-border: #8fd0b4;
      --pl-gantt-ok-bg: #e7f7ee;
      --pl-gantt-warn-color: #8c6200;
      --pl-gantt-warn-border: #f2ca78;
      --pl-gantt-warn-bg: #fff4de;
      --pl-gantt-bad-color: #a33434;
      --pl-gantt-bad-border: #efaaaa;
      --pl-gantt-bad-bg: #ffe8e8;
      --pl-gantt-info-color: #2f5daa;
      --pl-gantt-info-border: #a9bff2;
      --pl-gantt-info-bg: #e9f1ff;
    }

    .hr-item {
      min-height: 32px;
      border: 1px solid var(--pl-grey-light);
      border-radius: 10px;
      padding: 6px 8px;
      box-sizing: border-box;
      margin-bottom: 6px;
      font: var(--pl-text-font);
      font-size: 14px;
      color: var(--pl-header-color);
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
    }

    .muted {
      color: var(--pl-grey-darkest);
      font-size: 12px;
      white-space: nowrap;
    }

    .hr-caption {
      color: var(--pl-grey-darkest);
      font: var(--pl-text-font);
      font-size: 13px;
      font-weight: 500;
      white-space: nowrap;
    }

    @media (max-width: 1560px) {
      .content-grid {
        grid-template-columns: minmax(380px, 1fr) minmax(320px, .92fr);
      }

      .calendar-panel {
        grid-column: 1 / -1;
      }

      .lower-grid {
        grid-template-columns: 1fr;
      }
    }

    @media (max-width: 1120px) {
      .topbar {
        flex-wrap: wrap;
      }

      .portal-search {
        min-width: 0;
        width: 100%;
        max-width: none;
      }

      .stats-grid {
        grid-template-columns: repeat(2, minmax(180px, 1fr));
      }

      .highlight-grid {
        grid-template-columns: repeat(2, minmax(220px, 1fr));
      }

      .content-grid {
        grid-template-columns: 1fr;
      }

      .lower-grid {
        grid-template-columns: 1fr;
      }

      .hr-widgets {
        grid-template-columns: 1fr;
      }
    }
  `;

  static template = html`
    <pl-flex-layout class="layout" vertical fit>
      <pl-flex-layout class="topbar">
        <pl-icon-button variant="secondary" iconset="pl-default" icon="chevron-left"></pl-icon-button>
        <div class="page-title">Главная</div>
        <pl-input class="portal-search" placeholder="Поиск по порталу..." value="{{search}}">
          <pl-icon slot="prefix" iconset="pl-default" icon="search" size="16"></pl-icon>
          <span slot="suffix" class="search-hint">⌘K / Ctrl+K</span>
        </pl-input>
        <pl-icon-button class="add-btn" iconset="pl-default" icon="plus"></pl-icon-button>
        <span class="notif-wrap">
          <pl-icon-button variant="secondary" iconset="pl-default" icon="notifications"></pl-icon-button>
          <span class="notif-dot">2</span>
        </span>
        <pl-flex-layout class="profile-card" align="center">
          <span class="profile-avatar">АВ</span>
          <pl-flex-layout vertical fit gap="0">
            <div class="profile-name">Александр Волков</div>
            <div class="profile-role">Генеральный директор</div>
          </pl-flex-layout>
          <pl-icon iconset="pl-default" icon="chevron-down-s" size="16"></pl-icon>
        </pl-flex-layout>
      </pl-flex-layout>

      <div class="content-scroll">
        <h1 class="welcome-title">Доброе утро, Александр!</h1>
        <div class="welcome-date">[[todayLine]]</div>

        <div class="stats-grid">
          <template d:repeat="[[stats]]">
            <div class="stat-card">
              <div class="stat-title">[[item.title]]</div>
              <div class="stat-value">[[item.value]]</div>
              <div class="stat-sub">[[item.subtitle]]</div>
            </div>
          </template>
        </div>

        <div class="highlight-grid">
          <template d:repeat="[[highlights]]">
            <div class$="highlight [[item.tone]]">
              <div class="highlight-tag" hidden$="[[!item.tag]]">[[item.tag]]</div>
              <div class="highlight-title">[[item.title]]</div>
              <div class="highlight-date">[[item.date]]</div>
            </div>
          </template>
        </div>

        <div class="content-grid">
          <div class="panel">
            <pl-flex-layout class="panel-head" align="center" justify="space-between">
              <div class="panel-title">Предстоящие задачи</div>
              <div class="panel-link">Все задачи</div>
            </pl-flex-layout>
            <div class="task-grid-wrap">
              <pl-table-pro
                data="{{tasks}}"
                selected="{{selectedTask}}"
                settings-key="generated.dashboard_2.tasks">
                <template is="extra styles">
                  <style>
                    .task-owner-cell {
                      display: inline-flex;
                      align-items: center;
                      gap: 8px;
                      min-width: 0;
                    }

                    .task-avatar {
                      width: 20px;
                      height: 20px;
                      border-radius: 999px;
                      background: var(--pl-primary-lightest);
                      color: var(--pl-primary-dark);
                      display: inline-flex;
                      align-items: center;
                      justify-content: center;
                      font: var(--pl-text-font);
                      font-size: 10px;
                      font-weight: 700;
                      flex-shrink: 0;
                    }

                    .task-owner-name {
                      min-width: 0;
                      white-space: nowrap;
                      overflow: hidden;
                      text-overflow: ellipsis;
                    }

                    .task-status {
                      display: inline-flex;
                      align-items: center;
                      justify-content: center;
                      min-height: 22px;
                      border-radius: 999px;
                      padding: 0 8px;
                      font: var(--pl-text-font);
                      font-size: 12px;
                      font-weight: 700;
                      border: 1px solid var(--pl-grey-base);
                      color: var(--pl-grey-darkest);
                      background: var(--pl-grey-lightest);
                      white-space: nowrap;
                    }

                    .task-status.in-work {
                      color: #2f5daa;
                      border-color: #b8caef;
                      background: #edf3ff;
                    }

                    .task-status.todo {
                      color: #5f6370;
                      border-color: #d3d8e4;
                      background: #f3f5f9;
                    }
                  </style>
                </template>
                <pl-table-pro-column id="done" field="done" header="" width="44" cell-align="center" sortable="false" resizable="false">
                  <template>
                    <pl-checkbox checked="[[row.done]]" disabled></pl-checkbox>
                  </template>
                </pl-table-pro-column>
                <pl-table-pro-column id="title" field="title" header="Название" width="360"></pl-table-pro-column>
                <pl-table-pro-column id="assignee" field="assignee" header="Исполнитель" width="190">
                  <template>
                    <div class="task-owner-cell">
                      <span class="task-avatar">[[row.assignee_initials]]</span>
                      <span class="task-owner-name">[[row.assignee]]</span>
                    </div>
                  </template>
                </pl-table-pro-column>
                <pl-table-pro-column id="status" field="status" header="Статус" width="132" cell-align="center">
                  <template>
                    <span class$="task-status [[row.status_tone]]">[[row.status]]</span>
                  </template>
                </pl-table-pro-column>
                <pl-table-pro-column id="due" field="due" header="Срок" width="132"></pl-table-pro-column>
              </pl-table-pro>
            </div>
          </div>

          <div class="panel">
            <pl-flex-layout class="panel-head" align="center">
              <div class="panel-title">Направленные мне документы</div>
            </pl-flex-layout>
            <div class="doc-list">
              <template d:repeat="[[docs]]">
                <div class="doc-item">
                  <div class$="[[_docTitleClass(item.accent)]]">[[item.title]]</div>
                  <div class="doc-sub">[[item.subtitle]]</div>
                  <div class="doc-date">[[item.date]]</div>
                </div>
              </template>
            </div>
          </div>

          <div class="right-column calendar-panel">
            <div class="panel">
              <pl-flex-layout class="panel-head" align="center">
                <div class="panel-title">Календарь</div>
              </pl-flex-layout>
              <div class="calendar-wrap">
                <div class="calendar-sub">Встречи на сегодня, 15.02.2026</div>
                <div class="days">
                  <template d:repeat="[[calendarDays]]">
                    <div class$="[[_dayClass(item.selected)]]">
                      <div class="day-code">[[item.code]]</div>
                      <div class="day-num">[[item.day]]</div>
                    </div>
                  </template>
                </div>
                <template d:repeat="[[calendarEvents]]">
                  <div class="agenda-item">
                    <span class$="[[_agendaTagClass(item.tone)]]">[[item.label]]</span>
                    <div class="agenda-time">[[item.time]]</div>
                    <div class="agenda-text">[[item.title]]</div>
                  </div>
                </template>
              </div>
            </div>
          </div>
        </div>

        <div class="lower-grid">
          <div class="panel hr-panel">
            <pl-flex-layout class="panel-head" align="center" justify="space-between">
              <div class="panel-title">Кадровый блок</div>
              <div class="hr-caption">Отсутствия и корпоративные мероприятия</div>
            </pl-flex-layout>
            <div class="hr-widgets">
              <div class="hr-widget">
                <pl-flex-layout align="center" justify="space-between">
                  <div class="hr-widget-title">Отсутствия сегодня</div>
                  <div class="hr-widget-link">Все</div>
                </pl-flex-layout>
                <div class="hr-chips">
                  <template d:repeat="[[hrAbsenceSummary]]">
                    <span class="hr-chip">[[item.label]]: [[item.count]]</span>
                  </template>
                </div>
                <template d:repeat="[[hrAbsences]]">
                  <div class="absence-item">
                    <span class$="absence-avatar [[item.avatar_tone]]">[[item.initials]]</span>
                    <div class="absence-main">
                      <div class="absence-name">[[item.name]]</div>
                      <div class="absence-meta">[[item.reason]] · [[item.period]]</div>
                    </div>
                  </div>
                </template>
              </div>

              <div class="hr-widget">
                <pl-flex-layout align="center" justify="space-between">
                  <div class="hr-widget-title">Корпоративные мероприятия</div>
                  <div class="hr-widget-link">Управлять</div>
                </pl-flex-layout>
                <template d:repeat="[[hrEvents]]">
                  <div class="corp-item">
                    <div class="corp-title">[[item.title]]</div>
                    <div class="corp-meta">[[item.meta]]</div>
                    <div class="corp-place">[[item.place]]</div>
                    <pl-flex-layout class="corp-bottom" align="center" justify="space-between">
                      <div class="participants">
                        <template d:repeat="{{item.members}}">
                          <span class$="participant [[item.avatar_tone]]">[[item.initials]]</span>
                        </template>
                      </div>
                      <div class="corp-stats">
                        <div>Записались: [[item.registered]]</div>
                        <div class="muted">Свободно мест: [[item.free]]</div>
                      </div>
                    </pl-flex-layout>
                  </div>
                </template>
              </div>
            </div>
          </div>

          <div class="panel birthday-panel">
            <pl-flex-layout class="panel-head" align="center">
              <div class="panel-title">Дни рождения</div>
            </pl-flex-layout>
            <div class="birthday-list">
              <template d:repeat="[[birthdays]]">
                <div class="birthday-item">
                  <span class$="birthday-avatar [[item.avatar_tone]]">[[item.initials]]</span>
                  <div class="birthday-info">
                    <div class="birthday-name">[[item.name]]</div>
                    <div class="birthday-date">[[item.date]]</div>
                  </div>
                </div>
              </template>
            </div>
          </div>
        </div>

        <div class="panel vacation-panel">
          <pl-flex-layout class="panel-head" align="center">
            <div class="panel-title">График отпусков</div>
          </pl-flex-layout>
          <div class="vacation-body">
            <div class="vacation-gantt-wrap">
              <pl-gantt data="[[vacationPlan]]" day-width="34" side-width="260"></pl-gantt>
            </div>
          </div>
        </div>
      </div>
    </pl-flex-layout>
  `;

  onConnect() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    this.todayLine = formatRuDate(today);

    this.stats = [
      { title: 'Задачи на сегодня', value: '5', subtitle: 'в личном плане' },
      { title: 'Документы', value: '6', subtitle: 'на контроле' },
      { title: 'Встречи', value: '5', subtitle: 'в календаре' },
      { title: 'Отсутствия', value: '4', subtitle: 'по компании' }
    ];

    this.highlights = [
      { title: 'Общее собрание компании: 3 марта', date: '12.02.2026', tone: 'teal' },
      { title: 'Отдел персонала: открыта запись на ДМС', date: '10.02.2026', tone: 'teal' },
      { title: 'Шаблон карточки проекта', date: '07.02.2026', tone: 'blue', tag: 'Статья' },
      { title: 'Регламент онбординга сотрудников', date: '05.02.2026', tone: 'green', tag: 'Статья' }
    ];

    this.tasks = [
      { id: 1, title: 'Подготовить итоговый пакет документов по отпускам', assignee: 'Ольга Белова', status: 'В работе', due: 'вс, 15 февр', done: false },
      { id: 2, title: 'Подписать договор сопровождения платформы бизнес-аналитики', assignee: 'Павел Морозов', status: 'К выполнению', due: 'вс, 15 февр', done: false },
      { id: 3, title: 'Проверить счет на лицензии аналитики', assignee: 'Павел Морозов', status: 'К выполнению', due: 'вс, 15 февр', done: false },
      { id: 4, title: 'Согласовать изменения устава проектного офиса', assignee: 'Виктория Зайцева', status: 'В работе', due: 'вс, 15 февр', done: false },
      { id: 5, title: 'Подготовить отчет по индикаторам OKR', assignee: 'Юлия Григорьева', status: 'К выполнению', due: 'вс, 15 февр', done: false }
    ].map((row) => ({
      ...row,
      assignee_initials: initials(row.assignee),
      status_tone: statusTone(row.status)
    }));

    this.docs = [
      { title: 'Протокол архитектурного комитета', subtitle: 'Служебная записка · Подписан', date: '14.02.2026' },
      { title: 'Приказ о графике отпусков на II квартал', subtitle: 'Приказ · На согласовании', date: '16.02.2026', accent: true },
      { title: 'Служебная записка по расширению облачной квоты', subtitle: 'Служебная записка · Черновик', date: '17.02.2026' },
      { title: 'Приказ о составе комиссии по информационной безопасности', subtitle: 'Приказ · Согласован', date: '19.02.2026', accent: true },
      { title: 'Решение по обновлению SLA для поддержки', subtitle: 'Распоряжение · Принят', date: '20.02.2026' },
      { title: 'Согласование бюджета на технический аудит', subtitle: 'Служебная записка · На подписи', date: '21.02.2026', accent: true }
    ];

    this.calendarDays = createWeekDays(today);
    this.calendarEvents = [
      { label: 'Сегодня', time: '09:30 - 10:15', title: 'Подготовить итоговый пакет документов по отпускам', tone: 'ok' },
      { label: 'Сегодня', time: '10:30 - 11:00', title: 'Подписать договор сопровождения платформы бизнес-аналитики', tone: 'ok' },
      { label: 'Сегодня', time: '11:45 - 12:10', title: 'Проверить счет на лицензии аналитики', tone: 'warn' }
    ];

    this.birthdays = [
      { name: 'Ярослав Данилов', date: '26.02.2026', initials: 'ЯД', avatar_tone: '' },
      { name: 'Марина Соколова', date: '03.03.2026', initials: 'МС', avatar_tone: 't2' },
      { name: 'Максим Орлов', date: '15.03.2026', initials: 'МО', avatar_tone: 't3' },
      { name: 'Ольга Белова', date: '23.03.2026', initials: 'ОБ', avatar_tone: '' },
      { name: 'Павел Морозов', date: '28.03.2026', initials: 'ПМ', avatar_tone: 't2' },
      { name: 'Виктория Зайцева', date: '04.04.2026', initials: 'ВЗ', avatar_tone: 't3' },
      { name: 'Юлия Григорьева', date: '08.04.2026', initials: 'ЮГ', avatar_tone: '' }
    ];

    this.hrAbsenceSummary = [
      { label: 'Командировка', count: 1 },
      { label: 'Больничный', count: 1 },
      { label: 'Удаленно', count: 1 },
      { label: 'Отпуск', count: 1 }
    ];

    this.hrAbsences = [
      { name: 'Виктория Зайцева', reason: 'Командировка', period: '15.02.2026 - 17.02.2026', initials: 'ВЗ', avatar_tone: '' },
      { name: 'Дарья Субботина', reason: 'Больничный', period: '15.02.2026 - 16.02.2026', initials: 'ДС', avatar_tone: 't2' },
      { name: 'Ксения Алексеева', reason: 'Удаленно', period: '15.02.2026', initials: 'КА', avatar_tone: 't3' },
      { name: 'Татьяна Крылова', reason: 'Отпуск', period: '14.02.2026 - 20.02.2026', initials: 'ТК', avatar_tone: 't4' }
    ];

    this.hrEvents = [
      {
        title: 'Корпоративная йога',
        meta: 'Москва · Пн, 16.02.2026 · 08:30 - 09:15',
        place: 'Зал здоровья, 5 этаж · Здоровье',
        registered: 12,
        free: 4,
        members: [
          { initials: 'ВЗ', avatar_tone: '' },
          { initials: 'ДС', avatar_tone: 't2' },
          { initials: 'КА', avatar_tone: 't3' },
          { initials: 'ТК', avatar_tone: 't4' },
          { initials: 'МО', avatar_tone: '' }
        ]
      },
      {
        title: 'Корпоративный волейбол',
        meta: 'Санкт-Петербург · Ср, 18.02.2026 · 19:00 - 20:30',
        place: 'Спортивный центр «Север», площадка Б · Спорт',
        registered: 16,
        free: 4,
        members: [
          { initials: 'АП', avatar_tone: '' },
          { initials: 'ЕС', avatar_tone: 't2' },
          { initials: 'МК', avatar_tone: 't3' },
          { initials: 'НВ', avatar_tone: 't4' },
          { initials: 'ОЛ', avatar_tone: '' }
        ]
      },
      {
        title: 'Корпоративный волейбол',
        meta: 'Екатеринбург · Ср, 18.02.2026 · 19:00 - 20:30',
        place: 'Спортивный комплекс «Ельцин Центр» · Спорт',
        registered: 14,
        free: 4,
        members: [
          { initials: 'ИД', avatar_tone: '' },
          { initials: 'АС', avatar_tone: 't2' },
          { initials: 'ДК', avatar_tone: 't3' },
          { initials: 'ОИ', avatar_tone: 't4' },
          { initials: 'СВ', avatar_tone: '' }
        ]
      },
      {
        title: 'Корпоративный волейбол',
        meta: 'Москва · Ср, 18.02.2026 · 19:30 - 21:00',
        place: 'СК Лидер, зал №2 · Спорт',
        registered: 19,
        free: 5,
        members: [
          { initials: 'ПЕ', avatar_tone: '' },
          { initials: 'ЕО', avatar_tone: 't2' },
          { initials: 'МФ', avatar_tone: 't3' },
          { initials: 'НС', avatar_tone: 't4' },
          { initials: 'ДЛ', avatar_tone: '' }
        ]
      }
    ];

    this.vacationPlan = [
      {
        id: 'vac-1',
        title: 'Алексей Смирнов',
        owner: 'Плановый отпуск',
        status: 'В работе',
        progress: 62,
        start: '2026-02-03',
        end: '2026-02-09'
      },
      {
        id: 'vac-2',
        title: 'Анна Иванова',
        owner: 'Согласовано',
        status: 'На контроле',
        progress: 40,
        start: '2026-02-01',
        end: '2026-02-15'
      },
      {
        id: 'vac-3',
        title: 'Павел Романов',
        owner: 'Разделенный отпуск',
        status: 'Риск',
        progress: 28,
        start: '2026-02-05',
        end: '2026-02-19'
      },
      {
        id: 'vac-4',
        title: 'Елена Козлова',
        owner: 'Плановый отпуск',
        status: 'Завершено',
        progress: 100,
        start: '2026-02-08',
        end: '2026-02-17'
      },
      {
        id: 'vac-5',
        title: 'Юлия Григорьева',
        owner: 'Перенос отпуска',
        status: 'Планирование',
        progress: 16,
        start: '2026-02-12',
        end: '2026-02-24'
      }
    ];
  }

  _docTitleClass(accent) {
    return accent ? 'doc-title accent' : 'doc-title';
  }

  _dayClass(selected) {
    return selected ? 'day-cell selected' : 'day-cell';
  }

  _agendaTagClass(tone) {
    return tone === 'warn' ? 'agenda-tag warn' : 'agenda-tag';
  }
}
