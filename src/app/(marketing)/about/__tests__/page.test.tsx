import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";

vi.mock("@/components/marketing/about", () => ({
  default: () => <div data-testid="about-component">About Component</div>,
}));

import AboutPage from "../page";

describe("AboutPage", () => {
  it("renders the About component cleanly", async () => {
    const Component = await AboutPage();
    render(Component);
    expect(screen.getByTestId("about-component")).toBeInTheDocument();
  });
});
