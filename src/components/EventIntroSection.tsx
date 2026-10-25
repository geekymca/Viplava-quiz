import React from 'react';
import { motion } from 'motion/react';
import { Play, Sparkles } from 'lucide-react';

interface EventIntroSectionProps {
  onWatchIntro?: () => void;
}

export const EventIntroSection: React.FC<EventIntroSectionProps> = ({ onWatchIntro }) => {
  return (
    <section id="about" className="relative w-full py-12 sm:py-20 px-4 sm:px-6 lg:px-8 bg-[#090D18] overflow-hidden">
      
      {/* Subtle background glow */}
      <div className="absolute inset-0 opacity-15 pointer-events-none">
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-[#D4AF37]/20 blur-[100px]" />
      </div>

      <div className="max-w-4xl mx-auto flex flex-col items-center text-center space-y-6">
        
        {/* Kicker */}
        <div className="text-[10px] sm:text-xs font-semibold tracking-[0.3em] text-[#D4AF37] uppercase font-cinzel">
          A Journey Through Knowledge, Devotion and Inspiration
        </div>

        {/* Headline: EXPLORE · LEARN · CONNECT */}
        <h2 className="text-2xl sm:text-4xl lg:text-5xl font-cinzel font-bold tracking-tight text-white">
          <span className="gold-gradient-text">
            EXPLORE · LEARN · CONNECT
          </span>
        </h2>

        {/* Center Ornamental Flourish */}
        <div className="flex items-center justify-center gap-3">
          <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-[#D4AF37]" />
          <svg viewBox="0 0 24 12" className="w-5 h-3 text-[#D4AF37]" fill="currentColor">
            <circle cx="12" cy="6" r="2" />
            <path d="M2 6 Q7 2 12 6 Q17 10 22 6" fill="none" stroke="currentColor" strokeWidth="1" />
          </svg>
          <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-[#D4AF37]" />
        </div>

        {/* Core Body Description */}
        <p className="text-xs sm:text-sm text-slate-300 font-light leading-relaxed font-sans-body max-w-lg mx-auto">
          Test your realization of the Bhagavad Gita's profound philosophical concepts: the nature of the soul, Karma Yoga, Bhakti Yoga, and the Supreme Person. Let this wisdom quest be a transformative step in your spiritual journey.
        </p>

        {/* Video Preview Card (Matching Screen 3 in Mockup) */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onWatchIntro}
          className="w-full max-w-md relative rounded-2xl overflow-hidden border border-[#D4AF37]/40 shadow-xl shadow-black/80 cursor-pointer group my-2"
        >
          <div className="aspect-[16/9] w-full relative bg-black">
            <img 
              src="/src/assets/images/viplava_hero_festival_1791925226306.jpg" 
              alt="Viplava 2026 Video Introduction Preview"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-80"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />
            
            {/* Center Glowing Play Button */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-12 h-12 rounded-full bg-[#D4AF37] text-black flex items-center justify-center shadow-lg shadow-[#D4AF37]/50 group-hover:scale-110 transition-transform">
                <Play size={20} className="ml-1 fill-black" />
              </div>
            </div>
          </div>

          {/* Under-Card Pill Button: Watch Introduction */}
          <div className="bg-[#0D1222] py-2.5 px-4 flex items-center justify-center gap-2 text-xs font-cinzel font-bold text-[#F3C74C] border-t border-[#D4AF37]/20 group-hover:bg-[#131B30] transition-colors">
            <Play size={12} className="fill-[#F3C74C]" />
            <span className="tracking-wider uppercase">Watch Introduction</span>
          </div>
        </motion.div>

        {/* Meditating Monk Ghat Archway Image */}
        <div className="w-full max-w-md rounded-2xl overflow-hidden border border-[#D4AF37]/25 shadow-xl relative mt-2 group">
          <img 
            src="/src/assets/images/meditating_monk_ghat_1791999538810.jpg" 
            alt="Vaishnava monk meditating at sacred Yamuna ghats in Mathura"
            className="w-full h-56 sm:h-72 object-cover object-center group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#090D18]/90 via-transparent to-transparent" />
          <div className="absolute bottom-3 left-4 text-left">
            <span className="text-[10px] font-bold text-[#D4AF37] uppercase tracking-wider bg-black/60 px-2 py-0.5 rounded backdrop-blur-sm border border-[#D4AF37]/20">
              Gokul Mathura Dham
            </span>
            <p className="text-xs font-serif font-bold text-white mt-1 drop-shadow">
              The Path of Inner Contemplation
            </p>
          </div>
        </div>

      </div>
    </section>
  );
};
