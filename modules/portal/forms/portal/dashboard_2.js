import { html, css } from 'polylib';
import { PlForm } from '@nfjs/front-pl/components/pl-form.js';
import '@plcmp/pl-flex-layout';
import '@plcmp/pl-icon';
import '@plcmp/pl-icon-button';
import '@plcmp/pl-button';
import '@plcmp/pl-input';
import '/generated/components/pl-table-pro.js';
import '/generated/components/pl-gantt.js';
import { peopleRows } from '/portal/forms/portal/lib/portal-utils.js';

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

const DAY_MS = 24 * 60 * 60 * 1000;

function startOfDay(value) {
  const date = new Date(value);
  date.setHours(0, 0, 0, 0);
  return date;
}

function dayDiff(fromDate, toDate) {
  return Math.round((startOfDay(toDate).getTime() - startOfDay(fromDate).getTime()) / DAY_MS);
}

function formatBirthdayDateLabel(nextDate, baseDate) {
  const diff = dayDiff(baseDate, nextDate);
  if (diff === 0) return 'Сегодня';
  if (diff === 1) return 'Завтра';
  return nextDate.toLocaleDateString('ru-RU');
}

function addDays(baseDate, days) {
  const date = new Date(baseDate);
  date.setDate(date.getDate() + days);
  return date;
}

const MALE_AVATAR_POOL = [
  'https://www.gravatar.com/avatar/90b8ec37a8eceebef3273940db57ca58?d=https%3A%2F%2Frandomuser.me%2Fapi%2Fportraits%2Fmen%2F40.jpg&s=160&r=g',
  'https://www.gravatar.com/avatar/f691d48568682cd807f026bd97ff8221?d=https%3A%2F%2Frandomuser.me%2Fapi%2Fportraits%2Fmen%2F41.jpg&s=160&r=g',
  'https://www.gravatar.com/avatar/5f395a681a964cc874a60c1cf9dc38bd?d=https%3A%2F%2Frandomuser.me%2Fapi%2Fportraits%2Fmen%2F65.jpg&s=160&r=g',
  'https://www.gravatar.com/avatar/8eeac36ab42f91eadbe163b6b0d94718?d=https%3A%2F%2Frandomuser.me%2Fapi%2Fportraits%2Fmen%2F89.jpg&s=160&r=g',
  'https://www.gravatar.com/avatar/c8b4cd5b9052e883c7fed51f8005d804?d=https%3A%2F%2Frandomuser.me%2Fapi%2Fportraits%2Fmen%2F60.jpg&s=160&r=g'
];

const FEMALE_AVATAR_POOL = [
  'https://www.gravatar.com/avatar/bcb663d06eb62e8f1a77dfee359e6752?d=https%3A%2F%2Frandomuser.me%2Fapi%2Fportraits%2Fwomen%2F92.jpg&s=160&r=g',
  'https://www.gravatar.com/avatar/1969bb29164f3799e18e1b51f1d2979b?d=https%3A%2F%2Frandomuser.me%2Fapi%2Fportraits%2Fwomen%2F52.jpg&s=160&r=g',
  'https://www.gravatar.com/avatar/d3d8ca164e5f3a898343227bd4d7f098?d=https%3A%2F%2Frandomuser.me%2Fapi%2Fportraits%2Fwomen%2F45.jpg&s=160&r=g',
  'https://www.gravatar.com/avatar/11b820193cf9e09c7c07fa1e569f7d3e?d=https%3A%2F%2Frandomuser.me%2Fapi%2Fportraits%2Fwomen%2F72.jpg&s=160&r=g',
  'https://www.gravatar.com/avatar/f983201b280794412ffb0a6a70128372?d=https%3A%2F%2Frandomuser.me%2Fapi%2Fportraits%2Fwomen%2F43.jpg&s=160&r=g'
];

const NAME_GENDER_HINTS = {
  'Александр Волков': 'male',
  'Алексей Смирнов': 'male',
  'Павел Романов': 'male',
  'Елена Козлова': 'female'
};

function normalizeGender(value) {
  return String(value || '').toLowerCase() === 'female' ? 'female' : 'male';
}

function hashName(value) {
  return String(value || '').split('').reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
}

function fallbackAvatarByGender(name, gender) {
  const pool = normalizeGender(gender) === 'female' ? FEMALE_AVATAR_POOL : MALE_AVATAR_POOL;
  return pool[hashName(name) % pool.length];
}

export default class GeneratedDashboard2 extends PlForm {
  static properties = {
    formTitle: { type: String, value: 'Portal: Dashboard 2' },
    hideHeader: { type: Boolean, value: true },
    profile: { type: Object, value: () => ({}) },
    search: { type: String, value: '' },
    welcomeTitle: { type: String, value: '' },
    calendarSubtitle: { type: String, value: '' },
    todayLine: { type: String, value: '' },
    stats: { type: Array, value: () => [] },
    quickActions: { type: Array, value: () => [] },
    highlights: { type: Array, value: () => [] },
    tasks: { type: Array, value: () => [] },
    selectedTask: { value: () => null },
    docs: { type: Array, value: () => [] },
    calendarDays: { type: Array, value: () => [] },
    calendarEvents: { type: Array, value: () => [] },
    birthdays: { type: Array, value: () => [] },
    hrEvents: { type: Array, value: () => [] },
    teamPulse: { type: Array, value: () => [] },
    absencePlan: { type: Array, value: () => [] }
  };

  constructor() {
    super();
    this.onProfileClick = this.onProfileClick.bind(this);
    this.onTaskAssigneeClick = this.onTaskAssigneeClick.bind(this);
    this.onParticipantClick = this.onParticipantClick.bind(this);
    this.onBirthdayClick = this.onBirthdayClick.bind(this);
    this.onGanttEmployeeClick = this.onGanttEmployeeClick.bind(this);
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

    .topbar {
      width: 100%;
      min-width: 0;
      min-height: calc(var(--pl-base-size) + 8px);
      border-bottom: 1px solid var(--pl-grey-light);
      background: var(--pl-background-color);
      padding: 10px 16px;
      box-sizing: border-box;
      gap: 12px;
      align-items: center;
      flex-wrap: nowrap;
    }

    .portal-search {
      min-width: 320px;
      flex: 1 1 auto;
    }

    .topbar-actions {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      margin-inline-start: auto;
      flex-shrink: 0;
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

    .employee-link {
      cursor: pointer;
    }

    .profile-avatar {
      display: inline-flex;
      width: 32px;
      height: 32px;
      border-radius: 999px;
      overflow: hidden;
      background: var(--pl-grey-lightest);
      border: 1px solid var(--pl-grey-base);
      flex-shrink: 0;
    }

    .avatar-photo {
      width: 100%;
      height: 100%;
      border-radius: inherit;
      object-fit: cover;
      display: block;
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
      padding: 12px;
      box-sizing: border-box;
    }

    .content-inner {
      width: 100%;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    @keyframes dash-fade-up {
      from {
        opacity: 0;
        transform: translateY(6px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .welcome-title {
      font: var(--pl-header-font);
      color: var(--pl-header-color);
      font-size: 38px;
      font-weight: 700;
      line-height: 1.1;
      margin: 0;
    }

    .welcome-date {
      font: var(--pl-text-font);
      color: var(--pl-header-color);
      font-size: 16px;
      margin-top: 2px;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(4, minmax(180px, 1fr));
      gap: 10px;
      margin-top: 0;
    }

    .stat-card {
      border: 1px solid var(--pl-grey-base);
      border-radius: 14px;
      background: var(--pl-background-color);
      padding: 12px;
      box-sizing: border-box;
      min-height: 104px;
      animation: dash-fade-up .24s ease-out both;
      transition: transform .18s ease, box-shadow .18s ease, border-color .18s ease;
    }

    .stat-card:hover {
      transform: translateY(-1px);
      border-color: var(--pl-primary-light);
      box-shadow: 0 8px 16px rgba(22, 38, 64, 0.08);
    }

    .stat-title {
      font: var(--pl-header-font);
      color: var(--pl-header-color);
      font-size: 14px;
      font-weight: 600;
    }

    .stat-value {
      margin-top: 4px;
      font: var(--pl-header-font);
      color: var(--pl-header-color);
      font-size: 36px;
      line-height: 1;
      font-weight: 800;
    }

    .stat-sub {
      margin-top: 2px;
      font: var(--pl-text-font);
      color: var(--pl-grey-darkest);
      font-size: 14px;
    }

    .quick-actions-grid {
      display: grid;
      grid-template-columns: repeat(4, minmax(0, 1fr));
      gap: 10px;
    }

    .quick-action-btn {
      width: 100%;
      min-width: 0;
    }

    .dashboard-pinned-grid {
      display: grid;
      grid-template-columns: repeat(4, minmax(0, 1fr));
      gap: 10px;
      margin-top: 0;
    }

    .dashboard-pinned-top-grid {
      margin-bottom: 0;
    }

    .dashboard-pinned-top-grid .pinned-news-card h3 {
      font-size: clamp(18px, 1.1vw, 28px);
    }

    .dashboard-pinned-top-grid .pinned-news-card.is-article h3 {
      font-size: clamp(16px, 1.0vw, 22px);
    }

    .pinned-news-card {
      position: relative;
      border-radius: 14px;
      border: 1px solid #d1ded7;
      box-shadow: 0 8px 18px rgba(24, 58, 46, 0.11);
      transition: transform .18s ease, box-shadow .18s ease;
      padding: 14px;
      color: #f3f7f5;
      text-decoration: none;
      overflow: hidden;
      min-height: 152px;
      display: flex;
      flex-direction: column;
      box-sizing: border-box;
      animation: dash-fade-up .26s ease-out both;
    }

    .pinned-news-card.is-article {
      min-height: 172px;
    }

    .pinned-badge {
      position: relative;
      z-index: 1;
      display: inline-block;
      align-self: flex-start;
      border-radius: 999px;
      padding: 4px 10px;
      background: rgba(255, 255, 255, 0.18);
      color: #f1f6f3;
      font-size: 12px;
      font-weight: 700;
      letter-spacing: 0.03em;
      text-transform: uppercase;
    }

    .pinned-news-card::before,
    .pinned-news-card::after {
      content: "";
      position: absolute;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.14);
    }

    .pinned-news-card::before {
      width: 210px;
      height: 210px;
      right: -70px;
      top: -90px;
    }

    .pinned-news-card::after {
      width: 150px;
      height: 150px;
      left: -60px;
      bottom: -75px;
    }

    .pinned-news-card:hover {
      text-decoration: none;
      transform: translateY(-1px);
      box-shadow: 0 12px 22px rgba(24, 58, 46, 0.18);
    }

    .pinned-news-card h3 {
      position: relative;
      margin: 8px 0 6px;
      font-size: clamp(20px, 1.35vw, 30px);
      line-height: 1.18;
      color: #f3f7f5;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .pinned-news-foot {
      position: relative;
      margin-top: auto;
      padding-top: 8px;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      font-size: 13px;
      color: rgba(243, 247, 245, 0.86);
      gap: 10px;
    }

    .pinned-news-card.tone-a,
    .pinned-news-card.tone-important {
      background: linear-gradient(130deg, #2d8e78 0%, #80bfae 100%);
    }

    .pinned-news-card.tone-b {
      background: linear-gradient(130deg, #2f6f8e 0%, #7aaec6 100%);
    }

    .pinned-news-card.tone-c {
      background: linear-gradient(130deg, #3e8b65 0%, #8ebc7d 100%);
    }

    .pinned-news-card.tone-d {
      background: linear-gradient(130deg, #4f7a95 0%, #9ec0d5 100%);
    }

    .pinned-news-card.tone-critical {
      background: linear-gradient(130deg, #8b4e3e 0%, #cc8f79 100%);
    }

    .content-grid {
      display: grid;
      grid-template-columns: minmax(420px, 1.2fr) minmax(360px, 0.95fr) minmax(280px, 0.62fr);
      gap: 10px;
      margin-top: 0;
      align-items: start;
    }

    .lower-grid {
      display: grid;
      grid-template-columns: minmax(420px, 1.25fr) minmax(300px, 0.9fr) minmax(280px, 0.8fr);
      gap: 10px;
      margin-top: 0;
      align-items: start;
    }

    .panel {
      border: 1px solid var(--pl-grey-base);
      border-radius: 12px;
      background: var(--pl-background-color);
      min-height: 120px;
      box-sizing: border-box;
      overflow: hidden;
      animation: dash-fade-up .24s ease-out both;
    }

    .panel-head {
      min-height: 44px;
      border-bottom: 1px solid var(--pl-grey-light);
      padding: 9px 12px;
      box-sizing: border-box;
      background: var(--pl-background-color);
    }

    .panel-title {
      font: var(--pl-header-font);
      font-size: 17px;
      font-weight: 700;
      color: var(--pl-header-color);
      line-height: 1.15;
    }

    .panel-link-btn {
      white-space: nowrap;
    }

    .task-grid-wrap {
      height: 318px;
      min-height: 260px;
    }

    .task-grid-wrap pl-table-pro {
      width: 100%;
      height: 100%;
      border: 0;
      border-radius: 0;
    }

    .doc-list {
      padding: 12px;
      box-sizing: border-box;
      height: 318px;
      overflow: auto;
    }

    .doc-item {
      border: 1px solid var(--pl-grey-base);
      border-radius: 12px;
      padding: 10px;
      margin-bottom: 10px;
      box-sizing: border-box;
      background: var(--pl-background-color);
      transition: transform .16s ease, border-color .16s ease, box-shadow .16s ease;
    }

    .doc-item:hover {
      transform: translateY(-1px);
      border-color: var(--pl-primary-light);
      box-shadow: 0 5px 12px rgba(22, 38, 64, 0.08);
    }

    .doc-item:last-child {
      margin-bottom: 0;
    }

    .doc-meta-row {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      gap: 6px;
      margin-bottom: 6px;
    }

    .doc-pill {
      display: inline-flex;
      align-items: center;
      min-height: 20px;
      border-radius: 999px;
      padding: 0 8px;
      border: 1px solid var(--pl-grey-base);
      background: var(--pl-grey-lightest);
      color: var(--pl-grey-darkest);
      font: var(--pl-text-font);
      font-size: 12px;
      font-weight: 700;
      white-space: nowrap;
      box-sizing: border-box;
    }

    .doc-pill.type-memo {
      color: #26635e;
      border-color: #a9d8cf;
      background: #e8f7f3;
    }

    .doc-pill.type-order {
      color: #2f5daa;
      border-color: #b8caef;
      background: #edf3ff;
    }

    .doc-pill.type-resolution {
      color: #795617;
      border-color: #e7cb93;
      background: #fff4de;
    }

    .doc-pill.state-draft {
      color: #6d7281;
      border-color: #d2d8e3;
      background: #f4f6fa;
    }

    .doc-pill.state-review {
      color: #8a5d08;
      border-color: #eac87b;
      background: #fff5df;
    }

    .doc-pill.state-done {
      color: #21603f;
      border-color: #9fd1b8;
      background: #e8f7ef;
    }

    .doc-title {
      font: var(--pl-header-font);
      font-size: 14px;
      color: var(--pl-header-color);
      font-weight: 700;
      line-height: 1.25;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .doc-title.accent {
      color: var(--pl-primary-dark);
    }

    .doc-sub {
      margin-top: 3px;
      color: var(--pl-grey-darkest);
      font: var(--pl-text-font);
      font-size: 13px;
      line-height: 1.3;
    }

    .doc-date {
      margin-top: 4px;
      color: var(--pl-grey-darkest);
      font: var(--pl-text-font);
      font-size: 12px;
    }

    .calendar-wrap {
      padding: 12px;
      box-sizing: border-box;
      height: 318px;
      overflow: auto;
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
      transition: transform .14s ease, border-color .14s ease, background-color .14s ease;
    }

    .day-cell:hover {
      transform: translateY(-1px);
      border-color: var(--pl-primary-light);
      background: var(--pl-primary-lightest);
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
      padding: 9px;
      margin-bottom: 10px;
      box-sizing: border-box;
      transition: transform .16s ease, border-color .16s ease, box-shadow .16s ease;
    }

    .agenda-item:hover {
      transform: translateY(-1px);
      border-color: var(--pl-primary-light);
      box-shadow: 0 4px 12px rgba(22, 38, 64, 0.08);
    }

    .agenda-item:last-child {
      margin-bottom: 0;
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

    .agenda-tag.info {
      background: #2f5daa;
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

    .pulse-list {
      padding: 12px;
      box-sizing: border-box;
      display: grid;
      gap: 10px;
      height: 318px;
      overflow: auto;
    }

    .pulse-item {
      border: 1px solid var(--pl-grey-base);
      border-radius: 10px;
      background: var(--pl-background-color);
      padding: 9px 10px;
      box-sizing: border-box;
      transition: transform .16s ease, border-color .16s ease, box-shadow .16s ease;
    }

    .pulse-item:hover {
      transform: translateY(-1px);
      border-color: var(--pl-primary-light);
      box-shadow: 0 4px 12px rgba(22, 38, 64, 0.08);
    }

    .pulse-top {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
    }

    .pulse-name {
      font: var(--pl-header-font);
      font-size: 14px;
      font-weight: 700;
      color: var(--pl-header-color);
      min-width: 0;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .pulse-badge {
      display: inline-flex;
      align-items: center;
      min-height: 20px;
      border-radius: 999px;
      padding: 0 8px;
      font: var(--pl-text-font);
      font-size: 12px;
      font-weight: 700;
      white-space: nowrap;
      border: 1px solid var(--pl-grey-base);
      color: var(--pl-grey-darkest);
      background: var(--pl-grey-lightest);
    }

    .pulse-badge.good {
      color: #21603f;
      border-color: #9fd1b8;
      background: #e8f7ef;
    }

    .pulse-badge.warn {
      color: #7a5700;
      border-color: #e9c77b;
      background: #fff4de;
    }

    .pulse-badge.bad {
      color: #8d2f2f;
      border-color: #efb2b2;
      background: #ffeaea;
    }

    .pulse-meta {
      margin-top: 4px;
      color: var(--pl-grey-darkest);
      font: var(--pl-text-font);
      font-size: 12px;
      line-height: 1.2;
    }

    .pulse-progress {
      margin-top: 7px;
      width: 100%;
      height: 6px;
      border-radius: 999px;
      background: var(--pl-grey-light);
      overflow: hidden;
      position: relative;
    }

    .pulse-progress-value {
      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
      border-radius: inherit;
      background: linear-gradient(90deg, #2f7e67 0%, #61aa95 100%);
      transition: width .22s ease;
    }

    .pulse-progress-value.warn {
      background: linear-gradient(90deg, #8b6a1f 0%, #d3a24f 100%);
    }

    .pulse-progress-value.bad {
      background: linear-gradient(90deg, #9f3d3d 0%, #d47272 100%);
    }

    .birthday-list {
      padding: 12px;
      box-sizing: border-box;
    }

    .birthday-empty {
      padding: 14px 12px;
      font: var(--pl-text-font);
      font-size: 14px;
      color: var(--pl-grey-darkest);
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
      padding: 9px 10px;
      margin-bottom: 10px;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      gap: 10px;
      transition: transform .16s ease, border-color .16s ease, box-shadow .16s ease;
    }

    .birthday-item:hover {
      transform: translateY(-1px);
      border-color: var(--pl-primary-light);
      box-shadow: 0 4px 12px rgba(22, 38, 64, 0.08);
    }

    .birthday-item:last-child {
      margin-bottom: 0;
    }

    .birthday-avatar {
      display: inline-flex;
      width: 56px;
      height: 56px;
      border-radius: 999px;
      overflow: hidden;
      background: var(--pl-grey-lightest);
      border: 1px solid var(--pl-grey-base);
      flex-shrink: 0;
    }

    .birthday-info {
      min-width: 0;
    }

    .birthday-name {
      font: var(--pl-header-font);
      font-size: 15px;
      font-weight: 700;
      color: var(--pl-header-color);
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
      padding: 12px;
      box-sizing: border-box;
      display: grid;
      grid-template-columns: 1fr;
      gap: 10px;
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

    .hr-widget-link-btn {
      white-space: nowrap;
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

    .hr-chip.trip {
      color: #2f5daa;
      border-color: #b8caef;
      background: #edf3ff;
    }

    .hr-chip.sick {
      color: #a33434;
      border-color: #efaaaa;
      background: #ffe8e8;
    }

    .hr-chip.remote {
      color: #21603f;
      border-color: #9fd1b8;
      background: #e8f7ef;
    }

    .hr-chip.vacation {
      color: #8c6200;
      border-color: #f2ca78;
      background: #fff4de;
    }

    .absence-item {
      border: 1px solid var(--pl-grey-base);
      border-radius: 12px;
      padding: 8px;
      margin-bottom: 10px;
      display: flex;
      align-items: center;
      gap: 10px;
      box-sizing: border-box;
      background: var(--pl-background-color);
      transition: transform .16s ease, border-color .16s ease, box-shadow .16s ease;
    }

    .absence-item:hover {
      transform: translateY(-1px);
      border-color: var(--pl-primary-light);
      box-shadow: 0 4px 12px rgba(22, 38, 64, 0.08);
    }

    .absence-item:last-child {
      margin-bottom: 0;
    }

    .absence-avatar {
      display: inline-flex;
      width: 38px;
      height: 38px;
      border-radius: 999px;
      overflow: hidden;
      background: var(--pl-grey-lightest);
      border: 1px solid var(--pl-grey-base);
      flex-shrink: 0;
    }

    .absence-main {
      min-width: 0;
    }

    .absence-name {
      font: var(--pl-header-font);
      font-size: 15px;
      color: var(--pl-header-color);
      font-weight: 700;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .absence-meta {
      margin-top: 4px;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      font: var(--pl-text-font);
      font-size: 13px;
      color: var(--pl-grey-darkest);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .absence-reason {
      display: inline-flex;
      align-items: center;
      min-height: 20px;
      border-radius: 999px;
      padding: 0 8px;
      border: 1px solid var(--pl-grey-base);
      background: var(--pl-grey-lightest);
      color: var(--pl-grey-darkest);
      font-size: 12px;
      font-weight: 700;
      flex-shrink: 0;
      box-sizing: border-box;
    }

    .absence-reason.trip {
      color: #2f5daa;
      border-color: #b8caef;
      background: #edf3ff;
    }

    .absence-reason.sick {
      color: #a33434;
      border-color: #efaaaa;
      background: #ffe8e8;
    }

    .absence-reason.remote {
      color: #21603f;
      border-color: #9fd1b8;
      background: #e8f7ef;
    }

    .absence-reason.vacation {
      color: #8c6200;
      border-color: #f2ca78;
      background: #fff4de;
    }

    .absence-period {
      min-width: 0;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .corp-item {
      border: 1px solid var(--pl-grey-base);
      border-radius: 12px;
      padding: 9px 10px;
      margin-bottom: 10px;
      box-sizing: border-box;
      background: var(--pl-background-color);
      transition: transform .16s ease, border-color .16s ease, box-shadow .16s ease;
    }

    .corp-item:hover {
      transform: translateY(-1px);
      border-color: var(--pl-primary-light);
      box-shadow: 0 4px 12px rgba(22, 38, 64, 0.08);
    }

    .corp-item:last-child {
      margin-bottom: 0;
    }

    .corp-title {
      font: var(--pl-header-font);
      font-size: 15px;
      color: var(--pl-header-color);
      font-weight: 700;
      line-height: 1.24;
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
      overflow: hidden;
      background: var(--pl-grey-lightest);
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border: 1px solid var(--pl-background-color);
      margin-inline-start: -4px;
      box-sizing: border-box;
    }

    .participant:first-child {
      margin-inline-start: 0;
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
      margin-top: 0;
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
      --pl-gantt-vacation-color: #8c6200;
      --pl-gantt-vacation-border: #f2ca78;
      --pl-gantt-vacation-bg: #fff4de;
      --pl-gantt-trip-color: #2f5daa;
      --pl-gantt-trip-border: #a9bff2;
      --pl-gantt-trip-bg: #e9f1ff;
      --pl-gantt-sick-color: #a33434;
      --pl-gantt-sick-border: #efaaaa;
      --pl-gantt-sick-bg: #ffe8e8;
      --pl-gantt-remote-color: #21603f;
      --pl-gantt-remote-border: #9fd1b8;
      --pl-gantt-remote-bg: #e8f7ef;
      --pl-gantt-unpaid-color: #5f6370;
      --pl-gantt-unpaid-border: #d2d8e3;
      --pl-gantt-unpaid-bg: #f3f5f9;
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

    .stats-grid .stat-card:nth-child(1),
    .dashboard-pinned-grid .pinned-news-card:nth-child(1) {
      animation-delay: .02s;
    }

    .stats-grid .stat-card:nth-child(2),
    .dashboard-pinned-grid .pinned-news-card:nth-child(2) {
      animation-delay: .05s;
    }

    .stats-grid .stat-card:nth-child(3),
    .dashboard-pinned-grid .pinned-news-card:nth-child(3) {
      animation-delay: .08s;
    }

    .stats-grid .stat-card:nth-child(4),
    .dashboard-pinned-grid .pinned-news-card:nth-child(4) {
      animation-delay: .11s;
    }

    .content-grid > .panel:nth-child(1),
    .lower-grid > .panel:nth-child(1) {
      animation-delay: .14s;
    }

    .content-grid > .panel:nth-child(2),
    .lower-grid > .panel:nth-child(2),
    .vacation-panel {
      animation-delay: .18s;
    }

    @media (prefers-reduced-motion: reduce) {
      .stat-card,
      .pinned-news-card,
      .panel {
        animation: none;
      }

      .stat-card,
      .pinned-news-card,
      .doc-item,
      .day-cell,
      .agenda-item,
      .birthday-item,
      .absence-item,
      .corp-item {
        transition: none;
      }
    }

    @media (max-width: 1560px) {
      .content-grid {
        grid-template-columns: minmax(380px, 1fr) minmax(330px, .95fr);
      }

      .calendar-panel {
        grid-column: 1 / -1;
      }

      .lower-grid {
        grid-template-columns: repeat(2, minmax(280px, 1fr));
      }
    }

    @media (max-width: 1360px) {
      .dashboard-pinned-grid {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }

      .quick-actions-grid {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }
    }

    @media (max-width: 1100px) {
      .topbar {
        flex-wrap: wrap;
      }

      .portal-search {
        min-width: 0;
        width: 100%;
        max-width: none;
      }

      .stats-grid {
        grid-template-columns: repeat(2, minmax(160px, 1fr));
      }

      .content-grid {
        grid-template-columns: 1fr;
      }

      .hr-widgets {
        grid-template-columns: 1fr;
      }
    }

    @media (max-width: 900px) {
      .content-scroll {
        padding: 10px;
      }

      .topbar {
        padding: 8px 10px;
        gap: 8px;
      }

      .search-hint {
        display: none;
      }

      .profile-card {
        min-width: 180px;
      }

      .stats-grid,
      .dashboard-pinned-grid,
      .quick-actions-grid,
      .lower-grid {
        grid-template-columns: 1fr;
      }

      .task-grid-wrap,
      .doc-list,
      .calendar-wrap,
      .pulse-list {
        height: 300px;
      }

      .vacation-gantt-wrap {
        height: 300px;
        min-height: 240px;
      }
    }

    @media (max-width: 760px) {
      .topbar {
        align-items: stretch;
        flex-wrap: wrap;
      }

      .portal-search {
        order: 2;
        width: 100%;
        min-width: 0;
      }

      .topbar-actions {
        order: 1;
        width: 100%;
        margin-inline-start: 0;
        justify-content: flex-end;
      }

      .profile-card {
        max-width: 320px;
      }

      .welcome-title {
        font-size: 30px;
      }

      .welcome-date {
        font-size: 14px;
      }

      .panel-head {
        padding: 8px 10px;
      }

      .panel-title {
        font-size: 16px;
      }

      .task-grid-wrap,
      .doc-list,
      .calendar-wrap,
      .pulse-list {
        height: 260px;
      }

      .doc-list,
      .calendar-wrap,
      .birthday-list,
      .hr-widgets,
      .pulse-list {
        padding: 10px;
      }

      .vacation-gantt-wrap {
        height: 260px;
        min-height: 220px;
      }
    }

    @media (max-width: 560px) {
      .content-scroll {
        padding: 8px;
      }

      .welcome-title {
        font-size: 26px;
      }

      .topbar-actions {
        gap: 6px;
      }

      .profile-card {
        min-width: 0;
        flex: 1;
      }

      .stat-card {
        min-height: 94px;
        padding: 10px;
      }

      .stat-value {
        font-size: 30px;
      }

      .pinned-news-card {
        min-height: 138px;
        padding: 12px;
      }

      .pinned-news-card.is-article {
        min-height: 148px;
      }

      .days {
        gap: 3px;
      }

      .day-cell {
        min-height: 50px;
      }

      .day-code {
        font-size: 11px;
      }

      .day-num {
        font-size: 14px;
      }

      .task-grid-wrap,
      .doc-list,
      .calendar-wrap,
      .pulse-list,
      .vacation-gantt-wrap {
        height: 220px;
        min-height: 200px;
      }
    }
  `;

  static template = html`
    <pl-flex-layout class="layout" vertical fit>
      <pl-flex-layout class="topbar" stretch align="center">
        <pl-input class="portal-search" placeholder="Поиск по порталу..." value="{{search}}">
          <pl-icon slot="prefix" iconset="pl-default" icon="search" size="16"></pl-icon>
          <span slot="suffix" class="search-hint">⌘K / Ctrl+K</span>
        </pl-input>
        <pl-flex-layout class="topbar-actions" align="center">
          <pl-icon-button class="add-btn" iconset="pl-default" icon="plus"></pl-icon-button>
          <span class="notif-wrap">
            <pl-icon-button variant="secondary" iconset="pl-default" icon="notifications"></pl-icon-button>
            <span class="notif-dot">2</span>
          </span>
          <pl-flex-layout class="profile-card employee-link" align="center" data-employee-id$="[[profile.id]]" on-click="[[onProfileClick]]">
            <span class="profile-avatar">
              <img class="avatar-photo" src$="[[profile.photo_url]]" alt$="[[profile.name]]">
            </span>
            <pl-flex-layout vertical fit gap="0">
              <div class="profile-name">[[profile.name]]</div>
              <div class="profile-role">[[profile.title]]</div>
            </pl-flex-layout>
            <pl-icon iconset="pl-default" icon="chevron-down-s" size="16"></pl-icon>
          </pl-flex-layout>
        </pl-flex-layout>
      </pl-flex-layout>

      <div class="content-scroll">
        <div class="content-inner">
          <h1 class="welcome-title">[[welcomeTitle]]</h1>
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

          <div class="quick-actions-grid">
            <template d:repeat="[[quickActions]]">
              <pl-button class="quick-action-btn" variant="secondary" label="[[item.label]]"></pl-button>
            </template>
          </div>

          <div class="dashboard-pinned-grid dashboard-pinned-top-grid">
            <template d:repeat="[[highlights]]">
              <div class$="[[item.card_class]]">
                <div class="pinned-badge" hidden$="[[!item.tag]]">[[item.tag]]</div>
                <h3>[[item.title]]</h3>
                <div class="pinned-news-foot">
                  <span>[[item.date]]</span>
                </div>
              </div>
            </template>
          </div>

          <div class="content-grid">
          <div class="panel">
            <pl-flex-layout class="panel-head" align="center" justify="space-between">
              <div class="panel-title">Предстоящие задачи</div>
              <pl-button variant="link" class="panel-link-btn" label="Все задачи"></pl-button>
            </pl-flex-layout>
            <div class="task-grid-wrap">
              <pl-table-pro
                data="{{tasks}}"
                selected="{{selectedTask}}">
                <template is="extra styles">
                  <style>
                    .task-owner-cell {
                      display: inline-flex;
                      align-items: center;
                      gap: 8px;
                      min-width: 0;
                    }

                    .task-owner-cell.employee-link {
                      cursor: pointer;
                    }

                    .task-avatar {
                      display: inline-flex;
                      width: 20px;
                      height: 20px;
                      border-radius: 999px;
                      overflow: hidden;
                      background: var(--pl-grey-lightest);
                      border: 1px solid var(--pl-grey-base);
                      flex-shrink: 0;
                    }

                    .task-avatar-photo {
                      width: 100%;
                      height: 100%;
                      border-radius: inherit;
                      object-fit: cover;
                      display: block;
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
                      color: #8a5d08;
                      border-color: #eac87b;
                      background: #fff5df;
                    }
                  </style>
                </template>
                <pl-flex-layout slot="top-toolbar" align="center">
                </pl-flex-layout>
                <pl-table-pro-column id="title" field="title" header="Название" width="420"></pl-table-pro-column>
                <pl-table-pro-column id="assignee" field="assignee" header="Исполнитель" width="190">
                  <template>
                    <div class="task-owner-cell employee-link" data-employee-id$="[[row.assignee_id]]" on-click="[[onTaskAssigneeClick]]">
                      <span class="task-avatar">
                        <img class="task-avatar-photo" src$="[[row.assignee_photo]]" alt$="[[row.assignee]]">
                      </span>
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
                  <div class="doc-meta-row">
                    <span class$="[[_docTypeClass(item.type_tone)]]">[[item.type]]</span>
                    <span class$="[[_docStateClass(item.state_tone)]]">[[item.state]]</span>
                  </div>
                  <div class$="[[_docTitleClass(item.accent)]]">[[item.title]]</div>
                  <div class="doc-sub">[[item.subtitle]]</div>
                  <div class="doc-date">[[item.date]]</div>
                </div>
              </template>
            </div>
          </div>

          <div class="panel calendar-panel">
            <pl-flex-layout class="panel-head" align="center">
              <div class="panel-title">Календарь</div>
            </pl-flex-layout>
            <div class="calendar-wrap">
              <div class="calendar-sub">[[calendarSubtitle]]</div>
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

          <div class="panel vacation-panel">
            <pl-flex-layout class="panel-head" align="center">
              <div class="panel-title">График отсутствий</div>
            </pl-flex-layout>
            <div class="vacation-body">
              <div class="vacation-gantt-wrap">
                <pl-gantt
                  data="[[absencePlan]]"
                  day-width="24"
                  side-width="190"
                  variant="portal"
                  hide-meta-badge
                  on-employee-click="[[onGanttEmployeeClick]]"
                  bar-label-mode="status"></pl-gantt>
              </div>
            </div>
          </div>

          <div class="lower-grid">
          <div class="panel hr-panel">
            <pl-flex-layout class="panel-head" align="center" justify="space-between">
              <div class="panel-title">Кадровый блок</div>
              <div class="hr-caption">Корпоративные мероприятия</div>
            </pl-flex-layout>
            <div class="hr-widgets">
              <div class="hr-widget">
                <pl-flex-layout align="center" justify="space-between">
                  <div class="hr-widget-title">Корпоративные мероприятия</div>
                  <pl-button variant="link" class="hr-widget-link-btn" label="Управлять"></pl-button>
                </pl-flex-layout>
                <template d:repeat="[[hrEvents]]">
                  <div class="corp-item">
                    <div class="corp-title">[[item.title]]</div>
                    <div class="corp-meta">[[item.meta]]</div>
                    <div class="corp-place">[[item.place]]</div>
                    <pl-flex-layout class="corp-bottom" align="center" justify="space-between">
                      <div class="participants">
                        <template d:repeat="{{item.members}}">
                          <span class="participant employee-link" title$="[[item.name]]" data-employee-id$="[[item.id]]" on-click="[[onParticipantClick]]">
                            <img class="avatar-photo" src$="[[item.photo_url]]" alt$="[[item.name]]">
                          </span>
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

          <div class="panel">
            <pl-flex-layout class="panel-head" align="center">
              <div class="panel-title">Пульс команды</div>
            </pl-flex-layout>
            <div class="pulse-list">
              <template d:repeat="[[teamPulse]]">
                <div class="pulse-item">
                  <div class="pulse-top">
                    <div class="pulse-name">[[item.name]]</div>
                    <span class$="[[_pulseBadgeClass(item.tone)]]">[[item.state]]</span>
                  </div>
                  <div class="pulse-meta">[[item.meta]]</div>
                  <div class="pulse-progress">
                    <span class$="[[_pulseProgressClass(item.tone)]]" style$="[[_pulseProgressStyle(item.progress)]]"></span>
                  </div>
                </div>
              </template>
            </div>
          </div>

          <div class="panel birthday-panel">
            <pl-flex-layout class="panel-head" align="center">
              <div class="panel-title">Дни рождения</div>
            </pl-flex-layout>
            <div class="birthday-list">
              <div class="birthday-empty" hidden$="[[birthdays.length]]">Нет дней рождений в ближайшие 3 дня</div>
              <template d:repeat="[[birthdays]]">
                <div class="birthday-item employee-link" data-employee-id$="[[item.id]]" on-click="[[onBirthdayClick]]">
                  <span class="birthday-avatar">
                    <img class="avatar-photo" src$="[[item.photo_url]]" alt$="[[item.name]]">
                  </span>
                  <div class="birthday-info">
                    <div class="birthday-name">[[item.name]]</div>
                    <div class="birthday-date">[[item.date]]</div>
                  </div>
                </div>
              </template>
            </div>
          </div>
          </div>
        </div>
      </div>
    </pl-flex-layout>
  `;

  onConnect() {
    const now = new Date();
    const today = new Date(now);
    today.setHours(0, 0, 0, 0);
    this.todayLine = formatRuDate(today);
    this._avatarByName = this._buildAvatarIndex();
    this.profile = this._withAvatar('Александр Волков');
    this.welcomeTitle = this._composeGreeting(now, this.profile?.name || 'Александр');
    this.calendarSubtitle = `Встречи на сегодня, ${today.toLocaleDateString('ru-RU')}`;

    this.stats = [
      { title: 'Задачи на сегодня', value: '5', subtitle: 'в личном плане' },
      { title: 'Документы', value: '7', subtitle: 'на контроле' },
      { title: 'Встречи', value: '4', subtitle: 'в календаре' },
      { title: 'Отсутствия', value: '8', subtitle: 'по компании' }
    ];

    this.quickActions = [
      { label: 'Создать инцидент' },
      { label: 'Запросить доступ' },
      { label: 'Назначить код-ревью' },
      { label: 'Оформить отсутствие' }
    ];

    this.highlights = [
      { title: 'Релиз платформы 2.7 выведен в production', date: '14.02.2026', tone_class: 'tone-a', tag: 'Новость' },
      { title: 'Инфобез: обязательная смена паролей до 20 февраля', date: '13.02.2026', tone_class: 'tone-c', tag: 'Новость' },
      { title: 'Playbook дежурного SRE: реагирование на P1', date: '09.02.2026', tone_class: 'tone-d', tag: 'Статья', is_article: true },
      { title: 'Гайд по RFC: как согласовывать архитектурные изменения', date: '06.02.2026', tone_class: 'tone-c', tag: 'Статья', is_article: true }
    ].map((item) => ({
      ...item,
      card_class: `pinned-news-card ${item.tone_class || 'tone-a'}${item.is_article ? ' is-article' : ''}`
    }));

    this.tasks = [
      { id: 1, title: 'Подготовить changelog релиза 2.7', assignee: 'Ольга Белова', status: 'В работе', due: 'сегодня, 16:00' },
      { id: 2, title: 'Согласовать RFC по Notification Hub', assignee: 'Павел Морозов', status: 'К выполнению', due: 'сегодня, 17:30' },
      { id: 3, title: 'Закрыть уязвимости P2 в API Gateway', assignee: 'Анна Иванова', status: 'В работе', due: 'сегодня, 18:00' },
      { id: 4, title: 'Провести ревью миграции auth-сервиса', assignee: 'Виктория Зайцева', status: 'К выполнению', due: 'завтра, 11:00' },
      { id: 5, title: 'Обновить runbook дежурной смены', assignee: 'Юлия Григорьева', status: 'В работе', due: 'завтра, 14:00' }
    ].map((row) => {
      const assignee = this._withAvatar(row.assignee);
      return {
        ...row,
        assignee_id: assignee.id || '',
        assignee_initials: assignee.initials,
        assignee_photo: assignee.photo_url,
        status_tone: statusTone(row.status)
      };
    });

    this.docs = [
      {
        title: 'RFC-214: шардирование журнала аудита',
        subtitle: 'Архитектурный комитет · Подготовлен к подписанию',
        date: '14.02.2026',
        type: 'Служебная записка',
        type_tone: 'memo',
        state: 'На согласовании',
        state_tone: 'review'
      },
      {
        title: 'Приказ о дежурствах L2 на март 2026',
        subtitle: 'SRE · График дежурных смен',
        date: '16.02.2026',
        accent: true,
        type: 'Приказ',
        type_tone: 'order',
        state: 'Согласован',
        state_tone: 'done'
      },
      {
        title: 'Запрос на расширение Kubernetes-квоты',
        subtitle: 'Cloud Platform · Финконтроль',
        date: '17.02.2026',
        type: 'Служебная записка',
        type_tone: 'memo',
        state: 'Подписан',
        state_tone: 'done'
      },
      {
        title: 'Приказ о внеплановом аудите CI/CD',
        subtitle: 'Инфобез · Регламент проверки',
        date: '19.02.2026',
        accent: true,
        type: 'Приказ',
        type_tone: 'order',
        state: 'На согласовании',
        state_tone: 'review'
      },
      {
        title: 'Решение по SLA для клиентских сервисов',
        subtitle: 'Операционный комитет · Версия 3.1',
        date: '20.02.2026',
        type: 'Распоряжение',
        type_tone: 'resolution',
        state: 'Принят',
        state_tone: 'done'
      },
      {
        title: 'Пакет закупки лицензий для observability',
        subtitle: 'Платформа данных · Бюджет Q2',
        date: '21.02.2026',
        accent: true,
        type: 'Служебная записка',
        type_tone: 'memo',
        state: 'Черновик',
        state_tone: 'draft'
      },
      {
        title: 'Регламент ротации API-ключей',
        subtitle: 'Инфобез · Обязательное обновление',
        date: '22.02.2026',
        type: 'Распоряжение',
        type_tone: 'resolution',
        state: 'На подписи',
        state_tone: 'review'
      }
    ];

    this.calendarDays = createWeekDays(today);
    this.calendarEvents = [
      { label: 'Сегодня', time: '09:30 - 10:00', title: 'Ежедневный стендап платформенной команды', tone: 'ok' },
      { label: 'Сегодня', time: '11:00 - 11:45', title: 'RFC-review: Notification Hub', tone: 'info' },
      { label: 'Сегодня', time: '14:30 - 15:00', title: 'CAB: релиз 2.7 и окна обслуживания', tone: 'warn' },
      { label: 'Сегодня', time: '16:00 - 16:30', title: 'Разбор инцидента INC-2026-041', tone: 'warn' }
    ];

    this.teamPulse = [
      { name: 'Релизы по плану', state: 'Стабильно', meta: '5 из 5 сервисов выведены без отката', progress: 92, tone: 'good' },
      { name: 'Инциденты P1/P2', state: 'Внимание', meta: '2 активных, MTTR 31 мин', progress: 61, tone: 'warn' },
      { name: 'Покрытие автотестами', state: 'Риск', meta: '86% при целевом пороге 90%', progress: 44, tone: 'bad' },
      { name: 'Очередь code review', state: 'Стабильно', meta: '11 PR ожидают ревью', progress: 78, tone: 'good' }
    ];

    const demoBirthdays = [
      { name: 'Марина Соколова', gender: 'female', days_left: 0 },
      { name: 'Павел Морозов', gender: 'male', days_left: 1 },
      { name: 'Юлия Григорьева', gender: 'female', days_left: 3 }
    ];
    this.birthdays = demoBirthdays.map((row) => {
      const birthdayDate = addDays(today, row.days_left);
      return {
        ...this._withAvatar(row.name, row.gender),
        name: row.name,
        date: formatBirthdayDateLabel(birthdayDate, today),
        days_left: row.days_left
      };
    });

    this.hrEvents = [
      {
        title: 'Тренинг: Безопасная разработка',
        meta: 'Москва · Пн, 16.02.2026 · 10:00 - 11:30',
        place: 'Переговорная «Сигма», 7 этаж · Инфобез',
        registered: 12,
        free: 4,
        members: ['Виктория Зайцева', 'Дарья Субботина', 'Ксения Алексеева', 'Татьяна Крылова', 'Максим Орлов']
      },
      {
        title: 'Platform Guild: observability и SLO',
        meta: 'Санкт-Петербург · Ср, 18.02.2026 · 12:00 - 13:00',
        place: 'Конференц-зал «Нева» · Платформа',
        registered: 16,
        free: 4,
        members: ['Александр Волков', 'Елена Савина', 'Марина Соколова', 'Надежда Михайлова', 'Ольга Белова']
      },
      {
        title: 'Онбординг: процессы релизного цикла',
        meta: 'Екатеринбург · Ср, 18.02.2026 · 15:00 - 16:00',
        place: 'Аудитория «Урал» · HR + Delivery',
        registered: 14,
        free: 4,
        members: ['Игорь Федоров', 'Анна Иванова', 'Дмитрий Смирнов', 'Ольга Белова', 'Сергей Попов']
      },
      {
        title: 'Митап: архитектурные практики и RFC',
        meta: 'Москва · Ср, 18.02.2026 · 18:30 - 20:00',
        place: 'Лекторий «Платформа», 5 этаж · Архитектура',
        registered: 19,
        free: 5,
        members: ['Павел Морозов', 'Екатерина Лебедева', 'Марина Соколова', 'Никита Семенов', 'Дарья Субботина']
      }
    ].map((row) => ({
      ...row,
      members: (row.members || []).map((name) => this._withAvatar(name))
    }));

    this.absencePlan = this._buildAbsencePlan(today);
  }

  _buildAvatarIndex() {
    return new Map(peopleRows().map((row) => [
      row.displayName,
      {
        name: row.displayName,
        id: row.id,
        gender: normalizeGender(row.gender),
        photo_url: row.photoUrl,
        title: row.title || '',
        initials: initials(row.displayName)
      }
    ]));
  }

  _withAvatar(name, genderHint = '') {
    const byName = this._avatarByName?.get(name);
    if (byName) return { ...byName };
    const gender = normalizeGender(genderHint || NAME_GENDER_HINTS[name]);
    return {
      name,
      id: '',
      gender,
      photo_url: fallbackAvatarByGender(name, gender),
      title: '',
      initials: initials(name)
    };
  }

  _docTitleClass(accent) {
    return accent ? 'doc-title accent' : 'doc-title';
  }

  _docTypeClass(tone) {
    return `doc-pill type-${tone || 'memo'}`;
  }

  _docStateClass(tone) {
    return `doc-pill state-${tone || 'draft'}`;
  }

  _dayClass(selected) {
    return selected ? 'day-cell selected' : 'day-cell';
  }

  _agendaTagClass(tone) {
    if (tone === 'warn') return 'agenda-tag warn';
    if (tone === 'info') return 'agenda-tag info';
    return 'agenda-tag';
  }

  _pulseBadgeClass(tone) {
    const normalized = String(tone || '').toLowerCase();
    if (normalized === 'warn') return 'pulse-badge warn';
    if (normalized === 'bad') return 'pulse-badge bad';
    return 'pulse-badge good';
  }

  _pulseProgressClass(tone) {
    const normalized = String(tone || '').toLowerCase();
    if (normalized === 'warn') return 'pulse-progress-value warn';
    if (normalized === 'bad') return 'pulse-progress-value bad';
    return 'pulse-progress-value';
  }

  _pulseProgressStyle(progress) {
    const num = Number(progress);
    const value = Number.isFinite(num) ? Math.min(100, Math.max(0, num)) : 0;
    return `width:${value}%`;
  }

  _composeGreeting(date, fullName) {
    const hours = date instanceof Date ? date.getHours() : new Date().getHours();
    const firstName = String(fullName || '').trim().split(/\s+/)[0] || 'коллега';
    if (hours >= 5 && hours < 12) return `Доброе утро, ${firstName}!`;
    if (hours >= 12 && hours < 18) return `Добрый день, ${firstName}!`;
    if (hours >= 18 && hours < 23) return `Добрый вечер, ${firstName}!`;
    return `Доброй ночи, ${firstName}!`;
  }

  _clampDay(day, baseDate) {
    const maxDay = new Date(baseDate.getFullYear(), baseDate.getMonth() + 1, 0).getDate();
    const numeric = Number(day);
    if (!Number.isFinite(numeric)) return 1;
    return Math.max(1, Math.min(maxDay, Math.round(numeric)));
  }

  _buildAbsencePlan(baseDate) {
    const todayDay = this._clampDay(baseDate.getDate(), baseDate);
    const range = (startOffset, endOffset) => {
      const start = this._clampDay(todayDay + startOffset, baseDate);
      const end = this._clampDay(todayDay + endOffset, baseDate);
      return { start: Math.min(start, end), end: Math.max(start, end) };
    };

    const normalizeSegments = (segments) => segments.map((segment) => {
      const raw = typeof segment.start === 'number' && typeof segment.end === 'number'
        ? range(segment.start, segment.end)
        : { start: this._clampDay(segment.start, baseDate), end: this._clampDay(segment.end, baseDate) };
      return {
        ...segment,
        start: Math.min(raw.start, raw.end),
        end: Math.max(raw.start, raw.end)
      };
    });

    return [
      ...[
        { id: 'abs-1', name: 'Алексей Смирнов', role: 'Backend-разработка', type: 'vacation', start: -6, end: 4 },
        { id: 'abs-2', name: 'Анна Иванова', role: 'QA', type: 'trip', start: -1, end: 2 },
        { id: 'abs-3', name: 'Павел Романов', role: 'DevOps', type: 'sick', start: -2, end: 1 },
        { id: 'abs-4', name: 'Елена Козлова', role: 'HR', type: 'remote', start: -4, end: 6 },
        { id: 'abs-5', name: 'Ольга Тихонова', role: 'Финансы', type: 'unpaid', start: 0, end: 2 },
        { id: 'abs-6', name: 'Алексей Васильев', role: 'Product Manager', type: 'vacation', start: -3, end: 8 },
        { id: 'abs-7', name: 'Софи Макарова', role: 'UX/UI', type: 'remote', start: -5, end: 3 },
        { id: 'abs-8', name: 'Мария Петрова', role: 'Frontend-разработка', type: 'trip', start: -2, end: 4 }
      ].map((row) => {
        const person = this._withAvatar(row.name);
        return {
          id: row.id,
          employeeId: person.id || '',
          title: row.name,
          owner: row.role,
          photo_url: person.photo_url,
          segments: normalizeSegments([{ start: row.start, end: row.end, type: row.type }])
        };
      })
    ];
  }

  async _openEmployeeDetail(employeeId) {
    const id = String(employeeId || '').trim();
    if (!id) return;
    await this.open('portal.employee_detail', { selectedId: id });
  }

  async onProfileClick(event) {
    event?.stopPropagation?.();
    await this._openEmployeeDetail(this.profile?.id);
  }

  async onTaskAssigneeClick(event) {
    event?.stopPropagation?.();
    await this._openEmployeeDetail(event?.model?.row?.assignee_id);
  }

  async onParticipantClick(event) {
    event?.stopPropagation?.();
    await this._openEmployeeDetail(event?.model?.item?.id || event?.currentTarget?.dataset?.employeeId);
  }

  async onBirthdayClick(event) {
    event?.stopPropagation?.();
    await this._openEmployeeDetail(event?.model?.item?.id || event?.currentTarget?.dataset?.employeeId);
  }

  async onGanttEmployeeClick(event) {
    event?.stopPropagation?.();
    await this._openEmployeeDetail(event?.detail?.employeeId);
  }
}
