import type { Metadata } from "next";
import { CtfArchive } from "@/components/ctf/ctf-archive";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata("CTF Archive", "Capture The Flag placements, finals, and MVP recognition earned by Aldo Lim Saputra.", "/ctf");

export default function CtfPage() {
  return (
    <>
      <header className="page-header"><div className="site-shell"><p className="eyebrow">03 / CTF</p><h1 className="page-title">Competition history, without inflated numbers.</h1><p className="lede">Chronological placements and recognition from practical cybersecurity competitions. Results are listed without invented scores or team details.</p></div></header>
      <section className="section section-compact"><div className="site-shell"><p className="eyebrow eyebrow-muted">CTF ARCHIVE / 2026 - 2025</p><CtfArchive /></div></section>
    </>
  );
}
