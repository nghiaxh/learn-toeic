import { readFileSync } from "fs";
const content = readFileSync("src/data/questions.ts", "utf-8");
const re = /\{\s*id:\s*(\d+),/g;
let m;
const missing = [];
while ((m = re.exec(content)) !== null) {
  const id = parseInt(m[1]);
  if (id < 7 || id > 31) continue;
  let depth = 1;
  let pos = m.index + m[0].length;
  while (depth > 0 && pos < content.length) {
    if (content[pos] === "{") depth++;
    if (content[pos] === "}") depth--;
    pos++;
  }
  const block = content.slice(m.index, pos);
  if (!block.includes("passage:")) {
    const qm = block.match(/question:\s*"(.+?)"/);
    missing.push({ id, question: qm ? qm[1] : "???" });
  }
}
if (missing.length === 0) {
  console.log("All Part 2 questions have passage.");
} else {
  for (const { id, question } of missing) {
    console.log(`Missing passage: id=${id} question="${question}"`);
  }
}
