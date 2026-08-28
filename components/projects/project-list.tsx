import Link from "next/link";
import type { Project } from "@/types/portfolio";
import { getGitHubMetadata } from "@/lib/github";
import { formatDate } from "@/lib/utils";

export async function ProjectList({ items }: { items: readonly Project[] }) {
  const metadata = await Promise.all(items.map((project) => project.repository ? getGitHubMetadata(project.repository.owner, project.repository.name) : null));

  return (
    <div className="project-list">
      {items.map((project, index) => {
        const live = metadata[index];
        return (
          <Link className="project-row" href={`/projects/${project.slug}`} key={project.slug}>
            <span className="project-index">{String(index + 1).padStart(2, "0")}</span>
            <div>
              <h3>{project.title}</h3>
              <p>{project.summary}</p>
            </div>
            <div className="project-meta">
              <div>{project.role.toUpperCase()}</div>
              <div>{project.technologies.slice(0, 5).join(" / ")}</div>
              {live ? (
                <div className="project-live" aria-label="Live GitHub metadata">
                  <span>{live.stars} {live.stars === 1 ? "STAR" : "STARS"}</span>
                  {live.language ? <span>{live.language.toUpperCase()}</span> : null}
                  <span>UPDATED {formatDate(live.updatedAt).toUpperCase()}</span>
                </div>
              ) : null}
            </div>
          </Link>
        );
      })}
    </div>
  );
}
