import React, { useLayoutEffect, useRef } from 'react';
import { journeyAt, WORLD_CHAPTERS, clamp, smooth } from '../lib/scroll-world/journey';
import { getWorldProgress, publishWorldProgress, WORLD_SCENE_EVENT } from '../utils/scrollWorld';
import type { createWorldScene } from '../lib/scroll-world/world-scene';

interface Layer { element: HTMLElement; top: number; bottom: number; offset: number; lastY: number; lastOpacity: number }

/** The page owns scroll once. The hero, chapter gates, video, camera and navigation consume its frame. */
export function PageScrollWorld() {
  const hostRef = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    const host = hostRef.current!;
    const site = host.closest<HTMLElement>('.metanoia-site')!;
    const chapters = Array.from(site.querySelectorAll<HTMLElement>('[data-world-chapter]'));
    const hero = site.querySelector<HTMLElement>('.scroll-world')!;
    const logo = site.querySelector<HTMLElement>('[data-world-logo]')!;
    const tint = host.querySelector<HTMLElement>('.world-scene-tint')!;
    const preference = matchMedia('(prefers-reduced-motion: reduce)');
    let reduced = preference.matches;
    let mobile = innerWidth < 860 || matchMedia('(pointer: coarse)').matches;
    let width = innerWidth;
    let height = innerHeight;
    let raf = 0;
    let measureNeeded = true;
    let disposed = false;
    let lastChapter = -1;
    let pageEnd = 1;
    let heroEnd = 1;
    let bounds: { top: number; bottom: number }[] = [];
    let layers: Layer[] = [];
    let scene: ReturnType<typeof createWorldScene> | undefined;
    let sceneLoading = false;

    const ready = (value: boolean) => {
      site.dataset.webgl = value ? 'ready' : 'fallback';
      window.dispatchEvent(new CustomEvent(WORLD_SCENE_EVENT, { detail: value }));
    };
    const loadScene = () => {
      if (reduced || scene || sceneLoading) return;
      sceneLoading = true;
      void import('../lib/scroll-world/world-scene').then(({ createWorldScene: createScene }) => {
        sceneLoading = false;
        if (disposed || reduced) return;
        try {
          scene = createScene(host, logo, { logoSrc: logo.getAttribute('src')!, particleQuality: mobile ? 'low' : 'medium',
            onReady: () => ready(true), onFallback: () => ready(false) });
          scene.setFrame(getWorldProgress());
        } catch { ready(false); }
      }).catch(() => { sceneLoading = false; if (!disposed) ready(false); });
    };

    const measure = () => {
      site.style.setProperty('--page-height', `${height}px`);
      site.style.setProperty('--page-width', `${site.getBoundingClientRect().width}px`);
      const y = scrollY;
      bounds = chapters.map((chapter) => {
        const rect = chapter.getBoundingClientRect();
        return { top: rect.top + y, bottom: rect.bottom + y };
      });
      heroEnd = hero.getBoundingClientRect().top + y + hero.offsetHeight - height;
      pageEnd = Math.max(1, document.documentElement.scrollHeight - height);
      const nodes = Array.from(site.querySelectorAll<HTMLElement>(
        '[data-world-layer], .world-chapter section > h2, .world-chapter section > .text-center, ' +
        '.world-chapter .section-heading, .world-chapter .content-surface, .world-chapter .story-card, ' +
        '.world-chapter .salvation-step, .world-chapter .guest-portrait',
      ));
      const old = new Map(layers.map((layer) => [layer.element, layer]));
      layers = nodes.filter((node) => !node.parentElement?.closest('.content-surface')).map((element, index) => {
        const previous = old.get(element);
        const rect = element.getBoundingClientRect();
        const currentY = previous?.lastY || 0;
        return { element, top: rect.top + y - currentY, bottom: rect.bottom + y - currentY,
          offset: mobile ? 12 + index % 3 * 3 : 22 + index % 3 * 8,
          lastY: currentY, lastOpacity: previous?.lastOpacity ?? 1 };
      });
      layers.forEach(({ element }) => element.classList.add('world-depth-layer'));
      measureNeeded = false;
      scene?.resize();
    };

    const update = () => {
      raf = 0;
      if (disposed || document.hidden) return;
      if (measureNeeded) measure();
      const y = scrollY;
      const frame = journeyAt(y, height, bounds, heroEnd, pageEnd);
      const focused = document.activeElement;
      if (lastChapter !== frame.chapterIndex) {
        lastChapter = frame.chapterIndex;
        const chapter = WORLD_CHAPTERS[lastChapter];
        site.dataset.worldChapter = chapter.id;
        site.style.setProperty('--chapter-accent', chapter.accent);
        tint.style.background = `radial-gradient(ellipse at ${lastChapter % 2 ? '20%' : '80%'} 45%, ${chapter.accent}24, transparent 68%)`;
      }
      chapters.forEach((chapter, index) => {
        const near = bounds[index].bottom > y - height * 0.5 && bounds[index].top < y + height * 1.7;
        chapter.classList.toggle('world-near', near);
        const gate = chapter.querySelector<HTMLElement>('.world-gate-copy');
        if (!gate || reduced) return;
        const center = bounds[index].top + height * (mobile ? 0.22 : 0.28) - y;
        const visibility = smooth(1 - Math.abs(center - height * 0.52) / (height * 0.65));
        gate.style.opacity = String(visibility);
        gate.style.translate = `0 ${(center - height * 0.5) * (mobile ? 0.06 : 0.12)}px`;
      });
      layers.forEach((layer) => {
        if (reduced || (layer.top > y + height * 1.4) || (layer.bottom < y - height * 0.3)) return;
        const entry = smooth((height * 0.96 - (layer.top - y)) / (height * 0.6));
        const interacting = focused instanceof Element && layer.element.contains(focused);
        const translate = interacting ? 0 : Math.round((1 - entry) * layer.offset * 10) / 10;
        const opacity = interacting ? 1 : Math.round((0.4 + 0.6 * entry) * 1000) / 1000;
        if (translate !== layer.lastY) { layer.element.style.translate = `0 ${translate}px`; layer.lastY = translate; }
        if (opacity !== layer.lastOpacity) { layer.element.style.opacity = String(opacity); layer.lastOpacity = opacity; }
      });
      publishWorldProgress(frame);
      if (!reduced) scene?.setFrame(frame);
      host.dataset.progress = frame.progress.toFixed(4);
      host.dataset.chapter = WORLD_CHAPTERS[frame.chapterIndex].id;
    };
    const schedule = () => { if (!raf && !document.hidden) raf = requestAnimationFrame(update); };
    const invalidate = () => { measureNeeded = true; schedule(); };
    const onResize = () => {
      // Keyboard and mobile URL bars change height only: keep the reading position stable.
      if (mobile && innerWidth === width) return;
      width = innerWidth; height = innerHeight;
      mobile = width < 860 || matchMedia('(pointer: coarse)').matches;
      invalidate();
    };
    const onPreference = () => {
      reduced = preference.matches;
      layers.forEach((layer) => {
        layer.element.style.removeProperty('translate'); layer.element.style.removeProperty('opacity');
        layer.lastY = 0; layer.lastOpacity = 1;
      });
      if (reduced) { scene?.dispose(); scene = undefined; ready(false); }
      else loadScene();
      invalidate();
    };
    const resizeObserver = new ResizeObserver(invalidate);
    chapters.forEach((chapter) => resizeObserver.observe(chapter));
    const mutations = new MutationObserver(invalidate);
    site.querySelectorAll('main').forEach((main) => mutations.observe(main, { childList: true, subtree: true }));
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', onResize);
    document.addEventListener('visibilitychange', schedule);
    document.addEventListener('focusin', schedule);
    preference.addEventListener('change', onPreference);
    measure(); update(); loadScene();
    void document.fonts.ready.then(() => { if (!disposed) invalidate(); });
    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      resizeObserver.disconnect(); mutations.disconnect();
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', onResize);
      document.removeEventListener('visibilitychange', schedule);
      document.removeEventListener('focusin', schedule);
      preference.removeEventListener('change', onPreference);
      layers.forEach(({ element }) => { element.style.removeProperty('translate'); element.style.removeProperty('opacity'); element.classList.remove('world-depth-layer'); });
      scene?.dispose();
      site.style.removeProperty('--page-height'); site.style.removeProperty('--page-width');
    };
  }, []);
  return <div ref={hostRef} className="page-world-scene" data-engine="oso95/scroll-world" aria-hidden="true">
    <div className="world-scene-tint" />
  </div>;
}
