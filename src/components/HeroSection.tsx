import React from 'react';
import { HeroCrystal3D } from './HeroCrystal3D';
import { MetanoiaGsap3DTitle } from './MetanoiaGsap3DTitle';
import { Camera, Gamepad2, Sparkles, MapPin, ShieldCheck } from 'lucide-react';
import { playCyberClick, playCyberHover, playCyberTransition } from '../utils/audio';

interface HeroSectionProps {
  userName?: string;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ userName }) => {
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
      className="relative min-h-[95vh] pt-24 sm:pt-28 pb-14 sm:pb-20 px-4 sm:px-8 max-w-7xl mx-auto flex flex-col justify-between overflow-hidden"
    >
      {/* Vibrant Ambient Cyberpunk Neon Auroras */}
      <div className="absolute top-10 left-5 w-96 h-96 bg-[#ff007f]/20 rounded-full blur-[100px] pointer-events-none animate-pulse" style={{ animationDuration: '6s' }} />
      <div className="absolute top-36 right-5 w-[420px] h-[420px] bg-[#00f0ff]/20 rounded-full blur-[110px] pointer-events-none animate-pulse" style={{ animationDuration: '8s', animationDelay: '1s' }} />
      <div className="absolute -bottom-10 left-1/3 w-80 h-80 bg-[#ffe600]/12 rounded-full blur-[90px] pointer-events-none animate-pulse" style={{ animationDuration: '7s', animationDelay: '2s' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-[#7928ca]/15 rounded-full blur-[130px] pointer-events-none" />

      {/* Main Hero Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 items-center my-auto relative z-10">
        {/* Left Column: Big Typography & Dynamic Messaging */}
        <div className="lg:col-span-7 flex flex-col justify-center text-left">
          
          {/* Cybernetic HUD Eyebrow with personalized greeting */}
          <div className="flex items-center gap-2 sm:gap-2.5 mb-3 select-none flex-wrap">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-[#00f0ff] animate-ping" />
            <span className="font-mono-cyber text-[10px] sm:text-xs tracking-[0.25em] text-[#00f0ff] uppercase font-bold">
              [ PROTOCOLO // METANOIA 2.0 ]
            </span>
            <span className="text-white/30 font-mono text-xs">•</span>
            {userName ? (
              <span className="font-mono-cyber text-[10px] sm:text-xs tracking-[0.2em] text-[#ffe600] uppercase font-bold flex items-center gap-1.5 bg-[#ffe600]/10 px-2.5 py-0.5 rounded-full border border-[#ffe600]/30 animate-pulse">
                <Sparkles className="w-3 h-3 text-[#ffe600]" />
                BIENVENIDO, {userName}
              </span>
            ) : (
              <span className="font-mono-cyber text-[9px] sm:text-[11px] tracking-[0.2em] text-purple-300/90 uppercase">
                SYS.ONLINE • GUAZAPA
              </span>
            )}
          </div>

          {/* MASTERCLASS GSAP 3D ARCADE RETRO-CYBER TITLE */}
          <div className="mb-4">
            <MetanoiaGsap3DTitle />
          </div>

          {/* Slogan & Evangelistic Subtitle */}
          <p className="text-purple-200/90 font-body text-base sm:text-lg max-w-xl my-3 leading-relaxed">
            Una noche consagrada para quebrar esquemas, renovar tu mente y experimentar el poder transformador de Cristo.
            <span className="text-[#00f0ff] font-semibold block mt-1 font-mono text-xs sm:text-sm">
              «No os conforméis a este siglo... transformaos» — Romanos 12:2
            </span>
          </p>

          {/* Date & Core Pillars Block */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-7 pb-5 sm:pb-7 pt-1">
            {/* Left Block: 20 NOVIEMBRE */}
            <div
              className="flex flex-col select-none relative group cursor-default bg-white/5 border border-white/10 px-4 py-2.5 rounded-2xl backdrop-blur-md hover:border-[#ff007f]/60 transition-all"
              onMouseEnter={() => playCyberHover('subtle')}
            >
              <div className="flex items-center gap-3">
                <span className="font-cyber-heavy text-4xl sm:text-5xl text-white leading-none tracking-tight drop-shadow-[0_0_12px_rgba(255,255,255,0.4)]">
                  20
                </span>
                <div className="flex flex-col">
                  <span className="font-cyber text-xs sm:text-sm font-bold tracking-[0.2em] text-white uppercase">
                    NOVIEMBRE
                  </span>
                  <span className="font-cyber text-xs sm:text-sm font-bold tracking-[0.25em] text-[#ff007f] uppercase drop-shadow-[0_0_8px_rgba(255,0,127,0.7)]">
                    2026 • 6:00 PM
                  </span>
                </div>
              </div>
            </div>

            {/* Right Block: Three Pillars */}
            <div className="space-y-1.5 font-cyber text-xs sm:text-sm tracking-[0.16em] sm:tracking-[0.2em] font-bold text-purple-100 uppercase">
              <div className="hover:text-[#00f0ff] transition-colors cursor-default flex items-center gap-2" onMouseEnter={() => playCyberHover('subtle')}>
                <span className="w-1.5 h-1.5 rounded-full bg-[#00f0ff]" /> UN ENCUENTRO REAL.
              </div>
              <div className="hover:text-[#ffe600] transition-colors cursor-default flex items-center gap-2" onMouseEnter={() => playCyberHover('subtle')}>
                <span className="w-1.5 h-1.5 rounded-full bg-[#ffe600]" /> UNA DECISIÓN RADICAL.
              </div>
              <div className="hover:text-[#ff007f] transition-colors cursor-default flex items-center gap-2" onMouseEnter={() => playCyberHover('subtle')}>
                <span className="w-1.5 h-1.5 rounded-full bg-[#ff007f]" /> UNA MENTE RENOVADA.
              </div>
            </div>
          </div>

          {/* Action Pills & Fast Navigation */}
          <div className="space-y-3 pt-1">
            <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
              <button
                onClick={() => handleScrollTo('proposito')}
                onMouseEnter={() => playCyberHover('crisp')}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#ffe600]/20 to-[#ffe600]/10 hover:from-[#ffe600]/30 hover:to-[#ffe600]/20 active:scale-95 border border-[#ffe600]/60 text-[#ffe600] hover:text-white text-xs font-cyber tracking-widest uppercase shadow-[0_0_20px_rgba(255,230,0,0.3)] transition-all cursor-pointer touch-manipulation min-h-[44px]"
                id="hero-btn-proposito"
              >
                <Sparkles className="w-4 h-4 text-[#ffe600]" />
                <span>PROPÓSITO & PALABRA</span>
              </button>

              <button
                onClick={() => handleScrollTo('minijuegos')}
                onMouseEnter={() => playCyberHover('crisp')}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#ff007f]/20 to-[#ff007f]/10 hover:from-[#ff007f]/30 hover:to-[#ff007f]/20 active:scale-95 border border-[#ff007f]/60 text-[#ff007f] hover:text-white text-xs font-cyber tracking-widest uppercase shadow-[0_0_20px_rgba(255,0,127,0.3)] transition-all cursor-pointer touch-manipulation min-h-[44px]"
                id="hero-btn-minijuegos"
              >
                <Gamepad2 className="w-4 h-4 text-[#ff007f]" />
                <span>CYBER ARCADE (JUEGOS)</span>
              </button>

              <button
                onClick={() => handleScrollTo('photospot')}
                onMouseEnter={() => playCyberHover('crisp')}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#00f0ff]/20 to-[#00f0ff]/10 hover:from-[#00f0ff]/30 hover:to-[#00f0ff]/20 active:scale-95 border border-[#00f0ff]/60 text-[#00f0ff] hover:text-white text-xs font-cyber tracking-widest uppercase shadow-[0_0_20px_rgba(0,240,255,0.3)] transition-all cursor-pointer touch-manipulation min-h-[44px]"
                id="hero-btn-photospot"
              >
                <Camera className="w-4 h-4 text-[#00f0ff]" />
                <span>PHOTO BOOTH 2026</span>
              </button>
            </div>

            {/* Quick Badges */}
            <div className="flex flex-wrap items-center gap-3 text-[11px] font-mono-cyber text-purple-300/80 uppercase pt-1">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#ff007f]" /> Iglesia Pacto y Bendición, Guazapa
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 text-[#00ff9d]">
                <ShieldCheck className="w-3.5 h-3.5 text-[#00ff9d]" /> Entrada Totalmente Libre
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Floating 3D Crystal with Unified HUD Console */}
        <div className="lg:col-span-5 relative flex flex-col items-center justify-center mt-6 lg:mt-0">
          <HeroCrystal3D className="w-full max-w-[380px] sm:max-w-[440px] lg:max-w-[460px]" />
        </div>
      </div>

      {/* Bottom Center: Scroll Mouse Pill & Explore Label */}
      <div className="mt-8 flex flex-col items-center justify-center text-center select-none z-10">
        <button
          onClick={() => handleScrollTo('proposito')}
          onMouseEnter={() => playCyberHover('subtle')}
          className="group flex flex-col items-center gap-2 text-purple-300/80 hover:text-white transition-colors cursor-pointer focus:outline-none touch-manipulation min-h-[44px] justify-center"
          aria-label="Deslizar hacia propósito"
        >
          <div className="w-5 h-8 rounded-full border-2 border-purple-300/60 group-hover:border-[#00f0ff] flex items-start justify-center p-1 transition-colors group-hover:shadow-[0_0_15px_rgba(0,240,255,0.4)]">
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
