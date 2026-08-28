import "server-only";

const url = process.env.UPSTASH_REDIS_REST_URL;
const token = process.env.UPSTASH_REDIS_REST_TOKEN;

export function hasUpstash() { return Boolean(url && token); }

export async function redisCommand<T>(command: Array<string | number>): Promise<T | null> {
  if (!url || !token) return null;
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify(command),
      cache: "no-store",
      signal: AbortSignal.timeout(3500),
    });
    if (!response.ok) return null;
    const payload = await response.json() as { result?: T };
    return payload.result ?? null;
  } catch {
    return null;
  }
}
