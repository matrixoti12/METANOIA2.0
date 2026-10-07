import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { playCyberClick, playNeonChime } from '../utils/audio';

/**
 * MetanoiaGsap3DTitle
 * Presentación insignia con el logotipo oficial oficial de Metanoia 2026.
 * Incorpora animaciones GSAP de levitación 3D, halo ambiental violeta/cian,
 * partículas flotantes y feedback háptico/acústico al interactuar.
 */
export const MetanoiaGsap3DTitle: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const logoWrapperRef = useRef<HTMLDivElement | null>(null);
  const logoImgRef = useRef<HTMLImageElement | null>(null);
  const taglineRef = useRef<HTMLDivElement | null>(null);
  const orb1Ref = useRef<HTMLDivElement | null>(null);
  const orb2Ref = useRef<HTMLDivElement | null>(null);
  const particlesRef = useRef<(HTMLDivElement | null)[]>([]);

  const handleLogoTap = () => {
    playCyberClick('confirm');
    playNeonChime();
    if (logoWrapperRef.current) {
      gsap.timeline()
        .to(logoWrapperRef.current, { scale: 1.08, duration: 0.15, ease: 'power2.out' })
        .to(logoWrapperRef.current, { scale: 1, duration: 0.65, ease: 'elastic.out(1.2, 0.4)' });
    }
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      // ── Intro: container fade & rise
      gsap.fromTo(
        containerRef.current,
        { opacity: 0, y: 25 },
        { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out' }
      );

      // ── Logo: scale entrance with elastic bounce
      gsap.fromTo(
        logoWrapperRef.current,
        { scale: 0.65, opacity: 0, rotationY: -15 },
        { scale: 1, opacity: 1, rotationY: 0, duration: 1.2, ease: 'elastic.out(1.0, 0.55)', delay: 0.2 }
      );

      // ── Tagline: fade up
      gsap.fromTo(
        taglineRef.current,
        { y: 15, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: 'power2.out', delay: 0.7 }
      );

      // ── Continuous: logo gentle levitation
      gsap.to(logoWrapperRef.current, {
        y: -7,
        duration: 3.4,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });

      // ── Orb ambient drift
      gsap.to(orb1Ref.current, {
        x: 18,
        y: -14,
        duration: 5.5,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });
      gsap.to(orb2Ref.current, {
        x: -15,
        y: 12,
        duration: 6.8,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: 1.0,
      });

      // ── Floating particles
      particlesRef.current.forEach((el, i) => {
        if (!el) return;
        gsap.to(el, {
          y: -22 - (i % 3) * 10,
          x: (i % 2 === 0 ? 1 : -1) * (10 + (i % 4) * 6),
          opacity: 0,
          duration: 2.6 + (i % 3) * 0.8,
          repeat: -1,
          delay: i * 0.35,
          ease: 'power1.out',
        });
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const particles = [
    { top: '15%', left: '8%', size: 4, color: '#C77DFF' },
    { top: '25%', left: '85%', size: 5, color: '#00f0ff' },
    { top: '70%', left: '12%', size: 3, color: '#ffffff' },
    { top: '75%', left: '92%', size: 4, color: '#ff007f' },
    { top: '45%', left: '48%', size: 3, color: '#B06AE8' },
    { top: '85%', left: '60%', size: 4, color: '#00f0ff' },
  ];

  return (
    <div
      ref={containerRef}
      className="relative w-full max-w-2xl py-2 my-1 select-none"
      style={{ opacity: 0 }}
    >
      {/* ── Ambient Orbs */}
      <div
        ref={orb1Ref}
        className="absolute -top-6 -left-6 w-48 h-48 rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(123,47,190,0.35) 0%, transparent 70%)',
          filter: 'blur(35px)',
        }}
      />
      <div
        ref={orb2Ref}
        className="absolute -bottom-6 -right-6 w-56 h-56 rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(0,240,255,0.22) 0%, transparent 70%)',
          filter: 'blur(45px)',
        }}
      />

      {/* ── Floating particles */}
      {particles.map((p, i) => (
        <div
          key={i}
          ref={(el) => {
            particlesRef.current[i] = el;
          }}
          className="absolute rounded-full pointer-events-none"
          style={{
            top: p.top,
            left: p.left,
            width: `${p.size}px`,
            height: `${p.size}px`,
            backgroundColor: p.color,
            boxShadow: `0 0 ${p.size * 3}px ${p.color}`,
            opacity: 0.75,
          }}
        />
      ))}

      {/* ══════════════════════════════════════════════
          MAIN COMPOSITION: Official Logo + Glowing Cyber Aura
          ══════════════════════════════════════════════ */}
      <div
        ref={logoWrapperRef}
        onClick={handleLogoTap}
        onTouchStart={handleLogoTap}
        className="relative z-10 flex flex-col items-start cursor-pointer group"
        title="METANOIA 2026 • Clic para interactuar"
      >
        <div className="relative inline-block">
          {/* Ambient intense glow backdrop matching the flyer's palette */}
          <div className="absolute -inset-3 sm:-inset-5 bg-gradient-to-r from-[#7b2cbf]/40 via-[#00f0ff]/25 to-[#c77dff]/45 rounded-3xl blur-2xl opacity-75 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500 pointer-events-none" />

          {/* High-Resolution Official Logo Asset */}
          <img
            ref={logoImgRef}
            src="/assets/metanoia-logo-official-hd.png"
            alt="METANOIA 2026 Logo Oficial"
            className="relative z-10 h-24 xs:h-28 sm:h-36 md:h-44 lg:h-48 w-auto object-contain filter drop-shadow-[0_0_20px_rgba(168,85,247,0.7)] drop-shadow-[0_0_40px_rgba(0,240,255,0.35)] transition-transform duration-300 group-hover:scale-[1.03]"
            onError={(e) => {
              const target = e.currentTarget as HTMLImageElement;
              if (!target.src.endsWith('/assets/metanoia-logo-official.png')) {
                target.src = '/assets/metanoia-logo-official.png';
              }
            }}
          />

          {/* Light Sweep Sheen Effect on hover */}
          <div className="absolute inset-0 z-20 pointer-events-none overflow-hidden rounded-2xl mix-blend-screen opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="w-[180%] h-full bg-gradient-to-r from-transparent via-white/40 to-transparent -skew-x-25 animate-laser-sheen" />
          </div>
        </div>
      </div>

      {/* ── Event Sub-Tagline Pill */}
      <div
        ref={taglineRef}
        className="flex items-center gap-2 mt-3 sm:mt-4 pl-0.5 select-none relative z-10"
        style={{ opacity: 0 }}
      >
        <div
          className="inline-flex items-center gap-2 px-3 sm:px-3.5 py-1.5 rounded-full border text-[10px] sm:text-xs font-bold tracking-widest uppercase transition-all duration-300 hover:border-[#00f0ff]/60"
          style={{
            background: 'rgba(20, 4, 46, 0.85)',
            borderColor: 'rgba(199,125,255,0.35)',
            color: '#C77DFF',
            boxShadow: '0 0 16px rgba(123,47,190,0.25)',
            backdropFilter: 'blur(8px)',
          }}
        >
          {/* Small emblem circle icon */}
          <img
            src="/assets/metanoia-emblem-square.png"
            alt="Emblema Metanoia"
            className="w-3.5 h-3.5 object-contain filter drop-shadow-[0_0_6px_#C77DFF]"
          />
          <span className="font-mono-cyber">NOCHE DE TRANSFORMACIÓN • 28 NOVIEMBRE 2026 • 06:00 PM</span>
        </div>
      </div>
    </div>
  );
};
