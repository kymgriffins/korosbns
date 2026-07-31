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
  it("renders video element with Cloudflare URL and playback controls", async () => {
    render(<LandingTikTokPhone />);

    const videoElement = screen.getByLabelText("County budget social video");
    expect(videoElement).toBeInTheDocument();
    expect(videoElement).toHaveAttribute(
      "src",
      expect.stringContaining("county%20%26%20budget%20socials%20new.mp4")
    );

    // Verify play button is visible initially
    expect(screen.getAllByRole("button", { name: "Play video" }).length).toBeGreaterThan(0);
    expect(screen.getByText("@budget.ndio.story")).toBeInTheDocument();
  });
});
