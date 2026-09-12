import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { ProgrammesProjectsLoop } from "../programmes-projects-loop";

describe("ProgrammesProjectsLoop", () => {
  it("renders the evidence loop header, filter tabs, and verified projects", () => {
    render(<ProgrammesProjectsLoop />);

    // Header and description
    expect(
      screen.getByText(/Public Evidence Archive · Programmes & Studio/i),
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

  it("links directly to programme pages on click", () => {
    render(<ProgrammesProjectsLoop />);

    const projectLinks = screen.getAllByRole("link");
    const nakuruLink = projectLinks.find((link) =>
      link.getAttribute("href")?.includes("/programmes/mashinani"),
    );
    expect(nakuruLink).toBeDefined();
    expect(nakuruLink?.getAttribute("href")).toBe("/programmes/mashinani");
  });

  it("filters productions when typing in the search input and routes Project TERRA to programme page", () => {
    render(<ProgrammesProjectsLoop />);

    const searchInput = screen.getByPlaceholderText(/Search projects/i);
    expect(searchInput).toBeInTheDocument();

    // Type 'Terra'
    fireEvent.change(searchInput, { target: { value: "Terra" } });

    // Should find Project TERRA
    expect(screen.getByText(/Project TERRA/i)).toBeInTheDocument();

    // Verify it links to a programme or studio page (not /bns-project/terra)
    const terraLink = screen.getAllByRole("link").find((link) =>
      link.getAttribute("href")?.includes("/programmes/") || link.getAttribute("href")?.includes("/bns-studio")
    );
    expect(terraLink).toBeDefined();
  });

  it("shows empty state when no productions match search query", () => {
    render(<ProgrammesProjectsLoop />);

    const searchInput = screen.getByPlaceholderText(/Search projects/i);
    fireEvent.change(searchInput, { target: { value: "xyznonexistent999" } });

    expect(screen.getByText(/No productions found matching/i)).toBeInTheDocument();
    expect(screen.getByText(/Clear Search Query/i)).toBeInTheDocument();

    // Reset search
    fireEvent.click(screen.getByText(/Clear Search Query/i));
    expect(screen.getAllByText(/Budget Sasa ni Delivery/i).length).toBeGreaterThanOrEqual(1);
  });
});
