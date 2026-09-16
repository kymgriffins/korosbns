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
  it("renders civic programme framing without fundraising asks", () => {
    render(<ProgrammesInvestorMatrix />);

    expect(screen.getByRole("heading", { name: /Where the work happens/i })).toBeInTheDocument();
    expect(screen.getByText(/Our programmes/i)).toBeInTheDocument();
    expect(screen.queryByText(/Discuss co-funding/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Where partners invest/i)).not.toBeInTheDocument();
  });

  it("renders the ecosystem flywheel when nodes are provided", () => {
    render(
      <ProgrammesEcosystemFlywheel
        content={{
          eyebrow: "The Closed-Loop Ecosystem",
          headline: "How the programmes connect",
          lede: "National data informs local scrutiny and newsrooms broadcast the findings.",
          nodes: [
            {
              step: "01",
              name: "National Intelligence",
              eyebrow: "Connect",
              icon: "BarChart3",
              href: "/programmes/connect",
              role: "Track",
              description: "National budget intelligence.",
              feedsTo: "County Ground Truth",
            },
            {
              step: "02",
              name: "County Ground Truth",
              eyebrow: "Mashinani",
              icon: "Building2",
              href: "/programmes/mashinani",
              role: "Verify",
              description: "County delivery verification.",
              feedsTo: "Newsroom Scrutiny",
            },
            {
              step: "03",
              name: "Newsroom Scrutiny",
              eyebrow: "Wanahabari",
              icon: "Newspaper",
              href: "/programmes/wanahabari-lab",
              role: "Publish",
              description: "Newsroom labs.",
              feedsTo: "Production",
            },
            {
              step: "04",
              name: "Production & Surplus",
              eyebrow: "Studios",
              icon: "Video",
              href: "/bns-studio",
              role: "Craft",
              description: "Civic media craft.",
              feedsTo: "National Intelligence",
            },
          ],
        }}
      />,
    );

    expect(screen.getByRole("heading", { name: /How the programmes connect/i })).toBeInTheDocument();
    expect(screen.getByText(/The Closed-Loop Ecosystem/i)).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "National Intelligence" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "County Ground Truth" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Newsroom Scrutiny" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Production & Surplus" })).toBeInTheDocument();
  });
});
