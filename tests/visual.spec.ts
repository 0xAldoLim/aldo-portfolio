import { expect, test } from "@playwright/test";

test("homepage visual snapshots remain overflow-free", async ({ page }, testInfo) => {
  await page.emulateMedia({ colorScheme: "dark" });
  for (const viewport of [{ name: "desktop", width: 1440, height: 1000 }, { name: "mobile", width: 390, height: 844 }]) {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await page.goto("/");
    await page.screenshot({ path: testInfo.outputPath(`homepage-${viewport.name}.png`), fullPage: true });
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow).toBeLessThanOrEqual(0);
  }
});
