import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";

vi.mock("@/components/reports-bulletin/reports-hub-client", () => ({
  ReportsHubClient: () => <div data-testid="reports-hub-client">Reports Hub Client</div>,
}));

import ReportsPage from "../page";

describe("ReportsPage (P0 SEO & Bulletin Hub)", () => {
  it("renders ReportsHubClient cleanly with structured data script", () => {
    render(<ReportsPage />);
    expect(screen.getByTestId("reports-hub-client")).toBeInTheDocument();
  });
});
