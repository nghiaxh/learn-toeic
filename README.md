# Learn TOEIC

A TOEIC exam simulator built with React 19, TypeScript, Vite, Tailwind CSS v4, and daisyUI.

## Features

- Full TOEIC Listening & Reading simulation
- Parts 1–7 with realistic question formats
- Timed exams (Listening: 45min, Reading: 75min, Full: 120min)
- Text-to-Speech for listening passages (Parts 1–4)
- Question shuffling with localStorage-based repeat reduction
- Vietnamese UI

## Commands

```sh
npm run dev       # Start dev server
npm run build     # Type-check and build
npm run lint      # Run ESLint
npm run preview   # Preview production build
npm test          # Run all tests (Vitest)
```

## Tech Stack

| Tool | Purpose |
|------|---------|
| React 19 | UI framework |
| TypeScript | Type safety |
| Vite | Bundler & dev server |
| Tailwind CSS v4 | Utility CSS |
| daisyUI | UI component library |
| react-router-dom | Client-side routing |
| lucide-react | Icons |
| Browser Speech API | TTS for listening passages |
| Vitest | Test runner |
| React Testing Library | Component tests |

## Project Structure

```
src/
├── components/    # Reusable UI components
├── context/       # React context (theme)
├── data/          # Question data (listening, reading)
├── hooks/         # Custom hooks (exam, timer, speech, etc.)
├── pages/         # Route pages (Home, Exam, Result)
├── utils/         # Utility functions
├── test/          # Test files (Vitest + RTL)
├── types.ts       # Shared TypeScript types
├── App.tsx        # Root component with routing
└── main.tsx       # Entry point
```

## Data

Questions are stored in `src/data/listening.ts` (Parts 1–4) and `src/data/reading.ts` (Parts 5–7).  
Generation and validation scripts are available in `scripts/`.

## Deployment

Deployed to GitHub Pages via GitHub Actions on push to `main`.  
See `.github/workflows/deploy.yml`.
