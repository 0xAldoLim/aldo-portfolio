"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";

type Entry = { command: string; output: string | "links" };

const commandMap: Record<string, string | "links"> = {
  help: "Available: about, whoami, skills, projects, ctf, writeups, contact, github, linkedin, clear, theme, history, pwd, ls",
  about: "Computer Science Cyber Security student at APU. CTF player, builder, and security learner.",
  whoami: "Aldo Lim Saputra / Cyber Security Student / CTF Player",
  skills: "Security: reverse engineering, OSINT, threat intelligence, incident response, SOC operations, web security, and digital forensics.",
  projects: "/projects: HackEd CTF Platform, Bingoo, Mandiri News, and MitraPulse.",
  ctf: "/ctf: competition placements, finals, and MVP recognition from 2025 to 2026.",
  writeups: "/writeups: approved public technical notes and CTF solutions.",
  contact: "/contact: email, phone, LinkedIn, GitHub, and secure contact form.",
  github: "links",
  linkedin: "links",
  pwd: "/home/aldo/portfolio",
  ls: "about/  projects/  ctf/  writeups/  contact/",
  "cat flag.txt": "flag{curiosity_is_a_feature}",
  "sudo hire aldo": "Permission granted. Opening contact.",
  uname: "portfolio 1.0 / Next.js / TypeScript / human-curated",
};

export function Terminal() {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [entries, setEntries] = useState<Entry[]>([
    { command: "", output: 'Interactive session ready. Type "help" for available commands.' },
  ]);
  const [value, setValue] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const screenRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    screenRef.current?.scrollTo({ top: screenRef.current.scrollHeight, behavior: "smooth" });
  }, [entries]);

  const submit = (event: FormEvent) => {
    event.preventDefault();
    const command = value.trim().toLowerCase().replace(/\s+/g, " ");
    setValue("");
    setHistoryIndex(-1);
    if (!command) return;
    setHistory((items) => [...items, command]);
    if (command === "clear") {
      setEntries([]);
      return;
    }
    if (command === "history") {
      const nextHistory = [...history, command];
      setEntries((items) => [...items, { command, output: nextHistory.map((item, index) => `${index + 1}  ${item}`).join("\n") }]);
      return;
    }
    if (command === "theme") {
      const nextTheme = theme === "dark" ? "light" : "dark";
      setTheme(nextTheme);
      setEntries((items) => [...items, { command, output: `Theme set to ${nextTheme}.` }]);
      return;
    }
    const output = commandMap[command] ?? `command not found: ${command}. Type "help" for available commands.`;
    setEntries((items) => [...items, { command, output }]);
    if (command === "sudo hire aldo") window.setTimeout(() => router.push("/contact"), 500);
  };

  return (
    <div className="terminal" onClick={() => inputRef.current?.focus()}>
      <div className="terminal-bar"><span>TERMINAL / LOCAL</span><span>NO SHELL ACCESS</span></div>
      <div className="terminal-screen" ref={screenRef} aria-live="polite" aria-label="Interactive portfolio terminal output">
        {entries.map((entry, index) => (
          <div className="terminal-line" key={`${entry.command}-${index}`}>
            {entry.command ? <div className="terminal-command"><span className="terminal-prompt">aldo@portfolio:~$</span> {entry.command}</div> : null}
            <div className="terminal-output">
              {entry.output === "links" ? (
                entry.command === "github"
                  ? <a href="https://github.com/0xAldoLim" target="_blank" rel="noopener noreferrer">github.com/0xAldoLim</a>
                  : <a href="https://www.linkedin.com/in/aldo-lim" target="_blank" rel="noopener noreferrer">linkedin.com/in/aldo-lim</a>
              ) : entry.output.split("\n").map((line, lineIndex) => <span key={lineIndex}>{line}<br /></span>)}
              {entry.command === "projects" ? <Link href="/projects"> Open projects</Link> : null}
              {entry.command === "ctf" ? <Link href="/ctf"> Open CTF archive</Link> : null}
              {entry.command === "writeups" ? <Link href="/writeups"> Open writeups</Link> : null}
              {entry.command === "contact" ? <Link href="/contact"> Open contact</Link> : null}
            </div>
          </div>
        ))}
        <form className="terminal-form" onSubmit={submit}>
          <label className="terminal-prompt" htmlFor="terminal-input">aldo@portfolio:~$</label>
          <input
            ref={inputRef}
            id="terminal-input"
            className="terminal-input"
            value={value}
            onChange={(event) => setValue(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "ArrowUp") {
                event.preventDefault();
                const next = Math.min(historyIndex + 1, history.length - 1);
                setHistoryIndex(next);
                setValue(history[history.length - 1 - next] ?? "");
              }
              if (event.key === "ArrowDown") {
                event.preventDefault();
                const next = historyIndex - 1;
                setHistoryIndex(next);
                setValue(next < 0 ? "" : history[history.length - 1 - next] ?? "");
              }
            }}
            autoComplete="off"
            autoCapitalize="none"
            spellCheck={false}
            aria-label="Terminal command"
          />
        </form>
      </div>
    </div>
  );
}
