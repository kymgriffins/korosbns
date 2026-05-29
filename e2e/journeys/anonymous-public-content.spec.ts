import { test, expect } from "@playwright/test";

test.describe("Anonymous user — public content browsing", () => {
  test("can view the learn paths landing page", async ({ page }) => {
    await page.goto("/learn/paths");
    await expect(page.locator("h1, h2").first()).toBeVisible({ timeout: 10000 });
  });

  test("can see a list of civic learning modules", async ({ page }) => {
    await page.goto("/learn/paths");
    await page.waitForLoadState("networkidle");
    await expect(page.locator('[data-testid="module-card"], .module-card, [class*="module"]').first()).toBeVisible({ timeout: 10000 });
  });

  test("can navigate to a module detail page", async ({ page }) => {
    await page.goto("/learn/paths");
    await page.waitForLoadState("networkidle");
    const firstModuleLink = page.locator('a[href*="/learn/paths/"]').first();
    await expect(firstModuleLink).toBeVisible({ timeout: 10000 });
    const href = await firstModuleLink.getAttribute("href");
    if (href) {
      await page.goto(href);
      await expect(page.locator("h1, h2").first()).toBeVisible({ timeout: 10000 });
    }
  });
});
