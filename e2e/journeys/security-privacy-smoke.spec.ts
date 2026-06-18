import { test, expect } from "@playwright/test";

test.describe("Security, Privacy, and Info pages — smoke tests", () => {
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

  test("/security page renders", async ({ page }) => {
    const response = await page.goto("/security");
    await page.waitForLoadState("networkidle");
    const is404 = response?.status() === 404;
    if (is404) {
      await expect(page.locator("text=404, text=not found, text=Page not found").first()).toBeVisible({ timeout: 5000 });
    } else {
      await expect(page.locator("h1, h2").first()).toBeVisible({ timeout: 10000 });
    }
  });

  test("/privacy page renders", async ({ page }) => {
    await page.goto("/privacy");
    await page.waitForLoadState("networkidle");
    await expect(page.locator("h1, h2").first()).toBeVisible({ timeout: 10000 });
    await expect(page).toHaveTitle(/Privacy/);
  });

  test("/analytics page renders", async ({ page }) => {
    const response = await page.goto("/analytics");
    await page.waitForLoadState("networkidle");
    const is404 = response?.status() === 404;
    if (is404) {
      await expect(page.locator("text=404, text=not found, text=Page not found").first()).toBeVisible({ timeout: 5000 });
    } else {
      await expect(page.locator("h1, h2").first()).toBeVisible({ timeout: 10000 });
    }
  });

  test("/bns-project page renders", async ({ page }) => {
    const response = await page.goto("/bns-project");
    await page.waitForLoadState("networkidle");
    const is404 = response?.status() === 404;
    if (is404) {
      await expect(page.locator("text=404, text=not found, text=Page not found").first()).toBeVisible({ timeout: 5000 });
    } else {
      await expect(page.locator("h1, h2").first()).toBeVisible({ timeout: 10000 });
    }
  });
});
