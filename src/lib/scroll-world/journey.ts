export const WORLD_CHAPTERS = [
  { id: 'inicio', label: 'Inicio', accent: '#c3a7ff', start: 0 },
  { id: 'proposito', label: 'Propósito', accent: '#9de9ff', start: 0.20 },
  { id: 'oracion', label: 'Oración', accent: '#f4b6ff', start: 0.36 },
  { id: 'minijuegos', label: 'Juegos', accent: '#cda9ff', start: 0.49 },
  { id: 'testimonios', label: 'Historias', accent: '#ffe1b5', start: 0.68 },
  { id: 'photospot', label: 'Tu foto', accent: '#b5ffe6', start: 0.82 },
  { id: 'cierre', label: 'Esto Es Metanoia 2026', accent: '#e9c5ff', start: 0.96 },
] as const;

export interface ChapterBounds { top: number; bottom: number }
export interface JourneyFrame {
  progress: number;
  active: boolean;
  pageProgress: number;
  heroProgress: number;
  chapterIndex: number;
  chapterProgress: number;
  gateProgress: number;
  routeProgress: number;
  scrollY: number;
}
export const clamp = (value: number, min = 0, max = 1) => Math.max(min, Math.min(max, value));
export const smooth = (value: number) => { const x = clamp(value); return x * x * (3 - 2 * x); };

/** One monotonic itinerary, even when sections have very different reading lengths. */
export function journeyAt(y: number, viewport: number, bounds: ChapterBounds[], heroEnd: number, pageEnd: number): JourneyFrame {
  const focus = y + viewport * 0.35;
  let index = 0;
  bounds.forEach((chapter, i) => { if (focus >= chapter.top) index = i; });
  index = Math.min(index, WORLD_CHAPTERS.length - 1);
  const chapter = bounds[index] || { top: 0, bottom: pageEnd + viewport };
  const end = bounds[index + 1]?.top ?? Math.max(chapter.top + 1, pageEnd + viewport * 0.35);
  const distance = Math.max(1, end - chapter.top);
  const local = clamp((focus - chapter.top) / distance);
  const gateDistance = Math.min(viewport * 0.6, distance * 0.45);
  const gate = clamp((focus - chapter.top) / Math.max(1, gateDistance));
  const reading = clamp((focus - chapter.top - gateDistance) / Math.max(1, distance - gateDistance));
  const travel = gate * 0.32 + reading * 0.68;
  const hero = clamp(y / Math.max(1, heroEnd));
  const firstEnd = Math.max(heroEnd + 1, (bounds[1]?.top ?? pageEnd) - viewport * 0.35);
  const firstTravel = hero * 0.75 + clamp((y - heroEnd) / (firstEnd - heroEnd)) * 0.25;
  const from = WORLD_CHAPTERS[index].start;
  const to = WORLD_CHAPTERS[index + 1]?.start ?? 1;
  return {
    progress: clamp(index === 0 ? firstTravel * to : from + travel * (to - from)),
    active: y < pageEnd,
    pageProgress: clamp(y / Math.max(1, pageEnd)),
    heroProgress: hero, chapterIndex: index, chapterProgress: local, gateProgress: gate,
    routeProgress: index === 0 ? hero : index + travel,
    scrollY: y,
  };
}
