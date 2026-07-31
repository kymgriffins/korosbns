import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";

const mockRedirect = vi.fn();
vi.mock("next/navigation", () => ({
  redirect: (url: string) => mockRedirect(url),
}));

vi.mock("@/components/learn/learn-paths-home", () => ({
  LearnPathsHome: ({ tab }: { tab: string }) => (
    <div data-testid="learn-paths-home">Learn Paths Home - {tab}</div>
  ),
}));

vi.mock("@/lib/learn-nav", () => ({
  legacyLearnTabRedirect: (tab: string | null) => (tab === "old" ? "/learn/modules" : null),
}));

import LearnPage from "../page";

describe("LearnPage", () => {
  it("renders LearnPathsHome cleanly for standard tab", async () => {
    const pageElement = await LearnPage({ searchParams: Promise.resolve({ tab: undefined }) });
    render(pageElement);
    expect(screen.getByTestId("learn-paths-home")).toBeInTheDocument();
  });

  it("redirects when legacy tab parameter is passed", async () => {
    await LearnPage({ searchParams: Promise.resolve({ tab: "old" }) });
    expect(mockRedirect).toHaveBeenCalledWith("/learn/modules");
  });
});
