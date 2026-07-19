import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";

describe("learn units route (P1 dead-route fix)", () => {
  it("next.config no longer hard-redirects /learn/units to /learn/", () => {
    const configPath = join(process.cwd(), "next.config.ts");
    const src = readFileSync(configPath, "utf8");
    expect(src).not.toMatch(/source:\s*["']\/learn\/units\/:path\*/);
  });
});
