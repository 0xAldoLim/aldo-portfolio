import type { MetadataRoute } from "next";
import { projects } from "@/data/projects";
import { getWriteups } from "@/lib/writeups";
import { siteConfig } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const writeups = await getWriteups();
  const paths = ["", "/about", "/projects", "/ctf", "/writeups", "/contact", ...projects.map((project) => `/projects/${project.slug}`), ...writeups.map((writeup) => `/writeups/${writeup.slug}`)];
  return paths.map((path) => ({ url: `${siteConfig.url}${path}`, lastModified: new Date(), changeFrequency: path === "" ? "monthly" : "yearly", priority: path === "" ? 1 : path === "/ctf" || path === "/projects" ? .8 : .6 }));
}
