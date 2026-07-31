import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";

import PrivacyPage from "../page";

describe("PrivacyPage", () => {
  it("renders Privacy Policy headings and sections", () => {
    render(<PrivacyPage />);
    expect(screen.getByRole("heading", { name: "Privacy Policy" })).toBeInTheDocument();
    expect(screen.getByText("Data We Collect")).toBeInTheDocument();
    expect(screen.getByText("Your Rights (Under Kenya DPA 2019)")).toBeInTheDocument();
    expect(screen.getByText("Cookie Policy")).toBeInTheDocument();
  });
});
