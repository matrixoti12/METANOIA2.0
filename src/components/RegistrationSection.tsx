import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Lock,
  CheckCircle2,
  Sparkles,
  User,
  Send,
  Share2,
  Settings,
  X,
  Trophy,
  Gamepad2,
  Calendar,
  Clock,
  MapPin,
  Flame,
} from 'lucide-react';
import { BlurText } from './BlurText';
import {
  submitToGoogleSheets,
  getGoogleSheetsUrl,
  setGoogleSheetsUrl,
  getGameHighScores,
  MetanoiaRecord,
} from '../services/googleSheets';
import { UserProfile } from '../hooks/useUserProfile';
import { playCyberClick, playNeonChime } from '../utils/audio';

interface RegistrationSectionProps {
  userProfile?: UserProfile | null;
  onProfileUpdate?: (profileData: Partial<UserProfile>) => void;
}

export const RegistrationSection: React.FC<RegistrationSectionProps> = ({
  userProfile,
  onProfileUpdate,
}) => {
  // Form State: Únicamente Nombre y Oración Incógnita
  const [fullName, setFullName] = useState(userProfile?.name || '');
  const [prayerRequest, setPrayerRequest] = useState('');

  // Puntajes de los 4 juegos
  const [gameScores, setGameScores] = useState({
    crossword: 0,
    trivia: 0,
    memory: 0,
    wordsearch: 0,
    total: 0,
  });

  // UI status
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<{
    isDemo?: boolean;
    puntajeTotal: number;
  } | null>(null);

  // Settings Modal State
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [configUrl, setConfigUrl] = useState('');
  const [configSavedNotice, setConfigSavedNotice] = useState(false);
  const [currentSheetsUrl, setCurrentSheetsUrl] = useState('');

  useEffect(() => {
    if (userProfile?.name && !fullName) {
      setFullName(userProfile.name);
    }
    const scores = getGameHighScores();
    setGameScores(scores);

    const url = getGoogleSheetsUrl();
    setCurrentSheetsUrl(url);
    setConfigUrl(url);

    // Actualizar puntajes periódicamente por si juega en la sección de juegos
    const interval = setInterval(() => {
      setGameScores(getGameHighScores());
    }, 2500);
    return () => clearInterval(interval);
  }, [userProfile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) return;

    setIsSubmitting(true);
    playCyberClick('confirm');

    const currentScores = getGameHighScores();

    const payload: MetanoiaRecord = {
      nombre: fullName.trim(),
      oracionIncognita: prayerRequest.trim(),
      puntajeTotal: currentScores.total,
    };

    const res = await submitToGoogleSheets(payload);

    if (onProfileUpdate) {
      onProfileUpdate({
        name: fullName.trim(),
        isRegistered: true,
      });
    }

    playNeonChime();
    setSubmissionResult({
      isDemo: res.isDemo,
      puntajeTotal: currentScores.total,
    });
    setIsSubmitted(true);
    setIsSubmitting(false);
  };

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    setGoogleSheetsUrl(configUrl.trim());
    setCurrentSheetsUrl(configUrl.trim());
    setConfigSavedNotice(true);
    setTimeout(() => {
      setConfigSavedNotice(false);
      setShowConfigModal(false);
    }, 1500);
  };

  const resetForm = () => {
    setIsSubmitted(false);
    setSubmissionResult(null);
    setPrayerRequest('');
    setGameScores(getGameHighScores());
  };

  const shareTicketWhatsapp = () => {
    if (!submissionResult) return;
    const text = encodeURIComponent(
      `¡Ya estoy registrado para METANOIA 2026 // RELOAD! 🔥\n` +
      `Participante: ${fullName}\n` +
      `Mi Récord en los Juegos: ${submissionResult.puntajeTotal} PTS 🎮\n` +
      `Sábado 28 de Noviembre · 6:00 PM\n` +
      `Iglesia Pacto y Bendición, Guazapa.\n` +
      `¡Acompáñanos!`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  return (
    <section id="registro" className="relative py-20 px-4 sm:px-8 max-w-4xl mx-auto z-20">
      {/* Glow ambiental decorativo */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[480px] h-[480px] bg-gradient-to-tr from-[#7022b8]/35 via-[#b01cc6]/20 to-[#00f0ff]/15 rounded-full blur-[100px] pointer-events-none -z-10" />

      {/* Cabecera */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-[#c3a7ff]/30 backdrop-blur-md mb-3">
          <Sparkles className="w-4 h-4 text-[#00f0ff] animate-pulse" />
          <span className="font-cyber text-xs tracking-[0.2em] text-[#e4c5ff] font-semibold uppercase">
            REGISTRO OFICIAL EN GOOGLE SHEETS
          </span>
        </div>

        <BlurText
          text="REGISTRO & ORACIÓN INCÓGNITA"
          className="section-heading text-white justify-center text-center"
        />

        <p className="font-body text-purple-200/90 text-sm sm:text-base max-w-xl mx-auto mt-3">
          Ingresa tu nombre, déjanos tu motivo de oración confidencial y registra tus mejores puntajes de los minijuegos en nuestra hoja de cálculo.
        </p>
      </div>

      {/* Formulario Glassmorphism */}
      <div className="content-surface p-6 sm:p-10 relative overflow-hidden border border-[#c3a7ff]/30">
        
        {!isSubmitted ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* 1. CAMPO: NOMBRE DE LA PERSONA */}
            <div>
              <label className="block text-xs font-cyber tracking-wider uppercase text-purple-200 mb-2">
                1. Nombre de la Persona que se Registra <span className="text-[#ff007f]">*</span>
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-purple-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Tu nombre y apellido"
                  className="w-full bg-[#170526]/80 border border-[#c3a7ff]/30 rounded-xl py-3.5 pl-11 pr-4 text-white text-sm focus:outline-none focus:border-[#00f0ff] focus:ring-1 focus:ring-[#00f0ff] transition-all placeholder:text-white/30"
                />
              </div>
            </div>

            {/* 2. CAMPO: ORACIÓN INCÓGNITA */}
            <div className="p-4 sm:p-5 rounded-2xl bg-[#140224]/80 border border-[#c3a7ff]/25 space-y-3">
              <div className="flex items-center justify-between gap-2 border-b border-[#c3a7ff]/15 pb-2.5">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-[#b01cc6]/30 text-[#f4b6ff]">
                    <Lock className="w-4 h-4" />
                  </div>
                  <span className="font-cyber text-sm font-bold text-white tracking-wide">
                    2. ¿Por qué quieres que oremos por vos? (Oración Incógnita)
                  </span>
                </div>
                <span className="text-[10px] font-cyber uppercase tracking-wider bg-[#ff007f]/20 text-[#ff007f] border border-[#ff007f]/30 px-2.5 py-0.5 rounded-full font-bold">
                  100% Confidencial
                </span>
              </div>

              <textarea
                rows={4}
                value={prayerRequest}
                onChange={(e) => setPrayerRequest(e.target.value)}
                placeholder="Escribe tu motivo de oración con toda confianza (salud, familia, ansiedad, una prueba difícil, agradecimiento...). Es una oración incógnita: oraremos por ella en secreto."
                className="w-full bg-[#1c0036]/90 border border-[#c3a7ff]/30 rounded-xl p-3.5 text-white text-sm focus:outline-none focus:border-[#00f0ff] focus:ring-1 focus:ring-[#00f0ff] transition-all placeholder:text-white/35 resize-none leading-relaxed"
              />

              <p className="text-[11px] text-purple-300/80 italic font-body">
                «Tu Padre que ve en lo secreto te recompensará en público» — Mateo 6:6
              </p>
            </div>

            {/* 3. MEJORES PUNTAJES TOTALES DE LOS JUEGOS */}
            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#1f0336]/80 via-[#260542]/80 to-[#120023]/80 border border-[#00f0ff]/30">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-[#ffe600]" />
                  <span className="font-cyber text-sm font-bold text-white uppercase tracking-wider">
                    3. Puntaje Total en los Juegos
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-[#00f0ff] bg-black/40 px-3 py-1 rounded-full border border-[#00f0ff]/30">
                  <Flame className="w-3.5 h-3.5 text-[#ff007f]" />
                  <span>TOTAL: {gameScores.total} PTS</span>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
                <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                  <span className="text-purple-300 block text-[10px] font-cyber uppercase">1. Crucigrama</span>
                  <span className="font-mono text-sm font-bold text-white">{gameScores.crossword}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                  <span className="text-purple-300 block text-[10px] font-cyber uppercase">2. Trivia</span>
                  <span className="font-mono text-sm font-bold text-white">{gameScores.trivia}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                  <span className="text-purple-300 block text-[10px] font-cyber uppercase">3. Parejas</span>
                  <span className="font-mono text-sm font-bold text-white">{gameScores.memory}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                  <span className="text-purple-300 block text-[10px] font-cyber uppercase">4. Sopa Letras</span>
                  <span className="font-mono text-sm font-bold text-white">{gameScores.wordsearch}</span>
                </div>
              </div>

              <div className="mt-3 flex flex-col sm:flex-row items-center justify-between gap-1.5 text-[11px] text-purple-300/80">
                <span>Juega 1, 2, 3 o los 4; tus puntos se acumulan y sincronizan en vivo en Google Sheets.</span>
                <a href="#minijuegos" className="text-[#00f0ff] hover:underline font-cyber inline-flex items-center gap-1">
                  <Gamepad2 className="w-3 h-3" /> Jugar minijuegos
                </a>
              </div>
            </div>

            {/* BOTÓN ENVIAR */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting || !fullName.trim()}
                className="w-full py-4 rounded-xl font-cyber text-sm font-bold uppercase tracking-wider text-white bg-gradient-to-r from-[#b01cc6] via-[#ff007f] to-[#00f0ff] hover:opacity-95 active:scale-[0.99] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_25px_rgba(255,0,127,0.4)] flex items-center justify-center gap-2 cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Guardando en Google Sheets...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Registrarme & Guardar en Google Sheets</span>
                  </>
                )}
              </button>
            </div>
          </form>
        ) : (
          /* Pantalla de Confirmación */
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-6 space-y-6"
          >
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#00f0ff] to-[#ff007f] p-0.5 mx-auto flex items-center justify-center shadow-[0_0_30px_rgba(0,240,255,0.5)]">
              <div className="w-full h-full bg-[#1e0735] rounded-full flex items-center justify-center">
                <CheckCircle2 className="w-9 h-9 text-[#00f0ff]" />
              </div>
            </div>

            <div>
              <span className="font-cyber text-xs uppercase tracking-[0.2em] text-[#00f0ff] font-bold block mb-1">
                REGISTRO & ORACIÓN GUARDADOS
              </span>
              <h3 className="text-2xl sm:text-3xl font-cyber-heavy text-white">
                ¡Registrado con éxito, {fullName}!
              </h3>
              <p className="text-sm text-purple-200/90 font-body max-w-lg mx-auto mt-2">
                Tu nombre, tu oración incógnita y tus puntajes ({submissionResult?.puntajeTotal} pts) ya están anotados en la hoja de Google Sheets.
              </p>
            </div>

            {/* Tarjeta de Confirmación de Asistencia */}
            <div className="max-w-md mx-auto bg-gradient-to-br from-[#240643] to-[#120023] border border-[#c3a7ff]/40 rounded-2xl p-6 text-left relative overflow-hidden shadow-[0_15px_35px_rgba(0,0,0,0.6)]">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#ff007f]/20 rounded-full blur-2xl pointer-events-none" />
              
              <div className="border-b border-[#c3a7ff]/20 pb-3 mb-4">
                <span className="font-cyber text-[10px] tracking-[0.2em] text-[#f4b6ff] uppercase font-bold block">
                  REGISTRO METANOIA 2026 // RELOAD
                </span>
                <div className="text-lg font-cyber-heavy text-white">IGLESIA PACTO Y BENDICIÓN</div>
              </div>

              <div className="space-y-2.5 text-xs font-body text-purple-100">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-[#c3a7ff]" />
                  <span>
                    Nombre: <strong className="text-white text-sm">{fullName}</strong>
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-[#ffe600]" />
                  <span>
                    Puntaje Total en Juegos:{' '}
                    <strong className="text-[#00f0ff] font-mono text-sm">
                      {submissionResult?.puntajeTotal} PTS
                    </strong>
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[#c3a7ff]" />
                  <span>Sábado 28 de Noviembre 2026</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#c3a7ff]" />
                  <span>06:00 PM</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#c3a7ff]" />
                  <span>Guazapa, El Salvador</span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-[#c3a7ff]/20 flex items-center gap-2 text-[11px] text-[#f4b6ff] font-cyber">
                <Lock className="w-3.5 h-3.5 text-[#00f0ff]" />
                <span>Oración guardada de forma incógnita y confidencial.</span>
              </div>
            </div>

            {/* Acciones */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                onClick={shareTicketWhatsapp}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white font-cyber text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-[0_0_15px_rgba(37,211,102,0.4)]"
              >
                <Share2 className="w-4 h-4" />
                <span>Compartir en WhatsApp</span>
              </button>

              <button
                onClick={resetForm}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-white/10 hover:bg-white/15 text-white font-cyber text-xs font-bold uppercase tracking-wider transition-all cursor-pointer border border-[#c3a7ff]/30"
              >
                <span>Registrar otra persona</span>
              </button>
            </div>
          </motion.div>
        )}

        {/* Pie: Estado de conexión Google Sheets & Botón de Ajustes */}
        <div className="mt-8 pt-4 border-t border-[#c3a7ff]/20 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-purple-300/80">
          <div className="flex items-center gap-2">
            <div className={`w-2.5 h-2.5 rounded-full ${currentSheetsUrl ? 'bg-[#00ff9d] animate-pulse' : 'bg-yellow-400'}`} />
            <span>
              {currentSheetsUrl
                ? 'Conectado a Google Sheets'
                : 'Modo local activo (Configura la URL de tu hoja)'}
            </span>
          </div>

          <button
            onClick={() => {
              playCyberClick('soft');
              setShowConfigModal(true);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-purple-200 hover:text-white transition-all cursor-pointer border border-[#c3a7ff]/20 text-[11px] font-cyber"
          >
            <Settings className="w-3.5 h-3.5 text-[#00f0ff]" />
            <span>⚙️ Configurar Google Sheets</span>
          </button>
        </div>
      </div>

      {/* MODAL PARA CONFIGURAR LA URL DE GOOGLE SHEETS */}
      <AnimatePresence>
        {showConfigModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#10011f]/90 backdrop-blur-md p-4"
          >
            <div className="content-surface max-w-lg w-full p-6 sm:p-8 relative border border-[#c3a7ff]/40 shadow-[0_20px_50px_rgba(0,0,0,0.8)]">
              <button
                onClick={() => setShowConfigModal(false)}
                className="absolute top-4 right-4 p-2 text-purple-300 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2.5 mb-4">
                <div className="p-2.5 rounded-xl bg-[#7022b8]/50 text-[#00f0ff]">
                  <Settings className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-cyber font-bold text-white text-lg">
                    Conectar Google Sheets
                  </h3>
                  <span className="text-xs text-purple-300">
                    URL de la Aplicación Web de Apps Script
                  </span>
                </div>
              </div>

              <p className="text-xs text-purple-200/80 leading-relaxed font-body mb-4">
                Pega aquí la URL generada al Implementar tu Google Apps Script (termina en <code className="text-[#00f0ff] bg-purple-950 px-1 py-0.5 rounded">/exec</code>).
              </p>

              <form onSubmit={handleSaveConfig} className="space-y-4">
                <div>
                  <label className="block text-[11px] font-cyber uppercase tracking-wider text-purple-200 mb-1">
                    URL de la Aplicación Web de Google Sheets
                  </label>
                  <input
                    type="url"
                    value={configUrl}
                    onChange={(e) => setConfigUrl(e.target.value)}
                    placeholder="https://script.google.com/macros/s/AKfycb.../exec"
                    className="w-full bg-[#150125] border border-[#c3a7ff]/40 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#00f0ff]"
                  />
                </div>

                {configSavedNotice && (
                  <div className="p-2.5 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>¡URL guardada exitosamente!</span>
                  </div>
                )}

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowConfigModal(false)}
                    className="px-4 py-2 rounded-xl text-xs font-cyber text-purple-300 hover:text-white cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl text-xs font-cyber font-bold text-white bg-gradient-to-r from-[#b01cc6] to-[#00f0ff] hover:opacity-90 cursor-pointer shadow-[0_0_15px_rgba(0,240,255,0.4)]"
                  >
                    Guardar Conexión
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
