import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { GlassCard } from '../components/GlassCard';
import { useQuiz } from '../QuizContext';
import { Trophy, Clock, RotateCcw, LayoutDashboard, Instagram, Sparkles, MapPin } from 'lucide-react';
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use';

export const ResultPage: React.FC = () => {
  const navigate = useNavigate();
  const { score, questions, timeTaken, participant, resetQuiz, activeQuiz } = useQuiz();
  const { width, height } = useWindowSize();
  const [countdown, setCountdown] = useState(3);

  const percentage = Math.round((score / (questions.length || 20)) * 100);
  
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const getMessage = () => {
    if (percentage === 100) return "Master Thinker! Perfect score in VIPLAVA 2026. Your spiritual wisdom and focus are exemplary.";
    if (percentage >= 80) return "Outstanding! Your deep grasp of Vedic wisdom and critical discernment is truly commendable.";
    if (percentage >= 60) return "Great effort! Continue your journey of self-realization and Vedic character.";
    return "Every great thinker begins with earnest inquiry. Keep learning and reflecting on the Bhagavad Gita.";
  };

  const handleRestart = () => {
    resetQuiz();
    navigate('/');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 py-8">
      {percentage >= 70 && <Confetti width={width} height={height} recycle={false} numberOfPieces={250} />}
      
      <GlassCard className="w-full max-w-2xl p-8 sm:p-12 text-center border-amber-500/25">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', damping: 12 }}
          className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-tr from-amber-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-amber-500/20"
        >
          <Trophy className="text-black w-10 h-10 sm:w-12 sm:h-12" />
        </motion.div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold uppercase tracking-wider mb-2">
          <Sparkles size={12} />
          <span>{activeQuiz?.title || 'Bhagavad Gita As It Is — The Wisdom Quest'}</span>
        </div>

        <h2 className="text-3xl sm:text-4xl font-extrabold mb-2 text-white">
          Congratulations, {participant?.name || 'Thinker'}!
        </h2>
        <p className="text-base sm:text-lg text-amber-300 italic mb-8 font-serif">
          "{getMessage()}"
        </p>

        {/* Score & Time Cards */}
        <div className="grid grid-cols-2 gap-4 sm:gap-6 mb-8">
          <div className="bg-white/5 p-5 sm:p-6 rounded-2xl border border-white/10">
            <p className="text-gray-400 text-xs uppercase tracking-wider mb-1 font-semibold">Final Score</p>
            <div className="flex items-baseline justify-center gap-1">
              <span className="text-3xl sm:text-4xl font-black text-amber-400 font-mono">{score}</span>
              <span className="text-gray-400 text-base font-bold">/ {questions.length || 20}</span>
            </div>
            <p className="text-[11px] text-emerald-400 mt-1 font-medium">{percentage}% Accuracy</p>
          </div>

          <div className="bg-white/5 p-5 sm:p-6 rounded-2xl border border-white/10">
            <p className="text-gray-400 text-xs uppercase tracking-wider mb-1 font-semibold">Time Taken</p>
            <div className="flex items-baseline justify-center gap-1">
              <span className="text-3xl sm:text-4xl font-black text-white font-mono">{timeTaken}</span>
              <span className="text-gray-400 text-base font-bold">seconds</span>
            </div>
            <p className="text-[11px] text-gray-400 mt-1 font-medium">Recorded for Leaderboard</p>
          </div>
        </div>

        {/* Community & Instagram Follow Card */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-r from-orange-500/10 via-amber-500/10 to-orange-500/10 border border-amber-500/20 rounded-2xl p-6 mb-8 text-center"
        >
          <div className="flex items-center justify-center gap-2 mb-2">
            <Instagram className="text-amber-400" size={20} />
            <h3 className="text-base sm:text-lg font-bold text-white">EthicCraft Club & ISKCON Youth Forum</h3>
          </div>
          <p className="text-xs sm:text-sm text-gray-300 mb-4">
            Follow our official youth channel for festival schedule, live updates & award declarations!
          </p>
          <motion.a
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            href="https://www.instagram.com/ethiccraft_ymca/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-7 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 text-black font-extrabold text-sm rounded-full shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
          >
            Connect on Instagram
          </motion.a>
        </motion.div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleRestart}
            className="flex items-center justify-center gap-2 px-8 py-3.5 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-xl transition-all cursor-pointer text-sm"
          >
            <RotateCcw size={18} /> Back to Home
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate('/leaderboard')}
            className="flex items-center justify-center gap-2 px-8 py-3.5 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl border border-white/20 transition-all cursor-pointer text-sm"
          >
            <LayoutDashboard size={18} /> View Leaderboard
          </motion.button>
        </div>
      </GlassCard>
    </div>
  );
};
