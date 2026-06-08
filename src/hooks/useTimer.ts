import { useState, useEffect, useRef, useCallback } from "react";

export function useTimer(
  initialSeconds: number,
  onExpire: () => void
) {
  const [timeRemaining, setTimeRemaining] = useState(initialSeconds);
  const [isRunning, setIsRunning] = useState(false);
  const onExpireCb = useRef(onExpire);

  useEffect(() => {
    onExpireCb.current = onExpire;
  }, [onExpire]);

  useEffect(() => {
    if (!isRunning) return;
    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setIsRunning(false);
          onExpireCb.current();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isRunning]);

  const start = useCallback(() => setIsRunning(true), []);
  const pause = useCallback(() => setIsRunning(false), []);
  const reset = useCallback((seconds: number) => {
    setTimeRemaining(seconds);
    setIsRunning(false);
  }, []);

  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;
  const formatted = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

  return { timeRemaining, formatted, isRunning, start, pause, reset };
}
