import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi, describe, it, expect, beforeEach } from "vitest";

const mockFetchProfile = vi.fn().mockResolvedValue({
  display_name: "Test User",
  email: "test@example.com",
  headline: "A learner",
  bio: "Hello world",
});

const mockPatchMe = vi.fn().mockResolvedValue({ detail: "Profile updated" });

vi.mock("@/data/users", () => ({
  userData: {
    profile: {
      fetch: () => mockFetchProfile(),
    },
  },
}));

vi.mock("@/hooks/use-page-view", () => ({
  usePageView: () => {},
}));

vi.mock("next/link", () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) =>
    <a href={href}>{children}</a>,
}));

describe("AccountPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders loading state initially", async () => {
    const Page = (await import("../page")).default;
    render(<Page />);
    expect(screen.getByText(/account settings/i)).toBeInTheDocument();
  });

  it("renders profile form after fetching data", async () => {
    const Page = (await import("../page")).default;
    render(<Page />);
    await waitFor(() => {
      expect(screen.getByDisplayValue("Test User")).toBeInTheDocument();
    });
    expect(screen.getByDisplayValue("test@example.com")).toBeInTheDocument();
    expect(screen.getByDisplayValue("A learner")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Hello world")).toBeInTheDocument();
  });

  it("has a Save Changes button", async () => {
    const Page = (await import("../page")).default;
    render(<Page />);
    await waitFor(() => {
      expect(screen.getByText("Save Changes")).toBeInTheDocument();
    });
  });
});
