import { z } from "zod";

const githubRepoSchema = z.object({
  html_url: z.string().url().startsWith("https://github.com/"),
  stargazers_count: z.number().int().nonnegative(),
  language: z.string().nullable(),
  updated_at: z.iso.datetime(),
});

export type GitHubMetadata = {
  url: string;
  stars: number;
  language: string | null;
  updatedAt: string;
};

export async function getGitHubMetadata(owner: string, repository: string): Promise<GitHubMetadata | null> {
  if (!/^[\w.-]+$/.test(owner) || !/^[\w.-]+$/.test(repository)) return null;

  const headers: HeadersInit = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };

  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  try {
    const response = await fetch(`https://api.github.com/repos/${owner}/${repository}`, {
      headers,
      next: { revalidate: 3600 },
    });
    if (!response.ok) return null;
    const parsed = githubRepoSchema.safeParse(await response.json());
    if (!parsed.success) return null;
    return {
      url: parsed.data.html_url,
      stars: parsed.data.stargazers_count,
      language: parsed.data.language,
      updatedAt: parsed.data.updated_at,
    };
  } catch {
    return null;
  }
}
