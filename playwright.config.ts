import { defineConfig, devices } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";

const personasPath = path.join(__dirname, "e2e", "personas.json");
let baseURL = process.env.E2E_BASE_URL || "http://localhost:3000";
if (fs.existsSync(personasPath)) {
  const personas = JSON.parse(fs.readFileSync(personasPath, "utf8")) as { frontendBase?: string };
  if (personas.frontendBase) baseURL = personas.frontendBase;
}

const djangoDir = path.join(__dirname, "..", "bnske.budgetndiostory.org");
const djangoCmd =
  process.platform === "win32"
    ? `cd /d "${djangoDir}" && set DJANGO_ENV=dev && python manage.py runserver localhost:8000`
    : `cd "${djangoDir}" && DJANGO_ENV=dev python manage.py runserver localhost:8000`;

export default defineConfig({
  testDir: "./e2e/journeys",
  globalSetup: "./e2e/global-setup.ts",
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  timeout: 120_000,
  reporter: [["list"], ["html", { open: "never", outputFolder: "e2e/report" }]],
  use: {
    baseURL,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: process.env.E2E_SKIP_WEBSERVER
    ? undefined
    : [
        {
          command: djangoCmd,
          url: "http://localhost:8000/admin/login/",
          reuseExistingServer: !process.env.CI,
          timeout: 180_000,
          stdout: "pipe",
          stderr: "pipe",
        },
        {
          command: "pnpm run dev",
          url: "http://localhost:3000/surveys/",
          reuseExistingServer: !process.env.CI,
          timeout: 180_000,
          stdout: "pipe",
          stderr: "pipe",
        },
      ],
});
