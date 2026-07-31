import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";

vi.mock("@/components/learn/learn-paths-home", () => ({
  LearnPathsHome: ({ tab }: { tab: string }) => (
    <div data-testid="learn-paths-home-forum">Forum Tab - {tab}</div>
  ),
}));

import LearnForumPage from "../page";

describe("LearnForumPage", () => {
  it("renders LearnPathsHome with forum tab", () => {
    render(<LearnForumPage />);
    expect(screen.getByTestId("learn-paths-home-forum")).toBeInTheDocument();
  });
});
