import { useState, useCallback } from "react";
import type { AnswerKey } from "../types";

export function useExam(totalQuestions: number) {
  const [answers, setAnswers] = useState<Record<number, AnswerKey | null>>({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [flagged, setFlagged] = useState<Set<number>>(new Set());

  const setAnswer = useCallback((questionId: number, answer: AnswerKey | null) => {
    setAnswers((prev) => {
      if (answer === null) {
        const next = { ...prev };
        delete next[questionId];
        return next;
      }
      return { ...prev, [questionId]: answer };
    });
  }, []);

  const toggleFlag = useCallback((questionId: number) => {
    setFlagged((prev) => {
      const next = new Set(prev);
      if (next.has(questionId)) {
        next.delete(questionId);
      } else {
        next.add(questionId);
      }
      return next;
    });
  }, []);

  const goTo = useCallback((index: number) => {
    setCurrentIndex(index);
  }, []);

  const goNext = useCallback(() => {
    setCurrentIndex((prev) => Math.min(prev + 1, totalQuestions - 1));
  }, [totalQuestions]);

  const goPrev = useCallback(() => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  }, []);

  const submit = useCallback(() => {
    setIsSubmitted(true);
  }, []);

  const answeredCount = Object.keys(answers).length;

  return {
    answers,
    setAnswer,
    currentIndex,
    goTo,
    goNext,
    goPrev,
    isSubmitted,
    submit,
    answeredCount,
    totalQuestions,
    flagged,
    toggleFlag,
  };
}
