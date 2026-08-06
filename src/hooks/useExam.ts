import { useState, useCallback, useMemo } from "react";
import type { AnswerKey, AnswerSelection } from "../types";

export function useExam(totalQuestions: number) {
  const [answers, setAnswers] = useState<Record<number, AnswerSelection>>({});
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

  const setBlankAnswer = useCallback(
    (questionId: number, blankIndex: number, answer: AnswerKey | null) => {
      setAnswers((prev) => {
        const current = prev[questionId];
        const arr: (AnswerKey | null)[] = Array.isArray(current) ? [...current] : [];
        while (arr.length <= blankIndex) arr.push(null);
        arr[blankIndex] = answer;

        if (answer === null && arr.every((a) => a == null)) {
          const next = { ...prev };
          delete next[questionId];
          return next;
        }
        return { ...prev, [questionId]: arr };
      });
    },
    []
  );

  const isAnswered = useCallback((entry: AnswerSelection | undefined) => {
    if (entry == null) return false;
    return Array.isArray(entry) ? entry.every((a) => a != null) : true;
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

  const answeredCount = useMemo(
    () => Object.values(answers).filter((entry) => isAnswered(entry)).length,
    [answers, isAnswered]
  );

  return {
    answers,
    setAnswer,
    setBlankAnswer,
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
