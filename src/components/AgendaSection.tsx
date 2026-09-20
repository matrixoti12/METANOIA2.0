import React from 'react';
import { motion } from 'framer-motion';
import { BlurText } from './BlurText';
import eventData from '../data/eventData.json';
import { Terminal, Cross, BookOpen } from 'lucide-react';

export const AgendaSection: React.FC = () => {
  return (
    <section id="agenda" className="relative py-20 px-4 max-w-5xl mx-auto">
      <div className="text-center mb-16">
        <span className="font-mono-cyber text-[#ff007f] text-xs sm:text-sm tracking-[0.2em] uppercase">
          PROTOCOLO DEL EVENTO
        </span>
        <BlurText
          text="HOJA DE RUTA METANOIA"
          className="text-4xl sm:text-5xl font-cyber-heavy text-white justify-center mt-2"
        />
      </div>

      <div className="relative">
        {/* Glow Line */}
        <div className="absolute left-[19px] md:left-1/2 top-0 bottom-0 w-[2px] bg-gradient-to-b from-[#00f0ff] via-[#ff007f] to-purple-900 shadow-[0_0_15px_#00f0ff]" />

        <div className="space-y-12">
          {eventData.agenda.map((item, index) => {
            const isLeft = index % 2 === 0;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`relative flex items-center md:justify-between ${
                  isLeft ? 'md:flex-row-reverse' : ''
                }`}
              >
                {/* Timeline Dot */}
                <div className="absolute left-[11px] md:left-1/2 md:-translate-x-1/2 w-5 h-5 rounded-full bg-[#140026] border-2 border-[#00f0ff] z-10 shadow-[0_0_10px_#00f0ff] flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-[#ff007f]" />
                </div>

                {/* Content Card */}
                <div className="ml-12 md:ml-0 md:w-[45%] bg-[#1c0036]/80 backdrop-blur-sm border border-purple-500/30 p-6 rounded-xl hover:border-[#00f0ff]/50 transition-colors group">
                  <div className="flex items-center gap-3 mb-2">
                    <Terminal size={16} className="text-[#00f0ff]" />
                    <span className="font-mono text-[#00f0ff] text-lg font-bold">{item.time}</span>
                  </div>
                  
                  <h3 className="text-xl font-cyber text-white mb-2 group-hover:text-[#ff007f] transition-colors uppercase tracking-wider">
                    {item.title}
                  </h3>
                  
                  <p className="text-purple-300 font-mono text-sm mb-4">
                    {item.description}
                  </p>

                  {item.verse && (
                    <div className="inline-flex items-center gap-2 bg-[#ff007f]/10 border border-[#ff007f]/30 px-3 py-1.5 rounded-md text-[#ff007f] text-xs font-mono">
                      <BookOpen size={14} />
                      {item.verse}
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
