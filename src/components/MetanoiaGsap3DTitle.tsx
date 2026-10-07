import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { playCyberClick, playNeonChime } from '../utils/audio';

/**
 * MetanoiaGsap3DTitle
 * Diseño moderno inspirado en el logo oficial: cerebro en burbuja violeta + tipografía
 * orgánica/sans-serif. Paleta: violeta profundo → lavanda → blanco.
 * NO estilo arcade "Las Vegas". Animaciones GSAP elegantes en cada elemento clave.
 */
export const MetanoiaGsap3DTitle: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const badgeRef = useRef<HTMLDivElement | null>(null);
  const metaRef = useRef<HTMLSpanElement | null>(null);
  const noiaRef = useRef<HTMLSpanElement | null>(null);
  const yearRef = useRef<HTMLSpanElement | null>(null);
  const taglineRef = useRef<HTMLDivElement | null>(null);
  const orb1Ref = useRef<HTMLDivElement | null>(null);
  const orb2Ref = useRef<HTMLDivElement | null>(null);
  const particlesRef = useRef<(HTMLDivElement | null)[]>([]);

  const handleBadgeTap = () => {
    playCyberClick('confirm');
    playNeonChime();
    if (badgeRef.current) {
      gsap.timeline()
        .to(badgeRef.current, { scale: 1.12, duration: 0.15, ease: 'power2.out' })
        .to(badgeRef.current, { scale: 1, duration: 0.6, ease: 'elastic.out(1.2, 0.4)' });
    }
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      // ── Intro: orbs and container fade in
      gsap.fromTo(
        containerRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 1.0, ease: 'power3.out' }
      );

      // ── Badge: scale entrance with bounce
      gsap.fromTo(
        badgeRef.current,
        { scale: 0.4, opacity: 0, rotationY: -30 },
        { scale: 1, opacity: 1, rotationY: 0, duration: 1.1, ease: 'elastic.out(1.0, 0.55)', delay: 0.2 }
      );

      // ── "meta" word: slide from left
      gsap.fromTo(
        metaRef.current,
        { x: -40, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.85, ease: 'power3.out', delay: 0.45 }
      );

      // ── "noia" word: slide from right
      gsap.fromTo(
        noiaRef.current,
        { x: 40, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.85, ease: 'power3.out', delay: 0.6 }
      );

      // ── Year badge: pop in
      gsap.fromTo(
        yearRef.current,
        { scale: 0.5, opacity: 0, y: 10 },
        { scale: 1, opacity: 1, y: 0, duration: 0.7, ease: 'back.out(2)', delay: 0.8 }
      );

      // ── Tagline: fade up
      gsap.fromTo(
        taglineRef.current,
        { y: 12, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.9, ease: 'power2.out', delay: 1.0 }
      );

      // ── Continuous: badge gentle levitation
      gsap.to(badgeRef.current, {
        y: -6,
        duration: 3.2,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });

      // ── Continuous: "meta" shimmer
      gsap.to(metaRef.current, {
        y: -3,
        duration: 2.8,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: 0.3,
      });

      // ── Continuous: "noia" shimmer counter-phase
      gsap.to(noiaRef.current, {
        y: -3,
        duration: 2.8,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: 0.7,
      });

      // ── Orb ambient rotation
      gsap.to(orb1Ref.current, {
        x: 15,
        y: -12,
        duration: 5,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });
      gsap.to(orb2Ref.current, {
        x: -12,
        y: 10,
        duration: 6.5,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: 1.2,
      });

      // ── Floating particles
      particlesRef.current.forEach((el, i) => {
        if (!el) return;
        gsap.to(el, {
          y: -18 - (i % 3) * 8,
          x: (i % 2 === 0 ? 1 : -1) * (8 + (i % 4) * 5),
          opacity: 0,
          duration: 2.5 + (i % 3) * 0.8,
          repeat: -1,
          delay: i * 0.4,
          ease: 'power1.out',
        });
      });

      // ── Year pulse glow
      gsap.to(yearRef.current, {
        textShadow: '0 0 22px #C77DFF, 0 0 40px #7B2FBE',
        duration: 2.0,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: 1.2,
      });

    }, containerRef);

    // ── Parallax mouse tilt on desktop
    const handleMouseMove = (e: MouseEvent) => {
      const el = containerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      gsap.to(el, {
        rotationY: x * 10,
        rotationX: -y * 7,
        transformPerspective: 1200,
        ease: 'power2.out',
        duration: 0.6,
      });
    };
    const handleMouseLeave = () => {
      gsap.to(containerRef.current, {
        rotationY: 0,
        rotationX: 0,
        ease: 'power3.out',
        duration: 1.2,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    containerRef.current?.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      ctx.revert();
      window.removeEventListener('mousemove', handleMouseMove);
      containerRef.current?.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  // Floating particle positions
  const PARTICLES = [
    { x: '15%', y: '30%', size: 3, color: '#C77DFF' },
    { x: '75%', y: '20%', size: 2, color: '#B06AE8' },
    { x: '55%', y: '75%', size: 3.5, color: '#7B2FBE' },
    { x: '88%', y: '60%', size: 2.5, color: '#C77DFF' },
    { x: '10%', y: '65%', size: 2, color: '#B06AE8' },
    { x: '40%', y: '15%', size: 4, color: '#ffffff' },
    { x: '92%', y: '35%', size: 2, color: '#C77DFF' },
  ];

  return (
    <div
      ref={containerRef}
      className="relative select-none my-1 cursor-default w-full"
      style={{ transformStyle: 'preserve-3d', opacity: 0 }}
    >
      {/* ── Ambient orbs */}
      <div
        ref={orb1Ref}
        className="absolute -top-8 -left-8 w-40 h-40 rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(123,47,190,0.35) 0%, transparent 70%)',
          filter: 'blur(20px)',
        }}
      />
      <div
        ref={orb2Ref}
        className="absolute -bottom-8 -right-4 w-36 h-36 rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(176,106,232,0.25) 0%, transparent 70%)',
          filter: 'blur(18px)',
        }}
      />

      {/* ── Floating particles */}
      {PARTICLES.map((p, i) => (
        <div
          key={i}
          ref={(el) => { particlesRef.current[i] = el; }}
          className="absolute rounded-full pointer-events-none"
          style={{
            left: p.x,
            top: p.y,
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            boxShadow: `0 0 ${p.size * 3}px ${p.color}`,
            opacity: 0.7,
          }}
        />
      ))}

      {/* ══════════════════════════════════════════════
          MAIN COMPOSITION: Badge + Typography
          ══════════════════════════════════════════════ */}
      <div className="relative z-10 flex items-center justify-center gap-4 sm:gap-5">

        {/* ── Brain Badge (circular, logo-inspired) */}
        <div
          ref={badgeRef}
          onClick={handleBadgeTap}
          onTouchStart={handleBadgeTap}
          className="relative flex-shrink-0 cursor-pointer"
          style={{ opacity: 0 }}
          title="METANOIA 2026"
        >
          {/* Badge background circle with gradient */}
          <div
            className="relative w-16 h-16 xs:w-18 xs:h-18 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center"
            style={{
              background: 'linear-gradient(145deg, #8B35D6 0%, #7B2FBE 45%, #5a1a9e 100%)',
              boxShadow: '0 0 28px rgba(123,47,190,0.6), 0 0 60px rgba(176,106,232,0.25), inset 0 1px 3px rgba(255,255,255,0.3)',
              border: '2px solid rgba(199,125,255,0.5)',
            }}
          >
            {/* Brain SVG icon */}
            <svg
              viewBox="0 0 64 64"
              className="w-8 h-8 xs:w-9 xs:h-9 sm:w-11 sm:h-11 md:w-13 md:h-13"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Left hemisphere */}
              <path
                d="M32 10C24 10 17 15 15 22C12 22 9 25 9 29C9 32.5 11 35.5 14 37C13.5 38 13 39.5 13 41C13 46.5 17.5 51 23 51C24.5 51 25.8 50.7 27 50.2L32 52V10Z"
                fill="rgba(255,255,255,0.9)"
              />
              {/* Right hemisphere */}
              <path
                d="M32 10C40 10 47 15 49 22C52 22 55 25 55 29C55 32.5 53 35.5 50 37C50.5 38 51 39.5 51 41C51 46.5 46.5 51 41 51C39.5 51 38.2 50.7 37 50.2L32 52V10Z"
                fill="rgba(255,255,255,0.9)"
              />
              {/* Center divide */}
              <line x1="32" y1="10" x2="32" y2="52" stroke="rgba(176,106,232,0.6)" strokeWidth="1.5" />
              {/* Neural details left */}
              <path d="M22 20 Q18 26 20 32" stroke="rgba(123,47,190,0.5)" strokeWidth="1.5" fill="none" strokeLinecap="round" />
              <path d="M19 32 Q16 36 18 42" stroke="rgba(123,47,190,0.5)" strokeWidth="1.5" fill="none" strokeLinecap="round" />
              <path d="M26 16 Q22 22 24 28" stroke="rgba(123,47,190,0.4)" strokeWidth="1" fill="none" strokeLinecap="round" />
              {/* Neural details right */}
              <path d="M42 20 Q46 26 44 32" stroke="rgba(123,47,190,0.5)" strokeWidth="1.5" fill="none" strokeLinecap="round" />
              <path d="M45 32 Q48 36 46 42" stroke="rgba(123,47,190,0.5)" strokeWidth="1.5" fill="none" strokeLinecap="round" />
              <path d="M38 16 Q42 22 40 28" stroke="rgba(123,47,190,0.4)" strokeWidth="1" fill="none" strokeLinecap="round" />
              {/* Horizontal folds */}
              <path d="M22 29 Q27 27 32 29 Q37 31 42 29" stroke="rgba(123,47,190,0.4)" strokeWidth="1" fill="none" strokeLinecap="round" />
              <path d="M20 38 Q26 35 32 38 Q38 41 44 38" stroke="rgba(123,47,190,0.4)" strokeWidth="1" fill="none" strokeLinecap="round" />
              {/* Pin hook at bottom */}
              <path d="M29 51 L32 57 L35 51" fill="rgba(255,255,255,0.85)" />
            </svg>
          </div>

          {/* Pulse ring */}
          <div
            className="absolute inset-0 rounded-full animate-ping"
            style={{
              border: '2px solid rgba(199,125,255,0.4)',
              animationDuration: '3s',
            }}
          />
        </div>

        {/* ── Title typography block */}
        <div className="flex flex-col items-start gap-0.5 relative">

          {/* "meta" */}
          <div className="flex items-baseline gap-1.5 sm:gap-2">
            <span
              ref={metaRef}
              className="font-display leading-none tracking-tight select-none"
              style={{
                fontSize: 'clamp(2.4rem, 9vw, 5.5rem)',
                fontWeight: 800,
                color: '#ffffff',
                letterSpacing: '-0.01em',
                textShadow: '0 0 30px rgba(199,125,255,0.5), 0 2px 20px rgba(0,0,0,0.8)',
                opacity: 0,
              }}
            >
              meta
            </span>
            {/* Year badge — vertically beside "meta" */}
            <span
              ref={yearRef}
              className="self-end mb-1 px-1.5 py-0.5 rounded-md text-[10px] xs:text-xs sm:text-sm font-black tracking-widest uppercase"
              style={{
                background: 'linear-gradient(135deg, #7B2FBE, #C77DFF)',
                color: '#ffffff',
                textShadow: '0 0 10px #C77DFF',
                boxShadow: '0 0 16px rgba(123,47,190,0.5)',
                letterSpacing: '0.12em',
                opacity: 0,
              }}
            >
              2026
            </span>
          </div>

          {/* "noia" */}
          <span
            ref={noiaRef}
            className="font-display leading-none tracking-tight select-none"
            style={{
              fontSize: 'clamp(2.4rem, 9vw, 5.5rem)',
              fontWeight: 800,
              letterSpacing: '-0.01em',
              background: 'linear-gradient(135deg, #C77DFF 0%, #B06AE8 40%, #7B2FBE 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              textShadow: 'none',
              filter: 'drop-shadow(0 0 20px rgba(176,106,232,0.5))',
              opacity: 0,
            }}
          >
            noia
          </span>

          {/* Thin accent line */}
          <div
            className="w-full h-[2px] rounded-full mt-0.5"
            style={{
              background: 'linear-gradient(90deg, #7B2FBE, #C77DFF, transparent)',
              boxShadow: '0 0 8px rgba(199,125,255,0.6)',
            }}
          />
        </div>
      </div>

      {/* ── Event sub-tagline */}
      <div
        ref={taglineRef}
        className="flex items-center gap-2 mt-3 sm:mt-4 pl-0.5 select-none relative z-10"
        style={{ opacity: 0 }}
      >
        <div
          className="flex items-center gap-2 px-3 py-1.5 rounded-full border text-[10px] sm:text-xs font-bold tracking-widest uppercase"
          style={{
            background: 'rgba(123,47,190,0.15)',
            borderColor: 'rgba(199,125,255,0.35)',
            color: '#C77DFF',
            boxShadow: '0 0 16px rgba(123,47,190,0.2)',
            backdropFilter: 'blur(8px)',
          }}
        >
          {/* Small brain icon */}
          <svg width="12" height="12" viewBox="0 0 20 20" fill="none">
            <circle cx="10" cy="10" r="9" fill="rgba(123,47,190,0.5)" />
            <path d="M10 4C7 4 5 6 5 8.5C4 8.5 3 9.5 3 11C3 12.5 4 13.5 5.5 13.5C5.5 15 6.5 16 8 16L10 15V4Z" fill="white" opacity="0.9"/>
            <path d="M10 4C13 4 15 6 15 8.5C16 8.5 17 9.5 17 11C17 12.5 16 13.5 14.5 13.5C14.5 15 13.5 16 12 16L10 15V4Z" fill="white" opacity="0.9"/>
          </svg>
          <span>NOCHE DE TRANSFORMACIÓN • 28 NOVIEMBRE 2026 • 06:00 PM</span>
        </div>
      </div>
    </div>
  );
};
