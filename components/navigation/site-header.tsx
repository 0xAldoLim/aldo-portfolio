"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { navItems } from "@/lib/site";
import { ThemeControl } from "@/components/theme/theme-control";

function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

function SearchIcon() {
  return (
    <svg className="control-icon" viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="10.75" cy="10.75" r="5.75" />
      <path d="m15 15 4.25 4.25" />
    </svg>
  );
}

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    document.body.classList.toggle("menu-open", open);
    if (!open) return;
    const firstLink = menuRef.current?.querySelector<HTMLElement>("a");
    firstLink?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
      if (event.key === "Tab" && menuRef.current) {
        const focusable = Array.from(menuRef.current.querySelectorAll<HTMLElement>('a, button:not([disabled])'));
        const first = focusable[0];
        const last = focusable.at(-1);
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last?.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first?.focus();
        }
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.classList.remove("menu-open");
    };
  }, [open]);

  return (
    <header className="site-header">
      <div className="site-shell header-inner">
        <Link className="wordmark" href="/" aria-label="Aldo Lim Saputra, home">ALDO<span>_</span></Link>
        <nav className="desktop-nav" aria-label="Primary navigation">
          {navItems.map((item) => (
            <Link key={item.href} className="nav-link" href={item.href} aria-current={isActive(pathname, item.href) ? "page" : undefined}>
              <span className="nav-number">{item.number}</span><span>{item.label}</span>
            </Link>
          ))}
        </nav>
        <div className="header-controls">
          <button type="button" className="icon-button" aria-label="Open command palette" title="Command palette" onClick={() => window.dispatchEvent(new Event("open-command-palette"))}>
            <SearchIcon />
          </button>
          <ThemeControl />
          <button ref={triggerRef} type="button" className="menu-button" aria-expanded={open} aria-controls="mobile-menu" aria-label={open ? "Close menu" : "Open menu"} onClick={() => setOpen((value) => !value)}>
            <span /><span />
          </button>
        </div>
      </div>
      {open ? (
        <div className="mobile-menu-layer" onMouseDown={(event) => { if (event.target === event.currentTarget) setOpen(false); }}>
          <div ref={menuRef} className="mobile-menu" id="mobile-menu" role="dialog" aria-modal="true" aria-label="Mobile navigation">
            <nav aria-label="Mobile navigation">
              {navItems.map((item) => (
                <Link key={item.href} className="mobile-link" href={item.href} aria-current={isActive(pathname, item.href) ? "page" : undefined} onClick={() => setOpen(false)}>
                  <span className="nav-number">{item.number}</span><span>{item.label}</span>
                </Link>
              ))}
            </nav>
            <div className="mobile-menu-meta">
              <a href="https://github.com/0xAldoLim" target="_blank" rel="noopener noreferrer">GitHub</a>
              <a href="https://www.linkedin.com/in/aldo-lim" target="_blank" rel="noopener noreferrer">LinkedIn</a>
              <a href="mailto:aldolimsaputra@gmail.com">Email</a>
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}
