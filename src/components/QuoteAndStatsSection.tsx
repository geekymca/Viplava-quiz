import React, { useState, useEffect } from 'react';
import { useQuiz } from '../QuizContext';

export const QuoteAndStatsSection: React.FC = () => {
  const { slotSchedule, isQuizLive } = useQuiz();

  // Target: 29th October 2026 (11 days)
  const calculateTimeLeft = () => {
    const target = new Date('2026-10-29T10:00:00').getTime();
    const now = new Date().getTime();
    const diff = target - now;

    if (diff > 0) {
      return {
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60)
      };
    }

    // Default fallback to 11 days
    return {
      days: 11,
      hours: 14,
      minutes: 36,
      seconds: 45
    };
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        if (prev.days > 0) return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatNum = (n: number) => String(Math.max(0, n)).padStart(2, '0');

  return (
    <section className="relative w-full z-20 -mt-2">
      
      {/* Top Flowing Parchment Wave Boundary */}
      <div className="w-full overflow-hidden leading-none select-none pointer-events-none">
        <svg 
          viewBox="0 0 1440 60" 
          className="w-full h-8 sm:h-14 text-[#F7F2E7]" 
          fill="currentColor"
          preserveAspectRatio="none"
        >
          <path d="M0,35 C200,60 360,20 540,48 C720,70 900,15 1080,45 C1260,70 1380,28 1440,50 L1440,60 L0,60 Z" />
        </svg>
      </div>

      {/* Main Parchment Canvas */}
      <div className="parchment-bg text-[#2D2416] py-8 sm:py-12 px-4 sm:px-6 lg:px-8 border-y border-[#D4AF37]/25 shadow-inner relative overflow-hidden">
        
        {/* Top Lotus Motif in Corner */}
        <div className="absolute top-2 left-3 w-10 h-8 opacity-60 pointer-events-none">
          <svg viewBox="0 0 50 40" className="w-full h-full text-pink-500" fill="currentColor">
            <path d="M25 5 C22 15 15 25 10 32 C18 35 25 35 25 35 C25 35 32 35 40 32 C35 25 28 15 25 5 Z" fill="#F472B6" />
            <path d="M25 12 C18 22 8 28 2 35 C10 38 20 38 25 38 C30 38 40 38 48 35 C42 28 32 22 25 12 Z" fill="#FB7185" opacity="0.8" />
          </svg>
        </div>

        <div className="max-w-5xl mx-auto flex flex-col lg:flex-row gap-8 lg:gap-14 items-center justify-between">
          
          {/* 1. Bhagavad Gita Verified Quotation */}
          <div className="w-full lg:w-1/2 space-y-2 relative pl-5 sm:pl-8">
            <div className="absolute -left-1 sm:left-0 -top-2 text-4xl sm:text-5xl font-serif text-[#D4AF37] leading-none select-none font-cormorant font-bold">
              “
            </div>
            
            <p className="text-lg sm:text-xl lg:text-2xl font-cormorant italic font-semibold leading-relaxed text-[#2C2114]">
              In this world, there is nothing so sublime and pure as transcendental knowledge. Such knowledge is the mature fruit of all mysticism.
            </p>
            
            <div className="pt-0.5 flex items-center gap-2 text-xs sm:text-sm font-cinzel font-bold text-[#8A6708] tracking-wider uppercase">
              <span className="w-5 h-[1.5px] bg-[#D4AF37]" />
              <span>Bhagavad-gita As It Is · 4.38</span>
            </div>
          </div>

          {/* 2. Active 300-Question Wisdom Quest Status */}
          <div className="w-full lg:w-1/2 flex flex-col items-center lg:items-end space-y-3">
            
            <div className="flex flex-col items-center lg:items-end text-center lg:text-right space-y-1">
              <span className="text-xs sm:text-sm font-cinzel font-black tracking-[0.2em] text-[#8C6B1B] uppercase">
                VIPLAVA 2026 · GOKUL MATHURA DHAM
              </span>
              <div className="flex items-center gap-2 text-[11px] font-bold text-emerald-800 tracking-wider uppercase bg-emerald-500/20 px-3 py-1 rounded-full border border-emerald-600/30">
                <span className="w-2 h-2 rounded-full bg-emerald-600 animate-ping" />
                <span>BHAGAVAD GITA WISDOM QUEST — LIVE & OPEN</span>
              </div>
            </div>

            {/* 300-Question Pool Feature Card */}
            <div className="p-4 rounded-xl bg-[#F0E8D5]/80 border border-[#D4AF37]/50 shadow-sm w-full max-w-xs sm:max-w-sm text-center lg:text-right space-y-1">
              <div className="text-sm font-bold text-[#3E311A] font-cinzel">
                300 Authentic Gita Questions
              </div>
              <p className="text-[11px] text-[#785E22] leading-relaxed">
                Every participant gets 20 randomized questions with cryptographically secured anti-cheat verification.
              </p>
            </div>

            <div className="text-[11px] text-[#785E22] font-semibold text-center lg:text-right">
              20 Random Questions per Attempt · Unlimited Learning
            </div>

          </div>

        </div>

      </div>

      {/* Bottom Flowing Navy Wave Boundary */}
      <div className="w-full overflow-hidden leading-none select-none pointer-events-none -mt-1">
        <svg 
          viewBox="0 0 1440 60" 
          className="w-full h-8 sm:h-14 text-[#090D18]" 
          fill="currentColor"
          preserveAspectRatio="none"
        >
          <path d="M0,0 L1440,0 C1260,35 1080,10 900,40 C720,65 540,15 360,45 C200,10 0,30 0,0 Z" />
        </svg>
      </div>

    </section>
  );
};
