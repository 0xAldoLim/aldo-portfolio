function resolveSiteUrl() {
  const candidates = [
    process.env.NEXT_PUBLIC_SITE_URL,
    process.env.VERCEL_PROJECT_PRODUCTION_URL,
    process.env.VERCEL_URL,
    "http://localhost:3000",
  ];

  for (const value of candidates) {
    const candidate = value?.trim();
    if (!candidate) continue;
    try {
      const parsed = new URL(/^https?:\/\//i.test(candidate) ? candidate : `https://${candidate}`);
      if (parsed.protocol === "http:" || parsed.protocol === "https:") return parsed.origin;
    } catch {
      continue;
    }
  }

  return "http://localhost:3000";
}

export const siteConfig = {
  name: "Aldo Lim Saputra",
  shortName: "ALDO_",
  title: "Aldo Lim Saputra | Cybersecurity & CTF",
  description: "Aldo Lim Saputra is a Computer Science Cyber Security student at APU, CTF player, and security enthusiast focused on practical cybersecurity, technical projects, and competition writeups.",
  url: resolveSiteUrl(),
  email: "aldolimsaputra@gmail.com",
  phone: "+60 10 253 3181",
  github: "https://github.com/0xAldoLim",
  linkedin: "https://www.linkedin.com/in/aldo-lim",
} as const;

export const navItems = [
  { number: "01", label: "About", href: "/about" },
  { number: "02", label: "Projects", href: "/projects" },
  { number: "03", label: "CTF", href: "/ctf" },
  { number: "04", label: "Writeups", href: "/writeups" },
  { number: "05", label: "Contact", href: "/contact" },
] as const;

export function absoluteUrl(path: string) {
  return new URL(path, siteConfig.url).toString();
}
