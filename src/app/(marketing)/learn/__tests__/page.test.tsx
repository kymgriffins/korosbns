import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";

const mockRedirect = vi.fn();
vi.mock("next/navigation", () => ({
  redirect: (url: string) => mockRedirect(url),
}));

vi.mock("@/components/learn-hub/LearnHubHome", () => ({
  LearnHubHome: () => (
    <div data-testid="learn-hub-home">Learn Hub Home</div>
  ),
}));

vi.mock("@/lib/learn-nav", () => ({
  legacyLearnTabRedirect: (tab: string | null) => (tab === "old" ? "/learn/modules" : null),
}));

import LearnPage from "../page";

describe("LearnPage", () => {
  it("renders LearnHubHome cleanly for standard tab", async () => {
    const pageElement = await LearnPage({ searchParams: Promise.resolve({ tab: undefined }) });
    render(pageElement);
    expect(screen.getByTestId("learn-hub-home")).toBeInTheDocument();
  });

  it("redirects when legacy tab parameter is passed", async () => {
    await LearnPage({ searchParams: Promise.resolve({ tab: "old" }) });
    expect(mockRedirect).toHaveBeenCalledWith("/learn/modules");
  });
});
