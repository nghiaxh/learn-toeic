import { readFileSync, writeFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const filePath = join(__dirname, "..", "src", "data", "questions.ts");
let content = readFileSync(filePath, "utf-8");

// Find all question blocks: { id: N, part: P, ... }
const questionRegex = /\{\s*id:\s*(\d+),/g;
let match;
const blocks = [];
while ((match = questionRegex.exec(content)) !== null) {
  const id = parseInt(match[1]);
  const start = match.index;

  // Find the closing brace for this object
  let depth = 1;
  let pos = match.index + match[0].length;
  while (depth > 0 && pos < content.length) {
    if (content[pos] === "{") depth++;
    if (content[pos] === "}") depth--;
    pos++;
  }
  const end = pos; // position after "}"
  const block = content.slice(start, end);
  blocks.push({ id, start, end, block });
}

// Part 2: add passage field (ids 7-31)
// Part 3 conversations (ids 32-70, groups of 3)
// Part 4 talks (ids 71-100, groups of 3)

function addPassage(block, questionText) {
  // Insert passage before "answer"
  return block.replace(
    /(\s+answer:\s*"[A-D]")/,
    `$1,\n    passage: "${questionText.replace(/"/g, '\\"')}"`
  );
}

function setAnswer(block, newAnswer) {
  return block.replace(
    /(answer:\s*)"[A-D]"/,
    `$1"${newAnswer}"`
  );
}

function getQuestionText(block) {
  const m = block.match(/question:\s*"(.+?)"/);
  return m ? m[1] : "";
}

// Process Part 2 - add passage
for (const { id, start, end, block } of blocks) {
  if (id >= 7 && id <= 31) {
    if (block.includes("passage:")) continue;
    const qText = getQuestionText(block);
    if (!qText) continue;
    const newBlock = addPassage(block, qText);
    content = content.slice(0, start) + newBlock + content.slice(end);
    // Recalculate block positions — simplest: just re-run after all edits
  }
}

// Answer distributions for Part 3 groups
const part3Groups = [
  { ids: [32, 33, 34], answers: ["A", "B", "C"] },
  { ids: [35, 36, 37], answers: ["B", "C", "D"] },
  { ids: [38, 39, 40], answers: ["C", "D", "A"] },
  { ids: [41, 42, 43], answers: ["D", "A", "B"] },
  { ids: [44, 45, 46], answers: ["A", "C", "B"] },
  { ids: [47, 48, 49], answers: ["B", "D", "C"] },
  { ids: [50, 51, 52], answers: ["C", "A", "D"] },
  { ids: [53, 54, 55], answers: ["D", "B", "A"] },
  { ids: [56, 57, 58], answers: ["A", "D", "C"] },
  { ids: [59, 60, 61], answers: ["B", "A", "D"] },
  { ids: [62, 63, 64], answers: ["C", "B", "A"] },
  { ids: [65, 66, 67], answers: ["D", "C", "B"] },
  { ids: [68, 69, 70], answers: ["A", "B", "D"] },
];

// Answer distributions for Part 4 groups
const part4Groups = [
  { ids: [71, 72, 73], answers: ["B", "C", "A"] },
  { ids: [74, 75, 76], answers: ["C", "D", "B"] },
  { ids: [77, 78, 79], answers: ["D", "A", "C"] },
  { ids: [80, 81, 82], answers: ["A", "B", "D"] },
  { ids: [83, 84, 85], answers: ["B", "D", "A"] },
  { ids: [86, 87, 88], answers: ["C", "A", "B"] },
  { ids: [89, 90, 91], answers: ["D", "C", "A"] },
  { ids: [92, 93, 94], answers: ["A", "D", "B"] },
  { ids: [95, 96, 97], answers: ["B", "A", "C"] },
  { ids: [98, 99, 100], answers: ["C", "B", "D"] },
];

// Re-read content after Part 2 edits to get correct positions
function getAllBlocks(content) {
  const re = /\{\s*id:\s*(\d+),/g;
  let m;
  const result = [];
  while ((m = re.exec(content)) !== null) {
    const id = parseInt(m[1]);
    const start = m.index;
    let depth = 1;
    let pos = m.index + m[0].length;
    while (depth > 0 && pos < content.length) {
      if (content[pos] === "{") depth++;
      if (content[pos] === "}") depth--;
      pos++;
    }
    result.push({ id, start, end: pos, block: content.slice(start, pos) });
  }
  return result;
}

const allGroups = [...part3Groups, ...part4Groups];

// Apply Part 3/4 answer changes
for (const group of allGroups) {
  for (let i = 0; i < group.ids.length; i++) {
    const targetId = group.ids[i];
    const targetAnswer = group.answers[i];
    const blocks = getAllBlocks(content);
    const target = blocks.find((b) => b.id === targetId);
    if (!target) continue;

    const currentAnswer = target.block.match(/answer:\s*"([A-D])"/);
    if (!currentAnswer || currentAnswer[1] === targetAnswer) continue;

    const newBlock = setAnswer(target.block, targetAnswer);
    content = content.slice(0, target.start) + newBlock + content.slice(target.end);
  }
}

writeFileSync(filePath, content, "utf-8");
console.log("Data file updated successfully.");

// Verify
const final = readFileSync(filePath, "utf-8");
const finalBlocks = getAllBlocks(final);
let part2MissingPassage = 0;
let answerStats = { A: 0, B: 0, C: 0, D: 0 };

for (const { id, block } of finalBlocks) {
  if (id >= 7 && id <= 31 && !block.includes("passage:")) {
    part2MissingPassage++;
  }
  if (id >= 1 && id <= 100) {
    const m = block.match(/answer:\s*"([A-D])"/);
    if (m) answerStats[m[1]]++;
  }
}

console.log(`Part 2 questions still missing passage: ${part2MissingPassage}`);
console.log("Listening answer distribution:", answerStats);
