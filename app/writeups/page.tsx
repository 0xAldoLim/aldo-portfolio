import type { Metadata } from "next";
import Link from "next/link";
import { getWriteups } from "@/lib/writeups";
import { pageMetadata } from "@/lib/metadata";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = pageMetadata("CTF Writeups", "Public, disclosure-approved CTF writeups by Aldo Lim Saputra.", "/writeups");

export default async function WriteupsPage() {
  const writeups = await getWriteups();
  return (
    <>
      <header className="page-header"><div className="site-shell"><p className="eyebrow">04 / WRITEUPS</p><h1 className="page-title">Technical notes, published responsibly.</h1><p className="lede">Only completed competitions and organizer-approved material are published. Active flags, credentials, and private infrastructure stay private.</p></div></header>
      <section className="section section-compact"><div className="site-shell">{writeups.length ? <div className="project-list">{writeups.map((writeup, index) => <Link className="project-row" href={`/writeups/${writeup.slug}`} key={writeup.slug}><span className="project-index">{String(index + 1).padStart(2, "0")}</span><div><h2>{writeup.title}</h2><p>{writeup.summary}</p></div><div className="project-meta">{writeup.event}<br />{writeup.category} / {formatDate(writeup.published)}<br />{writeup.tags.join(" / ")}</div></Link>)}</div> : <p className="empty-state">No public writeups have been added yet.</p>}</div></section>
    </>
  );
}
