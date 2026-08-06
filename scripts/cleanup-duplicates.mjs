import { readFileSync, writeFileSync } from "fs";
import { resolve } from "path";

const DATA_DIR = resolve(import.meta.dirname, "..", "src", "data");
const FILES = ["listening.ts", "reading.ts"];

function extractQuestion(line) {
  const qm = line.match(/question:`([^`]*)`/);
  const am = line.match(/answer:`([A-D])`/);
  const pm = line.match(/part:(\d)/);
  const idm = line.match(/\{id:(\d+)/);
  if (!qm || !am || !pm || !idm) return null;

  const optionsStart = line.indexOf("options:[");
  const optionsEnd = line.indexOf("]", optionsStart);
  if (optionsStart < 0 || optionsEnd < 0) return null;
  const optionsStr = line.slice(optionsStart + 9, optionsEnd);
  const options = [...optionsStr.matchAll(/`([^`]*)`/g)].map((m) => m[1]);

  const title = line.match(/passageTitle:`([^`]*)`/);
  const passage = line.match(/passage:`([^`]*)`/);
  const body = line.match(/passageBody:`([^`]*)`/);

  return {
    id: Number(idm[1]),
    part: Number(pm[1]),
    question: qm[1],
    options,
    answer: am[1],
    passageTitle: title ? title[1] : null,
    passage: passage ? passage[1] : null,
    passageBody: body ? body[1] : null,
  };
}

function fingerprint(q) {
  const base = `${q.part}|${q.question}|${q.options.join("~")}|${q.answer}`;
  if (q.part === 1 || q.part === 3 || q.part === 4) return `${base}|${q.passage ?? ""}`;
  return base;
}

function tokens(text) {
  return new Set((text.toLowerCase() || "").split(/\W+/).filter(Boolean));
}

function similarity(a, b) {
  const ta = tokens(a);
  const tb = tokens(b);
  const inter = [...ta].filter((t) => tb.has(t)).length;
  const union = new Set([...ta, ...tb]).size;
  return union === 0 ? 0 : inter / union;
}

for (const file of FILES) {
  const filePath = resolve(DATA_DIR, file);
  const content = readFileSync(filePath, "utf-8");
  const lines = content.split("\n");

  const seen = new Set();
  const part7Groups = new Map();
  let removed = 0;
  const kept = [];

  const isNearDup = (q) => {
    if (q.part !== 7) return false;
    const key = `${q.question}|${q.options.join("~")}|${q.answer}`;
    const body = q.passageBody ?? q.passage ?? "";
    const group = part7Groups.get(key);
    if (!group) {
      part7Groups.set(key, [body]);
      return false;
    }
    for (const prev of group) {
      if (similarity(prev, body) >= 0.5) return true;
    }
    group.push(body);
    return false;
  };

  for (const rawLine of lines) {
    const line = rawLine;
    const isQuestion = /^\s*\{id:\d+/.test(line);
    if (!isQuestion) {
      kept.push(line);
      continue;
    }
    const q = extractQuestion(line);
    if (!q || q.part === 6) {
      kept.push(line);
      continue;
    }
    const fp = fingerprint(q);
    if (seen.has(fp) || isNearDup(q)) {
      removed++;
      console.log(`  [${file}] removed duplicate part${q.part} id ${q.id}`);
    } else {
      seen.add(fp);
      kept.push(line);
    }
  }

  writeFileSync(filePath, kept.join("\n"), "utf-8");
  console.log(`${file}: removed ${removed} duplicate(s)`);
}
