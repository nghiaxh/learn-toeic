import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QuestionPalette } from "../components/QuestionPalette";

describe("QuestionPalette", () => {
  const questionIds = [10, 20, 30, 40, 50];

  it("renders the correct number of buttons", () => {
    render(
      <QuestionPalette
        total={5}
        currentIndex={0}
        answers={{}}
        flagged={new Set()}
        questionIds={questionIds}
        onGoTo={() => {}}
      />
    );
    const buttons = screen.getAllByRole("button");
    expect(buttons).toHaveLength(5);
  });

  it("shows answered count and total", () => {
    render(
      <QuestionPalette
        total={5}
        currentIndex={0}
        answers={{ 10: "A", 20: "B" }}
        flagged={new Set()}
        questionIds={questionIds}
        onGoTo={() => {}}
      />
    );
    expect(screen.getByText(/2\/5/)).toBeInTheDocument();
  });

  it("shows flagged count", () => {
    render(
      <QuestionPalette
        total={5}
        currentIndex={0}
        answers={{}}
        flagged={new Set([30])}
        questionIds={questionIds}
        onGoTo={() => {}}
      />
    );
    expect(screen.getByText((_, el) => el?.textContent === "0/5 · 1 ")).toBeInTheDocument();
  });

  it("calls onGoTo with the clicked index", async () => {
    const onGoTo = vi.fn();
    const user = userEvent.setup();
    render(
      <QuestionPalette
        total={5}
        currentIndex={0}
        answers={{}}
        flagged={new Set()}
        questionIds={questionIds}
        onGoTo={onGoTo}
      />
    );
    await user.click(screen.getByText("3"));
    expect(onGoTo).toHaveBeenCalledWith(2);
  });

  it("highlights current question", () => {
    render(
      <QuestionPalette
        total={5}
        currentIndex={2}
        answers={{}}
        flagged={new Set()}
        questionIds={questionIds}
        onGoTo={() => {}}
      />
    );
    const btn3 = screen.getByText("3");
    expect(btn3.className).toContain("btn-primary");
  });

  it("renders with large prop", () => {
    render(
      <QuestionPalette
        total={5}
        currentIndex={0}
        answers={{}}
        flagged={new Set()}
        questionIds={questionIds}
        onGoTo={() => {}}
        large
      />
    );
    expect(screen.getByText("Câu hỏi")).toBeInTheDocument();
  });
});
