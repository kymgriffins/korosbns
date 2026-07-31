import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";

const mockFetch = vi.fn();
vi.mock("@/data/users", () => ({
  userData: {
    admin: {
      authors: {
        fetch: (...args: any[]) => mockFetch(...args),
        create: vi.fn(),
        update: vi.fn(),
        delete: vi.fn(),
      },
    },
  },
}));

import AdminAuthorsPage from "../page";

describe("AdminAuthorsPage", () => {
  it("renders Authors title and calls fetch on mount", async () => {
    mockFetch.mockResolvedValue({ results: [], count: 0 });
    render(<AdminAuthorsPage />);
    expect(screen.getByText("Authors")).toBeInTheDocument();
    expect(mockFetch).toHaveBeenCalled();
  });
});
