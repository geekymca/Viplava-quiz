import React from 'react';
import { X, MapPin, Mail, Phone, MessageSquare, Instagram, ExternalLink } from 'lucide-react';

interface GalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GalleryModal: React.FC<GalleryModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const galleryItems = [
    {
      title: 'Youth Gathering at Yamuna Ghats',
      category: 'Gokul Mathura Dham',
      image: '/src/assets/images/theme_viplava_gathering_1791999603291.jpg'
    },
    {
      title: 'Sacred Evening Maha Aarti',
      category: 'Festival Lights',
      image: '/src/assets/images/viplava_hero_festival_1791925226306.jpg'
    },
    {
      title: 'Ancient Temples & Ghats',
      category: 'Vrindavan Heritage',
      image: '/src/assets/images/vrindavan_temple_sunset_1791999562839.jpg'
    },
    {
      title: 'Srila Prabhupada — The Spiritual Ambassador',
      category: 'VIPLAVA 2026 Official Poster',
      image: '/assets/aistudio/IMG-20261025-WA0002_de6dcd48.jpg'
    },
    {
      title: 'Grand Temple Shikhara',
      category: 'Vedic Architecture',
      image: '/src/assets/images/theme_iskcon_temple_1791999603886.jpg'
    },
    {
      title: 'Lord Krishna Pastimes',
      category: 'Vrindavan Pastimes',
      image: '/src/assets/images/theme_krishna_flute_1791999562880.jpg'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="bg-[#090D18] border border-[#D4AF37]/40 rounded-2xl max-w-4xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative my-8">
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div>
            <span className="text-[10px] font-cinzel font-bold tracking-[0.25em] text-[#D4AF37] uppercase">
              Festival Impressions
            </span>
            <h3 className="text-xl sm:text-2xl font-cinzel font-bold text-white">
              VIPLAVA 2026 Gallery
            </h3>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[60vh] overflow-y-auto pr-1">
          {galleryItems.map((item, idx) => (
            <div key={idx} className="group relative rounded-xl overflow-hidden border border-[#D4AF37]/20 bg-black/40">
              <img 
                src={item.image} 
                alt={item.title} 
                className="w-full h-44 object-cover object-center group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex flex-col justify-end p-3">
                <span className="text-[9px] font-bold text-[#F3C74C] uppercase tracking-wider">
                  {item.category}
                </span>
                <h4 className="text-xs font-semibold text-white line-clamp-1">
                  {item.title}
                </h4>
              </div>
            </div>
          ))}
        </div>

        <div className="pt-2 flex justify-between items-center text-xs text-slate-400 border-t border-white/10">
          <span>Captured during Viplava youth festival retreats at Gokul Mathura</span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-full bg-[#D4AF37] text-black font-cinzel font-bold text-xs uppercase"
          >
            Close Gallery
          </button>
        </div>
      </div>
    </div>
  );
};

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="bg-[#090D18] border border-[#D4AF37]/40 rounded-2xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl relative">
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div>
            <span className="text-[10px] font-cinzel font-bold tracking-[0.25em] text-[#D4AF37] uppercase">
              Event Coordination
            </span>
            <h3 className="text-xl font-cinzel font-bold text-white">
              Contact Viplava 2026 Team
            </h3>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-4 text-xs text-slate-300">
          <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/5 flex items-start gap-3">
            <MapPin className="text-[#D4AF37] shrink-0 mt-0.5" size={18} />
            <div>
              <p className="font-bold text-white text-sm">Gokul Mathura Dham Conclave Grounds</p>
              <p className="text-slate-400">Mathura District, Uttar Pradesh, India</p>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/5 flex items-start gap-3">
            <Mail className="text-[#D4AF37] shrink-0 mt-0.5" size={18} />
            <div>
              <p className="font-bold text-white text-sm">Youth Forum Desk</p>
              <p className="text-slate-400">viplava2026@ethiccraft.org · info@iskconviplava.org</p>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/5 flex items-start gap-3">
            <Phone className="text-[#D4AF37] shrink-0 mt-0.5" size={18} />
            <div>
              <p className="font-bold text-white text-sm">Helpline & WhatsApp Support</p>
              <p className="text-slate-400">+91 98108 10808 (Devotee Assistance Desk)</p>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-[#D4AF37]/30 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <Instagram className="text-[#D4AF37]" size={20} />
              <div>
                <p className="font-bold text-white">Instagram Community</p>
                <p className="text-[11px] text-slate-400">@ethiccraft_ymca</p>
              </div>
            </div>
            <a
              href="https://www.instagram.com/ethiccraft_ymca/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-1.5 rounded-full bg-[#D4AF37] text-black font-bold text-xs flex items-center gap-1"
            >
              <span>Follow</span>
              <ExternalLink size={12} />
            </a>
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white font-cinzel font-bold text-xs uppercase"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
