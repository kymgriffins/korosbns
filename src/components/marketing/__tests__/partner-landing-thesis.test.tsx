import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { PartnerLandingThesis } from "../partner-landing-thesis";
import { PARTNER_LANDING_THESIS } from "@/content/partner-landing";

describe("PartnerLandingThesis", () => {
  it("renders brand thesis, who/how body, and method whisper", () => {
    render(<PartnerLandingThesis />);

    expect(
      screen.getByRole("heading", { name: PARTNER_LANDING_THESIS.title }),
    ).toBeInTheDocument();
    expect(screen.getByText(/Budget Ndio Story verifies/i)).toBeInTheDocument();
    expect(screen.getByText(PARTNER_LANDING_THESIS.method)).toBeInTheDocument();
    expect(screen.getByText(/Who we are/i)).toBeInTheDocument();
  });
});
