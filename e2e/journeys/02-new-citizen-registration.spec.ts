import { test, expect } from "@playwright/test";

import { fetchVerificationToken } from "../helpers/api";
import { gotoApp } from "../helpers/navigation";
import { loadPersonas, uniqueNewEmail } from "../helpers/personas";

const personas = loadPersonas();

test.describe.configure({ mode: "serial" });

test.describe("Epic: Citizen platform", () => {
  test.describe("Persona: New citizen (registers today)", () => {
    const newEmail = uniqueNewEmail(personas);
    const password = personas.newCitizen.password;

    test.describe("Registration funnel", () => {
      test("registration form accepts new email", async ({ page }) => {
        await gotoApp(page, "/auth/register");
        await expect(page.getByRole("heading", { name: /create account/i })).toBeVisible();

        await page.getByLabel("First name").fill(personas.newCitizen.firstName);
        await page.getByLabel("Last name").fill(personas.newCitizen.lastName);
        await page.getByLabel("Email").fill(newEmail);
        await page.getByLabel("Password").fill(password);
        await page.getByRole("button", { name: /create account/i }).click();

        await expect(page.getByRole("heading", { name: /check your email/i })).toBeVisible({
          timeout: 20_000,
        });
        await expect(page.getByText(newEmail)).toBeVisible();
      });

      test("email verification activates account", async ({ page }) => {
        const token = fetchVerificationToken(newEmail, personas);
        await gotoApp(page, `/auth/verify?token=${encodeURIComponent(token)}`);
        await expect(page.getByText(/email verified/i)).toBeVisible({
          timeout: 20_000,
        });
      });

      test("can sign in after verification", async ({ page }) => {
        await gotoApp(page, "/auth/login");
        await page.getByLabel("Email").fill(newEmail);
        await page.getByLabel("Password").fill(password);
        await page.getByRole("button", { name: /sign in/i }).click();

        await expect(page).toHaveURL(/\/account\/?/, { timeout: 20_000 });
        await expect(page.getByRole("heading", { name: /your account/i })).toBeVisible();
      });
    });

    test.describe("First session capabilities", () => {
      test("account page shows email and profile form", async ({ page }) => {
        await gotoApp(page, "/auth/login");
        await page.getByLabel("Email").fill(newEmail);
        await page.getByLabel("Password").fill(password);
        await page.getByRole("button", { name: /sign in/i }).click();
        await expect(page).toHaveURL(/\/account\/?/);

        await expect(page.getByRole("heading", { name: /your account/i })).toBeVisible();
        await expect(page.getByLabel("First name")).toHaveValue(personas.newCitizen.firstName);
      });
    });
  });
});
