/**
 * Adapted from oso95/scroll-world references/scrub-engine.js.
 * Copyright (c) 2026 cyw. MIT; see LICENSE in this directory.
 * Blob seeking, seek coalescing, painted-frame posters and iOS priming.
 * The page coordinator supplies progress; there is no second scroll loop.
 */
export interface ScrubberOptions {
  onFrame: () => void;
  onReset: () => void;
  onError: () => void;
}

export function createVideoScrubber(video: HTMLVideoElement, options: ScrubberOptions) {
  let disposed = false;
  let paused = false;
  let target = 0;
  let objectUrl: string | null = null;
  let abort: AbortController | null = null;
  let seekFrame = 0;
  let paintFrame = 0;
  let painted = false;
  let userReady = false;
  let generation = 0;

  video.muted = true;
  video.playsInline = true;
  video.preload = 'auto';
  video.setAttribute('muted', '');
  video.setAttribute('playsinline', '');

  const markPainted = () => {
    if (disposed || painted || video.readyState < 2) return;
    painted = true;
    options.onFrame();
  };
  const waitForPaint = () => {
    if (painted || paintFrame || disposed) return;
    if (video.requestVideoFrameCallback) {
      paintFrame = video.requestVideoFrameCallback(() => { paintFrame = 0; markPainted(); });
    } else markPainted();
  };
  const seekLatest = () => {
    seekFrame = 0;
    if (disposed || paused || document.hidden || video.seeking || !Number.isFinite(video.duration)) return;
    const time = Math.min(Math.max(0.001, target * video.duration), Math.max(0.001, video.duration - 1 / 24));
    const epsilon = window.matchMedia('(pointer: coarse), (max-width: 860px)').matches ? 0.04 : 0.02;
    if (Math.abs(video.currentTime - time) > epsilon || !painted) {
      try { video.currentTime = time; } catch { /* Poster remains until the decoder is ready. */ }
    }
    waitForPaint();
  };
  const queueSeek = () => { if (!disposed && !seekFrame) seekFrame = requestAnimationFrame(seekLatest); };
  const prime = () => {
    if (disposed || paused || document.hidden || video.readyState < 2) return;
    const loadGeneration = generation;
    video.play().then(() => {
      if (disposed || generation !== loadGeneration) return;
      video.pause();
      queueSeek();
    }).catch(() => queueSeek());
  };
  const firstGesture = () => {
    if (userReady) return;
    userReady = true;
    prime();
  };
  const loadedData = () => {
    video.pause();
    if (userReady) prime();
    queueSeek();
  };
  const seeked = () => { waitForPaint(); queueSeek(); };
  const visibility = () => {
    if (document.hidden) {
      video.pause();
      cancelAnimationFrame(seekFrame);
      seekFrame = 0;
    } else queueSeek();
  };
  video.addEventListener('loadedmetadata', queueSeek);
  video.addEventListener('loadeddata', loadedData);
  video.addEventListener('seeked', seeked);
  video.addEventListener('error', options.onError);
  document.addEventListener('visibilitychange', visibility);
  window.addEventListener('pointerdown', firstGesture, { passive: true });
  window.addEventListener('touchstart', firstGesture, { passive: true });

  const clearSource = () => {
    video.pause();
    if (paintFrame && video.cancelVideoFrameCallback) video.cancelVideoFrameCallback(paintFrame);
    paintFrame = 0;
    video.removeAttribute('src');
    video.load();
    if (objectUrl) URL.revokeObjectURL(objectUrl);
    objectUrl = null;
  };

  return {
    async load(urls: string[]) {
      const loadGeneration = ++generation;
      abort?.abort();
      abort = new AbortController();
      const signal = abort.signal;
      clearSource();
      painted = false;
      options.onReset();
      for (const url of urls) {
        try {
          const response = await fetch(url, { signal });
          if (!response.ok) throw new Error(`Video ${response.status}`);
          const blob = await response.blob();
          if (disposed || signal.aborted || loadGeneration !== generation) return;
          objectUrl = URL.createObjectURL(blob);
          video.src = objectUrl;
          video.load();
          return;
        } catch { if (disposed || signal.aborted) return; }
      }
      if (!disposed) options.onError();
    },
    seek(progress: number) { target = Math.max(0, Math.min(1, progress)); queueSeek(); },
    setPaused(value: boolean) { paused = value; video.pause(); if (!value) queueSeek(); },
    dispose() {
      disposed = true;
      abort?.abort();
      cancelAnimationFrame(seekFrame);
      video.removeEventListener('loadedmetadata', queueSeek);
      video.removeEventListener('loadeddata', loadedData);
      video.removeEventListener('seeked', seeked);
      video.removeEventListener('error', options.onError);
      document.removeEventListener('visibilitychange', visibility);
      window.removeEventListener('pointerdown', firstGesture);
      window.removeEventListener('touchstart', firstGesture);
      clearSource();
    },
  };
}
