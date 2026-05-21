import { test, expect } from "@playwright/test";

import { gotoApp } from "../helpers/navigation";
import { loadPersonas } from "../helpers/personas";

const personas = loadPersonas();

test.describe("Epic: Citizen platform", () => {
  test.describe("Persona: Anonymous visitor (not logged in)", () => {
    test.describe("Discovery & shell", () => {
      test("home page loads with branding", async ({ page }) => {
        await gotoApp(page, "/");
        await expect(page).toHaveTitle(/Budget Ndio Story/i);
        await expect(page.getByRole("link", { name: /sign in/i }).first()).toBeVisible();
      });

      test("navbar sections are reachable", async ({ page }) => {
        await gotoApp(page, "/surveys");
        await expect(page.getByRole("heading", { name: /budget surveys/i })).toBeVisible();
        await gotoApp(page, "/trivia");
        await expect(page.getByRole("heading", { name: /budget trivia/i })).toBeVisible();
        await gotoApp(page, "/articles");
        await expect(page).toHaveURL(/\/articles\/?/);
      });
    });

    test.describe("Public content (read-only)", () => {
      test("articles list loads or shows empty state", async ({ page }) => {
        await gotoApp(page, "/articles");
        await expect(page.getByRole("heading", { name: "Articles" })).toBeVisible();
        const error = page.locator("text=Could not load");
        const empty = page.getByText(/no published articles/i);
        const card = page.locator("a[href*='/articles/']").first();
        await expect(error.or(empty).or(card)).toBeVisible({ timeout: 15_000 });
      });

      test("knowledge hub list loads", async ({ page }) => {
        await gotoApp(page, "/knowledge");
        await expect(page.getByRole("heading", { name: /knowledge hub/i })).toBeVisible();
      });

      test("events list loads", async ({ page }) => {
        await gotoApp(page, "/events");
        await expect(page.getByRole("heading", { name: "Events" })).toBeVisible();
      });

      test("learn hub loads", async ({ page }) => {
        await gotoApp(page, "/learn");
        await expect(page).toHaveURL(/\/learn\/?/);
      });
    });

    test.describe("Engagement without account", () => {
      test("can open surveys index", async ({ page }) => {
        await gotoApp(page, "/surveys");
        await expect(page.getByRole("heading", { name: /budget surveys/i })).toBeVisible({
          timeout: 15_000,
        });
      });

      test("trivia prompts sign-in to play", async ({ page }) => {
        await gotoApp(page, "/trivia");
        const play = page.getByRole("link", { name: "Play" }).first();
        if (!(await play.isVisible({ timeout: 10_000 }).catch(() => false))) {
          test.skip(true, "No trivia published — seed engagement_trivia on API");
        }
        await play.click();
        await expect(
          page.getByRole("link", { name: /sign in to play/i }).or(
            page.getByRole("button", { name: /sign in to play/i }),
          ),
        ).toBeVisible({ timeout: 15_000 });
      });
    });

    test.describe("Account protection", () => {
      test("redirects away from account when not logged in", async ({ page }) => {
        await gotoApp(page, "/account");
        await expect(page).toHaveURL(/\/auth\/login\/?/, { timeout: 20_000 });
        await expect(page.getByRole("heading", { name: /sign in/i })).toBeVisible();
      });
    });
  });
});
