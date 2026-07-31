import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";

vi.mock("@/components/marketing/faq", () => ({
  default: () => <div data-testid="faq-component">FAQ Component</div>,
}));

import FAQPage from "../page";

describe("FAQPage", () => {
  it("renders FAQ component cleanly", () => {
    render(<FAQPage />);
    expect(screen.getByTestId("faq-component")).toBeInTheDocument();
  });
});
