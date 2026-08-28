"use client";

import { AnimatePresence, motion } from "motion/react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { navItems, siteConfig } from "@/lib/site";
import { projects } from "@/data/projects";
import { ctfResults } from "@/data/ctf";

type Action = { label: string; kind: string; href: string; search: string };

const actions: Action[] = [
  { label: "Home", kind: "Section", href: "/", search: "home aldo" },
  ...navItems.map((item) => ({ label: item.label, kind: "Section", href: item.href, search: item.label })),
  ...projects.map((project) => ({ label: project.title, kind: "Project", href: `/projects/${project.slug}`, search: `${project.title} ${project.technologies.join(" ")}` })),
  ...ctfResults.map((event) => ({ label: `${event.event}: ${event.result}`, kind: "CTF", href: "/ctf", search: `${event.event} ${event.result} ${event.scope}` })),
  { label: "Email Aldo", kind: "Contact", href: `mailto:${siteConfig.email}`, search: "contact email" },
  { label: "GitHub / 0xAldoLim", kind: "Profile", href: siteConfig.github, search: "github code repositories" },
  { label: "LinkedIn / aldo-lim", kind: "Profile", href: siteConfig.linkedin, search: "linkedin profile" },
];

export function CommandPalette() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  const results = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return normalized ? actions.filter((action) => `${action.label} ${action.search}`.toLowerCase().includes(normalized)).slice(0, 12) : actions.slice(0, 12);
  }, [query]);

  useEffect(() => {
    const handleOpen = () => {
      previousFocusRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
      setQuery("");
      setActive(0);
      setOpen(true);
    };
    const handleKey = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        if (open) setOpen(false);
        else handleOpen();
      }
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", handleKey);
    window.addEventListener("open-command-palette", handleOpen);
    return () => {
      window.removeEventListener("keydown", handleKey);
      window.removeEventListener("open-command-palette", handleOpen);
    };
  }, [open]);

  useEffect(() => {
    if (open) {
      requestAnimationFrame(() => inputRef.current?.focus());
      document.body.classList.add("menu-open");
    } else {
      document.body.classList.remove("menu-open");
      previousFocusRef.current?.focus();
    }
    return () => document.body.classList.remove("menu-open");
  }, [open]);

  const run = (action: Action) => {
    setOpen(false);
    if (action.href.startsWith("/")) router.push(action.href);
    else window.location.assign(action.href);
  };

  return (
    <AnimatePresence>
      {open ? (
        <motion.div className="dialog-backdrop" role="presentation" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: .14 }} onMouseDown={(event) => { if (event.currentTarget === event.target) setOpen(false); }}>
          <motion.div
            className="palette"
            role="dialog"
            aria-modal="true"
            aria-label="Command palette"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: .16 }}
            onKeyDown={(event) => {
              if (event.key !== "Tab") return;
              const focusable = Array.from(event.currentTarget.querySelectorAll<HTMLElement>('input, button:not([disabled])'));
              const first = focusable[0];
              const last = focusable.at(-1);
              if (event.shiftKey && document.activeElement === first) {
                event.preventDefault();
                last?.focus();
              } else if (!event.shiftKey && document.activeElement === last) {
                event.preventDefault();
                first?.focus();
              }
            }}
          >
            <input
              ref={inputRef}
              className="palette-search"
              role="combobox"
              aria-controls="palette-results"
              aria-expanded="true"
              aria-activedescendant={results[active] ? `palette-item-${active}` : undefined}
              value={query}
              onChange={(event) => { setQuery(event.target.value); setActive(0); }}
              onKeyDown={(event) => {
                if (event.key === "ArrowDown") { event.preventDefault(); setActive((value) => Math.min(value + 1, results.length - 1)); }
                if (event.key === "ArrowUp") { event.preventDefault(); setActive((value) => Math.max(value - 1, 0)); }
                if (event.key === "Enter" && results[active]) { event.preventDefault(); run(results[active]); }
              }}
              placeholder="Search sections, projects, CTF results, and contacts"
              aria-label="Search site"
            />
            <div className="palette-results" id="palette-results" role="listbox">
              {results.length ? results.map((action, index) => (
                <button key={`${action.kind}-${action.label}`} id={`palette-item-${index}`} className="palette-item" type="button" role="option" aria-selected={active === index} data-active={active === index} onMouseEnter={() => setActive(index)} onClick={() => run(action)}>
                  <span>{action.label}</span><span className="palette-kind">{action.kind}</span>
                </button>
              )) : <p className="palette-empty">No matching destination.</p>}
            </div>
            <div className="palette-help"><span>↑↓ SELECT / ENTER OPEN / ESC CLOSE</span><span>LOCAL NAVIGATION</span></div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
