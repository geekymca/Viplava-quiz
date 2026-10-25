import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, ArrowRight } from 'lucide-react';

interface GlimpsesSectionProps {
  onOpenGallery: () => void;
}

export const GlimpsesSection: React.FC<GlimpsesSectionProps> = ({ onOpenGallery }) => {
  const glimpses = [
    {
      title: 'Youth Conclave at Gokul Mathura',
      image: '/src/assets/images/theme_viplava_gathering_1791999603291.jpg'
    },
    {
      title: 'Sacred Evening Maha Aarti',
      image: '/src/assets/images/viplava_hero_festival_1791925226306.jpg'
    },
    {
      title: 'Meditative Ghats of Yamuna',
      image: '/src/assets/images/meditating_monk_ghat_1791999538810.jpg'
    },
    {
      title: 'Temple Skyline at Sunset',
      image: '/src/assets/images/vrindavan_temple_sunset_1791999562839.jpg'
    }
  ];

  return (
    <section id="gallery" className="relative w-full py-14 sm:py-20 px-4 sm:px-6 lg:px-8 bg-[#070A14] overflow-hidden">
      <div className="max-w-5xl mx-auto space-y-8 text-center">
        
        {/* Title: GLIMPSES */}
        <div className="space-y-2">
          <div className="flex items-center justify-center gap-3">
            <div className="h-[1px] w-10 sm:w-16 bg-gradient-to-r from-transparent to-[#D4AF37]" />
            <h2 className="text-xl sm:text-2xl font-cinzel font-bold tracking-[0.3em] text-[#E5C158] uppercase">
              GLIMPSES
            </h2>
            <div className="h-[1px] w-10 sm:w-16 bg-gradient-to-l from-transparent to-[#D4AF37]" />
          </div>
          <p className="text-xs text-slate-400 font-light max-w-md mx-auto">
            Memories of devotion, spiritual inquiry, and youth fellowship at holy Gokul Mathura.
          </p>
        </div>

        {/* Glimpses Grid / Photo Stack */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {glimpses.map((item, idx) => (
            <motion.div
              key={idx}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.98 }}
              onClick={onOpenGallery}
              className="relative rounded-xl overflow-hidden border border-[#D4AF37]/30 aspect-[3/4] cursor-pointer group shadow-lg"
            >
              <img 
                src={item.image} 
                alt={item.title} 
                className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent flex flex-col justify-end p-2.5 sm:p-3 text-left">
                <p className="text-[10px] sm:text-xs font-semibold text-white line-clamp-2 leading-snug">
                  {item.title}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* View Gallery Button */}
        <div>
          <button
            onClick={onOpenGallery}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full border border-[#D4AF37]/50 text-[#F3C74C] font-cinzel text-xs font-bold uppercase tracking-wider hover:bg-[#D4AF37]/15 hover:border-[#D4AF37] transition-all cursor-pointer shadow-sm"
          >
            <span>View Gallery</span>
            <ArrowRight size={13} />
          </button>
        </div>

      </div>
    </section>
  );
};
