import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";

import SecurityPage from "../page";

describe("SecurityPage", () => {
  it("renders Security page headings and security practices sections", () => {
    render(<SecurityPage />);
    expect(screen.getByRole("heading", { name: "Security" })).toBeInTheDocument();
    expect(screen.getByText("Encryption in Transit")).toBeInTheDocument();
    expect(screen.getByText("Vulnerability Disclosure Policy")).toBeInTheDocument();
  });
});
