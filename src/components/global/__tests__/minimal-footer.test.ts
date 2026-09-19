import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";

describe("MinimalFooter partner chrome", () => {
  const src = readFileSync(
    join(process.cwd(), "src/components/global/minimal-footer.tsx"),
    "utf8",
  );

  it("keeps partner-facing destinations", () => {
    expect(src).toMatch(/label:\s*"Programmes"/);
    expect(src).toMatch(/label:\s*"About"/);
    expect(src).toMatch(/label:\s*"Studios"/);
    expect(src).toMatch(/label:\s*"Contact"/);
    expect(src).toMatch(/href:\s*"\/bns-studio"/);
  });

  it("does not expose Learn or Reports as capture paths", () => {
    expect(src).not.toMatch(/href:\s*"\/learn"/);
    expect(src).not.toMatch(/href:\s*"\/reports"/);
    expect(src).not.toMatch(/label:\s*"Learn"/);
    expect(src).not.toMatch(/label:\s*"Reports"/);
  });

  it("marks extra nav and socials for editorial mobile collapse", () => {
    expect(src).toMatch(/data-footer-nav-extra/);
    expect(src).toMatch(/data-footer-social/);
    expect(src).toMatch(/data-footer-blurb/);
    expect(src).toMatch(/data-editorial-footer/);
  });
});
