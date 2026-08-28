import type { Metadata } from "next";
import Link from "next/link";
import { experience } from "@/data/experience";
import { certifications, skillGroups, training } from "@/data/skills";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata("About", "Education, technical experience, security interests, skills, and training for Aldo Lim Saputra.", "/about");

export default function AboutPage() {
  return (
    <>
      <header className="page-header"><div className="site-shell"><p className="eyebrow">01 / ABOUT</p><h1 className="page-title">Curious about how systems behave under pressure.</h1><p className="lede">Computer Science Cyber Security student at Asia Pacific University, CTF player, and practical builder developing breadth across defensive and offensive security.</p></div></header>

      <section className="section section-compact"><div className="site-shell split"><div><p className="eyebrow">PROFILE</p><h2 className="section-title">Grounded in practice.</h2></div><div><p className="body-copy">I study security by moving between competition challenges, software projects, network operations, and structured training. Current interests include reverse engineering, OSINT, threat intelligence, incident response, SOC operations, web security, and digital forensics.</p></div></div></section>

      <section className="section section-compact"><div className="site-shell split"><div><p className="eyebrow">EDUCATION</p><h2 className="section-title">Asia Pacific University.</h2></div><div><h3 className="experience-role">Bachelor of Science in Computer Science with specialization in Cyber Security</h3><p className="metadata">2024 - PRESENT</p><p className="lede">Asia Pacific University of Technology and Innovation</p><ul className="compact-list"><li>Practical CTF Strategies</li><li>System and Network Administration</li><li>Introduction to Security and Forensic Technologies</li></ul></div></div></section>

      <section className="section"><div className="site-shell"><p className="eyebrow">EXPERIENCE</p><h2 className="section-title">Technical work and training.</h2><div className="experience-list">{experience.map((item) => <article className="experience-item" key={`${item.organization}-${item.role}`}><div><h3 className="experience-org">{item.organization}</h3><p className="experience-date">{item.dates}</p></div><div><h3 className="experience-role">{item.role}</h3><p className="experience-description">{item.description}</p><ul className="compact-list">{item.responsibilities.map((responsibility) => <li key={responsibility}>{responsibility}</li>)}</ul>{item.technologies ? <p className="tag-line section-link">{item.technologies.join(" / ")}</p> : null}</div></article>)}</div></div></section>

      <section className="section"><div className="site-shell"><p className="eyebrow">CAPABILITIES</p><h2 className="section-title">Security, software, and systems.</h2><div className="skill-groups">{skillGroups.map((group) => <div className="skill-group" key={group.title}><h3>{group.title}</h3><p>{group.items.join(" / ")}</p></div>)}</div></div></section>

      <section className="section section-compact"><div className="site-shell split"><div><p className="eyebrow">CERTIFICATIONS / TRAINING</p><h2 className="section-title">Structured foundations.</h2></div><div><ul className="compact-list">{certifications.map((item) => <li key={item.title}><strong>{item.issuer}</strong><br />{item.title}</li>)}</ul><div className="experience-item" style={{ gridTemplateColumns: "1fr", gap: 8 }}><p className="metadata">TRAINING ACCESS</p><h3 className="experience-role">{training.issuer} {training.title}</h3><p className="experience-description">{training.detail}</p></div><Link className="button section-link" href="/contact">Start a conversation</Link></div></div></section>
    </>
  );
}
