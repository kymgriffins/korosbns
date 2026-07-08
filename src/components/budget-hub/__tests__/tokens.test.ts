import { describe, expect, it } from "vitest";
import {
  formatHubDate,
  learnHubItemToCard,
  moduleToJourneyCard,
} from "@/components/budget-hub/tokens/types";
import type { LearnHubItem } from "@/types/learn";
import type { CivicModule } from "@/types/learn";

describe("budget-hub tokens", () => {
  it("maps learn hub items to editorial cards", () => {
    const item: LearnHubItem = {
      id: "a1",
      content_type: "article",
      title: "Finance Bill Explained",
      summary: "A civic explainer",
      slug: "finance-bill",
      thumbnail_url: "/thumb.jpg",
      published_at: "2026-01-15T00:00:00Z",
      tags: [{ name: "Budget" }],
    };

    const card = learnHubItemToCard(item);
    expect(card.title).toBe("Finance Bill Explained");
    expect(card.href).toBe("/learn/finance-bill");
    expect(card.category).toBe("Budget");
    expect(card.imageUrl).toBe("/thumb.jpg");
  });

  it("maps civic modules to journey cards", () => {
    const module: CivicModule = {
      id: "m1",
      title: "County Budget Basics",
      slug: "county-basics",
      badge: "cb",
      badgeName: "County",
      documentName: "doc",
      archive: "",
      link: "",
      status: "published",
      credits: "",
      description: "Learn counties",
      expectations: [],
      order: 1,
      steps: [{ id: "s1" } as CivicModule["steps"][number]],
    };

    const card = moduleToJourneyCard(module);
    expect(card.href).toBe("/learn/modules/county-basics");
    expect(card.readTime).toBe("1 steps");
  });

  it("formats hub dates for Kenya locale", () => {
    const formatted = formatHubDate("2026-01-15T00:00:00Z");
    expect(formatted).toMatch(/2026/);
    expect(formatted).toMatch(/January|Jan/i);
  });
});
