import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { ProgrammesInvestorMatrix } from "../programmes-investor-matrix";
import { ProgrammesEcosystemFlywheel } from "../programmes-ecosystem-flywheel";

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

describe("ProgrammesInvestorMatrix & EcosystemFlywheel", () => {
  it("renders the 3 Big Bets with investor deliverables and BNS Studio", () => {
    render(<ProgrammesInvestorMatrix />);

    // Section title
    expect(screen.getByRole("heading", { name: /Where partners invest/i })).toBeInTheDocument();

    // 3 Big Bets
    expect(screen.getByText("BNS Connect")).toBeInTheDocument();
    expect(screen.getByText("BNS Mashinani")).toBeInTheDocument();
    expect(screen.getByText("Wanahabari Lab")).toBeInTheDocument();

    // Investor outputs/deliverables
    expect(screen.getByText(/Quarterly National Fiscal Briefs/i)).toBeInTheDocument();
    expect(screen.getByText(/Quarterly County Budget Scorecards/i)).toBeInTheDocument();
    expect(screen.getByText(/4 Fiscal-Calendar Intensives/i)).toBeInTheDocument();

    // Verification methodology
    expect(screen.getByRole("heading", { name: /How we work/i })).toBeInTheDocument();
    expect(screen.getByText(/Ingest & Trace/i)).toBeInTheDocument();
    expect(screen.getByText(/Triangulate & Verify/i)).toBeInTheDocument();
    expect(screen.getByText(/Frame & Publish/i)).toBeInTheDocument();
    expect(screen.getByText(/Convene & Hold Pressure/i)).toBeInTheDocument();

    // BNS Studio Sustainable Engine
    expect(screen.getByText(/The Sustainable Engine/i)).toBeInTheDocument();
    expect(screen.getByText(/2× Impact/i)).toBeInTheDocument();
  });

  it("renders the Closed-Loop Ecosystem Flywheel", () => {
    render(<ProgrammesEcosystemFlywheel />);

    expect(screen.getByRole("heading", { name: /How the programmes connect/i })).toBeInTheDocument();
    expect(screen.getByText(/The Closed-Loop Ecosystem/i)).toBeInTheDocument();

    // 4 interconnected nodes
    expect(screen.getByText("National Intelligence")).toBeInTheDocument();
    expect(screen.getByText("County Ground Truth")).toBeInTheDocument();
    expect(screen.getByText("Newsroom Scrutiny")).toBeInTheDocument();
    expect(screen.getByText("Production & Surplus")).toBeInTheDocument();
  });
});
