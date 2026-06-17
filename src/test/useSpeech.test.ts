import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useSpeech } from "../hooks/useSpeech";

class MockSpeechSynthesisUtterance {
  rate = 1;
  pitch = 1;
  volume = 1;
  text = "";
  onstart: (() => void) | null = null;
  onend: (() => void) | null = null;
  onpause: (() => void) | null = null;
  onresume: (() => void) | null = null;
  onerror: (() => void) | null = null;
  constructor(text: string) { this.text = text; }
}

function mockSpeechSynthesis() {
  (globalThis as any).SpeechSynthesisUtterance = MockSpeechSynthesisUtterance;
  const mockUtterance = new MockSpeechSynthesisUtterance("");
  const mock = {
    speaking: false,
    paused: false,
    pending: false,
    cancel: vi.fn(),
    pause: vi.fn(),
    resume: vi.fn(),
    speak: vi.fn((u: MockSpeechSynthesisUtterance) => {
      Object.assign(mockUtterance, u);
    }),
    getUtterance: () => mockUtterance,
  };
  Object.assign(window, { speechSynthesis: mock });
  return mock;
}

beforeEach(() => {
  delete (window as any).speechSynthesis;
});

describe("useSpeech", () => {
  it("detects unsupported browser", () => {
    const { result } = renderHook(() => useSpeech());
    expect(result.current.supported).toBe(false);
  });

  it("detects supported browser", () => {
    mockSpeechSynthesis();
    const { result } = renderHook(() => useSpeech());
    expect(result.current.supported).toBe(true);
  });

  it("calls speechSynthesis.speak on speak()", () => {
    const synth = mockSpeechSynthesis();
    const { result } = renderHook(() => useSpeech());
    act(() => result.current.speak("Hello"));
    expect(synth.speak).toHaveBeenCalled();
  });

  it("calls speechSynthesis.cancel on cancel()", () => {
    const synth = mockSpeechSynthesis();
    const { result } = renderHook(() => useSpeech());
    act(() => result.current.cancel());
    expect(synth.cancel).toHaveBeenCalled();
  });

  it("calls speechSynthesis.pause on pause()", () => {
    const synth = mockSpeechSynthesis();
    const { result } = renderHook(() => useSpeech());
    act(() => result.current.pause());
    expect(synth.pause).toHaveBeenCalled();
  });

  it("calls speechSynthesis.resume on resume()", () => {
    const synth = mockSpeechSynthesis();
    const { result } = renderHook(() => useSpeech());
    act(() => result.current.resume());
    expect(synth.resume).toHaveBeenCalled();
  });
});
