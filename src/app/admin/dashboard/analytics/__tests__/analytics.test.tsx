import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";

const mockFetchSummary = vi.hoisted(() => vi.fn());
const mockModulesFetchList = vi.hoisted(() => vi.fn());
const mockContentFetchList = vi.hoisted(() => vi.fn());
const mockForumFetchList = vi.hoisted(() => vi.fn());
const mockUsersFetch = vi.hoisted(() => vi.fn());

vi.mock("@/data/analytics", () => ({
  analyticsData: { admin: { fetchSummary: mockFetchSummary } },
}));

vi.mock("@/data/admin-content", () => ({
  adminContentData: {
    modules: { fetchList: mockModulesFetchList },
    content: { fetchList: mockContentFetchList },
    forum: { fetchList: mockForumFetchList },
  },
}));

vi.mock("@/data/users", () => ({
  userData: { admin: { users: { fetch: mockUsersFetch } } },
}));

vi.mock("@/lib/admin-api", () => ({
  adminNotesApi: { list: vi.fn().mockResolvedValue({ count: 5, results: [] }) },
}));

vi.mock("@/components/ui/chart", () => ({
  ChartContainer: ({ children }: any) => <div>{children}</div>,
  ChartTooltip: () => null,
  ChartTooltipContent: () => null,
}));

vi.mock("@/styles/flag-icons/flags.css", () => ({}));

import AdminAnalyticsPage from "@/app/admin/dashboard/analytics/page";

describe("AdminAnalyticsPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders loading state initially", () => {
    mockFetchSummary.mockReturnValue(new Promise(() => {}));
    render(<AdminAnalyticsPage />);
    expect(screen.getByText("Analytics")).toBeInTheDocument();
  });

  it("renders KPIs when data loads successfully via fetchSummary", async () => {
    mockFetchSummary.mockResolvedValue({
      total_users: 150,
      total_content: 63,
      total_modules: 10,
      total_articles: 40,
      total_videos: 15,
      total_stories: 8,
      total_documents: 5,
      active_forum_threads: 25,
      total_notes: 10,
      recent_signups: 12,
      engagement_rate: 72.5,
    });
    mockModulesFetchList.mockResolvedValue({ count: 10, results: [] });
    mockContentFetchList.mockResolvedValue({ count: 40, results: [] });

    render(<AdminAnalyticsPage />);
    expect(await screen.findByText("150")).toBeInTheDocument();
    expect(screen.getByText("63")).toBeInTheDocument();
    expect(screen.getByText("10")).toBeInTheDocument();
    expect(screen.getByText("40")).toBeInTheDocument();
  });

  it("falls back to manual counts when fetchSummary returns zeros", async () => {
    mockFetchSummary.mockResolvedValue({
      total_users: 0,
      total_content: 0,
      total_modules: 0,
      total_articles: 0,
      total_videos: 0,
      total_stories: 0,
      total_documents: 0,
      active_forum_threads: 0,
      total_notes: 0,
      recent_signups: 0,
      engagement_rate: 0,
    });
    mockUsersFetch.mockResolvedValue({ count: 100, results: [] });
    mockModulesFetchList.mockResolvedValue({ count: 8, results: [] });
    mockForumFetchList.mockResolvedValue({ count: 20, results: [] });

    render(<AdminAnalyticsPage />);
    expect(await screen.findByText("100")).toBeInTheDocument();
    expect(screen.getByText("8")).toBeInTheDocument();
  });
});
