import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";

import TermsPage from "../page";

describe("TermsPage", () => {
  it("renders Terms of Service heading and numbered sections", () => {
    render(<TermsPage />);
    expect(screen.getByRole("heading", { name: "Terms of Service" })).toBeInTheDocument();
    expect(screen.getByText("1. Acceptance of Terms")).toBeInTheDocument();
    expect(screen.getByText("5. Content Ownership")).toBeInTheDocument();
  });
});
