import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";

describe("Learn layout chrome (modules-first nav)", () => {
  it("learn layout uses LearnAppShell instead of AppSidebar", () => {
    const layoutPath = join(process.cwd(), "src/app/(marketing)/learn/layout.tsx");
    const src = readFileSync(layoutPath, "utf8");
    expect(src).toMatch(/LearnAppShell/);
    expect(src).not.toMatch(/AppSidebar/);
  });

  it("desktop nav has Modules and no Syllabus label", () => {
    const shellPath = join(process.cwd(), "src/layouts/LearnAppShell.tsx");
    const src = readFileSync(shellPath, "utf8");
    expect(src).toMatch(/label: "Modules"/);
    expect(src).not.toMatch(/label: "Syllabus"/);
  });
});
