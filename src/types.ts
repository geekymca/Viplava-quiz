export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correct?: string; // Stripped or hidden in client UI state to prevent DevTools inspection cheating
  answerHash?: string; // Cryptographic SHA-256 hash used for anti-cheat verification
  difficulty?: 'easy' | 'mid' | 'hard';
  explanation?: string;
}

export interface QuizDocument {
  id: string;
  title: string;
  description: string;
  isActive: boolean;
  questionCount: number;
  createdAt?: any;
  questions: QuizQuestion[];
}

export interface Participant {
  name: string;
  universityOrArea?: string;
  rollNumber: string;
  branch: string;
  course: string;
  phoneNumber: string;
  isGeneral?: boolean;
  audienceType?: 'student' | 'general';
}

export interface QuizResult extends Participant {
  score: number;
  totalQuestions: number;
  timeTaken: number; // in seconds
  timestamp: any;
  quizId?: string;
  quizTitle?: string;
  verificationHash?: string; // 64-char SHA-256 cryptographic audit seal
}

export interface SrilaPrabhupadaQuote {
  quote: string;
  source: string;
  theme: string;
}
