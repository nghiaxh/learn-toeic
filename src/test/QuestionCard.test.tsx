import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QuestionCard } from "../components/QuestionCard";
import type { Question } from "../types";

const baseQuestion: Question = {
  id: 42,
  part: 5,
  question: "Choose the correct answer.",
  options: ["Option A", "Option B", "Option C", "Option D"],
  answer: "B",
};

describe("QuestionCard", () => {
  it("renders the question text with id", () => {
    render(
      <QuestionCard question={baseQuestion} selectedAnswer={null} onSelect={() => {}} />
    );
    expect(screen.getByText(/Choose the correct answer/)).toBeInTheDocument();
    expect(screen.getByText(/Câu 42/)).toBeInTheDocument();
  });

  it("renders all options", () => {
    render(
      <QuestionCard question={baseQuestion} selectedAnswer={null} onSelect={() => {}} />
    );
    expect(screen.getByText("Option A")).toBeInTheDocument();
    expect(screen.getByText("Option B")).toBeInTheDocument();
    expect(screen.getByText("Option C")).toBeInTheDocument();
    expect(screen.getByText("Option D")).toBeInTheDocument();
  });

  it("calls onSelect when an option is clicked", async () => {
    const onSelect = vi.fn();
    const user = userEvent.setup();
    render(
      <QuestionCard question={baseQuestion} selectedAnswer={null} onSelect={onSelect} />
    );
    await user.click(screen.getByText("Option B"));
    expect(onSelect).toHaveBeenCalledWith("B");
  });

  it("shows passage text when provided", () => {
    const q = { ...baseQuestion, passage: "Read this passage." };
    render(<QuestionCard question={q} selectedAnswer={null} onSelect={() => {}} />);
    expect(screen.getByText("Read this passage.")).toBeInTheDocument();
  });

  it("hides passage when hidePassage is true", () => {
    const q = { ...baseQuestion, passage: "Read this passage." };
    render(
      <QuestionCard question={q} selectedAnswer={null} onSelect={() => {}} hidePassage />
    );
    expect(screen.queryByText("Read this passage.")).not.toBeInTheDocument();
  });

  it("highlights correct answer in showResult mode", () => {
    render(
      <QuestionCard
        question={baseQuestion}
        selectedAnswer="A"
        onSelect={() => {}}
        showResult
        correctAnswer="B"
      />
    );
    const optionB = screen.getByText("Option B").closest("button");
    expect(optionB?.className).toContain("button--primary");
    expect(screen.getByText("Đúng")).toBeInTheDocument();
  });

  it("highlights wrong selected answer in showResult mode", () => {
    render(
      <QuestionCard
        question={baseQuestion}
        selectedAnswer="A"
        onSelect={() => {}}
        showResult
        correctAnswer="B"
      />
    );
    const optionA = screen.getByText("Option A").closest("button");
    expect(optionA?.className).toContain("button--danger");
    expect(screen.getByText("Câu của bạn")).toBeInTheDocument();
  });

  it("disables options in showResult mode", () => {
    render(
      <QuestionCard
        question={baseQuestion}
        selectedAnswer="A"
        onSelect={() => {}}
        showResult
        correctAnswer="B"
      />
    );
    const buttons = screen.getAllByRole("button");
    for (const btn of buttons) {
      expect(btn).toBeDisabled();
    }
  });

  it("shows clear button when answer is selected", () => {
    render(
      <QuestionCard
        question={baseQuestion}
        selectedAnswer="A"
        onSelect={() => {}}
        onClearAnswer={() => {}}
      />
    );
    expect(screen.getByText("Xoá")).toBeInTheDocument();
  });

  it("calls onClearAnswer when clear button clicked", async () => {
    const onClear = vi.fn();
    const user = userEvent.setup();
    render(
      <QuestionCard
        question={baseQuestion}
        selectedAnswer="A"
        onSelect={() => {}}
        onClearAnswer={onClear}
      />
    );
    await user.click(screen.getByText("Xoá"));
    expect(onClear).toHaveBeenCalledOnce();
  });

  it("does not show clear button when no answer selected", () => {
    render(
      <QuestionCard question={baseQuestion} selectedAnswer={null} onSelect={() => {}} />
    );
    expect(screen.queryByText("Xoá")).not.toBeInTheDocument();
  });

  it("shows flag button when onToggleFlag is provided", () => {
    render(
      <QuestionCard
        question={baseQuestion}
        selectedAnswer={null}
        onSelect={() => {}}
        onToggleFlag={() => {}}
      />
    );
    expect(screen.getByTitle("Đánh dấu câu này")).toBeInTheDocument();
  });

  it("does not show flag button in showResult mode", () => {
    render(
      <QuestionCard
        question={baseQuestion}
        selectedAnswer={null}
        onSelect={() => {}}
        onToggleFlag={() => {}}
        showResult
      />
    );
    expect(screen.queryByTitle("Đánh dấu câu này")).not.toBeInTheDocument();
  });

  it("renders part 6 blanks as independent option groups", () => {
    const q: Question = {
      id: 10,
      part: 6,
      question: "_____",
      options: ["alpha", "beta", "gamma", "delta"],
      answer: "B",
      blanks: [
        { options: ["alpha", "beta", "gamma", "delta"], answer: "B" },
        { options: ["one", "two", "three", "four"], answer: "C" },
      ],
    };
    render(
      <QuestionCard
        question={q}
        selectedAnswer={null}
        onSelect={() => {}}
        blankAnswers={[null, "C"]}
        onSelectBlank={() => {}}
        onClearAnswer={() => {}}
      />
    );
    expect(screen.getByText("alpha")).toBeInTheDocument();
    expect(screen.getByText("one")).toBeInTheDocument();
    expect(screen.getByText("Xoá")).toBeInTheDocument();
  });

  it("calls onSelectBlank when a blank option is clicked", async () => {
    const onSelectBlank = vi.fn();
    const q: Question = {
      id: 10,
      part: 6,
      question: "_____",
      options: ["alpha", "beta", "gamma", "delta"],
      answer: "B",
      blanks: [{ options: ["alpha", "beta", "gamma", "delta"], answer: "B" }],
    };
    const user = userEvent.setup();
    render(
      <QuestionCard
        question={q}
        selectedAnswer={null}
        onSelect={() => {}}
        blankAnswers={[null]}
        onSelectBlank={onSelectBlank}
      />
    );
    await user.click(screen.getByText("alpha"));
    expect(onSelectBlank).toHaveBeenCalledWith(0, "A");
  });

  it("shows correct and wrong blank answers in showResult mode", () => {
    const q: Question = {
      id: 10,
      part: 6,
      question: "_____",
      options: ["alpha", "beta", "gamma", "delta"],
      answer: "B",
      blanks: [{ options: ["alpha", "beta", "gamma", "delta"], answer: "B" }],
    };
    render(
      <QuestionCard
        question={q}
        selectedAnswer={null}
        onSelect={() => {}}
        showResult
        blankAnswers={["A"]}
      />
    );
    expect(screen.getByText("Đúng")).toBeInTheDocument();
    expect(screen.getByText("Câu của bạn")).toBeInTheDocument();
  });

  it("uses questionNumber and partLabel in the header", () => {
    render(
      <QuestionCard
        question={baseQuestion}
        selectedAnswer={null}
        onSelect={() => {}}
        questionNumber={7}
        partLabel="Phần 5"
      />
    );
    expect(screen.getByText(/Câu 7/)).toBeInTheDocument();
    expect(screen.getByText(/Phần 5/)).toBeInTheDocument();
  });
});
