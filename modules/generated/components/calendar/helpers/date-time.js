export function pad(value) {
  return String(value).padStart(2, '0');
}

const RU_MONTHS_NOM = [
  'Январь',
  'Февраль',
  'Март',
  'Апрель',
  'Май',
  'Июнь',
  'Июль',
  'Август',
  'Сентябрь',
  'Октябрь',
  'Ноябрь',
  'Декабрь'
];

const RU_MONTHS_GEN = [
  'января',
  'февраля',
  'марта',
  'апреля',
  'мая',
  'июня',
  'июля',
  'августа',
  'сентября',
  'октября',
  'ноября',
  'декабря'
];

const RU_WEEKDAYS_SHORT = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
const RU_WEEKDAYS_FULL = ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота', 'Воскресенье'];

function mondayWeekdayIndex(date) {
  const d = date instanceof Date ? date : new Date(date);
  return (d.getDay() + 6) % 7;
}

export function fmt(date) {
  const d = date instanceof Date ? date : new Date(date);
  return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function ppm() {
  const v = getComputedStyle(document.documentElement).getPropertyValue('--px-per-minute').trim();
  if (v) return parseFloat(v) || 1.5;

  const h = getComputedStyle(document.documentElement).getPropertyValue('--hour-height').trim();
  const hourHeight = parseFloat(h) || 90;
  return hourHeight / 60;
}

export function snap15(minutes) {
  return Math.max(0, Math.min(1439, Math.round(minutes / 15) * 15));
}

export function sameDate(a, b) {
  const d1 = a instanceof Date ? a : new Date(a);
  const d2 = b instanceof Date ? b : new Date(b);

  return d1.getFullYear() === d2.getFullYear()
    && d1.getMonth() === d2.getMonth()
    && d1.getDate() === d2.getDate();
}

export function toISODate(date) {
  const d = date instanceof Date ? date : new Date(date);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export function fromISODate(value) {
  const [year, month, day] = String(value).split('-').map((x) => parseInt(x, 10));
  return new Date(year, month - 1, day);
}

export function hm(date) {
  const d = date instanceof Date ? date : new Date(date);
  return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function ruWeekdayShort(date) {
  return RU_WEEKDAYS_SHORT[mondayWeekdayIndex(date)];
}

export function ruWeekdayFull(date) {
  return RU_WEEKDAYS_FULL[mondayWeekdayIndex(date)];
}

export function ruMonthYear(date) {
  const d = date instanceof Date ? date : new Date(date);
  return `${RU_MONTHS_NOM[d.getMonth()]} ${d.getFullYear()}`;
}

export function ruDayMonth(date) {
  const d = date instanceof Date ? date : new Date(date);
  return `${d.getDate()} ${RU_MONTHS_GEN[d.getMonth()]}`;
}

export function ruFullDate(date) {
  const d = date instanceof Date ? date : new Date(date);
  return `${ruWeekdayFull(d)}, ${d.getDate()} ${RU_MONTHS_GEN[d.getMonth()]} ${d.getFullYear()}`;
}

export function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}
