import React, { useEffect, useRef } from 'react';

export const CtaPrism3D: React.FC<{ className?: string }> = ({ className = '' }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let angle = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      canvas.width = (rect.width || 360) * dpr;
      canvas.height = (rect.height || 260) * dpr;
    };

    resize();
    window.addEventListener('resize', resize);

    // Arrow prism points (facing right)
    const render = () => {
      angle += 0.015;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = canvas.width;
      const h = canvas.height;
      const cx = w * 0.48;
      const cy = h * 0.5;
      const floatY = Math.sin(angle) * 5 * dpr;
      const scale = Math.min(w, h) * 0.42;

      ctx.clearRect(0, 0, w, h);

      // Background neon circle outline
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx - 15 * dpr, cy + floatY, scale * 0.9, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.35)';
      ctx.lineWidth = 1.5 * dpr;
      ctx.shadowColor = '#00f0ff';
      ctx.shadowBlur = 12 * dpr;
      ctx.stroke();

      // Subtle background square grid
      ctx.strokeStyle = 'rgba(255, 0, 127, 0.2)';
      ctx.strokeRect(cx - scale * 0.9, cy + floatY - scale * 0.7, scale * 1.5, scale * 1.4);
      ctx.restore();

      // 3D Arrow Crystal Geometry
      // Arrow Tip (pointing right)
      const tip = { x: cx + scale * 0.85, y: cy + floatY };
      // Top Left Corner
      const topLeft = { x: cx - scale * 0.75, y: cy + floatY - scale * 0.75 };
      // Bottom Left Corner
      const botLeft = { x: cx - scale * 0.75, y: cy + floatY + scale * 0.75 };
      // Center Indent / Ridge
      const centerRidge = { x: cx - scale * 0.25, y: cy + floatY };
      // Front 3D Apex Ridge
      const frontRidge = { x: cx + scale * 0.2, y: cy + floatY - scale * 0.15 };

      // Face 1: Top facet (Cyan to Electric Blue)
      const grad1 = ctx.createLinearGradient(topLeft.x, topLeft.y, tip.x, tip.y);
      grad1.addColorStop(0, 'rgba(0, 240, 255, 0.85)');
      grad1.addColorStop(0.5, 'rgba(0, 120, 255, 0.6)');
      grad1.addColorStop(1, 'rgba(255, 0, 127, 0.4)');

      ctx.save();
      ctx.beginPath();
      ctx.moveTo(tip.x, tip.y);
      ctx.lineTo(topLeft.x, topLeft.y);
      ctx.lineTo(centerRidge.x, centerRidge.y);
      ctx.lineTo(frontRidge.x, frontRidge.y);
      ctx.closePath();
      ctx.fillStyle = grad1;
      ctx.fill();

      ctx.strokeStyle = '#00f0ff';
      ctx.lineWidth = 2.5 * dpr;
      ctx.shadowColor = '#00f0ff';
      ctx.shadowBlur = 14 * dpr;
      ctx.stroke();
      ctx.restore();

      // Face 2: Bottom facet (Vibrant Magenta to Purple)
      const grad2 = ctx.createLinearGradient(botLeft.x, botLeft.y, tip.x, tip.y);
      grad2.addColorStop(0, 'rgba(255, 0, 127, 0.85)');
      grad2.addColorStop(0.5, 'rgba(121, 40, 202, 0.65)');
      grad2.addColorStop(1, 'rgba(0, 240, 255, 0.4)');

      ctx.save();
      ctx.beginPath();
      ctx.moveTo(tip.x, tip.y);
      ctx.lineTo(botLeft.x, botLeft.y);
      ctx.lineTo(centerRidge.x, centerRidge.y);
      ctx.lineTo(frontRidge.x, frontRidge.y);
      ctx.closePath();
      ctx.fillStyle = grad2;
      ctx.fill();

      ctx.strokeStyle = '#ff00aa';
      ctx.lineWidth = 2.5 * dpr;
      ctx.shadowColor = '#ff00aa';
      ctx.shadowBlur = 16 * dpr;
      ctx.stroke();
      ctx.restore();

      // Face 3: Back inner bevel facet
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(topLeft.x, topLeft.y);
      ctx.lineTo(botLeft.x, botLeft.y);
      ctx.lineTo(centerRidge.x, centerRidge.y);
      ctx.closePath();
      ctx.fillStyle = 'rgba(20, 0, 40, 0.7)';
      ctx.fill();
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.5)';
      ctx.lineWidth = 1.5 * dpr;
      ctx.stroke();
      ctx.restore();

      // Glowing Center Light Specular Line
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(frontRidge.x, frontRidge.y);
      ctx.lineTo(tip.x, tip.y);
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2 * dpr;
      ctx.shadowColor = '#ffffff';
      ctx.shadowBlur = 10 * dpr;
      ctx.stroke();
      ctx.restore();

      // Particle sparkles around the crystal
      for (let i = 0; i < 5; i++) {
        const px = cx + Math.cos(angle * 1.5 + i * 1.2) * (scale * 0.95);
        const py = cy + floatY + Math.sin(angle * 1.5 + i * 1.2) * (scale * 0.7);
        ctx.save();
        ctx.fillStyle = i % 2 === 0 ? '#00f0ff' : '#ffe600';
        ctx.shadowColor = ctx.fillStyle;
        ctx.shadowBlur = 8 * dpr;
        ctx.beginPath();
        ctx.arc(px, py, 1.8 * dpr, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className={`relative flex items-center justify-center select-none ${className}`}>
      <canvas
        ref={canvasRef}
        className="w-full h-full max-w-[380px] max-h-[280px] aspect-[4/3] object-contain"
        style={{ filter: 'drop-shadow(0 0 30px rgba(0,240,255,0.35))' }}
      />
    </div>
  );
};
