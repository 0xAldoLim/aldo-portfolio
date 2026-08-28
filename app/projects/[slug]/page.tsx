import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { projects, getProject } from "@/data/projects";
import { getGitHubMetadata } from "@/lib/github";
import { pageMetadata } from "@/lib/metadata";
import { formatDate } from "@/lib/utils";

export function generateStaticParams() { return projects.map((project) => ({ slug: project.slug })); }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  return project ? pageMetadata(project.title, project.summary, `/projects/${slug}`) : {};
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();
  const live = project.repository ? await getGitHubMetadata(project.repository.owner, project.repository.name) : null;
  return (
    <>
      <header className="page-header"><div className="site-shell"><Link className="text-link back-link" href="/projects">Back to projects</Link><p className="eyebrow">PROJECT / {project.date}</p><h1 className="page-title">{project.title}</h1><p className="lede">{project.summary}</p></div></header>
      <section className="section"><div className="site-shell detail-grid"><aside className="detail-aside"><dl><div><dt>Role</dt><dd>{project.role}</dd></div><div><dt>Date</dt><dd>{project.date}</dd></div><div><dt>Stack</dt><dd className="metadata">{project.technologies.join(" / ")}</dd></div>{live ? <><div><dt>GitHub stars</dt><dd>{live.stars}</dd></div><div><dt>Last updated</dt><dd>{formatDate(live.updatedAt)}</dd></div></> : null}</dl>{project.repository ? <a className="button section-link" href={project.repository.url} target="_blank" rel="noopener noreferrer">View Repository</a> : null}</aside><div><div className="detail-section"><h2>Problem</h2><p>{project.problem}</p></div><div className="detail-section"><h2>Implementation</h2><p>{project.implementation}</p><ul className="compact-list">{project.features.map((feature) => <li key={feature}>{feature}</li>)}</ul></div><div className="detail-section"><h2>Key technical decisions</h2><ul className="compact-list">{project.decisions.map((decision) => <li key={decision}>{decision}</li>)}</ul></div><div className="detail-section"><h2>Security considerations</h2><ul className="compact-list">{project.security.map((item) => <li key={item}>{item}</li>)}</ul></div></div></div></section>
    </>
  );
}
