import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";

const mockDashboard = vi.hoisted(() => vi.fn());

vi.mock("@/lib/admin-api", () => ({
  adminAnalyticsApi: { dashboard: mockDashboard },
}));

vi.mock("@/lib/route-base", () => ({
  useRouteBase: () => "",
  getFullUrl: (_base: string, path: string) => path,
}));

import AdminDashboardPage from "@/app/admin/dashboard/page";

describe("AdminDashboardPage error handling", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders without crashing when loading", () => {
    mockDashboard.mockReturnValue(new Promise(() => {}));
    const { container } = render(<AdminDashboardPage />);
    expect(container).toBeTruthy();
  });

  it("shows error message when API call fails", async () => {
    mockDashboard.mockRejectedValue(new Error("API Error"));

    render(<AdminDashboardPage />);
    const error = await screen.findByText("Unable to load dashboard stats from the API. Please try again.");
    expect(error).toBeInTheDocument();
  });
});
