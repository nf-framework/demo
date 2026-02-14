import test from 'node:test';
import assert from 'node:assert/strict';

import {
  applyResizeEnd,
  applyResizeStart,
  buildEventFromForm,
  deleteEventById,
  moveAllDaySpan,
  moveTimedEventByClock,
  moveTimedEventByMinutes,
  upsertEvent
} from '../components/calendar/helpers/operations.js';

import { toISODate } from '../components/calendar/helpers/date-time.js';

function makeTimedEvent(id, y, m, d, hh, mm, durationMin) {
  const start = new Date(y, m - 1, d, hh, mm, 0, 0);
  const end = new Date(start.getTime() + durationMin * 60 * 1000);
  return { id, title: `ev-${id}`, type: 'default', start: start.toISOString(), end: end.toISOString(), allDay: false };
}

test('moveTimedEventByMinutes preserves duration and moves to target day/time', () => {
  const events = [makeTimedEvent('1', 2026, 2, 10, 9, 30, 90)];
  const moved = moveTimedEventByMinutes(events, {
    id: '1',
    dayIso: '2026-02-15',
    minutes: 8 * 60 + 15
  });

  assert.equal(moved.length, 1);
  const start = new Date(moved[0].start);
  const end = new Date(moved[0].end);

  assert.equal(toISODate(start), '2026-02-15');
  assert.equal(start.getHours(), 8);
  assert.equal(start.getMinutes(), 15);
  assert.equal((end - start) / 60000, 90);
  assert.equal(moved[0].allDay, false);
});

test('applyResizeStart and applyResizeEnd patch target event only', () => {
  const e1 = makeTimedEvent('1', 2026, 2, 10, 10, 0, 60);
  const e2 = makeTimedEvent('2', 2026, 2, 10, 12, 0, 30);

  const resizedStart = applyResizeStart([e1, e2], {
    id: '1',
    startIso: new Date(2026, 1, 10, 9, 45, 0, 0).toISOString()
  });

  assert.equal(new Date(resizedStart[0].start).getHours(), 9);
  assert.equal(new Date(resizedStart[0].start).getMinutes(), 45);
  assert.equal(resizedStart[1].start, e2.start);

  const resizedEnd = applyResizeEnd(resizedStart, {
    id: '1',
    endIso: new Date(2026, 1, 10, 11, 30, 0, 0).toISOString()
  });

  assert.equal(new Date(resizedEnd[0].end).getHours(), 11);
  assert.equal(new Date(resizedEnd[0].end).getMinutes(), 30);
  assert.equal(resizedEnd[1].end, e2.end);
});

test('moveTimedEventByClock applies day + clock and duration', () => {
  const events = [makeTimedEvent('x', 2026, 2, 11, 14, 0, 120)];
  const moved = moveTimedEventByClock(events, {
    id: 'x',
    dayIso: '2026-02-12',
    time: '07:45',
    durationMs: 120 * 60 * 1000
  });

  const start = new Date(moved[0].start);
  const end = new Date(moved[0].end);

  assert.equal(toISODate(start), '2026-02-12');
  assert.equal(start.getHours(), 7);
  assert.equal(start.getMinutes(), 45);
  assert.equal((end - start) / 60000, 120);
});

test('moveAllDaySpan sets allDay and shifts end by days', () => {
  const events = [makeTimedEvent('ad', 2026, 2, 11, 10, 0, 60)];
  const moved = moveAllDaySpan(events, {
    id: 'ad',
    dayIso: '2026-02-20',
    days: 3
  });

  const start = new Date(moved[0].start);
  const end = new Date(moved[0].end);

  assert.equal(toISODate(start), '2026-02-20');
  assert.equal((end - start) / (24 * 60 * 60 * 1000), 3);
  assert.equal(moved[0].allDay, true);
});

test('buildEventFromForm normalizes invalid end and upsert/delete helpers work', () => {
  const form = {
    id: 'f1',
    title: 'From form',
    type: 'tech',
    allDay: false,
    sDate: '2026-02-10',
    sTime: '10:00',
    eDate: '2026-02-10',
    eTime: '09:00'
  };

  const built = buildEventFromForm(form);
  const start = new Date(built.start);
  const end = new Date(built.end);
  assert.equal((end - start) / 60000, 30);

  const created = upsertEvent([], built, 'create');
  assert.equal(created.length, 1);

  const edited = upsertEvent(created, { ...built, title: 'Updated' }, 'edit');
  assert.equal(edited[0].title, 'Updated');

  const removed = deleteEventById(edited, 'f1');
  assert.equal(removed.length, 0);
});
