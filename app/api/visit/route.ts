import { NextResponse } from "next/server";
import { hasUpstash, redisCommand } from "@/lib/upstash";

export const dynamic = "force-dynamic";
const key = "aldo-portfolio:visits";

export async function GET() {
  if (!hasUpstash()) return new NextResponse(null, { status: 204 });
  const raw = await redisCommand<string>(["GET", key]);
  const count = raw === null ? null : Number.parseInt(raw, 10);
  if (count === null || !Number.isFinite(count)) return new NextResponse(null, { status: 204 });
  return NextResponse.json({ count }, { headers: { "Cache-Control": "no-store" } });
}

export async function POST() {
  if (!hasUpstash()) return new NextResponse(null, { status: 204 });
  const count = await redisCommand<number>(["INCR", key]);
  if (typeof count !== "number") return new NextResponse(null, { status: 204 });
  return NextResponse.json({ count }, { headers: { "Cache-Control": "no-store" } });
}
