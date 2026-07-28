import { test } from 'node:test';
import assert from 'node:assert/strict';
import { filterActivities, pickCandidates, segmentAtAngle, findByKey } from '../js/logic.js';

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

test('pickCandidates returns n distinct items without mutating pool', () => {
  const pool = Array.from({ length: 20 }, (_, i) => A({ key: String(i) }));
  const before = pool.map((a) => a.key).join(',');
  const out = pickCandidates(pool, 8, () => 0.5);
  assert.equal(out.length, 8);
  assert.equal(new Set(out.map((a) => a.key)).size, 8);
  assert.equal(pool.map((a) => a.key).join(','), before);
});

test('pickCandidates caps at pool size', () => {
  const pool = [A(), A({ key: '2' })];
  assert.equal(pickCandidates(pool, 8, () => 0).length, 2);
});

test('segmentAtAngle: unrotated wheel, pointer at top hits segment 6 of 8', () => {
  // seg = PI/4; pointer angle -PI/2 normalizes to 3*PI/2 = 6 * PI/4
  assert.equal(segmentAtAngle(0, 8), 6);
});

test('segmentAtAngle: rotating by one segment shifts the winner back by one', () => {
  const seg = (Math.PI * 2) / 8;
  assert.equal(segmentAtAngle(seg, 8), 5);
  assert.equal(segmentAtAngle(-seg, 8), 7);
  assert.equal(segmentAtAngle(seg * 8, 8), 6);
});

test('findByKey matches as string and returns null when absent', () => {
  const all = [A({ key: '8631548' })];
  assert.equal(findByKey(all, '8631548').key, '8631548');
  assert.equal(findByKey(all, 8631548).key, '8631548');
  assert.equal(findByKey(all, 'nope'), null);
});
