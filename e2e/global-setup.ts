import type { FullConfig } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";

export default async function globalSetup(_config: FullConfig) {
  const personasPath = path.join(__dirname, "personas.json");
  if (!fs.existsSync(personasPath)) {
    fs.writeFileSync(
      personasPath,
      JSON.stringify({ frontendBase: "http://localhost:3000" }, null, 2),
    );
  }
}
