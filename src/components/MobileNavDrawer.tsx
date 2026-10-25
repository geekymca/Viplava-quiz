import React from 'react';
import { Link } from 'react-router-dom';
import { 
  X, 
  Home, 
  BookOpen, 
  HelpCircle, 
  Trophy, 
  Image as ImageIcon, 
  Phone,
  User,
  Sparkles
} from 'lucide-react';

interface MobileNavDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenGallery: () => void;
  onOpenContact: () => void;
}

export const MobileNavDrawer: React.FC<MobileNavDrawerProps> = ({
  isOpen,
  onClose,
  onOpenGallery,
  onOpenContact,
}) => {
  if (!isOpen) return null;

  const scrollTo = (id: string) => {
    onClose();
    const elem = document.getElementById(id);
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/80 backdrop-blur-md animate-fadeIn">
      {/* Backdrop overlay touch to close */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Drawer Panel */}
      <div className="relative w-4/5 max-w-sm h-full bg-[#080C16] border-l border-[#D4AF37]/30 shadow-2xl p-6 flex flex-col justify-between overflow-y-auto z-10">
        
        {/* Drawer Header */}
        <div>
          <div className="flex items-center justify-between pb-5 border-b border-[#D4AF37]/20">
            <div className="flex items-center gap-2.5">
              {/* Lotus Logo */}
              <div className="w-8 h-8 text-[#D4AF37]">
                <svg viewBox="0 0 48 48" className="w-full h-full" fill="currentColor">
                  <path d="M24 6c0 0-4 7-4 13 0 4 2 7 4 8 2-1 4-4 4-8 0-6-4-13-4-13z" fill="#F3C74C" />
                  <path d="M20 12c-2.5 3-6 7.5-6 12 0 4.5 3 7.5 7 8-1.5-2.5-2-5.5-2-8 0-4 1-8 1-12z" fill="#D4AF37" opacity="0.9" />
                  <path d="M28 12c2.5 3 6 7.5 6 12 0 4.5-3 7.5-7 8 1.5-2.5 2-5.5 2-8 0-4 1-8 1-12z" fill="#D4AF37" opacity="0.9" />
                  <path d="M12 36c4 3 8 4 12 4s8-1 12-4c-4 1-8 1.5-12 1.5s-8-.5-12-1.5z" fill="#E5C158" />
                </svg>
              </div>
              <div>
                <span className="font-cinzel text-base font-bold tracking-widest text-[#F3C74C]">
                  VIPLAVA
                </span>
                <p className="text-[9px] tracking-wider text-[#D4AF37]/80 uppercase -mt-0.5">
                  The Wisdom Quest
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/10"
              aria-label="Close menu"
            >
              <X size={20} />
            </button>
          </div>

          {/* Navigation Links matching mockup */}
          <nav className="mt-6 space-y-1.5 font-cinzel text-xs tracking-wider uppercase font-semibold text-slate-200">
            <button
              onClick={() => scrollTo('hero')}
              className="w-full flex items-center gap-3.5 px-3 py-3 rounded-xl hover:bg-[#D4AF37]/10 hover:text-[#F3C74C] transition-colors text-left"
            >
              <Home size={16} className="text-[#D4AF37]" />
              <span>Home</span>
            </button>

            <button
              onClick={() => scrollTo('about')}
              className="w-full flex items-center gap-3.5 px-3 py-3 rounded-xl hover:bg-[#D4AF37]/10 hover:text-[#F3C74C] transition-colors text-left"
            >
              <BookOpen size={16} className="text-[#D4AF37]" />
              <span>About</span>
            </button>

            <button
              onClick={() => scrollTo('themes')}
              className="w-full flex items-center gap-3.5 px-3 py-3 rounded-xl hover:bg-[#D4AF37]/10 hover:text-[#F3C74C] transition-colors text-left"
            >
              <HelpCircle size={16} className="text-[#D4AF37]" />
              <span>Quiz Themes</span>
            </button>

            <Link
              to="/leaderboard"
              onClick={onClose}
              className="w-full flex items-center gap-3.5 px-3 py-3 rounded-xl hover:bg-[#D4AF37]/10 hover:text-[#F3C74C] transition-colors text-left"
            >
              <Trophy size={16} className="text-[#D4AF37]" />
              <span>Leaderboard</span>
            </Link>

            <button
              onClick={() => {
                onClose();
                onOpenGallery();
              }}
              className="w-full flex items-center gap-3.5 px-3 py-3 rounded-xl hover:bg-[#D4AF37]/10 hover:text-[#F3C74C] transition-colors text-left"
            >
              <ImageIcon size={16} className="text-[#D4AF37]" />
              <span>Gallery</span>
            </button>

            <button
              onClick={() => {
                onClose();
                onOpenContact();
              }}
              className="w-full flex items-center gap-3.5 px-3 py-3 rounded-xl hover:bg-[#D4AF37]/10 hover:text-[#F3C74C] transition-colors text-left"
            >
              <Phone size={16} className="text-[#D4AF37]" />
              <span>Contact</span>
            </button>
          </nav>
        </div>

        {/* Drawer Footer Actions */}
        <div className="pt-6 border-t border-[#D4AF37]/20 space-y-3">
          <Link
            to="/register"
            onClick={onClose}
            className="w-full py-3 rounded-full gold-btn-gradient text-[#090D18] font-cinzel font-bold text-xs tracking-wider uppercase flex items-center justify-center gap-2 shadow-lg"
          >
            <User size={14} />
            <span>Login / Register</span>
          </Link>

          <Link
            to="/admin"
            onClick={onClose}
            className="w-full py-2.5 rounded-full border border-white/10 text-slate-400 hover:text-white font-cinzel text-[11px] tracking-wider uppercase flex items-center justify-center gap-1.5"
          >
            <Sparkles size={12} className="text-[#D4AF37]" />
            <span>Admin Portal</span>
          </Link>
          
          <div className="text-center text-[10px] text-slate-500 font-serif pt-1">
            Gokul Dham, Mathura · ISKCON North Wing
          </div>
        </div>

      </div>
    </div>
  );
};
