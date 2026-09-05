import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
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
  it("renders cover photo and plays video inline on play click", async () => {
    const playSpy = vi.spyOn(window.HTMLMediaElement.prototype, "play").mockImplementation(async () => {});

    render(<LandingTikTokPhone />);

    // 1. Verify Cover Thumbnail Image is authentic video frame (reel-01-poster)
    const coverImageOverlay = screen.getByTestId("tiktok-hero-cover-image");
    expect(coverImageOverlay).toBeInTheDocument();

    const imgElement = screen.getByAltText("Budget Ndio Story - Reel Preview");
    expect(imgElement).toBeInTheDocument();
    expect(imgElement).toHaveAttribute(
      "src",
      expect.stringContaining("reel-01-poster")
    );

    // 2. Click play button and verify video plays inline
    const playButtons = screen.getAllByRole("button", { name: "Play video" });
    expect(playButtons.length).toBeGreaterThan(0);

    await act(async () => {
      fireEvent.click(playButtons[0]);
    });
    expect(playSpy).toHaveBeenCalled();

    // 3. Verify TikTok link is available on the handle
    const tiktokLink = screen.getByText("@budget.ndio.story");
    expect(tiktokLink.closest("a")).toHaveAttribute(
      "href",
      "https://www.tiktok.com/@budget.ndio.story"
    );
  });
});
