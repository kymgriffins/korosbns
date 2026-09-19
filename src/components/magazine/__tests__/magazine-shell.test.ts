import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { CMS_COLLECTIONS_CATALOG, headlessCmsApi } from "@/lib/headless-cms";

describe("magazine global chrome", () => {
  const shellSource = readFileSync(
    join(process.cwd(), "src/components/magazine/magazine-shell.tsx"),
    "utf8",
  );
  const layoutSource = readFileSync(
    join(process.cwd(), "src/app/(marketing)/layout.tsx"),
    "utf8",
  );

  it("has a dedicated custom CMS singleton", () => {
    expect(CMS_COLLECTIONS_CATALOG["magazine-global"].filePath).toBe(
      "src/content/magazine-global.json",
    );
    expect(headlessCmsApi.getCollectionData("magazine-global")).toMatchObject({
      dispatch: { label: expect.any(String), items: expect.any(Array) },
      masthead: { navigation: expect.any(Array) },
      footer: { partners: expect.any(Array) },
    });
  });

  it("does not reuse legacy site chrome", () => {
    expect(shellSource).not.toMatch(/@\/layouts\/Header/);
    expect(shellSource).not.toMatch(/minimal-footer/);
    expect(shellSource).not.toMatch(/shadcn-space/);
    expect(shellSource).not.toMatch(/social-icons/);
  });

  it("server-loads one CMS document for the full shell", () => {
    expect(layoutSource).toContain("getLiveMagazineGlobalData");
    expect(layoutSource.match(/getLiveMagazineGlobalData\(/g)).toHaveLength(1);
    expect(shellSource).not.toMatch(/fetch\(/);
  });

  it("uses typographic menu controls without icon chrome", () => {
    expect(shellSource).not.toMatch(/lucide-react/);
    expect(shellSource).toMatch(/isOpen \? "Close" : "Menu"/);
    expect(shellSource).toMatch(/aria-current/);
  });
});
