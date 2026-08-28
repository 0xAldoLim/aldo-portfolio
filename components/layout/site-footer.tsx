import Link from "next/link";
import { navItems, siteConfig } from "@/lib/site";
import { VisitorCount } from "@/components/layout/visitor-count";

export function SiteFooter() {
  return (
    <footer className="footer">
      <div className="site-shell">
        <div className="footer-top">
          <div>
            <p className="footer-name">Aldo Lim Saputra</p>
            <p className="footer-meta">CYBER SECURITY STUDENT / CTF PLAYER</p>
          </div>
          <nav className="footer-links" aria-label="Footer navigation">
            {navItems.map((item) => <Link key={item.href} href={item.href}>{item.label}</Link>)}
            <a href={siteConfig.github} target="_blank" rel="noopener noreferrer">GitHub</a>
            <a href={siteConfig.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a>
            <a href={`mailto:${siteConfig.email}`}>Email</a>
          </nav>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} ALDO LIM SAPUTRA</span>
          <VisitorCount />
        </div>
      </div>
    </footer>
  );
}
