import React, { useEffect, useRef } from 'react';

/**
 * CyberBackground
 * Sistema ambiental cósmico e interactivo extraído de vista-previa-interactiva.html:
 * - Gradientes radiales violeta (#b778b2), orquídea (#b01cc6), cobalto (#4331ec) y púrpura (#170526)
 * - Rayos de luz atmosféricos (.rays) en deriva continua
 * - Resplandor interactivo (.interactive-glow) que sigue la posición del puntero con inercia física
 * - Inclinación 3D (--dx, --dy, --tiltx, --tilty) transmitida a la portada
 * - Ondas de choque (ripples) y destellos de toque (tap-flash) al hacer clic o tocar
 */
export const CyberBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const root = document.documentElement;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');

    let tx = 0;
    let ty = 0;
    let x = 0;
    let y = 0;
    let frame = 0;
    let last = 0;

    function paint(time: number) {
      frame = 0;
      if (document.hidden || reduced.matches) return;
      const a = 1 - Math.exp(-Math.min(time - last || 16, 50) / 110);
      last = time;
      x += (tx - x) * a;
      y += (ty - y) * a;

      root.style.setProperty('--dx', (x * 12).toFixed(2) + 'px');
      root.style.setProperty('--dy', (y * 9).toFixed(2) + 'px');
      root.style.setProperty('--tiltx', (-y * 2.5).toFixed(2) + 'deg');
      root.style.setProperty('--tilty', (x * 3.2).toFixed(2) + 'deg');
      root.style.setProperty('--px', (50 + x * 45).toFixed(2) + '%');
      root.style.setProperty('--py', (50 + y * 45).toFixed(2) + '%');

      if (Math.abs(tx - x) + Math.abs(ty - y) > 0.002) {
        frame = requestAnimationFrame(paint);
      }
    }

    function move(e: PointerEvent) {
      tx = Math.max(-1, Math.min(1, (e.clientX / window.innerWidth) * 2 - 1));
      ty = Math.max(-1, Math.min(1, (e.clientY / window.innerHeight) * 2 - 1));
      if (!frame) {
        last = performance.now();
        frame = requestAnimationFrame(paint);
      }
    }

    function reset() {
      tx = 0;
      ty = 0;
      if (!frame) {
        frame = requestAnimationFrame(paint);
      }
    }

    function handlePointerDown(e: PointerEvent) {
      if (reduced.matches) return;
      const target = e.target as HTMLElement | null;
      // Skip if interacting inside interactive inputs
      if (target?.closest('input, textarea, select')) return;

      move(e);

      // Spawn ripple wave
      const ripple = document.createElement('div');
      ripple.className = 'ripple';
      ripple.setAttribute('aria-hidden', 'true');
      ripple.style.setProperty('--x', `${e.clientX}px`);
      ripple.style.setProperty('--y', `${e.clientY}px`);
      document.body.appendChild(ripple);
      ripple.addEventListener('animationend', () => ripple.remove(), { once: true });

      // Spawn tap flash halo
      const flash = document.createElement('div');
      flash.className = 'tap-flash';
      flash.setAttribute('aria-hidden', 'true');
      flash.style.setProperty('--x', `${e.clientX}px`);
      flash.style.setProperty('--y', `${e.clientY}px`);
      document.body.appendChild(flash);
      flash.addEventListener('animationend', () => flash.remove(), { once: true });
    }

    window.addEventListener('pointermove', move, { passive: true });
    document.addEventListener('pointerleave', reset);
    window.addEventListener('pointerdown', handlePointerDown, { passive: true });

    // Subtle cosmic stardust canvas
    const canvas = canvasRef.current;
    let animId: number;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        let w = (canvas.width = window.innerWidth);
        let h = (canvas.height = window.innerHeight);

        const onResize = () => {
          if (!canvas) return;
          w = canvas.width = window.innerWidth;
          h = canvas.height = window.innerHeight;
        };
        window.addEventListener('resize', onResize);

        const stars = Array.from({ length: 45 }, () => ({
          x: Math.random() * w,
          y: Math.random() * h,
          r: Math.random() * 1.5 + 0.6,
          speedY: -(Math.random() * 0.25 + 0.1),
          speedX: (Math.random() - 0.5) * 0.15,
          color: Math.random() > 0.5 ? '#c3a7ff' : Math.random() > 0.3 ? '#f4b6ff' : '#ffffff',
          alpha: Math.random() * 0.5 + 0.2,
        }));

        const loop = () => {
          ctx.clearRect(0, 0, w, h);
          stars.forEach((s) => {
            s.y += s.speedY;
            s.x += s.speedX;
            if (s.y < -5) s.y = h + 5;
            if (s.x < -5) s.x = w + 5;
            if (s.x > w + 5) s.x = -5;

            ctx.beginPath();
            ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
            ctx.fillStyle = s.color;
            ctx.globalAlpha = s.alpha;
            ctx.shadowColor = s.color;
            ctx.shadowBlur = s.r * 3;
            ctx.fill();
          });
          ctx.globalAlpha = 1;
          animId = requestAnimationFrame(loop);
        };
        loop();

        return () => {
          window.removeEventListener('pointermove', move);
          document.removeEventListener('pointerleave', reset);
          window.removeEventListener('pointerdown', handlePointerDown);
          window.removeEventListener('resize', onResize);
          cancelAnimationFrame(frame);
          cancelAnimationFrame(animId);
        };
      }
    }

    return () => {
      window.removeEventListener('pointermove', move);
      document.removeEventListener('pointerleave', reset);
      window.removeEventListener('pointerdown', handlePointerDown);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
      {/* 1. Deep Cosmic Radial & Linear Gradients from vista-previa-interactiva.html */}
      <div className="fixed inset-0 z-[-3] cosmic-gradient-backdrop" />

      {/* 2. Atmospheric Drifting Rays */}
      <div className="rays" aria-hidden="true" />

      {/* 3. Interactive Cursor Glow (follows pointer) */}
      <div className="interactive-glow" aria-hidden="true" />

      {/* 4. Canvas Floating Cosmic Stardust */}
      <canvas ref={canvasRef} className="fixed inset-0 z-[-1] pointer-events-none" />
    </div>
  );
};
