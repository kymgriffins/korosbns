import { describe, it, expect, vi } from "vitest";

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
  canonicalUrl: (path: string) => `https://budgetndiostory.org${path}`,
}));

describe("sitemap includes /reports (P0 SEO)", () => {
  it("lists /reports among static routes", async () => {
    const { default: sitemap } = await import("@/app/sitemap");
    const entries = await sitemap();
    const urls = entries.map((e) => e.url);
    expect(urls).toContain("https://budgetndiostory.org/reports");
  });
});
