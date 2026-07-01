import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";

const mockFetchList = vi.hoisted(() => vi.fn());
const mockCreate = vi.hoisted(() => vi.fn());
const mockUpdate = vi.hoisted(() => vi.fn());
const mockDelete = vi.hoisted(() => vi.fn());

vi.mock("@/data/admin-content", () => ({
  adminContentData: {
    modules: {
      fetchList: mockFetchList,
      create: mockCreate,
      update: mockUpdate,
      delete: mockDelete,
    },
  },
}));

vi.mock("@/contexts/auth-context", () => ({
  useAuth: () => ({ isLoggedIn: true }),
}));

import AdminModulesPage from "@/app/admin/dashboard/modules/page";

describe("AdminModulesPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders loading state initially", () => {
    mockFetchList.mockReturnValue(new Promise(() => {}));
    render(<AdminModulesPage />);
    expect(screen.getByText("Modules")).toBeInTheDocument();
    expect(screen.getByText("Manage civic education modules")).toBeInTheDocument();
  });

  it("renders module data when fetch succeeds", async () => {
    mockFetchList.mockResolvedValue({
      count: 1,
      results: [{ id: "1", title: "Test Module", slug: "test-module", description: "Desc", badge: "bronze", badgeName: "Bronze", status: "published", steps: [], created_at: "2024-01-01", updated_at: "2024-01-01" }],
    });

    render(<AdminModulesPage />);
    expect(await screen.findByText("All Modules")).toBeInTheDocument();
  });

  it("shows error when fetch fails", async () => {
    mockFetchList.mockRejectedValue(new Error("Network error"));

    render(<AdminModulesPage />);
    expect(await screen.findByText("Network error")).toBeInTheDocument();
  });
});
