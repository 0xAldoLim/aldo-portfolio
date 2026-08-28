import type { Metadata } from "next";
import { ProjectList } from "@/components/projects/project-list";
import { projects } from "@/data/projects";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata("Projects", "Security, CTF, mobile, and data projects built by Aldo Lim Saputra.", "/projects");

export default function ProjectsPage() {
  return (
    <>
      <header className="page-header"><div className="site-shell"><p className="eyebrow">02 / PROJECTS</p><h1 className="page-title">Work built to solve concrete problems.</h1><p className="lede">Projects spanning CTF infrastructure, team coordination, Android development, and data systems.</p></div></header>
      <section className="section section-compact"><div className="site-shell"><ProjectList items={projects} /></div></section>
    </>
  );
}
