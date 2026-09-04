import { expect, test } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";

test("homepage loads and main navigation works", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /ALDO LIM SAPUTRA/i })).toBeVisible();
  await page.getByRole("navigation", { name: "Primary navigation" }).getByRole("link", { name: /Projects/ }).click();
  await expect(page).toHaveURL(/\/projects$/);
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Work built");
});

test("hero wave animates when the page scrolls", async ({ page }) => {
  await page.goto("/");
  const canvas = page.locator("canvas.line-field");
  await expect(canvas).toBeVisible();
  const before = await canvas.evaluate((element) => (element as HTMLCanvasElement).toDataURL());
  await page.mouse.wheel(0, 360);
  await page.waitForTimeout(180);
  const after = await canvas.evaluate((element) => (element as HTMLCanvasElement).toDataURL());
  expect(after).not.toBe(before);
  await expect(page.getByRole("button", { name: "Open command palette" }).locator("svg")).toBeVisible();
  await expect(page.getByRole("button", { name: /^Theme:/ }).locator("svg")).toBeVisible();
});

test("mobile menu opens, shows active route, and closes with Escape", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/about");
  const menu = page.getByRole("button", { name: "Open menu" });
  await menu.click();
  const dialog = page.getByRole("dialog", { name: "Mobile navigation" });
  await expect(dialog).toBeVisible();
  const bounds = await dialog.boundingBox();
  expect(bounds?.width).toBeLessThanOrEqual(350);
  expect(bounds?.height).toBeLessThan(380);
  await expect(dialog.getByRole("link", { name: /About/ })).toHaveAttribute("aria-current", "page");
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog", { name: "Mobile navigation" })).toBeHidden();
});

test("command palette opens and navigates", async ({ page }) => {
  await page.goto("/");
  await page.keyboard.press("Control+k");
  const search = page.getByRole("combobox", { name: "Search site" });
  await expect(search).toBeVisible();
  await search.fill("Mandiri News");
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/\/projects\/mandiri-news$/);
});

test("terminal accepts a known command and retains history", async ({ page }) => {
  await page.goto("/");
  const input = page.getByRole("textbox", { name: "Terminal command" });
  await input.fill("whoami");
  await input.press("Enter");
  await expect(page.getByText(/Aldo Lim Saputra \/ Cyber Security Student \/ CTF Player/)).toBeVisible();
  await input.press("ArrowUp");
  await expect(input).toHaveValue("whoami");
  await input.fill("hint");
  await input.press("Enter");
  await expect(page.getByText("Try reading flag.txt, asking for a fortune, or pinging aldo.")).toBeVisible();
  await input.fill("cat flag.txt");
  await input.press("Enter");
  await expect(page.getByText("flag{curiosity_is_a_feature}")).toBeVisible();
});

test("project route and writeup archive render", async ({ page }) => {
  await page.goto("/projects/hacked-ctf-platform");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("HackEd CTF Platform");
  await page.goto("/writeups");
  await expect(page.getByText("I have not published any writeups here yet.")).toBeVisible();
});

test("contact validation returns accessible inline errors", async ({ page }) => {
  await page.goto("/contact");
  await expect(page.getByText("Malaysia / Indonesia", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Send Message" }).click();
  await expect(page.getByText("Check the highlighted fields.")).toBeVisible();
  await expect(page.locator("#name-error")).not.toBeEmpty();
});

test("custom 404 renders", async ({ page }) => {
  await page.goto("/missing-route-for-smoke-test");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("404: route not found");
  await expect(page.getByRole("link", { name: "Return Home" })).toBeVisible();
});

test("theme control cycles and persists", async ({ page }) => {
  await page.goto("/");
  const control = page.getByRole("button", { name: /^Theme:/ });
  await expect(control).toBeEnabled();
  const before = await control.getAttribute("aria-label");
  await control.click();
  await expect(control).not.toHaveAttribute("aria-label", before ?? "");
  await page.reload();
  await expect(control).not.toHaveAttribute("aria-label", before ?? "");
});

test("CV link resolves only when the real asset exists", async ({ page }) => {
  await page.goto("/");
  const exists = fs.existsSync(path.join(process.cwd(), "public", "Aldo-Lim-Saputra-CV.pdf"));
  const link = page.getByRole("link", { name: "Download CV" });
  if (exists) {
    await expect(link).toHaveAttribute("href", "/Aldo-Lim-Saputra-CV.pdf");
    const response = await page.request.get("/Aldo-Lim-Saputra-CV.pdf");
    expect(response.ok()).toBeTruthy();
  } else {
    await expect(link).toHaveCount(0);
  }
});

test("requested viewport widths have no horizontal page overflow", async ({ page }) => {
  for (const width of [320, 360, 390, 430, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    const dimensions = await page.evaluate(() => ({ scroll: document.documentElement.scrollWidth, client: document.documentElement.clientWidth }));
    expect(dimensions.scroll, `homepage should not overflow at ${width}px`).toBeLessThanOrEqual(dimensions.client);
  }
  for (const route of ["/ctf", "/contact", "/projects/hacked-ctf-platform", "/writeups"]) {
    await page.setViewportSize({ width: 320, height: 900 });
    await page.goto(route);
    const dimensions = await page.evaluate(() => ({ scroll: document.documentElement.scrollWidth, client: document.documentElement.clientWidth }));
    expect(dimensions.scroll, `${route} should not overflow at 320px`).toBeLessThanOrEqual(dimensions.client);
  }
});
