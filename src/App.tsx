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
import { OfficialPosterModal } from './components/OfficialPosterModal';
import { ScrollWorldHud } from './components/ScrollWorldHud';
import { useUserProfile } from './hooks/useUserProfile';

export default function App() {
  const { profile, isLoaded, createProfile } = useUserProfile();
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showPosterModal, setShowPosterModal] = useState(false);

  useEffect(() => {
    if (isLoaded && !profile) {
      setShowOnboarding(true);
    } else if (isLoaded && profile) {
      setShowOnboarding(false);
    }
  }, [isLoaded, profile]);

  return (
    <div className="relative min-h-screen bg-[#170526] text-white selection:bg-[#b01cc6] selection:text-white overflow-x-hidden">
      {/* Name Onboarding Modal */}
      <OnboardingModal 
        isOpen={showOnboarding} 
        onComplete={createProfile} 
      />

      {/* Official Poster High-Resolution Modal */}
      <OfficialPosterModal
        isOpen={showPosterModal}
        onClose={() => setShowPosterModal(false)}
      />

      {/* Interactive Cyber & Particle Canvas Background with Official Flyer Aurora */}
      <CyberBackground />

      {/* Sticky Glassmorphism Header */}
      <Navbar />

      {/* Scroll-World Route Tracker & Mobile-First HUD Bar */}
      <ScrollWorldHud onOpenPosterModal={() => setShowPosterModal(true)} />

      {/* Main Page Content Flow */}
      <main className="relative z-10 pb-16 sm:pb-8">
        {/* Sección 1: Hero con Pablo Rosales, fecha 28 Noviembre, 3D Crystal y Afiche */}
        <HeroSection 
          userName={profile?.name} 
          onOpenPosterModal={() => setShowPosterModal(true)}
        />

        {/* Sección 2: Propósito & Mensaje Evangelístico con Selector Bíblico de Promesas */}
        <AboutSection userName={profile?.name} />

        {/* Sección 3: Cyber Arcade con 3 Minijuegos Mejorados para Celular (Trivia, Guardián y Memoria) */}
        <CyberArcadeSection />

        {/* Sección 4: Historias Reales de Transformación Juvenil */}
        <StoriesSection />

        {/* Sección 5: Photo Booth 2026 con Credenciales Conmemorativas */}
        <PhotoBoothSection initialAttendeeName={profile?.name} />
      </main>

      {/* Footer Section */}
      <FooterSection />
    </div>
  );
}
