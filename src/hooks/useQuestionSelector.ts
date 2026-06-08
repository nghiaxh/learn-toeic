import { useMemo } from "react";
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
        options: indices.map((i) => blank.options[i].replace(/^[A-D]\)\s*/, "")),
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
  let i = 0;
  while (i < questions.length) {
    const q = questions[i];
    const group = [q];
    while (
      i + 1 < questions.length &&
      questions[i + 1].part === 6 &&
      questions[i + 1].passageBody &&
      questions[i + 1].passageBody === q.passageBody
    ) {
      group.push(questions[i + 1]);
      i++;
    }

    if (group.length > 1 && q.part === 6) {
      result.push({
        ...q,
        options: group[0].options.map((_, idx) =>
          group.map((g) => g.options[idx].replace(/^[A-D]\)\s*/, "")).join("; ")
        ),
        answer: group[0].answer,
        blanks: group.map((g) => ({ options: g.options, answer: g.answer })),
      });
      i++;
      continue;
    }
    result.push(q);
    i++;
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
  return useMemo(() => {
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

    updateUsedIds(newIds);
    return mergePart6Groups(shuffleArray(selected)).map(shuffleQuestionOptions);
  }, [questions, section]);
}
