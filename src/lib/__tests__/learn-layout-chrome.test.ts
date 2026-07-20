import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";

describe("Learn layout chrome (P1 syllabus nav)", () => {
  it("learn layout uses CitizenSyllabusShell instead of AppSidebar", () => {
    const layoutPath = join(process.cwd(), "src/app/(marketing)/learn/layout.tsx");
    const src = readFileSync(layoutPath, "utf8");
    expect(src).toMatch(/CitizenSyllabusShell/);
    expect(src).not.toMatch(/AppSidebar/);
  });
});
