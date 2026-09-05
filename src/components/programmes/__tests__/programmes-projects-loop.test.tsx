import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { ProgrammesProjectsLoop } from "../programmes-projects-loop";

describe("ProgrammesProjectsLoop", () => {
  it("renders the evidence loop header, filter tabs, and verified projects", () => {
    render(<ProgrammesProjectsLoop />);

    // Header and description
    expect(
      screen.getByText(/Public Evidence Archive · All 4 Desks/i),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/The work in motion. Screenings, barazas, animations, and audits./i),
    ).toBeInTheDocument();

    // Filter tab buttons
    expect(screen.getByTestId("filter-tab-all")).toBeInTheDocument();
    expect(screen.getByTestId("filter-tab-connect")).toBeInTheDocument();
    expect(screen.getByTestId("filter-tab-mashinani")).toBeInTheDocument();
    expect(screen.getByTestId("filter-tab-wanahabari-lab")).toBeInTheDocument();
    expect(screen.getByTestId("filter-tab-studios")).toBeInTheDocument();

    // Key real projects rendered in loop
    expect(screen.getAllByText(/Budget Sasa ni Delivery/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/Budget Ndio Story Podcast/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/Nakuru Citizen Budget Baraza/i).length).toBeGreaterThanOrEqual(1);
  });

  it("filters projects by desk when clicking desk tabs", () => {
    render(<ProgrammesProjectsLoop />);

    const mashinaniTab = screen.getByTestId("filter-tab-mashinani");
    fireEvent.click(mashinaniTab);

    // Mashinani project present
    expect(screen.getAllByText(/Nakuru Citizen Budget Baraza/i).length).toBeGreaterThanOrEqual(1);
  });
});
