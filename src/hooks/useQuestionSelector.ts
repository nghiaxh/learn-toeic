import { useMemo, useEffect } from "react";
import type { Question, AnswerKey } from "../types";
import { shuffleArray } from "../utils/shuffle";

const ID_RANGES = {
  listening: { min: 1, max: 1001, count: 100 },
  reading: { min: 1301, max: 2299, count: 100 },
};

const ALL_KEYS: AnswerKey[] = ["A", "B", "C", "D"];

function shuffleQuestionOptions(q: Question): Question {
  const keys = ALL_KEYS.slice(0, q.options.length);
  if (q.blanks) {
    const indices = shuffleArray(keys.map((_, i) => i));
    return {
      ...q,
      options: indices.map((i) => q.options[i]),
      answer: keys[indices.findIndex((i) => keys[i] === q.answer)],
      blanks: q.blanks.map((blank) => ({
        options: indices.map((i) => blank.options[i]),
        answer: keys[indices.findIndex((i) => keys[i] === blank.answer)],
      })),
    };
  }
  const pairs = keys.map((key, i) => ({ key, text: q.options[i].replace(/^[A-D]\)\s*/, "") }));
  const shuffled = shuffleArray(pairs);
  return {
    ...q,
    options: shuffled.map((p) => p.text),
    answer: keys[shuffled.findIndex((p) => p.key === q.answer)],
  };
}

function mergePart6Groups(questions: Question[]): Question[] {
  const result: Question[] = [];
  const seen = new Set<string>();
  for (let i = 0; i < questions.length; i++) {
    const q = questions[i];
    const groupKey = q.part === 6 ? (q.passageBody ?? q.passage) : undefined;
    if (q.part !== 6 || !groupKey) {
      result.push(q);
      continue;
    }
    if (seen.has(groupKey)) continue;
    seen.add(groupKey);
    const group = questions
      .slice(i)
      .filter((x) => x.part === 6 && (x.passageBody ?? x.passage) === groupKey);
    const first = group[0];
    if (group.length === 1) {
      result.push(first);
      continue;
    }
    result.push({
      ...first,
      options: first.options.map((opt) => opt.replace(/^[A-D]\)\s*/, "")),
      answer: first.answer,
      blanks: group.map((g) => ({
        options: g.options.map((opt) => opt.replace(/^[A-D]\)\s*/, "")),
        answer: g.answer,
      })),
    });
  }
  return result;
}

function getUsedIds(): Set<number> {
  try {
    return new Set(JSON.parse(localStorage.getItem("toeic-used-qids") || "[]"));
  } catch {
    return new Set();
  }
}

function updateUsedIds(newIds: number[]) {
  const prev: number[] = JSON.parse(localStorage.getItem("toeic-used-qids") || "[]");
  const updated = [...new Set([...newIds, ...prev])].slice(0, 2299);
  localStorage.setItem("toeic-used-qids", JSON.stringify(updated));
}

export function useQuestionSelector(
  questions: Question[],
  section: "listening" | "reading" | "full"
): Question[] {
  const { selected, newIds } = useMemo(() => {
    const ranges = section === "full"
      ? [ID_RANGES.listening, ID_RANGES.reading]
      : [ID_RANGES[section]];

    const usedIds = getUsedIds();
    const selected: Question[] = [];
    const newIds: number[] = [];

    for (const { min, max, count } of ranges) {
      const pool = questions.filter((q) => q.id >= min && q.id <= max);
      const unused = pool.filter((q) => !usedIds.has(q.id));
      const used = pool.filter((q) => usedIds.has(q.id));
      const picked = [
        ...shuffleArray(unused),
        ...shuffleArray(used),
      ].slice(0, count);

      selected.push(...picked);
      newIds.push(...picked.map((q) => q.id));
    }
    return { selected, newIds };
  }, [questions, section]);

  useEffect(() => {
    updateUsedIds(newIds);
  }, [newIds]);

  return useMemo(() => {
    const merged = mergePart6Groups(shuffleArray(selected)).map(shuffleQuestionOptions);
    if (section === "full") {
      return merged.sort((a, b) => a.part - b.part || a.id - b.id);
    }
    return merged;
  }, [selected, section]);
}
