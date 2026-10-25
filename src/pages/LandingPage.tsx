import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ViplavaNavbar } from '../components/ViplavaNavbar';
import { ViplavaHero } from '../components/ViplavaHero';
import { QuoteAndStatsSection } from '../components/QuoteAndStatsSection';
import { EventIntroSection } from '../components/EventIntroSection';
import { QuizThemesSection } from '../components/QuizThemesSection';
import { HowToParticipateSection } from '../components/HowToParticipateSection';
import { ViplavaFooter } from '../components/ViplavaFooter';
import { GalleryModal, ContactModal } from '../components/ViplavaModals';
import { VideoModal } from '../components/VideoModal';
import { useQuiz } from '../QuizContext';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { activeQuiz } = useQuiz();
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const [trailerOpen, setTrailerOpen] = useState(false);

  const handleEnterQuest = () => {
    navigate('/register');
  };

  const handleViewLeaderboard = () => {
    navigate('/leaderboard');
  };

  return (
    <div className="w-full relative overflow-x-hidden bg-[#090D18]">
      
      {/* 1. Transparent Fixed Header with Blur on Scroll */}
      <ViplavaNavbar
        onOpenGallery={() => setGalleryOpen(true)}
        onOpenContact={() => setContactOpen(true)}
      />

      {/* 2. Cinematic Hero Section with Curved Wave Panel and Prabhupada Blend */}
      <ViplavaHero 
        onEnterQuest={handleEnterQuest} 
        onWatchTrailer={() => setTrailerOpen(true)}
      />

      {/* 3. Warm Ivory Parchment Quote & Live Countdown Section (29th October) */}
      <QuoteAndStatsSection />

      {/* 4. Event Introduction: EXPLORE · LEARN · CONNECT with Meditating Monk */}
      <EventIntroSection />

      {/* 5. 4 Premium Quiz Theme Cards with Gold Arched Frames */}
      <QuizThemesSection />

      {/* 6. How to Participate with 4 Steps, Rules & Final CTA */}
      <HowToParticipateSection 
        onEnterQuiz={handleEnterQuest}
        onViewLeaderboard={handleViewLeaderboard}
      />

      {/* 7. Event Footer with Scroll-to-Top Button */}
      <ViplavaFooter />

      {/* Interactive Modals for Gallery, Contact & Video Trailer */}
      <GalleryModal isOpen={galleryOpen} onClose={() => setGalleryOpen(false)} />
      <ContactModal isOpen={contactOpen} onClose={() => setContactOpen(false)} />
      <VideoModal isOpen={trailerOpen} onClose={() => setTrailerOpen(false)} />

    </div>
  );
};
