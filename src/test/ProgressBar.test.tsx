import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ProgressBar } from "../components/ProgressBar";

describe("ProgressBar", () => {
  it("shows answered/total", () => {
    render(<ProgressBar answered={5} total={10} />);
    expect(screen.getByText("5/10")).toBeInTheDocument();
  });

  it("renders progress element with correct values", () => {
    const { container } = render(<ProgressBar answered={7} total={10} />);
    const progress = container.querySelector("progress");
    expect(progress).toHaveAttribute("value", "7");
    expect(progress).toHaveAttribute("max", "10");
  });

  it("applies success class when all answered", () => {
    const { container } = render(<ProgressBar answered={10} total={10} />);
    const progress = container.querySelector("progress");
    expect(progress?.className).toContain("progress-success");
  });
});
