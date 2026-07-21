import { describe, expect, it } from "vitest";
import {
  BUDGET_YEARS,
  DEFAULT_BUDGET_YEAR_ID,
  getBudgetYear,
  verificationBadgeText,
} from "@/data/budget-years-catalogue";
import { getFyEpisode, listInAppEpisodes } from "@/lib/budget-episodes";

describe("budget FY episode catalogue (P0)", () => {
  it("lists independence → 2026/27 with honest statuses", () => {
    expect(BUDGET_YEARS[0]?.id).toBe("1963/64");
    expect(BUDGET_YEARS[BUDGET_YEARS.length - 1]?.id).toBe("2026/27");
    expect(getBudgetYear("1963/64")?.status).toBe("GAP");
    expect(getBudgetYear("2000/01")?.status).toBe("SOURCE_LISTED");
    expect(getBudgetYear("2025/26")?.status).toBe("IN_APP");
    expect(getBudgetYear("2026/27")?.status).toBe("IN_APP");
  });

  it("ships IN_APP episodes for 2025/26 and 2026/27 without claiming TESTED_TRUE", () => {
    const episodes = listInAppEpisodes();
    expect(episodes.map((e) => e.fy).sort()).toEqual(["2025/26", "2026/27"]);
    for (const ep of episodes) {
      expect(ep.status).toBe("IN_APP");
      expect(verificationBadgeText(ep.status)).toMatch(/promote to TESTED_TRUE/i);
      expect(ep.metrics.total_expenditure_billions).toBeGreaterThan(0);
      expect(ep.sources.length).toBeGreaterThan(0);
      expect(ep.top_sectors.length).toBeGreaterThanOrEqual(5);
    }
  });

  it("includes citizen impact blurbs only for 2026/27 from seed narrative", () => {
    expect(getFyEpisode("2025/26")?.citizen_impact).toBeNull();
    const impact = getFyEpisode(DEFAULT_BUDGET_YEAR_ID)?.citizen_impact;
    expect(impact?.blurbs.length).toBeGreaterThan(0);
    expect(impact?.source_note).toMatch(/seed/i);
    expect(impact?.blurbs.some((b) => /96,400/.test(b.text))).toBe(true);
  });

  it("does not invent metrics for GAP years", () => {
    expect(getFyEpisode("1975/76")).toBeUndefined();
    expect(getFyEpisode("2013/14")).toBeUndefined();
  });
});
