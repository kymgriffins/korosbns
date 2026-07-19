import { describe, it, expect } from "vitest";
import { recommendModules } from "@/lib/recommend-modules";
import type { CivicModule } from "@/types/learn";

const mods = [
  { slug: "a", title: "Budget 101", description: "Youth intro", badge: "Basics", order: 1 },
  { slug: "b", title: "County CFSP Guide", description: "County fiscal strategy", badge: "County", order: 2 },
  { slug: "c", title: "Finance Bill", description: "Tax proposals", badge: "National", order: 3 },
] as unknown as CivicModule[];

describe("recommendModules (P1 personalization)", () => {
  it("boosts county modules when county preference is set", () => {
    const picks = recommendModules(mods, { county: "Nairobi" }, 2);
    expect(picks[0].slug).toBe("b");
  });

  it("never hides modules — only reorders", () => {
    const picks = recommendModules(mods, { county: "Nairobi" }, 10);
    expect(picks).toHaveLength(3);
    expect(new Set(picks.map((p) => p.slug))).toEqual(new Set(["a", "b", "c"]));
  });
});
