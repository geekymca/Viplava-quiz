import React from 'react';
import { X, Play, Volume2, Sparkles, MapPin } from 'lucide-react';

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VideoModal: React.FC<VideoModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="bg-[#090D18] border border-[#D4AF37]/50 rounded-2xl max-w-2xl w-full p-5 sm:p-7 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
        >
          <X size={20} />
        </button>

        <div className="flex items-center gap-2 mb-3">
          <Sparkles size={14} className="text-[#D4AF37]" />
          <span className="text-[11px] font-cinzel font-bold text-[#F3C74C] uppercase tracking-widest">
            Viplava 2026 Conclave Preview
          </span>
        </div>

        <h3 className="text-xl sm:text-2xl font-cinzel font-bold text-white mb-2">
          A Revolution in Consciousness
        </h3>
        
        <p className="text-xs text-slate-300 mb-4 leading-relaxed">
          Witness thousands of youth thinkers uniting at sacred Gokul Dham, Mathura for three days of transformative wisdom, kirtan, philosophical debate, and pure living.
        </p>

        {/* Video Player Preview Container */}
        <div className="relative rounded-xl overflow-hidden border border-[#D4AF37]/30 bg-black aspect-video flex items-center justify-center group shadow-xl">
          <img 
            src="/src/assets/images/viplava_hero_festival_1791925226306.jpg" 
            alt="VIPLAVA Event Trailer Preview" 
            className="w-full h-full object-cover opacity-70 group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />
          
          <div className="absolute flex flex-col items-center text-center space-y-2">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#D4AF37] text-black flex items-center justify-center shadow-lg shadow-[#D4AF37]/50 group-hover:scale-110 transition-transform">
              <Play size={24} className="ml-1 fill-black" />
            </div>
            <span className="text-xs font-cinzel font-bold text-white tracking-widest uppercase drop-shadow">
              Gokul Dham Mathura · Official Teaser
            </span>
          </div>

          <div className="absolute bottom-3 left-3 flex items-center gap-1.5 text-[10px] text-[#F3C74C] bg-black/60 px-2.5 py-1 rounded-full border border-white/10 backdrop-blur-sm">
            <MapPin size={11} />
            <span>Recorded Live in Vrindavan Dham</span>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
          <span>Organized by ISKCON Youth Forum & EthicCraft Club</span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-full bg-[#D4AF37] text-black font-cinzel font-bold text-xs uppercase cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
