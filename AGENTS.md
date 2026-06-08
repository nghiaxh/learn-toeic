# learn-toeic — AGENTS.md

## Project

TOEIC exam simulator (React 19 + TypeScript + Vite + Tailwind v4 + daisyUI).  
Single-page app, no backend, no database.

## Commands

```sh
npm run dev        # Vite dev server
npm run build      # tsc -b && vite build
npm run lint       # eslint .
npx tsc --noEmit   # type-check only
npm run preview    # preview built site
```

No test framework exists. Do not run tests.

## Data architecture

- All questions live in `src/data/listening.ts` (listening, Parts 1–4) and `src/data/reading.ts` (reading, Parts 5–7). Combined via `src/data/questions.ts` which re-exports both. The `Question` type is imported from `src/types.ts`.
- IDs **1–1001** = listening, **1301–2299** = reading. Questions are shuffled by ID range at runtime, not by part.
- `useQuestionSelector` picks 100 random questions from the active ID range and tracks used IDs in `localStorage` (`toeic-used-qids`) to reduce repeats across sessions.
- Question options in the source file use prefixes (`A) ...`, `B) ...`). At runtime `useQuestionSelector` strips prefixes and shuffles the option order (and correct answer key), so agents should write answer keys and option ordering consistently but **expect them to be re-mapped**.

## Part conventions

- **Part 2** uses exactly 3 options (`"A" | "B" | "C"`, never "D"). All other parts use 4 options (`"A" | "B" | "C" | "D"`).
- **Part 6** uses the `blanks?: Blank[]` field for multi-blank passage format (each blank has independent options/answer). Agent-written generator scripts must fill `blanks` correctly.
- **Parts 1–4** (listening): questions have `passage` text for display (no audio files; TTS via browser Speech API).
- **Parts 6–7** (reading): questions should have `passageTitle` and `passageBody` alongside `passage`.

## Routes

- `/` → Home page (section selection)
- `/exam/:section` → Exam (listening | reading | full)
- `/result` → Score summary (receives state via `useNavigate`)

## Time limits

- listening: 45 min, reading: 75 min, full: 120 min

## CI / Deploy

- GitHub Actions workflow in `.github/workflows/deploy.yml` deploys to GitHub Pages on push to `main`.
- Build command includes `--base=/learn-toeic/`.
- SPA fallback: `cp dist/index.html dist/404.html`.

## Scripts

`scripts/` contains generator/codegen tools (Node.js) that write TypeScript source:
- `scripts/generate-questions.mjs` — main generator. Uses template literals via `String.fromCharCode(96)` to avoid backtick-escaping issues when writing `.ts` files with tools that parse backticks.
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

## Design conventions

- Tailwind utility classes + daisyUI theme components (`btn`, `card`, `badge`, etc.). Prefer daisyUI semantic colors (`primary`, `base-100`, etc.).
- `lucide-react` for icons. `react-router-dom` for routing.
- Theme context in `src/context/ThemeContext.tsx` — toggles `data-theme` on `<html>`.
- All UI strings are in Vietnamese (tiếng Việt).

## Question quality

- Every question, options, answer key, passage, and blank must be **factually and grammatically correct** according to real TOEIC standards.
- Questions must cover diverse, realistic TOEIC topics: business meetings, travel, office procedures, daily life, dining, shopping, etc. Avoid overly generic or repetitive scenarios.
- Each question must have exactly one unambiguous correct answer (the `answer` field), with the remaining options being plausibly wrong but clearly incorrect to a competent English learner.
- Listening passage texts (Parts 1–4) must read naturally when spoken aloud by browser TTS — use complete sentences, correct punctuation, and realistic speech patterns.
- After generating or editing questions, verify with `npx tsc --noEmit`.

## Git convention

- Commit each change individually, do not squash commits.
- Write commit messages in English, keep them short and descriptive.
