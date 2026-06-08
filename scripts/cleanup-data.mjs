import { readFileSync, writeFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const filePath = join(__dirname, "..", "src", "data", "questions.ts");
let content = readFileSync(filePath, "utf-8");

// Find all question blocks, deduplicate by ID (keep last occurrence)
const questionRegex = /\{\s*id:\s*(\d+),/g;
let match;
const seen = new Set();
const blocks = [];

while ((match = questionRegex.exec(content)) !== null) {
  const id = parseInt(match[1]);
  let depth = 1;
  let pos = match.index + match[0].length;
  while (depth > 0 && pos < content.length) {
    if (content[pos] === "{") depth++;
    if (content[pos] === "}") depth--;
    pos++;
  }
  const block = content.slice(match.index, pos);
  blocks.push({ id, start: match.index, end: pos, block, keep: false });
}

// Mark the last occurrence of each id for keeping
const byId = new Map();
for (const b of blocks) {
  byId.set(b.id, b);
}
for (const b of blocks) {
  if (byId.get(b.id) === b) b.keep = true;
}

// Build new content by removing non-kept blocks
let result = content;
// Process in reverse order so indices don't shift
for (let i = blocks.length - 1; i >= 0; i--) {
  const b = blocks[i];
  if (!b.keep) {
    // Remove this block including the trailing comma/space before the next block
    // We just slice it out
    result = result.slice(0, b.start) + result.slice(b.end);
  }
}

// Now re-parse result to get clean blocks
function parseBlocks(text) {
  const re = /\{\s*id:\s*(\d+),/g;
  let m;
  const out = [];
  while ((m = re.exec(text)) !== null) {
    const id = parseInt(m[1]);
    let depth = 1;
    let pos = m.index + m[0].length;
    while (depth > 0 && pos < text.length) {
      if (text[pos] === "{") depth++;
      if (text[pos] === "}") depth--;
      pos++;
    }
    out.push({ id, start: m.index, end: pos, block: text.slice(m.index, pos) });
  }
  return out;
}

// Helper: add passage to a block
function addPassage(block, questionText) {
  // Skip if already has passage
  if (block.includes("passage:")) return block;
  return block.replace(
    /(\s+answer:\s*"[A-D]")/,
    `$1,\n    passage: "${questionText.replace(/"/g, '\\"')}"`
  );
}

// Helper: change answer
function setAnswer(block, newAnswer) {
  return block.replace(/(answer:\s*)"[A-D]"/, `$1"${newAnswer}"`);
}

// Apply Part 2 passage additions (ids 7-31)
let cleanBlocks = parseBlocks(result);
for (const b of cleanBlocks) {
  if (b.id >= 7 && b.id <= 31 && !b.block.includes("passage:")) {
    const qm = b.block.match(/question:\s*"(.+?)"/);
    if (!qm) continue;
    const newBlock = addPassage(b.block, qm[1]);
    result = result.slice(0, b.start) + newBlock + result.slice(b.end);
  }
}

// Apply answer distribution for Part 3-4
const part3Groups = [
  { ids: [32,33,34], ans: ["A","B","C"] },
  { ids: [35,36,37], ans: ["B","C","D"] },
  { ids: [38,39,40], ans: ["C","D","A"] },
  { ids: [41,42,43], ans: ["D","A","B"] },
  { ids: [44,45,46], ans: ["A","C","B"] },
  { ids: [47,48,49], ans: ["B","D","C"] },
  { ids: [50,51,52], ans: ["C","A","D"] },
  { ids: [53,54,55], ans: ["D","B","A"] },
  { ids: [56,57,58], ans: ["A","D","C"] },
  { ids: [59,60,61], ans: ["B","A","D"] },
  { ids: [62,63,64], ans: ["C","B","A"] },
  { ids: [65,66,67], ans: ["D","C","B"] },
  { ids: [68,69,70], ans: ["A","B","D"] },
];

const part4Groups = [
  { ids: [71,72,73], ans: ["B","C","A"] },
  { ids: [74,75,76], ans: ["C","D","B"] },
  { ids: [77,78,79], ans: ["D","A","C"] },
  { ids: [80,81,82], ans: ["A","B","D"] },
  { ids: [83,84,85], ans: ["B","D","A"] },
  { ids: [86,87,88], ans: ["C","A","B"] },
  { ids: [89,90,91], ans: ["D","C","A"] },
  { ids: [92,93,94], ans: ["A","D","B"] },
  { ids: [95,96,97], ans: ["B","A","C"] },
  { ids: [98,99,100], ans: ["C","B","D"] },
];

for (const group of [...part3Groups, ...part4Groups]) {
  cleanBlocks = parseBlocks(result);
  for (let i = 0; i < group.ids.length; i++) {
    const target = cleanBlocks.find(b => b.id === group.ids[i]);
    if (!target) continue;
    const curAns = target.block.match(/answer:\s*"([A-D])"/);
    if (!curAns || curAns[1] === group.ans[i]) continue;
    const newBlock = setAnswer(target.block, group.ans[i]);
    result = result.slice(0, target.start) + newBlock + result.slice(target.end);
  }
}

writeFileSync(filePath, result, "utf-8");
console.log("Done!");

// Verify
const final = readFileSync(filePath, "utf-8");
const finalBlocks = parseBlocks(final);
const idCounts = new Map();
for (const b of finalBlocks) {
  idCounts.set(b.id, (idCounts.get(b.id) || 0) + 1);
}
const dupes = [...idCounts.entries()].filter(([,c]) => c > 1);
if (dupes.length > 0) {
  console.log("Duplicates still exist:", dupes.map(([id]) => id).join(","));
} else {
  console.log("No duplicate IDs. Good.");
}

let missing2 = 0;
const stats = { A: 0, B: 0, C: 0, D: 0 };
for (const b of finalBlocks) {
  if (b.id >= 7 && b.id <= 31 && !b.block.includes("passage:")) missing2++;
  if (b.id <= 100) {
    const m = b.block.match(/answer:\s*"([A-D])"/);
    if (m) stats[m[1]]++;
  }
}
console.log(`Part 2 missing passage: ${missing2}`);
console.log("Listening answer distribution:", stats);
console.log(`Total question blocks: ${finalBlocks.length}`);
