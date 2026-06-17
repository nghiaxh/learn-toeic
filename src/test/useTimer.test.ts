import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useTimer } from "../hooks/useTimer";

describe("useTimer", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("initializes with the given time", () => {
    const { result } = renderHook(() => useTimer(120, vi.fn()));
    expect(result.current.timeRemaining).toBe(120);
    expect(result.current.formatted).toBe("02:00");
  });

  it("formats time correctly", () => {
    const { result } = renderHook(() => useTimer(3661, vi.fn()));
    expect(result.current.formatted).toBe("61:01");
  });

  it("counts down when started", () => {
    const { result } = renderHook(() => useTimer(10, vi.fn()));
    act(() => { result.current.start(); });
    act(() => { vi.advanceTimersByTime(3000); });
    expect(result.current.timeRemaining).toBe(7);
  });

  it("calls onExpire when reaching zero", () => {
    const onExpire = vi.fn();
    const { result } = renderHook(() => useTimer(2, onExpire));
    act(() => { result.current.start(); });
    act(() => { vi.advanceTimersByTime(2000); });
    expect(onExpire).toHaveBeenCalledTimes(1);
    expect(result.current.timeRemaining).toBe(0);
  });

  it("pauses the countdown", () => {
    const { result } = renderHook(() => useTimer(10, vi.fn()));
    act(() => { result.current.start(); });
    act(() => { vi.advanceTimersByTime(3000); });
    act(() => { result.current.pause(); });
    const remaining = result.current.timeRemaining;
    act(() => { vi.advanceTimersByTime(5000); });
    expect(result.current.timeRemaining).toBe(remaining);
  });

  it("resets to a given value", () => {
    const { result } = renderHook(() => useTimer(10, vi.fn()));
    act(() => { result.current.start(); });
    act(() => { vi.advanceTimersByTime(3000); });
    act(() => { result.current.reset(60); });
    expect(result.current.timeRemaining).toBe(60);
    expect(result.current.formatted).toBe("01:00");
    expect(result.current.isRunning).toBe(false);
  });

  it("does not go below zero", () => {
    const { result } = renderHook(() => useTimer(1, vi.fn()));
    act(() => { result.current.start(); });
    act(() => { vi.advanceTimersByTime(5000); });
    expect(result.current.timeRemaining).toBe(0);
  });

  it("stops counting after hitting zero", () => {
    const { result } = renderHook(() => useTimer(1, vi.fn()));
    act(() => { result.current.start(); });
    act(() => { vi.advanceTimersByTime(1000); });
    act(() => { vi.advanceTimersByTime(5000); });
    expect(result.current.timeRemaining).toBe(0);
  });
});
