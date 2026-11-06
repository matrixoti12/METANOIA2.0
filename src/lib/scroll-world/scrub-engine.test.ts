import assert from 'node:assert/strict';
import { afterEach, beforeEach, test, mock } from 'node:test';
import { createVideoScrubber } from './scrub-engine';

class Video extends EventTarget {
  muted = false;
  playsInline = false;
  preload = '';
  src = '';
  readyState = 2;
  duration = 10;
  seeking = false;
  seeks: number[] = [];
  paints = new Map<number, () => void>();
  private time = 0;
  get currentTime() { return this.time; }
  set currentTime(value: number) { this.time = value; this.seeking = true; this.seeks.push(value); }
  setAttribute() {}
  removeAttribute() { this.src = ''; }
  load() { this.time = 0; this.seeking = false; }
  pause() {}
  play() { return Promise.resolve(); }
  requestVideoFrameCallback(callback: () => void) { this.paints.set(1, callback); return 1; }
  cancelVideoFrameCallback(id: number) { this.paints.delete(id); }
  finishSeek() { this.seeking = false; this.dispatchEvent(new Event('seeked')); }
  paint() { const callbacks = [...this.paints.values()]; this.paints.clear(); callbacks.forEach((callback) => callback()); }
}

let frames: Map<number, FrameRequestCallback>;
let frameId: number;
let win: EventTarget;
let doc: EventTarget & { hidden: boolean };
let revoked: string[];
let cleanups: (() => void)[];
const originals = new Map<string, PropertyDescriptor | undefined>();

function replaceGlobal(name: string, value: unknown) {
  originals.set(name, Object.getOwnPropertyDescriptor(globalThis, name));
  Object.defineProperty(globalThis, name, { configurable: true, writable: true, value });
}
beforeEach(() => {
  frames = new Map(); frameId = 0; revoked = []; cleanups = [];
  win = Object.assign(new EventTarget(), { matchMedia: () => ({ matches: false }) });
  doc = Object.assign(new EventTarget(), { hidden: false });
  replaceGlobal('window', win);
  replaceGlobal('document', doc);
  replaceGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => { frames.set(++frameId, callback); return frameId; });
  replaceGlobal('cancelAnimationFrame', (id: number) => frames.delete(id));
  mock.method(globalThis, 'fetch', async () => new Response(new Blob(['video'])));
  let blobId = 0;
  mock.method(URL, 'createObjectURL', () => `blob:test-${++blobId}`);
  mock.method(URL, 'revokeObjectURL', (url: string) => { revoked.push(url); });
});
afterEach(() => {
  cleanups.forEach((cleanup) => cleanup());
  mock.restoreAll();
  for (const [name, descriptor] of originals) {
    if (descriptor) Object.defineProperty(globalThis, name, descriptor);
    else Reflect.deleteProperty(globalThis, name);
  }
  originals.clear();
});
function tick() {
  const pending = [...frames.values()]; frames.clear();
  pending.forEach((callback) => callback(0));
}
function setup() {
  const video = new Video();
  let painted = 0;
  const scrubber = createVideoScrubber(video as unknown as HTMLVideoElement, {
    onFrame: () => { painted++; }, onReset: () => {}, onError: () => assert.fail('Unexpected media error'),
  });
  cleanups.push(() => scrubber.dispose());
  return { video, scrubber, painted: () => painted };
}

test('fast flicks coalesce to the latest seek and reverse cleanly', async () => {
  const { video, scrubber } = setup();
  await scrubber.load(['/portrait.mp4']);
  scrubber.seek(0.2); tick();
  assert.equal(video.currentTime, 2);
  scrubber.seek(0.4); scrubber.seek(0.8); tick();
  assert.deepEqual(video.seeks, [2]);
  video.finishSeek(); tick();
  assert.equal(video.currentTime, 8);
  scrubber.seek(0.1); tick();
  assert.equal(video.currentTime, 8);
  video.finishSeek(); tick();
  assert.equal(video.currentTime, 1);
});

test('the poster remains until an actual video frame has painted', async () => {
  const { video, scrubber, painted } = setup();
  await scrubber.load(['/portrait.mp4']);
  video.dispatchEvent(new Event('loadedmetadata')); tick();
  assert.equal(painted(), 0);
  video.finishSeek();
  assert.equal(painted(), 0);
  video.paint();
  assert.equal(painted(), 1);
});

test('pause and document visibility retain the latest scroll target', async () => {
  const { video, scrubber } = setup();
  await scrubber.load(['/portrait.mp4']);
  scrubber.setPaused(true); scrubber.seek(0.7); tick();
  assert.deepEqual(video.seeks, []);
  scrubber.setPaused(false); tick();
  assert.equal(video.currentTime, 7);
  video.finishSeek(); doc.hidden = true;
  doc.dispatchEvent(new Event('visibilitychange'));
  scrubber.seek(0.3); tick();
  assert.equal(video.currentTime, 7);
  doc.hidden = false; doc.dispatchEvent(new Event('visibilitychange')); tick();
  assert.equal(video.currentTime, 3);
});

test('orientation source replacement preserves progress and revokes the old blob', async () => {
  const { video, scrubber } = setup();
  await scrubber.load(['/portrait.mp4']);
  scrubber.seek(0.65); tick(); video.finishSeek(); video.paint();
  const firstSource = video.src;
  await scrubber.load(['/landscape.mp4']);
  assert.deepEqual(revoked, [firstSource]);
  assert.notEqual(video.src, firstSource);
  video.dispatchEvent(new Event('loadedmetadata')); tick();
  assert.equal(video.currentTime, 6.5);
  scrubber.dispose();
  assert.equal(video.src, '');
  assert.equal(revoked.length, 2);
});

test('a late fetch cannot attach a video after unmount', async () => {
  const { video, scrubber } = setup();
  let finish!: (response: Response) => void;
  mock.method(globalThis, 'fetch', () => new Promise<Response>((resolve) => { finish = resolve; }));
  const loading = scrubber.load(['/portrait.mp4']);
  scrubber.dispose();
  finish(new Response(new Blob(['late video'])));
  await loading;
  assert.equal(video.src, '');
  assert.equal(frames.size, 0);
});
