import fs from "node:fs";
import path from "node:path";

const API_READY = "http://localhost:8000/admin/login/";
const FRONT_SURVEYS = "http://localhost:3000/surveys/";

async function assertReachable(url: string, label: string): Promise<void> {
  const res = await fetch(url, { redirect: "follow" });
  if (!res.ok) {
    throw new Error(
      `${label} returned HTTP ${res.status} for ${url}. ` +
        "Start Django on :8000 and Next on :3000 (or let Playwright webServer start them).",
    );
  }
}

export default async function globalSetup(): Promise<void> {
  const envLocal = path.join(__dirname, "..", ".env.local");
  if (!fs.existsSync(envLocal)) {
    console.warn(
      "[e2e] No .env.local — copy .env.local.example and set NEXT_PUBLIC_API_BASE_URL=http://localhost:8000",
    );
  }

  try {
    await assertReachable(API_READY, "Django API");
    await assertReachable(FRONT_SURVEYS, "Next citizen app");
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    throw new Error(`${message}\nRun: pnpm run e2e:prepare  then  pnpm run test:e2e`);
  }

  const body = await fetch(FRONT_SURVEYS).then((r) => r.text());
  if (body.includes("Page not found") && !body.includes("Budget Surveys")) {
    throw new Error(
      `${FRONT_SURVEYS} shows the app 404 page — use "pnpm run dev" (not an old "next start" build).`,
    );
  }
}
