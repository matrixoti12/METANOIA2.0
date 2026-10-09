import React from 'react';
import { MetanoiaRefinedHeroLogo } from './MetanoiaRefinedHeroLogo';
import { HeroCrystal3D } from './HeroCrystal3D';
import { Sparkles, Music, Zap } from 'lucide-react';

interface HeroSectionProps {
  userName?: string;
  onOpenPosterModal?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ userName }) => {
  return (
    <section id="inicio" className="relative pt-20 sm:pt-24 pb-16 px-4 sm:px-8 max-w-7xl mx-auto overflow-hidden">
      
      {/* ════════════════════════════════════════════════════════════════════
          1. LA PORTADA (LOGO REFINADO INTERACTIVO + TEMA "RELOAD")
          ════════════════════════════════════════════════════════════════════ */}
      <div className="min-h-[66vh] sm:min-h-[76vh] flex flex-col items-center justify-center text-center relative z-10 py-4 sm:py-6">
        
        {/* Lema y Palabra del Año: RELOAD */}
        <div className="hero-kicker mb-3 inline-flex items-center gap-2 px-4 py-1.5 rounded-full">
          <Zap className="w-3.5 h-3.5 text-[#f4b6ff]" />
          <span className="font-cyber text-xs tracking-[0.25em] text-[#e4c5ff] font-extrabold uppercase">
            METANOIA 2026 // RELOAD
          </span>
          {userName && (
            <>
              <span className="text-white/40">•</span>
              <span className="text-xs font-mono text-white/90">HOLA, {userName}</span>
            </>
          )}
        </div>

        {/* ── EL LOGO OFICIAL REFINADO COMO PORTADA ── */}
        <div className="w-full max-w-4xl mx-auto px-2">
          <MetanoiaRefinedHeroLogo />
        </div>

        {/* ── Subtítulo refinado sin fuentes robóticas ── */}
        <div className="text-center mt-4 sm:mt-6 select-none max-w-2xl mx-auto">
          <h1 className="sr-only">METANOIA 2026 · RELOAD · Pablo Rosales</h1>
          
          <p className="hero-headline font-display text-xl sm:text-2xl md:text-3xl text-white">
            Una noche de transformación
          </p>

          <p className="font-body text-xs sm:text-sm md:text-base tracking-[0.09em] text-[#d9c7ff] font-semibold mt-2">
            SÁBADO 28 NOVIEMBRE 2026 · 06:00 PM · GUAZAPA
          </p>

          <p className="text-purple-200/80 text-xs sm:text-sm font-body italic mt-2 max-w-lg mx-auto">
            «No os conforméis a este siglo, sino transformaos por medio de la renovación de vuestro entendimiento» — Romanos 12:2
          </p>
        </div>

        {/* Indicador suave que une la portada con el invitado y el icosaedro */}
        <div className="mt-8 flex flex-col items-center justify-center select-none opacity-80">
          <div className="w-5 h-7 rounded-full border-2 border-[#c3a7ff]/50 flex items-start justify-center p-1 shadow-[0_0_12px_rgba(195,167,255,0.3)]">
            <span className="w-1 h-2 rounded-full bg-[#c3a7ff] animate-bounce" />
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════════════════
          2. IMAGEN PURA DEL INVITADO (SIN RECUADROS RÍGIDOS) + ICOSAEDRO 3D
          ════════════════════════════════════════════════════════════════════ */}
      <div className="relative z-10 pt-4 pb-12 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Columna Izquierda (Cols 6): Imagen Pura de Pablo Rosales + Info Bíblica Luminous */}
          <div className="lg:col-span-6 flex flex-col items-center lg:items-start text-center lg:text-left">
            
            {/* Imagen pura del invitado (sin recuadros rígidos ni dobles marcos) */}
            <div className="relative w-full max-w-[380px] sm:max-w-[420px] mx-auto lg:mx-0 flex flex-col items-center">
              
              {/* Resplandor cósmico orgánico etéreo */}
              <div className="absolute -inset-6 bg-gradient-to-tr from-[#b01cc6]/40 via-[#c3a7ff]/30 to-[#4331ec]/40 rounded-full blur-[70px] pointer-events-none opacity-80 animate-pulse" />

              {/* Imagen pura con silueta orgánica y desvanecimiento suave */}
              <div className="guest-portrait relative w-full aspect-[4/4.2] overflow-hidden group">
                <img
                  src="/assets/metanoia-poster-pablo-rosales.jpg"
                  alt="Pablo Rosales • Ministro de la Música y la Palabra en Metanoia 2026 RELOAD"
                  className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                />
                
                {/* Desvanecimiento inferior orgánico para fundir con el fondo cósmico */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#170526] via-[#170526]/30 via-40% to-transparent pointer-events-none" />

                {/* Sello luminoso flotante orgánico */}
                <div className="guest-caption absolute bottom-4 left-4 right-4 flex items-center justify-between px-4 py-2.5 rounded-2xl bg-[#1e0735]/80 border border-[#c3a7ff]/35 backdrop-blur-xl">
                  <div className="flex items-center gap-2.5">
                    <Music className="w-4 h-4 text-[#f4b6ff] animate-pulse" />
                    <span className="font-cyber text-sm text-white font-extrabold tracking-wide uppercase">
                      PABLO ROSALES
                    </span>
                  </div>
                  <span className="info-tag text-[10px] font-cyber text-[#e4c5ff] font-bold uppercase tracking-wider bg-[#b01cc6]/30 px-2.5 py-0.5 rounded-full border border-[#c3a7ff]/30">
                    EN VIVO 2026
                  </span>
                </div>
              </div>

              {/* Ficha descriptiva pura y luminosa */}
              <div className="content-surface hero-details mt-6 w-full text-left">
                <div className="event-editorial-kicker flex items-center gap-2 text-[#e4c5ff]">
                  <Sparkles className="w-3.5 h-3.5 text-[#f4b6ff]" />
                  <span>Adoración y palabra para renovar tu vida</span>
                </div>

                <blockquote className="event-scripture mt-4 pl-4 sm:pl-5 font-body text-sm sm:text-base text-purple-100/90 leading-relaxed">
                  «No os conforméis a este siglo, sino transformaos por medio de la renovación de vuestro entendimiento, para que comprobéis cuál sea la buena voluntad de Dios, agradable y perfecta.»
                  <cite className="mt-3 block not-italic text-[11px] font-bold tracking-[0.16em] text-[#f4b6ff] uppercase">Romanos 12:2</cite>
                </blockquote>

                <dl className="event-facts mt-6 grid grid-cols-2 gap-x-5 text-left">
                  <div className="event-fact py-3.5">
                    <dt>Fecha</dt><dd>28 noviembre 2026</dd>
                  </div>
                  <div className="event-fact py-3.5">
                    <dt>Hora</dt><dd className="text-[#f4b6ff]">06:00 PM</dd>
                  </div>
                  <div className="event-fact py-3.5">
                    <dt>Ubicación</dt><dd>Iglepacben AD · Guazapa</dd>
                  </div>
                  <div className="event-fact py-3.5">
                    <dt>Acceso</dt><dd className="text-emerald-300">Entrada libre</dd>
                  </div>
                </dl>
              </div>

            </div>
          </div>

          {/* Columna Derecha (Cols 6): El Icosaedro 3D que entrega textos bíblicos */}
          <div className="lg:col-span-6 flex flex-col items-center justify-center">
            <div className="w-full max-w-[480px]">
              <HeroCrystal3D className="w-full" />
            </div>
          </div>

        </div>
      </div>

    </section>
  );
};
