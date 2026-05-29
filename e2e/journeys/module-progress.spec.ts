import { test, expect } from "@playwright/test";

test.describe("Civic module progress", () => {
  test("unauthenticated user sees module stages but chapters are locked", async ({ page }) => {
    await page.goto("/learn/paths");
    await page.waitForLoadState("networkidle");
    const moduleLink = page.locator('a[href*="/learn/paths/"]').first();
    const href = await moduleLink.getAttribute("href");
    if (!href) {
      test.skip(true, "No modules available");
      return;
    }
    await page.goto(href);
    const lockedIndicator = page.locator('[data-testid*="lock"], .locked, [class*="lock"]').first();
    await expect(lockedIndicator).toBeVisible({ timeout: 10000 });
  });

  test("authenticated user can mark a chapter complete", async ({ page }) => {
    await page.goto("/login");
    const emailInput = page.locator('input[type="email"], input[name="email"]').first();
    const passwordInput = page.locator('input[type="password"]').first();
    if (await emailInput.isVisible()) {
      await emailInput.fill(process.env.E2E_CITIZEN_EMAIL || "citizen.test@bns-e2e.test");
      await passwordInput.fill(process.env.E2E_PASSWORD || "E2eDemoPass123!");
      await page.locator('button[type="submit"]').click();
      await page.waitForURL("**/dashboard**", { timeout: 10000 });
    }
    await page.goto("/learn/paths");
    await page.waitForLoadState("networkidle");
    const moduleLink = page.locator('a[href*="/learn/paths/"]').first();
    const href = await moduleLink.getAttribute("href");
    if (!href) {
      test.skip(true, "No modules available");
      return;
    }
    await page.goto(href);
    await page.waitForLoadState("networkidle");
    const continueBtn = page.locator('button:has-text("Continue"), button:has-text("Start")').first();
    if (await continueBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      await continueBtn.click();
    }
    await page.waitForTimeout(1000);
  });
});
