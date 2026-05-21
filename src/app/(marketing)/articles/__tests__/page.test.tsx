import { render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import ArticlesPage from "@/app/(marketing)/articles/page";
import * as marketingContent from "@/lib/marketing-content";

vi.mock("@/lib/marketing-content", () => ({
  loadArticleList: vi.fn(),
  contentLoadErrorMessage: vi.fn((err: unknown, resource: string) =>
    err instanceof Error ? err.message : `Could not load ${resource}.`,
  ),
}));

describe("ArticlesPage", () => {
  beforeEach(() => {
    vi.mocked(marketingContent.loadArticleList).mockReset();
  });

  it("renders articles from the API", async () => {
    vi.mocked(marketingContent.loadArticleList).mockResolvedValue([
      {
        id: "health-budget",
        title: "Health spending",
        readTime: "5 min read",
        snippet: "Overview",
        body: "",
        body_html: "",
      },
    ]);
    render(<ArticlesPage />);
    await waitFor(() => {
      expect(screen.getByText("Health spending")).toBeInTheDocument();
    });
    expect(screen.getByRole("link", { name: /health spending/i })).toHaveAttribute(
      "href",
      "/articles/health-budget",
    );
  });

  it("shows error when article fetch fails", async () => {
    vi.mocked(marketingContent.loadArticleList).mockRejectedValue(
      new Error("Network error while contacting the API."),
    );
    render(<ArticlesPage />);
    await waitFor(() => {
      expect(
        screen.getByText("Network error while contacting the API."),
      ).toBeInTheDocument();
    });
  });
});
