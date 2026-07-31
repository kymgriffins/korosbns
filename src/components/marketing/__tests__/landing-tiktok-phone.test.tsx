import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock IntersectionObserver
const mockObserve = vi.fn();
const mockDisconnect = vi.fn();

beforeEach(() => {
  vi.clearAllMocks();
  window.IntersectionObserver = vi.fn().mockImplementation(() => ({
    observe: mockObserve,
    unobserve: vi.fn(),
    disconnect: mockDisconnect,
  })) as any;
});

import { LandingTikTokPhone } from "../landing-tiktok-phone";

describe("LandingTikTokPhone", () => {
  it("renders cover thumbnail image and visible TikTok URL links", async () => {
    render(<LandingTikTokPhone />);

    // 1. Verify Cover Thumbnail Image element is present
    const coverImageOverlay = screen.getByTestId("tiktok-hero-cover-image");
    expect(coverImageOverlay).toBeInTheDocument();

    const imgElement = screen.getByAltText("Budget Ndio Story - County Budget Explained");
    expect(imgElement).toBeInTheDocument();
    expect(imgElement).toHaveAttribute(
      "src",
      expect.stringContaining("main")
    );

    // 2. Verify TikTok URLs are rendered and visible
    const urlBadge = screen.getByTestId("tiktok-hero-url-badge");
    expect(urlBadge).toBeInTheDocument();
    expect(urlBadge).toHaveAttribute("href", "https://www.tiktok.com/@budget.ndio.story");
    expect(screen.getAllByText("tiktok.com/@budget.ndio.story").length).toBeGreaterThan(0);

    const footerUrl = screen.getByTestId("tiktok-hero-footer-url");
    expect(footerUrl).toBeInTheDocument();
    expect(footerUrl).toHaveAttribute("href", "https://www.tiktok.com/@budget.ndio.story");
    expect(screen.getByText("https://www.tiktok.com/@budget.ndio.story")).toBeInTheDocument();
  });
});
