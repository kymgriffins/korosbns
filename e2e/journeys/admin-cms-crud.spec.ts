import { test, expect } from "@playwright/test";

const ADMIN_EMAIL = process.env.E2E_ADMIN_EMAIL || "info@budgetndiostory.org";
const ADMIN_PASSWORD = process.env.E2E_ADMIN_PASSWORD || "StrongPass123!";

test.describe("Admin CMS — civic module CRUD", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/dashboard/");
    await page.waitForLoadState("networkidle");
    const emailInput = page.locator('input[type="email"], input[name="email"]').first();
    const passwordInput = page.locator('input[type="password"]').first();
    if (await emailInput.isVisible({ timeout: 3000 }).catch(() => false)) {
      await emailInput.fill(ADMIN_EMAIL);
      await passwordInput.fill(ADMIN_PASSWORD);
      await page.locator('button[type="submit"]').click();
      await page.waitForURL("**/dashboard/**", { timeout: 10000 });
    }
    await page.goto("/dashboard/civic-modules/");
    await page.waitForLoadState("networkidle");
  });

  test("can list civic modules", async ({ page }) => {
    await expect(page.locator("h1, h2, .card__title").first()).toBeVisible({ timeout: 10000 });
  });

  test("can create and delete a module", async ({ page }) => {
    await page.goto("/dashboard/civic-modules/create/");
    await page.waitForLoadState("networkidle");
    const titleInput = page.locator('#title, input[name="title"]').first();
    await expect(titleInput).toBeVisible({ timeout: 10000 });
    await titleInput.fill("E2E Test Module");
    const slugInput = page.locator('#slug, input[name="slug"]').first();
    await slugInput.fill("e2e-test-module");
    const descInput = page.locator('#description, textarea[name="description"]').first();
    await descInput.fill("Created during E2E test");
    await page.locator('button[type="submit"]').first().click();

    await page.waitForURL("**/civic-modules/**", { timeout: 10000 });
    await page.goto("/dashboard/civic-modules/");
    await page.waitForLoadState("networkidle");
    await expect(page.locator("text=E2E Test Module").first()).toBeVisible({ timeout: 5000 });

    const deleteForm = page.locator('form[action*="delete"]').first();
    page.on("dialog", (dialog) => dialog.accept());
    await deleteForm.locator('button[type="submit"]').click();
    await page.waitForLoadState("networkidle");
  });

  test("can preview a module", async ({ page }) => {
    const previewLink = page.locator('a:has-text("Preview")').first();
    if (await previewLink.isVisible({ timeout: 3000 }).catch(() => false)) {
      await previewLink.click();
      await page.waitForLoadState("networkidle");
      await expect(page.locator("h1, h2").first()).toBeVisible({ timeout: 10000 });
    }
  });
});
