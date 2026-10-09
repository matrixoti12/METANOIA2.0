import React, { useState } from 'react';
import {
  X,
  Download,
  Share2,
  Calendar,
  MapPin,
  Sparkles,
  Music,
  Check,
  Maximize2,
} from 'lucide-react';
import { playCyberClick, playCyberHover, playNeonChime } from '../utils/audio';

interface OfficialPosterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OfficialPosterModal: React.FC<OfficialPosterModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleShare = () => {
    playCyberClick();
    const eventDetails = `🔥 ¡METANOIA 2026! Gran Evento Juvenil 🔥\n\n🎤 EN LA MÚSICA Y PALABRA: Pablo Rosales\n📅 FECHA: 28 de Noviembre de 2026\n⏰ HORA: 06:00 PM\n📍 LUGAR: Iglesia Pacto y Bendición (IGLEPACBEN AD), Guazapa\n✨ ENTRADA TOTALMENTE LIBRE\n\n«Transformaos por medio de la renovación de vuestro entendimiento» — Romanos 12:2\n¡No te lo pierdas!`;

    if (navigator.share) {
      navigator.share({
        title: 'METANOIA 2026 • Pablo Rosales',
        text: eventDetails,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(eventDetails);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleDownload = () => {
    playCyberClick();
    const link = document.createElement('a');
    link.href = '/assets/metanoia-poster-pablo-rosales.jpg';
    link.download = 'Metanoia-2026-Pablo-Rosales-Oficial.jpg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-xl animate-fade-in"
      onClick={onClose}
    >
      <div
        className="content-surface relative w-full max-w-lg overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Bar */}
        <div className="flex items-center justify-between p-3.5 sm:p-4 border-b border-purple-500/30 bg-[#160736]/80 backdrop-blur-md">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#140026] border border-purple-500/50 shadow-[0_0_12px_rgba(168,85,247,0.5)] flex items-center justify-center p-1">
              <img
                src="/assets/metanoia-emblem-square.png"
                alt="Metanoia Logo"
                className="w-full h-full object-contain filter drop-shadow-[0_0_6px_#c77dff]"
              />
            </div>
            <div>
              <span className="text-[10px] font-mono-cyber font-bold tracking-[0.2em] text-[#c084fc] uppercase block">
                AFICHE OFICIAL 2026
              </span>
              <h3 className="font-cyber text-sm sm:text-base text-white font-bold leading-none">
                METANOIA 2026 • PABLO ROSALES
              </h3>
            </div>
          </div>

          <button
            onClick={() => {
              playCyberClick();
              onClose();
            }}
            onMouseEnter={() => playCyberHover('subtle')}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/15 text-purple-300 hover:text-white transition-colors cursor-pointer min-w-[40px] min-h-[40px] flex items-center justify-center"
            aria-label="Cerrar modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Poster Image Container */}
        <div className="relative overflow-y-auto p-3 sm:p-4 flex-1 flex flex-col items-center">
          <div className="relative rounded-2xl overflow-hidden border border-purple-500/40 shadow-2xl group w-full max-w-[400px]">
            <img
              src="/assets/metanoia-poster-pablo-rosales.jpg"
              alt="Afiche Oficial Metanoia 2026 con Pablo Rosales"
              className="w-full h-auto object-cover rounded-2xl transition-transform duration-300 group-hover:scale-[1.02]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0e0422]/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
          </div>

          {/* Quick Info Capsule */}
          <div className="w-full max-w-[400px] mt-3 p-3 rounded-2xl bg-[#140632]/90 border border-purple-500/30 text-xs font-mono-cyber space-y-2">
            <div className="flex items-center justify-between text-white font-cyber font-bold">
              <span className="flex items-center gap-1.5 text-[#00f0ff]">
                <Calendar className="w-3.5 h-3.5" /> 28 NOVIEMBRE 2026
              </span>
              <span className="text-[#c084fc]">06:00 PM</span>
            </div>
            <div className="flex items-center gap-1.5 text-purple-200">
              <Music className="w-3.5 h-3.5 text-[#f472b6]" />
              <span>En la música y palabra: <strong>Pablo Rosales</strong></span>
            </div>
            <div className="flex items-center gap-1.5 text-purple-300/90">
              <MapPin className="w-3.5 h-3.5 text-[#ffe600]" />
              <span>Iglepacben AD Guazapa • Entrada Libre</span>
            </div>
          </div>
        </div>

        {/* Action Buttons Footer */}
        <div className="p-3.5 sm:p-4 border-t border-purple-500/30 bg-[#160736]/90 flex items-center gap-2.5">
          <button
            onClick={handleDownload}
            onMouseEnter={() => playCyberHover('crisp')}
            className="event-action flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#9333ea] to-[#7b2cbf] hover:from-[#a855f7] hover:to-[#9333ea] text-white font-cyber text-xs font-bold uppercase transition-all shadow-[0_0_15px_rgba(168,85,247,0.4)] border border-purple-400 cursor-pointer min-h-[44px]"
          >
            <Download className="w-4 h-4" />
            <span>Descargar Afiche</span>
          </button>

          <button
            onClick={handleShare}
            onMouseEnter={() => playCyberHover('subtle')}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 text-white font-cyber text-xs font-bold uppercase transition-all border border-white/20 cursor-pointer min-h-[44px]"
          >
            {copied ? <Check className="w-4 h-4 text-[#00ff9d]" /> : <Share2 className="w-4 h-4 text-[#00f0ff]" />}
            <span>{copied ? '¡Copiado!' : 'Compartir'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
