import { fromISODate, toISODate } from './date-time.js';

export function parseClockToMinutes(value) {
  const [hh, mm] = String(value || '').split(':').map((x) => parseInt(x, 10));
  if (!Number.isFinite(hh) || !Number.isFinite(mm)) return null;
  if (hh < 0 || hh > 23 || mm < 0 || mm > 59) return null;
  return hh * 60 + mm;
}

export function minutesRangeByEvent(event) {
  const start = new Date(event?.start);
  const end = new Date(event?.end);
  const startMin = start.getHours() * 60 + start.getMinutes();
  const endMin = end.getHours() * 60 + end.getMinutes();
  return {
    startMin,
    endMin: Math.max(startMin + 15, endMin)
  };
}

export function getBlockedIntervals(blockedSlots, dayIso, personId) {
  const day = fromISODate(dayIso);
  const isoDow = ((day.getDay() + 6) % 7) + 1; // 1..7, Monday first

  return (blockedSlots || []).flatMap((slot, index) => {
    if (!slot) return [];

    const slotDate = slot.date || slot.dayIso || null;
    if (slotDate && String(slotDate) !== String(dayIso)) return [];

    const allowedDays = Array.isArray(slot.daysOfWeek) ? slot.daysOfWeek : null;
    if (allowedDays && allowedDays.length && !allowedDays.includes(isoDow)) return [];

    const persons = Array.isArray(slot.personIds)
      ? slot.personIds.map((x) => String(x))
      : (slot.personId ? [String(slot.personId)] : []);
    if (persons.length && !persons.includes(String(personId))) return [];

    const startMin = parseClockToMinutes(slot.start || slot.startTime || slot.from);
    const endMin = parseClockToMinutes(slot.end || slot.endTime || slot.to);
    if (startMin === null || endMin === null || endMin <= startMin) return [];

    return [{
      id: String(slot.id || `blocked-${index}-${dayIso}-${personId}`),
      kind: String(slot.kind || 'break'),
      title: String(slot.title || (slot.kind === 'unavailable' ? 'Недоступно' : 'Перерыв')),
      startMin,
      endMin
    }];
  }).sort((a, b) => a.startMin - b.startMin);
}

export function intersectsBlocked(blockedIntervals, startMin, endMin) {
  return (blockedIntervals || []).some((interval) => {
    return Math.max(startMin, interval.startMin) < Math.min(endMin, interval.endMin);
  });
}

export function moveTimedEventByMinutes(events, { id, dayIso, minutes, personId }) {
  const day = fromISODate(dayIso);
  return (events || []).map((ev) => {
    if (String(ev.id) !== String(id)) return ev;

    const duration = new Date(ev.end) - new Date(ev.start);
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;

    const newStart = new Date(day.getFullYear(), day.getMonth(), day.getDate(), h, m, 0, 0);
    const newEnd = new Date(newStart.getTime() + duration);

    return {
      ...ev,
      start: newStart.toISOString(),
      end: newEnd.toISOString(),
      ...(personId !== undefined ? { personId } : {}),
      allDay: false
    };
  });
}

export function applyResizeStart(events, { id, startIso }) {
  return (events || []).map((ev) => {
    if (String(ev.id) !== String(id)) return ev;
    return { ...ev, start: startIso, allDay: false };
  });
}

export function applyResizeEnd(events, { id, endIso }) {
  return (events || []).map((ev) => {
    if (String(ev.id) !== String(id)) return ev;
    return { ...ev, end: endIso, allDay: false };
  });
}

export function moveTimedEventByClock(events, { id, dayIso, time, durationMs, personId }) {
  const [hh, mm] = String(time || '00:00').split(':').map((x) => parseInt(x, 10));
  const day = fromISODate(dayIso);

  const newStart = new Date(day.getFullYear(), day.getMonth(), day.getDate(), hh || 0, mm || 0, 0, 0);
  const newEnd = new Date(newStart.getTime() + (durationMs || 0));

  return (events || []).map((ev) => {
    if (String(ev.id) !== String(id)) return ev;
    return {
      ...ev,
      start: newStart.toISOString(),
      end: newEnd.toISOString(),
      ...(personId !== undefined ? { personId } : {}),
      allDay: false
    };
  });
}

export function moveAllDaySpan(events, { id, dayIso, days }) {
  const start = fromISODate(dayIso);
  const end = new Date(start);
  end.setDate(end.getDate() + (days || 1));

  return (events || []).map((ev) => {
    if (String(ev.id) !== String(id)) return ev;
    return {
      ...ev,
      start: start.toISOString(),
      end: end.toISOString(),
      allDay: true
    };
  });
}

export function buildEventFromForm(form) {
  const f = form || {};
  const sParts = String(f.sDate || '').split('-').map((n) => parseInt(n, 10));
  const eParts = String(f.eDate || '').split('-').map((n) => parseInt(n, 10));
  const [sh, sm] = String(f.sTime || '00:00').split(':').map((n) => parseInt(n, 10));
  const [eh, em] = String(f.eTime || '00:00').split(':').map((n) => parseInt(n, 10));

  let start = new Date(sParts[0], (sParts[1] || 1) - 1, sParts[2] || 1, f.allDay ? 0 : (sh || 0), f.allDay ? 0 : (sm || 0), 0, 0);
  let end = new Date(eParts[0], (eParts[1] || 1) - 1, eParts[2] || 1, f.allDay ? 0 : (eh || 0), f.allDay ? 0 : (em || 0), 0, 0);

  if (f.allDay) {
    if (end <= start) {
      end = new Date(start);
      end.setDate(end.getDate() + 1);
    }
  } else if (end <= start) {
    end = new Date(start.getTime() + 30 * 60 * 1000);
  }

  return {
    id: f.id,
    title: f.title || 'Без названия',
    type: f.type || 'default',
    personId: f.personId || undefined,
    allDay: !!f.allDay,
    start: start.toISOString(),
    end: end.toISOString()
  };
}

export function upsertEvent(events, nextEvent, mode = 'edit') {
  if (mode === 'create') {
    return [...(events || []), nextEvent];
  }

  return (events || []).map((ev) => (String(ev.id) === String(nextEvent.id) ? nextEvent : ev));
}

export function deleteEventById(events, id) {
  return (events || []).filter((ev) => String(ev.id) !== String(id));
}

export function getEventDayIso(event) {
  return toISODate(new Date(event?.start || new Date()));
}
