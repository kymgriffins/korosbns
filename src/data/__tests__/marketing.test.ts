import { describe, it, expect, vi, beforeEach } from "vitest";
import { citizenApi } from "@/lib/api-client";
import { apiFetch } from "@/lib/api-client";

vi.mock("@/lib/api-client", () => ({
  citizenApi: { getArticles: vi.fn() },
  apiFetch: vi.fn(),
}));

import { marketingData } from "@/data/marketing";

beforeEach(() => {
  vi.clearAllMocks();
});

describe("marketingData articlesMarquee", () => {
  it("fetch() calls apiFetch with limit and returns results", async () => {
    const mockData = { results: [{ id: "1", title: "Article" }] };
    (apiFetch as any).mockResolvedValue(mockData);
    const result = await marketingData.articlesMarquee.fetch(3);
    expect(apiFetch).toHaveBeenCalledWith("/content/articles/?limit=3");
    expect(result).toEqual(mockData.results);
  });

  it("fetch() uses default limit of 5", async () => {
    (apiFetch as any).mockResolvedValue({ results: [] });
    await marketingData.articlesMarquee.fetch();
    expect(apiFetch).toHaveBeenCalledWith("/content/articles/?limit=5");
  });

  it("fetch() falls back to [] on API error", async () => {
    (apiFetch as any).mockRejectedValue(new Error("fail"));
    const result = await marketingData.articlesMarquee.fetch();
    expect(result).toEqual([]);
  });
});

describe("marketingData campaigns", () => {
  it("fetch() calls apiFetch and returns data", async () => {
    const mockData = [{ id: "1", title: "Campaign" }];
    (apiFetch as any).mockResolvedValue(mockData);
    const result = await marketingData.campaigns.fetch();
    expect(apiFetch).toHaveBeenCalledWith("/marketing/campaigns/");
    expect(result).toEqual(mockData);
  });

  it("fetch() falls back to [] on API error", async () => {
    (apiFetch as any).mockRejectedValue(new Error("fail"));
    const result = await marketingData.campaigns.fetch();
    expect(result).toEqual([]);
  });
});
