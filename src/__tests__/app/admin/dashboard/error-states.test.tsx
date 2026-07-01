import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";

vi.mock("@/data/admin-dashboard", () => ({
  dashboardData: {
    fetch: vi.fn(),
  },
}));

vi.mock("@/lib/route-base", () => ({
  useRouteBase: () => "",
  getFullUrl: (_base: string, path: string) => path,
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({}),
}));

import AdminDashboardPage from "@/app/admin/dashboard/page";
import { dashboardData } from "@/data/admin-dashboard";

const mockFetch = vi.mocked(dashboardData.fetch);

describe("AdminDashboardPage error handling", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders loading state initially", () => {
    mockFetch.mockReturnValue(new Promise(() => {}));

    const { container } = render(<AdminDashboardPage />);
    expect(container.querySelector('[data-slot="card"]')).toBeInTheDocument();
  });

  it("shows error message when all API calls fail", async () => {
    mockFetch.mockRejectedValue(new Error("API Error"));

    render(<AdminDashboardPage />);
    const error = await screen.findByText("Unable to load dashboard data. Please try again.");
    expect(error).toBeInTheDocument();
  });
});
