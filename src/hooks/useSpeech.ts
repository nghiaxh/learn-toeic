import { useState, useRef, useCallback, useEffect } from "react";

const CHUNK_LIMIT = 220;

function pickEnglishVoice(): SpeechSynthesisVoice | null {
  const synth = window.speechSynthesis;
  if (!synth?.getVoices) return null;
  const voices = synth.getVoices();
  if (voices.length === 0) return null;
  const en = voices.filter((v) => v.lang?.toLowerCase().startsWith("en"));
  if (en.length === 0) return null;
  return (
    en.find((v) => v.lang?.toLowerCase().startsWith("en-us")) ??
    en.find((v) => v.lang?.toLowerCase().startsWith("en-gb")) ??
    en[0]
  );
}

function chunkText(text: string): string[] {
  const sentences = text.split(/(?<=[.!?])\s+/);
  const chunks: string[] = [];
  let current = "";
  for (const sentence of sentences) {
    if (sentence.length > CHUNK_LIMIT) {
      if (current.trim()) chunks.push(current.trim());
      current = "";
      for (let i = 0; i < sentence.length; i += CHUNK_LIMIT) {
        chunks.push(sentence.slice(i, i + CHUNK_LIMIT).trim());
      }
    } else if (current && current.length + sentence.length + 1 > CHUNK_LIMIT) {
      chunks.push(current.trim());
      current = sentence;
    } else {
      current = current ? `${current} ${sentence}` : sentence;
    }
  }
  if (current.trim()) chunks.push(current.trim());
  return chunks.length > 0 ? chunks : [text];
}

export function useSpeech() {
  const [speaking, setSpeaking] = useState(false);
  const [paused, setPaused] = useState(false);
  const [voice, setVoice] = useState<SpeechSynthesisVoice | null>(() =>
    "speechSynthesis" in window ? pickEnglishVoice() : null
  );
  const supported = "speechSynthesis" in window;
  const pendingChunksRef = useRef(0);

  useEffect(() => {
    if (!supported) return;
    const synth = window.speechSynthesis;
    const onVoicesChanged = () => setVoice(pickEnglishVoice());
    synth.addEventListener?.("voiceschanged", onVoicesChanged);
    return () => synth.removeEventListener?.("voiceschanged", onVoicesChanged);
  }, [supported]);

  const speak = useCallback(
    (text: string) => {
      if (!supported) return;
      const synth = window.speechSynthesis;
      synth.cancel();
      const chunks = chunkText(text);
      pendingChunksRef.current = chunks.length;
      setSpeaking(true);
      setPaused(false);
      for (const chunk of chunks) {
        const utterance = new SpeechSynthesisUtterance(chunk);
        utterance.lang = "en-US";
        utterance.rate = 0.9;
        utterance.pitch = 1;
        utterance.volume = 1;
        if (voice) utterance.voice = voice;
        utterance.onstart = () => setSpeaking(true);
        utterance.onend = () => {
          pendingChunksRef.current--;
          if (pendingChunksRef.current <= 0) {
            setSpeaking(false);
            setPaused(false);
          }
        };
        utterance.onpause = () => setPaused(true);
        utterance.onresume = () => setPaused(false);
        utterance.onerror = () => {
          pendingChunksRef.current--;
          if (pendingChunksRef.current <= 0) {
            setSpeaking(false);
            setPaused(false);
          }
        };
        synth.speak(utterance);
      }
    },
    [supported, voice]
  );

  const pause = useCallback(() => {
    if (supported) {
      window.speechSynthesis.pause();
    }
  }, [supported]);

  const resume = useCallback(() => {
    if (supported) {
      window.speechSynthesis.resume();
    }
  }, [supported]);

  const cancel = useCallback(() => {
    if (supported) {
      window.speechSynthesis.cancel();
    }
    pendingChunksRef.current = 0;
    setSpeaking(false);
    setPaused(false);
  }, [supported]);

  return { speak, pause, resume, cancel, speaking, paused, supported };
}
