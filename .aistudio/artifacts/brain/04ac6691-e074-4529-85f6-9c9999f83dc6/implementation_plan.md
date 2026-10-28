# 300-Question Bhagavad Gita Dataset & Permanent Quiz Activation

Integrate the complete 300-question Bhagavad Gita dataset into the primary quiz engine, randomize 20 questions per attempt with option shuffling and cryptographic SHA-256 anti-cheat protection, and remove all timer/schedule barriers so the quiz remains permanently active and accessible to all participants by default.

## User Review & Critical Decisions

> [!IMPORTANT]
> The following decisions reflect the user's latest explicit preferences:

- **Confirmed Decision 1 (300-Question Dataset Integration)**: Replace the default Bhagavad Gita question bank in `src/data/questions.ts` with the complete 300-question set provided in the attachment.
- **Confirmed Decision 2 (20-Question Random Selection & Anti-Cheat Vault)**: Each participant attempt dynamically samples 20 randomized questions from the 300-question bank. Option choices are shuffled, and answers are validated via salted SHA-256 hashes.
- **Confirmed Decision 3 (Permanent Open Access)**: Completely remove all countdown timers, date/time restrictions, and slot schedules. `isQuizLive` defaults to `true` permanently, eliminating waiting rooms or time blocks for candidates across all devices.

---

## 1. Overview & Core Concept

- **What It Does**: Upgrades the VIPLAVA 2026 Bhagavad Gita Wisdom Quest to use an expansive 300-question bank. Participants receive a unique 20-question challenge on each attempt. Access is open 24/7 without schedule restrictions.
- **Target Audience / Persona**: Youth participants taking the Bhagavad Gita Wisdom Quest, and administrators overseeing submission results.
- **Key Value**: Provides diverse, deep Vedic knowledge questions across attempts with zero scheduling friction or access barriers.

---

## 2. User Experience & Visual Design

- **Participant Flow**:
  1. Participant enters Name, University/Area, and Phone Number on the Registration page.
  2. Clicking **"Begin VIPLAVA Quiz"** immediately launches the 20-question randomized quiz without any timer or date restrictions.
  3. The candidate completes 20 randomized questions sampled from the 300-question bank.
  4. Upon completion, score, time taken, and cryptographic verification hash are saved to Firestore.
- **Admin Flow**:
  1. Admin portal displays active quiz management and participant submission records.
  2. Custom quiz editor and JSON upload tools remain available for adding additional specialized quiz sets.
  3. All timers and force-stop status displays are removed for a streamlined management interface.

---

## 3. Key Product Decisions & Trade-Offs

- **Decision 1: Full Embedding of 300 Bhagavad Gita Questions**
  - *Chosen Approach*: Embed all 300 questions directly in `src/data/questions.ts` with pre-computed anti-cheat SHA-256 hashes and optional upload to Firestore as `DEFAULT_VIPLAVA_QUIZ`.
  - *Why*: Guarantees instant offline-capable loading and eliminates network bottlenecks during large concurrent participant spikes.
- **Decision 2: Elimination of Timer & Schedule Engine**
  - *Chosen Approach*: Set `isQuizLive` to `true` permanently in `QuizContext.tsx` and clean up `SlotSchedule` state logic.
  - *Why*: Per explicit user request, removes all schedule friction, time zone ambiguities, and waiting room delays across all devices.

---

## 4. Technical Architecture & Data Strategy

### Architecture & Data Flow

```
┌────────────────────────────────────────────────────────────────────────┐
│                        300-Question Dataset                            │
│           (300 Bhagavad Gita Multiple Choice Questions)               │
└──────────────────────────────────┬─────────────────────────────────────┘
                                   │
                                   ▼
┌────────────────────────────────────────────────────────────────────────┐
│                        prepareQuizQuestions()                          │
│                                                                        │
│  1. Samples 20 random items from the 300-question pool                 │
│  2. Shuffles option choices per question                               │
│  3. Computes salted SHA-256 hashes for anti-cheat verification         │
└──────────────────────────────────┬─────────────────────────────────────┘
                                   │
                                   ▼
┌────────────────────────────────────────────────────────────────────────┐
│                         QuizContext & Views                            │
│                                                                        │
│  • isQuizLive = true (Permanently Active)                              │
│  • Direct transition from Registration -> 20-Question Quiz             │
│  • Submits score + verification hash to Firestore 'results' collection │
└────────────────────────────────────────────────────────────────────────┘
```

---

## Proposed Code Changes

1. **`src/data/questions.ts`**:
   - Parse and load the complete 300 questions from `/public/assets/aistudio/Bhagavad_Gita_Random_300_Questions_No_Images_Needed_d7461c74.json`.
   - Update `DEFAULT_VIPLAVA_QUIZ` and `quizArray` with the 300-question dataset.

2. **`src/QuizContext.tsx`**:
   - Set `isQuizLive` to `true` by default permanently.
   - Remove time slot schedule calculation dependencies and manual override blocks.

3. **`src/components/QuoteAndStatsSection.tsx` & `src/pages/RegistrationPage.tsx`**:
   - Remove countdown timers and "Scheduled Event Window" notice banners.
   - Display active event badge ("VIPLAVA 2026 · Bhagavad Gita Wisdom Quest — Live & Active").

4. **`src/pages/AdminPage.tsx`**:
   - Remove 4-Hour slot schedule inputs and time window settings.
   - Keep Quiz Selection, JSON Editor, and File Upload tools.

---

## Verification & Quality Assurance

1. Run `lint_applet` (`tsc --noEmit`) to verify zero TypeScript or syntax errors.
2. Build applet via `npm run build` and run `compile_applet`.
3. Verify that starting a new quiz selects 20 random questions from the 300-question pool with randomized options and valid score recording.
