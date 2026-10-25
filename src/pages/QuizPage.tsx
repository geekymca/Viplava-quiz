import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { GlassCard } from '../components/GlassCard';
import { useQuiz } from '../QuizContext';
import { Clock, CheckCircle2, XCircle, Sparkles, MapPin } from 'lucide-react';
import { verifyAnswerSelection } from '../lib/cryptoVault';

export const QuizPage: React.FC = () => {
  const navigate = useNavigate();
  const { 
    questions, 
    currentQuestionIndex, 
    submitAnswer, 
    participant, 
    isFinished,
    activeQuiz 
  } = useQuiz();
  
  const [timeLeft, setTimeLeft] = useState(15);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!participant) {
      navigate('/register');
      return;
    }
  }, [participant, navigate]);

  useEffect(() => {
    if (isFinished) {
      navigate('/result');
    }
  }, [isFinished, navigate]);

  useEffect(() => {
    startTimer();
    return () => stopTimer();
  }, [currentQuestionIndex]);

  const startTimer = () => {
    setTimeLeft(15);
    setIsAnswered(false);
    setSelectedOption(null);
    if (timerRef.current) clearInterval(timerRef.current);
    
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          handleTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const handleTimeUp = () => {
    stopTimer();
    setIsAnswered(true);
    setTimeout(() => {
      submitAnswer('', 15);
    }, 600);
  };

  const handleOptionSelect = (option: string) => {
    if (isAnswered) return;
    
    stopTimer();
    setSelectedOption(option);
    setIsAnswered(true);
    
    // Quick, clean transition (700ms) for feedback and zero lag
    const elapsed = Math.max(1, 15 - timeLeft);
    setTimeout(() => {
      submitAnswer(option, elapsed);
    }, 700);
  };

  if (questions.length === 0) return null;

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 py-8">
      
      {/* Quiz Header & Progress Bar */}
      <div className="w-full max-w-3xl mb-6">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
              {activeQuiz?.title || 'Bhagavad Gita As It Is — The Wisdom Quest'}
            </span>
            <span className="text-xs text-gray-400">· Gokul Mathura Dham</span>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-xs font-bold text-gray-300">
              Question <span className="text-amber-400 font-mono font-black">{currentQuestionIndex + 1}</span> of {questions.length}
            </div>

            <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-colors ${
              timeLeft <= 4 
                ? 'bg-red-500/20 text-red-400 border border-red-500/40 animate-pulse' 
                : 'bg-white/10 text-white'
            }`}>
              <Clock size={14} />
              <span className="font-mono text-sm">{timeLeft}s</span>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-gradient-to-r from-amber-500 to-orange-500"
            initial={{ width: 0 }}
            animate={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
            transition={{ ease: 'easeOut', duration: 0.3 }}
          />
        </div>
      </div>

      {/* Question Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestionIndex}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
          className="w-full max-w-3xl"
        >
          <GlassCard className="p-8 sm:p-12 border-amber-500/20">
            <h2 className="text-xl sm:text-2xl font-bold mb-8 leading-relaxed text-white">
              {currentQuestion.question}
            </h2>

            <div className="grid grid-cols-1 gap-3.5">
              {currentQuestion.options.map((option, index) => {
                const isCorrect = currentQuestion.answerHash
                  ? verifyAnswerSelection(currentQuestion.id, option, currentQuestion.answerHash)
                  : (currentQuestion.correct ? option === currentQuestion.correct : false);
                const isSelected = option === selectedOption;
                
                let buttonClass = "bg-white/5 border-white/10 hover:bg-white/10 hover:border-amber-400/40 text-gray-200";
                if (isAnswered) {
                  if (isCorrect) {
                    buttonClass = "bg-emerald-500/20 border-emerald-500/60 text-emerald-300 font-semibold";
                  } else if (isSelected) {
                    buttonClass = "bg-red-500/20 border-red-500/60 text-red-300 font-semibold";
                  } else {
                    buttonClass = "bg-white/5 border-white/5 opacity-40 text-gray-400";
                  }
                }

                return (
                  <motion.button
                    key={index}
                    whileHover={!isAnswered ? { scale: 1.01 } : {}}
                    whileTap={!isAnswered ? { scale: 0.99 } : {}}
                    onClick={() => handleOptionSelect(option)}
                    disabled={isAnswered}
                    className={`w-full p-4 rounded-xl border text-left flex justify-between items-center transition-all cursor-pointer ${buttonClass}`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-lg bg-white/10 flex items-center justify-center text-xs font-mono font-bold text-amber-300 shrink-0">
                        {String.fromCharCode(65 + index)}
                      </span>
                      <span className="text-sm sm:text-base leading-snug">{option}</span>
                    </div>
                    {isAnswered && isCorrect && <CheckCircle2 className="text-emerald-400 shrink-0 ml-2" size={20} />}
                    {isAnswered && isSelected && !isCorrect && <XCircle className="text-red-400 shrink-0 ml-2" size={20} />}
                  </motion.button>
                );
              })}
            </div>
          </GlassCard>
        </motion.div>
      </AnimatePresence>

    </div>
  );
};
