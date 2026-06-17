import { describe, it, expect } from "vitest";
import questions from "../data/questions";

describe("questions data", () => {
  it("loads the full question bank", () => {
    expect(questions.length).toBeGreaterThan(0);
  });

  it("has unique ids", () => {
    const ids = questions.map((q) => q.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("has valid parts", () => {
    for (const q of questions) {
      expect([1, 2, 3, 4, 5, 6, 7]).toContain(q.part);
    }
  });

  it("has valid answer keys", () => {
    for (const q of questions) {
      expect(["A", "B", "C", "D"]).toContain(q.answer);
    }
  });

  it("has non-empty question text", () => {
    for (const q of questions) {
      expect(q.question.trim().length).toBeGreaterThan(0);
    }
  });

  it("has the correct number of options per part", () => {
    for (const q of questions) {
      if (q.part === 2) {
        expect(q.options).toHaveLength(3);
      } else {
        expect(q.options).toHaveLength(4);
      }
    }
  });

  it("has passage or passageBody for all Part 6 questions", () => {
    for (const q of questions) {
      if (q.part === 6) {
        const hasContent = (
          (q.passage != null && q.passage.trim().length > 0) ||
          (q.passageBody != null && q.passageBody.trim().length > 0)
        );
        expect(hasContent).toBe(true);
      }
    }
  });

  it("part 2 questions use only A/B/C answers", () => {
    for (const q of questions) {
      if (q.part === 2) {
        expect(["A", "B", "C"]).toContain(q.answer);
      }
    }
  });

  it("listening IDs (parts 1-4) are in 1-1001 range", () => {
    for (const q of questions) {
      if (q.part <= 4) {
        expect(q.id).toBeGreaterThanOrEqual(1);
        expect(q.id).toBeLessThanOrEqual(1001);
      }
    }
  });

  it("reading IDs (parts 5-7) are in 1301-2299 range", () => {
    for (const q of questions) {
      if (q.part >= 5) {
        expect(q.id).toBeGreaterThanOrEqual(1301);
        expect(q.id).toBeLessThanOrEqual(2299);
      }
    }
  });

  it("listening questions (parts 1,3,4) have passage text (part 2 uses question text for TTS)", () => {
    for (const q of questions) {
      if (q.part <= 4 && q.part !== 2) {
        expect(q.passage).toBeDefined();
        expect(q.passage!.trim().length).toBeGreaterThan(0);
      }
    }
  });
});
