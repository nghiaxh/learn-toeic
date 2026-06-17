import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { PassageView } from "../components/PassageView";

function mockSpeechSynthesis() {
  const mock = {
    speaking: false,
    paused: false,
    pending: false,
    cancel: vi.fn(),
    pause: vi.fn(),
    resume: vi.fn(),
    speak: vi.fn(),
  };
  Object.assign(window, { speechSynthesis: mock });
}

function removeSpeechSynthesis() {
  delete (window as any).speechSynthesis;
}

describe("PassageView", () => {
  it("renders the body text", () => {
    render(<PassageView body="Hello world" />);
    expect(screen.getByText("Hello world")).toBeInTheDocument();
  });

  it("renders the title when provided", () => {
    render(<PassageView title="Instructions" body="Read this." />);
    expect(screen.getByText("Instructions")).toBeInTheDocument();
  });

  it("shows play button in listening mode when speech supported", () => {
    mockSpeechSynthesis();
    render(<PassageView body="Listen to this." isListening />);
    expect(screen.getByText("Phát")).toBeInTheDocument();
  });

  it("shows unsupported message in listening mode when speech not available", () => {
    removeSpeechSynthesis();
    render(<PassageView body="Listen to this." isListening />);
    expect(screen.getByText("Trình duyệt không hỗ trợ")).toBeInTheDocument();
  });

  it("does not render TTS controls in non-listening mode", () => {
    render(<PassageView body="Just text." />);
    expect(screen.queryByText("Phát")).not.toBeInTheDocument();
    expect(screen.queryByText("Trình duyệt không hỗ trợ")).not.toBeInTheDocument();
  });
});
