import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Timer } from "../components/Timer";

describe("Timer", () => {
  it("renders formatted time", () => {
    render(<Timer formatted="45:00" />);
    expect(screen.getByText("45:00")).toBeInTheDocument();
  });

  it("applies warning styles when isWarning is true", () => {
    const { container } = render(<Timer formatted="04:59" isWarning />);
    expect(container.firstChild?.textContent).toBe("04:59");
  });
});
