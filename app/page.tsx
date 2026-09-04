import fs from "node:fs";
import path from "node:path";
import Link from "next/link";
import { LineField } from "@/components/background/line-field";
import { ProjectList } from "@/components/projects/project-list";
import { CtfArchive } from "@/components/ctf/ctf-archive";
import { Terminal } from "@/components/terminal/terminal";
import { projects } from "@/data/projects";
import { siteConfig } from "@/lib/site";

export default function HomePage() {
  const hasCv = fs.existsSync(path.join(process.cwd(), "public", "Aldo-Lim-Saputra-CV.pdf"));
  return (
    <>
      <section className="hero section">
        <LineField />
        <div className="site-shell hero-content">
          <p className="eyebrow">STATUS: ACTIVE / MALAYSIA / INDONESIA</p>
          <h1 className="display">ALDO LIM<br />SAPUTRA</h1>
          <p className="subhead">Cyber Security Student / CTF Player</p>
          <p className="lede">Cybersecurity enthusiast pursuing a career in security, competing in CTFs, building technical tools, and documenting the process.</p>
          <p className="focus-line">Reverse Engineering / OSINT / Threat Intelligence / Security Operations</p>
          <div className="hero-actions">
            <Link className="button button-primary" href="/projects">View Projects</Link>
            <Link className="button" href="/ctf">CTF Archive</Link>
            {hasCv ? <a className="button" href="/Aldo-Lim-Saputra-CV.pdf" download>Download CV</a> : null}
          </div>
          <div className="text-links">
            <a className="text-link" href={siteConfig.github} target="_blank" rel="noopener noreferrer">GitHub <span className="external-mark" aria-hidden="true">↗</span></a>
            <a className="text-link" href={siteConfig.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn <span className="external-mark" aria-hidden="true">↗</span></a>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="site-shell split">
          <div><p className="eyebrow">01 / ABOUT</p><h2 className="section-title">Learning through systems, tools, and competition.</h2></div>
          <div>
            <p className="body-copy">I am a Computer Science student specializing in Cyber Security at Asia Pacific University. I spend much of my technical time competing in CTFs, studying how systems fail, building security-focused tools, and improving my practical understanding of defensive and offensive security.</p>
            <Link className="text-link section-link" href="/about">More about me</Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="site-shell">
          <p className="eyebrow">SELECTED WORK</p>
          <h2 className="section-title">Tools built around real workflows.</h2>
          <ProjectList items={projects.filter((project) => project.featured)} />
          <Link className="text-link section-link" href="/projects">Open project archive</Link>
        </div>
      </section>

      <section className="section">
        <div className="site-shell">
          <p className="eyebrow">CTF HIGHLIGHTS</p>
          <h2 className="section-title">Competition is the practical lab.</h2>
          <CtfArchive compact />
          <Link className="text-link section-link" href="/ctf">View complete CTF archive</Link>
        </div>
      </section>

      <section className="section">
        <div className="site-shell split">
          <div><p className="eyebrow">INTERACTIVE SESSION</p><h2 className="section-title">Query the portfolio.</h2><p className="lede">Use familiar commands to explore my work, CTF results, skills, and contact details.</p></div>
          <Terminal />
        </div>
      </section>

      <section className="section section-compact">
        <div className="site-shell split">
          <div><p className="eyebrow">SYSTEM / CONTACT</p><h2 className="section-title">Open to security opportunities.</h2></div>
          <div><p className="body-copy">Interested in SOC, threat intelligence, security analysis, reverse engineering, incident response, and security engineering pathways.</p><Link className="button button-primary section-link" href="/contact">Get in touch</Link></div>
        </div>
      </section>
    </>
  );
}
