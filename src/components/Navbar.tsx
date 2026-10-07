import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Menu, X } from 'lucide-react';
import {
  isSoundEnabled,
  setSoundEnabled,
  playCyberClick,
  playCyberHover,
  playCyberTransition,
  playNeonChime,
  toggleAmbientDrone,
} from '../utils/audio';
import { MetanoiaLogo } from './MetanoiaLogo';

interface NavbarProps {
  activeSection?: string;
}

export const Navbar: React.FC<NavbarProps> = ({ activeSection = 'inicio' }) => {
  const [scrolled, setScrolled] = useState(false);
  const [soundOn, setSoundOn] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentSection, setCurrentSection] = useState(activeSection);

  useEffect(() => {
    const isAudioOn = isSoundEnabled();
    setSoundOn(isAudioOn);
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);

      // Detect active section
      const sections = ['inicio', 'proposito', 'minijuegos', 'photospot'];
      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 200 && rect.bottom >= 200) {
            setCurrentSection(sectionId);
            break;
          }
        }
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleAudio = () => {
    const newState = !soundOn;
    setSoundOn(newState);
    setSoundEnabled(newState);
    toggleAmbientDrone(newState);
    if (newState) {
      playNeonChime();
    } else {
      playCyberClick('soft');
    }
  };

  const scrollTo = (id: string) => {
    playCyberClick();
    playCyberTransition();
    setCurrentSection(id);
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -80;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  const navItems = [
    { id: 'inicio', label: 'INICIO' },
    { id: 'proposito', label: 'PROPÓSITO' },
    { id: 'minijuegos', label: 'MINIJUEGOS' },
    { id: 'photospot', label: 'PHOTO BOOTH' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#170526]/95 backdrop-blur-xl border-b border-[#c3a7ff]/20 shadow-[0_10px_35px_rgba(0,0,0,0.85)] py-3'
          : 'bg-transparent py-4 sm:py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-8 flex items-center justify-between">
        {/* Brand Logo */}
        <button
          onClick={() => scrollTo('inicio')}
          onMouseEnter={() => playCyberHover('subtle')}
          className="focus:outline-none cursor-pointer group touch-manipulation"
          id="nav-brand-logo"
        >
          <MetanoiaLogo size="md" showText={true} />
        </button>

        {/* Desktop Nav: INICIO, PROPÓSITO, MINIJUEGOS, PHOTO BOOTH */}
        <nav className="hidden md:flex items-center gap-8 lg:gap-10">
          {navItems.map((item) => {
            const isActive = currentSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => scrollTo(item.id)}
                onMouseEnter={() => playCyberHover('subtle')}
                className={`relative text-xs tracking-[0.2em] font-cyber font-semibold transition-colors duration-200 py-1.5 cursor-pointer touch-manipulation select-none ${
                  isActive ? 'text-white' : 'text-purple-200/70 hover:text-white'
                }`}
              >
                {item.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#b01cc6] via-[#c3a7ff] to-[#f4b6ff] rounded-full shadow-[0_0_10px_rgba(195,167,255,0.9)]" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Right Utility Buttons */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Sound toggle button */}
          <button
            onClick={toggleAudio}
            onMouseEnter={() => playCyberHover('subtle')}
            title={soundOn ? 'Desactivar audio' : 'Activar efectos de audio y ambiente cyber'}
            className="p-2.5 sm:p-2.5 rounded-xl bg-white/5 hover:bg-white/10 active:scale-95 border border-[#c3a7ff]/25 text-purple-200 hover:text-[#c3a7ff] transition-all cursor-pointer focus:outline-none touch-manipulation min-w-[44px] min-h-[44px] flex items-center justify-center shadow-[0_0_12px_rgba(115,11,179,0.25)]"
            aria-label="Alternar audio"
            id="audio-toggle-btn"
          >
            {soundOn ? (
              <Volume2 className="w-4 h-4 text-[#c3a7ff] animate-pulse" />
            ) : (
              <VolumeX className="w-4 h-4 text-purple-400" />
            )}
          </button>

          {/* Mobile menu toggle button */}
          <button
            onClick={() => {
              playCyberClick();
              setMobileMenuOpen(!mobileMenuOpen);
            }}
            className="md:hidden p-2.5 rounded-xl bg-[#1e0735] active:scale-90 border border-[#c3a7ff]/40 text-purple-200 hover:text-white focus:outline-none cursor-pointer touch-manipulation min-w-[44px] min-h-[44px] flex items-center justify-center shadow-[0_0_15px_rgba(195,167,255,0.25)] group transition-all"
            aria-label="Abrir menú"
            id="mobile-nav-toggle"
            title="Menú Metanoia"
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5 text-[#f4b6ff]" />
            ) : (
              <div className="relative flex items-center justify-center w-6 h-6">
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-none stroke-[#c3a7ff] stroke-2 drop-shadow-[0_0_8px_#c3a7ff] transition-transform duration-500 group-hover:rotate-180">
                  <polygon points="12 2, 22 21, 2 21" strokeLinejoin="round" />
                  <polygon points="12 8, 17 17, 7 17" stroke="#b01cc6" strokeWidth="1.5" strokeLinejoin="round" fill="rgba(176,28,198,0.3)" />
                </svg>
              </div>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-2 mx-4 p-4 rounded-2xl bg-[#170526]/98 border border-[#c3a7ff]/30 backdrop-blur-2xl space-y-2 shadow-2xl animate-in fade-in slide-in-from-top-2">
          <div className="flex justify-center pb-2 border-b border-purple-500/20 mb-2">
            <MetanoiaLogo size="sm" />
          </div>
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollTo(item.id)}
              className="w-full text-left py-3 px-3.5 rounded-xl hover:bg-white/5 active:bg-white/10 text-purple-100 font-cyber text-xs tracking-[0.2em] flex items-center justify-between min-h-[44px] touch-manipulation transition-colors"
            >
              <span>{item.label}</span>
              {currentSection === item.id ? (
                <span className="w-2 h-2 rounded-full bg-[#c3a7ff] shadow-[0_0_8px_#c3a7ff]" />
              ) : (
                <span className="w-1.5 h-1.5 rounded-full bg-white/20" />
              )}
            </button>
          ))}
        </div>
      )}
    </header>
  );
};
