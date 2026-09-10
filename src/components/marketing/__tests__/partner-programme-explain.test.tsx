import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { PartnerProgrammeExplainSections } from "../partner-programme-explain";

vi.mock("next/image", () => ({
  default: (props: { alt?: string }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img alt={props.alt ?? ""} />
  ),
}));

describe("PartnerProgrammeExplainSections", () => {
  it("renders three programme how/why sections with project evidence captions", () => {
    render(<PartnerProgrammeExplainSections />);

    expect(
      screen.getByRole("heading", { name: /How Connect watches the national budget/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /How Mashinani follows money into counties/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        name: /How Wanahabari keeps scrutiny after Budget Day/i,
      }),
    ).toBeInTheDocument();

    expect(screen.getAllByText(/James Maingi Mutinda · AFRODAD/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/Prof\. George Wajackoyah/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/Nelly Maina · Budget Mtaani/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/Dr\. Lyla Latif · House of Fiscal Wisdom/i).length).toBeGreaterThanOrEqual(1);
  });
});
