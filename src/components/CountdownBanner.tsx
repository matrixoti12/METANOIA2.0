import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Flame, MapPin } from 'lucide-react';

export const CountdownBanner: React.FC = () => {
  // Target: November 20, 2026 at 18:00 (6:00 PM)
  const targetDate = new Date('2026-11-20T18:00:00').getTime();

  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
        setTimeLeft({ days, hours, minutes, seconds });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  const units = [
    { label: 'DÍAS', value: timeLeft.days, color: '#ffe600' },
    { label: 'HORAS', value: timeLeft.hours, color: '#00f0ff' },
    { label: 'MIN', value: timeLeft.minutes, color: '#ff007f' },
    { label: 'SEG', value: timeLeft.seconds, color: '#a855f7' },
  ];

  return (
    <div className="w-full max-w-xl mx-auto my-4 px-2">
      <div className="p-3 sm:p-4 rounded-2xl glass-panel-cyan border border-[#00f0ff]/30 shadow-[0_0_25px_rgba(0,240,255,0.2)]">
        <div className="flex items-center justify-between gap-2 pb-2.5 mb-2.5 border-b border-white/10 text-xs font-mono-cyber">
          <div className="flex items-center gap-1.5 text-[#ffe600] font-bold">
            <Clock className="w-3.5 h-3.5 text-[#ffe600] animate-spin" style={{ animationDuration: '8s' }} />
            <span className="tracking-wider uppercase text-[11px] sm:text-xs">Tiempo hacia el Evento</span>
          </div>
          <span className="text-[10px] sm:text-xs text-purple-200/90 font-mono-cyber">
            20 NOV 2026 • 6:00 PM
          </span>
        </div>

        {/* 4 Responsive Countdown Cells */}
        <div className="grid grid-cols-4 gap-1.5 sm:gap-3">
          {units.map((unit, i) => (
            <div
              key={i}
              className="p-2 sm:p-3 rounded-xl bg-[#140026]/90 border border-white/15 text-center flex flex-col items-center justify-center transition-transform hover:scale-105"
            >
              <span
                className="font-cyber-heavy text-lg xs:text-2xl sm:text-3xl text-white tracking-tight leading-none"
                style={{
                  textShadow: `0 0 10px ${unit.color}`,
                }}
              >
                {String(unit.value).padStart(2, '0')}
              </span>
              <span
                className="text-[9px] xs:text-[10px] sm:text-xs font-mono-cyber font-bold mt-1 tracking-wider"
                style={{ color: unit.color }}
              >
                {unit.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
