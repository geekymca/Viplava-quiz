import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { Participant, QuizQuestion, QuizResult, QuizDocument } from './types';
import { prepareQuizQuestions, DEFAULT_VIPLAVA_QUIZ, quizArray, GITA_QUIZ_ID } from './data/questions';
import { db } from './lib/firebase';
import { 
  collection, 
  addDoc, 
  setDoc, 
  doc, 
  deleteDoc,
  serverTimestamp, 
  onSnapshot 
} from 'firebase/firestore';
import { handleFirestoreError, OperationType } from './lib/errorHandlers';
import { 
  verifyAnswerSelection, 
  createSecureSession, 
  recordAnswerInChain, 
  finalizeSecureSession, 
  SecureQuizSession,
  sha256 
} from './lib/cryptoVault';

export const RESULTS_COLLECTION = 'results';
export const QUIZZES_COLLECTION = 'quizzes';
export const CONFIG_COLLECTION = 'config';
export const ACTIVE_QUIZ_DOC = 'active_quiz';

export const DEFAULT_QUIZ_ID = GITA_QUIZ_ID;
export const CURRENT_QUIZ_ID = GITA_QUIZ_ID;
export const CURRENT_QUIZ_TITLE = 'Bhagavad Gita As It Is — The Wisdom Quest';
export const CURRENT_QUIZ_COLLECTION = RESULTS_COLLECTION;
export const LEGACY_QUIZ_COLLECTION = RESULTS_COLLECTION;

export interface SlotSchedule {
  enabled: boolean;
  date: string; // e.g. "2026-10-29"
  startTime: string; // e.g. "10:00"
  endTime: string; // e.g. "14:00"
  manualOverride: 'auto' | 'force_live' | 'force_stopped';
}

const DEFAULT_SLOT_SCHEDULE: SlotSchedule = {
  enabled: true,
  date: '2026-10-29',
  startTime: '10:00',
  endTime: '14:00',
  manualOverride: 'auto'
};

interface QuizContextType {
  participant: Participant | null;
  setParticipant: (p: Participant) => void;
  questions: QuizQuestion[];
  currentQuestionIndex: number;
  score: number;
  answers: { questionId: string; selected: string; isCorrect: boolean }[];
  timeTaken: number;
  isFinished: boolean;
  activeQuiz: QuizDocument | null;
  activeQuizId: string;
  isQuizLive: boolean;
  slotSchedule: SlotSchedule;
  allQuizzes: QuizDocument[];
  isLoadingQuizzes: boolean;
  startQuiz: () => void;
  submitAnswer: (answer: string, timeForThisQuestion: number) => void;
  resetQuiz: () => void;
  setActiveQuizId: (quizId: string) => Promise<boolean>;
  setQuizLiveStatus: (isLive: boolean) => Promise<boolean>;
  updateSlotSchedule: (newSchedule: Partial<SlotSchedule>) => Promise<boolean>;
  createNewQuiz: (quizData: { id: string; title: string; description: string; questions: QuizQuestion[] }) => Promise<boolean>;
  deleteQuiz: (quizId: string) => Promise<boolean>;
}

const QuizContext = createContext<QuizContextType | undefined>(undefined);

export const QuizProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [participant, setParticipant] = useState<Participant | null>(null);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState<{ questionId: string; selected: string; isCorrect: boolean }[]>([]);
  const [timeTaken, setTimeTaken] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  // Dynamic quizzes from Firestore
  const [allQuizzes, setAllQuizzes] = useState<QuizDocument[]>([DEFAULT_VIPLAVA_QUIZ]);
  const [activeQuizId, setActiveQuizIdState] = useState<string>(DEFAULT_QUIZ_ID);
  const [activeQuiz, setActiveQuiz] = useState<QuizDocument | null>(DEFAULT_VIPLAVA_QUIZ);
  
  // Live control and slot schedule
  const [slotSchedule, setSlotSchedule] = useState<SlotSchedule>(DEFAULT_SLOT_SCHEDULE);
  const [isQuizLive, setIsQuizLive] = useState<boolean>(true);
  const [isLoadingQuizzes, setIsLoadingQuizzes] = useState(true);

  // Submitting guard to prevent rapid double-clicks
  const isSubmittingRef = useRef(false);
  const secureSessionRef = useRef<SecureQuizSession | null>(null);

  // Helper to compute live status from schedule and override
  const computeIsLive = useCallback((schedule: SlotSchedule, baseLive: boolean) => {
    if (schedule.manualOverride === 'force_live') return true;
    if (schedule.manualOverride === 'force_stopped') return false;
    if (baseLive === false) return false;

    // If schedule is enabled, check current time vs 4-hour window on October 29th
    if (schedule.enabled) {
      try {
        const now = new Date();
        const [sHour, sMin] = schedule.startTime.split(':').map(Number);
        const [eHour, eMin] = schedule.endTime.split(':').map(Number);

        // Target Date in Local/IST
        const targetDateStr = schedule.date; // "2026-10-29"
        const [tYear, tMonth, tDay] = targetDateStr.split('-').map(Number);

        const startObj = new Date(tYear, tMonth - 1, tDay, sHour || 10, sMin || 0, 0);
        const endObj = new Date(tYear, tMonth - 1, tDay, eHour || 14, eMin || 0, 0);

        const nowTime = now.getTime();
        const isInSlot = nowTime >= startObj.getTime() && nowTime <= endObj.getTime();
        
        return isInSlot;
      } catch (e) {
        return baseLive;
      }
    }

    return baseLive;
  }, []);

  // 1. Listen for active quiz config & quizzes list
  useEffect(() => {
    let unsubscribeQuizzes: (() => void) | null = null;
    let unsubscribeConfig: (() => void) | null = null;

    const setupFirestoreSync = async () => {
      try {
        // Sync active quiz config
        const configRef = doc(db, CONFIG_COLLECTION, ACTIVE_QUIZ_DOC);
        unsubscribeConfig = onSnapshot(configRef, (snapshot) => {
          if (snapshot.exists()) {
            const data = snapshot.data();
            if (data.activeQuizId) {
              setActiveQuizIdState(data.activeQuizId);
            }
            const incomingSchedule: SlotSchedule = {
              enabled: data.slotEnabled ?? DEFAULT_SLOT_SCHEDULE.enabled,
              date: data.slotDate || DEFAULT_SLOT_SCHEDULE.date,
              startTime: data.slotStartTime || DEFAULT_SLOT_SCHEDULE.startTime,
              endTime: data.slotEndTime || DEFAULT_SLOT_SCHEDULE.endTime,
              manualOverride: data.manualOverride || (data.isLive === false ? 'force_stopped' : 'auto')
            };
            setSlotSchedule(incomingSchedule);

            const baseLive = typeof data.isLive === 'boolean' ? data.isLive : false;
            setIsQuizLive(computeIsLive(incomingSchedule, baseLive));
          }
        }, (err) => {
          console.warn("Config listener notice (using default Bhagavad Gita quiz):", err.message);
        });

        // Helper to get local custom quizzes
        const getCustomLocalQuizzes = (): QuizDocument[] => {
          try {
            const raw = localStorage.getItem('viplava_custom_quizzes');
            return raw ? JSON.parse(raw) : [];
          } catch (_) {
            return [];
          }
        };

        // Sync quizzes collection
        const quizzesRef = collection(db, QUIZZES_COLLECTION);
        unsubscribeQuizzes = onSnapshot(quizzesRef, async (snapshot) => {
          const localCustom = getCustomLocalQuizzes();
          if (!snapshot.empty) {
            const loaded = snapshot.docs.map(d => {
              const data = d.data();
              return {
                id: d.id,
                title: data.title || d.id,
                description: data.description || '',
                isActive: data.isActive || false,
                questionCount: (data.questions || []).length,
                questions: data.questions || [],
                createdAt: data.createdAt || null
              } as QuizDocument;
            });

            // Merge Firestore loaded with local custom quizzes (prefer local if modified) and default quiz
            const map = new Map<string, QuizDocument>();
            map.set(DEFAULT_VIPLAVA_QUIZ.id, DEFAULT_VIPLAVA_QUIZ);
            loaded.forEach(q => map.set(q.id, q));
            localCustom.forEach(q => map.set(q.id, q));

            setAllQuizzes(Array.from(map.values()));
          } else {
            // Seed DEFAULT_VIPLAVA_QUIZ in Firestore without overwriting stopped status
            try {
              await setDoc(doc(db, QUIZZES_COLLECTION, DEFAULT_VIPLAVA_QUIZ.id), {
                title: DEFAULT_VIPLAVA_QUIZ.title,
                description: DEFAULT_VIPLAVA_QUIZ.description,
                isActive: true,
                questionCount: DEFAULT_VIPLAVA_QUIZ.questions.length,
                questions: DEFAULT_VIPLAVA_QUIZ.questions,
                createdAt: serverTimestamp()
              }, { merge: true });
            } catch (seedErr) {
              console.warn("Seeding initial quiz notice:", seedErr);
            }
            
            const map = new Map<string, QuizDocument>();
            map.set(DEFAULT_VIPLAVA_QUIZ.id, DEFAULT_VIPLAVA_QUIZ);
            localCustom.forEach(q => map.set(q.id, q));
            setAllQuizzes(Array.from(map.values()));
          }
          setIsLoadingQuizzes(false);
        }, (err) => {
          console.warn("Quizzes listener notice (using local bank):", err.message);
          const localCustom = getCustomLocalQuizzes();
          const map = new Map<string, QuizDocument>();
          map.set(DEFAULT_VIPLAVA_QUIZ.id, DEFAULT_VIPLAVA_QUIZ);
          localCustom.forEach(q => map.set(q.id, q));
          setAllQuizzes(Array.from(map.values()));
          setIsLoadingQuizzes(false);
        });
      } catch (err) {
        console.warn("Firestore setup notice:", err);
        const localCustom = (() => {
          try {
            const raw = localStorage.getItem('viplava_custom_quizzes');
            return raw ? JSON.parse(raw) : [];
          } catch (_) { return []; }
        })();
        const map = new Map<string, QuizDocument>();
        map.set(DEFAULT_VIPLAVA_QUIZ.id, DEFAULT_VIPLAVA_QUIZ);
        localCustom.forEach(q => map.set(q.id, q));
        setAllQuizzes(Array.from(map.values()));
        setIsLoadingQuizzes(false);
      }
    };

    setupFirestoreSync();

    return () => {
      if (unsubscribeQuizzes) unsubscribeQuizzes();
      if (unsubscribeConfig) unsubscribeConfig();
    };
  }, [computeIsLive]);

  // Update activeQuiz when activeQuizId or allQuizzes changes
  useEffect(() => {
    const current = allQuizzes.find(q => q.id === activeQuizId) || allQuizzes[0] || DEFAULT_VIPLAVA_QUIZ;
    setActiveQuiz(current);
  }, [activeQuizId, allQuizzes]);

  // Admin: Set Active Quiz in Firestore
  const setActiveQuizId = async (newQuizId: string): Promise<boolean> => {
    setActiveQuizIdState(newQuizId);
    setIsQuizLive(true);
    try {
      localStorage.setItem('viplava_active_quiz_id', newQuizId);
    } catch (_) {}

    try {
      await setDoc(doc(db, CONFIG_COLLECTION, ACTIVE_QUIZ_DOC), {
        activeQuizId: newQuizId,
        isLive: true,
        updatedAt: serverTimestamp()
      }, { merge: true });

      // Also update isActive flags in quizzes collection
      allQuizzes.forEach(async (q) => {
        try {
          await setDoc(doc(db, QUIZZES_COLLECTION, q.id), {
            isActive: q.id === newQuizId
          }, { merge: true });
        } catch (_) {}
      });

      return true;
    } catch (err) {
      console.warn("Active quiz update notice:", err);
      return true;
    }
  };

  // Admin: Instant Live toggle (Force Live vs Force Stopped vs Auto)
  const setQuizLiveStatus = async (isLive: boolean): Promise<boolean> => {
    const newOverride = isLive ? 'force_live' : 'force_stopped';
    setIsQuizLive(isLive);
    setSlotSchedule(prev => ({ ...prev, manualOverride: newOverride }));
    try {
      localStorage.setItem('viplava_quiz_is_live', String(isLive));
      localStorage.setItem('viplava_quiz_override', newOverride);
    } catch (_) {}

    try {
      await setDoc(doc(db, CONFIG_COLLECTION, ACTIVE_QUIZ_DOC), {
        isLive,
        manualOverride: newOverride,
        updatedAt: serverTimestamp()
      }, { merge: true });
      return true;
    } catch (err: any) {
      console.warn("Live status update notice:", err?.message || err);
      return true;
    }
  };

  // Admin: Update 4-Hour Schedule for October 29th
  const updateSlotSchedule = async (newSchedule: Partial<SlotSchedule>): Promise<boolean> => {
    const merged: SlotSchedule = { ...slotSchedule, ...newSchedule };
    setSlotSchedule(merged);
    setIsQuizLive(computeIsLive(merged, true));
    try {
      localStorage.setItem('viplava_slot_schedule', JSON.stringify(merged));
    } catch (_) {}

    try {
      await setDoc(doc(db, CONFIG_COLLECTION, ACTIVE_QUIZ_DOC), {
        slotEnabled: merged.enabled,
        slotDate: merged.date,
        slotStartTime: merged.startTime,
        slotEndTime: merged.endTime,
        manualOverride: merged.manualOverride,
        updatedAt: serverTimestamp()
      }, { merge: true });
      return true;
    } catch (err: any) {
      console.warn("Slot schedule update notice:", err?.message || err);
      return true;
    }
  };

  // Admin: Create New Quiz with Questions in Firestore & Local Storage
  const createNewQuiz = async (quizData: {
    id: string;
    title: string;
    description: string;
    questions: QuizQuestion[];
  }): Promise<boolean> => {
    const cleanId = quizData.id.trim().toLowerCase().replace(/[^a-z0-9_-]/g, '_');
    
    const cleanQuestions = quizData.questions.map((q, idx) => {
      const item: any = {
        id: q.id ? String(q.id) : String(idx + 1),
        question: String(q.question || '').trim(),
        options: (q.options || []).map(o => String(o).trim()),
        correct: String(q.correct || '').trim()
      };
      if (q.explanation && String(q.explanation).trim()) {
        item.explanation = String(q.explanation).trim();
      }
      if (q.answerHash) {
        item.answerHash = String(q.answerHash);
      }
      return item;
    });

    const newDoc: QuizDocument = {
      id: cleanId,
      title: quizData.title.trim(),
      description: quizData.description ? quizData.description.trim() : '',
      isActive: false,
      questionCount: cleanQuestions.length,
      questions: cleanQuestions
    };

    // 1. Update React state immediately
    setAllQuizzes(prev => [...prev.filter(q => q.id !== cleanId), newDoc]);

    // 2. Persist locally in localStorage
    try {
      const raw = localStorage.getItem('viplava_custom_quizzes');
      const existing: QuizDocument[] = raw ? JSON.parse(raw) : [];
      const updated = [...existing.filter(q => q.id !== cleanId), newDoc];
      localStorage.setItem('viplava_custom_quizzes', JSON.stringify(updated));
    } catch (_) {}

    // 3. Sync to Firestore (non-blocking)
    try {
      await setDoc(doc(db, QUIZZES_COLLECTION, cleanId), {
        id: newDoc.id,
        title: newDoc.title,
        description: newDoc.description,
        isActive: newDoc.isActive,
        questionCount: newDoc.questionCount,
        questions: newDoc.questions,
        createdAt: serverTimestamp()
      });
    } catch (err: any) {
      console.warn("Notice: Firestore remote quiz setDoc notice (saved in local store):", err?.message || err);
    }

    return true;
  };

  // Admin: Delete Quiz
  const deleteQuiz = async (quizIdToDelete: string): Promise<boolean> => {
    if (quizIdToDelete === DEFAULT_VIPLAVA_QUIZ.id) {
      console.warn("The default VIPLAVA 2026 Bhagavad Gita quiz cannot be deleted.");
      return false;
    }

    // 1. Update React state
    setAllQuizzes(prev => prev.filter(q => q.id !== quizIdToDelete));
    if (activeQuizId === quizIdToDelete) {
      setActiveQuizIdState(DEFAULT_VIPLAVA_QUIZ.id);
    }

    // 2. Remove from localStorage
    try {
      const raw = localStorage.getItem('viplava_custom_quizzes');
      if (raw) {
        const existing: QuizDocument[] = JSON.parse(raw);
        const updated = existing.filter(q => q.id !== quizIdToDelete);
        localStorage.setItem('viplava_custom_quizzes', JSON.stringify(updated));
      }
    } catch (_) {}

    // 3. Sync to Firestore
    try {
      await deleteDoc(doc(db, QUIZZES_COLLECTION, quizIdToDelete));
    } catch (err: any) {
      console.warn("Notice: Firestore deleteDoc notice:", err?.message || err);
    }

    return true;
  };

  // Start Quiz with 20 questions randomized + options shuffled + anti-cheat sanitized
  const startQuiz = useCallback(() => {
    const questionSource = (activeQuiz && activeQuiz.questions && activeQuiz.questions.length > 0)
      ? activeQuiz.questions
      : quizArray;

    const selected20 = prepareQuizQuestions(questionSource, 20);
    setQuestions(selected20);
    setCurrentQuestionIndex(0);
    setScore(0);
    setAnswers([]);
    setTimeTaken(0);
    setIsFinished(false);
    isSubmittingRef.current = false;

    if (participant) {
      secureSessionRef.current = createSecureSession(
        { name: participant.name, phoneNumber: participant.phoneNumber },
        selected20.map(q => q.id)
      );
    }
  }, [activeQuiz, participant]);

  // Submit Answer - Cryptographic evaluation using salted SHA-256 hash
  const submitAnswer = (answer: string, timeForThisQuestion: number) => {
    if (isSubmittingRef.current) return;
    isSubmittingRef.current = true;

    const currentQuestion = questions[currentQuestionIndex];
    if (!currentQuestion) {
      isSubmittingRef.current = false;
      return;
    }

    // Anti-Cheat: Evaluate using salted SHA-256 hash or fallback to direct match
    const isCorrect = currentQuestion.answerHash
      ? verifyAnswerSelection(currentQuestion.id, answer, currentQuestion.answerHash)
      : (currentQuestion.correct ? answer === currentQuestion.correct : false);

    // Record into tamper-evident hash chain
    if (secureSessionRef.current) {
      secureSessionRef.current = recordAnswerInChain(
        secureSessionRef.current,
        currentQuestion.id,
        answer,
        timeForThisQuestion
      );
    }

    const nextScore = isCorrect ? score + 1 : score;
    const nextAnswers = [
      ...answers,
      {
        questionId: currentQuestion.id,
        selected: answer,
        isCorrect
      }
    ];
    const nextTimeTaken = timeTaken + timeForThisQuestion;

    if (isCorrect) setScore(nextScore);
    setAnswers(nextAnswers);
    setTimeTaken(nextTimeTaken);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      isSubmittingRef.current = false;
    } else {
      finishQuiz(nextScore, nextAnswers, nextTimeTaken);
    }
  };

  // Finalize and save to Firestore with 64-char verification seal
  const finishQuiz = async (
    finalScore?: number,
    finalAnswers?: { questionId: string; selected: string; isCorrect: boolean }[],
    finalTime?: number
  ) => {
    setIsFinished(true);
    isSubmittingRef.current = false;

    const resolvedScore = finalScore !== undefined ? finalScore : score;
    const resolvedTime = finalTime !== undefined ? finalTime : timeTaken;
    const quizIdToRecord = activeQuiz?.id || CURRENT_QUIZ_ID;
    const quizTitleToRecord = activeQuiz?.title || CURRENT_QUIZ_TITLE;

    const audit = (secureSessionRef.current && participant)
      ? finalizeSecureSession(secureSessionRef.current, resolvedScore, questions.length || 20)
      : { isValid: true, verificationHash: sha256(`VIPLAVA_${Date.now()}_${participant?.phoneNumber || 'anon'}`) };

    if (participant) {
      const path = RESULTS_COLLECTION;
      try {
        const cleanP = participant.phoneNumber.replace(/[^0-9]/g, '');
        if (cleanP) {
          localStorage.setItem(`viplava_completed_${cleanP}`, 'true');
        }
        localStorage.setItem(`viplava_completed_${participant.phoneNumber.trim()}`, 'true');

        await addDoc(collection(db, path), {
          name: participant.name,
          universityOrArea: participant.universityOrArea || '',
          rollNumber: participant.rollNumber || participant.universityOrArea || '',
          branch: participant.branch || '',
          course: 'VIPLAVA 2026',
          phoneNumber: participant.phoneNumber,
          score: resolvedScore,
          totalQuestions: questions.length || 20,
          timeTaken: resolvedTime,
          verificationHash: audit.verificationHash,
          timestamp: serverTimestamp(),
          quizId: quizIdToRecord,
          quizTitle: quizTitleToRecord
        });
      } catch (error) {
        handleFirestoreError(error, OperationType.CREATE, path);
      }
    }
  };

  const resetQuiz = () => {
    setParticipant(null);
    setQuestions([]);
    setCurrentQuestionIndex(0);
    setScore(0);
    setAnswers([]);
    setTimeTaken(0);
    setIsFinished(false);
    isSubmittingRef.current = false;
    secureSessionRef.current = null;
  };

  return (
    <QuizContext.Provider value={{
      participant,
      setParticipant,
      questions,
      currentQuestionIndex,
      score,
      answers,
      timeTaken,
      isFinished,
      activeQuiz,
      activeQuizId,
      isQuizLive,
      slotSchedule,
      allQuizzes,
      isLoadingQuizzes,
      startQuiz,
      submitAnswer,
      resetQuiz,
      setActiveQuizId,
      setQuizLiveStatus,
      updateSlotSchedule,
      createNewQuiz,
      deleteQuiz
    }}>
      {children}
    </QuizContext.Provider>
  );
};

export const useQuiz = () => {
  const context = useContext(QuizContext);
  if (!context) throw new Error('useQuiz must be used within a QuizProvider');
  return context;
};
