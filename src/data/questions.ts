import { QuizQuestion, QuizDocument } from "../types";
import { bhagavadGita300Questions } from "./bhagavadGitaQuestions";
import { hashAnswer } from "../lib/cryptoVault";

export const quizArray: QuizQuestion[] = bhagavadGita300Questions;

export function shuffle<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export const getRandomQuestions = (count: number = 20): QuizQuestion[] => {
  return prepareQuizQuestions(quizArray, count);
};

/**
 * Anti-Cheat Question Preparation:
 * Strips plaintext correct answers and explanations before passing to the UI.
 * Attaches a salted cryptographic SHA-256 hash so DevTools inspection cannot reveal the answer.
 */
export const prepareQuizQuestions = (questionBank: QuizQuestion[], count: number = 20): QuizQuestion[] => {
  if (!questionBank || questionBank.length === 0) return [];
  
  // Pick random 20 questions across the question bank
  const shuffledQuestions = shuffle(questionBank);
  const selected = shuffledQuestions.slice(0, Math.min(count, shuffledQuestions.length));

  // Sanitize: strip 'correct' and 'explanation', emit 'answerHash'
  return selected.map(q => {
    const rawAnswer = q.correct || '';
    const answerHash = q.answerHash || (rawAnswer ? hashAnswer(q.id, rawAnswer) : '');
    
    return {
      id: q.id,
      question: q.question,
      options: shuffle([...q.options]),
      answerHash,
      difficulty: q.difficulty
    };
  });
};

export const GITA_QUIZ_ID = "bhagavad_gita_as_it_is";

export const DEFAULT_VIPLAVA_QUIZ: QuizDocument = {
  id: GITA_QUIZ_ID,
  title: "Bhagavad Gita As It Is — The Wisdom Quest",
  description: "The Song of God: Flagship spiritual wisdom quest on the timeless dialogue between Sri Krishna and Arjuna on the holy field of Kurukshetra. Comprehensive 18-chapter philosophical exploration covering Karma Yoga, Bhakti Yoga, Jnana Yoga, and the Supreme Person, as presented by His Divine Grace A.C. Bhaktivedanta Swami Prabhupada. Hosted at Gokul Mathura Dham.",
  isActive: true,
  questionCount: bhagavadGita300Questions.length,
  questions: bhagavadGita300Questions
};
