import React from 'react';
import { MetanoiaLogo } from './MetanoiaLogo';
import { Facebook } from 'lucide-react';
import { playCyberClick, playCyberHover } from '../utils/audio';

export const FooterSection: React.FC = () => {
  return (
    <footer className="site-footer relative border-t border-[#c3a7ff]/20 text-purple-200 pt-8 pb-32 sm:pb-28 px-4 sm:px-8">
      <h2 className="sr-only">Esto Es Metanoia 2026</h2>
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
        {/* Left: Metanoia 2026 Brand */}
        <div>
          <MetanoiaLogo size="sm" showText={true} year="2026" />
        </div>

        {/* Center: Slogan */}
        <div className="font-cyber text-xs tracking-[0.25em] text-[#c3a7ff]/90 uppercase">
          UNA MENTE RENOVADA. UN FUTURO TRANSFORMADO.
        </div>

        <nav aria-label="Redes sociales" className="flex flex-col items-center gap-3 text-purple-200">
          <h3 className="text-sm font-medium">Visita nuestras redes sociales</h3>
          <div className="flex items-center gap-3">
          <a
            href="https://www.facebook.com/profile.php?id=100064441435571"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => playCyberClick()}
            onMouseEnter={() => playCyberHover('subtle')}
            className="p-3 rounded-xl hover:bg-white/10 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#9de9ff] transition-colors touch-manipulation min-h-[44px] flex items-center justify-center gap-2"
            aria-label="Facebook de Iglesia Pacto y Bendición (abre en otra pestaña)"
          >
            <Facebook className="w-5 h-5" aria-hidden="true" />
            <span className="text-sm">Facebook</span>
          </a>

          {/* TikTok SVG */}
          <a
            href="https://www.tiktok.com/@iglesiapactoybendicionsv?is_from_webapp=1&sender_device=pc"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => playCyberClick()}
            onMouseEnter={() => playCyberHover('subtle')}
            className="p-3 rounded-xl hover:bg-white/10 hover:text-[#9de9ff] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#9de9ff] transition-colors touch-manipulation min-h-[44px] flex items-center justify-center gap-2"
            aria-label="TikTok de Iglesia Pacto y Bendición (abre en otra pestaña)"
          >
            <svg
              className="w-5 h-5 fill-current"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
            </svg>
            <span className="text-sm">TikTok</span>
          </a>
          </div>
        </nav>
      </div>
    </footer>
  );
};

