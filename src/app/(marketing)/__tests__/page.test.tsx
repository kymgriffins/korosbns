import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";

vi.mock("@/components/global/background", () => ({
  default: () => <div data-testid="global-background" />,
}));

vi.mock("@/components/marketing/premium-landing-client", () => ({
  default: () => <div data-testid="premium-landing-client">Premium Landing Client</div>,
}));

import HomePage from "../page";

describe("HomePage", () => {
  it("renders background and premium landing client without crashing", async () => {
    const Component = await HomePage();
    render(Component);
    expect(screen.getByTestId("global-background")).toBeInTheDocument();
    expect(screen.getByTestId("premium-landing-client")).toBeInTheDocument();
  });
});
