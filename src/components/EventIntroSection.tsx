import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Play, 
  Sparkles, 
  MapPin, 
  Calendar, 
  Users, 
  Award, 
  Heart, 
  Music, 
  Compass, 
  Theater, 
  MessageSquare, 
  CheckCircle2,
  Eye,
  X
} from 'lucide-react';

interface EventIntroSectionProps {
  onWatchIntro?: () => void;
}

export const EventIntroSection: React.FC<EventIntroSectionProps> = ({ onWatchIntro }) => {
  const [showPosterModal, setShowPosterModal] = useState(false);

  const festivalActivities = [
    { name: 'Kirtan & Damodar Ashtakam', icon: <Music className="w-4 h-4 text-[#F3C74C]" />, tag: 'Devotion' },
    { name: 'Morning Program & Sadhana', icon: <Sparkles className="w-4 h-4 text-[#F3C74C]" />, tag: 'Spiritual' },
    { name: 'Vedic Model Making', icon: <Award className="w-4 h-4 text-[#F3C74C]" />, tag: 'Creative' },
    { name: 'Drama & Theatre', icon: <Theater className="w-4 h-4 text-[#F3C74C]" />, tag: 'Culture' },
    { name: 'Devotional Dance', icon: <Music className="w-4 h-4 text-[#F3C74C]" />, tag: 'Celebration' },
    { name: 'Dham Visits & Parikrama', icon: <MapPin className="w-4 h-4 text-[#F3C74C]" />, tag: 'Pilgrimage' },
    { name: 'Philosophical Debate', icon: <MessageSquare className="w-4 h-4 text-[#F3C74C]" />, tag: 'Intellect' },
    { name: 'Bhagavad Gita Mega Quiz', icon: <Compass className="w-4 h-4 text-[#F3C74C]" />, tag: 'Wisdom' },
  ];

  return (
    <section id="about" className="relative w-full py-14 sm:py-20 px-4 sm:px-6 lg:px-8 bg-[#090D18] overflow-hidden">
      
      {/* Subtle background glow */}
      <div className="absolute inset-0 opacity-15 pointer-events-none">
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-[#D4AF37]/20 blur-[110px]" />
        <div className="absolute left-0 bottom-0 w-80 h-80 rounded-full bg-[#E67E22]/15 blur-[100px]" />
      </div>

      <div className="max-w-5xl mx-auto flex flex-col items-center text-center space-y-8">
        
        {/* Kicker with ISKCON 60 Badge */}
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-ping" />
          <span className="text-[10px] sm:text-xs font-semibold tracking-[0.3em] text-[#D4AF37] uppercase font-cinzel">
            ISKCON 60 (1966–2026) · A Revolution in Consciousness
          </span>
        </div>

        {/* Headline: EXPLORE · LEARN · CONNECT */}
        <div className="space-y-2">
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-cinzel font-bold tracking-tight text-white">
            <span className="gold-gradient-text">
              EXPLORE · LEARN · CONNECT
            </span>
          </h2>
          <p className="text-xs sm:text-sm font-cinzel tracking-widest text-[#F3C74C] uppercase">
            VIPLAVA 2026 MEGA YOUTH FEST · GOKUL DHAM
          </p>
        </div>

        {/* Center Ornamental Flourish */}
        <div className="flex items-center justify-center gap-3">
          <div className="h-[1px] w-14 bg-gradient-to-r from-transparent to-[#D4AF37]" />
          <svg viewBox="0 0 24 12" className="w-6 h-3 text-[#D4AF37]" fill="currentColor">
            <circle cx="12" cy="6" r="2" />
            <path d="M2 6 Q7 2 12 6 Q17 10 22 6" fill="none" stroke="currentColor" strokeWidth="1" />
          </svg>
          <div className="h-[1px] w-14 bg-gradient-to-l from-transparent to-[#D4AF37]" />
        </div>

        {/* Core Body Description */}
        <p className="text-xs sm:text-sm text-slate-300 font-light leading-relaxed font-sans-body max-w-2xl mx-auto">
          Immerse in the timeless teachings of His Divine Grace A.C. Bhaktivedanta Swami Prabhupada. VIPLAVA 2026 brings together dynamic youth thinkers from universities across India to explore the 18 chapters of <span className="text-[#F3C74C] italic font-normal">Bhagavad-gita As It Is</span> through transformative philosophical enquiry, devotional arts, and sacred association at Gokul Dham.
        </p>

        {/* 2-Column Showcase: Official Video Trailer + Official Festival Poster */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl pt-2 text-left">
          
          {/* Card 1: Official Trailer Video Player Card */}
          <div className="flex flex-col rounded-2xl overflow-hidden border border-[#D4AF37]/35 bg-[#0D1222] shadow-2xl relative group">
            {/* Header info bar */}
            <div className="px-4 py-2.5 bg-black/60 border-b border-white/10 flex items-center justify-between text-xs font-cinzel">
              <span className="text-[#F3C74C] font-bold tracking-wider uppercase text-[10px] flex items-center gap-1.5">
                <Play size={11} className="fill-[#F3C74C]" /> Official Video Teaser
              </span>
              <span className="text-slate-400 text-[10px]">Gokul Dham Live</span>
            </div>

            {/* Video Aspect Container */}
            <div 
              onClick={onWatchIntro}
              className="relative aspect-video w-full bg-black overflow-hidden cursor-pointer group"
            >
              <img 
                src="/src/assets/images/viplava_hero_festival_1791925226306.jpg" 
                alt="VIPLAVA 2026 Youth Conclave Trailer Preview"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

              {/* Glowing Center Play Button */}
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                <div className="w-14 h-14 rounded-full bg-[#D4AF37] text-black flex items-center justify-center shadow-xl shadow-[#D4AF37]/50 group-hover:scale-110 transition-transform">
                  <Play size={22} className="ml-1 fill-black" />
                </div>
                <span className="text-[11px] font-cinzel font-bold text-white tracking-widest uppercase drop-shadow">
                  Play Festival Clip
                </span>
              </div>

              {/* Bottom Badge */}
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[10px] text-slate-300">
                <span className="bg-black/70 px-2 py-0.5 rounded border border-white/10 text-[#F3C74C] font-semibold">
                  VID-20261026 · Official Youth Teaser
                </span>
                <span className="text-xs text-white">▶ Watch</span>
              </div>
            </div>

            {/* Footer summary */}
            <div className="p-4 space-y-2 flex-grow flex flex-col justify-between">
              <div>
                <h4 className="text-sm font-cinzel font-bold text-white">
                  VIPLAVA 2026 — Experience The Revolution
                </h4>
                <p className="text-xs text-slate-400 font-light mt-1 leading-relaxed">
                  Catch high-energy glimpses of Harinama, Vedic drama, philosophical discourse, and the youth conclave at Gokul Dham.
                </p>
              </div>

              <button
                onClick={onWatchIntro}
                className="w-full mt-2 py-2.5 px-4 rounded-xl bg-[#D4AF37]/15 hover:bg-[#D4AF37]/25 border border-[#D4AF37]/40 text-[#F3C74C] font-cinzel text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <Play size={12} className="fill-[#F3C74C]" />
                <span>Watch Full Trailer Clip</span>
              </button>
            </div>
          </div>

          {/* Card 2: Official Festival Poster & Prabhupada The Spiritual Ambassador Showcase */}
          <div className="flex flex-col rounded-2xl overflow-hidden border border-[#D4AF37]/35 bg-[#0D1222] shadow-2xl relative group">
            {/* Header info bar */}
            <div className="px-4 py-2.5 bg-black/60 border-b border-white/10 flex items-center justify-between text-xs font-cinzel">
              <span className="text-[#F3C74C] font-bold tracking-wider uppercase text-[10px] flex items-center gap-1.5">
                <Sparkles size={11} className="text-[#F3C74C]" /> Official Fest Poster
              </span>
              <span className="text-slate-400 text-[10px]">ISKCON 60 Diamond Jubilee</span>
            </div>

            {/* Poster Thumbnail Container */}
            <div 
              onClick={() => setShowPosterModal(true)}
              className="relative aspect-video w-full bg-black overflow-hidden cursor-pointer group"
            >
              <img 
                src="/assets/aistudio/IMG-20261025-WA0002_de6dcd48.jpg" 
                alt="Srila Prabhupada - The Spiritual Ambassador Official Poster"
                className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700 opacity-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

              {/* View Poster Overlay button */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 backdrop-blur-xs">
                <div className="px-4 py-2 rounded-full bg-[#D4AF37] text-black font-cinzel font-bold text-xs uppercase flex items-center gap-1.5 shadow-lg">
                  <Eye size={14} />
                  <span>View Full Poster</span>
                </div>
              </div>

              {/* Badge Overlay */}
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[10px]">
                <span className="bg-black/80 px-2 py-0.5 rounded border border-[#D4AF37]/30 text-[#F3C74C] font-cinzel font-bold">
                  30th Oct – 1st Nov · Gokul Dham
                </span>
                <span className="text-slate-300 text-[10px] flex items-center gap-1">
                  <Eye size={11} /> Click to enlarge
                </span>
              </div>
            </div>

            {/* Footer details & tribute */}
            <div className="p-4 space-y-2 flex-grow flex flex-col justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-1 text-[10px] text-[#E5C158] font-cinzel font-bold uppercase">
                  <span>Guest Speaker:</span>
                  <span className="text-white">HH Guru Prasada Swami Maharaj (ISKCON GBC)</span>
                </div>
                <h4 className="text-xs sm:text-sm font-cinzel font-bold text-white">
                  Srila Prabhupada — The Spiritual Ambassador
                </h4>
                <p className="text-[11px] text-slate-400 font-light leading-relaxed">
                  In the loving memory of HH Gopal Krishna Goswami Maharaj (1944–2024). Accommodation at Raman Reti Ashram, Mahavan, Gokul.
                </p>
              </div>

              <button
                onClick={() => setShowPosterModal(true)}
                className="w-full mt-2 py-2.5 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-[#D4AF37]/30 text-slate-200 font-cinzel text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <Eye size={12} className="text-[#D4AF37]" />
                <span>Examine Official Event Poster</span>
              </button>
            </div>
          </div>

        </div>

        {/* 8 Dynamic Festival Activities from the Official Poster */}
        <div className="w-full max-w-4xl pt-4 space-y-3">
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <span className="text-xs font-cinzel font-bold tracking-widest text-[#F3C74C] uppercase flex items-center gap-1.5">
              <Sparkles size={12} /> Mega Youth Fest Highlights
            </span>
            <span className="text-[11px] text-slate-400">
              Gokul Dham · Raman Reti, Mahavan
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-left">
            {festivalActivities.map((act, idx) => (
              <div 
                key={idx}
                className="p-3 rounded-xl bg-white/[0.03] border border-white/10 hover:border-[#D4AF37]/40 hover:bg-white/[0.06] transition-all space-y-1 group"
              >
                <div className="flex items-center justify-between">
                  <div className="p-1.5 rounded-lg bg-[#D4AF37]/10 group-hover:scale-110 transition-transform">
                    {act.icon}
                  </div>
                  <span className="text-[9px] font-mono text-[#D4AF37]/80 uppercase">
                    {act.tag}
                  </span>
                </div>
                <div className="text-xs font-semibold text-slate-200 group-hover:text-white transition-colors">
                  {act.name}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Full-Screen Official Poster Modal */}
      <AnimatePresence>
        {showPosterModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-md overflow-y-auto">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative max-w-2xl w-full bg-[#090D18] border-2 border-[#D4AF37]/60 rounded-2xl p-4 sm:p-6 shadow-2xl space-y-4 my-6"
            >
              <button
                onClick={() => setShowPosterModal(false)}
                className="absolute top-4 right-4 p-2 rounded-full bg-black/80 text-white hover:bg-[#D4AF37] hover:text-black transition-colors cursor-pointer z-10"
              >
                <X size={18} />
              </button>

              <div className="text-left space-y-0.5">
                <span className="text-[10px] font-cinzel font-bold tracking-widest text-[#F3C74C] uppercase">
                  Official VIPLAVA 2026 Mega Youth Fest
                </span>
                <h3 className="text-lg sm:text-xl font-cinzel font-bold text-white">
                  Srila Prabhupada — The Spiritual Ambassador
                </h3>
              </div>

              {/* Full Image */}
              <div className="rounded-xl overflow-hidden border border-white/15 max-h-[75vh] flex items-center justify-center bg-black">
                <img 
                  src="/assets/aistudio/IMG-20261025-WA0002_de6dcd48.jpg" 
                  alt="Official VIPLAVA 2026 Poster"
                  className="w-full h-auto max-h-[75vh] object-contain"
                />
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pt-2 text-xs text-slate-400 border-t border-white/10">
                <span>Venue: Gokul Dham (Raman Reti Ashram, Mahavan)</span>
                <button
                  onClick={() => setShowPosterModal(false)}
                  className="px-5 py-2 rounded-full bg-[#D4AF37] text-black font-cinzel font-bold text-xs uppercase cursor-pointer hover:bg-[#F3C74C] transition-colors"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </section>
  );
};
