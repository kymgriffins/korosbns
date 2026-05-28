import { test, expect } from "@playwright/test";

test.describe("Authenticated learn profile", () => {
  test("login page remains accessible for guests", async ({ page }) => {
    await page.goto("/auth/login/?next=%2Flearn%2Fquests%2F");
    await expect(page.getByRole("heading", { name: /sign in|log in|login/i })).toBeVisible();
  });
});
