import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";

vi.mock("@/components/marketing/help-center-client", () => ({
  default: () => <div data-testid="help-center-client">Help Center Component</div>,
}));

import FAQPage from "../page";

describe("FAQPage", () => {
  it("renders FAQ and Help Center cleanly", () => {
    render(<FAQPage />);
    expect(screen.getByTestId("help-center-client")).toBeInTheDocument();
  });
});

