import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { ProgrammesSovereignTicker } from "../programmes-sovereign-ticker";

describe("ProgrammesSovereignTicker", () => {
  it("renders live sovereign badge anchor and ticker items", () => {
    render(<ProgrammesSovereignTicker />);

    // Sovereign live anchor
    expect(screen.getByText("SOVEREIGN")).toBeInTheDocument();

    // Key advert & audit items
    expect(screen.getAllByText(/ART\. 201/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/Openness, accountability/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/National Policy Desk/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/County Grassroots Desk/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/Wanahabari Desk/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/BNS Studio Desk/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/debt servicing/i).length).toBeGreaterThanOrEqual(1);
  });
});
