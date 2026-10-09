import React, { useEffect, useRef, useState } from 'react';
import { Pause, Play } from 'lucide-react';

const isPortrait = () => typeof window !== 'undefined' && window.matchMedia('(orientation: portrait)').matches;
const prefersStill = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Original artwork stays fixed behind the entire page, with one video per orientation. */
export const CyberBackground: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [portrait, setPortrait] = useState(isPortrait);
  const [paused, setPaused] = useState(prefersStill);
  const [blocked, setBlocked] = useState(false);
  const [failed, setFailed] = useState(false);
  const asset = '/assets/backgrounds/metanoia-' + (portrait ? 'mobile' : 'desktop');

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
  }, [asset, paused]);

  const togglePlayback = () => {
    if (paused || blocked) {
      setPaused(false);
      setBlocked(false);
      // Keep this call in the click handler for browsers requiring a user gesture.
      videoRef.current?.play().catch(() => setBlocked(true));
    } else {
      setPaused(true);
      videoRef.current?.pause();
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
        <video
          ref={videoRef}
          className="ambient-video"
          src={asset + '.mp4'}
          poster={asset + '.jpg'}
          autoPlay={!paused}
          muted
          loop
          playsInline
          preload="auto"
          disablePictureInPicture
          disableRemotePlayback
          tabIndex={-1}
          onError={() => setFailed(true)}
          style={failed ? { display: 'none' } : undefined}
        />
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
