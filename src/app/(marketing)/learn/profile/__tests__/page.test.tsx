import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";

vi.mock("@/components/learn/learn-paths-home", () => ({
  LearnPathsHome: ({ tab }: { tab: string }) => (
    <div data-testid="learn-paths-home-profile">Profile Tab - {tab}</div>
  ),
}));

import LearnProfilePage from "../page";

describe("LearnProfilePage", () => {
  it("renders LearnPathsHome with profile tab", () => {
    render(<LearnProfilePage />);
    expect(screen.getByTestId("learn-paths-home-profile")).toBeInTheDocument();
  });
});
