# learn-toeic — AGENTS.md

## Project

TOEIC exam simulator (React 19 + TypeScript + Vite + Tailwind v4 + HeroUI).  
Single-page app, no backend, no database.

## Commands

```sh
npm run dev        # Vite dev server
npm run build      # tsc -b && vite build
npm run lint       # eslint .
npx tsc --noEmit   # no-op (root tsconfig has files: []); use npm run build to typecheck
npm run test       # vitest run (Vitest + React Testing Library)
```

## Architecture

```
index.html → main.tsx → App.tsx
                          ├── /                → Home.tsx
                          ├── /exam/:section   → Exam.tsx
                          └── /result          → Result.tsx
```

All data and state live in-memory within a single session. Navigation between `Exam` and `Result` passes state via React Router's `useNavigate` (not URL params or a store).

## Data architecture

- All questions live in `src/data/listening.ts` (listening, Parts 1–4) and `src/data/reading.ts` (reading, Parts 5–7). Combined via `src/data/questions.ts` which re-exports both. The `Question` type is imported from `src/types.ts`.
- IDs **1–1001** = listening, **1301–2299** = reading. Questions are shuffled by ID range at runtime, not by part. The full question bank (~1400 items) ships in the JS bundle.
- `useQuestionSelector` picks 100 random questions from the active ID range and tracks used IDs in `localStorage` (`toeic-used-qids`) to reduce repeats across sessions.
- Question options in the source file use prefixes (`A) ...`, `B) ...`). At runtime `useQuestionSelector` strips prefixes and shuffles the option order (and correct answer key), so agents should write answer keys and option ordering consistently but **expect them to be re-mapped**.

## Part conventions

| Part | Type | Display |
|------|------|---------|
| 1 | Photo | Shows passage (photo description) + 4 options |
| 2 | Question-response | Plays passage via TTS (or original question text) + **3 options** |
| 3 | Short conversation | Shows passage as TTS/listening block + 4 options |
| 4 | Short talk | Shows passage as TTS/listening block + 4 options |
| 5 | Incomplete sentence | Shows question text inline + 4 options |
| 6 | Text completion | Shows passage header + TTS button + questions with `blanks[]` |
| 7 | Reading comprehension | Shows `passageTitle` + `passageBody` block + 4 options |

- **Part 2** uses exactly 3 options (`"A" | "B" | "C"`, never "D"). All other parts use 4 options (`"A" | "B" | "C" | "D"`).
- **Part 6** uses the `blanks?: Blank[]` field for multi-blank passage format (each blank has independent options/answer). Agent-written generator scripts must fill `blanks` correctly.
- **Parts 1–4** (listening): questions have `passage` text for display (no audio files; TTS via browser Speech API).
- **Parts 6–7** (reading): questions should have `passageTitle` and `passageBody` alongside `passage`.

## Routes

| Route | Component | Purpose |
|-------|-----------|---------|
| `/` | `Home` | Section selection (listening/reading/full) |
| `/exam/:section` | `Exam` | Exam (listening \| reading \| full) |
| `/result` | `Result` | Score summary (receives state via `useNavigate`) |

## Time limits

- listening: 45 min, reading: 75 min, full: 120 min

## CI / Deploy

- GitHub Actions workflow in `.github/workflows/deploy.yml` deploys to GitHub Pages on push to `main`.
- Build command includes `--base=/learn-toeic/`.
- SPA fallback: `cp dist/index.html dist/404.html`.

## Scripts

`scripts/` contains generator/codegen tools (Node.js) that write TypeScript source:
- `scripts/generate-questions.mjs` — main generator. Uses template literals via `String.fromCharCode(96)` to avoid backtick-escaping issues when writing `.ts` files with tools that parse backticks.
- `scripts/cleanup-duplicates.mjs` — removes duplicate Part 5/7 questions (exact fingerprint + Part 7 passage-similarity ≥ 0.5).
- `scripts/balance-answers.mjs` — deterministically reorders source options so answer keys are evenly distributed (Part 2 uses A/B/C only).
- `scripts/check-part2.mjs`, `scripts/cleanup-data.mjs`, etc. — data validation helpers.

When writing generator scripts that involve backtick template literals, use `String.fromCharCode(96)` to produce backticks safely.

## Key type

```ts
interface Question {
  id: number;
  part: Part;       // 1 | 2 | 3 | 4 | 5 | 6 | 7
  question: string;
  options: string[];
  answer: AnswerKey; // "A" | "B" | "C" | "D"
  passage?: string;
  passageTitle?: string;
  passageBody?: string;
  blanks?: Blank[];
}
```

## State management

No external state library. All state is React built-ins:

| State | Owner | Mechanism |
|-------|-------|-----------|
| Question bank | Static import | Module-level array |
| Selected + shuffled questions | `Exam.tsx` | `useMemo` via `useQuestionSelector` |
| Per-exam answers | `useExam` | `useState<Record<number, AnswerSelection>>` (`AnswerSelection` = `AnswerKey \| AnswerKey[] \| null`; Part 6 groups store per-blank arrays) |
| Current question index | `useExam` | `useState<number>` |
| Flagged questions | `useExam` | `useState<Set<number>>` |
| Timer | `useTimer` | `useState<number>` + `setInterval` |
| TTS state | `useSpeech` | `useState` + `useRef<Utterance>` |
| Theme | `ThemeContext` | `useState` + `<html data-theme>` + `localStorage` |

## Scoring

- One point per question (Part 6 blanks each count as a separate point)
- Full test: score averaged and mapped to TOEIC 10–990 scale (max 990)
- Partial tests (listening/reading only): mapped to 495 scale

## Design conventions

- Tailwind utility classes + HeroUI components (`Button`, `Card`, `Modal`, `Accordion`, `AlertDialog`, `ProgressBar`, etc.) with compound `.Root/.Content/...` parts. Prefer HeroUI semantic color tokens (`accent`, `surface`, `muted`, `border`, `success`, `warning`, `danger`).
- `@phosphor-icons/react` for icons (standard `weight="regular"`; `"fill"` only for flagged state). `react-router` for routing.
- Self-hosted fonts via `@fontsource`: `Be Vietnam Pro` (sans), `Newsreader` (serif), `JetBrains Mono` (mono). Minimal editorial aesthetic; warm monochrome tokens in `src/index.css`.
- HeroUI Button does not forward `title` — wrap icon-only buttons in a `<span title="...">` for native tooltips.
- Theme context in `src/context/ThemeContext.tsx` — toggles `data-theme` on `<html>`. Stores theme in `localStorage` as `toeic-theme` (`"light"` / `"dark"`).
- All UI strings are in Vietnamese (tiếng Việt).

## Exam flow

```
Home (section pick)
  → Exam (100 questions, 1 at a time, with timer)
    → submit / time expire
      → Result (score + answer review)
```

### Exam page (`Exam.tsx`)

- Shows one question at a time with prev/next navigation
- Desktop: inline prev/next buttons. Mobile: fixed bottom bar.
- A sidebar (desktop) or overlay modal (mobile) shows a numbered palette — marks answered, current, and flagged questions
- `Flag` button per question for bookmarking
- `Check` button reveals correct answer per question (inline feedback without submitting)
- `Clear answer` button per question
- Timer auto-submits when it reaches zero

### Timer (`useTimer`)

Countdown timer using `setInterval` (1 sec tick). When it hits zero, calls `onExpire` callback that calculates the score and navigates to `/result`.

### Listening (Parts 1–4)

No audio files. Each listening question has a `passage` field containing the script. The `PassageView` component renders a "Play" button that calls the browser's `SpeechSynthesisUtterance` API. The TTS controls (play/pause/stop) are duplicated in `PassageView` (for Parts 1, 3, 4) and `ReadAloudInline` (for Part 2). The speech hook (`useSpeech`) manages utterance lifecycle.

### Result page (`Result.tsx`)

Displays score (raw count + percentage), estimated TOEIC score (full test: /990, partial: /495), time spent, and an expandable answer review section showing each question with correct/incorrect markers. Receives all data via React Router's `location.state`.

## Key files

| File | Role |
|------|------|
| `src/types.ts` | `Question`, `AnswerKey`, `Part`, `ExamState`, `ExamResult`, `Blank`, `QuestionGroup` |
| `src/data/questions.ts` | All 1400 questions as `Question[]` |
| `src/hooks/useQuestionSelector.ts` | Random selection, option shuffle, localStorage dedup, Part 6 grouping |
| `src/hooks/useExam.ts` | Per-exam state: answers, navigation, flagging |
| `src/hooks/useTimer.ts` | Countdown timer with expire callback |
| `src/hooks/useSpeech.ts` | Browser TTS wrapper (play/pause/cancel) |
| `src/context/ThemeContext.tsx` | Dark/light theme with localStorage persistence |
| `src/pages/Exam.tsx` | Main exam UI: question display, timer, nav, submission |
| `src/pages/Result.tsx` | Score summary with answer review |
| `src/components/QuestionCard.tsx` | Renders a single question with selectable options |
| `src/components/PassageView.tsx` | Renders passage body + TTS controls for listening |
| `src/components/QuestionPalette.tsx` | Numbered grid for navigation + status overview |
| `scripts/generate-questions.mjs` | Codegen tool that writes `questions.ts` |

## Question quality

- Every question, options, answer key, passage, and blank must be **factually and grammatically correct** according to real TOEIC standards.
- Questions must cover diverse, realistic TOEIC topics: business meetings, travel, office procedures, daily life, dining, shopping, etc. Avoid overly generic or repetitive scenarios.
- Each question must have exactly one unambiguous correct answer (the `answer` field), with the remaining options being plausibly wrong but clearly incorrect to a competent English learner.
- Listening passage texts (Parts 1–4) must read naturally when spoken aloud by browser TTS — use complete sentences, correct punctuation, and realistic speech patterns.
- After generating or editing questions, verify with `npm run build` (runs `tsc -b`, the real typecheck; root `npx tsc --noEmit` is a no-op because `tsconfig.json` has `files: []`).

## Git convention

- Commit each change individually, do not squash commits.
- Write commit messages in English, keep them short and descriptive.
