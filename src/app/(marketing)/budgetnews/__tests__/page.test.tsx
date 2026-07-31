import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";

vi.mock("../client", () => ({
  BudgetNewsHomeClient: () => <div data-testid="budget-news-home-client">Budget News Client</div>,
}));

import BudgetNewsPage from "../page";

describe("BudgetNewsPage", () => {
  it("renders BudgetNewsHomeClient inside Suspense", () => {
    render(<BudgetNewsPage />);
    expect(screen.getByTestId("budget-news-home-client")).toBeInTheDocument();
  });
});
