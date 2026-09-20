import React from 'react';

interface ChurchLogoProps {
  className?: string;
  variant?: 'emblem' | 'full' | 'horizontal';
  glow?: boolean;
  colorScheme?: 'neon' | 'white' | 'gold' | 'cyan';
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const ChurchLogo: React.FC<ChurchLogoProps> = ({
  className = '',
  variant = 'full',
  glow = true,
  colorScheme = 'neon',
  size = 'md',
}) => {
  // Size mapping
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-20 h-20',
    xl: 'w-32 h-32 sm:w-40 sm:h-40',
  };

  // Color & Glow mapping
  const colorMap = {
    neon: 'text-[#00f0ff] drop-shadow-[0_0_12px_rgba(0,240,255,0.6)]',
    white: 'text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]',
    gold: 'text-[#ffe600] drop-shadow-[0_0_12px_rgba(255,230,0,0.6)]',
    cyan: 'text-[#00f0ff] drop-shadow-[0_0_12px_rgba(0,240,255,0.7)]',
  };

  const glowEffect = glow ? colorMap[colorScheme] : 'text-white';

  if (variant === 'emblem') {
    return (
      <div className={`relative inline-flex items-center justify-center ${className}`}>
        <svg
          viewBox="160 30 280 395"
          className={`${sizeClasses[size]} ${glowEffect} transition-all duration-300`}
          fill="none"
          stroke="currentColor"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {/* Flame - Left Wing */}
          <path d="M 278 126 C 240 180, 220 230, 235 295 C 245 330, 270 355, 305 340 C 260 320, 255 255, 282 200 C 295 170, 290 145, 278 126 Z" />
          
          {/* Flame - Central Flowing Crest */}
          <path d="M 295 62 C 285 130, 335 180, 332 235 C 330 265, 310 295, 285 320 C 300 280, 295 230, 275 185 C 265 160, 275 125, 295 62 Z" />

          {/* Flame - Right Curved Tongue */}
          <path d="M 308 42 C 300 120, 375 160, 372 230 C 370 270, 340 310, 305 340 C 322 300, 325 245, 290 190 C 275 165, 280 120, 308 42 Z" />

          {/* Cradle / Ark Curve */}
          <path
            d="M 180 340 C 180 435, 420 435, 420 340 C 390 415, 210 415, 180 340 Z"
            fill="currentColor"
            fillOpacity="0.12"
          />

          {/* Figures inside cradle */}
          {/* Left figure */}
          <circle cx="255" cy="350" r="9" />
          <path d="M 238 368 C 248 358, 255 362, 265 352" />
          <path d="M 265 352 C 275 345, 285 345, 304 340" />
          <path d="M 248 375 L 252 408 M 262 375 L 260 408" />
          <path d="M 245 368 C 245 385, 268 385, 268 368" />

          {/* Right figure */}
          <circle cx="330" cy="352" r="9" />
          <path d="M 346 370 C 336 360, 328 362, 320 352" />
          <path d="M 320 352 C 312 346, 308 346, 305 340" />
          <path d="M 324 375 L 322 408 M 336 375 L 340 408" />
          <path d="M 320 370 C 320 385, 342 385, 342 370" />

          {/* Center child figure */}
          <circle cx="292" cy="372" r="6.5" />
          <path d="M 282 382 L 278 372 M 302 382 L 306 372" />
          <path d="M 288 392 L 286 410 M 296 392 L 298 410" />
          <path d="M 284 382 C 284 395, 300 395, 300 382" />
        </svg>
      </div>
    );
  }

  if (variant === 'horizontal') {
    return (
      <div className={`flex items-center gap-3 ${className}`}>
        <svg
          viewBox="160 30 280 395"
          className="w-9 h-9 sm:w-11 sm:h-11 text-[#00f0ff] drop-shadow-[0_0_10px_rgba(0,240,255,0.7)] flex-shrink-0"
          fill="none"
          stroke="currentColor"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M 278 126 C 240 180, 220 230, 235 295 C 245 330, 270 355, 305 340 C 260 320, 255 255, 282 200 C 295 170, 290 145, 278 126 Z" />
          <path d="M 295 62 C 285 130, 335 180, 332 235 C 330 265, 310 295, 285 320 C 300 280, 295 230, 275 185 C 265 160, 275 125, 295 62 Z" />
          <path d="M 308 42 C 300 120, 375 160, 372 230 C 370 270, 340 310, 305 340 C 322 300, 325 245, 290 190 C 275 165, 280 120, 308 42 Z" />
          <path d="M 180 340 C 180 435, 420 435, 420 340 C 390 415, 210 415, 180 340 Z" fill="currentColor" fillOpacity="0.12" />
          <circle cx="255" cy="350" r="9" />
          <path d="M 238 368 C 248 358, 255 362, 265 352" />
          <path d="M 265 352 C 275 345, 285 345, 304 340" />
          <circle cx="330" cy="352" r="9" />
          <path d="M 346 370 C 336 360, 328 362, 320 352" />
          <circle cx="292" cy="372" r="6.5" />
        </svg>
        <div className="flex flex-col text-left leading-none">
          <span className="text-[9px] sm:text-[10px] tracking-[0.25em] font-mono-cyber uppercase text-purple-300/90">
            IGLESIA
          </span>
          <span className="text-xs sm:text-sm font-cyber-heavy tracking-wide text-white whitespace-nowrap">
            PACTO Y BENDICIÓN
          </span>
          <span className="text-[9px] sm:text-[10px] tracking-[0.2em] font-mono-cyber text-[#00f0ff] uppercase">
            GUAZAPA
          </span>
        </div>
      </div>
    );
  }

  // Variant 'full' (emblem + circular glow card with exact text from image)
  return (
    <div className={`flex flex-col items-center text-center ${className}`}>
      <div className="relative group">
        {/* Neon outer glow aura */}
        <div className="absolute -inset-2 rounded-full bg-gradient-to-r from-[#ff007f] via-[#ffe600] to-[#00f0ff] opacity-40 blur-lg group-hover:opacity-75 transition-opacity" />

        <div className="relative p-3 sm:p-4 rounded-3xl bg-[#140026]/90 border border-white/20 shadow-[0_0_30px_rgba(0,240,255,0.25)] flex flex-col items-center">
          <svg
            viewBox="160 30 280 395"
            className={`${sizeClasses[size]} ${glowEffect} transition-transform duration-300 group-hover:scale-105`}
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {/* Sacred Flame */}
            <path d="M 278 126 C 240 180, 220 230, 235 295 C 245 330, 270 355, 305 340 C 260 320, 255 255, 282 200 C 295 170, 290 145, 278 126 Z" />
            <path d="M 295 62 C 285 130, 335 180, 332 235 C 330 265, 310 295, 285 320 C 300 280, 295 230, 275 185 C 265 160, 275 125, 295 62 Z" />
            <path d="M 308 42 C 300 120, 375 160, 372 230 C 370 270, 340 310, 305 340 C 322 300, 325 245, 290 190 C 275 165, 280 120, 308 42 Z" />

            {/* Vessel Cradle */}
            <path
              d="M 180 340 C 180 435, 420 435, 420 340 C 390 415, 210 415, 180 340 Z"
              fill="currentColor"
              fillOpacity="0.12"
            />

            {/* Figures */}
            <circle cx="255" cy="350" r="9" />
            <path d="M 238 368 C 248 358, 255 362, 265 352" />
            <path d="M 265 352 C 275 345, 285 345, 304 340" />
            <path d="M 248 375 L 252 408 M 262 375 L 260 408" />
            <path d="M 245 368 C 245 385, 268 385, 268 368" />

            <circle cx="330" cy="352" r="9" />
            <path d="M 346 370 C 336 360, 328 362, 320 352" />
            <path d="M 320 352 C 312 346, 308 346, 305 340" />
            <path d="M 324 375 L 322 408 M 336 375 L 340 408" />
            <path d="M 320 370 C 320 385, 342 385, 342 370" />

            <circle cx="292" cy="372" r="6.5" />
            <path d="M 282 382 L 278 372 M 302 382 L 306 372" />
            <path d="M 288 392 L 286 410 M 296 392 L 298 410" />
            <path d="M 284 382 C 284 395, 300 395, 300 382" />
          </svg>

          {/* Typography from user image */}
          <div className="mt-2 text-center select-none">
            <div className="text-[10px] tracking-[0.3em] font-mono-cyber uppercase text-purple-200/90 font-light">
              IGLESIA
            </div>
            <div className="text-xs sm:text-sm font-cyber-heavy tracking-wider text-white">
              PACTO Y BENDICIÓN
            </div>
            <div className="text-[9px] sm:text-[10px] tracking-[0.25em] font-mono-cyber text-[#00f0ff] uppercase font-bold">
              GUAZAPA
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
