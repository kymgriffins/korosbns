import { describe, it, expect, vi, beforeEach } from "vitest";
import { citizenApi } from "@/lib/api-client";

vi.mock("@/lib/api-client", () => ({
  citizenApi: {
    getArticle: vi.fn(),
    getStories: vi.fn(),
    getTrivia: vi.fn(),
    getKnowledge: vi.fn(),
    getKnowledgeEntry: vi.fn(),
    getArticles: vi.fn(),
  },
}));

import { contentData } from "@/data/content";

beforeEach(() => {
  vi.clearAllMocks();
});

describe("contentData knowledge", () => {
  it("fetch() calls citizenApi.getKnowledge and returns results", async () => {
    const mockData = { results: [{ id: "1", title: "Knowledge Base Entry" }] };
    (citizenApi.getKnowledge as any).mockResolvedValue(mockData);
    const result = await contentData.knowledge.fetch();
    expect(citizenApi.getKnowledge).toHaveBeenCalled();
    expect(result).toEqual(mockData.results);
  });

  it("fetch() falls back to [] on API error", async () => {
    (citizenApi.getKnowledge as any).mockRejectedValue(new Error("fail"));
    const result = await contentData.knowledge.fetch();
    expect(result).toEqual([]);
  });

  it("fetchById(id) calls citizenApi.getKnowledgeEntry and returns data", async () => {
    const mockData = { id: "1", title: "Specific Entry" };
    (citizenApi.getKnowledgeEntry as any).mockResolvedValue(mockData);
    const result = await contentData.knowledge.fetchById("1");
    expect(citizenApi.getKnowledgeEntry).toHaveBeenCalledWith("1");
    expect(result).toEqual(mockData);
  });

  it("fetchById(id) falls back to null on API error", async () => {
    (citizenApi.getKnowledgeEntry as any).mockRejectedValue(new Error("fail"));
    const result = await contentData.knowledge.fetchById("1");
    expect(result).toBeNull();
  });
});
