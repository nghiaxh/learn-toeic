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

  it("has no exact duplicate questions in parts 5 and 7", () => {
    const seen = new Set<string>();
    for (const q of questions) {
      if (q.part === 5 || q.part === 7) {
        const key = `${q.part}|${q.question}|${q.options.join("~")}|${q.answer}`;
        expect(seen.has(key)).toBe(false);
        seen.add(key);
      }
    }
  });

  it("has no near-duplicate part 7 passages", () => {
    const groups = new Map<string, string[]>();
    for (const q of questions) {
      if (q.part !== 7) continue;
      const key = `${q.question}|${q.options.join("~")}|${q.answer}`;
      const body = q.passageBody ?? q.passage ?? "";
      const list = groups.get(key) ?? [];
      list.push(body);
      groups.set(key, list);
    }
    const tokens = (text: string) =>
      new Set(text.toLowerCase().split(/\W+/).filter(Boolean));
    for (const [key, bodies] of groups) {
      for (let i = 0; i < bodies.length; i++) {
        for (let j = i + 1; j < bodies.length; j++) {
          const ta = tokens(bodies[i]);
          const tb = tokens(bodies[j]);
          const inter = [...ta].filter((t) => tb.has(t)).length;
          const union = new Set([...ta, ...tb]).size;
          const sim = union === 0 ? 0 : inter / union;
          expect(sim, `part 7 near-dup: ${key}`).toBeLessThan(0.5);
        }
      }
    }
  });

  it("has a balanced answer key distribution", () => {
    const counts = { A: 0, B: 0, C: 0, D: 0 };
    const part2 = { A: 0, B: 0, C: 0 };
    for (const q of questions) {
      counts[q.answer as keyof typeof counts]++;
      if (q.part === 2) part2[q.answer as keyof typeof part2]++;
    }
    const total = questions.length;
    const part2Total = questions.filter((q) => q.part === 2).length;
    for (const key of ["A", "B", "C", "D"] as const) {
      const pct = counts[key] / total;
      expect(pct).toBeGreaterThanOrEqual(0.15);
      expect(pct).toBeLessThanOrEqual(0.4);
    }
    for (const key of ["A", "B", "C"] as const) {
      const pct = part2[key] / part2Total;
      expect(pct).toBeGreaterThanOrEqual(0.25);
      expect(pct).toBeLessThanOrEqual(0.45);
    }
  });
});
