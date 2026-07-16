import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";

const mockDashboard = vi.hoisted(() => vi.fn());

vi.mock("@/lib/admin-api", () => ({
  adminAnalyticsApi: { dashboard: mockDashboard },
}));

vi.mock("@/lib/route-base", () => ({
  useRouteBase: () => "",
  getFullUrl: (_base: string, path: string) => path,
}));

import AdminDashboardPage from "@/app/admin/dashboard/page";

const mockStats = {
  users: { total: 150, active: 80, recent_signups_30d: 12 },
  content: { articles: 40, stories: 8, youtube_videos: 15, knowledge_entries: 0, civic_modules: 10, civic_chapters: 30, learning_courses: 2 },
  engagement: { forum_threads: 25, forum_posts: 120, trivia_sets: 3, surveys: 2, survey_responses: 45, newsletter_subscribers: 60, reported: 2 },
  gamification: { badges_issued: 10, total_points_earned: 5000, learner_profiles: 80 },
  weekly_notes: { total: 5, published: 3, avg_progress_pct: 60 },
  snapshot: { date: "2026-07-15", unique_visitors: 1000, total_pageviews: 5000, uptime_percentage: 99.9 },
};

describe("AdminDashboardPage overview", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders loading state initially", () => {
    mockDashboard.mockReturnValue(new Promise(() => {}));
    render(<AdminDashboardPage />);
    expect(screen.getByText("Overview")).toBeInTheDocument();
  });

  it("renders stat cards when data loads successfully", async () => {
    mockDashboard.mockResolvedValue(mockStats);

    render(<AdminDashboardPage />);
    expect(await screen.findByText("150")).toBeInTheDocument();
    expect(screen.getByText("63")).toBeInTheDocument();
    expect(screen.getAllByText("10").length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText("25")).toBeInTheDocument();
  });

  it("renders content breakdown section", async () => {
    mockDashboard.mockResolvedValue(mockStats);

    render(<AdminDashboardPage />);
    expect(await screen.findByText("Content breakdown")).toBeInTheDocument();
    expect(screen.getByText("Articles")).toBeInTheDocument();
    expect(screen.getAllByText("YouTube videos").length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText("Stories")).toBeInTheDocument();
  });

  it("shows error state when fetch fails", async () => {
    mockDashboard.mockRejectedValue(new Error("Network error"));

    render(<AdminDashboardPage />);
    expect(await screen.findByText("Unable to load dashboard stats from the API. Please try again.")).toBeInTheDocument();
  });
});
