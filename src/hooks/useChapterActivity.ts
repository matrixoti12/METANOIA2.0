import { useEffect, useState } from 'react';
import { WORLD_CHAPTERS } from '../lib/scroll-world/journey';
import { getWorldProgress, WORLD_PROGRESS_EVENT, type WorldProgress } from '../utils/scrollWorld';

/** Pause work, not component state, when a visitor leaves a chapter. */
export function useChapterActivity(id: typeof WORLD_CHAPTERS[number]['id']) {
  const index = WORLD_CHAPTERS.findIndex((chapter) => chapter.id === id);
  const [active, setActive] = useState(() => getWorldProgress().chapterIndex === index && !document.hidden);
  useEffect(() => {
    const apply = (frame: WorldProgress) => setActive(frame.chapterIndex === index && !document.hidden);
    const onFrame = (event: Event) => apply((event as CustomEvent<WorldProgress>).detail);
    const onVisibility = () => apply(getWorldProgress());
    window.addEventListener(WORLD_PROGRESS_EVENT, onFrame);
    document.addEventListener('visibilitychange', onVisibility);
    onVisibility();
    return () => {
      window.removeEventListener(WORLD_PROGRESS_EVENT, onFrame);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [index]);
  return active;
}
