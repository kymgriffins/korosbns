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
    expect(screen.getAllByText(/Desk 01 · Policy/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/Desk 02 · County/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/Desk 03 · Wanahabari/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/Desk 04 · BNS Studio/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/debt servicing/i).length).toBeGreaterThanOrEqual(1);
  });
});
