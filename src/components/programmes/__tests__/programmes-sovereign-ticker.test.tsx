import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { ProgrammesSovereignTicker } from "../programmes-sovereign-ticker";

describe("ProgrammesSovereignTicker", () => {
  it("renders live sovereign ticker stream items without obstruction", () => {
    render(<ProgrammesSovereignTicker />);

    // Key advert & audit items
    expect(screen.getAllByText(/Article 201/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/Openness, accountability/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/Connect/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/Mashinani/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/Wanahabari Lab/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/BNS Studio/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/debt servicing/i).length).toBeGreaterThanOrEqual(1);
  });
});
