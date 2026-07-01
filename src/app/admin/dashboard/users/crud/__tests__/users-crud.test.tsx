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
      users: {
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

vi.mock("@/components/admin/data-table", () => ({
  DataTable: ({ columns, data, loading, error }: any) => (
    <div data-testid="data-table">
      {loading ? <span>Loading...</span> : error ? <span>{error}</span> : <span>Users: {data.length}</span>}
    </div>
  ),
}));

vi.mock("@/components/admin/form-dialog", () => ({
  FormDialog: ({ open, title, children }: any) => (open ? <div data-testid="form-dialog"><h2>{title}</h2>{children}</div> : null),
}));

import AdminUsersPage from "@/app/admin/dashboard/users/crud/page";

describe("AdminUsersPage CRUD", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders loading state initially", () => {
    mockFetch.mockReturnValue(new Promise(() => {}));
    render(<AdminUsersPage />);
    expect(screen.getByText("Users")).toBeInTheDocument();
  });

  it("renders user data when fetch succeeds", async () => {
    mockFetch.mockResolvedValue({ count: 1, results: [{ id: "1", email: "a@b.com", first_name: "A", last_name: "B", role: "viewer", is_active: true, date_joined: "2024-01-01", last_login: null, avatar: null }] });

    render(<AdminUsersPage />);
    expect(await screen.findByText("All Users")).toBeInTheDocument();
    expect(screen.getByText("Users: 1")).toBeInTheDocument();
  });

  it("shows error when fetch fails", async () => {
    mockFetch.mockRejectedValue(new Error("Network error"));

    render(<AdminUsersPage />);
    expect(await screen.findByText("Network error")).toBeInTheDocument();
  });
});
