import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import LandingHero from "../landing-hero";

vi.mock("@/motion/gsap", () => ({
  GsapHeroChoreography: ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <div className={className}>{children}</div>
  ),
}));

vi.mock("@/components/marketing/landing-tiktok-phone", () => ({
  LandingTikTokPhone: () => <div data-testid="landing-tiktok-phone" />,
}));

describe("LandingHero", () => {
  it("renders brand pill, live news wire ticker, headline, and single mobile CTA", () => {
    render(<LandingHero />);

    // Brand tag
    expect(screen.getByText(/Budget Ndio Story/i)).toBeInTheDocument();

    // Live news wire telemetry ticker
    expect(screen.getByText(/WIRE/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Education Sector/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/BNS Studio/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/Calvina Praise/i).length).toBeGreaterThanOrEqual(1);

    // Headline
    expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();

    // Primary CTA (always visible)
    const primaryCta = screen.getByRole("link", { name: /Explore Programmes/i });
    expect(primaryCta).toBeInTheDocument();

    // Secondary CTA exists for sm+ viewports but is hidden on mobile
    const secondaryCta = screen.getByRole("link", { name: /Civic Learning Hub/i });
    expect(secondaryCta).toBeInTheDocument();
    expect(secondaryCta).toHaveClass("hidden", "sm:inline-flex");
  });
});
