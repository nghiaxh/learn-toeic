import { readFileSync, writeFileSync } from "fs";

const filePath = "src/data/questions.ts";
let content = readFileSync(filePath, "utf-8");

// Find first and last question boundaries
const firstQ = content.indexOf("\n{");
const lastQ = content.lastIndexOf("}") + 1;
const preamble = content.slice(0, firstQ + 1);
const postamble = content.slice(lastQ);

// Parse all question blocks
const blocks = [];
const qre = /\{\s*id:\s*(\d+),/g;
let m;
while ((m = qre.exec(content)) !== null) {
  const id = parseInt(m[1]);
  let depth = 1;
  let pos = m.index + m[0].length;
  while (depth > 0 && pos < content.length) {
    if (content[pos] === "{") depth++;
    if (content[pos] === "}") depth--;
    pos++;
  }
  blocks.push({ id, start: m.index, end: pos, block: content.slice(m.index, pos) });
}

// Deduplicate: keep last occurrence of each ID
const unique = new Map();
for (const b of blocks) unique.set(b.id, b);

// Sort by first occurrence order
const seenOrder = [];
const seen = new Set();
for (const b of blocks) {
  if (!seen.has(b.id)) {
    seen.add(b.id);
    seenOrder.push(b.id);
  }
}
const sorted = seenOrder.map(id => unique.get(id)).filter(Boolean);

function addPassage(block, qText) {
  if (block.includes("passage:")) return block;
  return block.replace(/(\s+answer:\s*"[A-D]")/, `$1,\n    passage: "${qText.replace(/"/g, '\\"')}"`);
}

function setAns(block, newAns) {
  return block.replace(/(answer:\s*)"[A-D]"/, `$1"${newAns}"`);
}

// 1. Add passage to Part 2
for (const b of sorted) {
  if (b.id >= 7 && b.id <= 31 && !b.block.includes("passage:")) {
    const qm = b.block.match(/question:\s*"(.+?)"/);
    if (qm) b.block = addPassage(b.block, qm[1]);
  }
}

// 2. Fix answer distribution
const groups = [
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

const byId = new Map(sorted.map(b => [b.id, b]));
for (const g of groups) {
  for (let i = 0; i < g.ids.length; i++) {
    const b = byId.get(g.ids[i]);
    if (!b) continue;
    const cur = b.block.match(/answer:\s*"([A-D])"/);
    if (cur && cur[1] !== g.ans[i]) {
      b.block = setAns(b.block, g.ans[i]);
    }
  }
}

// Rebuild file
const result = preamble + "\n" + sorted.map(b => b.block).join(",\n") + "\n" + postamble;
writeFileSync(filePath, result, "utf-8");
console.log("Done!");

// Verify
const v = readFileSync(filePath, "utf-8");
const counts = new Map();
const vr = /\{\s*id:\s*(\d+),/g;
let vm;
while ((vm = vr.exec(v)) !== null) {
  const id = parseInt(vm[1]);
  counts.set(id, (counts.get(id) || 0) + 1);
}
const dupes = [...counts].filter(([,c]) => c > 1);
console.log("Duplicates:", dupes.length > 0 ? dupes.map(([id]) => id).join(",") : "none");

let missing2 = 0;
const stats = { A: 0, B: 0, C: 0, D: 0 };
const vr2 = /\{\s*id:\s*(\d+),/g;
while ((vm = vr2.exec(v)) !== null) {
  const id = parseInt(vm[1]);
  let depth = 1, pos = vm.index + vm[0].length;
  while (depth > 0 && pos < v.length) {
    if (v[pos] === "{") depth++;
    if (v[pos] === "}") depth--;
    pos++;
  }
  const block = v.slice(vm.index, pos);
  if (id >= 7 && id <= 31 && !block.includes("passage:")) missing2++;
  if (id <= 100) {
    const am = block.match(/answer:\s*"([A-D])"/);
    if (am) stats[am[1]]++;
  }
}
console.log(`Part 2 missing passage: ${missing2}`);
console.log("Listening answer distribution:", stats);
