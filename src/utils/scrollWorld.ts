export const WORLD_PROGRESS_EVENT = 'metanoia:world-progress';
import type { JourneyFrame } from '../lib/scroll-world/journey';
export type WorldProgress = JourneyFrame;
export const WORLD_SCENE_EVENT = 'metanoia:world-scene';
export const WORLD_MEDIA_EVENT = 'metanoia:world-media';
export interface WorldMedia { video: HTMLVideoElement | null; ready: boolean; paused: boolean }
export const WORLD_SOURCES_EVENT = 'metanoia:world-sources';
export const DEFAULT_WORLD_SOURCES = {
  desktopVideoSrc: '/assets/backgrounds/metanoia-desktop-scrub.mp4',
  mobileVideoSrc: '/assets/backgrounds/metanoia-mobile-scrub.mp4',
};
let currentSources = { ...DEFAULT_WORLD_SOURCES };
export function getWorldSources() { return { ...currentSources }; }
export function configureWorldSources(sources: typeof DEFAULT_WORLD_SOURCES) {
  if (sources.desktopVideoSrc === currentSources.desktopVideoSrc && sources.mobileVideoSrc === currentSources.mobileVideoSrc) return;
  currentSources = { ...sources };
  window.dispatchEvent(new Event(WORLD_SOURCES_EVENT));
}

let currentProgress: WorldProgress = { progress: 0, active: false, pageProgress: 0, heroProgress: 0,
  chapterIndex: 0, chapterProgress: 0, gateProgress: 0, routeProgress: 0, scrollY: 0 };
let currentMedia: WorldMedia = { video: null, ready: false, paused: false };

export function getWorldMedia(): WorldMedia { return { ...currentMedia }; }

export function publishWorldMedia(media: WorldMedia) {
  currentMedia = media;
  window.dispatchEvent(new CustomEvent<WorldMedia>(WORLD_MEDIA_EVENT, { detail: media }));
}

export function getWorldProgress(): WorldProgress {
  return { ...currentProgress };
}

export function publishWorldProgress(frame: WorldProgress) {
  currentProgress = frame;
  window.dispatchEvent(new CustomEvent<WorldProgress>(WORLD_PROGRESS_EVENT, {
    detail: currentProgress,
  }));
}
