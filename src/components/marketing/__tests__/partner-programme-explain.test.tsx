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
  it("renders three programme folds with shared vocabulary titles and a single lede each", () => {
    render(<PartnerProgrammeExplainSections />);

    expect(
      screen.getByRole("heading", { name: /National budget intelligence/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /County delivery verification/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /Newsroom scrutiny/i }),
    ).toBeInTheDocument();

    expect(screen.queryByText(/^The gap$/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/^What we deliver$/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/^Problem$/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/^How$/i)).not.toBeInTheDocument();

    expect(screen.getAllByText(/James Maingi Mutinda · AFRODAD/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/Prof\. George Wajackoyah · AFRODAD/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/Town hall · Mashinani/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/Floor briefing · Mashinani/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/Field capture · Wanahabari/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/Dr\. Lyla Latif · Red Flags/i).length).toBeGreaterThanOrEqual(1);
  });
});
