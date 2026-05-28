import { test, expect } from "@playwright/test";

test.describe("Anonymous learn journey", () => {
  test("guest can onboard and reach civic dashboard", async ({ page }) => {
    await page.goto("/learn/");

    await expect(page.getByText("Citizen Learn Hub")).toBeVisible();
    await page.getByRole("button", { name: /Continue as Anonymous User/i }).click();

    await expect(page.getByText("Welcome, Citizen")).toBeVisible();
    await page.getByRole("button", { name: /Female/i }).click();

    const nameButtons = page.locator("button.font-mono.font-bold");
    await expect(nameButtons.first()).toBeVisible();
    const firstName = await nameButtons.first().textContent();
    const secondName = await nameButtons.nth(1).textContent();
    expect(firstName).not.toBe(secondName);

    await nameButtons.first().click();
    await page.getByRole("checkbox", { name: /Data Protection Consent/i }).click();
    await page.getByRole("button", { name: /Enter Learn Hub/i }).click();

    await expect(page.getByRole("button", { name: /Resume Learning/i })).toBeVisible({
      timeout: 15_000,
    });
  });

  test("guest can open learn profile route without login redirect", async ({ page }) => {
    await page.goto("/learn/profile/");
    await expect(page).toHaveURL(/\/learn\/profile\/?$/);
    await expect(page.getByRole("heading", { name: /Learner profile/i })).toBeVisible();
  });
});
