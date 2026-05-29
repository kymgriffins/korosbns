import { type FullConfig } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";

async function globalSetup(_config: FullConfig) {
  const personasPath = path.join(__dirname, "personas.json");
  if (!fs.existsSync(personasPath)) {
    console.warn(
      "[E2E global-setup] personas.json not found — skipping seed check.",
    );
    return;
  }
  console.log("[E2E global-setup] personas.json found.");
}

export default globalSetup;
