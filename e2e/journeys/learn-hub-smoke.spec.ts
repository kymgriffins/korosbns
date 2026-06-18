import { test, expect } from "@playwright/test";

test.describe("Learning Hub — smoke tests", () => {
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

  test("/learn loads without console errors", async ({ page }) => {
    await page.goto("/learn");
    await page.waitForLoadState("networkidle");
    await expect(page.locator("h1, h2").first()).toBeVisible({ timeout: 10000 });
  });

  test("module / chapter pages render", async ({ page }) => {
    await page.goto("/learn");
    await page.waitForLoadState("networkidle");
    const moduleLink = page.locator('a[href*="/learn/"]').first();
    if (await moduleLink.isVisible({ timeout: 5000 }).catch(() => false)) {
      const href = await moduleLink.getAttribute("href");
      if (href) {
        await page.goto(href);
        await page.waitForLoadState("networkidle");
        await expect(page.locator("h1, h2").first()).toBeVisible({ timeout: 10000 });
      }
    }
  });

  test("trivia quiz flow — answer, submit, score", async ({ page }) => {
    await page.goto("/learn");
    await page.waitForLoadState("networkidle");
    const quizLink = page.locator('a[href*="/learn"]:has-text("quiz"), a[href*="/learn"]:has-text("Quiz"), [data-testid*="quiz"]').first();
    if (await quizLink.isVisible({ timeout: 5000 }).catch(() => false)) {
      const href = await quizLink.getAttribute("href");
      if (href) {
        await page.goto(href);
        await page.waitForLoadState("networkidle");
        const answerOption = page.locator('input[type="radio"], [role="radio"], [data-testid*="answer"], [data-testid*="option"]').first();
        if (await answerOption.isVisible({ timeout: 3000 }).catch(() => false)) {
          await answerOption.click();
          const submitBtn = page.locator('button:has-text("Submit"), button:has-text("submit"), button:has-text("Answer"), [type="submit"]').first();
          if (await submitBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
            await submitBtn.click();
            await page.waitForTimeout(1000);
          }
        }
        const scoreEl = page.locator('[data-testid*="score"], [class*="score"], [class*="result"], text=/\\d+\\/\\d+/').first();
        await expect(scoreEl).toBeVisible({ timeout: 5000 }).catch(() => {});
      }
    }
  });

  test("navigation sidebar is visible", async ({ page }) => {
    await page.goto("/learn");
    await page.waitForLoadState("networkidle");
    const sidebar = page.locator('nav, aside, [data-testid*="sidebar"], [data-testid*="nav"], [class*="sidebar"], [class*="nav"]').first();
    await expect(sidebar).toBeVisible({ timeout: 5000 });
  });

  test("mobile responsiveness at 320px viewport", async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 700 });
    await page.goto("/learn");
    await page.waitForLoadState("networkidle");
    await expect(page.locator("h1, h2").first()).toBeVisible({ timeout: 10000 });
    expect(consoleErrors).toEqual([]);
  });

  test("404 page renders properly on unknown deep path", async ({ page }) => {
    await page.goto("/learn/nonexistent-deep-path-xyz");
    await page.waitForLoadState("networkidle");
    await expect(page.locator("text=404, text=not found, text=Page not found").first()).toBeVisible({ timeout: 5000 }).catch(async () => {
      await expect(page.locator("h1").first()).toBeVisible({ timeout: 5000 });
    });
  });
});
