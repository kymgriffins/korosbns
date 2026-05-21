import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import ArticlesPage from "@/app/(marketing)/articles/page";
import * as serverContent from "@/lib/server-content";

vi.mock("@/lib/server-content", () => ({
  fetchArticleListServer: vi.fn(),
}));

describe("ArticlesPage", () => {
  beforeEach(() => {
    vi.mocked(serverContent.fetchArticleListServer).mockReset();
  });

  it("renders articles from the API", async () => {
    vi.mocked(serverContent.fetchArticleListServer).mockResolvedValue([
      {
        id: "health-budget",
        title: "Health spending",
        readTime: "5 min read",
        snippet: "Overview",
        body: "",
        body_html: "",
      },
    ]);
    const ui = await ArticlesPage();
    render(ui);
    expect(screen.getByText("Health spending")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /health spending/i })).toHaveAttribute(
      "href",
      "/articles/health-budget",
    );
  });

  it("shows error when article fetch fails", async () => {
    vi.mocked(serverContent.fetchArticleListServer).mockRejectedValue(
      new Error("Network error while contacting the API."),
    );
    const ui = await ArticlesPage();
    render(ui);
    expect(screen.getByText("Network error while contacting the API.")).toBeInTheDocument();
  });
});
