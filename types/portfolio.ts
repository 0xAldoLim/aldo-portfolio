export type Project = {
  slug: string;
  title: string;
  shortTitle: string;
  summary: string;
  role: string;
  date: string;
  technologies: readonly string[];
  features: readonly string[];
  problem: string;
  implementation: string;
  decisions: readonly string[];
  security: readonly string[];
  repository?: { owner: string; name: string; url: string };
  featured: boolean;
  securityProject: boolean;
};

export type CtfResult = {
  year: 2025 | 2026;
  event: string;
  shortEvent: string;
  result: string;
  type: "Jeopardy" | "Attack and Defense" | "Recognition";
  scope: "International" | "National" | "APU";
  organization?: string;
  representation?: string;
  team?: string;
  detail?: string;
  writeupSlug?: string;
  featured: boolean;
};

export type Experience = {
  organization: string;
  role: string;
  dates: string;
  description: string;
  responsibilities: readonly string[];
  technologies?: readonly string[];
};

export type WriteupFrontmatter = {
  title: string;
  slug: string;
  event: string;
  year: number;
  category: string;
  team?: string;
  placement?: string;
  published: string;
  summary: string;
  tags: string[];
  difficulty?: string;
  disclosure: "public";
};

export type WriteupRecord = WriteupFrontmatter & {
  content: string;
  headings: { id: string; text: string; level: number }[];
};
