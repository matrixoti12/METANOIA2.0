import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BlurText } from './BlurText';
import { UserProfile } from '../hooks/useUserProfile';
import eventData from '../data/eventData.json';
import { Ticket, Trophy, Key, CheckCircle, XCircle } from 'lucide-react';

interface UserDashboardProps {
  profile: UserProfile | null;
  onAddPoints: (points: number, code: string) => boolean;
}

export const UserDashboardSection: React.FC<UserDashboardProps> = ({ profile, onAddPoints }) => {
  const [secretCode, setSecretCode] = useState('');
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' | null }>({ text: '', type: null });

  if (!profile) return null;

  const handleCodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const code = secretCode.trim().toUpperCase();
    
    // @ts-ignore (We know the keys match the JSON)
    const pointsValue = eventData.secretCodes[code];

    if (pointsValue) {
      const success = onAddPoints(pointsValue, code);
      if (success) {
        setMessage({ text: `¡CÓDIGO ACEPTADO! +${pointsValue} PTS`, type: 'success' });
        setSecretCode('');
      } else {
        setMessage({ text: 'CÓDIGO YA FUE CANJEADO.', type: 'error' });
      }
    } else {
      setMessage({ text: 'CÓDIGO INVÁLIDO O EXPIRADO.', type: 'error' });
    }

    setTimeout(() => setMessage({ text: '', type: null }), 3000);
  };

  return (
    <section id="dashboard" className="relative py-20 px-4 max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <span className="font-mono-cyber text-[#00f0ff] text-xs sm:text-sm tracking-[0.2em] uppercase">
          PERFIL DE OPERADOR
        </span>
        <BlurText
          text="TU PASAPORTE METANOIA"
          className="text-4xl sm:text-5xl font-cyber-heavy text-white justify-center mt-2"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Ticket Section */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="bg-gradient-to-br from-[#1c0036] to-[#2a004d] border border-[#ff007f]/40 rounded-2xl p-8 relative overflow-hidden shadow-[0_0_30px_rgba(255,0,127,0.1)]"
        >
          <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
            <Ticket size={120} />
          </div>
          <h3 className="text-[#ff007f] font-cyber tracking-widest flex items-center gap-2 mb-2">
            <Ticket size={20} /> BOLETO VIRTUAL
          </h3>
          <p className="text-purple-300 font-mono text-sm mb-6">Muestra esto a los líderes durante los sorteos.</p>
          
          <div className="bg-[#140026] border-2 border-dashed border-[#ff007f]/50 p-6 rounded-xl text-center">
            <span className="block text-white/50 font-mono text-xs mb-2">OPERADOR: {profile.name}</span>
            <div className="font-cyber-heavy text-4xl sm:text-5xl text-white tracking-widest drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">
              {profile.ticketNumber}
            </div>
          </div>
        </motion.div>

        {/* Points Section */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="bg-gradient-to-br from-[#1c0036] to-[#2a004d] border border-[#00f0ff]/40 rounded-2xl p-8 relative shadow-[0_0_30px_rgba(0,240,255,0.1)]"
        >
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-[#00f0ff] font-cyber tracking-widest flex items-center gap-2 mb-2">
                <Trophy size={20} /> RANGO Y PUNTOS
              </h3>
              <p className="text-purple-300 font-mono text-sm">Gana dinámicas y reclama puntos.</p>
            </div>
            <div className="text-right">
              <span className="font-cyber-heavy text-4xl text-[#00f0ff] drop-shadow-[0_0_10px_rgba(0,240,255,0.4)]">
                {profile.points}
              </span>
              <span className="block font-mono text-xs text-[#00f0ff]">PTS TOTALES</span>
            </div>
          </div>

          <form onSubmit={handleCodeSubmit} className="space-y-4">
            <div className="relative">
              <Key size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-400" />
              <input
                type="text"
                value={secretCode}
                onChange={(e) => setSecretCode(e.target.value)}
                placeholder="INGRESA CÓDIGO SECRETO"
                className="w-full bg-[#140026] border border-purple-500/50 rounded-lg py-4 pl-12 pr-4 text-white font-mono text-sm focus:border-[#00f0ff] focus:outline-none uppercase"
              />
            </div>
            <button
              type="submit"
              disabled={!secretCode}
              className="w-full bg-[#00f0ff]/10 hover:bg-[#00f0ff]/20 border border-[#00f0ff]/50 text-[#00f0ff] font-cyber tracking-widest py-3 rounded-lg transition-colors"
            >
              CANJEAR CÓDIGO
            </button>
            
            {message.type && (
              <div className={`flex items-center justify-center gap-2 font-mono text-sm font-bold ${message.type === 'success' ? 'text-[#00f0ff]' : 'text-[#ff007f]'}`}>
                {message.type === 'success' ? <CheckCircle size={16} /> : <XCircle size={16} />}
                {message.text}
              </div>
            )}
          </form>
        </motion.div>
      </div>
    </section>
  );
};
