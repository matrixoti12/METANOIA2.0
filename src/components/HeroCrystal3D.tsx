import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { Sparkles, RotateCcw, X, Zap, BookOpen, Clock, Compass } from 'lucide-react';
import { playCyberClick, playCyberHover, playCyberTransition, playNeonChime } from '../utils/audio';

interface OracleAdvice {
  verse: string;
  reference: string;
  theme: string;
}

const ORACLE_ADVICES: OracleAdvice[] = [
  {
    verse: '«No temas, porque yo estoy contigo; no desmayes, porque yo soy tu Dios que te esfuerzo; siempre te ayudaré, siempre te sustentaré.»',
    reference: 'Isaías 41:10',
    theme: 'VALENTÍA',
  },
  {
    verse: '«Y la paz de Dios, que sobrepasa todo entendimiento, guardará vuestros corazones y vuestros pensamientos en Cristo Jesús.»',
    reference: 'Filipenses 4:7',
    theme: 'PAZ MENTAL',
  },
  {
    verse: '«Mira que te mando que te esfuerces y seas valiente; no temas ni desmayes, porque Jehová tu Dios estará contigo dondequiera que vayas.»',
    reference: 'Josué 1:9',
    theme: 'FORTALEZA',
  },
  {
    verse: '«De modo que si alguno está en Cristo, nueva criatura es; las cosas viejas pasaron; he aquí todas son hechas nuevas.»',
    reference: '2 Corintios 5:17',
    theme: 'NUEVO COMIENZO',
  },
  {
    verse: '«Clama a mí, y yo te responderé, y te enseñaré cosas grandes y ocultas que tú no conoces.»',
    reference: 'Jeremías 33:3',
    theme: 'DIRECCIÓN',
  },
  {
    verse: '«Porque yo sé los pensamientos que tengo acerca de vosotros, dice Jehová, pensamientos de paz, y no de mal, para daros el fin que esperáis.»',
    reference: 'Jeremías 29:11',
    theme: 'PROPÓSITO',
  },
  {
    verse: '«Todo lo puedo en Cristo que me fortalece.»',
    reference: 'Filipenses 4:13',
    theme: 'VICTORIA',
  },
  {
    verse: '«El da esfuerzo al cansado, y multiplica las fuerzas al que no tiene ningunas... los que esperan a Jehová tendrán nuevas fuerzas.»',
    reference: 'Isaías 40:29-31',
    theme: 'ENERGÍA SOBRENATURAL',
  },
];

export const HeroCrystal3D: React.FC<{ className?: string }> = ({ className = '' }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const wordCardRef = useRef<HTMLDivElement | null>(null);
  const rotationSpeedRef = useRef(0.012);
  const [viewMode, setViewMode] = useState<'countdown' | 'word'>('countdown');
  const [currentAdvice, setCurrentAdvice] = useState<OracleAdvice>(ORACLE_ADVICES[0]);
  const [isSpinningFast, setIsSpinningFast] = useState(false);

  // Target date: November 20, 2026 at 6:00 PM
  const targetDate = new Date('2026-11-20T18:00:00').getTime();
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date().getTime();
      const diff = targetDate - now;
      if (diff > 0) {
        setTimeLeft({
          days: Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((diff % (1000 * 60)) / 1000),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  // GSAP Crystalline entrance animation when a word is revealed
  useEffect(() => {
    if (viewMode === 'word' && wordCardRef.current) {
      gsap.fromTo(
        wordCardRef.current,
        {
          opacity: 0,
          scale: 0.93,
          y: 14,
          filter: 'blur(8px)',
        },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          filter: 'blur(0px)',
          duration: 0.5,
          ease: 'back.out(1.5)',
        }
      );
    }
  }, [viewMode, currentAdvice]);

  // Trigger fast spin & display clean crystalline advice
  const handleTriggerPrism = () => {
    playCyberClick('confirm');
    playCyberTransition();

    rotationSpeedRef.current = 0.28;
    setIsSpinningFast(true);

    const randomIndex = Math.floor(Math.random() * ORACLE_ADVICES.length);
    setCurrentAdvice(ORACLE_ADVICES[randomIndex]);

    // Snappy transition
    setTimeout(() => {
      playNeonChime();
      setIsSpinningFast(false);
      setViewMode('word');
    }, 950);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let angle = 0;
    let mouseX = 0;
    let mouseY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      mouseX = x * 0.35;
      mouseY = y * 0.35;
    };

    window.addEventListener('mousemove', handleMouseMove);

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      canvas.width = (rect.width || 380) * dpr;
      canvas.height = (rect.height || 380) * dpr;
    };

    resize();
    window.addEventListener('resize', resize);

    const vertices = [
      { x: 0, y: -1.3, z: 0 },
      { x: -1.1, y: 0.6, z: -0.8 },
      { x: 1.1, y: 0.6, z: -0.8 },
      { x: 0, y: 0.9, z: 1.2 },
      { x: 0, y: 1.4, z: 0 },
    ];

    const faces = [
      { pts: [0, 1, 3], stroke: '#00f0ff', glow: '#00f0ff' },
      { pts: [0, 3, 2], stroke: '#ff00aa', glow: '#ff00aa' },
      { pts: [0, 2, 1], stroke: '#0070f3', glow: '#0070f3' },
      { pts: [4, 3, 1], stroke: '#ff007f', glow: '#ff007f' },
      { pts: [4, 2, 3], stroke: '#00f0ff', glow: '#00f0ff' },
    ];

    const particles = Array.from({ length: 20 }, (_, i) => ({
      angle: (i / 20) * Math.PI * 2,
      speed: 0.015 + (i % 3) * 0.005,
      radiusOffset: (i % 2 === 0 ? 1 : -1) * (14 + (i % 3) * 8),
      size: 1.5 + (i % 3) * 1.5,
      color: i % 2 === 0 ? '#00f0ff' : '#ff007f',
    }));

    const render = () => {
      if (rotationSpeedRef.current > 0.012) {
        rotationSpeedRef.current = Math.max(0.012, rotationSpeedRef.current * 0.96);
      }

      angle += rotationSpeedRef.current;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = canvas.width;
      const h = canvas.height;
      const cx = w / 2;
      const cy = h / 2 - 10 * dpr;
      const scale = Math.min(w, h) * 0.28;

      ctx.clearRect(0, 0, w, h);

      // Floor Reflection
      const floorGrad = ctx.createRadialGradient(cx, cy + scale * 1.35, 10, cx, cy + scale * 1.35, scale * 1.6);
      floorGrad.addColorStop(0, 'rgba(255, 0, 127, 0.35)');
      floorGrad.addColorStop(0.35, 'rgba(0, 240, 255, 0.2)');
      floorGrad.addColorStop(0.8, 'rgba(20, 0, 38, 0.05)');
      floorGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = floorGrad;
      ctx.beginPath();
      ctx.ellipse(cx, cy + scale * 1.35, scale * 1.5, scale * 0.35, 0, 0, Math.PI * 2);
      ctx.fill();

      // Floor grid rays
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.16)';
      ctx.lineWidth = 1 * dpr;
      for (let i = -4; i <= 4; i++) {
        ctx.beginPath();
        ctx.moveTo(cx + i * 36 * dpr, cy + scale * 1.15);
        ctx.lineTo(cx + i * 105 * dpr, cy + scale * 1.65);
        ctx.stroke();
      }

      // Outer Neon Aura Rings
      const ringRadius = scale * 1.25;
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, ringRadius, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(255, 0, 127, 0.3)';
      ctx.lineWidth = 1.5 * dpr;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(cx, cy, ringRadius * 0.88, angle * 1.5, angle * 1.5 + Math.PI * 1.2);
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.55)';
      ctx.lineWidth = 2 * dpr;
      ctx.shadowColor = '#00f0ff';
      ctx.shadowBlur = 10 * dpr;
      ctx.stroke();
      ctx.restore();

      // Orbiting Neon Particles
      particles.forEach((p) => {
        p.angle += p.speed * (rotationSpeedRef.current > 0.03 ? 3.5 : 1);
        const r = ringRadius + p.radiusOffset * dpr;
        const px = cx + Math.cos(p.angle) * r;
        const py = cy + Math.sin(p.angle) * (r * 0.42);

        ctx.save();
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 10 * dpr;
        ctx.beginPath();
        ctx.arc(px, py, p.size * dpr, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      // 3D Matrix Math
      const cosY = Math.cos(angle + mouseX);
      const sinY = Math.sin(angle + mouseX);
      const cosX = Math.cos(mouseY);
      const sinX = Math.sin(mouseY);

      const projected = vertices.map((v) => {
        const x1 = v.x * cosY - v.z * sinY;
        const z1 = v.x * sinY + v.z * cosY;
        const y2 = v.y * cosX - z1 * sinX;
        const z2 = v.y * sinX + z1 * cosX;

        const fov = 4.2;
        const pz = z2 + fov;
        const pScale = fov / pz;

        return {
          x: cx + x1 * scale * pScale,
          y: cy + y2 * scale * pScale,
          z: z2,
        };
      });

      // Faces Sorting
      const facesWithZ = faces.map((face) => {
        const p0 = projected[face.pts[0]];
        const p1 = projected[face.pts[1]];
        const p2 = projected[face.pts[2]];

        const avgZ = (p0.z + p1.z + p2.z) / 3;
        const cross = (p1.x - p0.x) * (p2.y - p0.y) - (p1.y - p0.y) * (p2.x - p0.x);

        return {
          ...face,
          avgZ,
          isFront: cross < 0,
        };
      });

      facesWithZ.sort((a, b) => a.avgZ - b.avgZ);

      // Render Crystal Faces
      facesWithZ.forEach((face) => {
        const p0 = projected[face.pts[0]];
        const p1 = projected[face.pts[1]];
        const p2 = projected[face.pts[2]];

        ctx.save();
        ctx.beginPath();
        ctx.moveTo(p0.x, p0.y);
        ctx.lineTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.closePath();

        const faceGrad = ctx.createLinearGradient(p0.x, p0.y, (p1.x + p2.x) / 2, (p1.y + p2.y) / 2);
        if (face.isFront) {
          faceGrad.addColorStop(0, 'rgba(0, 240, 255, 0.85)');
          faceGrad.addColorStop(0.5, 'rgba(255, 0, 127, 0.7)');
          faceGrad.addColorStop(1, 'rgba(20, 0, 38, 0.85)');
        } else {
          faceGrad.addColorStop(0, 'rgba(0, 200, 255, 0.4)');
          faceGrad.addColorStop(1, 'rgba(20, 0, 40, 0.6)');
        }

        ctx.fillStyle = faceGrad;
        ctx.fill();

        ctx.strokeStyle = face.stroke;
        ctx.lineWidth = 2.2 * dpr;
        ctx.shadowColor = face.glow;
        ctx.shadowBlur = 14 * dpr;
        ctx.stroke();

        ctx.strokeStyle = 'rgba(255, 255, 255, 0.85)';
        ctx.lineWidth = 1 * dpr;
        ctx.beginPath();
        ctx.moveTo(p0.x, p0.y);
        ctx.lineTo(p1.x, p1.y);
        ctx.stroke();
        ctx.restore();
      });

      // Central Light Nodes
      projected.forEach((p, idx) => {
        ctx.save();
        ctx.fillStyle = idx === 0 ? '#00f0ff' : '#ffe600';
        ctx.shadowColor = idx === 0 ? '#00f0ff' : '#ffe600';
        ctx.shadowBlur = 12 * dpr;
        ctx.beginPath();
        ctx.arc(p.x, p.y, (idx === 0 ? 4 : 2.5) * dpr, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const countdownUnits = [
    { label: 'DÍAS', value: timeLeft.days, color: '#ffe600' },
    { label: 'HORAS', value: timeLeft.hours, color: '#00f0ff' },
    { label: 'MIN', value: timeLeft.minutes, color: '#ff007f' },
    { label: 'SEG', value: timeLeft.seconds, color: '#a855f7' },
  ];

  return (
    <div className={`relative flex flex-col items-center justify-center select-none ${className}`}>
      {/* 3D Crystal Prism Interactive Canvas */}
      <button
        type="button"
        onClick={handleTriggerPrism}
        onMouseEnter={() => playCyberHover('crisp')}
        disabled={isSpinningFast}
        className="group relative cursor-pointer focus:outline-none flex flex-col items-center touch-manipulation mb-2 transition-transform"
        aria-label="Prisma 3D"
      >
        <canvas
          ref={canvasRef}
          className={`w-full h-full max-w-[360px] sm:max-w-[400px] aspect-square object-contain transition-transform duration-500 ${
            isSpinningFast ? 'scale-110 drop-shadow-[0_0_40px_#00f0ff]' : 'group-hover:scale-105'
          }`}
          style={{ filter: 'drop-shadow(0 0 25px rgba(255,0,127,0.3))' }}
        />
      </button>

      {/* CRISTALINO HUD DIV: Crystalline Glassmorphic Container */}
      <div className="w-full max-w-[450px] mt-2 px-1">
        <div className="crystalline-glass relative overflow-hidden rounded-2xl p-4 sm:p-5 transition-all">
          {/* Prismatic rainbow reflection line on top border */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#00f0ff] via-30% via-[#ffe600] via-70% to-[#ff007f] to-transparent opacity-90 animate-prismatic" />

          {/* Diagonal crystal sheen glint */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden mix-blend-overlay opacity-30">
            <div className="w-1/2 h-full bg-gradient-to-r from-transparent via-white/40 to-transparent -skew-x-25 animate-laser-sheen" />
          </div>

          {viewMode === 'countdown' ? (
            /* COUNTDOWN VIEW (Crystalline Glass Style) */
            <div className="relative z-10">
              <div className="flex items-center justify-between gap-2 pb-2.5 mb-2.5 border-b border-white/10 text-xs font-mono-cyber">
                <div className="flex items-center gap-1.5 text-[#ffe600] font-bold">
                  <Clock className="w-3.5 h-3.5 text-[#ffe600] animate-spin" style={{ animationDuration: '8s' }} />
                  <span className="tracking-wider uppercase text-[10px] sm:text-xs">Tiempo hacia el Evento</span>
                </div>
                <span className="text-[10px] sm:text-[11px] text-purple-200/80 font-mono-cyber">
                  20 NOV 2026 • 6:00 PM
                </span>
              </div>

              {/* 4 Crystal Countdown Blocks */}
              <div className="grid grid-cols-4 gap-1.5 sm:gap-2.5">
                {countdownUnits.map((unit, i) => (
                  <div
                    key={i}
                    className="p-2 sm:p-2.5 rounded-xl bg-white/5 border border-white/15 backdrop-blur-md text-center flex flex-col items-center justify-center transition-transform hover:scale-105 shadow-[0_4px_15px_rgba(0,0,0,0.3)]"
                  >
                    <span
                      className="font-cyber-heavy text-lg xs:text-xl sm:text-2xl text-white tracking-tight leading-none"
                      style={{ textShadow: `0 0 10px ${unit.color}` }}
                    >
                      {String(unit.value).padStart(2, '0')}
                    </span>
                    <span
                      className="text-[9px] xs:text-[10px] font-mono-cyber font-bold mt-1 tracking-wider"
                      style={{ color: unit.color }}
                    >
                      {unit.label}
                    </span>
                  </div>
                ))}
              </div>

              {/* Clean Footer Status */}
              <div className="mt-2.5 pt-2 border-t border-white/10 flex items-center justify-between text-[10px] font-mono-cyber text-purple-200/80">
                <span className="flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-[#00f0ff]" /> Iglesia Pacto y Bendición
                </span>
                <span className="text-[#ffe600] tracking-wider uppercase font-bold">
                  Guazapa, San Salvador
                </span>
              </div>
            </div>
          ) : (
            /* CRISTALINO BIBLE WORD VIEW: GSAP Animated, Prismatic Glass */
            <div ref={wordCardRef} className="relative z-10">
              {/* Header with Theme & Close */}
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/15 text-xs font-mono-cyber">
                <div className="flex items-center gap-1.5 text-[#00f0ff] font-bold">
                  <Sparkles className="w-3.5 h-3.5 text-[#ffe600] animate-pulse" />
                  <span className="tracking-wider uppercase text-[10px] sm:text-xs">
                    PRISMA // PALABRA VIVA • {currentAdvice.theme}
                  </span>
                </div>
                <button
                  onClick={() => setViewMode('countdown')}
                  onMouseEnter={() => playCyberHover('subtle')}
                  className="flex items-center gap-1 text-white/70 hover:text-white px-2 py-0.5 rounded-md hover:bg-white/10 transition-colors text-[10px] cursor-pointer"
                  title="Volver al contador"
                >
                  <Clock className="w-3 h-3 text-[#ffe600]" />
                  <span>Contador</span>
                  <X className="w-3 h-3 ml-0.5" />
                </button>
              </div>

              {/* Crystalline Scripture Verse */}
              <blockquote className="font-body text-xs sm:text-[13px] sm:leading-relaxed text-white font-medium italic py-1 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
                {currentAdvice.verse}
              </blockquote>

              {/* Footnote with Reference and Spin Again Button */}
              <div className="flex items-center justify-between gap-2 pt-2.5 mt-2 border-t border-white/15 text-xs">
                <div className="flex items-center gap-1.5 font-cyber font-bold text-[#ffe600] text-xs">
                  <BookOpen className="w-3.5 h-3.5 text-[#ffe600]" />
                  <span className="tracking-wide">{currentAdvice.reference}</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleTriggerPrism}
                    disabled={isSpinningFast}
                    onMouseEnter={() => playCyberHover('crisp')}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 active:scale-95 border border-white/25 text-[#00f0ff] hover:text-white font-cyber text-[10px] sm:text-[11px] font-bold uppercase transition-all cursor-pointer shadow-[0_0_15px_rgba(0,240,255,0.2)]"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Otra Palabra</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
