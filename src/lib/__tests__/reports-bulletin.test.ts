import { describe, it, expect } from "vitest";
import {
  getAllReports,
  getReportBySlug,
  getFocusCounties,
  getCountyBySlug,
  getBetaPillars,
  getTrackedProjects,
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

  it("contains complete profiles for the 4 BNS Mashinani focus counties with portals and governors", () => {
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
      expect(c.governor).toBeTruthy();
      expect(c.officialWebsite.startsWith("https://")).toBe(true);
      expect(c.budgetPortalUrl.startsWith("https://")).toBe(true);
      expect(c.keyProjects.length).toBeGreaterThanOrEqual(2);
      expect(c.reportSlug).toBeTruthy();

      // Ensure matching report dossier exists
      const matchingReport = getReportBySlug(c.reportSlug);
      expect(matchingReport).toBeDefined();
    }
  });

  it("loads 5 core BETA Bottom-Up pillars and tracked projects", () => {
    const pillars = getBetaPillars();
    expect(pillars).toHaveLength(5);
    expect(pillars.map((p) => p.id)).toEqual([
      "agriculture",
      "msme",
      "housing",
      "health",
      "digital",
    ]);

    const projects = getTrackedProjects();
    expect(projects.length).toBeGreaterThanOrEqual(10);
    for (const proj of projects) {
      expect(proj.id).toBeTruthy();
      expect(proj.name).toBeTruthy();
      expect(proj.county).toBeTruthy();
      expect(proj.sector).toBeTruthy();
      expect(proj.budgetFormatted).toBeTruthy();
      expect(proj.status).toBeTruthy();
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
    expect(debt?.programme).toBe("Wanahabari Lab");
  });

  it("searches and filters budget questions with zero latency", () => {
    const questions = getIndexedQuestions();
    expect(questions.length).toBeGreaterThanOrEqual(10);

    const nationalQuery = searchBudgetQuestions("debt", "Debt & Deficit");
    expect(nationalQuery.matchingQuestions.length).toBeGreaterThan(0);
    expect(
      nationalQuery.matchingQuestions.some((q) =>
        q.question.toLowerCase().includes("debt"),
      ),
    ).toBe(true);

    const kakamegaQuery = searchBudgetQuestions("", "All", "Kakamega");
    expect(kakamegaQuery.matchingQuestions.length).toBeGreaterThan(0);
    expect(
      kakamegaQuery.matchingQuestions.every((q) => q.county === "Kakamega"),
    ).toBe(true);
  });
});
