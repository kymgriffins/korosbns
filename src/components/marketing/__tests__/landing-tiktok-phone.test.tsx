import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
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
  it("renders Nelly Maina media cover photo and opens TikTok page on play click", async () => {
    const windowOpenSpy = vi.spyOn(window, "open").mockImplementation(() => null);

    render(<LandingTikTokPhone />);

    // 1. Verify Cover Thumbnail Image is Nelly Maina media image (Nelly with The Mic)
    const coverImageOverlay = screen.getByTestId("tiktok-hero-cover-image");
    expect(coverImageOverlay).toBeInTheDocument();

    const imgElement = screen.getByAltText("Nelly Maina - Budget Ndio Story");
    expect(imgElement).toBeInTheDocument();
    expect(imgElement).toHaveAttribute(
      "src",
      expect.stringContaining("Nelly")
    );

    // 2. Click play button and verify window.open called with TikTok URL
    const playButtons = screen.getAllByRole("button", { name: "Play video" });
    expect(playButtons.length).toBeGreaterThan(0);

    fireEvent.click(playButtons[0]);
    expect(windowOpenSpy).toHaveBeenCalledWith(
      "https://www.tiktok.com/@budget.ndio.story",
      "_blank",
      "noopener,noreferrer"
    );
  });
});
