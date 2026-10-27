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

        {/* Video Player Container */}
        <div className="relative rounded-xl overflow-hidden border border-[#D4AF37]/40 bg-black aspect-video shadow-2xl flex items-center justify-center">
          <video
            src="/assets/aistudio/VID-20261026-WA0000_b4ee50bc.mp4"
            controls
            autoPlay
            playsInline
            className="w-full h-full object-contain bg-black"
          >
            Your browser does not support the video tag.
          </video>
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
