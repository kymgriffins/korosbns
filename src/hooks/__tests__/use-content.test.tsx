import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";

vi.mock("@/data/content", () => ({
  contentData: {
    articles: {
      fetch: vi.fn(),
      fetchBySlug: vi.fn(),
    },
    stories: {
      fetch: vi.fn(),
    },
    trivia: {
      fetchList: vi.fn(),
      fetchBySlug: vi.fn(),
      fetchLeaderboard: vi.fn(),
    },
    knowledge: {
      fetch: vi.fn(),
      fetchById: vi.fn(),
    },
  },
}));

import { contentData } from "@/data/content";
import {
  useArticle,
  useArticles,
  useStories,
  useTriviaList,
  useTrivia,
  useTriviaLeaderboard,
  useKnowledge,
  useKnowledgeEntry,
  useContentForSlug,
} from "@/hooks/use-content";

function createWrapper() {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return function Wrapper({ children }: { children: ReactNode }) {
    return <QueryClientProvider client={qc}>{children}</QueryClientProvider>;
  };
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe("useArticles", () => {
  it("calls contentData.articles.fetch and returns wrapped results", async () => {
    const mockResults = [{ id: "1", title: "Article 1" }];
    vi.mocked(contentData.articles.fetch).mockResolvedValue(mockResults as any);

    const { result } = renderHook(() => useArticles(), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(contentData.articles.fetch).toHaveBeenCalled();
    expect(result.current.data).toEqual({ results: mockResults });
  });

  it("passes filters to contentData.articles.fetch", async () => {
    vi.mocked(contentData.articles.fetch).mockResolvedValue([]);

    const { result } = renderHook(() => useArticles({ search: "budget" }), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(contentData.articles.fetch).toHaveBeenCalledWith({ search: "budget" });
  });
});

describe("useArticle", () => {
  it("calls contentData.articles.fetchBySlug with slug", async () => {
    const mockArticle = { id: "1", title: "Test Article", slug: "test-article" };
    vi.mocked(contentData.articles.fetchBySlug).mockResolvedValue(mockArticle as any);

    const { result } = renderHook(() => useArticle("test-article"), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(contentData.articles.fetchBySlug).toHaveBeenCalledWith("test-article");
    expect(result.current.data).toEqual(mockArticle);
  });

  it("disables query when slug is empty", () => {
    const { result } = renderHook(() => useArticle(""), { wrapper: createWrapper() });
    expect(result.current.fetchStatus).toBe("idle");
  });
});

describe("useStories", () => {
  it("calls contentData.stories.fetch and returns wrapped results", async () => {
    const mockResults = [{ id: "1", title: "Story 1" }];
    vi.mocked(contentData.stories.fetch).mockResolvedValue(mockResults as any);

    const { result } = renderHook(() => useStories(), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(contentData.stories.fetch).toHaveBeenCalled();
    expect(result.current.data).toEqual({ results: mockResults });
  });
});

describe("useTriviaList", () => {
  it("calls contentData.trivia.fetchList and returns wrapped results", async () => {
    const mockResults = [{ id: "1", title: "Trivia 1" }];
    vi.mocked(contentData.trivia.fetchList).mockResolvedValue(mockResults as any);

    const { result } = renderHook(() => useTriviaList(), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(contentData.trivia.fetchList).toHaveBeenCalled();
    expect(result.current.data).toEqual({ results: mockResults });
  });
});

describe("useTrivia", () => {
  it("calls contentData.trivia.fetchBySlug with id", async () => {
    const mockTrivia = { id: "trivia-1", title: "Test Trivia" };
    vi.mocked(contentData.trivia.fetchBySlug).mockResolvedValue(mockTrivia as any);

    const { result } = renderHook(() => useTrivia("trivia-1"), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(contentData.trivia.fetchBySlug).toHaveBeenCalledWith("trivia-1");
    expect(result.current.data).toEqual(mockTrivia);
  });
});

describe("useTriviaLeaderboard", () => {
  it("calls contentData.trivia.fetchLeaderboard with id", async () => {
    const mockData = { results: [{ rank: 1, name: "Player 1", points: 100 }] };
    vi.mocked(contentData.trivia.fetchLeaderboard).mockResolvedValue(mockData as any);

    const { result } = renderHook(() => useTriviaLeaderboard("trivia-1"), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(contentData.trivia.fetchLeaderboard).toHaveBeenCalledWith("trivia-1");
    expect(result.current.data).toEqual(mockData);
  });
});

describe("useKnowledge", () => {
  it("calls contentData.knowledge.fetch and returns wrapped results", async () => {
    const mockResults = [{ id: "1", title: "Knowledge Entry" }];
    vi.mocked(contentData.knowledge.fetch).mockResolvedValue(mockResults as any);

    const { result } = renderHook(() => useKnowledge(), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(contentData.knowledge.fetch).toHaveBeenCalled();
    expect(result.current.data).toEqual({ results: mockResults });
  });
});

describe("useKnowledgeEntry", () => {
  it("calls contentData.knowledge.fetchById with id", async () => {
    const mockEntry = { id: "kb-1", title: "KB Entry" };
    vi.mocked(contentData.knowledge.fetchById).mockResolvedValue(mockEntry as any);

    const { result } = renderHook(() => useKnowledgeEntry("kb-1"), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(contentData.knowledge.fetchById).toHaveBeenCalledWith("kb-1");
    expect(result.current.data).toEqual(mockEntry);
  });
});

describe("useContentForSlug", () => {
  it("resolves article type and returns type + data", async () => {
    const mockArticle = { id: "1", title: "Article", slug: "my-slug" };
    vi.mocked(contentData.articles.fetchBySlug).mockResolvedValue(mockArticle as any);

    const { result } = renderHook(() => useContentForSlug("my-slug"), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual({ type: "article", data: mockArticle });
  });

  it("falls back to trivia when article returns null", async () => {
    vi.mocked(contentData.articles.fetchBySlug).mockResolvedValue(null);
    const mockTrivia = { id: "trivia-1", title: "Trivia" };
    vi.mocked(contentData.trivia.fetchBySlug).mockResolvedValue(mockTrivia as any);

    const { result } = renderHook(() => useContentForSlug("my-slug"), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual({ type: "trivia", data: mockTrivia });
  });

  it("falls back to story when article and trivia return null", async () => {
    vi.mocked(contentData.articles.fetchBySlug).mockResolvedValue(null);
    vi.mocked(contentData.trivia.fetchBySlug).mockResolvedValue(null);
    const mockStories = [{ id: "story-1", title: "Story" }];
    vi.mocked(contentData.stories.fetch).mockResolvedValue(mockStories as any);

    const { result } = renderHook(() => useContentForSlug("story-1"), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual({ type: "story", data: { id: "story-1", title: "Story" } });
  });

  it("returns null when nothing matches", async () => {
    vi.mocked(contentData.articles.fetchBySlug).mockResolvedValue(null);
    vi.mocked(contentData.trivia.fetchBySlug).mockResolvedValue(null);
    vi.mocked(contentData.stories.fetch).mockResolvedValue([]);

    const { result } = renderHook(() => useContentForSlug("unknown"), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toBeNull();
  });
});
