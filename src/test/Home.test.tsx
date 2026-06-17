import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { Home } from "../pages/Home";
import { ThemeProvider } from "../context/ThemeContext";

function renderHome() {
  return render(
    <ThemeProvider>
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    </ThemeProvider>
  );
}

describe("Home", () => {
  it("renders section cards", () => {
    renderHome();
    expect(screen.getByText("Ôn phần nghe")).toBeInTheDocument();
    expect(screen.getByText("Ôn phần đọc")).toBeInTheDocument();
    expect(screen.getByText("Bài thi Đầy đủ")).toBeInTheDocument();
  });

  it("shows time limits", () => {
    renderHome();
    expect(screen.getByText("45 phút")).toBeInTheDocument();
    expect(screen.getByText("75 phút")).toBeInTheDocument();
    expect(screen.getByText("120 phút")).toBeInTheDocument();
  });

  it("shows question counts", () => {
    renderHome();
    const counts = screen.getAllByText("100");
    expect(counts.length).toBeGreaterThanOrEqual(2);
    expect(screen.getByText("200")).toBeInTheDocument();
  });

  it("has three start buttons", () => {
    renderHome();
    const buttons = screen.getAllByText("Bắt đầu");
    expect(buttons).toHaveLength(3);
  });

  it("has a theme toggle button", () => {
    renderHome();
    const toggleBtn = screen.getByTitle("Chế độ tối");
    expect(toggleBtn).toBeInTheDocument();
  });
});
