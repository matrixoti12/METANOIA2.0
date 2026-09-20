import React, { useEffect, useRef } from 'react';

export const CyberBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Subtle cyberpunk ambient floating particles (cyan, magenta, yellow, white)
    const particleCount = Math.min(width < 768 ? 32 : 55, 60);
    const particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 2 + 0.8,
      speedY: -(Math.random() * 0.4 + 0.2),
      speedX: (Math.random() - 0.5) * 0.25,
      color:
        Math.random() > 0.6
          ? '#00f0ff'
          : Math.random() > 0.3
          ? '#ff007f'
          : Math.random() > 0.15
          ? '#ffe600'
          : '#ffffff',
      alpha: Math.random() * 0.6 + 0.2,
      pulseSpeed: Math.random() * 0.02 + 0.01,
    }));

    let time = 0;
    const render = () => {
      time += 0.01;
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        p.y += p.speedY;
        p.x += p.speedX;

        // Wrap around
        if (p.y < -10) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;

        const currentAlpha = p.alpha + Math.sin(time * 3 + p.x) * 0.15;
        const clampedAlpha = Math.max(0.1, Math.min(1, currentAlpha));

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = clampedAlpha;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = p.radius * 4;
        ctx.fill();
      });

      ctx.globalAlpha = 1;
      ctx.shadowBlur = 0;

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
      {/* Deep purple gradient base */}
      <div className="absolute inset-0 bg-[#140026]" />

      {/* Cyber radiant neon flares */}
      <div className="absolute top-[-10%] left-[-10%] w-[55vw] h-[55vw] max-w-[600px] max-h-[600px] rounded-full bg-[#ff007f]/15 blur-[120px] mix-blend-screen" />
      <div className="absolute top-[20%] right-[-10%] w-[55vw] h-[55vw] max-w-[650px] max-h-[650px] rounded-full bg-[#00f0ff]/15 blur-[130px] mix-blend-screen" />
      <div className="absolute bottom-[10%] left-[20%] w-[60vw] h-[60vw] max-w-[700px] max-h-[700px] rounded-full bg-[#7928ca]/20 blur-[140px] mix-blend-screen" />
      <div className="absolute bottom-[-10%] right-[5%] w-[45vw] h-[45vw] max-w-[500px] max-h-[500px] rounded-full bg-[#ffe600]/10 blur-[120px] mix-blend-screen" />

      {/* Cyber dotted pattern reminiscent of the uploaded artwork */}
      <div className="absolute inset-0 cyber-dots-bg opacity-35" />

      {/* Isometric cyber grid overlay */}
      <div className="absolute inset-0 cyber-grid-lines opacity-20 [mask-image:radial-gradient(ellipse_at_center,white,transparent_80%)]" />

      {/* Interactive canvas particles */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
    </div>
  );
};
