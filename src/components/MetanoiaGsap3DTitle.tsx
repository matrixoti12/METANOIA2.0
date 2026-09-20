import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { Sparkles, Zap } from 'lucide-react';
import { playCyberClick, playCyberHover, playNeonChime } from '../utils/audio';

interface LetterCard {
  char: string;
  glowColor: string;
  accentColor: string;
  sub: string;
}

const LETTERS: LetterCard[] = [
  { char: 'M', glowColor: '#ffe600', accentColor: '#00f0ff', sub: '01' },
  { char: 'E', glowColor: '#00f0ff', accentColor: '#ff007f', sub: '02' },
  { char: 'T', glowColor: '#ff007f', accentColor: '#ffe600', sub: '03' },
  { char: 'A', glowColor: '#00ff9d', accentColor: '#00f0ff', sub: '04' },
  { char: 'N', glowColor: '#ffe600', accentColor: '#ff007f', sub: '05' },
  { char: 'O', glowColor: '#00f0ff', accentColor: '#00ff9d', sub: '06' },
  { char: 'I', glowColor: '#ff007f', accentColor: '#ffe600', sub: '07' },
  { char: 'A', glowColor: '#ffe600', accentColor: '#00f0ff', sub: '08' },
];

export const MetanoiaGsap3DTitle: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const card20Ref = useRef<HTMLDivElement | null>(null);
  const sparkRef = useRef<HTMLDivElement | null>(null);
  const [activeCardIndex, setActiveCardIndex] = useState<number | null>(null);
  const [poppedCardIndex, setPoppedCardIndex] = useState<number | null>(null);
  const [is20Popped, setIs20Popped] = useState(false);

  // Handle interactive touch / tap on any letter card
  const handleCardInteract = (index: number) => {
    playCyberClick('confirm');
    playNeonChime();
    setPoppedCardIndex(index);

    const card = cardRefs.current[index];
    if (card) {
      gsap.timeline()
        .to(card, {
          scale: 1.15,
          y: -10,
          rotationZ: (index % 2 === 0 ? 1 : -1) * 6,
          duration: 0.15,
          ease: 'power2.out',
        })
        .to(card, {
          scale: 1,
          y: 0,
          rotationZ: 0,
          duration: 0.45,
          ease: 'elastic.out(1.2, 0.4)',
        });
    }

    setTimeout(() => {
      setPoppedCardIndex(null);
    }, 500);
  };

  const handle20Interact = () => {
    playCyberClick('confirm');
    playNeonChime();
    setIs20Popped(true);

    if (card20Ref.current) {
      gsap.timeline()
        .to(card20Ref.current, {
          scale: 1.15,
          y: -10,
          duration: 0.15,
          ease: 'power2.out',
        })
        .to(card20Ref.current, {
          scale: 1,
          y: 0,
          duration: 0.45,
          ease: 'elastic.out(1.2, 0.4)',
        });
    }

    setTimeout(() => {
      setIs20Popped(false);
    }, 500);
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const allCards = [...cardRefs.current.filter(Boolean), card20Ref.current].filter(Boolean) as HTMLDivElement[];

    const ctx = gsap.context(() => {
      // 1. Initial GSAP Intro: 3D Isometric Drop with Elastic Bounce
      if (allCards.length > 0) {
        gsap.fromTo(
          allCards,
          {
            y: -40,
            opacity: 0,
            rotationX: 35,
            scale: 0.85,
          },
          {
            y: 0,
            opacity: 1,
            rotationX: 0,
            scale: 1,
            duration: 1.1,
            stagger: 0.04,
            ease: 'elastic.out(1.1, 0.55)',
          }
        );

        // Continuous Wave Levitation (Sine-wave dance)
        allCards.forEach((el, index) => {
          gsap.to(el, {
            y: index % 2 === 0 ? -5 : -2,
            rotationZ: (index % 2 === 0 ? 1 : -1) * 1.2,
            duration: 2.2 + (index % 4) * 0.25,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
            delay: index * 0.1,
          });
        });
      }

      // 2. Optical Spark Flare roaming through cards
      if (sparkRef.current) {
        gsap.timeline({ repeat: -1, repeatDelay: 2.2 })
          .set(sparkRef.current, { opacity: 0, x: -30, scale: 0.4 })
          .to(sparkRef.current, { opacity: 1, scale: 1.2, duration: 0.2, ease: 'power2.out' })
          .to(sparkRef.current, {
            x: 680,
            duration: 2.5,
            ease: 'power1.inOut',
          })
          .to(sparkRef.current, { opacity: 0, scale: 0.3, duration: 0.25 });
      }
    }, container);

    // 3. 3D Parallax Tilt based on mouse movement
    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;

      gsap.to(container, {
        rotationY: x * 14,
        rotationX: -y * 10,
        transformPerspective: 1000,
        ease: 'power2.out',
        duration: 0.5,
      });
    };

    const handleMouseLeave = () => {
      gsap.to(container, {
        rotationY: 0,
        rotationX: 0,
        ease: 'power3.out',
        duration: 1.0,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      ctx.revert();
      window.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative select-none my-1 transform-style-3d cursor-default w-full"
      style={{ transformStyle: 'preserve-3d' }}
    >
      {/* Ambient Neon Backglow */}
      <div className="absolute -top-10 -left-6 w-[115%] h-44 bg-gradient-to-r from-[#ffe600]/15 via-[#ff007f]/20 to-[#00f0ff]/18 blur-3xl pointer-events-none rounded-full" />

      {/* Optical Spark Flare roaming along cards (desktop only) */}
      <div
        ref={sparkRef}
        className="hidden md:block absolute top-1/2 left-0 w-6 h-6 -translate-y-1/2 pointer-events-none z-30 opacity-0"
      >
        <div className="relative w-full h-full flex items-center justify-center">
          <div className="absolute w-8 h-0.5 bg-white shadow-[0_0_12px_#ffe600]" />
          <div className="absolute h-8 w-0.5 bg-white shadow-[0_0_12px_#00f0ff]" />
          <div className="w-2.5 h-2.5 rounded-full bg-white shadow-[0_0_15px_#ffe600]" />
        </div>
      </div>

      {/* ========================================================================= */}
      {/* UNIFIED 1-ROW COHESIVE DECK: METANOIA 2.0 (Identical flow Mobile & Desktop) */}
      {/* ========================================================================= */}
      <div className="flex items-center justify-between gap-1 xs:gap-1.5 sm:gap-2 relative z-10 w-full">
        {/* 8 Letter Cards for M - E - T - A - N - O - I - A */}
        {LETTERS.map((item, idx) => {
          const isInteracted = activeCardIndex === idx || poppedCardIndex === idx;

          return (
            <div
              key={idx}
              ref={(el) => (cardRefs.current[idx] = el)}
              onClick={() => handleCardInteract(idx)}
              onMouseEnter={() => {
                setActiveCardIndex(idx);
                playCyberHover('crisp');
              }}
              onMouseLeave={() => setActiveCardIndex(null)}
              onTouchStart={() => handleCardInteract(idx)}
              className="relative group cursor-pointer select-none touch-manipulation transition-transform flex-1 min-w-0"
              style={{ transformStyle: 'preserve-3d' }}
              title={`Letra ${item.char}`}
            >
              {/* Delicate Lens Flare on active card */}
              {isInteracted && (
                <div className="absolute -top-1.5 -right-1.5 w-4 h-4 pointer-events-none z-30">
                  <div className="relative w-full h-full flex items-center justify-center">
                    <div className="absolute w-5 h-0.5 bg-white shadow-[0_0_8px_#ffe600]" />
                    <div className="absolute h-5 w-0.5 bg-white shadow-[0_0_8px_#00f0ff]" />
                    <div className="w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_10px_#ffe600]" />
                  </div>
                </div>
              )}

              {/* 3D Deep Shadow & Extruded Base */}
              <div
                className="absolute inset-0 translate-y-1.5 translate-x-0.5 rounded-lg xs:rounded-xl sm:rounded-2xl bg-gradient-to-br from-[#1a0033] via-[#ff007f]/40 to-[#0c0018] -z-10 blur-[2px] opacity-75"
                style={{
                  boxShadow: '0 8px 16px rgba(0,0,0,0.8), 0 0 10px rgba(255,0,127,0.25)',
                }}
              />

              {/* Motion-Graphic Card Container */}
              <div
                className={`relative flex flex-col items-center justify-between rounded-lg xs:rounded-xl sm:rounded-2xl transition-all duration-300 border overflow-hidden w-full h-15 xs:h-18 sm:h-22 md:h-26 lg:h-28 px-0.5 sm:px-1 py-1 ${
                  isInteracted
                    ? 'border-[#00f0ff] -translate-y-1.5 scale-105 shadow-[0_0_25px_rgba(0,240,255,0.8)]'
                    : 'border-[#ff007f]/50 hover:border-[#ffe600] shadow-[0_6px_16px_rgba(0,0,0,0.6)]'
                }`}
                style={{
                  background: 'linear-gradient(155deg, #2d0052 0%, #15002b 45%, #0c0018 100%)',
                  boxShadow: isInteracted
                    ? '0 0 25px rgba(0, 240, 255, 0.7), inset 0 1px 3px rgba(255,255,255,0.5)'
                    : 'inset 0 1px 2px rgba(255, 230, 0, 0.3), 0 6px 14px rgba(0,0,0,0.7)',
                }}
              >
                {/* Internal Circuit Board Grid Lines */}
                <div className="absolute inset-0.5 rounded-lg bg-[linear-gradient(to_right,rgba(255,230,0,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,240,255,0.08)_1px,transparent_1px)] bg-[size:6px_6px] pointer-events-none" />

                {/* Prismatic Top Border Reflection */}
                <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#00f0ff] via-50% to-[#ff007f] to-transparent opacity-85" />

                {/* Card Top Micro Header: Sub index + Node dot */}
                <div className="w-full flex items-center justify-between px-0.5 sm:px-1 pt-0.5 z-10 text-[7px] xs:text-[8px] sm:text-[9px] font-mono-cyber text-purple-300/80">
                  <span className="hidden xs:inline">{item.sub}</span>
                  <span
                    className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full transition-all ml-auto"
                    style={{
                      backgroundColor: isInteracted ? '#00f0ff' : item.accentColor,
                      boxShadow: `0 0 6px ${isInteracted ? '#00f0ff' : item.accentColor}`,
                    }}
                  />
                </div>

                {/* Main Giant Typography Character */}
                <div className="relative flex items-center justify-center my-auto z-10">
                  <span
                    className="font-cyber-heavy font-black text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-[4.2rem] text-transparent bg-clip-text bg-gradient-to-b from-[#ffffff] via-[#ffe600] to-[#ff007f] select-none leading-none drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] transition-all duration-300"
                    style={{
                      textShadow: isInteracted
                        ? '0 0 20px #ffe600, 0 0 35px #00f0ff'
                        : '0 0 10px rgba(255, 230, 0, 0.6)',
                      WebkitTextStroke: '0.8px rgba(255, 255, 255, 0.4)',
                    }}
                  >
                    {item.char}
                  </span>
                </div>

                {/* Bottom Card Micro Decal */}
                <div className="w-full flex items-center justify-between px-0.5 sm:px-1 pb-0.5 z-10">
                  <span className="w-1 h-1 rounded-full bg-[#ff007f] shadow-[0_0_4px_#ff007f]" />
                  <div className="h-[1.5px] w-2.5 sm:w-4 bg-[#00f0ff]/40 rounded-full" />
                </div>

                {/* Diagonal Laser Sheen Glint */}
                <div className="absolute inset-0 rounded-lg overflow-hidden pointer-events-none">
                  <div className="w-1/2 h-full bg-gradient-to-r from-transparent via-white/25 to-transparent -skew-x-25 animate-title-sheen" />
                </div>
              </div>
            </div>
          );
        })}

        {/* Dedicated Matching "2.0" Card (100% Harmonized in style, colors, gradient, and proportions) */}
        <div
          ref={card20Ref}
          onClick={handle20Interact}
          onMouseEnter={() => playCyberHover('crisp')}
          onTouchStart={handle20Interact}
          className="relative group cursor-pointer select-none touch-manipulation transition-transform flex-[1.4] sm:flex-[1.45] min-w-0"
          style={{ transformStyle: 'preserve-3d' }}
          title="Metanoia 2.0"
        >
          {/* 3D Deep Shadow */}
          <div
            className="absolute inset-0 translate-y-1.5 translate-x-0.5 rounded-lg xs:rounded-xl sm:rounded-2xl bg-gradient-to-br from-[#1a0033] via-[#ff007f]/40 to-[#0c0018] -z-10 blur-[2px] opacity-75"
            style={{
              boxShadow: '0 8px 16px rgba(0,0,0,0.8), 0 0 10px rgba(255,0,127,0.25)',
            }}
          />

          {/* Motion-Graphic Card Container for 2.0 (Exact same purple glass and border as letters) */}
          <div
            className={`relative flex flex-col items-center justify-between rounded-lg xs:rounded-xl sm:rounded-2xl transition-all duration-300 border overflow-hidden w-full h-15 xs:h-18 sm:h-22 md:h-26 lg:h-28 px-0.5 sm:px-1.5 py-1 ${
              is20Popped
                ? 'border-[#00f0ff] -translate-y-1.5 scale-105 shadow-[0_0_25px_rgba(0,240,255,0.9)]'
                : 'border-[#ff007f]/50 hover:border-[#ffe600] shadow-[0_6px_16px_rgba(0,0,0,0.6)]'
            }`}
            style={{
              background: 'linear-gradient(155deg, #2d0052 0%, #15002b 45%, #0c0018 100%)',
              boxShadow: is20Popped
                ? '0 0 25px rgba(0, 240, 255, 0.7), inset 0 1px 3px rgba(255,255,255,0.5)'
                : 'inset 0 1px 2px rgba(255, 230, 0, 0.3), 0 6px 14px rgba(0,0,0,0.7)',
            }}
          >
            {/* Internal Circuit Board Grid Lines */}
            <div className="absolute inset-0.5 rounded-lg bg-[linear-gradient(to_right,rgba(255,230,0,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,240,255,0.08)_1px,transparent_1px)] bg-[size:6px_6px] pointer-events-none" />

            {/* Prismatic Top Border Reflection */}
            <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#00f0ff] via-50% to-[#ff007f] to-transparent opacity-90" />

            {/* Card Top Micro Header */}
            <div className="w-full flex items-center justify-between px-0.5 sm:px-1 pt-0.5 z-10 text-[7px] xs:text-[8px] sm:text-[9px] font-mono-cyber text-[#00f0ff] font-bold">
              <span className="hidden xs:inline tracking-wider">VER</span>
              <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-[#00f0ff] shadow-[0_0_6px_#00f0ff] ml-auto" />
            </div>

            {/* Main 2.0 Typography (Using identical Gold-to-Magenta gradient as METANOIA, perfectly centered and never clipped) */}
            <div className="relative flex items-center justify-center my-auto z-10 w-full">
              <span
                className="font-cyber-heavy font-black text-xl xs:text-2xl sm:text-3xl md:text-4xl lg:text-[3.4rem] text-transparent bg-clip-text bg-gradient-to-b from-[#ffffff] via-[#ffe600] to-[#ff007f] select-none leading-none drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] tracking-tight text-center"
                style={{
                  textShadow: is20Popped
                    ? '0 0 20px #ffe600, 0 0 35px #00f0ff'
                    : '0 0 10px rgba(255, 230, 0, 0.6)',
                  WebkitTextStroke: '0.8px rgba(255, 255, 255, 0.4)',
                }}
              >
                2.0
              </span>
            </div>

            {/* Bottom Card Micro Decal */}
            <div className="w-full flex items-center justify-between px-0.5 sm:px-1 pb-0.5 z-10">
              <span className="w-1 h-1 rounded-full bg-[#ff007f] shadow-[0_0_4px_#ff007f]" />
              <div className="h-[1.5px] w-3 sm:w-5 bg-[#00f0ff]/40 rounded-full" />
            </div>

            {/* Diagonal Laser Sheen */}
            <div className="absolute inset-0 rounded-lg overflow-hidden pointer-events-none">
              <div className="w-1/2 h-full bg-gradient-to-r from-transparent via-white/25 to-transparent -skew-x-25 animate-title-sheen" />
            </div>
          </div>
        </div>
      </div>

      {/* Event Sub-Badge */}
      <div className="flex items-center gap-2 mt-2.5 sm:mt-3 pl-0.5 select-none relative z-10">
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#00f0ff]/10 border border-[#00f0ff]/35 text-[#00f0ff] font-mono-cyber text-[10px] sm:text-xs font-bold tracking-widest uppercase shadow-[0_0_12px_rgba(0,240,255,0.2)]">
          <Sparkles className="w-3 h-3 text-[#ffe600]" />
          <span>NOCHE DE TRANSFORMACIÓN • 20 NOVIEMBRE 2026</span>
        </div>
      </div>
    </div>
  );
};
