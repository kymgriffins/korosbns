import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { StudioProductionSpectrum } from "../StudioProductionSpectrum";

beforeEach(() => {
  vi.clearAllMocks();
  window.IntersectionObserver = vi.fn().mockImplementation(function (this: any) {
    return {
      observe: vi.fn(),
      unobserve: vi.fn(),
      disconnect: vi.fn(),
    };
  }) as any;
});

describe("StudioProductionSpectrum", () => {
  it("renders chapter SectionBadge, 3 disciplines, and navigation controls", () => {
    render(<StudioProductionSpectrum />);

    // SectionBadge and headings
    expect(screen.getByText(/Chapter 03 · Production Spectrum/i)).toBeInTheDocument();
    expect(
      screen.getByText(/Three creative disciplines\. Engineered for civic impact\./i),
    ).toBeInTheDocument();

    // 3 Creative Disciplines
    expect(screen.getByText("Animation & Visual Data")).toBeInTheDocument();
    expect(screen.getByText("Cinema & Field Production")).toBeInTheDocument();
    expect(screen.getByText("Audio Journalism & Podcasts")).toBeInTheDocument();
    // 4th discipline removed
    expect(screen.queryByText("Civic Convenings & Evidence")).not.toBeInTheDocument();

    // Scroll controls on sm+
    expect(screen.getByLabelText("Scroll left")).toBeInTheDocument();
    expect(screen.getByLabelText("Scroll right")).toBeInTheDocument();
  });

  it("renders capabilities checklists and portfolio explore links", () => {
    render(<StudioProductionSpectrum />);

    // Check capabilities are present
    expect(screen.getByText("2D Character & Motion Explainers")).toBeInTheDocument();
    expect(screen.getByText("Multi-Camera 4K Documentary Shoots")).toBeInTheDocument();
    expect(screen.getByText("Broadcast Multi-Mic Studio Recording")).toBeInTheDocument();

    // Portfolio CTA links
    expect(screen.getAllByText("Explore Portfolio").length).toBe(3);
  });

  it("filters cards when category tabs are clicked", () => {
    render(<StudioProductionSpectrum />);

    // Click 'Audio & Podcasts' filter
    const audioTab = screen.getByRole("button", { name: /Audio & Podcasts/i });
    fireEvent.click(audioTab);

    // Audio discipline should remain visible
    expect(screen.getByText("Audio Journalism & Podcasts")).toBeInTheDocument();
    // Cinema discipline should be filtered out
    expect(screen.queryByText("Cinema & Field Production")).not.toBeInTheDocument();

    // Click 'All Disciplines' to restore all
    const allTab = screen.getByRole("button", { name: /All Disciplines/i });
    fireEvent.click(allTab);
    expect(screen.getByText("Cinema & Field Production")).toBeInTheDocument();
  });
});
