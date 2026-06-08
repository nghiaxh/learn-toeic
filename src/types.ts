export type Part = 1 | 2 | 3 | 4 | 5 | 6 | 7;
export type AnswerKey = "A" | "B" | "C" | "D";

export interface Blank {
  options: string[];
  answer: AnswerKey;
}

export interface Question {
  id: number;
  part: Part;
  question: string;
  options: string[];
  answer: AnswerKey;
  passage?: string;
  passageTitle?: string;
  passageBody?: string;
  blanks?: Blank[];
}

export interface ExamState {
  section: "listening" | "reading" | "full";
  answers: Record<number, AnswerKey | null>;
  currentIndex: number;
  timeRemaining: number;
  isSubmitted: boolean;
  flagged: Set<number>;
}

export interface ExamResult {
  section: "listening" | "reading" | "full";
  answers: Record<number, AnswerKey | null>;
  score: number;
  total: number;
  timeSpent: number;
}

export interface QuestionGroup {
  startId: number;
  count: number;
}
