import React, { useState, useEffect } from 'react';
import {
  Compass,
  Sparkles,
  Gamepad2,
  Camera,
  BookOpen,
  Image as ImageIcon,
  ChevronUp,
} from 'lucide-react';
import { playCyberClick, playCyberHover, playCyberTransition } from '../utils/audio';

interface SectionBeat {
  id: string;
  number: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  accentColor: string;
}

const BEATS: SectionBeat[] = [
  { id: 'inicio', number: '01', label: 'INICIO', icon: Compass, accentColor: '#c084fc' },
  { id: 'proposito', number: '02', label: 'PALABRA', icon: BookOpen, accentColor: '#00f0ff' },
  { id: 'minijuegos', number: '03', label: 'ARCADE', icon: Gamepad2, accentColor: '#f472b6' },
  { id: 'historias', number: '04', label: 'HISTORIAS', icon: Sparkles, accentColor: '#ffe600' },
  { id: 'photospot', number: '05', label: 'PHOTO BOOTH', icon: Camera, accentColor: '#00ff9d' },
];

interface ScrollWorldHudProps {
  onOpenPosterModal: () => void;
}

export const ScrollWorldHud: React.FC<ScrollWorldHudProps> = ({ onOpenPosterModal }) => {
  const [activeBeatIndex, setActiveBeatIndex] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? Math.min(100, Math.max(0, (scrollY / docHeight) * 100)) : 0;
      setScrollProgress(progress);

      // Determine active section beat
      const viewportMid = scrollY + window.innerHeight * 0.35;
      let matchedIndex = 0;

      BEATS.forEach((beat, index) => {
        const el = document.getElementById(beat.id);
        if (el) {
          const top = el.offsetTop;
          if (viewportMid >= top) {
            matchedIndex = index;
          }
        }
      });

      setActiveBeatIndex(matchedIndex);
      setLastScrollY(scrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const handleFlyTo = (id: string) => {
    playCyberClick();
    playCyberTransition();
    const el = document.getElementById(id);
    if (el) {
      const yOffset = -70;
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  const activeBeat = BEATS[activeBeatIndex] || BEATS[0];

  return (
    <>
      {/* Top Global Scroll Tracker Line (Scroll-World Scrub bar) */}
      <div className="fixed top-0 left-0 right-0 h-[3px] z-[60] bg-purple-950/40 pointer-events-none">
        <div
          className="h-full bg-gradient-to-r from-[#9333ea] via-[#00f0ff] to-[#f472b6] transition-all duration-150 ease-out shadow-[0_0_12px_rgba(0,240,255,0.8)]"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Floating Mobile-First HUD Bar (Docked at bottom safe area) */}
      <div
        className={`fixed bottom-3 left-1/2 -translate-x-1/2 z-40 w-[94%] max-w-md transition-all duration-300 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'
        }`}
        style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
      >
        <div className="rounded-2xl p-2 bg-[#170526]/95 backdrop-blur-2xl border border-[#c3a7ff]/30 shadow-[0_10px_35px_rgba(0,0,0,0.85),0_0_20px_rgba(176,28,198,0.3)] flex items-center justify-between gap-1.5">
          {/* Beat Indicator Badge */}
          <div className="flex items-center gap-1.5 pl-2 pr-2 py-1 rounded-xl bg-[#1e0735]/80 border border-[#c3a7ff]/30 flex-shrink-0">
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
              05
            </span>
          </div>

          {/* Quick Scene Jump Buttons (Thumb zone friendly) */}
          <div className="flex items-center justify-center gap-1 flex-1 overflow-x-auto no-scrollbar py-0.5">
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
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-[#b01cc6] to-[#730bb3] hover:from-[#c3a7ff] hover:to-[#b01cc6] text-white font-cyber text-[10px] font-bold tracking-wider uppercase border border-[#c3a7ff]/50 shadow-[0_0_15px_rgba(176,28,198,0.4)] flex-shrink-0 cursor-pointer min-h-[38px] touch-manipulation active:scale-95"
            title="Ver afiche oficial del evento"
          >
            <ImageIcon className="w-3.5 h-3.5 text-[#f4b6ff]" />
            <span className="hidden xs:inline">AFICHE</span>
          </button>
        </div>
      </div>
    </>
  );
};
