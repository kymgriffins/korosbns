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
  it("renders three programme bets with stakes, success, and Read more", () => {
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

    expect(screen.queryByText("01")).not.toBeInTheDocument();
    expect(screen.queryByText("02")).not.toBeInTheDocument();
    expect(screen.queryByText("03")).not.toBeInTheDocument();

    expect(screen.queryByText(/^The gap$/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/^What we deliver$/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/^Problem$/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/^How$/i)).not.toBeInTheDocument();

    expect(
      screen.getAllByText(/Success looks like/i).length,
    ).toBeGreaterThanOrEqual(3);
    expect(screen.getAllByRole("link", { name: /Read more/i })).toHaveLength(3);

    expect(screen.getAllByText(/National Debt Forum/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/Policy Scrutiny Panel/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/County Budget Scrutiny/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/Disbursement Verification/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/Investigative Capture/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/Red Flags Investigation/i).length).toBeGreaterThanOrEqual(1);
  });
});
