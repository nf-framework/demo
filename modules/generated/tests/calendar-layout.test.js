import test from 'node:test';
import assert from 'node:assert/strict';

import { layoutDay, packWeekSpans, isoWeek } from '../components/calendar/helpers/layout.js';
import { isAllDay } from '../components/calendar/helpers/layout.js';

function timed(id, y, m, d, hh, mm, durationMin) {
  const start = new Date(y, m - 1, d, hh, mm, 0, 0);
  const end = new Date(start.getTime() + durationMin * 60 * 1000);
  return { id, start: start.toISOString(), end: end.toISOString(), title: `t${id}` };
}

test('layoutDay splits overlapping events into multiple columns', () => {
  const events = [
    timed('1', 2026, 2, 10, 9, 0, 60),
    timed('2', 2026, 2, 10, 9, 30, 60),
    timed('3', 2026, 2, 10, 10, 0, 30)
  ];

  const placed = layoutDay(events);

  assert.equal(placed.length, 3);
  assert.ok(placed.some((x) => x.cols >= 2));
  assert.ok(placed.every((x) => x.widthPct > 0));
  assert.ok(placed.every((x) => x.leftPct >= 0));
});

test('packWeekSpans packs all-day spans into non-overlapping rows', () => {
  const weekStart = new Date(2026, 1, 9); // 2026-02-09 (Mon)

  const events = [
    { id: 'a', allDay: true, start: new Date(2026, 1, 9).toISOString(), end: new Date(2026, 1, 12).toISOString() },
    { id: 'b', allDay: true, start: new Date(2026, 1, 10).toISOString(), end: new Date(2026, 1, 11).toISOString() },
    { id: 'c', allDay: true, start: new Date(2026, 1, 12).toISOString(), end: new Date(2026, 1, 14).toISOString() }
  ];

  const rows = packWeekSpans(weekStart, events);
  assert.ok(rows.length >= 2);

  rows.forEach((row) => {
    for (let i = 0; i < row.length; i++) {
      for (let j = i + 1; j < row.length; j++) {
        const r1 = row[i];
        const r2 = row[j];
        const overlap = !(r1.endIdx < r2.startIdx || r1.startIdx > r2.endIdx);
        assert.equal(overlap, false);
      }
    }
  });
});

test('isoWeek returns week number in expected range', () => {
  const weekNo = isoWeek(new Date(2026, 1, 10));
  assert.ok(weekNo >= 1 && weekNo <= 53);
});

test('all-day overlap selection for day view catches spanning events', () => {
  const dayStart = new Date(2026, 1, 13, 0, 0, 0, 0);
  const nextDay = new Date(dayStart);
  nextDay.setDate(nextDay.getDate() + 1);

  const events = [
    { id: 'a', allDay: true, start: new Date(2026, 1, 12).toISOString(), end: new Date(2026, 1, 14).toISOString() },
    { id: 'b', allDay: true, start: new Date(2026, 1, 10).toISOString(), end: new Date(2026, 1, 13).toISOString() },
    { id: 'c', allDay: true, start: new Date(2026, 1, 14).toISOString(), end: new Date(2026, 1, 16).toISOString() }
  ];

  const selected = events.filter((ev) => {
    if (!isAllDay(ev)) return false;
    const start = new Date(ev.start);
    const end = new Date(ev.end);
    return start < nextDay && end > dayStart;
  });

  assert.deepEqual(selected.map((x) => x.id), ['a']);
});
