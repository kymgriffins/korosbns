import reportsData from "./reports-bulletin.json";

export interface ProvenanceInfo {
  source: string;
  level: string;
  analystSignoff: string;
  sourceDocumentUrl: string;
}

export interface KpiMetric {
  label: string;
  value: string;
  trend: "up" | "down" | "flat";
  change: string;
}

export interface ReportFaq {
  question: string;
  answer: string;
}

export interface ReportDossier {
  slug: string;
  title: string;
  seoTitle: string;
  seoDescription: string;
  eyebrow: string;
  category: string;
  programme: "BNS Connect" | "BNS Mashinani" | "Wanahabari Lab" | "BNS Studios";
  county: string;
  publishedDate: string;
  updatedDate: string;
  readTimeMinutes: number;
  author: string;
  provenance: ProvenanceInfo;
  kpis: KpiMetric[];
  citizenTakeaway: string[];
  content: string;
  faqs: ReportFaq[];
}

export interface FocusCountyProfile {
  code: number;
  slug: string;
  name: string;
  capital: string;
  programme: string;
  allocationKesMillion: number;
  allocationFormatted: string;
  executionRatePct: number;
  healthSharePct: number;
  educationSharePct: number;
  infrastructurePct: number;
  agricultureSharePct: number;
  osrTargetKesMillion: number;
  pendingBillsKesMillion: number;
  keyProjects: string[];
  reportSlug: string;
  summary: string;
}

export interface IndexedBudgetQuestion {
  id: string;
  question: string;
  answer: string;
  category: string;
  county: string;
  programme: string;
  relatedSlug: string;
}

export interface HubMetadata {
  title: string;
  description: string;
  publisher: string;
  fiscalYear: string;
  totalNationalBudgetKes: string;
  totalOrdinaryRevenueKes: string;
  totalDebtServiceKes: string;
  totalDevolutionKes: string;
}

export interface ReportsBulletinStore {
  hubMeta: HubMetadata;
  focusCounties: FocusCountyProfile[];
  reports: ReportDossier[];
  indexedQuestions: IndexedBudgetQuestion[];
}

export const REPORTS_BULLETIN_DATA = reportsData as ReportsBulletinStore;

export function getAllReports(): ReportDossier[] {
  return REPORTS_BULLETIN_DATA.reports;
}

export function getReportBySlug(slug: string): ReportDossier | undefined {
  return REPORTS_BULLETIN_DATA.reports.find((r) => r.slug === slug);
}

export function getFocusCounties(): FocusCountyProfile[] {
  return REPORTS_BULLETIN_DATA.focusCounties;
}

export function getFocusCountyBySlug(slug: string): FocusCountyProfile | undefined {
  return REPORTS_BULLETIN_DATA.focusCounties.find((c) => c.slug === slug);
}

export function getIndexedQuestions(): IndexedBudgetQuestion[] {
  return REPORTS_BULLETIN_DATA.indexedQuestions;
}

export function searchBudgetQuestions(
  query: string,
  categoryFilter?: string,
  countyFilter?: string,
  programmeFilter?: string,
): {
  matchingQuestions: IndexedBudgetQuestion[];
  matchingReports: ReportDossier[];
} {
  const q = query.trim().toLowerCase();

  const matchingQuestions = REPORTS_BULLETIN_DATA.indexedQuestions.filter((item) => {
    const matchesQuery =
      !q ||
      item.question.toLowerCase().includes(q) ||
      item.answer.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q) ||
      item.county.toLowerCase().includes(q);

    const matchesCategory =
      !categoryFilter || categoryFilter === "All" || item.category === categoryFilter;
    const matchesCounty =
      !countyFilter || countyFilter === "All" || item.county === countyFilter;
    const matchesProgramme =
      !programmeFilter || programmeFilter === "All" || item.programme === programmeFilter;

    return matchesQuery && matchesCategory && matchesCounty && matchesProgramme;
  });

  const matchingReports = REPORTS_BULLETIN_DATA.reports.filter((report) => {
    const matchesQuery =
      !q ||
      report.title.toLowerCase().includes(q) ||
      report.content.toLowerCase().includes(q) ||
      report.category.toLowerCase().includes(q) ||
      report.county.toLowerCase().includes(q);

    const matchesCategory =
      !categoryFilter || categoryFilter === "All" || report.category === categoryFilter;
    const matchesCounty =
      !countyFilter ||
      countyFilter === "All" ||
      report.county === countyFilter ||
      (countyFilter !== "National" && report.county === "All 47 Counties");
    const matchesProgramme =
      !programmeFilter || programmeFilter === "All" || report.programme === programmeFilter;

    return matchesQuery && matchesCategory && matchesCounty && matchesProgramme;
  });

  return { matchingQuestions, matchingReports };
}
