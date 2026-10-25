# VIPLAVA 2026 — The Bhagavad Gita Wisdom Quest

Transition VIPLAVA 2026 into an authentic, immersive Bhagavad Gita As It Is interactive quest. This update replaces previous biographical themes with the timeless dialogue of Krishna and Arjuna at Kurukshetra, equips the app with an authentic 18-chapter question bank (randomly serving 20 questions per attempt), introduces a scheduled 4-hour countdown window with admin manual override on October 29th, and optimizes database reads/writes for 300 participants.

### User Review & Critical Decisions

> [!IMPORTANT]
> The following architectural and design choices were confirmed and will govern the implementation:

- **Confirmed Decision 1 (Quiz Window Control)**: Automatic 4-hour countdown window for October 29th (with real-time live synchronization and instantaneous manual Start/Stop override in the Admin Panel).
- **Confirmed Decision 2 (Question Scope)**: Comprehensive coverage across all 18 chapters of Srila Prabhupada's *Bhagavad-gita As It Is*, systematically balanced between Karma Yoga (Ch 1–6), Bhakti Yoga (Ch 7–12), and Jnana Yoga (Ch 13–18) with a 20% easy, 55% medium, and 25% hard difficulty distribution.
- **Confirmed Decision 3 (Visual Aesthetic)**: Kurukshetra chariot at golden dawn, with deep twilight navy, antique gold, sacred Sanskrit shloka typography, and conch-shell motifs, adhering strictly to anti-slop design rules (no generic capsules, unboxed metadata, and high-legibility type).

---

### 1. Overview & Core Concept

- **What It Does**: Provides youth and devotees an engaging mobile-first platform to test and deepen their understanding of the Bhagavad Gita. Outside the 4-hour event window on October 29th, participants see a real-time countdown waiting room with verse reflections. When active, participants enter an anti-cheat, distraction-free 20-question randomized test with immediate scoring and certificates.
- **Target Audience / Persona**: College students, youth forum participants, and spiritual seekers registered across university centers and Mathura regions taking part in VIPLAVA 2026.
- **Key Value**: Delivers an authentic philosophical examination grounded in Srila Prabhupada's purports, with smooth performance under peak load (300 concurrent attempts) and total administrative control over event timing.

---

### 2. User Experience & Visual Design

- **Key User Flows**:
  1. *Arrival & Countdown*: Participants arrive at the mobile-first Kurukshetra hero landing page, viewing event guidelines, the Bhagavad Gita focus, and a live synchronized countdown to October 29th.
  2. *Registration & Gatekeeping*: Simple 3-field registration (Full Name, University or Area, Phone Number). If accessed before or after the 4-hour slot, the app displays the dedicated waiting room with Sanskrit verses and guidelines.
  3. *The 20-Question Quest*: Upon entering the live quiz, 20 questions are selected and shuffled client-side from the authentic Gita question bank. Questions display verse references (e.g., BG 2.47, BG 9.22, BG 18.66), timer, and clear response buttons.
  4. *Submission & Reflection*: On finish, the result is recorded in Firestore with duplicate submission prevention. Participants view their score breakdown, chapter mastery analysis, and an illuminated verse certificate.
  5. *Admin Command Deck*: Event organizers can manually toggle the quiz live/offline, adjust the 4-hour slot window, review participant submissions, and export real-time rankings.

- **Visual Identity & Theme**:
  - *Aesthetic Direction*: Kurukshetra golden dawn meets sacred Vedic geometry. Atmospheric twilight navy (`#0B1120`), celestial gold accents (`#F59E0B`, `#D97706`), warm parchment surfaces (`#FEF3C7`), and ivory text (`#F8FAFC`).
  - *Typography & Hierarchy*: Display titles in noble serif (`Cinzel` / `Playfair Display`), paired with clean neo-grotesque sans (`Plus Jakarta Sans` / `Outfit`) for questions and guidelines, and tabular numerals (`tabular-nums`) for timers and scoring.
  - *Zero-Pill Discipline*: Categories and verse citations are displayed as clean unboxed inline text with subtle dot separators (`Bhagavad Gita · Chapter 2 · Shloka 47`), eliminating floating capsule chips.
  - *Touch-First Ergonomics*: Question option targets meet or exceed 48px height with immediate tactile press states, eliminating scroll jitter and navigation lag.

- **Interactive Feedback & Motion**:
  - Subtle floating golden particles and chariot wheel geometry in the background using lightweight WebGL/CSS.
  - Micro-interactions on question selection with smooth settling curves (`cubic-bezier(0.16, 1, 0.3, 1)`).

---

### 3. Key Product Decisions & Trade-Offs

- **Decision 1: Client-Side Bundled Question Bank vs. Firestore Document Reads**:
  - *Chosen Approach*: Package the 300 authentic Bhagavad Gita questions directly inside application data modules (`src/data/gitaQuestions.ts`), picking 20 randomized questions per participant session on the client.
  - *Why*: Eliminates 6,000 document reads across 300 participants, guaranteeing 0ms question load latency even on weak mobile cellular connections and keeping total Firestore reads within 3% of the free tier.
  - *Alternatives Considered*: Storing questions in Firestore collection `questions` and fetching 20 random documents per user. Passed over due to excessive query read overhead and potential Firestore read latency spikes during simultaneous starts.

- **Decision 2: Hybrid 4-Hour Time Window (Automated Schedule + Admin Override)**:
  - *Chosen Approach*: Maintain an event schedule in Firestore (`config/active_quiz`) with start and end epoch timestamps for October 29th, backed by a persistent `forceLive` boolean toggle that admins can flick instantly at any moment.
  - *Why*: Gives organizers hands-free automated timing while preserving instant emergency control to pause, extend, or test the quiz live on site.

- **Decision 3: Single-Write Result Ingestion with Phone Number Indexing**:
  - *Chosen Approach*: Participants submit results directly to the `results` collection with an indexed `phoneNumber` and `quizId` compound check to prevent double submissions.
  - *Why*: Guarantees exactly 1 write per completed attempt (300 writes total across 4 hours), well below the 20,000 writes/day free tier limit.

---

### 4. Technical Architecture & Data Strategy

```
┌────────────────────────────────────────────────────────────────────────┐
│                          VIPLAVA 2026 CLIENT                           │
├────────────────────────────────────────────────────────────────────────┤
│  Landing & Hero        Waiting Room            Live 20-Question Quiz   │
│  (Gita Theme)     (Pre/Post 4h Slot)         (Random 20 Shuffled)      │
└───────────┬────────────────────┬───────────────────────────┬───────────┘
            │                    │                           │
            ▼                    ▼                           ▼
┌────────────────────────────────────────────────────────────────────────┐
│                        QUIZ CONTEXT & STORE                            │
│  - Active Quiz Config (Live Status + 4h Slot Window)                   │
│  - Bundled Gita Question Bank (300 Authentic Verses & Purports)        │
│  - Local Randomization Engine (Seed/Shuffle 20 Questions)              │
│  - Session Timer & Answer State Machine                                │
└──────────────────────────┬─────────────────────────────────────────────┘
                           │
            ┌──────────────┴──────────────┐
            ▼                             ▼
┌─────────────────────────┐   ┌──────────────────────────────────────────┐
│ FIRESTORE READS (LOW)   │   │ FIRESTORE WRITES (MINIMAL)               │
│ - config/active_quiz    │   │ - results/{id} (1 write per participant) │
│   (1 listener / 300 rx) │   │ - Total: 300 writes in 4 hours           │
│ - Duplicate check query │   │   (Avg: 1.25 writes/min, Peak: 5/sec)    │
│   (1 getDocs / user)    │   └──────────────────────────────────────────┘
│ - Total: ~600-900 reads │
│   (3% of free quota)    │
└─────────────────────────┘
```

#### Database Read/Write & Quota Forecast (300 Users / 4 Hours)

| Operation | Query / Document Path | Volume (300 Users) | Free Tier Daily Limit | Quota Utilization |
| :--- | :--- | :--- | :--- | :--- |
| **Active Quiz Status** | `doc(db, 'config', 'active_quiz')` | 300 reads (1 per connection) | 50,000 reads | **0.6%** |
| **Registration Check** | `query(results, where('phone', '==', ...))` | 300 reads (1 per user) | 50,000 reads | **0.6%** |
| **Question Retrieval** | Client-side bundled data module | **0 reads** | N/A | **0.0%** |
| **Result Submission** | `addDoc(collection(db, 'results'), ...)` | 300 writes (1 per user) | 20,000 writes | **1.5%** |
| **Admin Live Monitor** | Gated behind admin auth (`limit(300)`) | ~100–300 reads | 50,000 reads | **0.5%** |
| **Total Event Footprint**| **Firestore Database Overall** | **~900 reads / 300 writes** | **50k / 20k** | **Extremely Safe (<3%)** |

#### Data Models

```typescript
// Firestore document: config/active_quiz
interface ActiveQuizConfig {
  activeQuizId: string;           // "bhagavad-gita-wisdom-quest"
  isQuizLive: boolean;            // Master manual live toggle
  scheduledDate: string;          // "2026-10-29"
  windowStartEpoch: number;       // Start timestamp of the 4-hour slot
  windowEndEpoch: number;         // End timestamp of the 4-hour slot
  durationMinutes: number;        // e.g. 25 minutes per attempt
  questionCount: number;          // 20
  allowRegistration: boolean;
}

// Client question shape: src/data/gitaQuestions.ts
interface GitaQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  chapter: number;                // 1 to 18
  verseReference: string;         // e.g., "BG 2.47", "BG 9.22", "BG 18.66"
  difficulty: "easy" | "medium" | "hard";
  explanation: string;            // Grounded in Srila Prabhupada's purports
}
```

#### Step-by-Step Implementation Sequence (Post-Approval)

1. **Gita Question Bank (`src/data/gitaQuestions.ts`)**: Construct a comprehensive bank of authentic Bhagavad Gita questions covering all 18 chapters with accurate Sanskrit verses, authentic English translations, and purports from *Bhagavad-gita As It Is*.
2. **Visual & Aesthetic Overhaul**:
   - Update `ViplavaHero.tsx` with Kurukshetra chariot imagery, golden dawn gradients, and Gita wisdom headings.
   - Update `QuoteAndStatsSection.tsx` with prominent Gita verse (BG 4.38: *"In this world, there is nothing so sublime and pure as transcendental knowledge..."*) and countdown to October 29th.
   - Update `QuizThemesSection.tsx` into the 4 thematic divisions of the Gita (Karma Yoga, Bhakti Yoga, Jnana Yoga, and the Universal Form).
3. **4-Hour Slot & Admin Controls**:
   - Update `QuizContext.tsx` to compute slot validity based on October 29th timestamps while allowing instant Admin override.
   - Enhance `AdminPage.tsx` with slot time picker, instant Start/Stop controls, live countdown preview, and participant export.
   - Enhance `RegistrationPage.tsx` and waiting room state when outside the 4-hour window.
4. **Verification**: Compile and lint the app to ensure zero TypeScript errors or layout regressions.
