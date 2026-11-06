import React, { useLayoutEffect, useRef } from 'react';
import { ArrowDown, ArrowUpRight } from 'lucide-react';
import { configureWorldSources, DEFAULT_WORLD_SOURCES, getWorldProgress, WORLD_PROGRESS_EVENT, WORLD_SCENE_EVENT } from '../utils/scrollWorld';
import type { WorldProgress } from '../utils/scrollWorld';

const PHASES = [
  { label: 'La identidad', start: 0 }, { label: 'El despertar', start: 0.18 },
  { label: 'El nuevo comienzo', start: 0.35 }, { label: 'La transformación', start: 0.62 },
  { label: 'El encuentro', start: 0.86 },
];
const smooth = (a: number, b: number, value: number) => {
  const t = Math.max(0, Math.min(1, (value - a) / (b - a)));
  return t * t * (3 - 2 * t);
};
export interface MetanoiaScrollWorldProps {
  children: React.ReactNode; desktopVideoSrc?: string; mobileVideoSrc?: string;
  logoSrc?: string; className?: string; particleQuality?: 'low' | 'medium' | 'high';
  debug?: boolean; onReady?: () => void; onComplete?: () => void;
}

/** Introductory choreography consumes the same frame as every other chapter. */
export function MetanoiaScrollWorld({ children, desktopVideoSrc = DEFAULT_WORLD_SOURCES.desktopVideoSrc,
  mobileVideoSrc = DEFAULT_WORLD_SOURCES.mobileVideoSrc, className = '', debug = false,
  onReady, onComplete }: MetanoiaScrollWorldProps) {
  const worldRef = useRef<HTMLDivElement>(null);
  const callbacks = useRef({ onReady, onComplete });
  callbacks.current = { onReady, onComplete };
  useLayoutEffect(() => {
    const world = worldRef.current!;
    const site = world.closest<HTMLElement>('.metanoia-site')!;
    configureWorldSources({ desktopVideoSrc, mobileVideoSrc });
    const logo = world.querySelector<HTMLElement>('[data-world-logo]')!;
    const intro = world.querySelector<HTMLElement>('.world-intro-copy')!;
    const kicker = world.querySelector<HTMLElement>('.hero-kicker')!;
    const arrival = world.querySelector<HTMLElement>('.world-arrival')!;
    const hint = world.querySelector<HTMLElement>('.world-scroll-hint')!;
    const phaseName = world.querySelector<HTMLElement>('.world-phase-name')!;
    const phases = world.querySelectorAll<HTMLElement>('.world-phase');
    const preference = matchMedia('(prefers-reduced-motion: reduce)');
    let completed = false;
    let announced = false;
    let phase = -1;
    let lastProgress = -1;
    let lastReady = false;
    const sync = (frame: WorldProgress) => {
      const p = preference.matches ? 0 : frame.heroProgress;
      const sceneReady = site.dataset.webgl === 'ready';
      if (p === lastProgress && sceneReady === lastReady) return;
      lastProgress = p; lastReady = sceneReady;
      const transfer = sceneReady ? smooth(0.18, 0.28, p) : smooth(0.35, 0.48, p);
      logo.style.opacity = String(1 - transfer);
      [intro, kicker].forEach((element) => {
        element.style.opacity = String(1 - smooth(0.18, 0.34, p));
        element.style.visibility = p < 0.34 ? 'visible' : 'hidden';
      });
      const opacity = smooth(0.86, 0.97, p);
      arrival.style.opacity = String(opacity);
      arrival.style.visibility = opacity > 0 ? 'visible' : 'hidden';
      arrival.style.translate = `0 ${(1 - opacity) * 18}px`;
      arrival.inert = opacity < 0.6;
      hint.style.opacity = String(1 - smooth(0.02, 0.12, p));
      hint.style.visibility = p < 0.12 ? 'visible' : 'hidden';
      const nextPhase = PHASES.reduce((index, entry, current) => p >= entry.start ? current : index, 0);
      if (nextPhase !== phase) {
        phase = nextPhase; phaseName.textContent = PHASES[phase].label;
        phases.forEach((item, index) => {
          if (index === phase) item.setAttribute('aria-current', 'step'); else item.removeAttribute('aria-current');
          item.classList.toggle('is-complete', index < phase);
        });
      }
      world.dataset.progress = p.toFixed(4);
      if (sceneReady && !announced) { announced = true; callbacks.current.onReady?.(); }
      if (p >= 0.999 && !completed) { completed = true; callbacks.current.onComplete?.(); }
      if (p < 0.98) completed = false;
    };
    const onFrame = (event: Event) => sync((event as CustomEvent<WorldProgress>).detail);
    const refresh = () => sync(getWorldProgress());
    window.addEventListener(WORLD_PROGRESS_EVENT, onFrame);
    window.addEventListener(WORLD_SCENE_EVENT, refresh);
    preference.addEventListener('change', refresh);
    refresh();
    return () => {
      window.removeEventListener(WORLD_PROGRESS_EVENT, onFrame);
      window.removeEventListener(WORLD_SCENE_EVENT, refresh);
      preference.removeEventListener('change', refresh);
      [logo, intro, kicker, arrival, hint].forEach((element) => element.removeAttribute('style'));
    };
  }, [desktopVideoSrc, mobileVideoSrc]);
  return <div ref={worldRef} className={`scroll-world ${className}`} data-engine="oso95/scroll-world">
    <div className="world-viewport">
      <div className="world-intro">{children}</div>
      <div className="world-arrival">
        <p className="world-arrival-date">21 de noviembre · Guazapa</p>
        <h2>Algo nuevo<br />comienza en ti.</h2>
        <p>Una noche. Una palabra.<br />Una vida que puede cambiar para siempre.</p>
        <a href="#encuentro" className="event-action world-arrival-link">Descubre lo que viene <ArrowUpRight size={18} aria-hidden="true" /></a>
      </div>
      <a href="#encuentro" className="world-scroll-hint"><span>Desliza y entra en Metanoia</span><ArrowDown size={16} aria-hidden="true" /></a>
      <div className="world-journey"><span className="world-phase-name">La identidad</span>
        <ol aria-label="Etapas del recorrido">{PHASES.map((entry, index) => <li key={entry.label} className="world-phase"
          aria-label={entry.label} aria-current={index === 0 ? 'step' : undefined} />)}</ol>
      </div>
      {debug && <output className="world-debug">Scroll World · recorrido continuo</output>}
    </div>
  </div>;
}
