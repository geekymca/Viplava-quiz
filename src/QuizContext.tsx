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
  onSnapshot,
  query,
  where
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
  startTime: '20:00',
  endTime: '22:00',
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

  // Dynamic quizzes from Firestore (authoritative source across all devices)
  const [allQuizzes, setAllQuizzes] = useState<QuizDocument[]>([DEFAULT_VIPLAVA_QUIZ]);
  const [activeQuizId, setActiveQuizIdState] = useState<string>(DEFAULT_QUIZ_ID);
  const [activeQuiz, setActiveQuiz] = useState<QuizDocument | null>(DEFAULT_VIPLAVA_QUIZ);
  
  // Live control and slot schedule (authoritative source is Firestore)
  const [slotSchedule, setSlotSchedule] = useState<SlotSchedule>(DEFAULT_SLOT_SCHEDULE);
  const [isQuizLive, setIsQuizLive] = useState<boolean>(true);
  const [isLoadingQuizzes, setIsLoadingQuizzes] = useState(true);

  // Submitting guard to prevent rapid double-clicks
  const isSubmittingRef = useRef(false);
  const secureSessionRef = useRef<SecureQuizSession | null>(null);

  // Helper: Quiz is permanently active by default per user specification
  const computeIsLive = useCallback((_schedule: SlotSchedule, _baseLive: boolean) => {
    return true;
  }, []);

  // 1. Listen for active quiz config & quizzes list
  useEffect(() => {
    let unsubscribeQuizzes: (() => void) | null = null;
    let unsubscribeConfig: (() => void) | null = null;

    const setupFirestoreSync = async () => {
      try {
        // 1. Sync global app configuration (active quiz pointer)
        const configRef = doc(db, RESULTS_COLLECTION, 'config_active_quiz');
        unsubscribeConfig = onSnapshot(configRef, (snapshot) => {
          if (snapshot.exists()) {
            const data = snapshot.data();
            if (data.type === 'app_config' || data.activeQuizId) {
              if (data.activeQuizId) {
                setActiveQuizIdState(data.activeQuizId);
              }
              setIsQuizLive(true);
            }
          }
        }, (err) => {
          console.warn("Config listener notice:", err.message);
        });

        // 2. Sync all custom quizzes from Firestore (only query docs where type == 'quiz_definition')
        const qQuizzes = query(collection(db, RESULTS_COLLECTION), where('type', '==', 'quiz_definition'));
        unsubscribeQuizzes = onSnapshot(qQuizzes, (snapshot) => {
          const customQuizzes: QuizDocument[] = [];
          snapshot.docs.forEach(docSnap => {
            const data = docSnap.data();
            const cleanId = data.quizId || docSnap.id.replace(/^quiz_/, '');
            customQuizzes.push({
              id: cleanId,
              title: data.title || data.name || cleanId,
              description: data.description || '',
              isActive: data.isActive || false,
              questionCount: (data.questions || []).length,
              questions: data.questions || [],
              createdAt: data.createdAt || null
            } as QuizDocument);
          });

          // Always ensure DEFAULT_VIPLAVA_QUIZ is present
          const quizMap = new Map<string, QuizDocument>();
          quizMap.set(DEFAULT_VIPLAVA_QUIZ.id, DEFAULT_VIPLAVA_QUIZ);
          customQuizzes.forEach(q => quizMap.set(q.id, q));

          setAllQuizzes(Array.from(quizMap.values()));
          setIsLoadingQuizzes(false);
        }, (err) => {
          console.warn("Quizzes listener notice:", err.message);
          setIsLoadingQuizzes(false);
        });
      } catch (err) {
        console.warn("Firestore setup notice:", err);
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
    const current = allQuizzes.find(q => 
      q.id === activeQuizId || 
      (q.id === 'bhagavad_gita_as_it_is' && activeQuizId === 'bhagavad_gita_viplava_2026') ||
      (q.id === 'bhagavad_gita_viplava_2026' && activeQuizId === 'bhagavad_gita_as_it_is')
    ) || allQuizzes[0] || DEFAULT_VIPLAVA_QUIZ;
    setActiveQuiz(current);
  }, [activeQuizId, allQuizzes]);

  // Admin: Set Active Quiz in Firestore (Broadcasts to all devices via onSnapshot)
  const setActiveQuizId = async (newQuizId: string): Promise<boolean> => {
    setActiveQuizIdState(newQuizId);
    setIsQuizLive(true);
    setSlotSchedule(prev => ({ ...prev, manualOverride: 'force_live' }));

    try {
      const configRef = doc(db, RESULTS_COLLECTION, 'config_active_quiz');
      try {
        await deleteDoc(configRef);
      } catch (_) {}

      await setDoc(configRef, {
        name: 'System Configuration',
        phoneNumber: '0000000000',
        score: 0,
        totalQuestions: 20,
        timeTaken: 0,
        type: 'app_config',
        activeQuizId: newQuizId,
        isLive: true,
        manualOverride: 'force_live',
        slotEnabled: slotSchedule.enabled,
        slotDate: slotSchedule.date,
        slotStartTime: slotSchedule.startTime,
        slotEndTime: slotSchedule.endTime,
        updatedAt: new Date().toISOString()
      });

      return true;
    } catch (err: any) {
      console.error("Failed to update active quiz in Firestore:", err);
      return false;
    }
  };

  // Admin: Instant Live toggle (Force Live vs Force Stopped vs Auto) in Firestore
  const setQuizLiveStatus = async (isLive: boolean): Promise<boolean> => {
    const newOverride = isLive ? 'force_live' : 'force_stopped';
    setIsQuizLive(isLive);
    setSlotSchedule(prev => ({ ...prev, manualOverride: newOverride }));

    try {
      const configRef = doc(db, RESULTS_COLLECTION, 'config_active_quiz');
      try {
        await deleteDoc(configRef);
      } catch (_) {}

      await setDoc(configRef, {
        name: 'System Configuration',
        phoneNumber: '0000000000',
        score: 0,
        totalQuestions: 20,
        timeTaken: 0,
        type: 'app_config',
        activeQuizId,
        isLive,
        manualOverride: newOverride,
        slotEnabled: slotSchedule.enabled,
        slotDate: slotSchedule.date,
        slotStartTime: slotSchedule.startTime,
        slotEndTime: slotSchedule.endTime,
        updatedAt: new Date().toISOString()
      });

      return true;
    } catch (err: any) {
      console.error("Failed to update live status in Firestore:", err);
      return false;
    }
  };

  // Admin: Update 4-Hour Schedule for October 29th in Firestore
  const updateSlotSchedule = async (newSchedule: Partial<SlotSchedule>): Promise<boolean> => {
    const merged: SlotSchedule = { ...slotSchedule, ...newSchedule };
    setSlotSchedule(merged);
    const computedLive = computeIsLive(merged, true);
    setIsQuizLive(computedLive);

    try {
      const configRef = doc(db, RESULTS_COLLECTION, 'config_active_quiz');
      try {
        await deleteDoc(configRef);
      } catch (_) {}

      await setDoc(configRef, {
        name: 'System Configuration',
        phoneNumber: '0000000000',
        score: 0,
        totalQuestions: 20,
        timeTaken: 0,
        type: 'app_config',
        activeQuizId,
        isLive: computedLive,
        manualOverride: merged.manualOverride,
        slotEnabled: merged.enabled,
        slotDate: merged.date,
        slotStartTime: merged.startTime,
        slotEndTime: merged.endTime,
        updatedAt: new Date().toISOString()
      });

      return true;
    } catch (err: any) {
      console.error("Failed to update slot schedule in Firestore:", err);
      return false;
    }
  };

  // Admin: Create New Quiz with Questions in Firestore
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

    // 1. Update React state immediately for snappy UI
    setAllQuizzes(prev => [...prev.filter(q => q.id !== cleanId), newDoc]);

    // 2. Persist directly to Firestore results collection with quiz_ prefix
    try {
      const quizDocRef = doc(db, RESULTS_COLLECTION, `quiz_${cleanId}`);
      try {
        await deleteDoc(quizDocRef);
      } catch (_) {}

      await setDoc(quizDocRef, {
        name: newDoc.title,
        phoneNumber: '0000000000',
        score: 0,
        totalQuestions: cleanQuestions.length || 20,
        timeTaken: 0,
        type: 'quiz_definition',
        quizId: cleanId,
        title: newDoc.title,
        description: newDoc.description,
        isActive: newDoc.isActive,
        questions: newDoc.questions,
        createdAt: new Date().toISOString()
      });

      return true;
    } catch (err: any) {
      console.error("Failed to persist new quiz to Firestore:", err);
      return false;
    }
  };

  // Admin: Delete Quiz in Firestore
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

    // 2. Sync deletion to Firestore
    try {
      const quizDocRef = doc(db, RESULTS_COLLECTION, `quiz_${quizIdToDelete}`);
      await deleteDoc(quizDocRef);
      return true;
    } catch (err: any) {
      console.error("Failed to delete quiz from Firestore:", err);
      return false;
    }
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
          localStorage.setItem(`viplava_completed_${quizIdToRecord}_${cleanP}`, 'true');
        }
        localStorage.setItem(`viplava_completed_${quizIdToRecord}_${participant.phoneNumber.trim()}`, 'true');

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
