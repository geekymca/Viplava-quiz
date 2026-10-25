import React from 'react';
import { motion } from 'motion/react';
import { BookOpen, Sparkles, Compass, HeartHandshake, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export const QuizThemesSection: React.FC = () => {
  const gitaPillars = [
    {
      title: 'I. Karma Yoga',
      chapters: 'Chapters 1 – 6',
      desc: 'The science of action and duty: Understanding the immortal soul (Atma), transcending bodily identification, practicing selfless service (Nishkama Karma), and mastering the flickering mind through steadfast focus on Krishna.',
      icon: <Compass className="w-5 h-5 text-[#F3C74C]" />
    },
    {
      title: 'II. Bhakti Yoga',
      chapters: 'Chapters 7 – 12',
      desc: 'The confidential heart of the Gita: Knowledge of the Absolute, crossing beyond Maya, remembering Krishna at the time of death, the most confidential secret (Raja-Vidya), the cosmic Universal Form, and supreme loving devotion.',
      icon: <HeartHandshake className="w-5 h-5 text-[#F3C74C]" />
    },
    {
      title: 'III. Jnana Yoga & Surrender',
      chapters: 'Chapters 13 – 18',
      desc: 'Transcendental wisdom and ultimate conclusion: The field and its knower (Kshetra-Kshetrajna), the three modes of material nature (Gunas), the eternal tree of life, the Supreme Person (Purushottama), and total surrender (BG 18.66).',
      icon: <BookOpen className="w-5 h-5 text-[#F3C74C]" />
    }
  ];

  return (
    <section id="themes" className="relative w-full py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-[#090D18]">
      <div className="max-w-5xl mx-auto space-y-10">
        
        {/* Header: Exclusive Quiz Theme */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 text-[#F3C74C] text-[11px] font-bold tracking-[0.25em] uppercase font-cinzel">
            <Sparkles size={13} />
            <span>VIPLAVA 2026 OFFICIAL QUEST</span>
          </div>

          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-cinzel font-bold tracking-tight text-white">
            <span className="gold-gradient-text">
              BHAGAVAD GITA AS IT IS
            </span>
          </h2>

          <p className="text-xs sm:text-sm text-slate-300 font-light max-w-2xl mx-auto leading-relaxed font-sans-body">
            Grounded in the authorized translations and purports of His Divine Grace A.C. Bhaktivedanta Swami Prabhupada. Covering the profound philosophical spectrum of the Kurukshetra dialogue across all 18 chapters.
          </p>
        </div>

        {/* Grand Featured Theme Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative rounded-3xl overflow-hidden border border-[#D4AF37]/35 bg-gradient-to-b from-[#0F1424] via-[#090D18] to-[#070A14] p-6 sm:p-10 shadow-2xl shadow-black/80"
        >
          {/* Subtle Ambient Background Watermark */}
          <div className="absolute right-0 top-0 w-80 h-80 opacity-15 pointer-events-none rounded-full bg-[#D4AF37]/20 blur-3xl" />

          {/* Top Banner Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
            {gitaPillars.map((pillar, idx) => (
              <div 
                key={idx}
                className="p-5 rounded-2xl bg-white/[0.03] border border-[#D4AF37]/20 hover:border-[#D4AF37]/50 hover:bg-white/[0.05] transition-all space-y-3 group"
              >
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex items-center justify-center group-hover:scale-105 transition-transform">
                    {pillar.icon}
                  </div>
                  {/* Clean unboxed text metadata with typographic separator */}
                  <span className="text-[11px] font-mono font-medium text-[#E5C158]">
                    {pillar.chapters}
                  </span>
                </div>

                <h3 className="text-sm font-cinzel font-bold text-slate-100 group-hover:text-[#F3C74C] transition-colors">
                  {pillar.title}
                </h3>

                <p className="text-xs text-slate-400 font-light leading-relaxed">
                  {pillar.desc}
                </p>
              </div>
            ))}
          </div>

          {/* Bottom Info Strip & Action */}
          <div className="mt-8 pt-6 border-t border-[#D4AF37]/20 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-2 text-slate-300">
              <CheckCircle2 size={16} className="text-[#D4AF37] shrink-0" />
              <span>300 questions from Bhagavad Gita As It Is · 20 randomized questions per participant attempt.</span>
            </div>

            <Link
              to="/register"
              className="gold-btn-gradient text-[#090D18] font-cinzel font-black text-xs tracking-wider uppercase px-6 py-2.5 rounded-full hover:scale-105 transition-transform shrink-0 shadow-lg shadow-[#D4AF37]/20"
            >
              Start Bhagavad Gita Quest
            </Link>
          </div>
        </motion.div>

      </div>
    </section>
  );
};
