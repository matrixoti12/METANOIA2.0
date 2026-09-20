import React, { useEffect, useState } from 'react';
import { CyberBackground } from './components/CyberBackground';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { AboutSection } from './components/AboutSection';
import { CyberArcadeSection } from './components/CyberArcadeSection';
import { StoriesSection } from './components/StoriesSection';
import { PhotoBoothSection } from './components/PhotoBoothSection';
import { FooterSection } from './components/FooterSection';
import { OnboardingModal } from './components/OnboardingModal';
import { useUserProfile } from './hooks/useUserProfile';

export default function App() {
  const { profile, isLoaded, createProfile } = useUserProfile();
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    if (isLoaded && !profile) {
      setShowOnboarding(true);
    } else if (isLoaded && profile) {
      setShowOnboarding(false);
    }
  }, [isLoaded, profile]);

  return (
    <div className="relative min-h-screen bg-[#140026] text-white selection:bg-[#ff007f] selection:text-white overflow-x-hidden">
      {/* Name Onboarding Modal */}
      <OnboardingModal 
        isOpen={showOnboarding} 
        onComplete={createProfile} 
      />

      {/* Interactive Cyber & Particle Canvas Background */}
      <CyberBackground />

      {/* Sticky Glassmorphism Header */}
      <Navbar />

      {/* Main Page Content Flow */}
      <main className="relative z-10">
        {/* Sección 1: Hero con animaciones, conteo y personalización */}
        <HeroSection userName={profile?.name} />

        {/* Sección 2: Propósito & Mensaje Evangelístico Profundo con Selector de Promesas */}
        <AboutSection userName={profile?.name} />

        {/* Sección 3: Cyber Arcade con 3 Minijuegos (Trivia, Guardián del Pensamiento y Matriz de Memoria) */}
        <CyberArcadeSection />

        {/* Sección 4: Historias Reales de Transformación */}
        <StoriesSection />

        {/* Sección 5: Photo Booth 2026 con controles avanzados de ajuste y encuadre */}
        <PhotoBoothSection initialAttendeeName={profile?.name} />
      </main>

      {/* Footer Section */}
      <FooterSection />
    </div>
  );
}
