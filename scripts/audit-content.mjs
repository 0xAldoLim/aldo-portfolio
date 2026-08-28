import { readFile, readdir, stat } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const ignored = new Set([".git", ".next", "node_modules", "playwright-report", "test-results"]);
const extensions = new Set([".ts", ".tsx", ".css", ".mdx", ".md", ".json"]);
const files = [];

async function walk(directory) {
  for (const name of await readdir(directory)) {
    if (ignored.has(name)) continue;
    const file = path.join(directory, name);
    const info = await stat(file);
    if (info.isDirectory()) await walk(file);
    else if (extensions.has(path.extname(file))) files.push(file);
  }
}

await walk(root);
const problems = [];
for (const file of files) {
  const source = await readFile(file, "utf8");
  if (source.includes("—")) problems.push(`${path.relative(root, file)} contains an em dash`);
  if (/lucide/i.test(source)) problems.push(`${path.relative(root, file)} references Lucide`);
  if (/Lorem ipsum|John Doe|Project title|Example article/i.test(source)) problems.push(`${path.relative(root, file)} contains placeholder copy`);
}

if (problems.length) {
  process.stderr.write(`${problems.join("\n")}\n`);
  process.exitCode = 1;
} else {
  process.stdout.write(`Content audit passed across ${files.length} source files.\n`);
}
