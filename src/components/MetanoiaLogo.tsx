import React from 'react';

interface MetanoiaLogoProps {
  className?: string;
  showText?: boolean;
  year?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const MetanoiaLogo: React.FC<MetanoiaLogoProps> = ({
  className = '',
  showText = true,
  year = '2026',
  size = 'md',
}) => {
  const iconDimensions = {
    sm: 'h-7 sm:h-8',
    md: 'h-9 sm:h-11',
    lg: 'h-12 sm:h-14',
    xl: 'h-16 sm:h-20',
  }[size];

  return (
    <div className={`inline-flex items-center gap-2.5 sm:gap-3 select-none ${className}`}>
      {/* Official High-Resolution Logo from event asset with glowing ambient aura */}
      <div className={`relative flex items-center justify-center flex-shrink-0 group`}>
        <div className="absolute inset-0 bg-[#a855f7]/30 rounded-full blur-md opacity-70 group-hover:opacity-100 transition-opacity" />
        <img
          src="/assets/metanoia-logo-official.png"
          alt="Metanoia 2026 Logo"
          className={`${iconDimensions} w-auto object-contain relative z-10 drop-shadow-[0_0_12px_rgba(168,85,247,0.7)] transition-transform duration-300 group-hover:scale-105`}
          onError={(e) => {
            // Graceful fallback to CSS vector if image fails to load
            (e.currentTarget as HTMLElement).style.display = 'none';
            const fallback = e.currentTarget.parentElement?.querySelector('.logo-vector-fallback');
            if (fallback) (fallback as HTMLElement).classList.remove('hidden');
          }}
        />

        {/* Fallback Vector */}
        <div className="logo-vector-fallback hidden flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#7b2cbf] to-[#c77dff] p-[2px] shadow-[0_0_15px_#a855f7]">
            <div className="w-full h-full bg-[#140026] rounded-full flex items-center justify-center text-white font-cyber text-xs">
              M
            </div>
          </div>
          {showText && (
            <span className="font-cyber font-extrabold tracking-wider text-white text-base">
              metanoia <span className="text-[#a855f7]">{year}</span>
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
