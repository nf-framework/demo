import { PlForm } from '@nfjs/front-pl/components/pl-form.js';
import { html, css } from 'polylib';
import '@plcmp/pl-flex-layout';
import '@plcmp/pl-button';
import '@plcmp/pl-input';
import '@plcmp/pl-combobox';
import {
  portalData,
  peopleRows,
  pickEmployee,
  assignmentsByEmployee,
  fmtDate,
  employeeName,
  departmentName,
  locationName
} from '/portal/forms/portal/lib/portal-utils.js';

const STATUS_LABELS = {
  inOffice: 'Онлайн',
  remote: 'Удаленно',
  trip: 'Командировка',
  vacation: 'Отпуск',
  sick: 'Больничный',
  dayOff: 'Отгул',
  unpaid: 'За свой счет'
};

const ABSENCE_LABELS = {
  vacation: 'Отпуск',
  trip: 'Командировка',
  sick: 'Больничный',
  remote: 'Удаленная работа',
  dayOff: 'Отгул',
  unpaid: 'За свой счет'
};

const APPROVAL_LABELS = {
  approved: 'Одобрено',
  planned: 'Запланировано',
  rejected: 'Отклонено'
};

function normalize(value) {
  return String(value || '').trim().toLowerCase();
}

function parseDate(value) {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function formatTime(value) {
  const date = parseDate(value);
  if (!date) return '—';
  return date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
}

function formatDate(value) {
  const date = parseDate(value);
  if (!date) return '—';
  return date.toLocaleDateString('ru-RU');
}

function monthRu(monthIndex) {
  const date = new Date(2026, monthIndex, 1);
  return date.toLocaleDateString('ru-RU', { month: 'long' });
}

function formatRangeDays(start, end) {
  const startDate = parseDate(start);
  const endDate = parseDate(end);
  if (!startDate || !endDate) return '—';
  return `${formatDate(startDate)} — ${formatDate(endDate)}`;
}

function todayStart() {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  return date;
}

function getYearsInCompany(hireDate) {
  const start = parseDate(hireDate);
  if (!start) return '—';
  const now = new Date();
  let years = now.getFullYear() - start.getFullYear();
  const monthDiff = now.getMonth() - start.getMonth();
  const dayDiff = now.getDate() - start.getDate();
  if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) years -= 1;
  return `${Math.max(0, years)} ${years === 1 ? 'год' : years >= 2 && years <= 4 ? 'года' : 'лет'}`;
}

export default class PortalEmployeeDetailForm extends PlForm {
  static properties = {
    formTitle: { type: String, value: 'Портал: Сотрудник' },
    selectedId: { type: String, value: 'emp-018', observer: '_selectedIdObserver' },
    activeTab: { type: String, value: 'main' },
    selectedEmployee: {
      type: Object,
      value: () => ({
        id: '',
        displayName: '—',
        employeeNumber: '—',
        title: '—',
        photoUrl: '',
        contacts: {}
      })
    },
    manager: {
      type: Object,
      value: () => ({ id: '', displayName: '—', title: '—', photoUrl: '', contacts: {} })
    },
    employeeFacts: { type: Array, value: () => [] },
    skills: { type: Array, value: () => [] },
    aboutRows: { type: Array, value: () => [] },
    colleagues: { type: Array, value: () => [] },
    educationRows: { type: Array, value: () => [] },
    coursesRows: { type: Array, value: () => [] },
    salaryRows: { type: Array, value: () => [] },
    docsRows: { type: Array, value: () => [] },
    awardsRows: { type: Array, value: () => [] },
    assetsRows: { type: Array, value: () => [] },
    assignmentsRows: { type: Array, value: () => [] },
    absencesRows: { type: Array, value: () => [] },
    historyRows: { type: Array, value: () => [] },
    filteredHistoryRows: { type: Array, value: () => [] },
    historySearch: { type: String, value: '', observer: '_historyFilterObserver' },
    historyPeriod: { type: String, value: '7', observer: '_historyFilterObserver' },
    historyPeriodOptions: {
      type: Array,
      value: () => ([
        { value: '7', text: 'За 7 дней' },
        { value: '30', text: 'За 30 дней' },
        { value: '90', text: 'За 90 дней' },
        { value: 'all', text: 'За все время' }
      ])
    }
  };

  constructor() {
    super();
    this.onTabClick = this.onTabClick.bind(this);
    this.onManagerClick = this.onManagerClick.bind(this);
    this.onColleagueClick = this.onColleagueClick.bind(this);
    this.onOpenDepartmentClick = this.onOpenDepartmentClick.bind(this);
  }

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

    .scroll {
      width: 100%;
      height: 100%;
      min-width: 0;
      min-height: 0;
      overflow: auto;
      box-sizing: border-box;
      padding: 12px;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .panel {
      border: 1px solid #d3dfd8;
      border-radius: 16px;
      background: var(--pl-background-color);
      box-sizing: border-box;
    }

    .hero {
      display: grid;
      grid-template-columns: minmax(0, 1fr) 220px;
      gap: 14px;
      padding: 16px;
      align-items: stretch;
    }

    .hero-main {
      min-width: 0;
      display: grid;
      grid-template-columns: 120px minmax(0, 1fr);
      gap: 14px;
      align-items: start;
    }

    .hero-photo {
      width: 120px;
      height: 120px;
      border-radius: 999px;
      overflow: hidden;
      background: #ecf4f0;
      border: 1px solid #d7e2dc;
      flex-shrink: 0;
    }

    .hero-photo img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    }

    .hero-meta {
      min-width: 0;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .name-line {
      display: flex;
      align-items: center;
      gap: 10px;
      flex-wrap: wrap;
    }

    .employee-name {
      margin: 0;
      font: var(--pl-header-font);
      color: #1f3d34;
      font-size: 56px;
      line-height: 1.04;
      font-weight: 800;
    }

    .employee-tabnum {
      display: inline-flex;
      align-items: center;
      min-height: 26px;
      border-radius: 999px;
      border: 1px solid #a8cdbd;
      background: #e9f7ef;
      color: #266b53;
      font: var(--pl-text-font);
      font-size: 14px;
      font-weight: 700;
      padding: 0 12px;
      box-sizing: border-box;
    }

    .employee-title {
      font: var(--pl-header-font);
      color: #2f4f46;
      font-size: 42px;
      line-height: 1.06;
      font-weight: 700;
      margin: 0;
    }

    .employee-contacts {
      display: flex;
      align-items: center;
      gap: 14px;
      flex-wrap: wrap;
      color: #206f57;
      font: var(--pl-text-font);
      font-size: 24px;
      font-weight: 500;
    }

    .employee-facts {
      display: grid;
      grid-template-columns: repeat(2, minmax(210px, 1fr));
      gap: 8px;
      max-width: 760px;
    }

    .fact-card {
      border: 1px solid #d2e1da;
      border-radius: 12px;
      background: #f8fbf9;
      padding: 8px 10px;
      box-sizing: border-box;
      min-height: 62px;
    }

    .fact-label {
      font: var(--pl-text-font);
      font-size: 12px;
      font-weight: 700;
      letter-spacing: .03em;
      text-transform: uppercase;
      color: #688177;
    }

    .fact-value {
      margin-top: 2px;
      font: var(--pl-header-font);
      font-size: 21px;
      color: #23493d;
      font-weight: 700;
      line-height: 1.15;
    }

    .hero-actions {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      align-items: center;
    }

    .hero-actions pl-button {
      min-width: 128px;
    }

    .chips-row {
      display: flex;
      align-items: center;
      gap: 8px;
      flex-wrap: wrap;
    }

    .chip {
      display: inline-flex;
      align-items: center;
      min-height: 28px;
      border-radius: 999px;
      border: 1px solid #d4dfd8;
      background: #eef5f1;
      padding: 0 11px;
      box-sizing: border-box;
      color: #35574b;
      font: var(--pl-text-font);
      font-size: 13px;
      font-weight: 700;
      line-height: 1;
    }

    .chip.status-inOffice,
    .chip.status-remote {
      border-color: #9fd3bc;
      background: #e8f7ef;
      color: #216852;
    }

    .chip.status-trip {
      border-color: #8cbcf7;
      background: #e9f2ff;
      color: #2f63a9;
    }

    .chip.status-vacation,
    .chip.status-dayOff {
      border-color: #f2cf88;
      background: #fff2d9;
      color: #8f6514;
    }

    .chip.status-sick,
    .chip.status-unpaid {
      border-color: #f0b3b3;
      background: #ffe9e9;
      color: #993939;
    }

    .hero-side {
      min-width: 0;
      display: flex;
      flex-direction: column;
      gap: 8px;
      justify-content: flex-start;
    }

    .kpi-card {
      border: 1px solid #d2e0d9;
      border-radius: 12px;
      background: #f9fcfa;
      padding: 9px 10px;
      box-sizing: border-box;
      min-height: 68px;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }

    .kpi-label {
      font: var(--pl-text-font);
      font-size: 12px;
      color: #6f847b;
      line-height: 1.1;
    }

    .kpi-value {
      margin-top: 4px;
      font: var(--pl-header-font);
      font-size: 34px;
      font-weight: 800;
      line-height: 1;
      color: #1f3f35;
    }

    .edit-btn {
      margin-top: 2px;
      width: 100%;
    }

    .tabs-panel {
      padding: 2px 8px;
    }

    .tabs-row {
      display: flex;
      align-items: center;
      gap: 2px;
      flex-wrap: wrap;
    }

    .tab-btn {
      --pl-button-link-color: #2a6f58;
      --pl-button-link-hover-color: #205746;
      border-radius: 0;
      border-bottom: 2px solid transparent;
    }

    .tab-btn.is-active {
      --pl-button-link-color: #1f5a46;
      border-bottom-color: #2b8b67;
      font-weight: 700;
    }

    .tab-panel {
      display: none;
      min-width: 0;
    }

    .tab-panel.is-active {
      display: block;
    }

    .main-grid {
      display: grid;
      grid-template-columns: minmax(0, 1.72fr) minmax(300px, 1fr);
      gap: 10px;
      min-width: 0;
      align-items: start;
    }

    .main-column,
    .side-column {
      min-width: 0;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .panel-head {
      min-height: calc(var(--pl-base-size) + 4px);
      border-bottom: 1px solid #d7e4dd;
      padding: 8px 12px;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 10px;
    }

    .panel-title {
      margin: 0;
      font: var(--pl-header-font);
      color: #1f3f35;
      font-size: 44px;
      line-height: 1.05;
      font-weight: 800;
    }

    .inner-title {
      margin: 0;
      font: var(--pl-header-font);
      color: #1f3f35;
      font-size: 36px;
      line-height: 1.1;
      font-weight: 750;
    }

    .section-body {
      padding: 10px 12px 12px;
      box-sizing: border-box;
    }

    .manager-card {
      border: 1px solid #d2e1da;
      border-radius: 14px;
      background: #fbfdfc;
      padding: 10px;
      box-sizing: border-box;
      display: grid;
      grid-template-columns: 66px minmax(0, 1fr) auto;
      gap: 10px;
      align-items: center;
      cursor: pointer;
    }

    .person-avatar {
      width: 66px;
      height: 66px;
      border-radius: 999px;
      overflow: hidden;
      border: 1px solid #d2dfd8;
      background: #ecf4f0;
    }

    .person-avatar img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    }

    .person-name {
      margin: 0;
      font: var(--pl-header-font);
      font-size: 30px;
      line-height: 1.08;
      color: #214538;
      font-weight: 750;
    }

    .person-title {
      margin: 2px 0 0;
      font: var(--pl-text-font);
      color: #5d756c;
      font-size: 27px;
      line-height: 1.1;
      font-weight: 500;
    }

    .person-contacts {
      margin-top: 2px;
      color: #237258;
      font: var(--pl-text-font);
      font-size: 20px;
      line-height: 1.2;
    }

    .skills-wrap {
      display: flex;
      flex-wrap: wrap;
      gap: 7px;
    }

    .skill-chip {
      display: inline-flex;
      align-items: center;
      min-height: 30px;
      border-radius: 999px;
      border: 1px solid #cad9d1;
      background: #f5faf7;
      color: #36584c;
      font: var(--pl-text-font);
      font-size: 20px;
      font-weight: 600;
      padding: 0 11px;
      box-sizing: border-box;
      line-height: 1;
    }

    .about-row {
      margin: 0;
      font: var(--pl-text-font);
      color: #2a443c;
      font-size: 31px;
      line-height: 1.45;
    }

    .about-row + .about-row {
      margin-top: 8px;
    }

    .colleague-list {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .colleague-card {
      border: 1px solid #d3e0d9;
      border-radius: 12px;
      background: #fbfdfc;
      padding: 8px 10px;
      box-sizing: border-box;
      display: grid;
      grid-template-columns: 58px minmax(0, 1fr);
      gap: 10px;
      align-items: center;
      cursor: pointer;
    }

    .colleague-card .person-name {
      font-size: 22px;
    }

    .colleague-card .person-title {
      font-size: 18px;
    }

    .edu-row {
      border: 1px solid #d3e0d9;
      border-radius: 12px;
      background: #fbfdfc;
      padding: 9px 10px;
      box-sizing: border-box;
    }

    .edu-name {
      margin: 0;
      font: var(--pl-header-font);
      font-size: 22px;
      color: #203f35;
      font-weight: 700;
      line-height: 1.25;
    }

    .edu-years {
      margin-top: 4px;
      font: var(--pl-text-font);
      color: #657c73;
      font-size: 17px;
    }

    .salary-card {
      border: 1px solid #d4e0da;
      border-radius: 14px;
      background: #fbfdfc;
      padding: 10px;
      box-sizing: border-box;
      margin-bottom: 8px;
    }

    .salary-card:last-child {
      margin-bottom: 0;
    }

    .salary-month {
      font: var(--pl-header-font);
      color: #24483c;
      font-size: 23px;
      font-weight: 700;
    }

    .salary-file {
      margin-top: 2px;
      color: #667f75;
      font: var(--pl-text-font);
      font-size: 18px;
    }

    .salary-grid {
      margin-top: 6px;
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 8px;
    }

    .salary-item {
      border-top: 1px dashed #d3ddd8;
      padding-top: 4px;
      color: #325549;
      font: var(--pl-text-font);
      font-size: 18px;
    }

    .salary-item strong {
      font: var(--pl-header-font);
      color: #1f4136;
      font-size: 20px;
      font-weight: 700;
      margin-inline-start: 4px;
    }

    .docs-list {
      margin: 0;
      padding-left: 26px;
      display: grid;
      gap: 3px;
    }

    .doc-item {
      line-height: 1.2;
    }

    .doc-link {
      --pl-button-link-color: #236f57;
      --pl-button-link-hover-color: #194f3f;
      font-size: 20px;
    }

    .award-card {
      border: 1px solid #d3e0d9;
      border-radius: 14px;
      background: #fbfdfc;
      padding: 10px;
      box-sizing: border-box;
      margin-bottom: 10px;
    }

    .award-card:last-child {
      margin-bottom: 0;
    }

    .award-year {
      display: inline-flex;
      align-items: center;
      min-height: 30px;
      border-radius: 999px;
      padding: 0 13px;
      box-sizing: border-box;
      border: 1px solid #cad9d2;
      background: #edf5f1;
      color: #2f5f50;
      font: var(--pl-text-font);
      font-size: 20px;
      font-weight: 700;
    }

    .award-title {
      margin-top: 7px;
      font: var(--pl-header-font);
      font-size: 39px;
      line-height: 1.08;
      font-weight: 750;
      color: #1f4035;
    }

    .award-text {
      margin-top: 6px;
      color: #37544a;
      font: var(--pl-text-font);
      font-size: 35px;
      line-height: 1.35;
    }

    .asset-row {
      border: 1px solid #d2e0da;
      border-radius: 12px;
      background: #fbfdfc;
      padding: 9px 10px;
      box-sizing: border-box;
      display: grid;
      grid-template-columns: minmax(0, 1fr) auto;
      gap: 10px;
      align-items: center;
      margin-bottom: 8px;
    }

    .asset-row:last-child {
      margin-bottom: 0;
    }

    .asset-name {
      margin: 0;
      font: var(--pl-header-font);
      font-size: 24px;
      line-height: 1.15;
      font-weight: 700;
      color: #203f35;
    }

    .asset-meta {
      margin-top: 3px;
      color: #607a70;
      font: var(--pl-text-font);
      font-size: 18px;
      line-height: 1.2;
    }

    .asset-right {
      text-align: right;
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .asset-date {
      color: #6a8077;
      font: var(--pl-text-font);
      font-size: 17px;
    }

    .asset-state {
      font: var(--pl-header-font);
      font-size: 18px;
      font-weight: 700;
      color: #266f55;
    }

    .history-controls {
      display: grid;
      grid-template-columns: minmax(180px, 1fr) 220px;
      gap: 8px;
      margin-bottom: 10px;
      align-items: center;
    }

    .history-list {
      border-top: 1px solid #d7e3dd;
      padding-top: 10px;
    }

    .history-day {
      color: #6f857b;
      font: var(--pl-text-font);
      font-size: 16px;
      font-weight: 700;
      letter-spacing: .04em;
      text-transform: uppercase;
      margin: 0 0 8px;
    }

    .history-item {
      display: grid;
      grid-template-columns: 74px 48px minmax(0, 1fr);
      gap: 10px;
      margin-bottom: 12px;
      align-items: start;
    }

    .history-item:last-child {
      margin-bottom: 0;
    }

    .history-time {
      font: var(--pl-header-font);
      font-size: 30px;
      line-height: 1.05;
      color: #264438;
      font-weight: 700;
      padding-top: 4px;
    }

    .history-avatar {
      width: 48px;
      height: 48px;
      border-radius: 999px;
      overflow: hidden;
      border: 1px solid #d0ddd7;
      background: #edf5f1;
    }

    .history-avatar img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    }

    .history-text {
      font: var(--pl-header-font);
      font-size: 24px;
      line-height: 1.22;
      color: #203f35;
      margin-top: 2px;
    }

    .history-text strong {
      color: #185640;
    }

    .history-badge {
      display: inline-flex;
      align-items: center;
      min-height: 28px;
      border-radius: 999px;
      padding: 0 12px;
      box-sizing: border-box;
      margin-top: 6px;
      font: var(--pl-text-font);
      font-size: 16px;
      font-weight: 700;
      border: 1px solid #d3dfd8;
      background: #eef5f1;
      color: #3a5f52;
    }

    .history-badge.badge-approved {
      border-color: #f2ca78;
      background: #fff3dc;
      color: #835f10;
    }

    .history-badge.badge-planned {
      border-color: #a9c4f4;
      background: #edf3ff;
      color: #2f5fa5;
    }

    .history-badge.badge-rejected {
      border-color: #f0b2b2;
      background: #ffe9e9;
      color: #9b3939;
    }

    .history-empty {
      display: none;
      border: 1px dashed #cfddd6;
      border-radius: 12px;
      background: #fbfdfc;
      color: #6b8479;
      text-align: center;
      padding: 16px;
      font: var(--pl-text-font);
      font-size: 17px;
    }

    .history-empty.is-visible {
      display: block;
    }

    .assignments-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 10px;
    }

    .assignment-card,
    .absence-card {
      border: 1px solid #d3e0d9;
      border-radius: 12px;
      background: #fbfdfc;
      padding: 10px;
      box-sizing: border-box;
    }

    .assignment-title,
    .absence-title {
      margin: 0;
      font: var(--pl-header-font);
      color: #1f4035;
      font-size: 22px;
      line-height: 1.15;
      font-weight: 700;
    }

    .assignment-meta,
    .absence-meta {
      margin-top: 4px;
      color: #607a70;
      font: var(--pl-text-font);
      font-size: 16px;
      line-height: 1.25;
    }

    .assignment-kpi {
      margin-top: 8px;
      color: #24473c;
      font: var(--pl-header-font);
      font-size: 18px;
      font-weight: 700;
    }

    .row-link {
      cursor: pointer;
    }

    .course-list {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .course-card {
      border: 1px solid var(--pl-grey-base);
      border-radius: var(--pl-border-radius);
      background: var(--pl-background-color);
      padding: 10px;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
    }

    .course-name {
      margin: 0;
      font: var(--pl-header-font);
      color: var(--pl-header-color);
      font-size: 15px;
      line-height: 1.25;
      font-weight: 700;
    }

    .course-meta {
      margin-top: 2px;
      font: var(--pl-text-font);
      color: var(--pl-grey-darkest);
      font-size: 13px;
      line-height: 1.25;
    }

    .course-badge {
      display: inline-flex;
      align-items: center;
      min-height: 24px;
      border-radius: 999px;
      border: 1px solid var(--pl-grey-base);
      background: var(--pl-grey-lightest);
      color: var(--pl-header-color);
      font: var(--pl-text-font);
      font-size: 12px;
      font-weight: 700;
      padding: 0 10px;
      box-sizing: border-box;
      flex-shrink: 0;
      white-space: nowrap;
    }

    .course-badge-valid {
      border-color: #8fd0b4;
      background: #e7f7ee;
      color: #136a4b;
    }

    .course-badge-active {
      border-color: #a9bff2;
      background: #e9f1ff;
      color: #2f5daa;
    }

    .course-badge-archived {
      border-color: #d4ddd8;
      background: #f2f6f4;
      color: #5f7168;
    }

    @media (max-width: 1600px) {
      .employee-name {
        font-size: 42px;
      }

      .employee-title {
        font-size: 32px;
      }

      .employee-contacts {
        font-size: 20px;
      }

      .panel-title {
        font-size: 34px;
      }

      .inner-title {
        font-size: 28px;
      }

      .person-name {
        font-size: 24px;
      }

      .person-title {
        font-size: 21px;
      }

      .about-row {
        font-size: 23px;
      }

      .award-title {
        font-size: 30px;
      }

      .award-text {
        font-size: 26px;
      }

      .history-time {
        font-size: 24px;
      }

      .history-text {
        font-size: 20px;
      }
    }

    @media (max-width: 1260px) {
      .hero {
        grid-template-columns: 1fr;
      }

      .hero-side {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 8px;
      }

      .edit-btn {
        grid-column: span 3;
      }

      .main-grid {
        grid-template-columns: 1fr;
      }
    }

    @media (max-width: 860px) {
      .scroll {
        padding: 8px;
      }

      .hero {
        padding: 10px;
      }

      .hero-main {
        grid-template-columns: 1fr;
      }

      .hero-photo {
        width: 92px;
        height: 92px;
      }

      .employee-name {
        font-size: 32px;
      }

      .employee-title {
        font-size: 24px;
      }

      .employee-contacts {
        font-size: 16px;
      }

      .employee-facts {
        grid-template-columns: 1fr;
      }

      .hero-side {
        grid-template-columns: 1fr;
      }

      .edit-btn {
        grid-column: auto;
      }

      .panel-title {
        font-size: 28px;
      }

      .inner-title {
        font-size: 24px;
      }

      .about-row {
        font-size: 19px;
      }

      .history-controls {
        grid-template-columns: 1fr;
      }

      .history-item {
        grid-template-columns: 62px 42px minmax(0, 1fr);
        gap: 8px;
      }

      .history-time {
        font-size: 21px;
      }

      .history-text {
        font-size: 17px;
      }

      .salary-grid {
        grid-template-columns: 1fr;
      }
    }

    /* normalized visual scale */
    .panel {
      border-color: var(--pl-grey-base);
      border-radius: var(--pl-border-radius);
    }

    .hero {
      padding: 12px;
      grid-template-columns: minmax(0, 1fr) 200px;
      gap: 12px;
    }

    .hero-main {
      grid-template-columns: 88px minmax(0, 1fr);
      gap: 12px;
    }

    .hero-photo {
      width: 88px;
      height: 88px;
      border-color: var(--pl-grey-base);
      background: var(--pl-grey-lightest);
    }

    .hero-meta {
      gap: 6px;
    }

    .employee-name {
      font-size: 32px;
      line-height: 1.1;
      color: var(--pl-header-color);
    }

    .employee-title {
      font-size: 22px;
      line-height: 1.2;
      color: var(--pl-header-color);
    }

    .employee-contacts {
      gap: 12px;
      font-size: 14px;
      color: var(--pl-grey-darkest);
    }

    .employee-tabnum {
      min-height: 24px;
      font-size: 12px;
      border-color: var(--pl-grey-base);
      background: var(--pl-grey-lightest);
      color: var(--pl-header-color);
    }

    .employee-facts {
      max-width: 700px;
      grid-template-columns: repeat(2, minmax(180px, 1fr));
      gap: 6px;
    }

    .fact-card {
      border-color: var(--pl-grey-base);
      border-radius: var(--pl-border-radius);
      background: var(--pl-background-color);
      min-height: 56px;
      padding: 8px;
    }

    .fact-label {
      font-size: 11px;
      color: var(--pl-grey-darkest);
    }

    .fact-value {
      font-size: 14px;
      color: var(--pl-header-color);
      line-height: 1.25;
    }

    .chip {
      min-height: 24px;
      font-size: 12px;
      padding: 0 10px;
      border-color: var(--pl-grey-base);
      background: var(--pl-grey-lightest);
      color: var(--pl-header-color);
    }

    .hero-side {
      gap: 6px;
    }

    .kpi-card {
      border-color: var(--pl-grey-base);
      border-radius: var(--pl-border-radius);
      background: var(--pl-background-color);
      min-height: 60px;
      padding: 8px;
    }

    .kpi-label {
      font-size: 12px;
      color: var(--pl-grey-darkest);
    }

    .kpi-value {
      font-size: 24px;
      color: var(--pl-header-color);
    }

    .tabs-panel {
      padding: 0 8px;
    }

    .tab-btn {
      min-height: var(--pl-base-size);
      border-bottom-width: 2px;
    }

    .main-grid {
      grid-template-columns: minmax(0, 1.35fr) minmax(280px, 1fr);
      gap: 8px;
    }

    .main-column,
    .side-column {
      gap: 8px;
    }

    .panel-head {
      min-height: calc(var(--pl-base-size) + 2px);
      padding: 6px 10px;
      border-bottom-color: var(--pl-grey-light);
    }

    .section-body {
      padding: 10px;
    }

    .panel-title {
      font-size: 24px;
      line-height: 1.2;
      color: var(--pl-header-color);
      font-weight: 700;
    }

    .inner-title {
      font-size: 22px;
      line-height: 1.2;
      color: var(--pl-header-color);
      font-weight: 700;
    }

    .manager-card {
      border-color: var(--pl-grey-base);
      border-radius: var(--pl-border-radius);
      background: var(--pl-background-color);
      grid-template-columns: 52px minmax(0, 1fr) auto;
      padding: 8px;
      gap: 8px;
    }

    .person-avatar {
      width: 52px;
      height: 52px;
      border-color: var(--pl-grey-base);
      background: var(--pl-grey-lightest);
    }

    .person-name {
      font-size: 17px;
      line-height: 1.25;
      color: var(--pl-header-color);
    }

    .person-title {
      font-size: 14px;
      line-height: 1.2;
      color: var(--pl-grey-darkest);
    }

    .person-contacts {
      font-size: 13px;
      color: var(--pl-grey-darkest);
    }

    .skill-chip {
      min-height: 24px;
      font-size: 12px;
      border-color: var(--pl-grey-base);
      background: var(--pl-grey-lightest);
      color: var(--pl-header-color);
    }

    .skill-chip.skill-grade {
      border-color: #a9c4f4;
      background: #edf3ff;
      color: #2f5fa5;
    }

    .skill-chip.skill-timezone {
      border-color: #f1cf8a;
      background: #fff4df;
      color: #8a651a;
    }

    .skill-chip.skill-tag {
      border-color: #8fd0b4;
      background: #e7f7ee;
      color: #136a4b;
    }

    .skill-chip.skill-domain {
      border-color: #9ac8bb;
      background: #ecf7f3;
      color: #20634f;
    }

    .skill-chip.skill-soft {
      border-color: #c4d3ce;
      background: #f4f8f6;
      color: #4a5f56;
    }

    .about-row {
      font-size: 14px;
      line-height: 1.5;
      color: var(--pl-text-color);
    }

    .colleague-card {
      border-color: var(--pl-grey-base);
      border-radius: var(--pl-border-radius);
      background: var(--pl-background-color);
      grid-template-columns: 44px minmax(0, 1fr);
      padding: 8px;
      gap: 8px;
      min-height: 60px;
    }

    .colleague-card .person-name {
      font-size: 15px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .colleague-card .person-title {
      font-size: 13px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .edu-row {
      border-color: var(--pl-grey-base);
      border-radius: var(--pl-border-radius);
      background: var(--pl-background-color);
      padding: 8px;
    }

    .edu-name {
      font-size: 16px;
      line-height: 1.3;
      color: var(--pl-header-color);
    }

    .edu-years {
      font-size: 13px;
      color: var(--pl-grey-darkest);
    }

    .salary-card,
    .award-card,
    .asset-row,
    .assignment-card,
    .absence-card {
      border-color: var(--pl-grey-base);
      border-radius: var(--pl-border-radius);
      background: var(--pl-background-color);
    }

    .salary-month {
      font-size: 15px;
      color: var(--pl-header-color);
    }

    .salary-file,
    .salary-item,
    .asset-meta,
    .assignment-meta,
    .absence-meta {
      font-size: 13px;
      color: var(--pl-grey-darkest);
    }

    .salary-item strong {
      font-size: 14px;
      color: var(--pl-header-color);
    }

    .doc-link {
      font-size: 14px;
    }

    .award-year {
      min-height: 24px;
      font-size: 12px;
      border-color: var(--pl-grey-base);
      background: var(--pl-grey-lightest);
      color: var(--pl-header-color);
    }

    .award-title {
      font-size: 17px;
      line-height: 1.3;
      color: var(--pl-header-color);
    }

    .award-text {
      font-size: 14px;
      line-height: 1.45;
      color: var(--pl-text-color);
    }

    .asset-name,
    .assignment-title,
    .absence-title {
      font-size: 15px;
      color: var(--pl-header-color);
      line-height: 1.25;
    }

    .asset-date {
      font-size: 12px;
      color: var(--pl-grey-darkest);
    }

    .asset-state {
      font-size: 13px;
    }

    .history-day {
      font-size: 12px;
      color: var(--pl-grey-darkest);
      margin-bottom: 6px;
    }

    .history-item {
      grid-template-columns: 56px 40px minmax(0, 1fr);
      margin-bottom: 10px;
      gap: 8px;
    }

    .history-time {
      font-size: 18px;
      color: var(--pl-header-color);
      padding-top: 2px;
    }

    .history-avatar {
      width: 40px;
      height: 40px;
      border-color: var(--pl-grey-base);
    }

    .history-text {
      font-size: 14px;
      color: var(--pl-text-color);
      line-height: 1.4;
    }

    .history-badge {
      min-height: 22px;
      font-size: 12px;
      margin-top: 5px;
      border-color: var(--pl-grey-base);
      background: var(--pl-grey-lightest);
      color: var(--pl-header-color);
    }

    .history-empty {
      border-color: var(--pl-grey-base);
      border-radius: var(--pl-border-radius);
      background: var(--pl-background-color);
      color: var(--pl-grey-darkest);
      font-size: 13px;
      padding: 12px;
    }

    .timeline-list {
      border-top: 1px solid var(--pl-grey-light);
      padding-top: 10px;
    }

    .timeline-entry {
      margin-bottom: 2px;
    }

    .timeline-day {
      margin: 0 0 6px 86px;
      font: var(--pl-text-font);
      font-size: 12px;
      font-weight: 700;
      letter-spacing: .04em;
      text-transform: uppercase;
      color: var(--pl-grey-darkest);
    }

    .timeline-day.is-hidden {
      display: none;
    }

    .timeline-row {
      display: grid;
      grid-template-columns: 24px 56px 40px minmax(0, 1fr);
      gap: 8px;
      align-items: start;
      padding-bottom: 10px;
      min-height: 44px;
    }

    .timeline-axis {
      position: relative;
      width: 24px;
      min-height: 44px;
      display: flex;
      justify-content: center;
      box-sizing: border-box;
    }

    .timeline-dot {
      position: absolute;
      top: 5px;
      width: 10px;
      height: 10px;
      border-radius: 999px;
      background: var(--pl-primary-base);
      border: 2px solid var(--pl-background-color);
      box-shadow: 0 0 0 1px var(--pl-primary-light);
      z-index: 1;
    }

    .timeline-line {
      position: absolute;
      top: 14px;
      bottom: -12px;
      width: 2px;
      background: var(--pl-grey-base);
      border-radius: 2px;
    }

    .timeline-line.is-last {
      display: none;
    }

    .timeline-time {
      font: var(--pl-header-font);
      font-size: 18px;
      color: var(--pl-header-color);
      padding-top: 1px;
      line-height: 1.2;
    }

    .timeline-avatar {
      width: 40px;
      height: 40px;
      border-radius: 999px;
      overflow: hidden;
      border: 1px solid var(--pl-grey-base);
      background: var(--pl-grey-lightest);
    }

    .timeline-avatar img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    }

    .timeline-content {
      min-width: 0;
    }

    .timeline-text {
      font: var(--pl-text-font);
      font-size: 14px;
      line-height: 1.4;
      color: var(--pl-text-color);
      padding-top: 1px;
    }

    .assignment-kpi {
      font-size: 14px;
      color: var(--pl-header-color);
    }

    @media (max-width: 1260px) {
      .hero {
        grid-template-columns: 1fr;
      }

      .hero-side {
        grid-template-columns: repeat(3, minmax(0, 1fr));
      }

      .edit-btn {
        grid-column: span 3;
      }

      .main-grid {
        grid-template-columns: 1fr;
      }
    }

    @media (max-width: 860px) {
      .scroll {
        padding: 8px;
      }

      .hero {
        padding: 10px;
      }

      .hero-main {
        grid-template-columns: 1fr;
      }

      .hero-photo {
        width: 72px;
        height: 72px;
      }

      .employee-name {
        font-size: 24px;
      }

      .employee-title {
        font-size: 17px;
      }

      .employee-facts {
        grid-template-columns: 1fr;
      }

      .hero-side {
        grid-template-columns: 1fr;
      }

      .edit-btn {
        grid-column: auto;
      }

      .panel-title {
        font-size: 18px;
      }

      .inner-title {
        font-size: 18px;
      }

      .history-controls {
        grid-template-columns: 1fr;
      }

      .history-item {
        grid-template-columns: 50px 34px minmax(0, 1fr);
      }

      .history-time {
        font-size: 15px;
      }

      .history-text {
        font-size: 13px;
      }

      .salary-grid {
        grid-template-columns: 1fr;
      }

      .course-card {
        flex-direction: column;
        align-items: flex-start;
      }

      .timeline-day {
        margin-inline-start: 68px;
      }

      .timeline-row {
        grid-template-columns: 18px 46px 34px minmax(0, 1fr);
        gap: 6px;
      }

      .timeline-axis {
        width: 18px;
      }

      .timeline-time {
        font-size: 15px;
      }

      .timeline-avatar {
        width: 34px;
        height: 34px;
      }

      .timeline-text {
        font-size: 13px;
      }
    }
  `;

  static template = html`
    <pl-flex-layout class="layout" vertical fit>
      <div class="scroll">
        <section class="panel hero">
          <div class="hero-main">
            <div class="hero-photo">
              <img src$="[[selectedEmployee.photoUrl]]" alt$="[[selectedEmployee.displayName]]">
            </div>

            <div class="hero-meta">
              <div class="name-line">
                <h1 class="employee-name">[[selectedEmployee.displayName]]</h1>
                <span class="employee-tabnum">Табельный № [[selectedEmployee.employeeNumber]]</span>
              </div>
              <p class="employee-title">[[selectedEmployee.title]]</p>

              <div class="employee-contacts">
                <span>☎ [[selectedEmployee.contacts.phone]]</span>
                <span>✉ [[selectedEmployee.contacts.email]]</span>
              </div>

              <div class="employee-facts">
                <template d:repeat="[[employeeFacts]]">
                  <div class="fact-card">
                    <div class="fact-label">[[item.label]]</div>
                    <div class="fact-value">[[item.value]]</div>
                  </div>
                </template>
              </div>

              <pl-flex-layout class="hero-actions">
                <pl-button label="Позвонить" variant="secondary"></pl-button>
                <pl-button label="Написать" variant="secondary"></pl-button>
                <pl-button label="Открыть отдел" variant="secondary" on-click="[[onOpenDepartmentClick]]"></pl-button>
              </pl-flex-layout>

              <div class="chips-row">
                <span class="chip">Руководитель: [[manager.displayName]]</span>
                <span class="[[statusChipClass(selectedEmployee.statusToday)]]">[[statusLabel(selectedEmployee.statusToday)]]</span>
              </div>
            </div>
          </div>

          <aside class="hero-side">
            <div class="kpi-card">
              <div class="kpi-label">Стаж в компании</div>
              <div class="kpi-value">[[tenureValue(selectedEmployee.hireDate)]]</div>
            </div>
            <div class="kpi-card">
              <div class="kpi-label">Грейд</div>
              <div class="kpi-value">[[selectedEmployee.grade]]</div>
            </div>
            <pl-button class="edit-btn" label="Редактировать" variant="secondary"></pl-button>
          </aside>
        </section>

        <section class="panel tabs-panel">
          <pl-flex-layout class="tabs-row">
            <pl-button variant="link" class="[[tabButtonClass(activeTab, 'main')]]" label="Основное" data-tab="main" on-click="[[onTabClick]]"></pl-button>
            <pl-button variant="link" class="[[tabButtonClass(activeTab, 'projects')]]" label="Проекты" data-tab="projects" on-click="[[onTabClick]]"></pl-button>
            <pl-button variant="link" class="[[tabButtonClass(activeTab, 'absences')]]" label="Отсутствия" data-tab="absences" on-click="[[onTabClick]]"></pl-button>
            <pl-button variant="link" class="[[tabButtonClass(activeTab, 'history')]]" label="История" data-tab="history" on-click="[[onTabClick]]"></pl-button>
          </pl-flex-layout>
        </section>

        <div class="[[tabPanelClass(activeTab, 'main')]]">
          <div class="main-grid">
            <div class="main-column">
              <section class="panel">
                <div class="panel-head">
                  <h2 class="panel-title">Руководитель</h2>
                  <pl-button variant="secondary" label="Сообщение"></pl-button>
                </div>
                <div class="section-body">
                  <div class="manager-card row-link" data-employee-id="[[manager.id]]" data-employee-id$="[[manager.id]]" on-click="[[onManagerClick]]">
                    <div class="person-avatar"><img src$="[[manager.photoUrl]]" alt$="[[manager.displayName]]"></div>
                    <div>
                      <p class="person-name">[[manager.displayName]]</p>
                      <p class="person-title">[[manager.title]]</p>
                      <div class="person-contacts">[[manager.contacts.phone]] · [[manager.contacts.email]]</div>
                    </div>
                    <pl-button variant="link" label="Профиль"></pl-button>
                  </div>
                </div>
              </section>

              <section class="panel">
                <div class="panel-head"><h2 class="panel-title">Навыки и теги</h2></div>
                <div class="section-body">
                  <div class="skills-wrap">
                    <template d:repeat="[[skills]]">
                      <span class="[[skillChipClass(item)]]">[[skillLabel(item)]]</span>
                    </template>
                  </div>
                </div>
              </section>

              <section class="panel">
                <div class="panel-head"><h2 class="panel-title">Обо мне</h2></div>
                <div class="section-body">
                  <template d:repeat="[[aboutRows]]">
                    <p class="about-row">[[item]]</p>
                  </template>
                </div>
              </section>

              <section class="panel">
                <div class="panel-head"><h2 class="panel-title">Зарплатные квитки</h2></div>
                <div class="section-body">
                  <template d:repeat="[[salaryRows]]">
                    <div class="salary-card">
                      <div class="salary-month">[[item.monthLabel]]</div>
                      <div class="salary-file">[[item.fileName]]</div>
                      <div class="salary-grid">
                        <div class="salary-item">Начислено:<strong>[[item.gross]] ₽</strong></div>
                        <div class="salary-item">НДФЛ:<strong>[[item.tax]] ₽</strong></div>
                        <div class="salary-item">К выплате:<strong>[[item.net]] ₽</strong></div>
                      </div>
                    </div>
                  </template>
                </div>
              </section>

              <section class="panel">
                <div class="panel-head"><h2 class="panel-title">Документы</h2></div>
                <div class="section-body">
                  <ul class="docs-list">
                    <template d:repeat="[[docsRows]]">
                      <li class="doc-item">
                        <pl-button variant="link" class="doc-link" label="[[item.title]]"></pl-button>
                      </li>
                    </template>
                  </ul>
                </div>
              </section>

              <section class="panel">
                <div class="panel-head"><h2 class="panel-title">Награды</h2></div>
                <div class="section-body">
                  <template d:repeat="[[awardsRows]]">
                    <div class="award-card">
                      <span class="award-year">[[item.year]]</span>
                      <div class="award-title">[[item.title]]</div>
                      <div class="award-text">[[item.description]]</div>
                    </div>
                  </template>
                </div>
              </section>

              <section class="panel">
                <div class="panel-head"><h2 class="panel-title">Выданная техника</h2></div>
                <div class="section-body">
                  <template d:repeat="[[assetsRows]]">
                    <div class="asset-row">
                      <div>
                        <p class="asset-name">[[item.name]]</p>
                        <div class="asset-meta">[[item.meta]]</div>
                      </div>
                      <div class="asset-right">
                        <div class="asset-date">[[item.assignedOn]]</div>
                        <div class="asset-state">[[item.state]]</div>
                      </div>
                    </div>
                  </template>
                </div>
              </section>

            </div>

            <div class="side-column">
              <section class="panel">
                <div class="panel-head"><h2 class="panel-title">Коллеги</h2></div>
                <div class="section-body">
                  <div class="colleague-list">
                    <template d:repeat="[[colleagues]]">
                      <div class="colleague-card row-link" data-employee-id="[[item.id]]" data-employee-id$="[[item.id]]" on-click="[[onColleagueClick]]">
                        <div class="person-avatar"><img src$="[[item.photoUrl]]" alt$="[[item.displayName]]"></div>
                        <div>
                          <p class="person-name">[[item.displayName]]</p>
                          <p class="person-title">[[item.title]]</p>
                        </div>
                      </div>
                    </template>
                  </div>
                </div>
              </section>

              <section class="panel">
                <div class="panel-head"><h2 class="panel-title">Образование</h2></div>
                <div class="section-body">
                  <template d:repeat="[[educationRows]]">
                    <div class="edu-row">
                      <p class="edu-name">[[item.name]]</p>
                      <div class="edu-years">[[item.years]]</div>
                    </div>
                  </template>
                </div>
              </section>

              <section class="panel">
                <div class="panel-head"><h2 class="panel-title">Доп. курсы и сертификаты</h2></div>
                <div class="section-body">
                  <div class="course-list">
                    <template d:repeat="[[coursesRows]]">
                      <div class="course-card">
                        <div>
                          <p class="course-name">[[item.name]]</p>
                          <div class="course-meta">[[item.provider]] · [[item.period]]</div>
                        </div>
                        <span class="[[courseBadgeClass(item.status)]]">[[item.statusLabel]]</span>
                      </div>
                    </template>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>

        <div class="[[tabPanelClass(activeTab, 'projects')]]">
          <section class="panel">
            <div class="panel-head"><h2 class="inner-title">Проекты и продукты</h2></div>
            <div class="section-body">
              <div class="assignments-grid">
                <template d:repeat="[[assignmentsRows]]">
                  <div class="assignment-card">
                    <p class="assignment-title">[[item.entityName]]</p>
                    <div class="assignment-meta">[[item.entityTypeLabel]] · [[item.roleName]]</div>
                    <div class="assignment-meta">Период: [[item.periodLabel]]</div>
                    <div class="assignment-kpi">Загрузка: [[item.allocationPercent]]%</div>
                  </div>
                </template>
              </div>
            </div>
          </section>
        </div>

        <div class="[[tabPanelClass(activeTab, 'absences')]]">
          <section class="panel">
            <div class="panel-head"><h2 class="inner-title">Отсутствия и режимы работы</h2></div>
            <div class="section-body">
              <div class="assignments-grid">
                <template d:repeat="[[absencesRows]]">
                  <div class="absence-card">
                    <p class="absence-title">[[item.typeLabel]]</p>
                    <div class="absence-meta">[[item.rangeLabel]]</div>
                    <div class="absence-meta">Статус: [[item.approvalLabel]]</div>
                  </div>
                </template>
              </div>
            </div>
          </section>
        </div>

        <div class="[[tabPanelClass(activeTab, 'history')]]">
          <section class="panel">
            <div class="panel-head"><h2 class="inner-title">История изменений</h2></div>
            <div class="section-body">
              <div class="history-controls">
                <pl-input value="{{historySearch}}" placeholder="Поиск в истории..."></pl-input>
                <pl-combobox
                  value="{{historyPeriod}}"
                  data="[[historyPeriodOptions]]"
                  text-property="text"
                  value-property="value"></pl-combobox>
              </div>

              <div class="timeline-list">
                <template d:repeat="[[historyTimelineRows(filteredHistoryRows)]]">
                  <div class="timeline-entry">
                    <p class="[[timelineDayClass(item.showDay)]]">[[item.dayLabel]]</p>
                    <div class="timeline-row">
                      <div class="timeline-axis">
                        <span class="timeline-dot"></span>
                        <span class="[[timelineLineClass(item.isLast)]]"></span>
                      </div>
                      <div class="timeline-time">[[historyTimeLabel(item.timestamp)]]</div>
                      <div class="timeline-avatar"><img src$="[[item.actorPhoto]]" alt$="[[item.actorName]]"></div>
                      <div class="timeline-content">
                        <div class="timeline-text">[[item.text]]</div>
                        <span class="[[historyBadgeClass(item.approvalStatus)]]">[[approvalLabel(item.approvalStatus)]]</span>
                      </div>
                    </div>
                  </div>
                </template>
                <div class="[[historyEmptyClass(filteredHistoryRows)]]">Нет записей по выбранным фильтрам</div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </pl-flex-layout>
  `;

  onConnect() {
    const selected = this.selectedId || 'emp-018';
    const row = pickEmployee(selected) || pickEmployee('emp-018');
    this.selectedId = row?.id || selected;
    this._selectedIdObserver();
  }

  tabButtonClass(activeTab, tabId) {
    return activeTab === tabId ? 'tab-btn is-active' : 'tab-btn';
  }

  tabPanelClass(activeTab, tabId) {
    return activeTab === tabId ? 'tab-panel is-active' : 'tab-panel';
  }

  statusLabel(status) {
    return STATUS_LABELS[status] || 'Онлайн';
  }

  statusChipClass(status) {
    return `chip status-${status || 'inOffice'}`;
  }

  skillLabel(item) {
    if (item && typeof item === 'object') return item.label || '';
    return String(item || '');
  }

  skillChipClass(item) {
    const label = normalize(this.skillLabel(item));
    let tone = 'neutral';
    if (/^l\\d/.test(label)) tone = 'grade';
    else if (label.includes('europe/') || label.includes('asia/')) tone = 'timezone';
    else if (label === 'delivery' || label === 'core') tone = 'tag';
    else if (
      label.includes('операц') ||
      label.includes('кадр') ||
      label.includes('платформ') ||
      label.includes('разраб') ||
      label.includes('аналит')
    ) tone = 'domain';
    else if (
      label.includes('управлен') ||
      label.includes('проект') ||
      label.includes('коммуник') ||
      label.includes('контроль')
    ) tone = 'soft';
    return `skill-chip skill-${tone}`;
  }

  courseBadgeClass(status) {
    return `course-badge course-badge-${status || 'active'}`;
  }

  tenureValue(hireDate) {
    return getYearsInCompany(hireDate);
  }

  approvalLabel(value) {
    return APPROVAL_LABELS[value] || 'Событие';
  }

  historyBadgeClass(value) {
    return `history-badge badge-${value || 'planned'}`;
  }

  historyDayLabel(value) {
    const date = parseDate(value);
    if (!date) return 'ДАТА НЕ ОПРЕДЕЛЕНА';

    const current = todayStart();
    const prev = new Date(current);
    prev.setDate(prev.getDate() - 1);
    const target = new Date(date);
    target.setHours(0, 0, 0, 0);

    if (target.getTime() === current.getTime()) return 'СЕГОДНЯ';
    if (target.getTime() === prev.getTime()) return 'ВЧЕРА';
    return target.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    }).toUpperCase();
  }

  historyTimeLabel(value) {
    return formatTime(value);
  }

  hasHistory(rows) {
    return !Array.isArray(rows) || rows.length === 0;
  }

  historyEmptyClass(rows) {
    return this.hasHistory(rows) ? 'history-empty is-visible' : 'history-empty';
  }

  historyTimelineRows(rows) {
    const source = Array.isArray(rows) ? rows : [];
    let prevDay = '';
    return source.map((item, index) => {
      const dayLabel = this.historyDayLabel(item.timestamp);
      const showDay = dayLabel !== prevDay;
      prevDay = dayLabel;
      return {
        ...item,
        dayLabel,
        showDay,
        isLast: index === source.length - 1
      };
    });
  }

  timelineDayClass(showDay) {
    return showDay ? 'timeline-day' : 'timeline-day is-hidden';
  }

  timelineLineClass(isLast) {
    return isLast ? 'timeline-line is-last' : 'timeline-line';
  }

  onTabClick(event) {
    const tab = event?.currentTarget?.dataset?.tab || 'main';
    this.activeTab = tab;
  }

  _resolveEmployeeId(event) {
    const modelId = event?.model?.item?.id || event?.detail?.item?.id || event?.detail?.id;
    if (modelId) return modelId;
    const currentId = event?.currentTarget?.dataset?.employeeId;
    if (currentId) return currentId;
    const target = event?.target?.closest?.('[data-employee-id]');
    return target?.dataset?.employeeId || '';
  }

  async onManagerClick(event) {
    const id = this._resolveEmployeeId(event);
    if (!id || id === this.selectedId) return;
    await this.open('portal.employee_detail', { selectedId: id });
  }

  async onColleagueClick(event) {
    const id = this._resolveEmployeeId(event);
    if (!id || id === this.selectedId) return;
    await this.open('portal.employee_detail', { selectedId: id });
  }

  async onOpenDepartmentClick() {
    const departmentId = this.selectedEmployee?.departmentId;
    if (!departmentId) return;
    await this.open('portal.department_detail', { selectedId: departmentId });
  }

  _selectedIdObserver() {
    const selected = pickEmployee(this.selectedId) || pickEmployee('emp-018');
    if (!selected) return;

    this.selectedEmployee = selected;

    const allPeople = peopleRows();
    const manager = allPeople.find((item) => item.id === selected.managerId) || {
      id: '',
      displayName: 'Не указан',
      title: '—',
      photoUrl: '',
      contacts: { phone: '—', email: '—' }
    };
    this.manager = manager;

    this.employeeFacts = [
      {
        label: 'Отдел',
        value: departmentName(selected.departmentId)
      },
      {
        label: 'Локация',
        value: `${locationName(selected.locationId)} (офис)`
      },
      {
        label: 'Часовой пояс',
        value: selected.timezone || 'Europe/Moscow'
      },
      {
        label: 'Внутренний телефон',
        value: selected.contacts?.internalPhone || '—'
      }
    ];

    this.colleagues = allPeople
      .filter((item) => item.departmentId === selected.departmentId && item.id !== selected.id)
      .slice(0, 8);

    this.skills = this._buildSkills(selected);
    this.aboutRows = this._buildAbout(selected);
    this.educationRows = this._buildEducation(selected);
    this.coursesRows = this._buildCourses(selected);
    this.salaryRows = this._buildSalary(selected);
    this.docsRows = this._buildDocuments(selected);
    this.awardsRows = this._buildAwards(selected);
    this.assetsRows = this._buildAssets(selected);
    this.assignmentsRows = this._buildAssignments(selected);
    this.absencesRows = this._buildAbsences(selected);
    this.historyRows = this._buildHistory(selected);
    this._historyFilterObserver();
  }

  _historyFilterObserver() {
    const search = normalize(this.historySearch);
    const period = this.historyPeriod;
    const now = new Date();

    const rows = (this.historyRows || []).filter((item) => {
      const date = parseDate(item.timestamp);
      if (!date) return false;

      if (period !== 'all') {
        const days = Number(period);
        if (Number.isFinite(days) && days > 0) {
          const threshold = new Date(now);
          threshold.setDate(threshold.getDate() - days);
          if (date < threshold) return false;
        }
      }

      if (!search) return true;
      const payload = normalize(`${item.text} ${item.actorName} ${item.approvalStatus}`);
      return payload.includes(search);
    });

    this.filteredHistoryRows = rows;
  }

  _buildSkills(employee) {
    const department = departmentName(employee.departmentId);
    const base = [
      ...(employee.tags || []),
      employee.grade,
      employee.timezone,
      department,
      'Стратегическое планирование',
      'Управление стейкхолдерами',
      'Системное мышление',
      'Приоритизация задач',
      'Организация процессов',
      'Управление рисками',
      'Кросс-функциональные коммуникации',
      'Проектное управление',
      'Контроль сроков',
      'Декомпозиция целей',
      'Фасилитация встреч'
    ];

    const unique = [];
    const seen = new Set();
    for (const item of base) {
      const key = normalize(item);
      if (!key || seen.has(key)) continue;
      seen.add(key);
      unique.push(item);
    }
    return unique;
  }

  _buildAbout(employee) {
    const department = normalize(departmentName(employee.departmentId));
    const isOps = department.includes('операц');

    return [
      `${employee.firstName || employee.displayName} работает в команде ${isOps ? 'операции' : 'продукта'}, опыт в компании: ${getYearsInCompany(employee.hireDate)}. Основной фокус в работе - ${normalize(employee.title).includes('руководитель') ? 'руководитель проектов с полноценным сопровождением инициатив от формулировки задач до устойчивого результата в продакшене.' : 'экспертное сопровождение инициатив и стабильное выполнение SLA по ключевым процессам.'}`,
      'В ежедневной деятельности делает ставку на прозрачность процессов, точную приоритизацию и договоренности между командами. Отдельное внимание уделяет качеству коммуникаций: своевременный статус, понятная документация, фиксированные риски и четкий план действий для каждого этапа.',
      'Сильные стороны: системное мышление, аккуратная декомпозиция сложных задач, контроль сроков и устойчивый темп исполнения. В сотрудничестве придерживается прагматичного подхода: меньше лишней бюрократии, больше конкретики, ответственности и измеримого эффекта для бизнеса.'
    ];
  }

  _buildEducation(employee) {
    const title = normalize(employee.title);

    if (title.includes('аналитик')) {
      return [{ name: 'СПБГУ, Бизнес-аналитика', years: '2015 - 2021' }];
    }

    if (title.includes('руководитель')) {
      return [{ name: 'УрФУ, Управление проектами', years: '2014 - 2020' }];
    }

    if (title.includes('дизайн')) {
      return [{ name: 'ИТМО, UX/UI и сервисный дизайн', years: '2016 - 2020' }];
    }

    return [{ name: 'НИУ ВШЭ, Прикладная информатика', years: '2013 - 2019' }];
  }

  _buildCourses(employee) {
    const role = normalize(employee.title);
    const hasDelivery = (employee.tags || []).some((tag) => normalize(tag) === 'delivery');
    const base = [
      {
        name: 'Scrum Product Delivery',
        provider: 'ScrumTrek',
        period: '2025',
        status: 'valid',
        statusLabel: 'Сертификат'
      },
      {
        name: 'Управление рисками в ИТ-проектах',
        provider: 'SkillFactory',
        period: '2024',
        status: 'valid',
        statusLabel: 'Сертификат'
      },
      {
        name: 'Архитектура корпоративных процессов',
        provider: 'OTUS',
        period: '2023',
        status: 'archived',
        statusLabel: 'Завершен'
      }
    ];

    if (role.includes('руководитель') || hasDelivery) {
      base.unshift({
        name: 'PMI Project Management Professional',
        provider: 'PMI',
        period: '2025',
        status: 'valid',
        statusLabel: 'Сертификат'
      });
    } else if (role.includes('аналитик')) {
      base.unshift({
        name: 'Data Analysis in Product Teams',
        provider: 'Яндекс Практикум',
        period: '2025',
        status: 'active',
        statusLabel: 'В процессе'
      });
    } else {
      base.unshift({
        name: 'Engineering Leadership Essentials',
        provider: 'Hexlet',
        period: '2025',
        status: 'active',
        statusLabel: 'В процессе'
      });
    }

    return base;
  }

  _buildSalary(employee) {
    const code = Number(String(employee.id || '').replace(/\D/g, '')) || 18;
    const monthIndex = new Date().getMonth();
    const monthRows = [monthIndex, monthIndex - 1, monthIndex - 2];

    return monthRows.map((idx, offset) => {
      const normalized = (idx + 12) % 12;
      const gross = 292000 + code * 770 + offset * 4300;
      const tax = Math.round(gross * 0.13);
      const net = gross - tax;
      const mm = String(normalized + 1).padStart(2, '0');

      return {
        monthLabel: `${monthRu(normalized)} 2026 г.`,
        fileName: `Квиток_2026_${mm}.pdf`,
        gross: new Intl.NumberFormat('ru-RU').format(gross),
        tax: new Intl.NumberFormat('ru-RU').format(tax),
        net: new Intl.NumberFormat('ru-RU').format(net)
      };
    });
  }

  _buildDocuments(employee) {
    const surname = employee.lastName || employee.displayName?.split(' ')[1] || 'Сотрудник';

    const personal = [
      { id: `${employee.id}-doc-1`, title: `Трудовой договор (${surname}.pdf)` },
      { id: `${employee.id}-doc-2`, title: 'Соглашение о конфиденциальности.pdf' },
      { id: `${employee.id}-doc-3`, title: 'Профиль компетенций.docx' }
    ];

    const linked = (portalData.documents || [])
      .filter((doc) => doc.assigneeId === employee.id || doc.initiatorId === employee.id)
      .slice(0, 4)
      .map((doc) => ({ id: doc.id, title: doc.title }));

    const seen = new Set();
    return [...personal, ...linked].filter((item) => {
      const key = normalize(item.title);
      if (!key || seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }

  _buildAwards(employee) {
    const name = employee.displayName;
    return [
      {
        year: '2025',
        title: 'Грамота Генерального директора',
        description: `За лидерство в реализации корпоративных инициатив и вклад в развитие портала. (${name})`
      },
      {
        year: '2025',
        title: 'Золотая медаль "Лидер изменений"',
        description: 'За высокий личный вклад в оптимизацию процессов и устойчивый результат команды.'
      },
      {
        year: '2024',
        title: 'Почетный знак "За результат"',
        description: 'За достижение ключевых KPI и личный вклад в выполнение стратегических целей.'
      }
    ];
  }

  _buildAssets(_employee) {
    return [
      {
        name: 'Ноутбук Lenovo ThinkPad X1 Carbon',
        meta: 'Core i7 / 32 GB / 1 TB · Инв. № IT-1218-NB',
        assignedOn: '15.01.2025',
        state: 'В эксплуатации'
      },
      {
        name: 'Монитор Dell UltraSharp 27"',
        meta: 'U2723QE · Инв. № IT-2218-MN',
        assignedOn: '15.01.2025',
        state: 'В эксплуатации'
      },
      {
        name: 'Корпоративный смартфон Samsung Galaxy S24',
        meta: '256 GB · Инв. № IT-3218-PH',
        assignedOn: '02.03.2025',
        state: 'В эксплуатации'
      },
      {
        name: 'USB-токен Рутокен ЭЦП 3.0',
        meta: 'Сертификат до 12.2027 · Инв. № IT-4218-TK',
        assignedOn: '15.01.2025',
        state: 'Назначен'
      }
    ];
  }

  _buildAssignments(employee) {
    return assignmentsByEmployee(employee.id).map((item) => ({
      ...item,
      entityTypeLabel: item.entityType === 'project' ? 'Проект' : 'Продукт',
      periodLabel: formatRangeDays(item.validFrom, item.validTo || '2026-12-31')
    }));
  }

  _buildAbsences(employee) {
    const rows = (portalData.absences || [])
      .filter((item) => item.employeeId === employee.id)
      .map((item) => ({
        id: item.id,
        typeLabel: ABSENCE_LABELS[item.type] || item.type,
        approvalLabel: APPROVAL_LABELS[item.approvalStatus] || item.approvalStatus,
        rangeLabel: `${fmtDate(item.startDate)} — ${fmtDate(item.endDate)}`,
        startDate: item.startDate,
        approvalStatus: item.approvalStatus,
        type: item.type
      }));

    if (rows.length) return rows;

    return [
      {
        id: `${employee.id}-absence-default`,
        typeLabel: 'Отсутствий не запланировано',
        approvalLabel: '—',
        rangeLabel: 'На выбранный период данных нет',
        startDate: null,
        approvalStatus: 'planned',
        type: 'none'
      }
    ];
  }

  _buildHistory(employee) {
    const absRows = (portalData.absences || [])
      .filter((item) => item.employeeId === employee.id)
      .map((item, idx) => ({
        id: `${item.id}-hist`,
        timestamp: `${item.startDate}T${String(15 + idx).padStart(2, '0')}:30:00.000Z`,
        actorId: employee.id,
        actorName: employee.displayName,
        actorPhoto: employee.photoUrl,
        text: `${employee.displayName} оформил отсутствие ${ABSENCE_LABELS[item.type] || item.type}`,
        approvalStatus: item.approvalStatus || 'planned'
      }));

    const auditRows = (portalData.auditLog || [])
      .filter((item) => item.actorId === employee.id || item.entityId === employee.id)
      .map((item) => {
        const actorName = employeeName(item.actorId) || employee.displayName;
        const actor = pickEmployee(item.actorId) || employee;
        const entity = item.entityType === 'employee' ? 'карточки сотрудника' : item.entityType;

        return {
          id: item.id,
          timestamp: item.timestamp,
          actorId: item.actorId,
          actorName,
          actorPhoto: actor.photoUrl || employee.photoUrl,
          text: `${actorName} выполнил действие ${item.action} для ${entity}`,
          approvalStatus: item.action === 'update' ? 'approved' : 'planned'
        };
      });

    const documentRows = (portalData.documents || [])
      .filter((doc) => doc.assigneeId === employee.id || doc.initiatorId === employee.id)
      .slice(0, 3)
      .map((doc, idx) => ({
        id: `${doc.id}-doc-hist`,
        timestamp: new Date(Date.now() - (idx + 1) * 36 * 60 * 60 * 1000).toISOString(),
        actorId: employee.id,
        actorName: employee.displayName,
        actorPhoto: employee.photoUrl,
        text: `${employee.displayName} обработал документ ${doc.title}`,
        approvalStatus: doc.status === 'approved' ? 'approved' : 'planned'
      }));

    return [...absRows, ...auditRows, ...documentRows]
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }
}
