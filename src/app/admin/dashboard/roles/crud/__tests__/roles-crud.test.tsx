import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";

const mockFetch = vi.hoisted(() => vi.fn());
const mockCreate = vi.hoisted(() => vi.fn());
const mockUpdate = vi.hoisted(() => vi.fn());
const mockDelete = vi.hoisted(() => vi.fn());

vi.mock("@/data/users", () => ({
  userData: {
    admin: {
      roles: {
        fetch: mockFetch,
        create: mockCreate,
        update: mockUpdate,
        delete: mockDelete,
      },
    },
  },
}));

vi.mock("@/contexts/auth-context", () => ({
  useAuth: () => ({ isLoggedIn: true }),
}));

import AdminRolesPage from "@/app/admin/dashboard/roles/crud/page";

describe("AdminRolesPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders loading state initially", () => {
    mockFetch.mockReturnValue(new Promise(() => {}));
    render(<AdminRolesPage />);
    expect(screen.getByText("Roles")).toBeInTheDocument();
    expect(screen.getByText("Manage user roles and permissions")).toBeInTheDocument();
  });

  it("renders role data when fetch succeeds", async () => {
    mockFetch.mockResolvedValue({
      count: 1,
      results: [{ id: "1", name: "Admin", description: "Administrator role", permissions: ["view_users", "edit_content"], user_count: 3 }],
    });

    render(<AdminRolesPage />);
    expect(await screen.findByText("All Roles")).toBeInTheDocument();
    expect(await screen.findByText("Admin")).toBeInTheDocument();
  });

  it("shows error when fetch fails", async () => {
    mockFetch.mockRejectedValue(new Error("Network error"));

    render(<AdminRolesPage />);
    expect(await screen.findByText("Network error")).toBeInTheDocument();
  });
});
