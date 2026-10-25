import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUp, MapPin, Heart } from 'lucide-react';

export const ViplavaFooter: React.FC = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="w-full bg-[#05070E] border-t border-[#D4AF37]/20 py-10 px-4 sm:px-6 lg:px-8 text-slate-400 text-xs relative z-30">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        
        {/* Left Branding */}
        <div className="flex flex-col items-center md:items-start space-y-1 text-center md:text-left">
          <div className="flex items-center gap-2">
            <span className="font-cinzel font-bold text-sm text-[#F3C74C] tracking-widest uppercase">
              VIPLAVA 2026
            </span>
            <span className="text-slate-600">·</span>
            <span className="text-xs text-slate-300 font-serif">The Wisdom Quest</span>
          </div>
          <p className="text-[11px] text-slate-400 flex items-center gap-1">
            <MapPin size={12} className="text-[#E67E22]" /> Hosted at Gokul Mathura Dham
          </p>
          <p className="text-[10px] text-slate-400">
            Organized by ISKCON Youth Forum & EthicCraft Club
          </p>
        </div>

        {/* Center Links */}
        <div className="flex flex-wrap items-center justify-center gap-6 text-[11px] font-semibold tracking-wider uppercase text-slate-300">
          <Link to="/" className="hover:text-[#F3C74C] transition-colors">Home</Link>
          <Link to="/register" className="hover:text-[#F3C74C] transition-colors">Register</Link>
          <Link to="/leaderboard" className="hover:text-[#F3C74C] transition-colors">Leaderboard</Link>
        </div>

        {/* Right Copyright */}
        <div className="text-center md:text-right text-[11px] text-slate-400 space-y-1">
          <p>© 2026 Viplava Youth Festival. All Rights Reserved.</p>
          <p className="text-[10px] text-[#D4AF37]/80 italic font-serif">
            Dedicated to His Divine Grace A.C. Bhaktivedanta Swami Prabhupada
          </p>
        </div>

      </div>

      {/* Floating Scroll-to-Top Button (matching user mockup) */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-50 w-11 h-11 rounded-full bg-[#0B1020]/90 border border-[#D4AF37]/60 text-[#F3C74C] flex items-center justify-center shadow-xl shadow-black/80 hover:bg-[#D4AF37] hover:text-black transition-all duration-300 cursor-pointer"
          aria-label="Scroll to top"
        >
          <ArrowUp size={18} />
        </button>
      )}
    </footer>
  );
};
