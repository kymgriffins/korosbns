import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";

vi.mock("../reports-client", () => ({
  ReportsClientPage: () => <div data-testid="reports-client-page">Reports Client Page</div>,
}));

import ReportsPage from "../page";

describe("ReportsPage", () => {
  it("renders ReportsClientPage cleanly", () => {
    render(<ReportsPage />);
    expect(screen.getByTestId("reports-client-page")).toBeInTheDocument();
  });
});
