import React, { useState, useEffect } from 'react';
import { Clock, MapPin, Sparkles } from 'lucide-react';

export const CountdownBanner: React.FC = () => {
  // Target: November 28, 2026 at 18:00 (6:00 PM)
  const targetDate = new Date('2026-11-28T18:00:00').getTime();

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
    { label: 'DÍAS', value: timeLeft.days, color: '#c084fc' },
    { label: 'HORAS', value: timeLeft.hours, color: '#00f0ff' },
    { label: 'MIN', value: timeLeft.minutes, color: '#f472b6' },
    { label: 'SEG', value: timeLeft.seconds, color: '#a855f7' },
  ];

  return (
    <div className="w-full max-w-xl mx-auto my-3 px-2">
      <div className="p-3 sm:p-4 rounded-2xl bg-[#0e0422]/90 backdrop-blur-xl border border-purple-500/40 shadow-[0_0_30px_rgba(168,85,247,0.25)]">
        <div className="flex items-center justify-between gap-2 pb-2 mb-2 border-b border-purple-500/20 text-xs font-mono-cyber">
          <div className="flex items-center gap-1.5 text-[#c084fc] font-bold">
            <Clock className="w-3.5 h-3.5 text-[#00f0ff] animate-spin" style={{ animationDuration: '10s' }} />
            <span className="tracking-wider uppercase text-[11px] sm:text-xs">Tiempo hacia el Evento</span>
          </div>
          <span className="text-[10px] sm:text-xs text-[#00f0ff] font-mono-cyber font-bold tracking-wider">
            28 NOV 2026 • 06:00 PM
          </span>
        </div>

        {/* 4 Responsive Countdown Cells */}
        <div className="grid grid-cols-4 gap-1.5 sm:gap-2.5">
          {units.map((unit, i) => (
            <div
              key={i}
              className="p-2 sm:p-3 rounded-xl bg-[#170a38]/80 border border-purple-500/30 text-center flex flex-col items-center justify-center transition-transform hover:scale-105 shadow-[0_4px_12px_rgba(0,0,0,0.5)]"
            >
              <span
                className="font-cyber-heavy text-lg xs:text-2xl sm:text-3xl text-white tracking-tight leading-none"
                style={{
                  textShadow: `0 0 12px ${unit.color}`,
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
