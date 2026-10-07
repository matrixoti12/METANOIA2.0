import React from 'react';

interface MetanoiaLogoProps {
  className?: string;
  showText?: boolean;
  year?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  variant?: 'full' | 'emblem';
}

export const MetanoiaLogo: React.FC<MetanoiaLogoProps> = ({
  className = '',
  size = 'md',
  variant = 'full',
}) => {
  const heightClasses = {
    xs: 'h-6 sm:h-7',
    sm: 'h-8 sm:h-9',
    md: 'h-10 sm:h-12',
    lg: 'h-14 sm:h-16',
    xl: 'h-20 sm:h-24',
    '2xl': 'h-28 sm:h-36',
  }[size];

  const logoSrc = variant === 'emblem' 
    ? '/assets/metanoia-emblem-square.png' 
    : '/assets/metanoia-logo-refinado.svg';

  return (
    <div className={`inline-flex items-center select-none ${className}`}>
      {/* Refined Vector Logo with vista-previa cosmic aura */}
      <div className="relative flex items-center justify-center flex-shrink-0 group">
        <div className="absolute inset-0 bg-[#b01cc6]/35 rounded-2xl blur-lg opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300" />
        <img
          src={logoSrc}
          alt="METANOIA 2026 Logo Oficial"
          className={`${heightClasses} w-auto object-contain relative z-10 filter drop-shadow-[0_0_12px_rgba(228,197,255,0.7)] drop-shadow-[0_0_28px_rgba(176,28,198,0.45)] transition-all duration-300 group-hover:scale-105`}
          onError={(e) => {
            const target = e.currentTarget as HTMLImageElement;
            if (!target.src.endsWith('/assets/metanoia-logo-official-hd.png')) {
              target.src = '/assets/metanoia-logo-official-hd.png';
            }
          }}
        />
      </div>
    </div>
  );
};
