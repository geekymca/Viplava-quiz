import React, { useState } from 'react';
import { motion } from 'motion/react';
import { UserPlus, BookOpen, Clock, Trophy, ArrowRight, ChevronRight, CheckCircle2, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface HowToParticipateSectionProps {
  onEnterQuiz: () => void;
  onViewLeaderboard: () => void;
}

export const HowToParticipateSection: React.FC<HowToParticipateSectionProps> = ({
  onEnterQuiz,
  onViewLeaderboard
}) => {
  const [showGuidelinesModal, setShowGuidelinesModal] = useState(false);

  const steps = [
    {
      num: '1',
      title: 'REGISTER',
      desc: 'Create your account to participate.',
      icon: <UserPlus className="w-5 h-5 text-[#D4AF37]" />,
      action: onEnterQuiz
    },
    {
      num: '2',
      title: 'READ GUIDELINES',
      desc: 'Go through the quiz rules and instructions.',
      icon: <BookOpen className="w-5 h-5 text-[#D4AF37]" />,
      action: () => setShowGuidelinesModal(true)
    },
    {
      num: '3',
      title: 'JOIN ON TIME',
      desc: 'Be ready before the quiz begins.',
      icon: <Clock className="w-5 h-5 text-[#D4AF37]" />,
      action: onEnterQuiz
    },
    {
      num: '4',
      title: 'GIVE YOUR BEST',
      desc: 'Answer honestly and with enthusiasm.',
      icon: <Trophy className="w-5 h-5 text-[#D4AF37]" />,
      action: onEnterQuiz
    }
  ];

  return (
    <section id="quiz" className="relative w-full pt-16 sm:pt-24 pb-28 px-4 sm:px-6 lg:px-8 bg-[#070A14] overflow-hidden">
      
      {/* Background Distant Illuminated Vrindavan Temple at Twilight */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <img 
          src="/src/assets/images/vrindavan_temple_sunset_1791999562839.jpg" 
          alt="Sacred Gokul Mathura at Twilight" 
          className="w-full h-full object-cover object-bottom filter blur-[1px]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#070A14] via-[#070A14]/90 to-[#070A14]" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto flex flex-col items-center text-center space-y-12">
        
        {/* Header: HOW TO PARTICIPATE */}
        <div className="space-y-2">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-cinzel font-bold tracking-[0.2em] text-[#E5C158] uppercase">
            HOW TO PARTICIPATE
          </h2>
          <div className="flex items-center justify-center gap-3 pt-1">
            <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-[#D4AF37]" />
            <svg viewBox="0 0 24 12" className="w-5 h-3 text-[#D4AF37]" fill="currentColor">
              <circle cx="12" cy="6" r="2.5" />
              <path d="M2 6 Q7 2 12 6 Q17 10 22 6" fill="none" stroke="currentColor" strokeWidth="1" />
            </svg>
            <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-[#D4AF37]" />
          </div>
        </div>

        {/* 4 Steps Row */}
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-4 relative">
          {steps.map((step, idx) => (
            <div key={idx} className="relative flex flex-col items-center group">
              
              {/* Circular Step Icon */}
              <button
                onClick={step.action}
                className="w-14 h-14 rounded-full border border-[#D4AF37]/50 bg-[#0B1020]/90 backdrop-blur-md flex items-center justify-center mb-4 group-hover:scale-110 group-hover:border-[#F3C74C] group-hover:shadow-[0_0_20px_rgba(212,175,55,0.3)] transition-all cursor-pointer shadow-lg"
              >
                {step.icon}
              </button>

              {/* Step Title & Description */}
              <h3 className="text-xs sm:text-sm font-cinzel font-bold tracking-wider text-slate-100 uppercase mb-1">
                {step.num}. {step.title}
              </h3>
              
              <p className="text-[11px] text-slate-400 font-light max-w-[180px] leading-relaxed">
                {step.desc}
              </p>

              {/* Arrow Connector (between steps on desktop) */}
              {idx < steps.length - 1 && (
                <div className="hidden lg:block absolute -right-3 top-6 text-[#D4AF37]/40 pointer-events-none">
                  <ChevronRight size={18} />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Prominent Gold CTA Button: ENTER THE QUIZ */}
        <div className="pt-4 flex flex-col items-center gap-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onEnterQuiz}
            className="gold-btn-gradient text-[#090D18] font-cinzel font-black text-sm sm:text-base tracking-widest uppercase px-10 sm:px-14 py-4 rounded-full flex items-center gap-3 transition-all duration-300 cursor-pointer shadow-xl shadow-[#D4AF37]/25"
          >
            <span>ENTER THE QUIZ</span>
            <div className="w-6 h-6 rounded-full bg-[#090D18] text-[#F3C74C] flex items-center justify-center">
              <ChevronRight size={16} />
            </div>
          </motion.button>

          {/* Sub Action: View Leaderboard */}
          <button
            onClick={onViewLeaderboard}
            className="text-xs font-cinzel font-bold tracking-[0.2em] text-[#D4AF37]/90 hover:text-white uppercase transition-colors flex items-center gap-2 cursor-pointer pt-1"
          >
            <Trophy size={14} className="text-[#D4AF37]" />
            <span>VIEW LEADERBOARD</span>
          </button>
        </div>

      </div>

      {/* Decorative Bottom Lotus Illustration in Corner */}
      <div className="absolute -bottom-6 -left-6 w-36 h-36 opacity-30 pointer-events-none">
        <svg viewBox="0 0 100 100" className="w-full h-full text-pink-400" fill="currentColor">
          <path d="M50 15 C45 30 35 45 30 60 C40 65 50 65 50 65 C50 65 60 65 70 60 C65 45 55 30 50 15 Z" fill="#F472B6" />
          <path d="M50 25 C40 40 25 55 15 65 C25 75 45 75 50 75 C55 75 75 75 85 65 C75 55 60 40 50 25 Z" fill="#FB7185" opacity="0.8" />
          <path d="M20 75 C35 85 65 85 80 75 C65 88 35 88 20 75 Z" fill="#10B981" />
        </svg>
      </div>

      {/* Guidelines Modal */}
      {showGuidelinesModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-[#090D18] border border-[#D4AF37]/40 rounded-2xl max-w-lg w-full p-6 sm:p-8 space-y-4 shadow-2xl relative text-left">
            <button 
              onClick={() => setShowGuidelinesModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X size={20} />
            </button>

            <h3 className="text-xl font-cinzel font-bold text-[#F3C74C]">Viplava 2026 Quiz Guidelines</h3>
            
            <div className="space-y-3 text-xs text-slate-300 font-light leading-relaxed">
              <div className="flex items-start gap-2">
                <CheckCircle2 size={16} className="text-[#D4AF37] shrink-0 mt-0.5" />
                <span><strong>Format:</strong> 20 questions randomly selected from the sacred question bank with dynamically shuffled choices.</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 size={16} className="text-[#D4AF37] shrink-0 mt-0.5" />
                <span><strong>Time Limit:</strong> 15 seconds per question. Answers auto-submit when the timer expires.</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 size={16} className="text-[#D4AF37] shrink-0 mt-0.5" />
                <span><strong>Scoring:</strong> +1 mark for each correct answer. Speed is used as a tie-breaker on the live leaderboard.</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 size={16} className="text-[#D4AF37] shrink-0 mt-0.5" />
                <span><strong>Eligibility:</strong> Open to all students, youth, and devotees inspired by Srila Prabhupada's mission.</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 size={16} className="text-[#D4AF37] shrink-0 mt-0.5" />
                <span><strong>Honor Code:</strong> Answer honestly from your genuine understanding without external aids.</span>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => {
                  setShowGuidelinesModal(false);
                  onEnterQuiz();
                }}
                className="px-6 py-2.5 rounded-full bg-[#D4AF37] text-black font-cinzel font-bold text-xs uppercase"
              >
                Understood · Enter Quiz
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
