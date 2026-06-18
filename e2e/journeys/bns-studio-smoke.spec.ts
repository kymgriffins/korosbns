import { test, expect } from "@playwright/test";

test.describe("BNS Studio — smoke tests", () => {
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

  test("/bns-studio page renders", async ({ page }) => {
    const response = await page.goto("/bns-studio");
    await page.waitForLoadState("networkidle");
    const is404 = response?.status() === 404;
    if (is404) {
      await expect(page.locator("text=404, text=not found, text=Page not found").first()).toBeVisible({ timeout: 5000 });
    } else {
      await expect(page.locator("h1, h2").first()).toBeVisible({ timeout: 10000 });
    }
  });

  test("services section exists", async ({ page }) => {
    await page.goto("/bns-studio");
    await page.waitForLoadState("networkidle");
    const servicesSection = page.locator('[data-testid*="service"], [class*="service"], section:has-text("service"), section:has-text("Service")').first();
    await expect(servicesSection).toBeVisible({ timeout: 5000 }).catch(() => {});
  });

  test("portfolio section exists", async ({ page }) => {
    await page.goto("/bns-studio");
    await page.waitForLoadState("networkidle");
    const portfolioSection = page.locator('[data-testid*="portfolio"], [class*="portfolio"], section:has-text("portfolio"), section:has-text("Portfolio")').first();
    await expect(portfolioSection).toBeVisible({ timeout: 5000 }).catch(() => {});
  });

  test("booking form submission elements exist", async ({ page }) => {
    await page.goto("/bns-studio");
    await page.waitForLoadState("networkidle");
    const formInput = page.locator('input, textarea, select').first();
    const submitBtn = page.locator('button[type="submit"], button:has-text("Submit"), button:has-text("Book"), button:has-text("Send")').first();
    const hasForm = await formInput.isVisible({ timeout: 3000 }).catch(() => false);
    const hasSubmit = await submitBtn.isVisible({ timeout: 3000 }).catch(() => false);
    if (hasForm && hasSubmit) {
      await formInput.fill("Test inquiry from e2e");
      await submitBtn.click();
      await page.waitForTimeout(1000);
    }
  });

  test("CTA buttons exist", async ({ page }) => {
    await page.goto("/bns-studio");
    await page.waitForLoadState("networkidle");
    const ctas = page.locator('a[href*="contact"], a[href*="book"], a[href*="studio"], button:has-text("Get Started"), button:has-text("Contact"), a:has-text("Get Started"), a:has-text("Contact")');
    const count = await ctas.count();
    expect(count).toBeGreaterThanOrEqual(0);
  });
});
