"use client";

import {
  fetchBudgetFiscalYears,
  fetchBudgetAllocations,
  fetchBudgetKpis,
  fetchBudgetEntities,
  fetchBudgetHighlights,
  type BudgetFiscalYear,
  type BudgetAllocation,
  type BudgetKpiRaw,
  type BudgetEntity,
  type BudgetHighlightRaw,
} from "@/lib/budget-api";

export type ReportCategory =
  | "national"
  | "county"
  | "defense"
  | "development"
  | "revenue"
  | "sector"
  | "debt";

export interface ReportMeta {
  slug: string;
  title: string;
  description: string;
  category: ReportCategory;
  icon: string;
  featured?: boolean;
}

export const REPORTS: ReportMeta[] = [
  {
    slug: "budget-overview",
    title: "Budget Overview",
    description: "High-level national budget KPIs including total revenue, expenditure, deficit, and sector breakdown.",
    category: "national",
    icon: "Landmark",
    featured: true,
  },
  {
    slug: "county-budgets",
    title: "County Budgets",
    description: "Budget allocations across all 47 counties with top recipients, equitable share, and own-source revenue analysis.",
    category: "county",
    icon: "Building2",
    featured: true,
  },
  {
    slug: "defense-security",
    title: "Defense & Security",
    description: "Allocations to national defense, internal security, intelligence, and peace-building initiatives.",
    category: "defense",
    icon: "Shield",
  },
  {
    slug: "development-projects",
    title: "Development & Projects",
    description: "Development vs recurrent split, capital project investments, and sector-level development allocations.",
    category: "development",
    icon: "Target",
  },
  {
    slug: "revenue-analysis",
    title: "Revenue Analysis",
    description: "Tax and non-tax revenue composition, collection performance, and year-over-year revenue trends.",
    category: "revenue",
    icon: "Banknote",
  },
  {
    slug: "sector-allocations",
    title: "Sector Allocations",
    description: "Budget distribution across economic sectors including education, health, infrastructure, and agriculture.",
    category: "sector",
    icon: "PieChart",
  },
];

export function getReportBySlug(slug: string): ReportMeta | undefined {
  return REPORTS.find((r) => r.slug === slug);
}

export function getCategoryLabel(cat: ReportCategory): string {
  const labels: Record<ReportCategory, string> = {
    national: "National",
    county: "County",
    defense: "Defense",
    development: "Development",
    revenue: "Revenue",
    sector: "Sector",
    debt: "Debt",
  };
  return labels[cat];
}

export interface ReportPageData {
  fiscalYears: BudgetFiscalYear[];
  allocations: BudgetAllocation[];
  kpis: BudgetKpiRaw[];
  entities: BudgetEntity[];
  highlights: BudgetHighlightRaw[];
  selectedYear: string;
}

export async function fetchReportData(slug: string, year?: string): Promise<ReportPageData> {
  const [yearsRes, entitiesRes] = await Promise.all([
    fetchBudgetFiscalYears(),
    fetchBudgetEntities(),
  ]);

  const fiscalYears = yearsRes;
  const entities = entitiesRes;
  const targetYear = year || yearsRes.find((y) => y.is_current)?.id || yearsRes[0]?.id || "";
  let allocations: BudgetAllocation[] = [];
  let kpis: BudgetKpiRaw[] = [];
  let highlights: BudgetHighlightRaw[] = [];

  if (targetYear) {
    const [allocRes, kpiRes, hlRes] = await Promise.all([
      fetchBudgetAllocations({ fiscal_year: targetYear }),
      fetchBudgetKpis({ fiscal_year: targetYear }),
      fetchBudgetHighlights({ fiscal_year: targetYear }),
    ]);
    allocations = allocRes;
    kpis = kpiRes;
    highlights = hlRes;
  }

  return { fiscalYears, entities, allocations, kpis, highlights, selectedYear: targetYear };
}
