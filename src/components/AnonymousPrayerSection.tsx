import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HeartHandshake,
  Lock,
  Send,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';
import { BlurText } from './BlurText';
import { submitToGoogleSheets } from '../services/googleSheets';
import { playCyberClick, playNeonChime } from '../utils/audio';

export const AnonymousPrayerSection: React.FC = () => {
  const [prayer, setPrayer] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPrayer = prayer.trim();
    if (!cleanPrayer) return;

    setIsSubmitting(true);
    playCyberClick('confirm');

    // Se envía exclusivamente la oración, SIN nombre ni ningún dato que identifique a la persona
    await submitToGoogleSheets({
      nombre: '',
      oracionIncognita: cleanPrayer,
      puntajeTotal: 0,
    });

    playNeonChime();
    setIsSent(true);
    setIsSubmitting(false);
  };

  const handleReset = () => {
    setPrayer('');
    setIsSent(false);
  };

  return (
    <section id="oracion" className="relative py-20 px-4 sm:px-8 max-w-3xl mx-auto z-20">
      {/* Resplandor cósmico ambiental */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] bg-gradient-to-tr from-[#7022b8]/35 via-[#b01cc6]/20 to-[#00f0ff]/15 rounded-full blur-[100px] pointer-events-none -z-10" />

      {/* Cabecera */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-[#c3a7ff]/30 backdrop-blur-md mb-3">
          <Lock className="w-4 h-4 text-[#00f0ff]" />
          <span className="font-cyber text-xs tracking-[0.2em] text-[#e4c5ff] font-semibold uppercase">
            ALTAR DE INTERCESIÓN 100% ANÓNIMO
          </span>
        </div>

        <BlurText
          text="¿POR QUÉ QUIERES QUE OREMOS POR VOS?"
          className="section-heading text-white justify-center text-center text-2xl sm:text-3xl md:text-4xl"
        />

        <p className="font-body text-purple-200/90 text-sm sm:text-base max-w-xl mx-auto mt-3">
          Esta oración es <strong className="text-[#00f0ff]">completamente incógnita</strong>. No te pedimos nombre ni ningún dato personal; llega directo al equipo de intercesión para orar en secreto por ti.
        </p>
      </div>

      {/* Caja de Oración */}
      <div className="content-surface p-6 sm:p-8 relative overflow-hidden border border-[#c3a7ff]/30">
        <AnimatePresence mode="wait">
          {!isSent ? (
            <motion.form
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onSubmit={handleSubmit}
              className="space-y-5"
            >
              <div className="flex items-center justify-between gap-2 border-b border-[#c3a7ff]/20 pb-3">
                <div className="flex items-center gap-2 text-white font-cyber text-sm font-bold">
                  <HeartHandshake className="w-5 h-5 text-[#f4b6ff]" />
                  <span>Escribe tu petición aquí</span>
                </div>
                <span className="inline-flex items-center gap-1 text-[11px] font-cyber text-[#00ff9d] bg-[#00ff9d]/10 border border-[#00ff9d]/30 px-2.5 py-0.5 rounded-full font-bold">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Sin Nombre · Total Secreto
                </span>
              </div>

              <div>
                <textarea
                  rows={5}
                  required
                  value={prayer}
                  onChange={(e) => setPrayer(e.target.value)}
                  placeholder="Cuéntanos qué carga estás pasando (salud, tu familia, paz en tu mente, tu corazón, tus estudios, un ser querido...). Dios conoce tu corazón y nosotros nos ponemos de acuerdo en oración contigo."
                  className="w-full bg-[#170526]/80 border border-[#c3a7ff]/30 rounded-2xl p-4 text-white text-sm focus:outline-none focus:border-[#00f0ff] focus:ring-1 focus:ring-[#00f0ff] transition-all placeholder:text-white/35 resize-none leading-relaxed"
                />
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
                <p className="text-[11px] text-purple-300/80 italic font-body text-center sm:text-left">
                  «Tu Padre que ve en lo secreto te recompensará en público.» — Mateo 6:6
                </p>

                <button
                  type="submit"
                  disabled={isSubmitting || !prayer.trim()}
                  className="w-full sm:w-auto px-7 py-3.5 rounded-xl font-cyber text-xs font-bold uppercase tracking-wider text-white bg-gradient-to-r from-[#b01cc6] via-[#ff007f] to-[#00f0ff] hover:opacity-95 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(255,0,127,0.4)] flex items-center justify-center gap-2 cursor-pointer shrink-0"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Guardando en secreto...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Enviar Oración Incógnita</span>
                    </>
                  )}
                </button>
              </div>
            </motion.form>
          ) : (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-6 space-y-5"
            >
              <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-[#00f0ff] to-[#ff007f] p-0.5 mx-auto flex items-center justify-center shadow-[0_0_25px_rgba(0,240,255,0.5)]">
                <div className="w-full h-full bg-[#1e0735] rounded-full flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8 text-[#00f0ff]" />
                </div>
              </div>

              <div>
                <span className="font-cyber text-xs uppercase tracking-[0.2em] text-[#00f0ff] font-bold block mb-1">
                  ORACIÓN GUARDADA EN SECRETO
                </span>
                <h3 className="text-xl sm:text-2xl font-cyber-heavy text-white">
                  ¡Tu petición ya está en el altar de oración!
                </h3>
                <p className="text-xs sm:text-sm text-purple-200/90 font-body max-w-md mx-auto mt-2 leading-relaxed">
                  Se ha guardado de forma totalmente anónima en nuestra hoja de intercesión. Estaremos orando por ti creyendo en la respuesta de Dios.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-purple-900/30 border border-[#c3a7ff]/20 max-w-md mx-auto text-xs italic text-purple-200">
                «Por nada estéis afanosos, sino sean conocidas vuestras peticiones delante de Dios en toda oración y ruego, con acción de gracias.» — Filipenses 4:6
              </div>

              <div className="pt-2">
                <button
                  onClick={handleReset}
                  className="px-6 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-cyber text-xs font-bold uppercase tracking-wider transition-all cursor-pointer border border-[#c3a7ff]/30"
                >
                  Enviar otra oración
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};
