import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { GlassCard } from '../components/GlassCard';
import { useQuiz, RESULTS_COLLECTION, CURRENT_QUIZ_ID } from '../QuizContext';
import { User, MapPin, Phone, Sparkles, Building, AlertCircle } from 'lucide-react';
import { db } from '../lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { Participant } from '../types';

export const RegistrationPage: React.FC = () => {
  const navigate = useNavigate();
  const { setParticipant, startQuiz, activeQuiz, isQuizLive } = useQuiz();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    universityOrArea: '',
    phoneNumber: ''
  });

  const quizIdToUse = activeQuiz?.id || CURRENT_QUIZ_ID;
  const quizTitleToUse = activeQuiz?.title || 'Bhagavad Gita As It Is — The Wisdom Quest';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const trimmedName = formData.name.trim();
    if (!trimmedName) {
      setError('Please enter your full name.');
      return;
    }

    const trimmedUniArea = formData.universityOrArea.trim();
    if (!trimmedUniArea) {
      setError('Please enter your university, college, or local area.');
      return;
    }

    const trimmedPhone = formData.phoneNumber.trim();
    if (!trimmedPhone) {
      setError('Please enter your phone number.');
      return;
    }

    if (trimmedPhone.replace(/[\s-]/g, '').length < 8) {
      setError('Please enter a valid phone number with at least 8 digits.');
      return;
    }

    setLoading(true);
    try {
      const cleanDigits = trimmedPhone.replace(/[^0-9]/g, '');

      // 1. Local Storage Check (scoped to current active quizId)
      if (
        localStorage.getItem(`viplava_completed_${quizIdToUse}_${cleanDigits}`) ||
        localStorage.getItem(`viplava_completed_${quizIdToUse}_${trimmedPhone}`)
      ) {
        setError(`This phone number (${trimmedPhone}) has already completed this quiz ("${quizTitleToUse}"). Multiple attempts for the same quiz are not permitted.`);
        setLoading(false);
        return;
      }

      // 2. Query Firestore Results for matching phone number for THIS specific quizId
      const qPrimary = query(
        collection(db, RESULTS_COLLECTION),
        where('quizId', '==', quizIdToUse),
        where('phoneNumber', '==', trimmedPhone)
      );
      const snapshotPrimary = await getDocs(qPrimary);

      let isDuplicate = !snapshotPrimary.empty;

      if (!isDuplicate && cleanDigits && cleanDigits !== trimmedPhone) {
        const qClean = query(
          collection(db, RESULTS_COLLECTION),
          where('quizId', '==', quizIdToUse),
          where('phoneNumber', '==', cleanDigits)
        );
        const snapshotClean = await getDocs(qClean);
        isDuplicate = !snapshotClean.empty;
      }

      // Check legacy collection if matching specific legacy quiz
      if (!isDuplicate) {
        if (quizIdToUse === 'krishna_janamotsav') {
          try {
            const qLegacy = query(collection(db, 'krishna_janamotsav_results'), where('phoneNumber', '==', trimmedPhone));
            const snap = await getDocs(qLegacy);
            if (!snap.empty) isDuplicate = true;
          } catch (_) {}
        } else if (quizIdToUse === 'foundation_day') {
          try {
            const qLegacy = query(collection(db, 'foundation_day_results'), where('phoneNumber', '==', trimmedPhone));
            const snap = await getDocs(qLegacy);
            if (!snap.empty) isDuplicate = true;
          } catch (_) {}
        }
      }

      if (isDuplicate) {
        setError(`This phone number (${trimmedPhone}) has already completed this quiz ("${quizTitleToUse}"). Multiple attempts for the same quiz are not permitted.`);
        setLoading(false);
        return;
      }

      const participantPayload: Participant = {
        name: trimmedName,
        universityOrArea: trimmedUniArea,
        rollNumber: trimmedUniArea,
        branch: trimmedUniArea,
        course: 'VIPLAVA 2026',
        phoneNumber: trimmedPhone,
        isGeneral: true,
        audienceType: 'general'
      };

      setParticipant(participantPayload);
      startQuiz();
      navigate('/quiz');
    } catch (err: any) {
      console.error("Registration query check notice:", err);
      // Even if Firestore query times out or index missing, enforce LocalStorage check
      const participantPayload: Participant = {
        name: trimmedName,
        universityOrArea: trimmedUniArea,
        rollNumber: trimmedUniArea,
        branch: trimmedUniArea,
        course: 'VIPLAVA 2026',
        phoneNumber: trimmedPhone,
        isGeneral: true,
        audienceType: 'general'
      };
      setParticipant(participantPayload);
      startQuiz();
      navigate('/quiz');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[85vh] px-4 py-8">
      <GlassCard className="w-full max-w-lg p-8 sm:p-10 border-amber-500/25">
        
        {/* Header Branding */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles size={12} />
            <span>ISKCON Youth Forum · VIPLAVA 2026</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Participant Login</h2>
          <p className="text-xs text-gray-400 mt-1 flex items-center justify-center gap-1">
            <MapPin size={12} className="text-orange-400" /> At Gokul Mathura Dham · {quizTitleToUse}
          </p>
        </div>

        {/* Login Form: Name, University or Area, and Phone Number */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* 1. Name */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-300 flex items-center gap-1.5">
              <User size={14} className="text-amber-400" /> Full Name
            </label>
            <input
              required
              type="text"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-400 transition-colors text-sm"
              placeholder="e.g. Radhika Sharma"
            />
          </div>

          {/* 2. University or Area */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-300 flex items-center gap-1.5">
              <Building size={14} className="text-amber-400" /> University or Area
            </label>
            <input
              required
              type="text"
              value={formData.universityOrArea}
              onChange={e => setFormData({ ...formData, universityOrArea: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-400 transition-colors text-sm"
              placeholder="e.g. Delhi University / Mathura / Vrindavan"
            />
          </div>

          {/* 3. Phone Number */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-300 flex items-center gap-1.5">
              <Phone size={14} className="text-amber-400" /> Phone Number (WhatsApp for Updates)
            </label>
            <input
              required
              type="tel"
              value={formData.phoneNumber}
              onChange={e => setFormData({ ...formData, phoneNumber: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-400 transition-colors text-sm"
              placeholder="e.g. 9876543210"
            />
          </div>

          {error && (
            <p className="text-red-400 text-xs text-center bg-red-500/10 border border-red-500/20 py-2.5 px-3 rounded-lg font-medium">
              {error}
            </p>
          )}

          {/* Submit button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className={`w-full py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-black font-extrabold rounded-xl shadow-lg shadow-amber-500/20 hover:from-amber-400 hover:to-orange-400 transition-all cursor-pointer text-base ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {loading ? 'Verifying...' : 'Begin VIPLAVA Quiz'}
          </motion.button>
        </form>
      </GlassCard>
    </div>
  );
};
