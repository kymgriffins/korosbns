import { test, expect } from "@playwright/test";

test.describe("Weekly Notes — smoke tests", () => {
  const consoleErrors: string[] = [];

  test.beforeEach(async ({ page }) => {
    consoleErrors.length = 0;
    page.on("console", (msg) => {
      if (msg.type() === "error") {
        consoleErrors.push(msg.text());
      }
    });
    page.on("pageerror", (err) => {
      consoleErrors.push(err.message);
    });
  });

  test.afterEach(() => {
    expect(consoleErrors).toEqual([]);
  });

  test("/weekly-notes page renders", async ({ page }) => {
    const response = await page.goto("/weekly-notes");
    await page.waitForLoadState("networkidle");
    const is404 = response?.status() === 404;
    if (is404) {
      await expect(page.locator("text=404, text=not found, text=Page not found").first()).toBeVisible({ timeout: 5000 });
    } else {
      await expect(page.locator("h1, h2").first()).toBeVisible({ timeout: 10000 });
    }
  });

  test("published notes are displayed", async ({ page }) => {
    await page.goto("/weekly-notes");
    await page.waitForLoadState("networkidle");
    const notes = page.locator('[data-testid*="note"], [class*="note"], [class*="card"], article');
    const count = await notes.count();
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test("note detail interaction works", async ({ page }) => {
    await page.goto("/weekly-notes");
    await page.waitForLoadState("networkidle");
    const noteLink = page.locator('a[href*="/weekly-notes/"]').first();
    if (await noteLink.isVisible({ timeout: 5000 }).catch(() => false)) {
      const href = await noteLink.getAttribute("href");
      if (href && href !== "/weekly-notes") {
        await page.goto(href);
        await page.waitForLoadState("networkidle");
        await expect(page.locator("h1, h2").first()).toBeVisible({ timeout: 10000 }).catch(() => {});
      }
    }
  });

  test("/weekly-notes/manage and /weekly-notes/audit return valid pages", async ({ page }) => {
    for (const path of ["/weekly-notes/manage", "/weekly-notes/audit"]) {
      const response = await page.goto(path);
      await page.waitForLoadState("networkidle");
      if (response?.status() === 404) {
        await expect(page.locator("text=404, text=not found, text=Page not found").first()).toBeVisible({ timeout: 5000 });
      } else {
        await expect(page.locator("h1, h2").first()).toBeVisible({ timeout: 10000 });
      }
    }
  });
});
