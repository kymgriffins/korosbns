import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";

const mockList = vi.hoisted(() => vi.fn());

vi.mock("@/lib/admin-api", () => ({
  adminModulesApi: {
    list: mockList,
    delete: vi.fn(),
  },
}));

vi.mock("@/lib/route-base", () => ({
  useRouteBase: () => "/admin",
  getFullUrl: (_base: string, path: string) => `/admin${path}`,
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn() }),
}));

vi.mock("@/contexts/auth-context", () => ({
  useAuth: () => ({ isLoggedIn: true }),
}));

import AdminModulesPage from "@/app/admin/dashboard/modules/page";

describe("AdminModulesPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders learning modules heading", () => {
    mockList.mockReturnValue(new Promise(() => {}));
    render(<AdminModulesPage />);
    expect(screen.getByText("Learning modules")).toBeInTheDocument();
  });

  it("renders module data when fetch succeeds", async () => {
    mockList.mockResolvedValue({
      count: 1,
      results: [
        {
          id: "1",
          title: "Test Module",
          slug: "test-module",
          description: "Desc",
          status: "published",
          chapter_count: 2,
          created_at: "2024-01-01",
          updated_at: "2024-01-01",
        },
      ],
    });

    render(<AdminModulesPage />);
    expect(await screen.findByText("All modules")).toBeInTheDocument();
    expect(await screen.findByText("Test Module")).toBeInTheDocument();
  });

  it("shows error when fetch fails", async () => {
    mockList.mockRejectedValue(new Error("Network error"));

    render(<AdminModulesPage />);
    expect(await screen.findByText("Network error")).toBeInTheDocument();
  });
});
