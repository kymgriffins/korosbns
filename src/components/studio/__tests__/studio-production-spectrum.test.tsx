import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { StudioProductionSpectrum } from "../StudioProductionSpectrum";

describe("StudioProductionSpectrum", () => {
  it("renders chapter title, 4 disciplines, and navigation controls", () => {
    render(<StudioProductionSpectrum />);

    // Chapter badge and headings
    expect(screen.getByText(/Chapter 03 · Production Spectrum/i)).toBeInTheDocument();
    expect(
      screen.getByText(/Four creative disciplines\. Engineered for civic impact\./i),
    ).toBeInTheDocument();

    // 4 Creative Disciplines
    expect(screen.getByText("Animation & Visual Data")).toBeInTheDocument();
    expect(screen.getByText("Cinema & Field Production")).toBeInTheDocument();
    expect(screen.getByText("Audio Journalism & Podcasts")).toBeInTheDocument();
    expect(screen.getByText("Civic Convenings & Evidence")).toBeInTheDocument();

    // Scroll controls
    expect(screen.getByLabelText("Scroll left")).toBeInTheDocument();
    expect(screen.getByLabelText("Scroll right")).toBeInTheDocument();
  });

  it("renders all 8 civic production formats with explore links", () => {
    render(<StudioProductionSpectrum />);

    // Format 01
    expect(screen.getByText("FORMAT 01")).toBeInTheDocument();
    expect(screen.getByText("Podcast & Audio")).toBeInTheDocument();

    // Format 02
    expect(screen.getByText("FORMAT 02")).toBeInTheDocument();
    expect(screen.getByText("Animations")).toBeInTheDocument();

    // Format 03
    expect(screen.getByText("FORMAT 03")).toBeInTheDocument();
    expect(screen.getByText("Explainer Videos")).toBeInTheDocument();

    // Format 04
    expect(screen.getByText("FORMAT 04")).toBeInTheDocument();
    expect(screen.getByText("Research Spotlights")).toBeInTheDocument();

    // Format 05
    expect(screen.getByText("FORMAT 05")).toBeInTheDocument();
    expect(screen.getByText("Documentaries")).toBeInTheDocument();

    // Format 06
    expect(screen.getByText("FORMAT 06")).toBeInTheDocument();
    expect(screen.getByText("Social Media Series")).toBeInTheDocument();

    // Format 07
    expect(screen.getByText("FORMAT 07")).toBeInTheDocument();
    expect(screen.getByText("Town Hall Design & Facilitation")).toBeInTheDocument();

    // Format 08
    expect(screen.getByText("FORMAT 08")).toBeInTheDocument();
    expect(screen.getByText("Community Listening Sessions")).toBeInTheDocument();
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
