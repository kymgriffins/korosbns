import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import type { AdminDashboardSummary } from "@/data/admin-dashboard";

const mockFetch = vi.hoisted(() => vi.fn());

vi.mock("@/data/admin-dashboard", () => ({
  dashboardData: { fetch: mockFetch, get: vi.fn() },
}));

vi.mock("@/lib/route-base", () => ({
  useRouteBase: () => "",
  getFullUrl: (_base: string, path: string) => path,
}));

import AdminDashboardPage from "@/app/admin/dashboard/page";

const mockSummary: AdminDashboardSummary = {
  users: { total: 150, active: 80, new_this_month: 12 },
  content: { total: 63, published: 40, drafts: 23, articles: 40, videos: 15, stories: 8 },
  modules: { total: 10, published: 7 },
  forum: { total_threads: 25, total_posts: 120, reported: 2 },
};

describe("AdminDashboardPage overview", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders loading state initially", () => {
    mockFetch.mockReturnValue(new Promise(() => {}));
    render(<AdminDashboardPage />);
    expect(screen.getByText("Admin Dashboard")).toBeInTheDocument();
  });

  it("renders stat cards when data loads successfully", async () => {
    mockFetch.mockResolvedValue(mockSummary);

    render(<AdminDashboardPage />);
    expect(await screen.findByText("150")).toBeInTheDocument();
    expect(screen.getByText("63")).toBeInTheDocument();
    expect(screen.getByText("10")).toBeInTheDocument();
    expect(screen.getByText("25")).toBeInTheDocument();
    expect(screen.getByText("Total Users")).toBeInTheDocument();
    expect(screen.getByText("Total Content")).toBeInTheDocument();
    expect(screen.getByText("Total Modules")).toBeInTheDocument();
    expect(screen.getByText("Active Forum Threads")).toBeInTheDocument();
  });

  it("renders content breakdown section", async () => {
    mockFetch.mockResolvedValue(mockSummary);

    render(<AdminDashboardPage />);
    expect(await screen.findByText("Content Breakdown")).toBeInTheDocument();
    expect(screen.getByText("Articles")).toBeInTheDocument();
    expect(screen.getByText("Videos")).toBeInTheDocument();
    expect(screen.getByText("Stories")).toBeInTheDocument();
  });

  it("shows error state when fetch fails", async () => {
    mockFetch.mockRejectedValue(new Error("Network error"));

    render(<AdminDashboardPage />);
    expect(await screen.findByText("Unable to load dashboard data. Please try again.")).toBeInTheDocument();
  });
});
