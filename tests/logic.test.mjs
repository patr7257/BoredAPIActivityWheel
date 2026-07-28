import { test } from 'node:test';
import assert from 'node:assert/strict';
import { filterActivities } from '../js/logic.js';

const A = (over = {}) => ({
  activity: 'x', type: 'social', participants: 1, price: 0,
  accessibility: '', duration: 'minutes', kidFriendly: true, link: '', key: '1',
  ...over,
});

test('no filters returns everything', () => {
  const all = [A(), A({ key: '2' })];
  assert.equal(filterActivities(all, {}).length, 2);
});

test('participants 1 matches only solo', () => {
  const all = [A({ participants: 1 }), A({ participants: 2, key: '2' })];
  const out = filterActivities(all, { participants: '1' });
  assert.deepEqual(out.map((a) => a.key), ['1']);
});

test('participants 4plus matches 4 or more', () => {
  const all = [A({ participants: 2 }), A({ participants: 4, key: '4' }), A({ participants: 8, key: '8' })];
  const out = filterActivities(all, { participants: '4plus' });
  assert.deepEqual(out.map((a) => a.key), ['4', '8']);
});

test('price free means exactly zero', () => {
  const all = [A({ price: 0 }), A({ price: 0.1, key: '2' })];
  assert.deepEqual(filterActivities(all, { price: 'free' }).map((a) => a.key), ['1']);
});

test('price cheap means at most 0.3', () => {
  const all = [A({ price: 0 }), A({ price: 0.3, key: '2' }), A({ price: 0.5, key: '3' })];
  assert.deepEqual(filterActivities(all, { price: 'cheap' }).map((a) => a.key), ['1', '2']);
});

test('types filters to listed types, empty list means all', () => {
  const all = [A({ type: 'social' }), A({ type: 'diy', key: '2' })];
  assert.deepEqual(filterActivities(all, { types: ['diy'] }).map((a) => a.key), ['2']);
  assert.equal(filterActivities(all, { types: [] }).length, 2);
});
