import React, { useState, useRef } from 'react';
import { Sparkles, Zap, Flame } from 'lucide-react';

export const MetanoiaCyberTitleAnimated: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  // 3D Parallax tilt on mouse move
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: x * 12, y: -y * 12 });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
    setIsHovered(false);
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      className="relative w-full max-w-2xl mx-auto lg:mx-0 my-2 select-none group perspective-1000"
    >
      {/* 3D Floating & Tilt Container */}
      <div
        style={{
          transform: `perspective(1000px) rotateX(${tilt.y}deg) rotateY(${tilt.x}deg) translateZ(0)`,
          transition: isHovered ? 'transform 0.1s ease-out' : 'transform 0.6s cubic-bezier(0.25, 1, 0.5, 1)',
        }}
        className="relative w-full rounded-3xl overflow-hidden shadow-[0_20px_60px_rgba(255,0,127,0.35)] border border-[#00f0ff]/30 bg-gradient-to-b from-[#180036]/90 to-[#0c001a]/95 backdrop-blur-md"
      >
        {/* Background Cyber Grid Lines */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,240,255,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,0,127,0.08)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

        {/* Ambient Neon Halos */}
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-64 h-64 bg-[#ffe600]/15 rounded-full blur-3xl pointer-events-none animate-pulse" />
        <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-64 h-64 bg-[#ff007f]/25 rounded-full blur-3xl pointer-events-none animate-pulse" style={{ animationDelay: '1s' }} />

        {/* The 3D Arcade Title Image */}
        <div className="relative w-full overflow-hidden flex items-center justify-center p-1 sm:p-2">
          <img
            src="/assets/metanoia-3d-title.jpg"
            alt="METANOIA 2.0 3D Retro Arcade Cyberpunk Logo"
            className="w-full h-auto object-cover rounded-2xl transition-transform duration-700 group-hover:scale-[1.03]"
            style={{
              filter: 'contrast(112%) saturate(125%) brightness(105%) drop-shadow(0 0 25px rgba(0,240,255,0.3))',
            }}
          />

          {/* CONTINUOUS VIDEO-LIKE ANIMATIONS LAYER */}

          {/* 1. Diagonal Continuous Light Sweep (Shimmer Laser) */}
          <div
            className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl"
            style={{ mixBlendMode: 'screen' }}
          >
            <div
              className="w-[180%] h-full bg-gradient-to-r from-transparent via-white/35 to-transparent -skew-x-25 animate-laser-sheen"
            />
          </div>

          {/* 2. Starburst Lens Flares on Letters */}
          {/* Top-left flare on 'M' */}
          <div className="absolute top-[18%] left-[22%] pointer-events-none animate-flare-pulse">
            <div className="relative w-8 h-8 flex items-center justify-center">
              <div className="absolute w-8 h-0.5 bg-white shadow-[0_0_12px_#00f0ff]" />
              <div className="absolute h-8 w-0.5 bg-white shadow-[0_0_12px_#00f0ff]" />
              <div className="w-2.5 h-2.5 rounded-full bg-white shadow-[0_0_15px_#00f0ff]" />
            </div>
          </div>

          {/* Golden lens flare on 'T/A' center */}
          <div className="absolute top-[16%] left-[32%] pointer-events-none animate-flare-pulse" style={{ animationDelay: '1.2s' }}>
            <div className="relative w-10 h-10 flex items-center justify-center">
              <div className="absolute w-12 h-1 bg-[#ffe600] shadow-[0_0_15px_#ffe600]" />
              <div className="absolute h-12 w-1 bg-[#ffe600] shadow-[0_0_15px_#ffe600]" />
              <div className="w-3 h-3 rounded-full bg-white shadow-[0_0_20px_#ffe600]" />
            </div>
          </div>

          {/* Bright Cyan flare on '2.0' LED Box */}
          <div className="absolute bottom-[20%] right-[38%] pointer-events-none animate-flare-pulse" style={{ animationDelay: '2s' }}>
            <div className="relative w-6 h-6 flex items-center justify-center">
              <div className="absolute w-6 h-0.5 bg-[#00f0ff] shadow-[0_0_10px_#00f0ff]" />
              <div className="absolute h-6 w-0.5 bg-[#00f0ff] shadow-[0_0_10px_#00f0ff]" />
              <div className="w-2 h-2 rounded-full bg-white shadow-[0_0_10px_#00f0ff]" />
            </div>
          </div>

          {/* 3. Electric Pulse Running Along Cables (Bottom Circuit Glint) */}
          <div className="absolute bottom-4 left-6 right-6 h-1 bg-gradient-to-r from-transparent via-[#00f0ff] to-transparent opacity-75 blur-[1px] animate-electric-pulse pointer-events-none" />

          {/* 4. Cyber Scanlines Overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%)] bg-[size:100%_4px] pointer-events-none opacity-30" />
        </div>

        {/* Bottom Banner Status Badge */}
        <div className="px-4 py-2.5 bg-black/60 backdrop-blur-md border-t border-white/10 flex items-center justify-between text-xs font-mono-cyber">
          <div className="flex items-center gap-2 text-[#00f0ff] font-bold">
            <span className="w-2 h-2 rounded-full bg-[#00f0ff] animate-ping" />
            <span className="tracking-wider uppercase text-[11px] sm:text-xs">METANOIA 2.0 • EDICIÓN OFICIAL</span>
          </div>
          <span className="text-[10px] sm:text-xs text-[#ffe600] font-mono-cyber font-bold tracking-widest uppercase flex items-center gap-1">
            <Zap className="w-3.5 h-3.5 text-[#ffe600]" /> SISTEMA ACTIVO
          </span>
        </div>
      </div>
    </div>
  );
};
