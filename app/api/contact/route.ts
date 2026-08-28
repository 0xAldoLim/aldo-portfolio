import { createHash } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { contactSchema } from "@/lib/contact";
import { hasUpstash, redisCommand } from "@/lib/upstash";
import { siteConfig } from "@/lib/site";

const localAttempts = new Map<string, { count: number; expires: number }>();
const LIMIT = 5;
const WINDOW_SECONDS = 3600;

function clientKey(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "unknown";
  return createHash("sha256").update(ip).digest("hex").slice(0, 24);
}

async function rateLimited(key: string) {
  if (hasUpstash()) {
    const redisKey = `aldo-portfolio:contact:${key}`;
    const count = await redisCommand<number>(["INCR", redisKey]);
    if (count === 1) await redisCommand<number>(["EXPIRE", redisKey, WINDOW_SECONDS]);
    return typeof count === "number" && count > LIMIT;
  }
  const now = Date.now();
  const current = localAttempts.get(key);
  if (!current || current.expires < now) {
    localAttempts.set(key, { count: 1, expires: now + WINDOW_SECONDS * 1000 });
    return false;
  }
  current.count += 1;
  return current.count > LIMIT;
}

function clean(value: string) {
  return value.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "");
}

export async function POST(request: NextRequest) {
  const origin = request.headers.get("origin");
  const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host");
  const protocol = request.headers.get("x-forwarded-proto") ?? request.nextUrl.protocol.replace(":", "");
  const allowedOrigins = new Set([request.nextUrl.origin, new URL(siteConfig.url).origin]);
  if (host) allowedOrigins.add(`${protocol}://${host}`);
  if (!origin || !allowedOrigins.has(origin)) {
    return NextResponse.json({ ok: false, message: "Request origin was not accepted." }, { status: 403 });
  }
  const declaredLength = Number(request.headers.get("content-length") ?? 0);
  if (declaredLength > 12_000) return NextResponse.json({ ok: false, message: "Request is too large." }, { status: 413 });
  const raw = await request.text();
  if (raw.length > 12_000) return NextResponse.json({ ok: false, message: "Request is too large." }, { status: 413 });
  let input: unknown;
  try { input = JSON.parse(raw); } catch { return NextResponse.json({ ok: false, message: "Invalid request body." }, { status: 400 }); }
  const parsed = contactSchema.safeParse(input);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, message: "Check the highlighted fields.", errors: parsed.error.flatten().fieldErrors }, { status: 400 });
  }
  if (parsed.data.website) return NextResponse.json({ ok: true });
  if (await rateLimited(clientKey(request))) return NextResponse.json({ ok: false, message: "Too many messages were sent. Email Aldo directly instead." }, { status: 429 });
  if (!process.env.RESEND_API_KEY) {
    return NextResponse.json({ ok: false, message: "Form delivery is not configured. Email Aldo directly at aldolimsaputra@gmail.com." }, { status: 503 });
  }
  const data = {
    name: clean(parsed.data.name),
    email: clean(parsed.data.email),
    subject: clean(parsed.data.subject).replace(/[\r\n]/g, " "),
    message: clean(parsed.data.message),
  };
  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: process.env.RESEND_FROM_EMAIL ?? "Portfolio Contact <onboarding@resend.dev>",
        to: [siteConfig.email],
        reply_to: data.email,
        subject: `[Portfolio] ${data.subject}`,
        text: `Name: ${data.name}\nEmail: ${data.email}\n\n${data.message}`,
      }),
      signal: AbortSignal.timeout(8000),
    });
    if (!response.ok) return NextResponse.json({ ok: false, message: "Message could not be delivered. Email Aldo directly at aldolimsaputra@gmail.com." }, { status: 502 });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, message: "Message could not be delivered. Email Aldo directly at aldolimsaputra@gmail.com." }, { status: 502 });
  }
}
