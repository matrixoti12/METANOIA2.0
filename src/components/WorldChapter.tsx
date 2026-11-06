import React from 'react';
import { WORLD_CHAPTERS } from '../lib/scroll-world/journey';

export function WorldChapter({ id, children }: { id: typeof WORLD_CHAPTERS[number]['id']; children: React.ReactNode }) {
  const chapter = WORLD_CHAPTERS.find((entry) => entry.id === id)!;
  return <div className="world-chapter" data-world-chapter={id}>
    {id !== 'inicio' && <div className="world-chapter-gate" aria-hidden="true">
      <span className="world-gate-orbit" style={{ borderColor: chapter.accent }} />
      <div className="world-gate-copy"><span className="world-gate-light" style={{ background: chapter.accent }} />
        <span className="world-gate-title">{chapter.label}</span>
      </div>
    </div>}
    {children}
  </div>;
}
