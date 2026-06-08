import { useState, useRef, useCallback } from "react";

export function useSpeech() {
  const [speaking, setSpeaking] = useState(false);
  const [paused, setPaused] = useState(false);
  const supported = "speechSynthesis" in window;
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const speak = useCallback((text: string) => {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 1;
    utterance.onstart = () => setSpeaking(true);
    utterance.onend = () => {
      setSpeaking(false);
      setPaused(false);
    };
    utterance.onpause = () => setPaused(true);
    utterance.onresume = () => setPaused(false);
    utterance.onerror = () => {
      setSpeaking(false);
      setPaused(false);
    };
    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  }, []);

  const pause = useCallback(() => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.pause();
    }
  }, []);

  const resume = useCallback(() => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.resume();
    }
  }, []);

  const cancel = useCallback(() => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    setSpeaking(false);
    setPaused(false);
  }, []);

  return { speak, pause, resume, cancel, speaking, paused, supported };
}
