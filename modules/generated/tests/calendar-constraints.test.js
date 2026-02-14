import test from 'node:test';
import assert from 'node:assert/strict';

import {
  getBlockedIntervals,
  intersectsBlocked,
  parseClockToMinutes
} from '../components/calendar/helpers/operations.js';
import {
  buildEventFromForm,
  moveTimedEventByMinutes
} from '../components/calendar/helpers/operations.js';
import { toISODate } from '../components/calendar/helpers/date-time.js';

test('parseClockToMinutes parses valid 24h values', () => {
  assert.equal(parseClockToMinutes('00:00'), 0);
  assert.equal(parseClockToMinutes('13:45'), 825);
  assert.equal(parseClockToMinutes('23:59'), 1439);
  assert.equal(parseClockToMinutes('24:00'), null);
  assert.equal(parseClockToMinutes('abc'), null);
});

test('getBlockedIntervals filters by day and person', () => {
  const blockedSlots = [
    { id: 'b1', kind: 'break', start: '13:00', end: '14:00', daysOfWeek: [1, 2, 3, 4, 5] },
    { id: 'b2', kind: 'unavailable', personId: 'doctor_a', start: '09:00', end: '10:00', daysOfWeek: [1, 2, 3, 4, 5] },
    { id: 'b3', date: '2026-02-17', personId: 'doctor_b', start: '15:00', end: '16:00' }
  ];

  const dayIso = '2026-02-17'; // Tuesday
  const forA = getBlockedIntervals(blockedSlots, dayIso, 'doctor_a');
  const forB = getBlockedIntervals(blockedSlots, dayIso, 'doctor_b');

  assert.equal(forA.length, 2);
  assert.equal(forB.length, 2);
  assert.ok(forA.some((x) => x.id === 'b1'));
  assert.ok(forA.some((x) => x.id === 'b2'));
  assert.ok(forB.some((x) => x.id === 'b1'));
  assert.ok(forB.some((x) => x.id === 'b3'));
});

test('intersectsBlocked catches overlap correctly', () => {
  const intervals = [
    { startMin: 13 * 60, endMin: 14 * 60 },
    { startMin: 16 * 60, endMin: 17 * 60 }
  ];

  assert.equal(intersectsBlocked(intervals, 12 * 60, 13 * 60), false);
  assert.equal(intersectsBlocked(intervals, 12 * 60 + 30, 13 * 60 + 15), true);
  assert.equal(intersectsBlocked(intervals, 14 * 60 + 5, 15 * 60), false);
  assert.equal(intersectsBlocked(intervals, 16 * 60 + 30, 17 * 60 + 10), true);
});

test('moveTimedEventByMinutes can reassign person', () => {
  const start = new Date(2026, 1, 17, 10, 0, 0, 0);
  const end = new Date(2026, 1, 17, 11, 0, 0, 0);

  const events = [{
    id: 'x1',
    title: 'Событие',
    personId: 'doctor_a',
    start: start.toISOString(),
    end: end.toISOString(),
    allDay: false
  }];

  const moved = moveTimedEventByMinutes(events, {
    id: 'x1',
    dayIso: '2026-02-18',
    minutes: 9 * 60 + 30,
    personId: 'doctor_b'
  });

  assert.equal(moved[0].personId, 'doctor_b');
  const movedStart = new Date(moved[0].start);
  assert.equal(toISODate(movedStart), '2026-02-18');
  assert.equal(movedStart.getHours(), 9);
  assert.equal(movedStart.getMinutes(), 30);
});

test('buildEventFromForm stores selected person', () => {
  const ev = buildEventFromForm({
    id: 'f1',
    title: 'Тест',
    type: 'tech',
    personId: 'doctor_a',
    allDay: false,
    sDate: '2026-02-17',
    sTime: '08:30',
    eDate: '2026-02-17',
    eTime: '09:30'
  });

  assert.equal(ev.personId, 'doctor_a');
});
