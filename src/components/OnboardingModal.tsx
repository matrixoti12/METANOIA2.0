import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BlurText } from './BlurText';
import { MetanoiaLogo } from './MetanoiaLogo';

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
          <div className="content-surface max-w-md w-full p-8 relative overflow-hidden">

            <div className="text-center mb-8 relative z-10 flex flex-col items-center">
              <MetanoiaLogo size="md" className="mb-4" />
              <span className="font-body text-[#c4b5fd] text-sm block mb-2">
                Bienvenido a Metanoia
              </span>
              <BlurText
                text="¿Cómo te llamas?"
                className="text-2xl sm:text-3xl font-cyber-heavy text-white mb-2 justify-center"
                delay={0.2}
              />
              <p className="text-sm text-purple-200 font-body mt-4">
                Escribe tu nombre para personalizar tu experiencia y tus fotos del evento.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="relative z-10 flex flex-col gap-4">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Tu nombre"
                aria-label="Tu nombre"
                autoComplete="given-name"
                className="w-full border text-white p-4 font-body text-center transition-colors placeholder:text-white/40"
                autoFocus
                maxLength={25}
              />
              
              <button
                type="submit"
                disabled={name.trim().length < 2}
                className="event-action mt-4 bg-gradient-to-r from-[#ff007f] to-[#00f0ff] text-white font-cyber font-bold py-4 rounded-lg tracking-widest uppercase hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(255,0,127,0.3)]"
              >
                Entrar a Metanoia
              </button>
            </form>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
