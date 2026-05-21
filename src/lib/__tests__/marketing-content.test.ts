import { beforeEach, describe, expect, it, vi } from "vitest";
import { citizenApi } from "@/lib/api-client";
import { loadArticleList, loadSurveyList, contentLoadErrorMessage } from "@/lib/marketing-content";

vi.mock("@/lib/api-client", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/api-client")>();
  return {
    ...actual,
    citizenApi: {
      getSurveys: vi.fn(),
      getArticles: vi.fn(),
    },
  };
});

describe("loadSurveyList", () => {
  beforeEach(() => {
    vi.mocked(citizenApi.getSurveys).mockReset();
  });

  it("returns survey results from the API", async () => {
    vi.mocked(citizenApi.getSurveys).mockResolvedValue({
      results: [{ id: "s1", title: "Budget views" }],
    });
    await expect(loadSurveyList()).resolves.toEqual([{ id: "s1", title: "Budget views" }]);
  });

  it("returns empty array when results missing", async () => {
    vi.mocked(citizenApi.getSurveys).mockResolvedValue({});
    await expect(loadSurveyList()).resolves.toEqual([]);
  });
});

describe("loadArticleList", () => {
  beforeEach(() => {
    vi.mocked(citizenApi.getArticles).mockReset();
  });

  it("maps articles from API results", async () => {
    vi.mocked(citizenApi.getArticles).mockResolvedValue({
      results: [{ slug: "health", title: "Health budget", summary: "Hi" }],
    });
    const articles = await loadArticleList();
    expect(articles[0].id).toBe("health");
    expect(articles[0].title).toBe("Health budget");
  });
});

describe("contentLoadErrorMessage", () => {
  it("uses Error message when present", () => {
    expect(contentLoadErrorMessage(new Error("Network error"), "surveys")).toBe("Network error");
  });

  it("falls back to resource label", () => {
    expect(contentLoadErrorMessage("x", "articles")).toBe("Could not load articles.");
  });
});
