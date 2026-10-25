import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Menu, X, Trophy } from 'lucide-react';

interface ViplavaNavbarProps {
  onOpenGuidelines?: () => void;
  onOpenGallery?: () => void;
  onOpenContact?: () => void;
}

export const ViplavaNavbar: React.FC<ViplavaNavbarProps> = ({
  onOpenGuidelines,
  onOpenGallery,
  onOpenContact,
}) => {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-[#090D18]/90 backdrop-blur-md border-b border-[#D4AF37]/25 shadow-xl shadow-black/40 py-3' 
          : 'bg-gradient-to-b from-[#090D18]/80 via-[#090D18]/40 to-transparent py-4 sm:py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        
        {/* Left: Gold Viplava Lotus Logo & ISKCON Youth Forum Branding */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 sm:w-11 sm:h-11 relative flex items-center justify-center">
            {/* Sacred Golden Lotus SVG */}
            <svg viewBox="0 0 48 48" className="w-full h-full text-[#D4AF37] drop-shadow-[0_0_8px_rgba(212,175,55,0.6)] group-hover:scale-105 transition-transform" fill="currentColor">
              <path d="M24 6c0 0-4 7-4 13 0 4 2 7 4 8 2-1 4-4 4-8 0-6-4-13-4-13z" fill="#F3C74C" />
              <path d="M20 12c-2.5 3-6 7.5-6 12 0 4.5 3 7.5 7 8-1.5-2.5-2-5.5-2-8 0-4 1-8 1-12z" fill="#D4AF37" opacity="0.9" />
              <path d="M28 12c2.5 3 6 7.5 6 12 0 4.5-3 7.5-7 8 1.5-2.5 2-5.5 2-8 0-4-1-8-1-12z" fill="#D4AF37" opacity="0.9" />
              <path d="M14 18c-3 3-6 8-6 12 0 5 4 8 9 8-3-2-4.5-5-4.5-8 0-4 1.5-8 1.5-12z" fill="#B8860B" opacity="0.8" />
              <path d="M34 18c3 3 6 8 6 12 0 5-4 8-9 8 3-2 4.5-5 4.5-8 0-4-1.5-8-1.5-12z" fill="#B8860B" opacity="0.8" />
              <path d="M12 36c4 3 8 4 12 4s8-1 12-4c-4 1-8 1.5-12 1.5s-8-.5-12-1.5z" fill="#E5C158" />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="font-cinzel text-lg sm:text-xl font-bold tracking-widest text-[#F3C74C] group-hover:text-white transition-colors">
              VIPLAVA
            </span>
            <span className="text-[9px] tracking-[0.2em] font-medium text-[#D4AF37]/90 uppercase -mt-1 font-serif">
              ISKCON Youth Forum
            </span>
          </div>
        </Link>

        {/* Clean Desktop Nav Links - Core Essentials Only */}
        <nav className="hidden md:flex items-center gap-8 text-xs font-semibold tracking-wider text-slate-300 uppercase">
          <button 
            onClick={() => scrollToSection('hero')}
            className="hover:text-[#F3C74C] transition-colors relative py-1 text-[#F3C74C] after:content-[''] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[#D4AF37]"
          >
            Home
          </button>
          <button 
            onClick={() => scrollToSection('themes')}
            className="hover:text-[#F3C74C] transition-colors py-1"
          >
            Quiz
          </button>
          <Link 
            to="/leaderboard" 
            className="hover:text-[#F3C74C] transition-colors py-1 flex items-center gap-1.5"
          >
            <Trophy size={13} className="text-[#D4AF37]" />
            <span>Leaderboard</span>
          </Link>
        </nav>

        {/* Right CTA Button */}
        <div className="hidden sm:flex items-center gap-3">
          <Link
            to="/register"
            className="flex items-center gap-2 px-5 py-2 rounded-full border border-[#D4AF37]/50 text-[#F3C74C] text-xs font-bold tracking-wide uppercase hover:bg-[#D4AF37]/15 hover:border-[#D4AF37] transition-all duration-200 shadow-sm shadow-[#D4AF37]/10"
          >
            <User size={14} className="text-[#D4AF37]" />
            <span>Login / Register</span>
          </Link>
        </div>

        {/* Mobile menu toggle button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-slate-300 hover:text-white"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>

      </div>

      {/* Streamlined Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#090D18]/95 backdrop-blur-xl border-b border-[#D4AF37]/20 px-6 py-6 space-y-4">
          <div className="flex flex-col space-y-3 text-sm font-semibold uppercase tracking-wider text-slate-300">
            <button 
              onClick={() => scrollToSection('hero')}
              className="text-left text-[#F3C74C] py-2 border-b border-white/5"
            >
              Home
            </button>
            <button 
              onClick={() => scrollToSection('themes')}
              className="text-left hover:text-[#F3C74C] py-2 border-b border-white/5"
            >
              Quiz
            </button>
            <Link 
              to="/leaderboard" 
              onClick={() => setMobileMenuOpen(false)}
              className="text-left hover:text-[#F3C74C] py-2 border-b border-white/5 flex items-center justify-between"
            >
              <span>Leaderboard</span>
              <Trophy size={14} className="text-[#D4AF37]" />
            </Link>
          </div>

          <div className="pt-2">
            <Link
              to="/register"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-full border border-[#D4AF37] text-[#F3C74C] text-xs font-bold uppercase bg-[#D4AF37]/10"
            >
              <User size={15} />
              <span>Login / Register</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
