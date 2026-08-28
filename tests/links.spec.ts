import { expect, test } from "@playwright/test";

test("all rendered internal links and assets resolve", async ({ page, request }) => {
  const queue = ["/"];
  const visited = new Set<string>();
  while (queue.length) {
    const route = queue.shift()!;
    if (visited.has(route)) continue;
    visited.add(route);
    const response = await page.goto(route);
    expect(response?.ok(), `${route} should load`).toBeTruthy();
    const hrefs = await page.locator('a[href^="/"]').evaluateAll((anchors) => anchors.map((anchor) => anchor.getAttribute("href")).filter((href): href is string => Boolean(href)));
    for (const href of hrefs) {
      if (href.startsWith("/api/") || href.includes("#")) continue;
      const pathname = new URL(href, "http://127.0.0.1:3000").pathname;
      if (!visited.has(pathname)) queue.push(pathname);
    }
  }
  for (const asset of ["/icon.svg", "/manifest.webmanifest", "/robots.txt", "/sitemap.xml"]) {
    const response = await request.get(asset);
    expect(response.ok(), `${asset} should resolve`).toBeTruthy();
  }
});
