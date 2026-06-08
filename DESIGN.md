# learn-toeic — Design Document

## Overview

A browser-based TOEIC exam simulator. Single-page React app with zero backend — the full question bank (1400 items) ships in the JS bundle. Listening questions use the browser's Web Speech API for Text-to-Synthesis (no audio files). Styling uses Tailwind CSS v4 with daisyUI v5 components.

## Architecture

```
index.html → main.tsx → App.tsx
                          ├── /                → Home.tsx
                          ├── /exam/:section   → Exam.tsx
                          └── /result          → Result.tsx
```

All data and state live in-memory within a single session. Navigation between `Exam` and `Result` passes state via React Router's `useNavigate` (not URL params or a store).

## Data layer

`src/data/questions.ts` is the single data source — a typed array of `Question` objects (1400 entries).

```
IDs  1–600     Original question set (300 listening + 300 reading)
IDs  601–1000  Listening expansion (Parts 1–4)
IDs  1001–1400 Reading expansion (Parts 5–7)
```

At exam start, `useQuestionSelector` filters by ID range, picks 100 random questions, and stores selected IDs in `localStorage` (`toeic-used-qids`) to reduce repeat questions across sessions.

### Option shuffling

Options are stored in source with prefixes (`A) ...`, `B) ...`). At runtime `useQuestionSelector` strips prefixes, shuffles option order, and remaps the answer key. The source file's option order and answer values are arbitrary — any agent generating questions should write them consistently but expect runtime remapping.

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

Countdown timer using `setInterval` (1 sec tick). When it hits zero, it calls an `onExpire` callback that calculates the score and navigates to `/result`. The timer starts when questions are loaded.

### Question rendering

Each question type renders slightly differently:

| Part | Type | Display |
|------|------|---------|
| 1 | Photo | Shows passage (photo description) + 4 options |
| 2 | Question-response | Plays passage via TTS (or original question text) + 3 options |
| 3 | Short conversation | Shows passage as TTS/listening block + 4 options |
| 4 | Short talk | Shows passage as TTS/listening block + 4 options |
| 5 | Incomplete sentence | Shows question text inline + 4 options |
| 6 | Text completion | Shows passage header + TTS button + questions with `blanks[]` |
| 7 | Reading comprehension | Shows `passageTitle` + `passageBody` block + 4 options |

### Listening (Parts 1–4)

No audio files. Each listening question has a `passage` field containing the script. The `PassageView` component renders a "Play" button that calls the browser's `SpeechSynthesisUtterance` API. The TTS controls (play/pause/stop) are duplicated in `PassageView` (for Parts 1, 3, 4) and `ReadAloudInline` (for Part 2). The speech hook (`useSpeech`) manages utterance lifecycle.

### Result page (`Result.tsx`)

Displays score (raw count + percentage), estimated TOEIC score (full test: /990, partial: /495), time spent, and an expandable answer review section showing each question with correct/incorrect markers. Receives all data via React Router's `location.state`.

## State management

No external state library. All state is React built-ins:

| State | Owner | Mechanism |
|-------|-------|-----------|
| Question bank | Static import | Module-level array |
| Selected + shuffled questions | `Exam.tsx` | `useMemo` via `useQuestionSelector` |
| Per-exam answers | `useExam` | `useState<Record<number, AnswerKey\|null>>` |
| Current question index | `useExam` | `useState<number>` |
| Flagged questions | `useExam` | `useState<Set<number>>` |
| Timer | `useTimer` | `useState<number>` + `setInterval` |
| TTS state | `useSpeech` | `useState` + `useRef<Utterance>` |
| Theme | `ThemeContext` | `useState` + `<html data-theme>` + `localStorage` |

## Scoring

- One point per question (Part 6 blanks each count as a separate point)
- Full test: score averaged and mapped to TOEIC 10–990 scale (max 990)
- Partial tests (listening/reading only): mapped to 495 scale

## Routing

| Route | Component | Purpose |
|-------|-----------|---------|
| `/` | `Home` | Section selection (listening/reading/full) |
| `/exam/listening` | `Exam` | 45 min, 100 questions from IDs 1–1000 |
| `/exam/reading` | `Exam` | 75 min, 100 questions from IDs 1001–1400 |
| `/exam/full` | `Exam` | 120 min, 200 questions (100 from each range) |
| `/result` | `Result` | Score summary (receives state via `useNavigate`) |

## Build & deploy

```sh
npm run dev     # Vite dev server with HMR
npm run build   # tsc -b && vite build → dist/
npm run preview # serve dist/ locally
```

CI: GitHub Actions pushes `dist/` to GitHub Pages. SPA fallback: `dist/index.html` copied to `dist/404.html`.

## Code generation

`scripts/generate-questions.mjs` is the canonical generator. It writes TypeScript source directly. Because backtick template literals are the source format for the `.ts` question objects, the script uses `String.fromCharCode(96)` to produce backticks without escaping conflicts when the script contains backtick-rich JS.

## Theme

`ThemeContext` stores the current theme in `localStorage` as `toeic-theme` (values: `"light"` / `"dark"`). Toggling sets `data-theme` on `<html>`, which daisyUI reads to apply its built-in theme colors.

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
