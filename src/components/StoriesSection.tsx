import React, { useState, useRef } from 'react';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { ChevronLeft, ChevronRight, ArrowUpRight, Layers, BookmarkCheck, Compass } from 'lucide-react';
import { playCyberClick, playCyberHover } from '../utils/audio';

interface Story {
  id: string;
  title: string;
  description: string;
  tag: string;
  colorScheme: 'magenta' | 'cyan' | 'yellow' | 'purple';
  icon: React.ReactNode;
}

export const StoriesSection: React.FC = () => {
  const { ref: sectionRef, isVisible } = useScrollReveal<HTMLElement>({ threshold: 0.1 });
  const [currentIndex, setCurrentIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);

  const stories: Story[] = [
    {
      id: '1',
      title: 'DE VACÍO A PROPÓSITO',
      description: 'Encontré dirección cuando decidí entregar mi vida a Dios. Hoy vivo con propósito y esperanza.',
      tag: '#IDENTIDAD',
      colorScheme: 'magenta',
      icon: <ArrowUpRight className="w-6 h-6 text-[#ff007f]" />,
    },
    {
      id: '2',
      title: 'DE ANSIEDAD A PAZ',
      description: 'Dejé de cargar con todo. Su paz cambió mis días y mis decisiones.',
      tag: '#RENOVACIÓN',
      colorScheme: 'cyan',
      icon: <Layers className="w-6 h-6 text-[#00f0ff]" />,
    },
    {
      id: '3',
      title: 'DE MIEDO A FE',
      description: 'Decidí confiar y avanzar. Hoy camino con fe, no con temor.',
      tag: '#VALENTÍA',
      colorScheme: 'yellow',
      icon: <BookmarkCheck className="w-6 h-6 text-[#ffe600]" />,
    },
    {
      id: '4',
      title: 'DE CAOS A CLARIDAD',
      description: 'Dios renovó mis pensamientos y me dio una visión clara para mi futuro y mi familia.',
      tag: '#TRANSFORMACIÓN',
      colorScheme: 'purple',
      icon: <Compass className="w-6 h-6 text-[#a855f7]" />,
    },
  ];

  const maxIndex = stories.length - 1;

  const handlePrev = () => {
    playCyberClick();
    setCurrentIndex((prev) => (prev === 0 ? maxIndex : prev - 1));
  };

  const handleNext = () => {
    playCyberClick();
    setCurrentIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) handleNext();
      else handlePrev();
    }
    touchStartX.current = null;
  };

  return (
    <section
      id="testimonios"
      ref={sectionRef}
      className="relative py-20 sm:py-28 px-4 sm:px-8 max-w-7xl mx-auto overflow-hidden"
    >
      <div
        className={`transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
      >
        {/* Section Header with Carousel Controls */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
          <div>
            <div className="mb-2">
              <span className="font-cyber text-xs tracking-[0.25em] uppercase text-[#ff007f] font-bold">
                HISTORIAS REALES
              </span>
            </div>
            <h2 className="font-cyber-heavy text-3xl xs:text-4xl sm:text-5xl tracking-tight text-white leading-tight select-none">
              <div>LA MISMA DECISIÓN.</div>
              <div className="text-[#ffe600] drop-shadow-[0_0_20px_rgba(255,230,0,0.5)]">
                NUEVAS HISTORIAS.
              </div>
            </h2>
          </div>

          {/* Carousel Arrow Controls from uploaded image */}
          <div className="flex items-center gap-3 self-end sm:self-auto">
            <button
              onClick={handlePrev}
              onMouseEnter={() => playCyberHover('crisp')}
              aria-label="Historia anterior"
              className="w-12 h-12 rounded-full border border-white/20 bg-white/5 hover:bg-white/10 text-white flex items-center justify-center hover:border-[#ff007f] hover:text-[#ff007f] hover:shadow-[0_0_15px_rgba(255,0,127,0.4)] transition-all cursor-pointer focus:outline-none touch-manipulation min-h-[44px] min-w-[44px]"
              id="stories-prev-btn"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={handleNext}
              onMouseEnter={() => playCyberHover('crisp')}
              aria-label="Historia siguiente"
              className="w-12 h-12 rounded-full border border-white/20 bg-white/5 hover:bg-white/10 text-white flex items-center justify-center hover:border-[#00f0ff] hover:text-[#00f0ff] hover:shadow-[0_0_15px_rgba(0,240,255,0.4)] transition-all cursor-pointer focus:outline-none touch-manipulation min-h-[44px] min-w-[44px]"
              id="stories-next-btn"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Carousel Viewport */}
        <div
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          className="overflow-hidden"
        >
          {/* Desktop Grid (3 visible cards) / Slider on mobile */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {stories.slice(0, 3).map((story, index) => {
              const borderStyles = {
                magenta: 'border-[#ff007f]/30 hover:border-[#ff007f]/80 shadow-[0_0_25px_rgba(255,0,127,0.15)]',
                cyan: 'border-[#00f0ff]/30 hover:border-[#00f0ff]/80 shadow-[0_0_25px_rgba(0,240,255,0.15)]',
                yellow: 'border-[#ffe600]/30 hover:border-[#ffe600]/80 shadow-[0_0_25px_rgba(255,230,0,0.15)]',
                purple: 'border-[#a855f7]/30 hover:border-[#a855f7]/80 shadow-[0_0_25px_rgba(168,85,247,0.15)]',
              }[story.colorScheme];

              const iconBgStyles = {
                magenta: 'bg-[#ff007f]/15 border-[#ff007f]/40 shadow-[0_0_15px_rgba(255,0,127,0.3)]',
                cyan: 'bg-[#00f0ff]/15 border-[#00f0ff]/40 shadow-[0_0_15px_rgba(0,240,255,0.3)]',
                yellow: 'bg-[#ffe600]/15 border-[#ffe600]/40 shadow-[0_0_15px_rgba(255,230,0,0.3)]',
                purple: 'bg-[#a855f7]/15 border-[#a855f7]/40 shadow-[0_0_15px_rgba(168,85,247,0.3)]',
              }[story.colorScheme];

              const quoteColor = {
                magenta: 'text-[#ff007f]',
                cyan: 'text-[#00f0ff]',
                yellow: 'text-[#ffe600]',
                purple: 'text-[#a855f7]',
              }[story.colorScheme];

              const tagStyles = {
                magenta: 'text-[#ff007f] border-[#ff007f]/40 bg-[#ff007f]/10',
                cyan: 'text-[#00f0ff] border-[#00f0ff]/40 bg-[#00f0ff]/10',
                yellow: 'text-[#ffe600] border-[#ffe600]/40 bg-[#ffe600]/10',
                purple: 'text-[#a855f7] border-[#a855f7]/40 bg-[#a855f7]/10',
              }[story.colorScheme];

              return (
                <div
                  key={story.id}
                  onMouseEnter={playCyberHover}
                  className={`rounded-3xl bg-[#140026]/80 backdrop-blur-xl p-7 sm:p-8 border ${borderStyles} transition-all duration-300 flex flex-col justify-between group min-h-[360px] hover:-translate-y-1`}
                >
                  <div>
                    {/* Glowing Circular Icon from image */}
                    <div className="mb-6">
                      <div
                        className={`w-14 h-14 rounded-full border flex items-center justify-center ${iconBgStyles} transition-transform duration-300 group-hover:scale-110`}
                      >
                        {story.icon}
                      </div>
                    </div>

                    {/* Quote mark */}
                    <div className="mb-2">
                      <span className={`font-serif text-3xl leading-none font-bold ${quoteColor}`}>
                        “
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="font-cyber text-base sm:text-lg font-bold tracking-wider text-white mb-3">
                      {story.title}
                    </h3>

                    {/* Description */}
                    <p className="font-body text-sm sm:text-base text-purple-200/80 leading-relaxed">
                      {story.description}
                    </p>
                  </div>

                  {/* Hashtag Tag Pill from image */}
                  <div className="pt-6">
                    <span
                      className={`inline-block font-cyber text-xs tracking-wider uppercase px-3 py-1 rounded-full border ${tagStyles}`}
                    >
                      {story.tag}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
