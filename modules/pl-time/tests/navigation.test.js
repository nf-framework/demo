import test from 'node:test';
import assert from 'node:assert/strict';
import { calcNextMinutes, calcScrollTopForOption } from '../components/helpers/navigation.js';

test('calcNextMinutes moves down for ArrowDown and up for ArrowUp', () => {
  assert.equal(calcNextMinutes(600, 'ArrowDown', 15), 615);
  assert.equal(calcNextMinutes(600, 'ArrowUp', 15), 585);
});

test('calcNextMinutes ignores unsupported keys', () => {
  assert.equal(calcNextMinutes(600, 'Enter', 15), 600);
});

test('calcScrollTopForOption keeps visible option in place', () => {
  const nextTop = calcScrollTopForOption({
    viewTop: 120,
    viewHeight: 100,
    optionTop: 140,
    optionHeight: 24
  });
  assert.equal(nextTop, 120);
});

test('calcScrollTopForOption scrolls up to reveal option above viewport', () => {
  const nextTop = calcScrollTopForOption({
    viewTop: 200,
    viewHeight: 100,
    optionTop: 160,
    optionHeight: 24
  });
  assert.equal(nextTop, 160);
});

test('calcScrollTopForOption scrolls down to reveal option below viewport', () => {
  const nextTop = calcScrollTopForOption({
    viewTop: 0,
    viewHeight: 100,
    optionTop: 140,
    optionHeight: 24
  });
  assert.equal(nextTop, 64);
});

test('calcScrollTopForOption does not jump when viewport height is zero', () => {
  const nextTop = calcScrollTopForOption({
    viewTop: 320,
    viewHeight: 0,
    optionTop: 1400,
    optionHeight: 24
  });
  assert.equal(nextTop, 320);
});

