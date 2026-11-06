import React, { useEffect, useRef, useState } from 'react';
import { Pause, Play } from 'lucide-react';
import { createVideoScrubber } from '../lib/scroll-world/scrub-engine';
import { WORLD_PROGRESS_EVENT, WORLD_SOURCES_EVENT, getWorldSources, getWorldProgress, publishWorldMedia } from '../utils/scrollWorld';
import type { WorldProgress } from '../utils/scrollWorld';

/** One native decoder is shared by the background and WebGL VideoTexture. */
export const CyberBackground: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const scrubberRef = useRef<ReturnType<typeof createVideoScrubber> | null>(null);
  const [reduced, setReduced] = useState(() => matchMedia('(prefers-reduced-motion: reduce)').matches);
  const [paused, setPaused] = useState(false);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const preference = matchMedia('(prefers-reduced-motion: reduce)');
    const change = () => setReduced(preference.matches);
    preference.addEventListener('change', change);
    return () => preference.removeEventListener('change', change);
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || reduced) {
      publishWorldMedia({ video: null, ready: false, paused: true });
      return;
    }
    const scrubber = createVideoScrubber(video, {
      onFrame: () => {
        setReady(true);
        publishWorldMedia({ video, ready: true, paused: false });
      },
      onReset: () => {
        setReady(false);
        setFailed(false);
        publishWorldMedia({ video: null, ready: false, paused: false });
      },
      onError: () => {
        setFailed(true);
        setReady(false);
        publishWorldMedia({ video: null, ready: false, paused: false });
      },
    });
    scrubberRef.current = scrubber;
    const orientation = matchMedia('(orientation: portrait)');
    const load = () => {
      const variant = orientation.matches ? 'mobile' : 'desktop';
      const asset = `/assets/backgrounds/metanoia-${variant}`;
      const sources = getWorldSources();
      const source = orientation.matches ? sources.mobileVideoSrc : sources.desktopVideoSrc;
      video.poster = `${asset}-scrub.jpg`;
      void scrubber.load([source, `${asset}.mp4`]);
      scrubber.seek(getWorldProgress().progress);
    };
    const onProgress = (event: Event) => scrubber.seek((event as CustomEvent<WorldProgress>).detail.progress);
    orientation.addEventListener('change', load);
    window.addEventListener(WORLD_PROGRESS_EVENT, onProgress);
    window.addEventListener(WORLD_SOURCES_EVENT, load);
    load();
    return () => {
      orientation.removeEventListener('change', load);
      window.removeEventListener(WORLD_PROGRESS_EVENT, onProgress);
      window.removeEventListener(WORLD_SOURCES_EVENT, load);
      scrubber.dispose();
      scrubberRef.current = null;
      publishWorldMedia({ video: null, ready: false, paused: false });
    };
  }, [reduced]);

  useEffect(() => {
    scrubberRef.current?.setPaused(paused);
    publishWorldMedia({ video: ready ? videoRef.current : null, ready, paused: paused || reduced });
  }, [paused, ready, reduced]);

  return <>
    <div className="ambient-scene" aria-hidden="true">
      <picture className="ambient-poster">
        <source media="(orientation: portrait)" srcSet="/assets/backgrounds/metanoia-mobile-scrub.jpg" />
        <img src="/assets/backgrounds/metanoia-desktop-scrub.jpg" alt="" />
      </picture>
      {!reduced && <video ref={videoRef} className="ambient-video" muted playsInline preload="auto"
        disablePictureInPicture disableRemotePlayback tabIndex={-1} style={{ opacity: ready ? 1 : 0 }} />}
      <div className="ambient-vignette" />
    </div>
    {!failed && !reduced && <button type="button" className="background-playback"
      onClick={() => setPaused((value) => !value)} aria-pressed={paused}
      aria-label={paused ? 'Reanudar video del recorrido' : 'Pausar video del recorrido'}
      title={paused ? 'Reanudar video' : 'Pausar video'}>
      {paused ? <Play size={15} aria-hidden="true" /> : <Pause size={15} aria-hidden="true" />}
    </button>}
  </>;
};
