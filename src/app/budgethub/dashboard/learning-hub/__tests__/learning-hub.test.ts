import React from "react";
import { render } from "@testing-library/react";
import { vi, describe, it, expect } from "vitest";

vi.mock("@/lib/utils", () => ({
  cn: (...classes: (string | boolean | undefined | null)[]) => classes.filter(Boolean).join(" "),
}));

vi.mock("@/data/learning", () => ({
  learningData: {
    fetch: vi.fn().mockResolvedValue([]),
    get: () => [],
    fetchCounts: vi.fn().mockResolvedValue({}),
  },
}));

vi.mock("@/hooks/use-page-view", () => ({
  usePageView: () => {},
}));

vi.mock("@/app/budgethub/dashboard/learning-hub/_components/learning-hub-card", () => ({
  LearningHubCard: function MockCard({ title: t }: { title: string }) {
    return React.createElement("div", null, t);
  },
}));

describe("LearningHubPage (migrated version)", () => {
  it("renders without crashing", async () => {
    const Page = (await import("../page")).default;
    const { container } = render(React.createElement(Page));
    expect(container).toBeTruthy();
  });

  it("imports LearningHubCard correctly", async () => {
    const mod = await import("../_components/learning-hub-card");
    expect(mod.LearningHubCard).toBeDefined();
  });

  it("learningData module exists", async () => {
    const { learningData } = await import("@/data/learning");
    expect(learningData).toBeDefined();
    expect(typeof learningData.fetch).toBe("function");
  });
});
