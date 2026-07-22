import { describe, it, expect } from "vitest";
import { buildReportsBrief } from "@/lib/reports-brief";
import { getSeededBudgetOverview } from "@/lib/reports-api";

const schema = getSeededBudgetOverview();

describe("buildReportsBrief", () => {
  it("builds a chapter list and sector briefs with summary and takeaway", () => {
    const brief = buildReportsBrief(schema);
    expect(brief.chapters.length).toBe(6);
    expect(brief.sectors.length).toBe(schema.tier_1_national_sectors.length);
    expect(brief.sectors[0]?.summary.length).toBeGreaterThan(20);
    expect(brief.sectors[0]?.takeaway.length).toBeGreaterThan(20);
    expect(brief.revenue.lines?.length).toBeGreaterThan(0);
    expect(brief.debt.takeaway).toMatch(/borrow/i);
  });

  it("orders sectors by allocation descending", () => {
    const brief = buildReportsBrief(schema);
    const amounts = brief.sectors.map((s) => s.amountBillions);
    const sorted = [...amounts].sort((a, b) => b - a);
    expect(amounts).toEqual(sorted);
  });
});
