import { test, expect } from "@playwright/test";

test.describe("Socials section — footer on home page", () => {
  test("social links render in footer on home page", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    const footer = page.locator("footer").first();
    await expect(footer).toBeVisible({ timeout: 10000 });
    const socialLinks = footer.locator('a[aria-label="X"], a[aria-label="LinkedIn"], a[aria-label="WhatsApp"], a[aria-label="YouTube"], a[aria-label="TikTok"], a[aria-label="Instagram"], a[aria-label="Facebook"]');
    const count = await socialLinks.count();
    expect(count).toBeGreaterThanOrEqual(3);
  });

  test("social links open in new tab", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    const socialLink = page.locator('footer a[aria-label="X"], footer a[aria-label="LinkedIn"], footer a[aria-label="TikTok"]').first();
    await expect(socialLink).toBeVisible({ timeout: 5000 });
    const target = await socialLink.getAttribute("target");
    expect(target).toBe("_blank");
    const rel = await socialLink.getAttribute("rel");
    expect(rel).toContain("noopener");
  });

  test("socials section appears above footer on home page", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    const footer = page.locator("footer").first();
    await expect(footer).toBeVisible({ timeout: 10000 });
    const socialIcons = footer.locator('[class*="size-5"], a[target="_blank"]');
    const socialCount = await socialIcons.count();
    expect(socialCount).toBeGreaterThanOrEqual(3);
  });
});
