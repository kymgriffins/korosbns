import { describe, it, expect } from "vitest";
import { FLAGSHIP_PROJECT_ID, projectsData } from "@/data/projects";
import featuredSeeds from "@/data/fallbacks/featured-projects.json";
import { HELP_FAQS } from "@/data/help-faq-data";
import { SOVEREIGN_TICKER_ITEMS } from "@/components/programmes/programmes-sovereign-ticker";
import { readFileSync } from "node:fs";
import { join } from "node:path";

describe("projectsData featured deep-link fidelity", () => {
  it("resolves featured-only UON seed story-mty40jp1 (not studios-evidence)", () => {
    const project = projectsData.getById("story-mty40jp1");
    expect(project).toBeDefined();
    expect(project?.id).toBe("story-mty40jp1");
    expect(project?.slug).toBe("story-mty40jp1");
    expect(project?.title.toLowerCase()).toContain("uon");
    expect(project?.href).toContain("story-mty40jp1");
    expect(project?.prose?.length).toBeGreaterThan(40);
    expect(project?.wysiwygProse?.length).toBeGreaterThan(40);
  });

  it("resolves every featured-projects.json id via getById", () => {
    for (const seed of featuredSeeds.results) {
      const found = projectsData.getById(seed.id) || projectsData.getById(seed.slug);
      expect(found, `missing featured id ${seed.id}`).toBeDefined();
      expect(found?.id === seed.id || found?.slug === seed.slug).toBe(true);
    }
  });

  it("exports a concrete flagship id present in the store", () => {
    expect(FLAGSHIP_PROJECT_ID).toBeTruthy();
    expect(projectsData.getById(FLAGSHIP_PROJECT_ID)).toBeDefined();
  });

  it("does not treat unknown ids as featured (caller must not dump to programmes)", () => {
    expect(projectsData.getById("definitely-not-a-project-xyz")).toBeUndefined();
    // Featured UON remains resolvable — regression guard for prior redirect bug
    expect(projectsData.getById("story-mty40jp1")).toBeDefined();
  });
});

describe("marketing public surfaces never promote /learn", () => {
  it("FAQ actionLinks never point at /learn", () => {
    for (const faq of HELP_FAQS) {
      const href = faq.actionLink?.href;
      if (!href) continue;
      expect(href.startsWith("/learn"), `${faq.id} → ${href}`).toBe(false);
    }
  });

  it("programmes sovereign ticker never links to /learn", () => {
    for (const item of SOVEREIGN_TICKER_ITEMS) {
      expect(item.href.startsWith("/learn"), item.topic).toBe(false);
    }
  });

  it("BNSProjectClient Budget Literacy CTA points at UON project detail", () => {
    const src = readFileSync(
      join(process.cwd(), "src/components/project/BNSProjectClient.tsx"),
      "utf8",
    );
    expect(src).toContain('href: "/bns-project/story-mty40jp1"');
    expect(src).not.toMatch(/id:\s*"budget-literacy"[\s\S]*?href:\s*"\/learn"/);
  });

  it("programmes-latest-content and reports bulletin CTAs avoid /learn", () => {
    const latest = readFileSync(
      join(process.cwd(), "src/components/programmes/programmes-latest-content.tsx"),
      "utf8",
    );
    const hub = readFileSync(
      join(process.cwd(), "src/components/reports-bulletin/reports-hub-client.tsx"),
      "utf8",
    );
    const archive = readFileSync(
      join(process.cwd(), "src/components/reports-bulletin/report-library-archive.tsx"),
      "utf8",
    );
    expect(latest).not.toMatch(/href:\s*"\/learn"/);
    expect(hub).not.toMatch(/ctaHref="\/learn"/);
    expect(archive).not.toMatch(/href="\/learn/);
  });

  it("landing hero secondary CTA is not bare /bns-project dump", () => {
    const hero = JSON.parse(
      readFileSync(join(process.cwd(), "src/content/landing-hero.json"), "utf8"),
    ) as { secondaryCta?: { href?: string } };
    expect(hero.secondaryCta?.href).toBeTruthy();
    expect(hero.secondaryCta?.href).not.toBe("/bns-project");
    expect(hero.secondaryCta?.href?.startsWith("/learn")).toBe(false);
  });

  it("CMS redirects send /bns-project to /projects index, not programmes", () => {
    const redirects = JSON.parse(
      readFileSync(join(process.cwd(), "src/content/redirects.json"), "utf8"),
    ) as { redirects: Array<{ from: string; to: string }> };
    const entry = redirects.redirects.find((r) => r.from === "/bns-project");
    expect(entry?.to).toBe("/projects/");
    expect(entry?.to).not.toContain("programmes");
  });

  it("CMS redirects and next.config send /learn to /projects, hiding it from users", () => {
    const redirects = JSON.parse(
      readFileSync(join(process.cwd(), "src/content/redirects.json"), "utf8"),
    ) as { redirects: Array<{ from: string; to: string }> };
    const learnRedirect = redirects.redirects.find((r) => r.from === "/learn");
    expect(learnRedirect?.to).toBe("/projects/");

    const nextConfig = readFileSync(join(process.cwd(), "next.config.ts"), "utf8");
    expect(nextConfig).toMatch(/source:\s*["']\/learn["'][\s\S]*?destination:\s*["']\/projects["']/);
  });

  it("sitemap never exposes any /learn routes", () => {
    const sitemapSrc = readFileSync(join(process.cwd(), "src/app/sitemap.ts"), "utf8");
    expect(sitemapSrc).not.toMatch(/path:\s*["']\/learn/);
    expect(sitemapSrc).not.toMatch(/canonicalUrl\(`\/learn/);
  });

  it("featured projects fallback links strictly to project details, never /learn", () => {
    for (const seed of featuredSeeds.results) {
      expect(seed.href).toBeTruthy();
      expect(seed.href.startsWith("/learn")).toBe(false);
      expect(seed.href.startsWith("/projects/") || seed.href.startsWith("/bns-project/")).toBe(true);
    }
  });
});

