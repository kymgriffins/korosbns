import { describe, it, expect, vi } from "vitest";
import { buildPageMetadata } from "@/utils/page-metadata";

vi.mock("@/lib/api-client", () => ({
  citizenApi: {
    getArticles: vi.fn().mockResolvedValue({ results: [] }),
    getStories: vi.fn().mockResolvedValue({ results: [] }),
  },
}));

vi.mock("@/data/learning", () => ({
  learningData: {
    modules: { fetch: vi.fn().mockResolvedValue([]) },
  },
}));

vi.mock("@/data/org", () => ({
  team: [],
}));

vi.mock("@/utils/metadata", () => ({
  metaDescription: (d: string) => d.slice(0, 160),
  canonicalUrl: (path: string) => `https://budgetndiostory.org${path.startsWith("/") ? path : `/${path}`}`,
}));

describe("Studio SEO & Commercial Indexing (P0 Priority)", () => {
  it("sitemap lists /bns-studio with 1.0 priority and weekly frequency", async () => {
    const { default: sitemap } = await import("@/app/sitemap");
    const entries = await sitemap();
    const studioEntry = entries.find((e) => e.url === "https://budgetndiostory.org/bns-studio");
    expect(studioEntry).toBeDefined();
    expect(studioEntry?.priority).toBe(1.0);
    expect(studioEntry?.changeFrequency).toBe("weekly");
  });

  it("sitemap lists /bns-studio/work and /work with 0.95 priority", async () => {
    const { default: sitemap } = await import("@/app/sitemap");
    const entries = await sitemap();
    const studioWork = entries.find((e) => e.url === "https://budgetndiostory.org/bns-studio/work");
    const unifiedWork = entries.find((e) => e.url === "https://budgetndiostory.org/work");
    expect(studioWork).toBeDefined();
    expect(studioWork?.priority).toBe(0.95);
    expect(unifiedWork).toBeDefined();
    expect(unifiedWork?.priority).toBe(0.95);
  });

  it("sitemap lists all verified studio project dossiers with >= 0.85 priority", async () => {
    const { default: sitemap } = await import("@/app/sitemap");
    const entries = await sitemap();
    const urls = entries.map((e) => e.url);

    expect(urls).toContain("https://budgetndiostory.org/bns-studio/budget-sasa-ni-delivery-explainer");
    expect(urls).toContain("https://budgetndiostory.org/bns-studio/budget-ndio-story-podcast");
    expect(urls).toContain("https://budgetndiostory.org/bns-studio/nakuru-citizen-baraza");
    expect(urls).toContain("https://budgetndiostory.org/bns-studio/finance-bill-motion-explainer");
    expect(urls).toContain("https://budgetndiostory.org/bns-studio/mashinani-field-documentary");

    const podcastProject = entries.find(
      (e) => e.url === "https://budgetndiostory.org/bns-studio/budget-ndio-story-podcast",
    );
    expect(podcastProject?.priority).toBe(0.85);
    expect(podcastProject?.changeFrequency).toBe("weekly");
  });

  it("sitemap includes the 8 format corridor query routes", async () => {
    const { default: sitemap } = await import("@/app/sitemap");
    const entries = await sitemap();
    const urls = entries.map((e) => e.url);

    expect(urls).toContain("https://budgetndiostory.org/bns-studio/work?format=Podcast%20%26%20Audio");
    expect(urls).toContain("https://budgetndiostory.org/bns-studio/work?format=Animations");
    expect(urls).toContain("https://budgetndiostory.org/bns-studio/work?format=Explainer%20Videos");
    expect(urls).toContain("https://budgetndiostory.org/bns-studio/work?format=Documentaries");
  });

  it("robots.ts allows AI search crawlers on public studio pages while protecting private routes", async () => {
    const { default: robots } = await import("@/app/robots");
    const config = robots();
    const rules = Array.isArray(config.rules) ? config.rules : [config.rules];

    const aiRule = rules.find((r) => Array.isArray(r.userAgent) && r.userAgent.includes("GPTBot"));
    expect(aiRule).toBeDefined();
    expect(aiRule?.allow).toBe("/");
    expect(aiRule?.disallow).toContain("/auth/");
    expect(aiRule?.disallow).toContain("/admin/");
  });

  it("buildPageMetadata merges custom keywords and uses high-res raster og-image", () => {
    const meta = buildPageMetadata({
      title: "Commercial Film Production",
      description: "Elite civic documentary filmmaking in Kenya.",
      path: "/bns-studio",
      keywords: ["custom keyword 1", "custom keyword 2"],
    });

    expect(meta.title).toBe("Commercial Film Production");
    expect(meta.keywords).toContain("custom keyword 1");
    expect(meta.keywords).toContain("video production company Nairobi");
    expect(meta.keywords).toContain("podcast studio Kenya");
    expect(meta.openGraph?.images).toBeDefined();
    const ogImg = (meta.openGraph?.images as any[])?.[0];
    expect(ogImg?.url).toBe("/og-image.jpg");
  });
});
