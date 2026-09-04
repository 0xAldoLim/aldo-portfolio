# Aldo Lim Saputra Portfolio

A production-ready Next.js portfolio for Aldo Lim Saputra. It presents cybersecurity interests, verified CTF placements, technical projects, experience, public writeups, and direct contact options in a responsive editorial interface.

## Stack

- Next.js App Router with strict TypeScript
- Tailwind CSS 4 and a custom token-based design system
- Motion for the command palette transition
- Local MDX writeups with public-disclosure validation
- Server-rendered, cached GitHub metadata with curated-data fallback
- Resend contact delivery and optional Upstash rate limiting
- Optional Upstash visitor count
- Vercel Analytics
- Playwright smoke and link tests

## Local development

Requires Node.js 20.9 or later.

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open `http://localhost:3000`.

## Environment variables

All integrations are optional. The site builds without credentials.

- `NEXT_PUBLIC_SITE_URL`: canonical production URL, for example `https://aldo.example`
- `GITHUB_TOKEN`: server-only token for higher GitHub API limits
- `RESEND_API_KEY`: required for contact form delivery
- `RESEND_FROM_EMAIL`: required Resend-verified sender identity, for example `Aldo Portfolio <contact@yourdomain.com>`
- `UPSTASH_REDIS_REST_URL`: enables persistent contact rate limiting and visit counts
- `UPSTASH_REDIS_REST_TOKEN`: companion Upstash REST credential

Never expose the GitHub, Resend, or Upstash credentials through `NEXT_PUBLIC_` variables.

### Enable the contact form

1. Create a Resend account and API key.
2. Add a domain in the Resend dashboard and complete its DNS verification.
3. In Vercel, open Project Settings, then Environment Variables.
4. Add `RESEND_API_KEY` and set `RESEND_FROM_EMAIL` to an address on the verified domain.
5. Enable the variables for Production, Preview, and Development as needed, then redeploy.

The destination remains `aldolimsaputra@gmail.com`, and replies are addressed to the visitor who submitted the form. If delivery is unavailable, the form displays the direct email address instead of reporting a false success.

For initial testing only, Resend's `onboarding@resend.dev` sender can deliver to the email address associated with the Resend account. A verified domain is required before using the form as a production contact channel.

## CV

Place the real file at `Aldo-Lim-Saputra-CV.pdf` in the repository root. The production prebuild step copies it to `public/Aldo-Lim-Saputra-CV.pdf`. If no real PDF exists, the download control is hidden.

## Writeups

Place approved `.mdx` files in `content/writeups/`. Required frontmatter:

```yaml
title: Challenge title
slug: challenge-title
event: Event name
year: 2026
category: Reverse Engineering
team: Optional team
placement: Optional placement
published: 2026-08-27
summary: Concise public summary.
tags:
  - reverse-engineering
difficulty: Optional difficulty
disclosure: public
```

The filename must match the slug. Any missing, malformed, or non-public disclosure field fails the build instead of publishing uncertain material.

## Validation

```bash
npm run audit:content
npm run lint
npm run build
npm run test:install
npm test
```

## Deploy to Vercel

1. Push this repository to GitHub, GitLab, or Bitbucket.
2. Import the repository in Vercel with the Next.js framework preset.
3. Set `NEXT_PUBLIC_SITE_URL` to the final HTTPS domain.
4. Add any optional server-side integration credentials in Project Settings, Environment Variables.
5. Deploy. Vercel runs `npm run build`, including the CV sync check.
6. After assigning a custom domain, update `NEXT_PUBLIC_SITE_URL` and redeploy so canonical, Open Graph, robots, and sitemap URLs match.

No external credential is required for the core pages. Without Resend, the form explains that delivery is unavailable and points to direct email. Without Upstash, the numerical visitor count is omitted. Without GitHub access, local project content remains visible and live statistics are omitted.
