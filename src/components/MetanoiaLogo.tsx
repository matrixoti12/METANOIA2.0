import React from 'react';

interface MetanoiaLogoProps {
  className?: string;
  showText?: boolean;
  year?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const MetanoiaLogo: React.FC<MetanoiaLogoProps> = ({
  className = '',
  showText = true,
  year,
  size = 'md',
}) => {
  const iconSize = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8 sm:w-9 sm:h-9',
    lg: 'w-10 h-10 sm:w-12 sm:h-12',
  }[size];

  const textSize = {
    sm: 'text-sm sm:text-base',
    md: 'text-base sm:text-lg',
    lg: 'text-xl sm:text-2xl',
  }[size];

  return (
    <div className={`inline-flex items-center gap-2.5 sm:gap-3 select-none ${className}`}>
      {/* Stylized Geometric Ribbon "M" Logo */}
      <div className={`relative ${iconSize} flex-shrink-0 flex items-center justify-center`}>
        <svg
          viewBox="0 0 40 40"
          className="w-full h-full drop-shadow-[0_0_10px_rgba(255,0,127,0.7)]"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="mGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="50%" stopColor="#ff007f" />
              <stop offset="100%" stopColor="#7928ca" />
            </linearGradient>
            <linearGradient id="mGrad2" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#00f0ff" />
              <stop offset="100%" stopColor="#ff00aa" />
            </linearGradient>
          </defs>

          {/* Outer geometric M shape */}
          <path
            d="M 6 34 L 6 8 L 14 19 L 20 27 L 26 19 L 34 8 L 34 34"
            stroke="url(#mGrad1)"
            strokeWidth="3.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Inner faceted geometric strokes */}
          <path
            d="M 10 30 L 10 14 L 17 23 L 20 27 L 23 23 L 30 14 L 30 30"
            stroke="url(#mGrad2)"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.85"
          />

          {/* Top apex dots */}
          <circle cx="6" cy="8" r="1.5" fill="#00f0ff" />
          <circle cx="34" cy="8" r="1.5" fill="#00f0ff" />
          <circle cx="20" cy="27" r="1.8" fill="#ffe600" />
        </svg>
      </div>

      {/* Brand Text */}
      {showText && (
        <div className="flex items-center gap-1.5 sm:gap-2">
          <span className={`font-cyber-heavy tracking-wider text-white ${textSize} leading-none`}>
            METANOIA
          </span>
          {year && (
            <span className="font-cyber-heavy text-[#ff007f] text-sm sm:text-base tracking-wider leading-none drop-shadow-[0_0_8px_rgba(255,0,127,0.7)]">
              {year}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
