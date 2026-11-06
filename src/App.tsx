import React, { useEffect, useState } from 'react';
import { CyberBackground } from './components/CyberBackground';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { AboutSection } from './components/AboutSection';
import { CyberArcadeSection } from './components/CyberArcadeSection';
import { StoriesSection } from './components/StoriesSection';
import { PhotoBoothSection } from './components/PhotoBoothSection';
import { AnonymousPrayerSection } from './components/AnonymousPrayerSection';
import { FooterSection } from './components/FooterSection';
import { OnboardingModal } from './components/OnboardingModal';
import { OfficialPosterModal } from './components/OfficialPosterModal';
import { ScrollWorldHud } from './components/ScrollWorldHud';
import { PageScrollWorld } from './components/PageScrollWorld';
import { WorldChapter } from './components/WorldChapter';
import { useUserProfile } from './hooks/useUserProfile';

export default function App() {
  const { profile, isLoaded, createProfile, updateProfile } = useUserProfile();
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
    <div className="metanoia-site relative min-h-screen bg-[#7022b8] text-white selection:bg-[#b01cc6] selection:text-white overflow-x-clip">
      {/* Name Onboarding Modal */}
      <OnboardingModal 
        isOpen={showOnboarding} 
        onComplete={createProfile} 
        onSkip={() => setShowOnboarding(false)}
      />

      {/* Official Poster High-Resolution Modal */}
      <OfficialPosterModal
        isOpen={showPosterModal}
        onClose={() => setShowPosterModal(false)}
      />

      {/* Original animated artwork, adapted to desktop and portrait screens */}
      <CyberBackground />
      <PageScrollWorld />

      {/* Sticky Glassmorphism Header */}
      <Navbar />

      {/* Scroll-World Route Tracker & Mobile-First HUD Bar */}
      <ScrollWorldHud onOpenPosterModal={() => setShowPosterModal(true)} />

      {/* Main Page Content Flow */}
      <main className="relative z-10 pb-16 sm:pb-8">
        {/* Sección 1: Hero con Pablo Rosales, fecha 21 Noviembre, 3D Crystal y Afiche */}
        <WorldChapter id="inicio"><HeroSection
          userName={profile?.name} 
          onOpenPosterModal={() => setShowPosterModal(true)}
        /></WorldChapter>

        {/* Sección 2: Propósito & Mensaje Evangelístico con Selector Bíblico de Promesas */}
        <WorldChapter id="proposito"><AboutSection userName={profile?.name} /></WorldChapter>

        {/* Sección de Oración Incógnita (100% Anónima) */}
        <WorldChapter id="oracion"><AnonymousPrayerSection /></WorldChapter>

        {/* Sección 3: Cyber Arcade con 4 minijuegos optimizados para celular */}
        <WorldChapter id="minijuegos"><CyberArcadeSection /></WorldChapter>

        {/* Sección 4: Historias Reales de Transformación Juvenil */}
        <WorldChapter id="testimonios"><StoriesSection /></WorldChapter>

        {/* Sección 5: Photo Booth 2026 con Credenciales Conmemorativas */}
        <WorldChapter id="photospot"><PhotoBoothSection initialAttendeeName={profile?.name} /></WorldChapter>
      </main>

      {/* Footer Section */}
      <WorldChapter id="cierre"><FooterSection /></WorldChapter>
    </div>
  );
}
