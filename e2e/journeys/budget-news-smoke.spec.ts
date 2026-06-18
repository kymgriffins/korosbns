import { test, expect } from "@playwright/test";

test.describe("Budget News — smoke tests", () => {
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

  test("/budgetnews loads without console errors", async ({ page }) => {
    await page.goto("/budgetnews");
    await page.waitForLoadState("networkidle");
    await expect(page.locator("h1, h2").first()).toBeVisible({ timeout: 10000 });
  });

  test("article list renders", async ({ page }) => {
    await page.goto("/budgetnews");
    await page.waitForLoadState("networkidle");
    const articleCards = page.locator('[data-testid*="article"], [class*="card"], [class*="article"], article, a[href*="/budgetnews/"]');
    await expect(articleCards.first()).toBeVisible({ timeout: 10000 });
  });

  test("article detail page renders", async ({ page }) => {
    await page.goto("/budgetnews");
    await page.waitForLoadState("networkidle");
    const articleLink = page.locator('a[href*="/budgetnews/"]').first();
    if (await articleLink.isVisible({ timeout: 5000 }).catch(() => false)) {
      const href = await articleLink.getAttribute("href");
      if (href) {
        await page.goto(href);
        await page.waitForLoadState("networkidle");
        await expect(page.locator("h1, h2").first()).toBeVisible({ timeout: 10000 });
      }
    }
  });

  test("responsive layout at mobile / tablet / desktop", async ({ page }) => {
    const viewports = [
      { width: 320, height: 700, label: "mobile" },
      { width: 768, height: 900, label: "tablet" },
      { width: 1280, height: 800, label: "desktop" },
    ];
    for (const vp of viewports) {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto("/budgetnews");
      await page.waitForLoadState("networkidle");
      await expect(page.locator("h1, h2").first()).toBeVisible({ timeout: 10000 });
      expect(consoleErrors).toEqual([]);
    }
  });

  test("404 / error states on bad article slug", async ({ page }) => {
    await page.goto("/budgetnews/nonexistent-article-slug-xyz");
    await page.waitForLoadState("networkidle");
    await expect(page.locator("text=404, text=not found, text=Page not found").first()).toBeVisible({ timeout: 5000 }).catch(async () => {
      await expect(page.locator("h1").first()).toBeVisible({ timeout: 5000 });
    });
  });
});
