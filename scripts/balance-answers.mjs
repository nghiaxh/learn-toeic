import { readFileSync, writeFileSync } from "fs";
import { resolve } from "path";

const DATA_DIR = resolve(import.meta.dirname, "..", "src", "data");
const FILES = ["listening.ts", "reading.ts"];

const KEYS = { 3: ["A", "B", "C"], 4: ["A", "B", "C", "D"] };

function countOptions(line) {
  const start = line.indexOf("options:[");
  const end = line.indexOf("]", start);
  return [...line.slice(start + 9, end).matchAll(/`([^`]*)`/g)].length;
}

function reorder(line, targetKey) {
  const keys = KEYS[countOptions(line)] ?? KEYS[4];
  const ostart = line.indexOf("options:[") + 9;
  const oend = line.indexOf("]", ostart);
  const opts = [...line.slice(ostart, oend).matchAll(/`([^`]*)`/g)].map((m) => m[1]);

  const curIdx = keys.indexOf(line.match(/answer:`([A-D])`/)[1]);
  const correct = opts[curIdx];
  const rest = opts.filter((_, i) => i !== curIdx);

  const targetIdx = keys.indexOf(targetKey);
  const reordered = [];
  for (let i = 0; i < keys.length; i++) {
    reordered.push(i === targetIdx ? correct : rest.shift());
  }

  const prefixed = reordered.map((t, i) => `\`${keys[i]}) ${t}\``).join(",");
  return (
    line.slice(0, ostart) +
    prefixed +
    line.slice(oend).replace(/answer:`[A-D]`/, `answer:\`${keys[targetIdx]}\``)
  );
}

for (const file of FILES) {
  const filePath = resolve(DATA_DIR, file);
  const lines = readFileSync(filePath, "utf-8").split("\n");
  const counter = { 3: 0, 4: 0 };
  let changed = 0;

  const balanced = lines.map((line) => {
    if (!/^\s*\{id:\d+/.test(line)) return line;
    const n = countOptions(line);
    const size = n === 3 ? 3 : 4;
    const keys = KEYS[size];
    const target = keys[counter[size] % keys.length];
    counter[size]++;
    const next = reorder(line, target);
    if (next !== line) changed++;
    return next;
  });

  writeFileSync(filePath, balanced.join("\n"), "utf-8");

  const stats = { A: 0, B: 0, C: 0, D: 0 };
  for (const line of balanced) {
    const m = line.match(/answer:`([A-D])`/);
    if (m) stats[m[1]]++;
  }
  console.log(`${file}: reordered ${changed} questions`);
  console.log(`  answer distribution: ${JSON.stringify(stats)}`);
}
