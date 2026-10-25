/**
 * VIPLAVA 2026 — Cryptographic Security & Anti-Cheat Vault
 * 
 * Protects questions from DevTools / script inspection:
 * 1. Hashes and obfuscates correct answers so plaintext answers NEVER exist in client UI memory.
 * 2. Enforces tamper-proof question timing constraints (flags/rejects impossible bot response times).
 * 3. Mints a 64-character SHA-256 verificationHash to authenticate legitimate submissions.
 */

// Constant salt used for answer hashing
const VAULT_SALT = "VIPLAVA_GOKUL_DHAM_2026_GITA_WISDOM_QUEST_SALT_108";

/**
 * High-performance synchronous SHA-256 implementation
 * Guarantees zero latency and universal compatibility in browser environments.
 */
export function sha256(message: string): string {
  // Pre-computed table of round constants
  const K = [
    0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
    0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
    0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
    0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
    0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
    0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
    0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
    0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
  ];

  function rotr(n: number, x: number): number {
    return (x >>> n) | (x << (32 - n));
  }

  function ch(x: number, y: number, z: number): number {
    return (x & y) ^ (~x & z);
  }

  function maj(x: number, y: number, z: number): number {
    return (x & y) ^ (x & z) ^ (y & z);
  }

  function sigma0(x: number): number {
    return rotr(2, x) ^ rotr(13, x) ^ rotr(22, x);
  }

  function sigma1(x: number): number {
    return rotr(6, x) ^ rotr(11, x) ^ rotr(25, x);
  }

  function gamma0(x: number): number {
    return rotr(7, x) ^ rotr(18, x) ^ (x >>> 3);
  }

  function gamma1(x: number): number {
    return rotr(17, x) ^ rotr(19, x) ^ (x >>> 10);
  }

  // Encode UTF-8
  const utf8: number[] = [];
  for (let i = 0; i < message.length; i++) {
    let charcode = message.charCodeAt(i);
    if (charcode < 0x80) utf8.push(charcode);
    else if (charcode < 0x800) {
      utf8.push(0xc0 | (charcode >> 6), 0x80 | (charcode & 0x3f));
    } else if (charcode < 0xd800 || charcode >= 0xe000) {
      utf8.push(0xe0 | (charcode >> 12), 0x80 | ((charcode >> 6) & 0x3f), 0x80 | (charcode & 0x3f));
    } else {
      i++;
      charcode = 0x10000 + (((charcode & 0x3ff) << 10) | (message.charCodeAt(i) & 0x3ff));
      utf8.push(
        0xf0 | (charcode >> 18),
        0x80 | ((charcode >> 12) & 0x3f),
        0x80 | ((charcode >> 6) & 0x3f),
        0x80 | (charcode & 0x3f)
      );
    }
  }

  const bitLength = utf8.length * 8;
  utf8.push(0x80);
  while ((utf8.length % 64) !== 56) utf8.push(0);

  // Append 64-bit length (big-endian)
  const highBits = Math.floor(bitLength / 0x100000000);
  const lowBits = bitLength >>> 0;
  for (let i = 3; i >= 0; i--) utf8.push((highBits >>> (i * 8)) & 0xff);
  for (let i = 3; i >= 0; i--) utf8.push((lowBits >>> (i * 8)) & 0xff);

  let H0 = 0x6a09e667;
  let H1 = 0xbb67ae85;
  let H2 = 0x3c6ef372;
  let H3 = 0xa54ff53a;
  let H4 = 0x510e527f;
  let H5 = 0x9b05688c;
  let H6 = 0x1f83d9ab;
  let H7 = 0x5be0cd19;

  const W = new Array(64);

  for (let i = 0; i < utf8.length; i += 64) {
    for (let t = 0; t < 16; t++) {
      W[t] = (utf8[i + t * 4] << 24) | (utf8[i + t * 4 + 1] << 16) | (utf8[i + t * 4 + 2] << 8) | utf8[i + t * 4 + 3];
    }
    for (let t = 16; t < 64; t++) {
      W[t] = (gamma1(W[t - 2]) + W[t - 7] + gamma0(W[t - 15]) + W[t - 16]) | 0;
    }

    let a = H0;
    let b = H1;
    let c = H2;
    let d = H3;
    let e = H4;
    let f = H5;
    let g = H6;
    let h = H7;

    for (let t = 0; t < 64; t++) {
      const T1 = (h + sigma1(e) + ch(e, f, g) + K[t] + W[t]) | 0;
      const T2 = (sigma0(a) + maj(a, b, c)) | 0;
      h = g;
      g = f;
      f = e;
      e = (d + T1) | 0;
      d = c;
      c = b;
      b = a;
      a = (T1 + T2) | 0;
    }

    H0 = (H0 + a) | 0;
    H1 = (H1 + b) | 0;
    H2 = (H2 + c) | 0;
    H3 = (H3 + d) | 0;
    H4 = (H4 + e) | 0;
    H5 = (H5 + f) | 0;
    H6 = (H6 + g) | 0;
    H7 = (H7 + h) | 0;
  }

  const hex = (n: number) => ('00000000' + (n >>> 0).toString(16)).slice(-8);
  return hex(H0) + hex(H1) + hex(H2) + hex(H3) + hex(H4) + hex(H5) + hex(H6) + hex(H7);
}

/**
 * Computes salted cryptographic hash for an answer option
 */
export function hashAnswer(questionId: string, answerText: string): string {
  const normalized = answerText.trim();
  return sha256(`${VAULT_SALT}::${questionId}::${normalized}`);
}

/**
 * Verifies if user's selected option matches the question's encrypted hash
 */
export function verifyAnswerSelection(questionId: string, selectedOption: string, expectedHash: string): boolean {
  if (!selectedOption || !expectedHash) return false;
  const userHash = hashAnswer(questionId, selectedOption);
  return userHash.toLowerCase() === expectedHash.toLowerCase();
}

/**
 * Anti-Cheat Session State Tracker
 */
export interface SecureQuizSession {
  sessionId: string;
  phoneNumber: string;
  name: string;
  startTime: number;
  questionIds: string[];
  answerHashes: string[];
  timeLogs: number[];
  chainHash: string;
}

/**
 * Initializes a tamper-evident quiz session
 */
export function createSecureSession(participant: { name: string; phoneNumber: string }, questionIds: string[]): SecureQuizSession {
  const sessionId = sha256(`${participant.phoneNumber}::${Date.now()}::${Math.random()}`).slice(0, 24);
  const startTime = Date.now();
  const initialChain = sha256(`START::${sessionId}::${participant.phoneNumber}::${startTime}`);

  return {
    sessionId,
    phoneNumber: participant.phoneNumber,
    name: participant.name,
    startTime,
    questionIds,
    answerHashes: [],
    timeLogs: [],
    chainHash: initialChain
  };
}

/**
 * Records an answered question into the tamper-proof cryptographic chain
 */
export function recordAnswerInChain(
  session: SecureQuizSession, 
  questionId: string, 
  chosenOption: string, 
  timeSpentSec: number
): SecureQuizSession {
  const answerHash = hashAnswer(questionId, chosenOption);
  const now = Date.now();
  
  // Update cryptographically linked hash chain
  const nextChain = sha256(`${session.chainHash}::${questionId}::${answerHash}::${timeSpentSec}::${now}`);

  return {
    ...session,
    answerHashes: [...session.answerHashes, answerHash],
    timeLogs: [...session.timeLogs, timeSpentSec],
    chainHash: nextChain
  };
}

/**
 * Finalizes and audits the session, generating the final verification hash for Firestore
 */
export function finalizeSecureSession(
  session: SecureQuizSession,
  calculatedScore: number,
  totalQuestions: number
): {
  isValid: boolean;
  verificationHash: string;
  flagReason?: string;
} {
  const totalDurationSec = Math.floor((Date.now() - session.startTime) / 1000);

  // Anti-Cheat Check 1: Minimum human comprehension time per question
  // 20 questions in under 10 seconds is physically impossible for a human reader
  if (totalDurationSec < 10 && totalQuestions >= 15) {
    return {
      isValid: false,
      verificationHash: sha256(`FRAUD_SPEED::${session.sessionId}::${totalDurationSec}`),
      flagReason: "Submission rejected: Answering speed was physically impossible (<10s for 20 questions)."
    };
  }

  // Anti-Cheat Check 2: Score integrity
  if (calculatedScore < 0 || calculatedScore > totalQuestions) {
    return {
      isValid: false,
      verificationHash: sha256(`FRAUD_SCORE::${session.sessionId}`),
      flagReason: "Submission rejected: Score outside valid bounds."
    };
  }

  // Final 64-character verification hash recorded in Firestore results
  const verificationHash = sha256(
    `VIPLAVA_VERIFIED::${session.sessionId}::${session.phoneNumber}::${calculatedScore}::${totalQuestions}::${totalDurationSec}::${session.chainHash}`
  );

  return {
    isValid: true,
    verificationHash
  };
}
