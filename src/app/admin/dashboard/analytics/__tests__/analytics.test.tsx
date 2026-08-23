import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";

const mockSummary = vi.hoisted(() => vi.fn());
const mockModuleAnalytics = vi.hoisted(() => vi.fn());

vi.mock("@/lib/admin-api", () => ({
  adminAnalyticsApi: {
    summary: mockSummary,
    moduleAnalytics: mockModuleAnalytics,
  },
}));

vi.mock("@/components/ui/chart", () => ({
  ChartContainer: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  ChartTooltip: () => null,
  ChartTooltipContent: () => null,
}));

import AdminAnalyticsPage from "@/app/admin/dashboard/analytics/page";

describe("AdminAnalyticsPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockModuleAnalytics.mockResolvedValue({
      period: "weekly",
      completions_over_time: [],
      top_modules: [],
      event_summary_last_30d: {},
      total_modules_published: 0,
    });
  });

  it("renders loading state initially", () => {
    mockSummary.mockReturnValue(new Promise(() => {}));
    mockModuleAnalytics.mockReturnValue(new Promise(() => {}));
    render(<AdminAnalyticsPage />);
    expect(screen.getByText("Analytics")).toBeInTheDocument();
  });

  it("renders KPIs when summary loads", async () => {
    mockSummary.mockResolvedValue({
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
      visitors_today: 20,
      visitors_7d: 100,
      visitors_30d: 420,
      pageviews_today: 50,
      pageviews_7d: 300,
      pageviews_30d: 900,
      users_new_today: 1,
      users_new_7d: 5,
      users_new_30d: 18,
      users_active_7d: 40,
      users_active_30d: 90,
      users_growth_pct: 2.5,
      bounce_rate: 41,
      avg_session_seconds: 180,
      content_published_today: 0,
      content_published_7d: 2,
      content_published_30d: 8,
      content_drafts: 3,
      traffic_source: "vercel",
      traffic_synced_at: "2026-07-14T10:00:00Z",
      daily_visitors: [{ date: "2026-07-13", count: 40 }],
      top_pages: [{ path: "/", views: 120, pageviews: 120 }],
      device_breakdown: [{ device_type: "Mobile", percentage: 62 }],
      traffic_sources: [{ source: "Direct", count: 50, percentage: 40 }],
    });

    render(<AdminAnalyticsPage />);
    expect(await screen.findByText("First-party tracker")).toBeInTheDocument();
    expect(screen.getAllByText("420").length).toBeGreaterThan(0);
    expect(screen.getAllByText("900").length).toBeGreaterThan(0);
    expect(screen.getAllByText("72.5%").length).toBeGreaterThan(0);
  });

  it("renders correct all-time KPIs when All Time is selected", async () => {
    mockSummary.mockResolvedValue({
      total_users: 150,
      total_content: 14,
      visitors_today: 10,
      visitors_7d: 50,
      visitors_30d: 200,
      visitors_all: 1250,
      pageviews_today: 30,
      pageviews_7d: 150,
      pageviews_30d: 600,
      pageviews_all: 5400,
      unique_visitors: 1250,
      total_pageviews: 5400,
      users_new_all: 150,
      content_published_all: 14,
      available_months: [{ value: "2026-08", label: "August 2026" }],
      daily_visitors: [{ date: "2026-08-01", count: 125 }],
      top_pages: [{ path: "/learn", views: 200, pageviews: 200 }],
      device_breakdown: [{ device_type: "Desktop", percentage: 70 }],
      traffic_sources: [{ source: "Direct", count: 100, percentage: 80 }],
    });

    const { fireEvent } = await import("@testing-library/react");

    render(<AdminAnalyticsPage />);
    expect(await screen.findByText("First-party tracker")).toBeInTheDocument();

    const allTimeBtn = screen.getByRole("button", { name: "All Time" });
    fireEvent.click(allTimeBtn);

    // Verify All Time displays real pageviews (5,400) and visitors (1,250), not total_content (14)
    expect(await screen.findByText("1,250")).toBeInTheDocument();
    expect(await screen.findByText("5,400")).toBeInTheDocument();
  });

  it("shows an error when the summary API fails", async () => {
    mockSummary.mockRejectedValue(new Error("network"));
    mockModuleAnalytics.mockResolvedValue({
      period: "weekly",
      completions_over_time: [],
      top_modules: [],
      event_summary_last_30d: {},
      total_modules_published: 0,
    });

    render(<AdminAnalyticsPage />);
    expect(await screen.findByText("Analytics unavailable")).toBeInTheDocument();
  });
});
