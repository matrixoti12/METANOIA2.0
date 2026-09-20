import React, { useState } from 'react';
import {
  Calendar,
  Music,
  BookOpen,
  Gamepad2,
  Coffee,
  Sparkles,
  ChevronDown,
  Clock,
  Flame,
  KeyRound,
  Users2,
  CheckCircle,
} from 'lucide-react';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { useRipple } from '../hooks/useRipple';
import { playCyberClick, playCyberHover, playNeonChime } from '../utils/audio';
import { TimelineEvent } from '../types';

export const TimelineSection: React.FC = () => {
  const { ref: sectionRef, isVisible } = useScrollReveal<HTMLElement>({ threshold: 0.1 });
  const { triggerRipple, RippleElements } = useRipple('yellow');
  const [expandedId, setExpandedId] = useState<string>('bloque-1');
  const [activeFilter, setActiveFilter] = useState<string>('todos');

  const events: TimelineEvent[] = [
    {
      id: 'bloque-1',
      time: '18:00 - 19:15',
      title: 'Apertura de Puertas & Registro',
      subtitle: 'Entrega de pases conmemorativos 2026 y bienvenida',
      description:
        'Apertura de puertas en Iglesia Pacto y Bendición Guazapa a las 6:00 PM. Cada participante recibirá su credencial conmemorativa de Metanoia 2026 y su asignación de escuadra. Sesión de fotos en el Photo-Spot de luces neón.',
      category: 'comunidad',
      icon: 'KeyRound',
      accentColor: 'cyan',
      tags: ['Recepción', 'Pases 2026', 'Guazapa'],
      keyHighlight: '¡Llega a las 6:00 PM en punto para asegurar tu lugar y credencial conmemorativa!',
    },
    {
      id: 'bloque-2',
      time: '19:30 - 21:00',
      title: 'Tiempo de Adoración Íntima & Alabanza',
      subtitle: 'La atmósfera donde el cielo toca la tierra sin filtros',
      description:
        'Banda en vivo con sonido envolvente. Un tiempo prolongado de adoración congregacional donde dejamos afuera las distracciones y nos rendimos de rodillas ante la presencia manifiesta de Dios.',
      category: 'adoracion',
      icon: 'Music',
      accentColor: 'magenta',
      tags: ['Banda en Vivo', 'Clamor', 'Intimidad'],
      keyHighlight: 'Adoración continua sin cortes ni poses: solo un corazón quebrantado y disponible.',
    },
    {
      id: 'bloque-3',
      time: '21:15 - 22:45',
      title: 'Mensaje Central: «Metanoia: Rompe el Molde»',
      subtitle: 'Renovación del entendimiento según Romanos 12:2',
      description:
        'Una predicación bíblica confrontadora y profunda impartida en Iglesia Pacto y Bendición Guazapa, enfocada en desarmar las mentiras culturales que han moldeado a nuestra juventud y activar el diseño divino.',
      category: 'mensaje',
      icon: 'BookOpen',
      accentColor: 'yellow',
      tags: ['Romanos 12:2', 'Predicación', 'Renovación'],
      keyHighlight: 'Trae tu Biblia física o digital lista para tomar notas y recibir dirección.',
    },
    {
      id: 'bloque-4',
      time: '23:00 - 00:30',
      title: 'Dinámicas & Retos en Escuadras',
      subtitle: 'Desafíos de integración bíblica y trabajo en equipo',
      description:
        'Momento de adrenalina y compañerismo. Cada escuadra participará en dinámicas de integración, trivias bíblicas contrarreloj y desafíos de estrategia cooperativa en el auditorio.',
      category: 'dinamica',
      icon: 'Gamepad2',
      accentColor: 'cyan',
      tags: ['Retos Bíblicos', 'Escuadras', 'Integración'],
      keyHighlight: 'Trabajo en equipo y sincronización para resolver desafíos de fe y comunión.',
    },
    {
      id: 'bloque-5',
      time: '00:45 - 01:45',
      title: 'Refrigerio & Cyber-Café Nocturno',
      subtitle: 'Recarga de energía, convivencia y testimonios',
      description:
        'Estaciones de café caliente, chocolate, bocadillos y frutas para compartir en confraternidad en Guazapa. Tiempo para platicar, conocer nuevos jóvenes y consolidar lazos fraternos.',
      category: 'comunidad',
      icon: 'Coffee',
      accentColor: 'yellow',
      tags: ['Café Caliente', 'Snacks', 'Confraternidad'],
      keyHighlight: 'Espacio de comunión libre con ambiente fraterno y tiempo de refrigerio.',
    },
    {
      id: 'bloque-6',
      time: '02:00 - En adelante / Madrugada',
      title: 'Ministración Final & Clamor de Madrugada',
      subtitle: 'Imposición de manos y consagración espiritual',
      description:
        'El clímax espiritual del evento en Iglesia Pacto y Bendición Guazapa. Clamamos juntos al romper el alba, orando por sueños, vocación, sanidad emocional y un bautismo fresco de fuego para ser enviados como antorchas.',
      category: 'ministracion',
      icon: 'Flame',
      accentColor: 'magenta',
      tags: ['Unción', 'Amanecer', 'Compromiso'],
      keyHighlight: 'Culminaremos recibiendo la primera luz del día con alabanzas de victoria.',
    },
  ];

  const filteredEvents =
    activeFilter === 'todos'
      ? events
      : events.filter((e) => e.category === activeFilter);

  const toggleExpand = (id: string, e: React.MouseEvent) => {
    triggerRipple(e);
    if (expandedId === id) {
      setExpandedId('');
      playCyberClick();
    } else {
      setExpandedId(id);
      playNeonChime();
    }
  };

  return (
    <section
      id="cronograma"
      ref={sectionRef}
      className="relative py-20 px-4 sm:px-6 max-w-5xl mx-auto overflow-hidden"
    >
      {/* Section Header */}
      <div
        className={`text-center max-w-2xl mx-auto mb-12 transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#ffe600]/15 border border-[#ffe600]/35 mb-4">
          <Calendar className="w-4 h-4 text-[#ffe600]" />
          <span className="font-mono-cyber text-xs tracking-wider uppercase text-[#ffe600] font-semibold">
            Flujo de la Noche
          </span>
        </div>

        <h2 className="font-cyber-heavy text-3xl sm:text-5xl md:text-6xl text-white tracking-wide mb-3">
          ¿QUÉ <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ffe600] via-[#ff007f] to-[#00f0ff]">HAREMOS</span>?
        </h2>

        <p className="text-sm sm:text-base text-purple-200/90 font-sans">
          Una ruta nocturna diseñada para transformar tu espíritu, mente y corazón a lo largo de toda esta gran noche.
        </p>

        {/* Filter categories */}
        <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
          {[
            { id: 'todos', label: 'Todos los Bloques' },
            { id: 'adoracion', label: 'Adoración' },
            { id: 'mensaje', label: 'Mensaje' },
            { id: 'dinamica', label: 'Retos' },
            { id: 'comunidad', label: 'Comunidad' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={(e) => {
                triggerRipple(e, '#00f0ff');
                setActiveFilter(tab.id);
                playCyberClick();
              }}
              onMouseEnter={() => playCyberHover('subtle')}
              className={`px-3.5 py-2 rounded-xl text-xs font-mono-cyber tracking-wider transition-all cursor-pointer touch-manipulation min-h-[40px] ${
                activeFilter === tab.id
                  ? 'bg-gradient-to-r from-[#ff007f] to-[#7928ca] text-white font-bold border border-white/20 shadow-[0_0_12px_rgba(255,0,127,0.4)]'
                  : 'bg-white/5 hover:bg-white/10 text-purple-300 border border-white/10'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Vertical Neon Timeline */}
      <div
        className={`relative pl-4 sm:pl-8 transition-all duration-1000 delay-200 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        {/* Continuous luminous vertical spine */}
        <div className="absolute top-4 bottom-4 left-6 sm:left-10 w-0.5 bg-gradient-to-b from-[#00f0ff] via-[#ff007f] to-[#ffe600] opacity-60 shadow-[0_0_10px_#ff007f]" />

        <div className="space-y-6 sm:space-y-8">
          {filteredEvents.map((item, index) => {
            const isExpanded = expandedId === item.id;
            const accentClasses =
              item.accentColor === 'cyan'
                ? {
                    border: 'border-[#00f0ff]/40 shadow-[0_0_20px_rgba(0,240,255,0.2)]',
                    glow: 'bg-[#00f0ff]',
                    text: 'text-[#00f0ff]',
                    badge: 'bg-[#00f0ff]/15 text-[#00f0ff] border-[#00f0ff]/30',
                  }
                : item.accentColor === 'magenta'
                ? {
                    border: 'border-[#ff007f]/40 shadow-[0_0_20px_rgba(255,0,127,0.2)]',
                    glow: 'bg-[#ff007f]',
                    text: 'text-[#ff007f]',
                    badge: 'bg-[#ff007f]/15 text-[#ff007f] border-[#ff007f]/30',
                  }
                : {
                    border: 'border-[#ffe600]/40 shadow-[0_0_20px_rgba(255,230,0,0.2)]',
                    glow: 'bg-[#ffe600]',
                    text: 'text-[#ffe600]',
                    badge: 'bg-[#ffe600]/15 text-[#ffe600] border-[#ffe600]/30',
                  };

            return (
              <div key={item.id} className="relative flex items-start gap-4 sm:gap-6 group">
                {/* Timeline Neon Node Icon */}
                <div
                  className={`relative z-10 flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-[#18022f] border-2 ${
                    item.accentColor === 'cyan'
                      ? 'border-[#00f0ff]'
                      : item.accentColor === 'magenta'
                      ? 'border-[#ff007f]'
                      : 'border-[#ffe600]'
                  } flex items-center justify-center shadow-[0_0_15px_rgba(255,0,127,0.5)] group-hover:scale-110 transition-transform`}
                >
                  {item.icon === 'Music' && <Music className={`w-5 h-5 ${accentClasses.text}`} />}
                  {item.icon === 'BookOpen' && <BookOpen className={`w-5 h-5 ${accentClasses.text}`} />}
                  {item.icon === 'Gamepad2' && <Gamepad2 className={`w-5 h-5 ${accentClasses.text}`} />}
                  {item.icon === 'Coffee' && <Coffee className={`w-5 h-5 ${accentClasses.text}`} />}
                  {item.icon === 'Flame' && <Flame className={`w-5 h-5 ${accentClasses.text}`} />}
                  {item.icon === 'KeyRound' && <KeyRound className={`w-5 h-5 ${accentClasses.text}`} />}
                </div>

                {/* Event Card Content */}
                <div
                  onClick={(e) => toggleExpand(item.id, e)}
                  className={`flex-1 rounded-2xl glass-panel p-4 sm:p-6 transition-all duration-300 cursor-pointer text-left relative overflow-hidden ${
                    isExpanded
                      ? `${accentClasses.border} ring-1 ring-white/30`
                      : 'hover:border-white/20 hover:scale-[1.005]'
                  }`}
                  id={`timeline-card-${item.id}`}
                >
                  <RippleElements />

                  {/* Top Bar: Time & Tags */}
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <Clock className={`w-3.5 h-3.5 ${accentClasses.text}`} />
                      <span className="font-mono-cyber font-bold text-xs sm:text-sm text-white tracking-wider">
                        {item.time}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span
                        className={`text-[10px] font-mono-cyber uppercase px-2 py-0.5 rounded-full border ${accentClasses.badge}`}
                      >
                        {item.category}
                      </span>
                      <ChevronDown
                        className={`w-4 h-4 text-purple-300 transition-transform duration-300 ${
                          isExpanded ? 'rotate-180' : ''
                        }`}
                      />
                    </div>
                  </div>

                  {/* Title & Subtitle */}
                  <h3 className="font-cyber-heavy text-lg sm:text-xl text-white group-hover:text-purple-100 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-purple-300/90 mt-1">
                    {item.subtitle}
                  </p>

                  {/* Expanded Information */}
                  {isExpanded && (
                    <div className="mt-4 pt-4 border-t border-white/10 space-y-3 animate-in fade-in slide-in-from-top-2">
                      <p className="text-xs sm:text-sm text-purple-100/90 font-sans leading-relaxed">
                        {item.description}
                      </p>

                      {item.keyHighlight && (
                        <div className="flex items-start gap-2 p-3 rounded-xl bg-white/5 border border-white/10 text-xs font-sans text-[#ffe600]">
                          <Sparkles className="w-4 h-4 text-[#ffe600] flex-shrink-0 mt-0.5" />
                          <span>{item.keyHighlight}</span>
                        </div>
                      )}

                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {item.tags.map((tag) => (
                          <span
                            key={tag}
                            className="text-[10px] font-mono-cyber px-2 py-0.5 rounded bg-purple-950/70 text-purple-300 border border-purple-800/50"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {!isExpanded && (
                    <div className="mt-2 text-[11px] font-mono-cyber text-purple-400/80 flex items-center gap-1">
                      <span>Toca para ver detalles y recomendaciones</span>
                      <span className={accentClasses.text}>+</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
