import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";

vi.mock("@/components/learn/learn-tab-page", () => ({
  LearnTabPage: ({ title, description }: { title: string; description: string }) => (
    <div data-testid="learn-tab-page-quests">
      <h1>{title}</h1>
      <p>{description}</p>
    </div>
  ),
  useLearnSummary: () => ({}),
}));

import LearnQuestsPage from "../page";

describe("LearnQuestsPage", () => {
  it("renders LearnTabPage for Quests cleanly", () => {
    render(<LearnQuestsPage />);
    expect(screen.getByTestId("learn-tab-page-quests")).toBeInTheDocument();
    expect(screen.getByText("Quests")).toBeInTheDocument();
  });
});
