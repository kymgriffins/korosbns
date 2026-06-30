import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";

const mockFetchList = vi.hoisted(() => vi.fn());
const mockDeleteThread = vi.hoisted(() => vi.fn());

vi.mock("@/data/admin-content", () => ({
  adminContentData: {
    forum: {
      fetchList: mockFetchList,
      deleteThread: mockDeleteThread,
    },
  },
}));

vi.mock("@/contexts/auth-context", () => ({
  useAuth: () => ({ isLoggedIn: true }),
}));

import AdminForumPage from "@/app/admin/dashboard/forum/page";

describe("AdminForumPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders loading state initially", () => {
    mockFetchList.mockReturnValue(new Promise(() => {}));
    render(<AdminForumPage />);
    expect(screen.getByText("Forum")).toBeInTheDocument();
    expect(screen.getByText("Moderate discussion threads")).toBeInTheDocument();
  });

  it("renders thread data when fetch succeeds", async () => {
    mockFetchList.mockResolvedValue({
      count: 1,
      results: [{ id: "1", title: "Test Thread", author_name: "Alice", posts_count: 5, civic_module: "Module 1", created_at: "2024-01-01", updated_at: "2024-01-01" }],
    });

    render(<AdminForumPage />);
    expect(await screen.findByText("All Threads")).toBeInTheDocument();
    expect(await screen.findByText("Test Thread")).toBeInTheDocument();
  });

  it("shows error when fetch fails", async () => {
    mockFetchList.mockRejectedValue(new Error("Network error"));

    render(<AdminForumPage />);
    expect(await screen.findByText("Network error")).toBeInTheDocument();
  });
});
