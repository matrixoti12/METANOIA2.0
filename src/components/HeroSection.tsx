import React from 'react';
import { HeroCrystal3D } from './HeroCrystal3D';
import { MetanoiaGsap3DTitle } from './MetanoiaGsap3DTitle';
import { Camera, Gamepad2, Sparkles, MapPin, ShieldCheck, Music, Image as ImageIcon } from 'lucide-react';
import { playCyberClick, playCyberHover, playCyberTransition } from '../utils/audio';

interface HeroSectionProps {
  userName?: string;
  onOpenPosterModal?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ userName, onOpenPosterModal }) => {
  const handleScrollTo = (id: string) => {
    playCyberClick();
    playCyberTransition();
    const el = document.getElementById(id);
    if (el) {
      const yOffset = -70;
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <section
      id="inicio"
      className="relative min-h-[95vh] pt-20 sm:pt-28 pb-14 sm:pb-20 px-3.5 sm:px-8 max-w-7xl mx-auto flex flex-col justify-between overflow-hidden"
    >
      {/* Vibrant Ambient Cyberpunk Neon Auroras matching the official poster palette */}
      <div className="absolute top-10 left-5 w-96 h-96 bg-[#7b2cbf]/25 rounded-full blur-[100px] pointer-events-none animate-pulse" style={{ animationDuration: '6s' }} />
      <div className="absolute top-36 right-5 w-[420px] h-[420px] bg-[#00f0ff]/18 rounded-full blur-[110px] pointer-events-none animate-pulse" style={{ animationDuration: '8s', animationDelay: '1s' }} />
      <div className="absolute -bottom-10 left-1/3 w-80 h-80 bg-[#c084fc]/15 rounded-full blur-[90px] pointer-events-none animate-pulse" style={{ animationDuration: '7s', animationDelay: '2s' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-[#4a044e]/20 rounded-full blur-[130px] pointer-events-none" />

      {/* Floating 3D Polyhedron from official poster (Subtle 3D diorama background) */}
      <div className="hidden lg:block absolute top-20 right-10 w-28 h-28 pointer-events-none opacity-40 animate-float" style={{ animationDuration: '7s' }}>
        <img
          src="/assets/crystal-polyhedron.png"
          alt="3D Crystal"
          className="w-full h-full object-contain filter drop-shadow-[0_0_20px_rgba(168,85,247,0.6)]"
        />
      </div>

      <div className="hidden md:block absolute bottom-24 left-8 w-20 h-20 pointer-events-none opacity-30 animate-float" style={{ animationDuration: '9s', animationDelay: '2s' }}>
        <img
          src="/assets/crystal-polyhedron.png"
          alt="3D Crystal"
          className="w-full h-full object-contain filter drop-shadow-[0_0_15px_rgba(0,240,255,0.5)] rotate-45"
        />
      </div>

      {/* Main Hero Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 items-center my-auto relative z-10">
        {/* Left Column: Big Typography & Dynamic Messaging */}
        <div className="lg:col-span-7 flex flex-col justify-center text-left">
          
          {/* Cybernetic HUD Eyebrow with personalized greeting */}
          <div className="flex items-center gap-2 sm:gap-2.5 mb-2.5 select-none flex-wrap">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-[#00f0ff] animate-ping" />
            <span className="font-mono-cyber text-[10px] sm:text-xs tracking-[0.25em] text-[#00f0ff] uppercase font-bold">
              [ PROTOCOLO // METANOIA 2026 ]
            </span>
            <span className="text-white/30 font-mono text-xs">•</span>
            {userName ? (
              <span className="font-mono-cyber text-[10px] sm:text-xs tracking-[0.2em] text-[#c084fc] uppercase font-bold flex items-center gap-1.5 bg-purple-950/60 px-2.5 py-0.5 rounded-full border border-purple-500/40 animate-pulse">
                <Sparkles className="w-3 h-3 text-[#c084fc]" />
                BIENVENIDO, {userName}
              </span>
            ) : (
              <span className="font-mono-cyber text-[9px] sm:text-[11px] tracking-[0.2em] text-purple-300/90 uppercase">
                GUAZAPA • EN VIVO
              </span>
            )}
          </div>

          {/* MASTERCLASS GSAP 3D ARCADE RETRO-CYBER TITLE */}
          <div className="mb-3">
            <MetanoiaGsap3DTitle />
          </div>

          {/* Guest Artist & Speaker Highlight (Pablo Rosales) */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#160736]/90 border border-purple-500/40 backdrop-blur-md mb-3 max-w-fit shadow-[0_0_15px_rgba(168,85,247,0.25)]">
            <Music className="w-4 h-4 text-[#f472b6] animate-pulse" />
            <span className="font-mono-cyber text-[10px] sm:text-xs text-[#c084fc] font-bold uppercase tracking-wider">
              EN LA MÚSICA Y PALABRA:
            </span>
            <span className="font-cyber text-xs sm:text-sm text-white font-extrabold tracking-wide drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]">
              PABLO ROSALES
            </span>
          </div>

          {/* Slogan & Evangelistic Subtitle */}
          <p className="text-purple-200/90 font-body text-sm sm:text-base max-w-xl my-2 leading-relaxed">
            Una noche consagrada para quebrar esquemas, renovar tu mente y experimentar el poder transformador de Cristo.
            <span className="text-[#00f0ff] font-semibold block mt-1 font-mono text-xs sm:text-sm">
              «No os conforméis a este siglo... transformaos» — Romanos 12:2
            </span>
          </p>

          {/* Date & Core Pillars Block (OFFICIAL 28 NOVIEMBRE) */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3.5 sm:gap-6 pb-4 sm:pb-6 pt-1">
            {/* Left Block: 28 NOVIEMBRE 2026 */}
            <div
              className="flex flex-col select-none relative group cursor-default bg-[#10052c]/90 border border-purple-500/45 px-4 py-2.5 rounded-2xl backdrop-blur-md hover:border-[#c084fc] transition-all shadow-[0_0_20px_rgba(168,85,247,0.3)]"
              onMouseEnter={() => playCyberHover('subtle')}
            >
              <div className="flex items-center gap-3">
                <span className="font-cyber-heavy text-4xl sm:text-5xl text-[#00f0ff] leading-none tracking-tight drop-shadow-[0_0_15px_rgba(0,240,255,0.7)]">
                  28
                </span>
                <div className="flex flex-col">
                  <span className="font-cyber text-xs sm:text-sm font-bold tracking-[0.2em] text-white uppercase">
                    NOVIEMBRE
                  </span>
                  <span className="font-cyber text-xs sm:text-sm font-bold tracking-[0.25em] text-[#c084fc] uppercase drop-shadow-[0_0_8px_rgba(192,132,252,0.8)]">
                    2026 • 06:00 PM
                  </span>
                </div>
              </div>
            </div>

            {/* Right Block: Three Pillars */}
            <div className="space-y-1 font-cyber text-xs sm:text-sm tracking-[0.16em] sm:tracking-[0.2em] font-bold text-purple-100 uppercase">
              <div className="hover:text-[#00f0ff] transition-colors cursor-default flex items-center gap-2" onMouseEnter={() => playCyberHover('subtle')}>
                <span className="w-1.5 h-1.5 rounded-full bg-[#00f0ff]" /> UN ENCUENTRO REAL.
              </div>
              <div className="hover:text-[#c084fc] transition-colors cursor-default flex items-center gap-2" onMouseEnter={() => playCyberHover('subtle')}>
                <span className="w-1.5 h-1.5 rounded-full bg-[#c084fc]" /> UNA DECISIÓN RADICAL.
              </div>
              <div className="hover:text-[#f472b6] transition-colors cursor-default flex items-center gap-2" onMouseEnter={() => playCyberHover('subtle')}>
                <span className="w-1.5 h-1.5 rounded-full bg-[#f472b6]" /> UNA MENTE RENOVADA.
              </div>
            </div>
          </div>

          {/* Action Pills & Fast Navigation (Touch friendly for mobile) */}
          <div className="space-y-3 pt-1">
            <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
              {onOpenPosterModal && (
                <button
                  onClick={onOpenPosterModal}
                  onMouseEnter={() => playCyberHover('crisp')}
                  className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-[#9333ea] to-[#7b2cbf] hover:from-[#a855f7] hover:to-[#9333ea] active:scale-95 border border-purple-400 text-white text-xs font-cyber tracking-widest uppercase shadow-[0_0_20px_rgba(168,85,247,0.4)] transition-all cursor-pointer touch-manipulation min-h-[44px]"
                  id="hero-btn-poster"
                >
                  <ImageIcon className="w-4 h-4 text-[#00f0ff]" />
                  <span>AFICHE OFICIAL (PABLO ROSALES)</span>
                </button>
              )}

              <button
                onClick={() => handleScrollTo('proposito')}
                onMouseEnter={() => playCyberHover('crisp')}
                className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 active:scale-95 border border-purple-500/40 text-purple-200 hover:text-white text-xs font-cyber tracking-widest uppercase transition-all cursor-pointer touch-manipulation min-h-[44px]"
                id="hero-btn-proposito"
              >
                <Sparkles className="w-4 h-4 text-[#00f0ff]" />
                <span>PROPÓSITO & PALABRA</span>
              </button>

              <button
                onClick={() => handleScrollTo('minijuegos')}
                onMouseEnter={() => playCyberHover('crisp')}
                className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 active:scale-95 border border-purple-500/40 text-purple-200 hover:text-white text-xs font-cyber tracking-widest uppercase transition-all cursor-pointer touch-manipulation min-h-[44px]"
                id="hero-btn-minijuegos"
              >
                <Gamepad2 className="w-4 h-4 text-[#f472b6]" />
                <span>CYBER ARCADE (JUEGOS)</span>
              </button>

              <button
                onClick={() => handleScrollTo('photospot')}
                onMouseEnter={() => playCyberHover('crisp')}
                className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 active:scale-95 border border-purple-500/40 text-purple-200 hover:text-white text-xs font-cyber tracking-widest uppercase transition-all cursor-pointer touch-manipulation min-h-[44px]"
                id="hero-btn-photospot"
              >
                <Camera className="w-4 h-4 text-[#c084fc]" />
                <span>PHOTO BOOTH 2026</span>
              </button>
            </div>

            {/* Quick Badges */}
            <div className="flex flex-wrap items-center gap-3 text-[11px] font-mono-cyber text-purple-300/80 uppercase pt-1">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#00f0ff]" /> IGLEPACBEN AD Guazapa
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 text-[#00ff9d]">
                <ShieldCheck className="w-3.5 h-3.5 text-[#00ff9d]" /> Entrada Totalmente Libre
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Floating 3D Crystal & Scripture Word Console */}
        <div className="lg:col-span-5 relative flex flex-col items-center justify-center mt-6 lg:mt-0">
          <HeroCrystal3D className="w-full max-w-[380px] sm:max-w-[440px] lg:max-w-[460px]" />
        </div>
      </div>

      {/* Bottom Center: Scroll Mouse Pill & Explore Label */}
      <div className="mt-6 sm:mt-8 flex flex-col items-center justify-center text-center select-none z-10">
        <button
          onClick={() => handleScrollTo('proposito')}
          onMouseEnter={() => playCyberHover('subtle')}
          className="group flex flex-col items-center gap-2 text-purple-300/80 hover:text-white transition-colors cursor-pointer focus:outline-none touch-manipulation min-h-[44px] justify-center"
          aria-label="Deslizar hacia propósito"
        >
          <div className="w-5 h-8 rounded-full border-2 border-purple-400/60 group-hover:border-[#00f0ff] flex items-start justify-center p-1 transition-colors group-hover:shadow-[0_0_15px_rgba(0,240,255,0.4)]">
            <span className="w-1 h-2 rounded-full bg-[#00f0ff] animate-bounce shadow-[0_0_8px_#00f0ff]" />
          </div>
          <span className="text-[10px] sm:text-xs font-cyber tracking-[0.25em] text-purple-300/70 group-hover:text-white uppercase transition-colors">
            DESLIZA PARA CONOCER EL MENSAJE
          </span>
        </button>
      </div>
    </section>
  );
};
