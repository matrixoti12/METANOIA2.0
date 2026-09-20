import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BlurText } from './BlurText';

interface OnboardingModalProps {
  isOpen: boolean;
  onComplete: (name: string) => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({ isOpen, onComplete }) => {
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim().length > 1) {
      onComplete(name.trim());
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#140026]/95 backdrop-blur-md p-4"
        >
          <div className="max-w-md w-full bg-[#1c0036] border border-[#00f0ff]/30 p-8 rounded-xl shadow-[0_0_30px_rgba(0,240,255,0.15)] relative overflow-hidden">
            {/* Cyber Accents */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#00f0ff] to-[#ff007f]" />
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#ff007f]/10 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-[#00f0ff]/10 rounded-full blur-2xl pointer-events-none" />

            <div className="text-center mb-8 relative z-10">
              <span className="font-mono-cyber text-[#00f0ff] text-xs tracking-[0.3em] uppercase block mb-2 animate-pulse">
                SYS.INIT // REGISTRO
              </span>
              <BlurText
                text="INSERTE SU NOMBRE DE OPERADOR"
                className="text-2xl sm:text-3xl font-cyber-heavy text-white mb-2 justify-center"
                delay={0.2}
              />
              <p className="text-sm text-purple-300 font-mono mt-4">
                Necesitas identificarte para obtener tu boleto virtual y acceder a la red Metanoia.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="relative z-10 flex flex-col gap-4">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="EJ. JUAN PÉREZ"
                className="w-full bg-[#140026] border-b-2 border-[#00f0ff] text-white p-4 font-mono text-center outline-none focus:border-[#ff007f] transition-colors uppercase tracking-widest placeholder:text-white/20"
                autoFocus
                maxLength={25}
              />
              
              <button
                type="submit"
                disabled={name.trim().length < 2}
                className="mt-4 bg-gradient-to-r from-[#ff007f] to-[#00f0ff] text-white font-cyber font-bold py-4 rounded-lg tracking-widest uppercase hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(255,0,127,0.3)]"
              >
                ENTRAR AL SISTEMA
              </button>
            </form>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
