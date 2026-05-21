import { test, expect } from "@playwright/test";

import { gotoApp } from "../helpers/navigation";
import { loadPersonas } from "../helpers/personas";

const personas = loadPersonas();
const existing = personas.existingCitizen;

test.describe("Epic: Citizen platform", () => {
  test.describe("Persona: Returning citizen (existing account)", () => {
    test.beforeEach(async ({ page }) => {
      await gotoApp(page, "/auth/login");
      await page.getByLabel("Email").fill(existing.email);
      await page.getByLabel("Password").fill(existing.password);
      await page.getByRole("button", { name: /sign in/i }).click();
      await expect(page).toHaveURL(/\/account\/?/, { timeout: 30_000 });
    });

    test.describe("Session & profile", () => {
      test("account dashboard shows profile", async ({ page }) => {
        await expect(page.getByRole("heading", { name: /your account/i })).toBeVisible();
        await expect(page.getByLabel("Display name")).toHaveValue(existing.displayName);
        await expect(page.getByRole("button", { name: /sign out/i })).toBeVisible();
      });

      test("can update display name", async ({ page }) => {
        const field = page.getByLabel("Display name");
        await field.fill(existing.displayName);
        await page.getByRole("button", { name: /save profile/i }).click();
        await expect(page.getByText(/profile updated/i)).toBeVisible({ timeout: 10_000 });
      });

      test("notification history page loads", async ({ page }) => {
        await page.getByRole("main").getByRole("link", { name: /notification history/i }).click();
        await expect(page).toHaveURL(/\/account\/notifications\/?/, { timeout: 15_000 });
        await expect(page.getByRole("heading", { name: /notifications/i })).toBeVisible();
      });
    });

    test.describe("Authenticated engagement", () => {
      test("can browse and open trivia", async ({ page }) => {
        await gotoApp(page, "/trivia");
        const play = page.getByRole("link", { name: "Play" }).first();
        if (!(await play.isVisible({ timeout: 10_000 }).catch(() => false))) {
          test.skip(true, "No trivia seeded");
        }
        await play.click();
        if (await page.getByText(/throttled/i).isVisible({ timeout: 3_000 }).catch(() => false)) {
          test.skip(true, "API rate limited — restart Django with dev settings");
        }
        await expect(page.getByRole("button", { name: /submit answers/i })).toBeVisible({
          timeout: 15_000,
        });
      });

      test("can open surveys while logged in", async ({ page }) => {
        await gotoApp(page, "/surveys");
        const takeSurvey = page.getByRole("link", { name: "Take survey" }).first();
        if (!(await takeSurvey.isVisible({ timeout: 10_000 }).catch(() => false))) {
          test.skip(true, "No surveys seeded");
        }
        await takeSurvey.click();
        await expect(
          page.getByRole("button", { name: /submit survey/i }).or(page.getByText(/thank you/i)),
        ).toBeVisible({ timeout: 15_000 });
      });
    });

    test.describe("Sign out", () => {
      test("logout returns to login", async ({ page }) => {
        await page.getByRole("button", { name: /sign out/i }).click();
        await expect(page).toHaveURL(/\/auth\/login\/?/, { timeout: 15_000 });
        await gotoApp(page, "/account");
        await expect(page).toHaveURL(/\/auth\/login\/?/);
      });
    });
  });
});
