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
  headquarters: string;
  governor: string;
  officialWebsite: string;
  budgetPortalUrl: string;
  population: string;
  subCountiesCount: number;
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

export interface BetaPillar {
  id: string;
  name: string;
  icon: string;
  tagline: string;
  nationalAllocationKesBillion: number;
  description: string;
  keyCounties: string[];
}

export interface TrackedProject {
  id: string;
  name: string;
  county: string;
  sector: string;
  betaPillar: string;
  budgetFormatted: string;
  status: string;
  location: string;
  description: string;
  reportSlug: string;
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
  betaPillars: BetaPillar[];
  focusCounties: FocusCountyProfile[];
  trackedProjects: TrackedProject[];
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

export function getCountyBySlug(slug: string): FocusCountyProfile | undefined {
  return REPORTS_BULLETIN_DATA.focusCounties.find((c) => c.slug === slug);
}

export function getBetaPillars(): BetaPillar[] {
  return REPORTS_BULLETIN_DATA.betaPillars || [];
}

export function getTrackedProjects(): TrackedProject[] {
  return REPORTS_BULLETIN_DATA.trackedProjects || [];
}

export function getIndexedQuestions(): IndexedBudgetQuestion[] {
  return REPORTS_BULLETIN_DATA.indexedQuestions;
}

export function searchBudgetQuestions(
  query: string,
  category?: string,
  county?: string,
  programme?: string,
): {
  matchingQuestions: IndexedBudgetQuestion[];
  matchingReports: ReportDossier[];
} {
  const q = (query || "").trim().toLowerCase();

  const matchingQuestions = REPORTS_BULLETIN_DATA.indexedQuestions.filter((item) => {
    const matchesQuery =
      !q ||
      item.question.toLowerCase().includes(q) ||
      item.answer.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q) ||
      item.county.toLowerCase().includes(q);

    const matchesCategory =
      !category || category === "All" || item.category.toLowerCase().includes(category.toLowerCase());
    const matchesCounty =
      !county || county === "All" || item.county.toLowerCase().includes(county.toLowerCase());
    const matchesProgramme =
      !programme || programme === "All" || item.programme === programme;

    return matchesQuery && matchesCategory && matchesCounty && matchesProgramme;
  });

  const matchingReports = REPORTS_BULLETIN_DATA.reports.filter((rep) => {
    const matchesQuery =
      !q ||
      rep.title.toLowerCase().includes(q) ||
      rep.seoDescription.toLowerCase().includes(q) ||
      rep.content.toLowerCase().includes(q) ||
      rep.category.toLowerCase().includes(q) ||
      rep.county.toLowerCase().includes(q);

    const matchesCategory =
      !category || category === "All" || rep.category.toLowerCase().includes(category.toLowerCase());
    const matchesCounty =
      !county || county === "All" || rep.county.toLowerCase().includes(county.toLowerCase());
    const matchesProgramme =
      !programme || programme === "All" || rep.programme === programme;

    return matchesQuery && matchesCategory && matchesCounty && matchesProgramme;
  });

  return { matchingQuestions, matchingReports };
}
