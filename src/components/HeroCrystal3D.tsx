import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import {
  Sparkles,
  RotateCcw,
  Clock,
  BookOpen,
  Share2,
  Check,
  Zap,
  Flame,
  Volume2,
} from 'lucide-react';
import { playCyberClick, playCyberHover, playCyberTransition, playNeonChime } from '../utils/audio';

export interface OracleAdvice {
  verse: string;
  reference: string;
  theme: string;
  declaration: string;
}

export const ORACLE_ADVICES: OracleAdvice[] = [
  {
    verse: '«No os conforméis a este siglo, sino transformaos por medio de la renovación de vuestro entendimiento, para que comprobéis cuál sea la buena voluntad de Dios, agradable y perfecta.»',
    reference: 'Romanos 12:2',
    theme: 'METANOIA TOTAL',
    declaration: 'Mi mente es renovada hoy por el Espíritu Santo.',
  },
  {
    verse: '«Y la paz de Dios, que sobrepasa todo entendimiento, guardará vuestros corazones y vuestros pensamientos en Cristo Jesús.»',
    reference: 'Filipenses 4:7',
    theme: 'PAZ INQUEBRANTABLE',
    declaration: 'La ansiedad se desarma ante la paz de Cristo.',
  },
  {
    verse: '«De modo que si alguno está en Cristo, nueva criatura es; las cosas viejas pasaron; he aquí todas son hechas nuevas.»',
    reference: '2 Corintios 5:17',
    theme: 'NUEVA IDENTIDAD',
    declaration: 'Mi pasado no define el futuro que Dios escribió para mí.',
  },
  {
    verse: '«No temas, porque yo estoy contigo; no desmayes, porque yo soy tu Dios que te esfuerzo; siempre te ayudaré, siempre te sustentaré.»',
    reference: 'Isaías 41:10',
    theme: 'RESPALDO DIVINO',
    declaration: 'El Creador del cielo y la tierra camina a mi lado.',
  },
  {
    verse: '«Por lo demás, hermanos, todo lo que es verdadero, todo lo honesto, todo lo justo, todo lo puro, todo lo amable... en esto pensad.»',
    reference: 'Filipenses 4:8',
    theme: 'FILTRO MENTAL',
    declaration: 'Elijo alimentar mi mente solo con la verdad de Dios.',
  },
  {
    verse: '«Porque yo sé los pensamientos que tengo acerca de vosotros, dice Jehová, pensamientos de paz, y no de mal, para daros el fin que esperáis.»',
    reference: 'Jeremías 29:11',
    theme: 'PROPÓSITO ETERNO',
    declaration: 'Mi destino en Cristo es de paz, victoria y gloria.',
  },
  {
    verse: '«Derribando argumentos y toda altivez que se levanta contra el conocimiento de Dios, y llevando cautivo todo pensamiento a la obediencia a Cristo.»',
    reference: '2 Corintios 10:5',
    theme: 'AUTORIDAD ESPIRITUAL',
    declaration: 'Tomo cautivo todo mal pensamiento bajo el señorío de Jesús.',
  },
  {
    verse: '«Todo lo puedo en Cristo que me fortalece.»',
    reference: 'Filipenses 4:13',
    theme: 'FUERZA SOBRENATURAL',
    declaration: 'No camino en mis fuerzas limitadas, sino en el poder de Dios.',
  },
];

export const HeroCrystal3D: React.FC<{ className?: string }> = ({ className = '' }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const wordCardRef = useRef<HTMLDivElement | null>(null);
  const rotationSpeedRef = useRef(0.015);
  const [viewMode, setViewMode] = useState<'countdown' | 'word'>('countdown');
  const [currentAdvice, setCurrentAdvice] = useState<OracleAdvice>(ORACLE_ADVICES[0]);
  const [isSpinningFast, setIsSpinningFast] = useState(false);
  const [copied, setCopied] = useState(false);

  // Official Event Target: November 28, 2026 at 6:00 PM (18:00)
  const targetDate = new Date('2026-11-28T18:00:00').getTime();
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

  // Entrance animation when a word is revealed
  useEffect(() => {
    if (viewMode === 'word' && wordCardRef.current) {
      gsap.fromTo(
        wordCardRef.current,
        {
          opacity: 0,
          scale: 0.92,
          y: 16,
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

  // Trigger fast spin & reveal new word
  const handleTriggerPrism = () => {
    playCyberClick('confirm');
    playCyberTransition();

    rotationSpeedRef.current = 0.35;
    setIsSpinningFast(true);

    const randomIndex = Math.floor(Math.random() * ORACLE_ADVICES.length);
    setCurrentAdvice(ORACLE_ADVICES[randomIndex]);

    setTimeout(() => {
      playNeonChime();
      setIsSpinningFast(false);
      setViewMode('word');
      if (navigator.vibrate) navigator.vibrate([25, 40, 25]);
    }, 850);
  };

  const handleCopyVerse = () => {
    playCyberClick();
    const textToCopy = `«${currentAdvice.verse}» — ${currentAdvice.reference}\n✨ Declaración: ${currentAdvice.declaration}\n🔥 METANOIA 2026 • 28 de Noviembre | Iglepacben AD Guazapa`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  // 3D Polyhedron Canvas with iridescent shader matching official poster colors
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
      mouseX = x * 0.4;
      mouseY = y * 0.4;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        const rect = canvas.getBoundingClientRect();
        const x = (touch.clientX - rect.left) / rect.width - 0.5;
        const y = (touch.clientY - rect.top) / rect.height - 0.5;
        mouseX = x * 0.5;
        mouseY = y * 0.5;
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove, { passive: true });

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      canvas.width = (rect.width || 360) * dpr;
      canvas.height = (rect.height || 360) * dpr;
    };

    resize();
    window.addEventListener('resize', resize);

    // 3D Octahedron / Iridescent Gem Coordinates
    const vertices = [
      { x: 0, y: -1.35, z: 0 },
      { x: 1.15, y: 0, z: 1.15 },
      { x: -1.15, y: 0, z: 1.15 },
      { x: -1.15, y: 0, z: -1.15 },
      { x: 1.15, y: 0, z: -1.15 },
      { x: 0, y: 1.35, z: 0 },
    ];

    const faces = [
      { pts: [0, 1, 2], colorShift: '#a855f7', stroke: '#c084fc', glow: '#a855f7' },
      { pts: [0, 2, 3], colorShift: '#00f0ff', stroke: '#38bdf8', glow: '#00f0ff' },
      { pts: [0, 3, 4], colorShift: '#9333ea', stroke: '#e879f9', glow: '#c084fc' },
      { pts: [0, 4, 1], colorShift: '#6366f1', stroke: '#a5b4fc', glow: '#818cf8' },
      { pts: [5, 2, 1], colorShift: '#c084fc', stroke: '#f472b6', glow: '#e879f9' },
      { pts: [5, 3, 2], colorShift: '#38bdf8', stroke: '#00f0ff', glow: '#38bdf8' },
      { pts: [5, 4, 3], colorShift: '#7e22ce', stroke: '#a855f7', glow: '#7e22ce' },
      { pts: [5, 1, 4], colorShift: '#a855f7', stroke: '#c084fc', glow: '#a855f7' },
    ];

    const render = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const cx = canvas.width / 2;
      const cy = canvas.height / 2;
      const scale = Math.min(canvas.width, canvas.height) * 0.28;

      if (rotationSpeedRef.current > 0.015) {
        rotationSpeedRef.current *= 0.965;
      }
      angle += rotationSpeedRef.current;

      const rotY = angle + mouseX * 2.2;
      const rotX = Math.sin(angle * 0.7) * 0.22 + mouseY * 2.0;

      // Project 3D points
      const projected = vertices.map((v) => {
        let x1 = v.x * Math.cos(rotY) - v.z * Math.sin(rotY);
        let z1 = v.x * Math.sin(rotY) + v.z * Math.cos(rotY);
        let y2 = v.y * Math.cos(rotX) - z1 * Math.sin(rotX);
        let z2 = v.y * Math.sin(rotX) + z1 * Math.cos(rotX);
        const fov = 3.2;
        const pers = fov / (fov + z2);

        return {
          x: cx + x1 * scale * pers,
          y: cy + y2 * scale * pers,
          z: z2,
        };
      });

      // Sort faces by depth
      const facesWithZ = faces.map((face) => {
        const avgZ = (projected[face.pts[0]].z + projected[face.pts[1]].z + projected[face.pts[2]].z) / 3;
        const p0 = projected[face.pts[0]];
        const p1 = projected[face.pts[1]];
        const p2 = projected[face.pts[2]];
        const isFront = (p1.x - p0.x) * (p2.y - p0.y) - (p1.y - p0.y) * (p2.x - p0.x) < 0;
        return { ...face, avgZ, isFront };
      });

      facesWithZ.sort((a, b) => a.avgZ - b.avgZ);

      // Render Crystal Faces with poster palette
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
          faceGrad.addColorStop(0, 'rgba(192, 132, 252, 0.82)');
          faceGrad.addColorStop(0.4, 'rgba(168, 85, 247, 0.65)');
          faceGrad.addColorStop(0.8, 'rgba(0, 240, 255, 0.55)');
          faceGrad.addColorStop(1, 'rgba(18, 7, 48, 0.9)');
        } else {
          faceGrad.addColorStop(0, 'rgba(147, 51, 234, 0.35)');
          faceGrad.addColorStop(1, 'rgba(10, 4, 30, 0.65)');
        }

        ctx.fillStyle = faceGrad;
        ctx.fill();

        ctx.strokeStyle = face.stroke;
        ctx.lineWidth = 2 * dpr;
        ctx.shadowColor = face.glow;
        ctx.shadowBlur = 16 * dpr;
        ctx.stroke();

        // Facet reflection edge
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.lineWidth = 1 * dpr;
        ctx.beginPath();
        ctx.moveTo(p0.x, p0.y);
        ctx.lineTo(p1.x, p1.y);
        ctx.stroke();
        ctx.restore();
      });

      // Vertices core dots
      projected.forEach((p, idx) => {
        ctx.save();
        ctx.fillStyle = idx === 0 ? '#00f0ff' : '#c084fc';
        ctx.shadowColor = idx === 0 ? '#00f0ff' : '#a855f7';
        ctx.shadowBlur = 10 * dpr;
        ctx.beginPath();
        ctx.arc(p.x, p.y, (idx === 0 ? 3.5 : 2.5) * dpr, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const countdownUnits = [
    { label: 'DÍAS', value: timeLeft.days, color: '#c084fc' },
    { label: 'HORAS', value: timeLeft.hours, color: '#00f0ff' },
    { label: 'MIN', value: timeLeft.minutes, color: '#f472b6' },
    { label: 'SEG', value: timeLeft.seconds, color: '#e879f9' },
  ];

  return (
    <div className={`relative flex flex-col items-center justify-center select-none w-full ${className}`}>
      {/* 3D Polyhedron Canvas with touch feedback */}
      <button
        type="button"
        onClick={handleTriggerPrism}
        onMouseEnter={() => playCyberHover('crisp')}
        disabled={isSpinningFast}
        className="group relative cursor-pointer focus:outline-none flex flex-col items-center touch-manipulation mb-1.5 transition-transform"
        aria-label="Tocar el Prisma para recibir una palabra"
      >
        <div className="relative">
          {/* Ambient soft glow matching poster */}
          <div className="absolute inset-0 bg-[#a855f7]/25 rounded-full blur-2xl pointer-events-none group-hover:bg-[#a855f7]/40 transition-colors" />
          <canvas
            ref={canvasRef}
            className={`w-full h-full max-w-[320px] xs:max-w-[360px] sm:max-w-[380px] aspect-square object-contain transition-transform duration-500 relative z-10 ${
              isSpinningFast ? 'scale-110 drop-shadow-[0_0_45px_#a855f7]' : 'group-hover:scale-105'
            }`}
            style={{ filter: 'drop-shadow(0 0 25px rgba(168, 85, 247, 0.45))' }}
          />
        </div>
        <span className="text-[10px] sm:text-xs font-mono-cyber font-bold tracking-widest text-purple-300/80 group-hover:text-white uppercase transition-colors flex items-center gap-1.5 bg-black/40 px-3 py-1 rounded-full border border-purple-500/30 backdrop-blur-sm shadow-[0_0_12px_rgba(168,85,247,0.3)] mt-[-10px] relative z-20">
          <Sparkles className="w-3 h-3 text-[#c084fc] animate-pulse" />
          <span>TOCA EL PRISMA PARA RECIBIR TU PALABRA</span>
        </span>
      </button>

      {/* ========================================================================= */}
      {/* OFFICIAL FLYER HUD CARD: EXACT METANOIA POSTER PALETTE & GLASSMORPHISM    */}
      {/* ========================================================================= */}
      <div className="w-full max-w-[460px] mt-2 px-1">
        <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl p-4 sm:p-5 transition-all bg-[#0f0728]/90 backdrop-blur-2xl border-2 border-[#a855f7]/60 shadow-[0_0_35px_rgba(168,85,247,0.35),inset_0_1px_2px_rgba(255,255,255,0.2)]">
          {/* Neon violet top flare */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#c084fc] via-30% via-[#00f0ff] via-70% to-[#a855f7] to-transparent opacity-95" />

          {/* Diagonal laser sheen glint */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden mix-blend-overlay opacity-25">
            <div className="w-1/2 h-full bg-gradient-to-r from-transparent via-white/50 to-transparent -skew-x-25 animate-laser-sheen" />
          </div>

          {viewMode === 'countdown' ? (
            /* =================================================================== */
            /* COUNTDOWN & ARTIST HUD VIEW                                         */
            /* =================================================================== */
            <div className="relative z-10 space-y-3">
              {/* Top Banner: Guest Artist & Speaker Badge (Matching the exact flyer pill) */}
              <div className="flex items-center gap-2.5 p-2 rounded-xl bg-purple-950/40 border border-purple-500/30 backdrop-blur-md">
                {/* Glowing Violet Icon Badge (As seen in the official flyer) */}
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#7b2cbf] to-[#c77dff] p-[1.5px] shadow-[0_0_15px_#a855f7] flex-shrink-0 flex items-center justify-center">
                  <div className="w-full h-full bg-[#120732] rounded-[10px] flex items-center justify-center">
                    <div className="w-4 h-4 rounded-md bg-white shadow-[0_0_8px_#ffffff]" />
                  </div>
                </div>

                <div className="flex flex-col min-w-0">
                  <span className="text-[9px] xs:text-[10px] font-mono-cyber font-bold tracking-[0.2em] text-[#c084fc] uppercase">
                    EN LA MÚSICA Y PALABRA
                  </span>
                  <span className="font-cyber text-sm sm:text-base text-white tracking-wide font-extrabold truncate drop-shadow-[0_0_10px_rgba(255,255,255,0.4)]">
                    PABLO ROSALES
                  </span>
                </div>

                <div className="ml-auto flex items-center">
                  <span className="text-[10px] font-mono-cyber text-[#00f0ff] bg-[#00f0ff]/10 border border-[#00f0ff]/30 px-2 py-0.5 rounded-full uppercase font-bold tracking-wider">
                    EN VIVO
                  </span>
                </div>
              </div>

              {/* Middle Bar: Official Date Pill (28 | NOVIEMBRE | 06:00PM) */}
              <div className="flex items-center justify-between gap-1.5 py-1.5 px-3 rounded-xl bg-[#09031c] border border-purple-500/35">
                <div className="flex items-center gap-2 text-white font-cyber-heavy text-xs sm:text-sm tracking-wider">
                  <span className="text-xl sm:text-2xl text-[#00f0ff] drop-shadow-[0_0_8px_#00f0ff] leading-none">
                    28
                  </span>
                  <span className="text-white/40 font-mono">|</span>
                  <span className="text-xs sm:text-sm font-bold text-white tracking-widest uppercase">
                    NOVIEMBRE
                  </span>
                  <span className="text-white/40 font-mono">|</span>
                  <span className="text-xs sm:text-sm font-bold text-[#c084fc] tracking-wider">
                    06:00PM
                  </span>
                </div>

                <button
                  onClick={handleTriggerPrism}
                  className="flex items-center gap-1 text-[10px] font-mono-cyber font-bold text-[#00f0ff] hover:text-white bg-[#00f0ff]/15 hover:bg-[#00f0ff]/30 border border-[#00f0ff]/40 px-2 py-1 rounded-lg transition-all cursor-pointer"
                  title="Recibir un versículo"
                >
                  <Sparkles className="w-3 h-3 text-[#c084fc]" />
                  <span>Mensaje</span>
                </button>
              </div>

              {/* 4 Crystal Countdown Blocks */}
              <div className="grid grid-cols-4 gap-1.5 sm:gap-2">
                {countdownUnits.map((unit, i) => (
                  <div
                    key={i}
                    className="p-2 sm:p-2.5 rounded-xl bg-[#150a36]/80 border border-purple-500/25 backdrop-blur-md text-center flex flex-col items-center justify-center transition-transform hover:scale-105 shadow-[0_4px_12px_rgba(0,0,0,0.5)]"
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

              {/* Bottom Location Decal (EN IGLEPACBEN AD GUAZAPA) */}
              <div className="pt-2 border-t border-purple-500/20 flex items-center justify-between text-[10px] font-mono-cyber text-purple-200/90">
                <span className="flex items-center gap-1.5 tracking-wider uppercase font-bold text-[#c084fc]">
                  <Flame className="w-3.5 h-3.5 text-[#00f0ff]" /> EN IGLEPACBEN AD GUAZAPA
                </span>
                <span className="text-[#00ff9d] tracking-widest uppercase font-bold">
                  ENTRADA LIBRE
                </span>
              </div>
            </div>
          ) : (
            /* =================================================================== */
            /* PRISMA DE LA PALABRA / TEXTO REVELADO (Official Violet Theme)       */
            /* =================================================================== */
            <div ref={wordCardRef} className="relative z-10 space-y-3">
              {/* Header with Theme & Close */}
              <div className="flex items-center justify-between pb-2 border-b border-purple-500/30 text-xs font-mono-cyber">
                <div className="flex items-center gap-1.5 text-[#00f0ff] font-bold">
                  <div className="w-2 h-2 rounded-full bg-[#00f0ff] animate-ping" />
                  <span className="tracking-wider uppercase text-[10px] sm:text-xs text-[#c084fc]">
                    PALABRA DE DIOS • {currentAdvice.theme}
                  </span>
                </div>
                <button
                  onClick={() => setViewMode('countdown')}
                  onMouseEnter={() => playCyberHover('subtle')}
                  className="flex items-center gap-1 text-purple-200 hover:text-white px-2 py-0.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-[10px] cursor-pointer"
                  title="Volver al contador"
                >
                  <Clock className="w-3 h-3 text-[#c084fc]" />
                  <span>Contador</span>
                </button>
              </div>

              {/* Bible Scripture */}
              <blockquote className="font-body text-xs sm:text-[13px] leading-relaxed text-white font-medium italic p-2 rounded-xl bg-purple-950/30 border border-purple-500/20 shadow-inner">
                {currentAdvice.verse}
              </blockquote>

              {/* Declaration Pill */}
              <div className="flex items-center gap-2 p-2 rounded-xl bg-[#09031c] border border-cyan-500/30 text-[11px] font-body text-cyan-200">
                <Zap className="w-3.5 h-3.5 text-[#00f0ff] flex-shrink-0" />
                <span className="font-semibold">{currentAdvice.declaration}</span>
              </div>

              {/* Actions Footer */}
              <div className="flex items-center justify-between gap-2 pt-2 border-t border-purple-500/25 text-xs">
                <div className="flex items-center gap-1.5 font-cyber font-bold text-[#c084fc] text-xs">
                  <BookOpen className="w-3.5 h-3.5 text-[#c084fc]" />
                  <span className="tracking-wide">{currentAdvice.reference}</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopyVerse}
                    onMouseEnter={() => playCyberHover('subtle')}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-mono-cyber text-[10px] font-bold uppercase transition-all cursor-pointer min-h-[36px]"
                    title="Copiar versículo"
                  >
                    {copied ? <Check className="w-3 h-3 text-[#00ff9d]" /> : <Share2 className="w-3 h-3" />}
                    <span>{copied ? '¡Copiado!' : 'Compartir'}</span>
                  </button>

                  <button
                    onClick={handleTriggerPrism}
                    disabled={isSpinningFast}
                    onMouseEnter={() => playCyberHover('crisp')}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-gradient-to-r from-[#9333ea] to-[#7b2cbf] hover:from-[#a855f7] hover:to-[#9333ea] active:scale-95 text-white font-cyber text-[10px] sm:text-[11px] font-bold uppercase transition-all cursor-pointer shadow-[0_0_15px_rgba(168,85,247,0.5)] border border-purple-400 min-h-[36px]"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Otro Texto</span>
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
