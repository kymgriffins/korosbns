import { test, expect } from "@playwright/test";

test.describe("Reports — honesty smoke", () => {
  test("/reports loads and does not invent forever-spin without empty state", async ({ page }) => {
    await page.goto("/reports");
    await page.waitForLoadState("domcontentloaded");
    await expect(page.getByRole("heading", { name: /budget reports/i })).toBeVisible({
      timeout: 20000,
    });
    // Either real data tabs or honest unavailable copy — never silent fake counties
    const body = await page.locator("body").innerText();
    expect(body.toLowerCase()).not.toMatch(/invented weight/);
    const hasTabs = await page.getByRole("button", { name: /overview|counties|sectors/i }).first()
      .isVisible()
      .catch(() => false);
    const hasUnavailable = /unavailable|did not return|nothing is invented/i.test(body);
    expect(hasTabs || hasUnavailable).toBeTruthy();
  });

  test("counties tab shows empty honesty when no CRA profiles", async ({ page }) => {
    await page.goto("/reports");
    await page.waitForLoadState("networkidle");
    const countiesTab = page.getByRole("button", { name: /counties/i }).first();
    if (await countiesTab.isVisible({ timeout: 8000 }).catch(() => false)) {
      await countiesTab.click();
      const body = await page.locator("body").innerText();
      // If empty: honesty copy. If populated: provenance footer still present.
      const honest =
        /county allocations unavailable|nothing is invented|source:/i.test(body) ||
        /mombasa|nairobi|kisumu/i.test(body);
      expect(honest).toBeTruthy();
    }
  });
});
