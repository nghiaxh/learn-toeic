import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router";
import { Result } from "../pages/Result";
import type { Question } from "../types";

const mockQuestions: Question[] = [
  { id: 1, part: 5, question: "Q1?", options: ["A1", "B1", "C1", "D1"], answer: "A" },
  { id: 2, part: 5, question: "Q2?", options: ["A2", "B2", "C2", "D2"], answer: "B" },
];

function renderResult(state?: Record<string, unknown>) {
  return render(
    <MemoryRouter initialEntries={[{ pathname: "/result", state }]}>
      <Routes>
        <Route path="/result" element={<Result />} />
      </Routes>
    </MemoryRouter>
  );
}

describe("Result", () => {
  it("shows no-result message when state is missing", () => {
    renderResult(undefined);
    expect(screen.getByText(/Không có kết quả/)).toBeInTheDocument();
  });

  it("displays score when state is provided", () => {
    renderResult({
      section: "listening",
      score: 1,
      total: 2,
      answers: { 1: "A", 2: "C" },
      questions: mockQuestions,
      timeSpent: 600,
    });
    expect(screen.getByText("1/2")).toBeInTheDocument();
    expect(screen.getByText("50% Đúng")).toBeInTheDocument();
  });

  it("shows estimated TOEIC score for full section", () => {
    renderResult({
      section: "full",
      score: 150,
      total: 200,
      answers: { 1: "A", 2: "C" },
      questions: mockQuestions,
      timeSpent: 600,
    });
    expect(screen.getByText("743 / 990")).toBeInTheDocument();
  });

  it("does not show TOEIC score for non-full sections", () => {
    renderResult({
      section: "listening",
      score: 1,
      total: 2,
      answers: { 1: "A", 2: "C" },
      questions: mockQuestions,
      timeSpent: 600,
    });
    expect(screen.queryByText(/990/)).not.toBeInTheDocument();
  });

  it("displays time spent", () => {
    renderResult({
      section: "listening",
      score: 1,
      total: 2,
      answers: { 1: "A", 2: "C" },
      questions: mockQuestions,
      timeSpent: 3661,
    });
    expect(screen.getByText(/61m 1s/)).toBeInTheDocument();
  });

  it("shows answer review section with questions", () => {
    renderResult({
      section: "listening",
      score: 1,
      total: 2,
      answers: { 1: "A", 2: "C" },
      questions: mockQuestions,
      timeSpent: 0,
    });
    expect(screen.getByText(/Q1\?/)).toBeInTheDocument();
    expect(screen.getByText(/Q2\?/)).toBeInTheDocument();
  });

  it("has navigation buttons", () => {
    renderResult({
      section: "listening",
      score: 1,
      total: 2,
      answers: { 1: "A", 2: "C" },
      questions: mockQuestions,
      timeSpent: 0,
    });
    expect(screen.getByText("Về trang chủ")).toBeInTheDocument();
    expect(screen.getByText("Làm lại")).toBeInTheDocument();
  });
});
