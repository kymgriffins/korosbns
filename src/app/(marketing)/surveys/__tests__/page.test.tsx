import { render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import SurveysPage from "@/app/(marketing)/surveys/page";
import * as marketingContent from "@/lib/marketing-content";

vi.mock("motion/react", () => ({
  motion: {
    div: ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
      <div {...props}>{children}</div>
    ),
  },
}));

vi.mock("@/lib/marketing-content", () => ({
  loadSurveyList: vi.fn(),
  contentLoadErrorMessage: vi.fn((err: unknown, resource: string) =>
    err instanceof Error ? err.message : `Could not load ${resource}.`,
  ),
}));

describe("SurveysPage", () => {
  beforeEach(() => {
    vi.mocked(marketingContent.loadSurveyList).mockReset();
  });

  it("renders surveys from the API", async () => {
    vi.mocked(marketingContent.loadSurveyList).mockResolvedValue([
      { id: "s1", title: "National budget survey", allow_anonymous: true },
    ]);
    render(<SurveysPage />);
    await waitFor(() => {
      expect(screen.getByText("National budget survey")).toBeInTheDocument();
    });
    expect(screen.getByRole("link", { name: /take survey/i })).toHaveAttribute("href", "/surveys/s1");
  });

  it("shows API error message on fetch failure", async () => {
    vi.mocked(marketingContent.loadSurveyList).mockRejectedValue(
      new Error("Unable to reach the API."),
    );
    render(<SurveysPage />);
    await waitFor(() => {
      expect(screen.getByText("Unable to reach the API.")).toBeInTheDocument();
    });
  });
});
