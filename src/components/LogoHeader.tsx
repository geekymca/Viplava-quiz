import React from 'react';
import { Link } from 'react-router-dom';

export const LogoHeader: React.FC = () => {
  return (
    <header className="w-full border-b border-white/10 backdrop-blur-md bg-[#080C14]/70 sticky top-0 z-40 transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4">
        
        {/* Left: ISKCON Youth Forum Brand */}
        <Link to="/" className="flex items-center gap-3 group shrink-0">
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-gradient-to-tr from-[#EA580C] to-[#F59E0B] p-[2px] shadow-lg shadow-amber-500/20 group-hover:shadow-amber-500/40 transition-shadow">
            <div className="w-full h-full rounded-full bg-[#0B0F19] flex items-center justify-center overflow-hidden">
              {/* Sacred ISKCON Tilak & Lotus Icon SVG */}
              <svg viewBox="0 0 40 40" className="w-6 h-6 text-amber-400" fill="currentColor">
                <path d="M17 6h6v17c0 3-1.5 5.5-3 7-1.5-1.5-3-4-3-7V6z" fill="#F59E0B" />
                <path d="M19 8h2v12c0 2-0.7 3.5-1 4.5-0.3-1-1-2.5-1-4.5V8z" fill="#FDE68A" />
                <path d="M20 28c-3 0-5 3-5 5.5 2 0.5 4 0 5-1.5 1 1.5 3 2 5 1.5 0-2.5-2-5.5-5-5.5z" fill="#10B981" />
              </svg>
            </div>
          </div>
          <div className="text-left">
            <div className="flex items-center gap-1.5">
              <span className="text-sm sm:text-base font-extrabold tracking-tight text-white group-hover:text-amber-400 transition-colors">
                ISKCON
              </span>
              <span className="text-[11px] font-semibold text-amber-400 tracking-wider uppercase bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">
                Youth Forum
              </span>
            </div>
            <p className="text-[10px] sm:text-[11px] text-gray-400 font-medium">
              Srila Prabhupada Mission
            </p>
          </div>
        </Link>
        
        {/* Center: VIPLAVA 2026 Core Event Badge */}
        <div className="hidden md:flex flex-col items-center text-center">
          <Link to="/" className="hover:opacity-95 transition-opacity">
            <span className="text-sm font-extrabold tracking-widest uppercase bg-gradient-to-r from-amber-200 via-amber-400 to-orange-400 bg-clip-text text-transparent">
              VIPLAVA 2026
            </span>
            <div className="text-[10px] text-gray-400 font-medium tracking-wide">
              At Gokul Mathura Dham · A Revolution in Consciousness
            </div>
          </Link>
        </div>

        {/* Right: EthicCraft Club & Leaderboard */}
        <div className="flex items-center gap-3 sm:gap-5 shrink-0">
          <nav className="flex items-center gap-2 sm:gap-4 text-xs font-semibold text-gray-300">
            <Link 
              to="/leaderboard" 
              className="px-3 py-1.5 rounded-lg text-amber-300 hover:text-amber-200 bg-white/5 hover:bg-white/10 transition-all border border-amber-400/20"
            >
              Leaderboard
            </Link>
          </nav>

          {/* EthicCraft Logo Mark */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-gradient-to-tr from-[#F59E0B] to-[#EF4444] p-[2px] shadow-lg shadow-orange-500/20">
              <div className="w-full h-full rounded-full bg-[#0B0F19] flex items-center justify-center">
                <svg viewBox="0 0 40 40" className="w-6 h-6 text-orange-400" fill="currentColor">
                  <path d="M20 5c1 5 6 9 6 15 0 5.5-4.5 10-10 10S6 25.5 6 20c0-6 7-11 8-15 0 3 2 6 6 0z" fill="#F97316" />
                  <path d="M20 12c0.8 3 4 5.5 4 9 0 3.3-2.7 6-6 6s-6-2.7-6-6c0-3.5 4.5-6.5 5-9 0 2 1.2 3.5 3 0z" fill="#FDE047" />
                </svg>
              </div>
            </div>
            <div className="hidden lg:block text-left">
              <h2 className="text-xs font-bold text-gray-200">EthicCraft Club</h2>
              <p className="text-[10px] text-amber-400 font-medium">Youth Forum</p>
            </div>
          </Link>
        </div>

      </div>
    </header>
  );
};
