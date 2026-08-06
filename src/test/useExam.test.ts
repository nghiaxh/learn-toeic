import { describe, it, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useExam } from "../hooks/useExam";

describe("useExam", () => {
  it("initializes with empty state", () => {
    const { result } = renderHook(() => useExam(100));
    expect(result.current.answers).toEqual({});
    expect(result.current.currentIndex).toBe(0);
    expect(result.current.isSubmitted).toBe(false);
    expect(result.current.answeredCount).toBe(0);
    expect(result.current.totalQuestions).toBe(100);
    expect(result.current.flagged).toEqual(new Set());
  });

  it("sets an answer", () => {
    const { result } = renderHook(() => useExam(100));
    act(() => result.current.setAnswer(42, "B"));
    expect(result.current.answers[42]).toBe("B");
    expect(result.current.answeredCount).toBe(1);
  });

  it("overwrites an existing answer", () => {
    const { result } = renderHook(() => useExam(100));
    act(() => result.current.setAnswer(42, "B"));
    act(() => result.current.setAnswer(42, "C"));
    expect(result.current.answers[42]).toBe("C");
    expect(result.current.answeredCount).toBe(1);
  });

  it("clears an answer by setting null", () => {
    const { result } = renderHook(() => useExam(100));
    act(() => result.current.setAnswer(42, "B"));
    act(() => result.current.setAnswer(42, null));
    expect(result.current.answers[42]).toBeUndefined();
    expect(result.current.answeredCount).toBe(0);
  });

  it("navigates forward and backward", () => {
    const { result } = renderHook(() => useExam(100));
    expect(result.current.currentIndex).toBe(0);
    act(() => result.current.goNext());
    expect(result.current.currentIndex).toBe(1);
    act(() => result.current.goPrev());
    expect(result.current.currentIndex).toBe(0);
  });

  it("does not go below 0", () => {
    const { result } = renderHook(() => useExam(100));
    act(() => result.current.goPrev());
    expect(result.current.currentIndex).toBe(0);
  });

  it("does not go beyond total - 1", () => {
    const { result } = renderHook(() => useExam(3));
    act(() => result.current.goNext());
    act(() => result.current.goNext());
    act(() => result.current.goNext());
    expect(result.current.currentIndex).toBe(2);
  });

  it("goes to a specific index", () => {
    const { result } = renderHook(() => useExam(100));
    act(() => result.current.goTo(42));
    expect(result.current.currentIndex).toBe(42);
  });

  it("toggles flag on a question", () => {
    const { result } = renderHook(() => useExam(100));
    act(() => result.current.toggleFlag(42));
    expect(result.current.flagged.has(42)).toBe(true);
    act(() => result.current.toggleFlag(42));
    expect(result.current.flagged.has(42)).toBe(false);
  });

  it("sets submitted state", () => {
    const { result } = renderHook(() => useExam(100));
    expect(result.current.isSubmitted).toBe(false);
    act(() => result.current.submit());
    expect(result.current.isSubmitted).toBe(true);
  });

  it("sets and clears a blank answer", () => {
    const { result } = renderHook(() => useExam(100));
    act(() => result.current.setBlankAnswer(42, 1, "C"));
    expect(result.current.answers[42]).toEqual([null, "C"]);
    expect(result.current.answeredCount).toBe(0);
    act(() => result.current.setBlankAnswer(42, 0, "A"));
    expect(result.current.answers[42]).toEqual(["A", "C"]);
    expect(result.current.answeredCount).toBe(1);
    act(() => result.current.setBlankAnswer(42, 0, null));
    act(() => result.current.setBlankAnswer(42, 1, null));
    expect(result.current.answers[42]).toBeUndefined();
    expect(result.current.answeredCount).toBe(0);
  });

  it("overwrites a blank answer", () => {
    const { result } = renderHook(() => useExam(100));
    act(() => result.current.setBlankAnswer(42, 0, "B"));
    act(() => result.current.setBlankAnswer(42, 0, "D"));
    expect(result.current.answers[42]).toEqual(["D"]);
  });
});
