import { test, expect } from "@playwright/test";

const PUBLIC_ROUTES = [
  "/",
  "/about",
  "/analytics",
  "/bns-project",
  "/bns-studio",
  "/budgetnews",
  "/contact",
  "/events",
  "/faq",
  "/learn",
  "/privacy",
  "/programmes",
  "/reports",
  "/security",
  "/surveys",
  "/terms",
  "/weekly-notes",
  "/auth/login",
  "/auth/register",
  "/auth/forgot-password",
];

test.describe("All Pages E2E Smoke & Render Suite", () => {
  for (const route of PUBLIC_ROUTES) {
    test(`route ${route} loads successfully with 200 status`, async ({ page }) => {
      const response = await page.goto(route);
      expect(response?.status()).toBeLessThan(400);
      await expect(page.locator("body")).toBeVisible();
    });
  }
});
