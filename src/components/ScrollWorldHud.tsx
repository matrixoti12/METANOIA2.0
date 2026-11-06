import React, { useState, useEffect, useRef } from 'react';
import {
  Compass,
  Sparkles,
  Gamepad2,
  Camera,
  BookOpen,
  HeartHandshake,
  Image as ImageIcon,
} from 'lucide-react';
import { playCyberClick, playCyberHover, playCyberTransition } from '../utils/audio';
import { getWorldProgress, WORLD_PROGRESS_EVENT, type WorldProgress } from '../utils/scrollWorld';

interface SectionBeat {
  id: string;
  number: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  accentColor: string;
}

const BEATS: SectionBeat[] = [
  { id: 'inicio', number: '01', label: 'INICIO', icon: Compass, accentColor: '#c084fc' },
  { id: 'proposito', number: '02', label: 'PROPÓSITO', icon: BookOpen, accentColor: '#00f0ff' },
  { id: 'oracion', number: '03', label: 'ORACIÓN', icon: HeartHandshake, accentColor: '#f4b6ff' },
  { id: 'minijuegos', number: '04', label: 'ARCADE', icon: Gamepad2, accentColor: '#f472b6' },
  { id: 'testimonios', number: '05', label: 'HISTORIAS', icon: Sparkles, accentColor: '#ffe600' },
  { id: 'photospot', number: '06', label: 'PHOTO BOOTH', icon: Camera, accentColor: '#00ff9d' },
];

interface ScrollWorldHudProps {
  onOpenPosterModal: () => void;
}

export const ScrollWorldHud: React.FC<ScrollWorldHudProps> = ({ onOpenPosterModal }) => {
  const [activeBeatIndex, setActiveBeatIndex] = useState(0);
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const apply = (frame: WorldProgress) => {
      if (progressRef.current) progressRef.current.style.transform = `scaleX(${frame.pageProgress})`;
      setActiveBeatIndex(Math.min(BEATS.length - 1, frame.chapterIndex));
    };
    const onFrame = (event: Event) => apply((event as CustomEvent<WorldProgress>).detail);
    window.addEventListener(WORLD_PROGRESS_EVENT, onFrame);
    apply(getWorldProgress());
    return () => window.removeEventListener(WORLD_PROGRESS_EVENT, onFrame);
  }, []);

  const handleFlyTo = (id: string) => {
    playCyberClick();
    playCyberTransition();
    const el = document.getElementById(id);
    if (el) {
      const yOffset = -70;
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
      const instant = matchMedia('(prefers-reduced-motion: reduce), (pointer: coarse), (max-width: 860px)').matches;
      window.scrollTo({ top: y, behavior: instant ? 'instant' : 'smooth' });
    }
  };

  const activeBeat = BEATS[activeBeatIndex] || BEATS[0];

  return (
    <>
      {/* Top Global Scroll Tracker Line (Scroll-World Scrub bar) */}
      <div className="fixed top-0 left-0 right-0 h-[3px] z-[60] bg-purple-950/40 pointer-events-none">
        <div
          ref={progressRef}
          className="h-full origin-left bg-gradient-to-r from-[#9333ea] via-[#00f0ff] to-[#f472b6] shadow-[0_0_12px_rgba(0,240,255,0.8)]"
          style={{ transform: 'scaleX(0)' }}
        />
      </div>

      {/* Floating Mobile-First HUD Bar (Docked at bottom safe area) */}
      <div
        className="fixed bottom-3 left-1/2 -translate-x-1/2 z-40 w-[94%] max-w-md"
        style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
      >
        <span className="route-chapter" style={{ color: activeBeat.accentColor }}>{activeBeat.number} / 06 · {activeBeat.label}</span>
        <nav aria-label="Recorrido Metanoia" className="route-dock rounded-2xl p-2 bg-[#170526]/95 backdrop-blur-2xl border border-[#c3a7ff]/30 shadow-[0_10px_35px_rgba(0,0,0,0.85),0_0_20px_rgba(176,28,198,0.3)] flex items-center justify-between gap-1.5">
          {/* Beat Indicator Badge */}
          <div className="route-counter flex items-center gap-1.5 pl-2 pr-2 py-1 rounded-xl bg-[#1e0735]/80 border border-[#c3a7ff]/30 flex-shrink-0">
            <img
              src="/assets/metanoia-emblem-square.png"
              alt="Metanoia Logo"
              className="w-4 h-4 object-contain filter drop-shadow-[0_0_6px_#c3a7ff]"
            />
            <span className="font-mono-cyber text-[10px] sm:text-xs font-bold text-white tracking-widest">
              {activeBeat.number}
            </span>
            <span className="text-white/40 text-[10px]">/</span>
            <span className="font-mono-cyber text-[10px] text-[#c3a7ff] font-bold">
              06
            </span>
          </div>

          {/* Quick Scene Jump Buttons (Thumb zone friendly) */}
          <div className="route-scenes flex items-center justify-center gap-1 flex-1 no-scrollbar py-0.5">
            {BEATS.map((beat, index) => {
              const isActive = activeBeatIndex === index;
              const Icon = beat.icon;

              return (
                <button
                  key={beat.id}
                  onClick={() => handleFlyTo(beat.id)}
                  onMouseEnter={() => playCyberHover('subtle')}
                  className={`relative p-2 rounded-xl transition-all touch-manipulation cursor-pointer min-w-[38px] min-h-[38px] flex items-center justify-center ${
                    isActive
                      ? 'bg-[#730bb3]/60 text-white border border-[#c3a7ff] shadow-[0_0_12px_rgba(195,167,255,0.6)] scale-105'
                      : 'text-purple-200/70 hover:text-white hover:bg-white/5 border border-transparent'
                  }`}
                  title={`Ir a ${beat.label}`}
                  aria-label={beat.label}
                  aria-current={isActive ? 'location' : undefined}
                >
                  <Icon className="w-4 h-4" />
                </button>
              );
            })}
          </div>

          {/* Quick Action: Open Official Poster Modal */}
          <button
            onClick={() => {
              playCyberClick();
              onOpenPosterModal();
            }}
            onMouseEnter={() => playCyberHover('crisp')}
            className="event-action flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-[#b01cc6] to-[#730bb3] hover:from-[#c3a7ff] hover:to-[#b01cc6] text-white font-cyber text-[10px] font-bold tracking-wider uppercase border border-[#c3a7ff]/50 shadow-[0_0_15px_rgba(176,28,198,0.4)] flex-shrink-0 cursor-pointer min-h-[38px] touch-manipulation active:scale-95"
            title="Ver afiche oficial del evento"
          >
            <ImageIcon className="w-3.5 h-3.5 text-[#f4b6ff]" />
            <span className="hidden xs:inline">AFICHE</span>
          </button>
        </nav>
      </div>
    </>
  );
};
