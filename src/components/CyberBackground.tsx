import React, { useEffect, useRef, useState } from 'react';
import { Pause, Play } from 'lucide-react';

const isPortrait = () => typeof window !== 'undefined' && window.matchMedia('(orientation: portrait)').matches;
const prefersStill = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const CDN_BASE = 'https://cdn.jsdelivr.net/gh/matrixoti12/METANOIA2.0@main/public';

/** Original artwork stays fixed behind the entire page, with one video per orientation. */
export const CyberBackground: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [portrait, setPortrait] = useState(isPortrait);
  const [paused, setPaused] = useState(prefersStill);
  const [blocked, setBlocked] = useState(false);
  const [failed, setFailed] = useState(false);
  const [useLocal, setUseLocal] = useState(false);
  const [readyToStream, setReadyToStream] = useState(false);

  const asset = '/assets/backgrounds/metanoia-' + (portrait ? 'mobile' : 'desktop');
  const videoSrc = (useLocal ? '' : CDN_BASE) + asset + '.mp4';
  const posterSrc = asset + '.jpg';

  // Defer heavy video connection until critical UI (fonts, CSS, JS) has painted
  useEffect(() => {
    const timer = window.setTimeout(() => setReadyToStream(true), 200);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    const orientation = window.matchMedia('(orientation: portrait)');
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onOrientation = () => setPortrait(orientation.matches);
    const onMotion = () => setPaused(motion.matches);
    orientation.addEventListener('change', onOrientation);
    motion.addEventListener('change', onMotion);
    return () => {
      orientation.removeEventListener('change', onOrientation);
      motion.removeEventListener('change', onMotion);
    };
  }, []);

  useEffect(() => { setFailed(false); setBlocked(false); }, [asset]);

  useEffect(() => {
    if (!readyToStream) return;
    const video = videoRef.current;
    if (!video) return;
    let disposed = false;
    const syncPlayback = () => {
      if (paused || document.hidden) {
        video.pause();
        return;
      }
      video.muted = true;
      video.play()
        .then(() => { if (!disposed) setBlocked(false); })
        .catch((error: DOMException) => {
          if (!disposed && error.name !== 'AbortError') setBlocked(true);
        });
    };
    syncPlayback();
    video.addEventListener('canplay', syncPlayback);
    document.addEventListener('visibilitychange', syncPlayback);
    return () => {
      disposed = true;
      video.pause();
      video.removeEventListener('canplay', syncPlayback);
      document.removeEventListener('visibilitychange', syncPlayback);
    };
  }, [asset, paused, readyToStream, videoSrc]);

  const togglePlayback = () => {
    if (paused || blocked) {
      setPaused(false);
      setBlocked(false);
      videoRef.current?.play().catch(() => setBlocked(true));
    } else {
      setPaused(true);
      videoRef.current?.pause();
    }
  };

  const handleVideoError = () => {
    if (!useLocal) {
      // If CDN fails, gracefully fallback to local asset
      setUseLocal(true);
    } else {
      setFailed(true);
    }
  };

  const stopped = paused || blocked;
  return (
    <>
      <div className="ambient-scene" aria-hidden="true">
        <picture className="ambient-poster">
          <source media="(orientation: portrait)" srcSet="/assets/backgrounds/metanoia-mobile.jpg" />
          <img src="/assets/backgrounds/metanoia-desktop.jpg" alt="" />
        </picture>
        {readyToStream && (
          <video
            ref={videoRef}
            className="ambient-video"
            src={videoSrc}
            poster={posterSrc}
            autoPlay={!paused}
            muted
            loop
            playsInline
            preload="metadata"
            disablePictureInPicture
            disableRemotePlayback
            tabIndex={-1}
            onError={handleVideoError}
            style={failed ? { display: 'none' } : undefined}
          />
        )}
        <div className="ambient-vignette" />
      </div>
      {!failed && (
        <button
          type="button"
          className="background-playback"
          onClick={togglePlayback}
          aria-label={stopped ? 'Reproducir fondo animado' : 'Pausar fondo animado'}
          title={stopped ? 'Reproducir fondo' : 'Pausar fondo'}
        >
          {stopped ? <Play size={15} aria-hidden="true" /> : <Pause size={15} aria-hidden="true" />}
        </button>
      )}
    </>
  );
};
