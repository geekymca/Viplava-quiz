import React from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { MapPin, ArrowRight, Play, BookOpen } from 'lucide-react';

interface ViplavaHeroProps {
  onEnterQuest: () => void;
  onWatchTrailer: () => void;
  onOpenMobileMenu?: () => void;
}

export const ViplavaHero: React.FC<ViplavaHeroProps> = ({
  onEnterQuest,
  onWatchTrailer
}) => {
  const { scrollY } = useScroll();

  // Scroll parallax transforms
  const backgroundY = useTransform(scrollY, [0, 800], [0, 140]);
  const textY = useTransform(scrollY, [0, 600], [0, -60]);
  const textOpacity = useTransform(scrollY, [0, 450], [1, 0.25]);

  return (
    <section 
      id="hero" 
      className="relative w-full min-h-[92vh] sm:min-h-screen flex flex-col justify-between overflow-hidden bg-[#070A14] select-none"
    >
      {/* 1. CINEMATIC BACKGROUND COMPOSITION (KURUKSHETRA GOLDEN DAWN & SACRED CHARIOT BLEND) */}
      <motion.div 
        style={{ y: backgroundY }}
        className="absolute inset-0 w-full h-full pointer-events-none z-0"
      >
        {/* Sacred Landscape at Golden Hour */}
        <img
          src="/src/assets/images/vrindavan_temple_sunset_1791999562839.jpg"
          alt="Gokul Mathura Sacred Temple Landscape"
          className="absolute right-0 top-0 w-full lg:w-[68%] h-full object-cover object-top sm:object-center opacity-75 filter brightness-95"
        />

        {/* Animated Transcendental Celestial Medallion & Kala Chakra Element */}
        <div className="absolute right-2 sm:right-10 lg:right-20 top-12 sm:top-16 w-64 sm:w-84 lg:w-[520px] h-64 sm:h-84 lg:h-[520px] z-10 pointer-events-none">
          {/* Transcendental Solar Radiance Halo */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#D4AF37]/35 via-[#F3C74C]/25 to-transparent blur-3xl animate-pulse" />

          {/* Masked Celestial Medallion */}
          <div className="w-full h-full relative rounded-full overflow-hidden [mask-image:radial-gradient(ellipse_at_center,black_60%,transparent_78%)] [-webkit-mask-image:radial-gradient(ellipse_at_center,black_60%,transparent_78%)]">
            <div className="w-full h-full bg-[#120F08]/40 relative flex items-center justify-center">
              
              {/* Animated Celestial Vector Graphics */}
              <svg viewBox="0 0 400 400" className="w-full h-full object-cover">
                <defs>
                  <radialGradient id="celestialGlow" cx="50%" cy="38%" r="60%">
                    <stop offset="0%" stopColor="#FFF2A3" stopOpacity="0.95" />
                    <stop offset="35%" stopColor="#F59E0B" stopOpacity="0.8" />
                    <stop offset="65%" stopColor="#D97706" stopOpacity="0.5" />
                    <stop offset="100%" stopColor="#070A14" stopOpacity="0" />
                  </radialGradient>
                  <linearGradient id="celestialGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FFF1B8" />
                    <stop offset="50%" stopColor="#D4AF37" />
                    <stop offset="100%" stopColor="#8A6708" />
                  </linearGradient>
                </defs>

                {/* Golden Atmosphere Aura */}
                <circle cx="200" cy="190" r="160" fill="url(#celestialGlow)" />

                {/* Divine Kala Chakra Wheel (12 Spokes of Time) with Slow Rotation */}
                <g transform="translate(200, 200)" className="animate-[spin_60s_linear_infinite]" opacity="0.85">
                  <circle cx="0" cy="0" r="110" fill="none" stroke="url(#celestialGoldGrad)" strokeWidth="2.5" strokeDasharray="6 4" />
                  <circle cx="0" cy="0" r="95" fill="none" stroke="url(#celestialGoldGrad)" strokeWidth="1.5" />
                  <circle cx="0" cy="0" r="45" fill="none" stroke="url(#celestialGoldGrad)" strokeWidth="3" />
                  <circle cx="0" cy="0" r="12" fill="#F59E0B" />
                  {[...Array(12)].map((_, i) => (
                    <line 
                      key={i} 
                      x1="0" 
                      y1="-95" 
                      x2="0" 
                      y2="95" 
                      stroke="url(#celestialGoldGrad)" 
                      strokeWidth="2" 
                      transform={`rotate(${i * 15})`} 
                    />
                  ))}
                </g>

                {/* Outer Concentric Sacred Rings */}
                <circle cx="200" cy="200" r="145" fill="none" stroke="#F3C74C" strokeWidth="1" strokeDasharray="3 9" opacity="0.6" className="animate-[spin_40s_linear_infinite_reverse]" />

                {/* Floating Panchajanya Conch Shell Motif in Golden Rays */}
                <path 
                  d="M 200,140 C 220,120 250,130 260,150 C 270,170 250,190 230,200 C 210,210 190,190 190,170 Z" 
                  fill="#FFF9E6" 
                  opacity="0.9" 
                  filter="drop-shadow(0 0 8px #F59E0B)"
                />
              </svg>

              <img 
                src="/src/assets/images/viplava_hero_festival_1791925226306.jpg" 
                alt="Transcendental Light Blend" 
                className="absolute inset-0 w-full h-full object-cover mix-blend-screen opacity-45 filter contrast-125 brightness-110"
              />
            </div>
          </div>
        </div>

        {/* Deep Atmosphere Vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#090D18] via-transparent to-transparent opacity-90" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#090D18] via-[#090D18]/70 to-transparent w-full sm:w-2/3" />
      </motion.div>

      {/* 2. LEFT PANEL: DRAMATIC DIAGONAL FLOWING NAVY WAVE WITH GLOWING GOLD BORDER */}
      <div className="absolute inset-y-0 left-0 w-full lg:w-[64%] z-10 pointer-events-none">
        <svg 
          viewBox="0 0 1000 1000" 
          preserveAspectRatio="none" 
          className="absolute inset-0 w-full h-full"
        >
          <defs>
            <linearGradient id="mobileWaveGradGita" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0D1120" stopOpacity="0.97" />
              <stop offset="50%" stopColor="#090D18" stopOpacity="0.95" />
              <stop offset="85%" stopColor="#070A14" stopOpacity="0.92" />
              <stop offset="100%" stopColor="#05070E" stopOpacity="0.85" />
            </linearGradient>

            <linearGradient id="mobileGoldBorderGita" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFF1B8" />
              <stop offset="30%" stopColor="#D4AF37" />
              <stop offset="70%" stopColor="#F3C74C" />
              <stop offset="100%" stopColor="#8A6708" />
            </linearGradient>

            <filter id="borderGlowFilterGita" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3.5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Flowing Wave Shape */}
          <path
            d="M 0,0 
               L 720,0 
               C 650,220 540,400 580,580 
               C 620,740 700,840 760,1000 
               L 0,1000 
               Z"
            fill="url(#mobileWaveGradGita)"
          />

          {/* Glowing Golden Piping Border */}
          <path
            d="M 720,0 
               C 650,220 540,400 580,580 
               C 620,740 700,840 760,1000"
            fill="none"
            stroke="url(#mobileGoldBorderGita)"
            strokeWidth="3.5"
            filter="url(#borderGlowFilterGita)"
          />

          {/* Secondary Golden Accent Hairline */}
          <path
            d="M 710,0 
               C 640,220 530,400 570,580 
               C 610,740 690,840 750,1000"
            fill="none"
            stroke="#D4AF37"
            strokeWidth="1"
            opacity="0.35"
          />
        </svg>

        {/* Faint Ornamental Mandala Vector Linework in Upper Left */}
        <div className="absolute -top-20 -left-20 w-80 h-80 opacity-20 pointer-events-none">
          <svg viewBox="0 0 200 200" className="w-full h-full text-[#D4AF37]" fill="none" stroke="currentColor" strokeWidth="0.75">
            <circle cx="100" cy="100" r="90" strokeDasharray="3 3" />
            <circle cx="100" cy="100" r="75" />
            <circle cx="100" cy="100" r="55" strokeDasharray="2 2" />
            <circle cx="100" cy="100" r="35" />
            {[...Array(16)].map((_, i) => (
              <line key={i} x1="100" y1="10" x2="100" y2="190" transform={`rotate(${i * 11.25} 100 100)`} opacity="0.5" />
            ))}
          </svg>
        </div>
      </div>

      {/* 3. HERO CONTENT LAYER (OPTIMIZED FOR 360-430px MOBILE VIEWPORT) */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-20 sm:pt-24 pb-8 flex-grow flex flex-col justify-center">
        <motion.div 
          style={{ y: textY, opacity: textOpacity }}
          className="max-w-md sm:max-w-lg lg:max-w-2xl text-left space-y-3.5 sm:space-y-4"
        >
          {/* ISKCON 60 & Youth Forum Badge Motif */}
          <div className="flex flex-wrap items-center gap-2 pt-2">
            <div className="px-3 py-1 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/45 flex items-center gap-2 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-[#F3C74C] animate-pulse" />
              <span className="text-[10px] sm:text-xs font-cinzel font-bold tracking-[0.25em] text-[#F3C74C] uppercase">
                ISKCON 60 · 1966–2026
              </span>
            </div>
            <span className="text-[10px] font-cinzel font-semibold tracking-wider text-[#D4AF37]/90 uppercase">
              ISKCON Youth Forum
            </span>
          </div>

          {/* Grand VIPLAVA 2026 Display Typography */}
          <div className="space-y-0 sm:space-y-1">
            <div className="text-[11px] sm:text-xs font-cinzel font-extrabold tracking-[0.3em] text-[#F3C74C] uppercase">
              MEGA YOUTH FEST · A REVOLUTION IN CONSCIOUSNESS
            </div>
            <h1 className="text-5xl sm:text-7xl lg:text-8xl font-cinzel font-black tracking-tight leading-[0.95] text-white">
              <span className="gold-gradient-text drop-shadow-[0_2px_15px_rgba(212,175,55,0.4)]">
                VIPLAV<span className="text-[#F3C74C]">A</span>
              </span>
            </h1>
            <div className="text-3xl sm:text-4xl lg:text-5xl font-cinzel font-black tracking-widest text-slate-100/90 -mt-1 sm:-mt-2">
              2026
            </div>
          </div>

          {/* SRILA PRABHUPADA — THE SPIRITUAL AMBASSADOR */}
          <div className="pt-0.5 space-y-1">
            <h2 className="text-xs sm:text-sm lg:text-base font-cinzel font-bold tracking-[0.25em] text-[#E5C158] uppercase">
              SRILA PRABHUPADA — THE SPIRITUAL AMBASSADOR
            </h2>
            <div className="text-[11px] sm:text-xs text-[#FDE68A] font-medium tracking-wide">
              Bhagavad Gita Wisdom Quest · 18 Chapters of Transcendental Realization
            </div>
          </div>

          {/* Location & Festival Dates Badge */}
          <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm font-semibold text-[#D4AF37]">
            <div className="flex items-center gap-1.5">
              <MapPin size={14} className="text-[#E67E22] shrink-0" />
              <span className="tracking-wider uppercase">GOKUL DHAM (RAMAN RETI, MAHAVAN)</span>
            </div>
            <span className="text-white/40">·</span>
            <span className="text-[#F3C74C] text-[11px] font-cinzel font-bold">30TH OCT – 1ST NOV</span>
          </div>

          {/* Concise Event Introduction */}
          <p className="text-xs sm:text-sm text-slate-300 font-light leading-relaxed max-w-sm sm:max-w-md font-sans-body">
            Join thousands of youth thinkers uniting at sacred Gokul Dham for VIPLAVA 2026. Commemorating 60 glorious years of ISKCON and honoring His Divine Grace A.C. Bhaktivedanta Swami Prabhupada, The Spiritual Ambassador, through the timeless realizations of <span className="text-[#F3C74C] font-normal italic">Bhagavad-gita As It Is</span>.
          </p>

          {/* Actions: ENTER THE QUEST & Watch Event Trailer */}
          <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={onEnterQuest}
              className="gold-btn-gradient text-[#090D18] font-cinzel font-black text-xs sm:text-sm tracking-wider uppercase px-6 sm:px-8 py-3.5 rounded-full flex items-center justify-center gap-2.5 transition-all shadow-xl shadow-[#D4AF37]/25 cursor-pointer"
            >
              <span>ENTER THE QUEST</span>
              <ArrowRight size={15} className="text-[#090D18]" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={onWatchTrailer}
              className="px-5 py-3 rounded-full bg-white/5 border border-[#D4AF37]/40 text-[#F3C74C] font-cinzel text-xs font-bold tracking-wider uppercase flex items-center justify-center gap-2 hover:bg-white/10 transition-colors cursor-pointer backdrop-blur-sm shadow-md"
            >
              <Play size={13} className="fill-[#F3C74C]" />
              <span>Watch Festival Trailer</span>
            </motion.button>
          </div>
        </motion.div>
      </div>

      {/* 4. BOTTOM WATER-INSPIRED DECORATIVE ELEMENTS (PEACOCK FEATHER & SACRED GITA SHLOKA CUE) */}
      <div className="relative z-20 w-full px-4 sm:px-8 pb-3 pt-4 flex items-end justify-between pointer-events-none">
        
        {/* Peacock Feather Illustration (Bottom Left) */}
        <div className="w-16 sm:w-20 opacity-80 drop-shadow-[0_0_10px_rgba(0,180,216,0.3)]">
          <svg viewBox="0 0 60 80" className="w-full h-full" fill="none">
            {/* Peacock Feather Eye */}
            <ellipse cx="30" cy="25" rx="14" ry="18" fill="#0077B6" />
            <ellipse cx="30" cy="27" rx="10" ry="13" fill="#0096C7" />
            <ellipse cx="30" cy="29" rx="7" ry="9" fill="#F3C74C" />
            <ellipse cx="30" cy="30" rx="4" ry="5" fill="#48CAE4" />
            <circle cx="30" cy="30" r="2" fill="#03045E" />
            {/* Feathery Wisps */}
            <path d="M 30,42 Q 22,55 12,75" stroke="#0077B6" strokeWidth="1.5" />
            <path d="M 30,42 Q 38,55 48,75" stroke="#0077B6" strokeWidth="1.5" />
            <path d="M 30,40 L 30,80" stroke="#0096C7" strokeWidth="2" />
          </svg>
        </div>

        {/* Center Scroll Cue: SCROLL TO EXPLORE GITA */}
        <div className="flex flex-col items-center text-center space-y-1">
          <div className="w-4 h-7 rounded-full border border-[#D4AF37]/60 flex items-start justify-center p-1">
            <div className="w-1 h-2 rounded-full bg-[#D4AF37] animate-bounce" />
          </div>
          <span className="text-[9px] font-cinzel font-bold tracking-[0.25em] text-[#D4AF37]/80 uppercase">
            SCROLL TO EXPLORE
          </span>
        </div>

        {/* Sacred Conch Shell & Lotus on Water (Bottom Right) */}
        <div className="flex items-center gap-2">
          {/* Earthen Diya with Flame */}
          <div className="w-9 h-7 relative flex items-center justify-center">
            <div className="absolute -top-3 w-3 h-5 rounded-full bg-gradient-to-t from-orange-500 via-amber-400 to-yellow-200 animate-pulse filter drop-shadow-[0_0_8px_#FFA500]" />
            <div className="w-8 h-3.5 rounded-b-full bg-amber-800 border-t border-amber-600 shadow-md" />
          </div>

          {/* Pink Lotus Flower */}
          <div className="w-10 sm:w-12 h-9 text-pink-400 drop-shadow-[0_0_10px_rgba(236,72,153,0.5)]">
            <svg viewBox="0 0 50 40" className="w-full h-full" fill="currentColor">
              <path d="M25 5 C22 15 15 25 10 32 C18 35 25 35 25 35 C25 35 32 35 40 32 C35 25 28 15 25 5 Z" fill="#F472B6" />
              <path d="M25 12 C18 22 8 28 2 35 C10 38 20 38 25 38 C30 38 40 38 48 35 C42 28 32 22 25 12 Z" fill="#FB7185" opacity="0.9" />
              <circle cx="25" cy="26" r="3" fill="#FDE047" />
            </svg>
          </div>
        </div>

      </div>

    </section>
  );
};
