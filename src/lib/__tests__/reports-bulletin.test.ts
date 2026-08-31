import { describe, it, expect } from "vitest";
import {
  getAllReports,
  getReportBySlug,
  getFocusCounties,
  getFocusCountyBySlug,
  getIndexedQuestions,
  searchBudgetQuestions,
} from "@/data/reports-bulletin";

describe("Reports Bulletin Data Store (P0 Trust & SEO)", () => {
  it("loads all verified report dossiers with valid provenance and FAQs", () => {
    const reports = getAllReports();
    expect(reports.length).toBeGreaterThanOrEqual(8);

    for (const r of reports) {
      expect(r.slug).toBeTruthy();
      expect(r.title).toBeTruthy();
      expect(r.seoTitle).toBeTruthy();
      expect(r.seoDescription).toBeTruthy();
      expect(r.citizenTakeaway.length).toBeGreaterThan(0);
      expect(r.faqs.length).toBeGreaterThan(0);
      expect(r.provenance.source).toBeTruthy();
      expect(r.provenance.level).toBeTruthy();
    }
  });

  it("contains complete profiles for the 4 BNS Mashinani focus counties", () => {
    const counties = getFocusCounties();
    expect(counties).toHaveLength(4);

    const slugs = counties.map((c) => c.slug).sort();
    expect(slugs).toEqual(["kakamega", "kilifi", "nakuru", "wajir"]);

    for (const c of counties) {
      expect(c.allocationKesMillion).toBeGreaterThan(0);
      expect(c.executionRatePct).toBeGreaterThan(0);
      expect(c.healthSharePct).toBeGreaterThan(0);
      expect(c.infrastructurePct).toBeGreaterThan(0);
      expect(c.agricultureSharePct).toBeGreaterThan(0);
      expect(c.keyProjects.length).toBeGreaterThanOrEqual(2);
      expect(c.reportSlug).toBeTruthy();
      // Ensure matching report dossier exists
      const matchingReport = getReportBySlug(c.reportSlug);
      expect(matchingReport).toBeDefined();
    }
  });

  it("resolves specific report dossiers by slug", () => {
    const national = getReportBySlug("national-budget-2026-2027-breakdown");
    expect(national).toBeDefined();
    expect(national?.category).toBe("National Budget");
    expect(national?.programme).toBe("BNS Connect");

    const kakamega = getReportBySlug("kakamega-county-budget-execution-2026");
    expect(kakamega).toBeDefined();
    expect(kakamega?.county).toBe("Kakamega");

    const debt = getReportBySlug("kenya-public-debt-servicing-crisis-analysis");
    expect(debt).toBeDefined();
    expect(debt?.kpis.some((k) => k.label.includes("Debt"))).toBe(true);
  });

  it("performs fast question search & filtering without runtime latency", () => {
    const search1 = searchBudgetQuestions("debt");
    expect(search1.matchingQuestions.length).toBeGreaterThan(0);
    expect(search1.matchingReports.length).toBeGreaterThan(0);

    const searchKakamega = searchBudgetQuestions("", "All", "Kakamega", "All");
    expect(searchKakamega.matchingQuestions.some((q) => q.county === "Kakamega")).toBe(true);

    const searchMashinani = searchBudgetQuestions("", "All", "All", "BNS Mashinani");
    expect(searchMashinani.matchingQuestions.every((q) => q.programme === "BNS Mashinani")).toBe(true);
  });
});
