import "server-only";

import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import { z } from "zod";
import type { WriteupRecord } from "@/types/portfolio";
import { slugify } from "@/lib/utils";

const writeupSchema = z.object({
  title: z.string().min(1),
  slug: z.string().regex(/^[a-z0-9-]+$/),
  event: z.string().min(1),
  year: z.coerce.number().int().min(2000).max(2100),
  category: z.string().min(1),
  team: z.string().optional(),
  placement: z.string().optional(),
  published: z.iso.date(),
  summary: z.string().min(1).max(300),
  tags: z.array(z.string().min(1)).default([]),
  difficulty: z.string().optional(),
  disclosure: z.literal("public"),
});

const writeupDirectory = path.join(process.cwd(), "content", "writeups");

function extractHeadings(content: string) {
  return Array.from(content.matchAll(/^(#{2,3})\s+(.+)$/gm)).map((match) => ({
    level: match[1].length,
    text: match[2].replace(/[`*_]/g, "").trim(),
    id: slugify(match[2].replace(/[`*_]/g, "")),
  }));
}

export async function getWriteups(): Promise<WriteupRecord[]> {
  let fileNames: string[];
  try {
    fileNames = (await fs.readdir(writeupDirectory)).filter((name) => name.endsWith(".mdx"));
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return [];
    throw error;
  }

  const records = await Promise.all(
    fileNames.map(async (fileName) => {
      const raw = await fs.readFile(path.join(writeupDirectory, fileName), "utf8");
      const parsed = matter(raw);
      const frontmatter = writeupSchema.parse(parsed.data);
      if (`${frontmatter.slug}.mdx` !== fileName) {
        throw new Error(`Writeup slug does not match its filename: ${fileName}`);
      }
      return { ...frontmatter, content: parsed.content, headings: extractHeadings(parsed.content) };
    }),
  );

  return records.sort((a, b) => Date.parse(b.published) - Date.parse(a.published));
}

export async function getWriteup(slug: string) {
  const writeups = await getWriteups();
  return writeups.find((writeup) => writeup.slug === slug);
}
