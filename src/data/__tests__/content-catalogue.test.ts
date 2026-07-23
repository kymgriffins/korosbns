import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/learn-hub", () => ({
  learnHubApi: {
    articles: vi.fn(),
    stories: vi.fn(),
    paths: vi.fn(),
    quests: vi.fn(),
    documents: vi.fn(),
  },
}));

vi.mock("@/lib/api-client", () => ({
  citizenApi: {
    getArticle: vi.fn(),
    getStories: vi.fn(),
    getTriviaList: vi.fn(),
    getTrivia: vi.fn(),
    getTriviaLeaderboard: vi.fn(),
    getKnowledge: vi.fn(),
    getKnowledgeEntry: vi.fn(),
    getArticles: vi.fn(),
  },
}));

import { learnHubApi } from "@/lib/learn-hub";
import { citizenApi } from "@/lib/api-client";
import { contentData } from "@/data/content";
import learnArticlesFallback from "@/data/fallbacks/learn-articles.json";
import learnPathsFallback from "@/data/fallbacks/learn-paths.json";
import learnStoriesFallback from "@/data/fallbacks/learn-stories.json";
import learnQuestsFallback from "@/data/fallbacks/learn-quests.json";

beforeEach(() => {
  vi.clearAllMocks();
});

describe("contentData catalogue (JSON-only)", () => {
  it("articles.fetch never calls learnHubApi.articles", async () => {
    (learnHubApi.articles as ReturnType<typeof vi.fn>).mockResolvedValue({
      results: [{ id: "api", title: "API", slug: "api" }],
    });
    const result = await contentData.articles.fetch();
    expect(learnHubApi.articles).not.toHaveBeenCalled();
    expect(result.length).toBe(learnArticlesFallback.results.length);
    expect(result[0]?.thumbnail_url).toMatch(/i\.ytimg\.com\/vi\//);
  });

  it("articles.fetchBySlug never calls citizenApi.getArticle", async () => {
    const slug = learnArticlesFallback.results[0]?.slug as string;
    (citizenApi.getArticle as ReturnType<typeof vi.fn>).mockResolvedValue({
      slug: "from-api",
    });
    const result = await contentData.articles.fetchBySlug(slug);
    expect(citizenApi.getArticle).not.toHaveBeenCalled();
    expect(result?.slug).toBe(slug);
  });

  it("stories.fetch never calls learnHubApi.stories", async () => {
    (learnHubApi.stories as ReturnType<typeof vi.fn>).mockResolvedValue({
      results: [{ id: "api" }],
    });
    const result = await contentData.stories.fetch();
    expect(learnHubApi.stories).not.toHaveBeenCalled();
    expect(result.length).toBe(learnStoriesFallback.results.length);
  });

  it("paths.fetch never calls learnHubApi.paths", async () => {
    (learnHubApi.paths as ReturnType<typeof vi.fn>).mockResolvedValue({
      results: [{ id: "api" }],
    });
    const result = await contentData.paths.fetch();
    expect(learnHubApi.paths).not.toHaveBeenCalled();
    expect(result.length).toBe(learnPathsFallback.results.length);
  });

  it("quests.fetch never calls learnHubApi.quests", async () => {
    (learnHubApi.quests as ReturnType<typeof vi.fn>).mockResolvedValue({
      results: [{ id: "api" }],
    });
    const result = await contentData.quests.fetch();
    expect(learnHubApi.quests).not.toHaveBeenCalled();
    expect(result.length).toBe(learnQuestsFallback.results.length);
  });

  it("trivia.fetchList never calls citizenApi.getTriviaList", async () => {
    (citizenApi.getTriviaList as ReturnType<typeof vi.fn>).mockResolvedValue({
      results: [{ id: "api" }],
    });
    const result = await contentData.trivia.fetchList();
    expect(citizenApi.getTriviaList).not.toHaveBeenCalled();
    expect(Array.isArray(result)).toBe(true);
  });
});

describe("contentData knowledge (not learn catalogue — API still allowed)", () => {
  it("fetch() calls citizenApi.getKnowledge", async () => {
    const mockData = { results: [{ id: "1", title: "Knowledge Base Entry" }] };
    (citizenApi.getKnowledge as ReturnType<typeof vi.fn>).mockResolvedValue(mockData);
    const result = await contentData.knowledge.fetch();
    expect(citizenApi.getKnowledge).toHaveBeenCalled();
    expect(result).toEqual(mockData.results);
  });

  it("fetch() falls back to [] on API error", async () => {
    (citizenApi.getKnowledge as ReturnType<typeof vi.fn>).mockRejectedValue(new Error("fail"));
    const result = await contentData.knowledge.fetch();
    expect(result).toEqual([]);
  });
});
