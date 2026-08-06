import { useState, useEffect, useRef, useCallback } from "react";

export function useTimer(
  initialSeconds: number,
  onExpire: () => void
) {
  const [timeRemaining, setTimeRemaining] = useState(initialSeconds);
  const [isRunning, setIsRunning] = useState(false);
  const onExpireCb = useRef(onExpire);
  const endAtRef = useRef<number | null>(null);
  const durationRef = useRef(initialSeconds);

  useEffect(() => {
    onExpireCb.current = onExpire;
  }, [onExpire]);

  useEffect(() => {
    if (!isRunning) return;
    const interval = setInterval(() => {
      if (endAtRef.current == null) return;
      const remaining = Math.max(0, Math.ceil((endAtRef.current - Date.now()) / 1000));
      setTimeRemaining(remaining);
      if (remaining <= 0) {
        clearInterval(interval);
        setIsRunning(false);
        onExpireCb.current();
      }
    }, 500);
    return () => clearInterval(interval);
  }, [isRunning]);

  const start = useCallback(() => {
    endAtRef.current = Date.now() + durationRef.current * 1000;
    setIsRunning(true);
  }, []);

  const pause = useCallback(() => {
    if (endAtRef.current != null) {
      const remaining = Math.max(0, Math.ceil((endAtRef.current - Date.now()) / 1000));
      durationRef.current = remaining;
      endAtRef.current = null;
      setTimeRemaining(remaining);
    }
    setIsRunning(false);
  }, []);

  const reset = useCallback((seconds: number) => {
    durationRef.current = seconds;
    endAtRef.current = null;
    setTimeRemaining(seconds);
    setIsRunning(false);
  }, []);

  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;
  const formatted = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

  return { timeRemaining, formatted, isRunning, start, pause, reset };
}
