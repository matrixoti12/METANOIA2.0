import assert from 'node:assert/strict';
import { test } from 'node:test';
import { journeyAt, WORLD_CHAPTERS } from './journey';

// Long reading sections, a shorter form, and a compact footer, as in the actual site.
const viewport = 800;
const starts = [0, 3500, 6800, 8200, 11200, 12700, 15800];
const bounds = starts.map((top, index) => ({ top, bottom: starts[index + 1] ?? 16500 }));
const pageEnd = 15700;

test('the itinerary includes every real chapter and reaches the final video frame', () => {
  assert.equal(journeyAt(0, viewport, bounds, 1120, pageEnd).progress, 0);
  for (let index = 0; index < WORLD_CHAPTERS.length; index++) {
    const y = Math.max(0, starts[index] - viewport * 0.35 + 1);
    assert.equal(journeyAt(y, viewport, bounds, 1120, pageEnd).chapterIndex, index);
  }
  const end = journeyAt(pageEnd, viewport, bounds, 1120, pageEnd);
  assert.equal(end.progress, 1);
  assert.equal(end.pageProgress, 1);
  assert.equal(end.chapterIndex, 6);
});

test('video time remains monotonic across chapter seams with unequal reading lengths', () => {
  let previous = 0;
  for (let y = 0; y <= pageEnd; y += 5) {
    const frame = journeyAt(y, viewport, bounds, 1120, pageEnd);
    assert.ok(frame.progress >= previous - 1e-10, `Rewind at scroll ${y}`);
    assert.ok(frame.progress >= 0 && frame.progress <= 1);
    previous = frame.progress;
  }
});

test('reverse scrolling retraces the same camera and video positions', () => {
  const forward = new Map<number, ReturnType<typeof journeyAt>>();
  for (let y = 0; y < pageEnd; y += 100) forward.set(y, journeyAt(y, viewport, bounds, 1120, pageEnd));
  [...forward.keys()].reverse().forEach((y) => assert.deepEqual(journeyAt(y, viewport, bounds, 1120, pageEnd), forward.get(y)));
});

test('the hero completes while the rest of the world continues moving', () => {
  const intro = journeyAt(1120, viewport, bounds, 1120, pageEnd);
  const prayer = journeyAt(7200, viewport, bounds, 1120, pageEnd);
  const photo = journeyAt(14000, viewport, bounds, 1120, pageEnd);
  assert.equal(intro.heroProgress, 1);
  assert.equal(prayer.heroProgress, 1);
  assert.ok(prayer.progress > intro.progress);
  assert.ok(photo.progress > prayer.progress);
  assert.ok(photo.routeProgress > prayer.routeProgress);
});
