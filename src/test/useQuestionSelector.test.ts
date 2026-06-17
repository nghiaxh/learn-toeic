import { describe, it, expect, beforeEach } from "vitest";
import { renderHook } from "@testing-library/react";
import { useQuestionSelector } from "../hooks/useQuestionSelector";
import type { Question } from "../types";

function makeQuestion(id: number, part: 1 | 2 | 3 | 4 | 5 | 6 | 7 = 5): Question {
  return {
    id,
    part,
    question: `Question ${id}`,
    options: ["A) Opt A", "B) Opt B", "C) Opt C", "D) Opt D"],
    answer: "A",
  };
}

beforeEach(() => {
  localStorage.clear();
});

describe("useQuestionSelector", () => {
  const questions: Question[] = [];
  for (let i = 1; i <= 200; i++) {
    questions.push(makeQuestion(i));
  }

  it("returns exactly 100 questions for listening section", () => {
    const { result } = renderHook(() =>
      useQuestionSelector(questions, "listening")
    );
    expect(result.current).toHaveLength(100);
  });

  it("strips option prefixes and shuffles", () => {
    const { result } = renderHook(() =>
      useQuestionSelector(questions, "listening")
    );
    for (const q of result.current) {
      for (const opt of q.options) {
        expect(opt).not.toMatch(/^[A-D]\)\s*/);
      }
    }
  });

  it("returns options with length matching part (4 for non-part2)", () => {
    const { result } = renderHook(() =>
      useQuestionSelector(questions, "listening")
    );
    for (const q of result.current) {
      expect(q.options).toHaveLength(4);
    }
  });

  it("stores selected IDs in localStorage", () => {
    renderHook(() => useQuestionSelector(questions, "listening"));
    const stored = JSON.parse(localStorage.getItem("toeic-used-qids") || "[]");
    expect(stored.length).toBeGreaterThan(0);
  });

  it("returns empty array for empty input", () => {
    const { result } = renderHook(() => useQuestionSelector([], "listening"));
    expect(result.current).toHaveLength(0);
  });

  it("handles reading section ID range", () => {
    const readingQuestions: Question[] = [];
    for (let i = 1301; i <= 1500; i++) {
      readingQuestions.push(makeQuestion(i));
    }
    const { result } = renderHook(() =>
      useQuestionSelector(readingQuestions, "reading")
    );
    expect(result.current).toHaveLength(100);
    for (const q of result.current) {
      expect(q.id).toBeGreaterThanOrEqual(1301);
    }
  });

  it("returns empty array for non-matching IDs", () => {
    const farRange: Question[] = [];
    for (let i = 3000; i <= 3100; i++) {
      farRange.push(makeQuestion(i));
    }
    const { result } = renderHook(() =>
      useQuestionSelector(farRange, "listening")
    );
    expect(result.current).toHaveLength(0);
  });
});
