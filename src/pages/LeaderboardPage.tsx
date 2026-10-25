import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { GlassCard } from '../components/GlassCard';
import { db } from '../lib/firebase';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { QuizResult } from '../types';
import { Trophy, Medal, Award, Lock, ArrowLeft, Sparkles, BookOpen, Layers } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { handleFirestoreError, OperationType } from '../lib/errorHandlers';
import { RESULTS_COLLECTION, useQuiz } from '../QuizContext';

export const LeaderboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { allQuizzes, activeQuizId } = useQuiz();
  const [results, setResults] = useState<QuizResult[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [selectedQuizId, setSelectedQuizId] = useState<string>(activeQuizId);

  // Sync selectedQuizId with activeQuizId on mount
  useEffect(() => {
    if (activeQuizId) {
      setSelectedQuizId(activeQuizId);
    }
  }, [activeQuizId]);

  useEffect(() => {
    if (isAdmin) {
      const q = query(
        collection(db, RESULTS_COLLECTION),
        orderBy('score', 'desc'),
        limit(300)
      );

      const path = RESULTS_COLLECTION;
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const data = snapshot.docs.map(doc => doc.data() as QuizResult);
        
        // Filter by selected quiz ID
        const filtered = data.filter(item => {
          if (!item.quizId && selectedQuizId === 'foundation_day') return true;
          return item.quizId === selectedQuizId;
        });

        // Sort: highest score first, ties broken by least time taken
        filtered.sort((a, b) => (b.score - a.score) || (a.timeTaken - b.timeTaken));
        setResults(filtered.slice(0, 30));
      }, (error) => {
        handleFirestoreError(error, OperationType.GET, path);
      });

      return () => unsubscribe();
    }
  }, [isAdmin, selectedQuizId]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === '108') {
      setIsAdmin(true);
      setError('');
    } else {
      setError('Incorrect credentials. Access denied.');
    }
  };

  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-[80vh] px-4">
        <GlassCard className="w-full max-w-md p-8 border-amber-500/25">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-amber-500/15 rounded-full flex items-center justify-center border border-amber-500/30">
              <Lock className="text-amber-400 w-8 h-8" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-center mb-1 text-white">Leaderboard Access</h2>
          <p className="text-xs text-center text-gray-400 mb-6">
            Enter the authorized passcode to view the VIPLAVA 2026 score rankings
          </p>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-amber-400 text-sm"
              placeholder="Enter admin access passcode"
            />
            {error && <p className="text-red-400 text-xs text-center bg-red-500/10 py-2 rounded-lg">{error}</p>}
            <button
              type="submit"
              className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-orange-500 text-black font-extrabold rounded-xl hover:from-amber-400 hover:to-orange-400 transition-all cursor-pointer text-sm"
            >
              Unlock Leaderboard
            </button>
            <button
              type="button"
              onClick={() => navigate('/')}
              className="w-full py-2.5 text-gray-400 flex items-center justify-center gap-2 hover:text-white transition-colors text-xs"
            >
              <ArrowLeft size={14} /> Back to Home
            </button>
          </form>
        </GlassCard>
      </div>
    );
  }

  const activeQuizObj = allQuizzes.find(q => q.id === selectedQuizId);

  return (
    <div className="flex flex-col items-center min-h-[80vh] px-4 py-8 max-w-5xl mx-auto w-full">
      <div className="w-full flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Sparkles size={12} />
            <span>ISKCON Youth Forum · VIPLAVA 2026</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            {activeQuizObj?.title || 'VIPLAVA 2026 Leaderboard'}
          </h2>
          <p className="text-xs text-gray-400 mt-0.5">Top 30 thinkers ranked by score and speed</p>
        </div>
        
        <button
          onClick={() => navigate('/')}
          className="px-4 py-2 bg-white/10 rounded-xl flex items-center gap-2 hover:bg-white/20 transition-all text-xs font-semibold self-start sm:self-auto cursor-pointer"
        >
          <ArrowLeft size={16} /> Home
        </button>
      </div>

      {/* Quiz Selector Filter Tabs */}
      <div className="w-full mb-6 flex flex-wrap gap-2 items-center">
        <span className="text-xs text-gray-400 flex items-center gap-1.5 mr-2 font-medium">
          <Layers size={14} /> Select Quiz:
        </span>
        {allQuizzes.map((quiz) => (
          <button
            key={quiz.id}
            onClick={() => setSelectedQuizId(quiz.id)}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all border cursor-pointer ${
              selectedQuizId === quiz.id
                ? 'bg-amber-500 text-black border-amber-400 shadow-md shadow-amber-500/20'
                : 'bg-white/5 text-gray-300 border-white/10 hover:bg-white/10 hover:text-white'
            }`}
          >
            <span>{quiz.title}</span>
            {quiz.id === activeQuizId && (
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" title="Currently Live Quiz" />
            )}
          </button>
        ))}
      </div>

      {/* Leaderboard Table */}
      <GlassCard className="w-full overflow-hidden border-amber-500/20">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/5 border-b border-white/10">
                <th className="p-4 font-bold text-xs uppercase tracking-wider text-amber-400">Rank</th>
                <th className="p-4 font-bold text-xs uppercase tracking-wider text-gray-300">Thinker</th>
                <th className="p-4 font-bold text-xs uppercase tracking-wider text-gray-300">Roll No / ID</th>
                <th className="p-4 font-bold text-xs uppercase tracking-wider text-amber-400">Score</th>
                <th className="p-4 font-bold text-xs uppercase tracking-wider text-gray-300">Speed</th>
              </tr>
            </thead>
            <tbody>
              {results.map((result, index) => (
                <motion.tr
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.02 }}
                  key={index}
                  className="border-b border-white/5 hover:bg-white/5 transition-colors"
                >
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      {index === 0 && <Trophy size={18} className="text-amber-400" />}
                      {index === 1 && <Medal size={18} className="text-gray-300" />}
                      {index === 2 && <Award size={18} className="text-orange-400" />}
                      <span className={`font-black font-mono ${index < 3 ? 'text-amber-400' : 'text-gray-400'}`}>
                        #{index + 1}
                      </span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div>
                      <p className="font-bold text-white text-sm">{result.name}</p>
                      {result.course === 'General' || result.branch === 'General Audience' ? (
                        <span className="inline-block mt-0.5 text-[10px] font-semibold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">
                          General Youth
                        </span>
                      ) : (
                        <p className="text-xs text-gray-400">{result.course} · {result.branch}</p>
                      )}
                    </div>
                  </td>
                  <td className="p-4 text-xs text-gray-300 font-mono">
                    {result.rollNumber.startsWith('GEN-') ? (
                      <span className="text-gray-500 italic">Guest</span>
                    ) : (
                      result.rollNumber
                    )}
                  </td>
                  <td className="p-4">
                    <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 px-3 py-1 rounded-full font-black text-xs font-mono">
                      {result.score} / {result.totalQuestions || 20}
                    </span>
                  </td>
                  <td className="p-4 text-gray-400 font-mono text-xs">{result.timeTaken}s</td>
                </motion.tr>
              ))}
              {results.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-12 text-center text-gray-400 italic text-sm">
                    No results recorded yet for "{activeQuizObj?.title || 'this quiz'}".
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
};
