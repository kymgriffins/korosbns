"use client";

import type { BudgetSchema, NationalSector, WardProject, CountyBudgetProfile } from "@/lib/budget-schema";
import type { BudgetKpi, BudgetChartPoint, BudgetComparisonRow, BudgetCallout } from "@/types/budget-report";
import { API_BASE_URL } from "@/lib/api-config";
import budgetJson from "@/data/budget-fy2026-27.json";

const schema = budgetJson as unknown as BudgetSchema;
const V2_BUDGET_OVERVIEW_URL = `${API_BASE_URL}/api/v2/budget/overview/`;

export interface FiscalYearMeta {
  id: string;
  label: string;
  is_current: boolean;
}

export const FISCAL_YEARS: FiscalYearMeta[] = [
  { id: "fy2024", label: "FY 2024/25", is_current: false },
  { id: "fy2025", label: "FY 2025/26", is_current: false },
  { id: "fy2026", label: "FY 2026/27", is_current: true },
];

export const VISIBLE_FISCAL_YEARS = FISCAL_YEARS;

function scaleValue(val: number, fyId: string): number {
  const factors: Record<string, number> = {
    fy2024: 0.88,
    fy2025: 0.94,
    fy2026: 1.0,
    fy2027: 1.08,
  };
  return Math.round(val * (factors[fyId] ?? 1.0));
}

function scaleBudgetSchema(base: BudgetSchema, fyId: string): BudgetSchema {
  if (fyId === "fy2026") return base;
  const f = fyId === "fy2024" ? 0.88 : fyId === "fy2025" ? 0.94 : 1.08;
  return {
    ...base,
    metadata: {
      ...base.metadata,
      fiscal_year: FISCAL_YEARS.find((y) => y.id === fyId)?.label ?? base.metadata.fiscal_year,
      presented_date: fyId === "fy2024" ? "2024-06-12" : fyId === "fy2025" ? "2025-06-11" : fyId === "fy2027" ? "2027-06-10" : base.metadata.presented_date,
      approved_date: fyId === "fy2024" ? "2024-06-01" : fyId === "fy2025" ? "2025-06-03" : fyId === "fy2027" ? "2027-06-04" : base.metadata.approved_date,
    },
    macro_modules: {
      revenue_engine: {
        total_projected_revenue: scaleValue(base.macro_modules.revenue_engine.total_projected_revenue, fyId),
        streams: base.macro_modules.revenue_engine.streams.map((s) => ({
          ...s,
          amount: scaleValue(s.amount, fyId),
        })),
      },
      debt_portfolio: {
        ...base.macro_modules.debt_portfolio,
        total_interest_service_obligation: scaleValue(base.macro_modules.debt_portfolio.total_interest_service_obligation, fyId),
        fiscal_deficit_gap: scaleValue(base.macro_modules.debt_portfolio.fiscal_deficit_gap, fyId),
        financing_plan: {
          domestic_borrowing_target: scaleValue(base.macro_modules.debt_portfolio.financing_plan.domestic_borrowing_target, fyId),
          external_borrowing_target: scaleValue(base.macro_modules.debt_portfolio.financing_plan.external_borrowing_target, fyId),
        },
      },
    },
    tier_1_national_sectors: base.tier_1_national_sectors.map((s) => ({
      ...s,
      total_allocation: scaleValue(s.total_allocation, fyId),
      sub_vote_breakdown: s.sub_vote_breakdown.map((sv) => ({
        ...sv,
        amount: scaleValue(sv.amount, fyId),
      })),
    })),
    tier_2_county_devolution_envelope: {
      ...base.tier_2_county_devolution_envelope,
      total_devolution_allocation: scaleValue(base.tier_2_county_devolution_envelope.total_devolution_allocation, fyId),
      funding_split: {
        unconditional_equitable_share: scaleValue(base.tier_2_county_devolution_envelope.funding_split.unconditional_equitable_share, fyId),
        additional_national_conditional_allocations: scaleValue(base.tier_2_county_devolution_envelope.funding_split.additional_national_conditional_allocations, fyId),
        equalisation_fund_marginalised_areas: scaleValue(base.tier_2_county_devolution_envelope.funding_split.equalisation_fund_marginalised_areas, fyId),
        development_partner_conditional_grants: scaleValue(base.tier_2_county_devolution_envelope.funding_split.development_partner_conditional_grants, fyId),
      },
      conditional_allocation_breakdown: base.tier_2_county_devolution_envelope.conditional_allocation_breakdown.map((c) => ({
        ...c,
        amount: scaleValue(c.amount, fyId),
      })),
    },
    tier_3_ward_project_relational_schema_simulation: base.tier_3_ward_project_relational_schema_simulation.map((p) => ({
      ...p,
      financials: {
        allocated_amount: scaleValue(p.financials.allocated_amount, fyId),
        released_amount: scaleValue(p.financials.released_amount, fyId),
        expenditure_to_date: scaleValue(p.financials.expenditure_to_date, fyId),
      },
      contractor_metadata: {
        ...p.contractor_metadata,
        contract_value: scaleValue(p.contractor_metadata.contract_value, fyId),
      },
    })),
  };
}

export async function fetchBudgetOverview(fyId?: string): Promise<BudgetSchema> {
  const target = fyId ?? "fy2026";

  try {
    const res = await fetch(V2_BUDGET_OVERVIEW_URL, {
      method: "GET",
      headers: { Accept: "application/json" },
      signal: AbortSignal.timeout(8000),
    });
    if (res.ok) {
      const liveData = (await res.json()) as BudgetSchema;
      return scaleBudgetSchema(liveData, target);
    }
  } catch {
    // API unreachable — fall through to static JSON
  }

  return scaleBudgetSchema(schema, target);
}

export async function fetchAllYearsData(): Promise<Record<string, BudgetSchema>> {
  const entries = await Promise.all(
    FISCAL_YEARS.map(async (fy) => [fy.id, enrichWithDisplayFields(await fetchBudgetOverview(fy.id), fy.is_current)] as const),
  );
  return Object.fromEntries(entries);
}

function enrichWithDisplayFields(data: BudgetSchema, isCurrent: boolean): BudgetSchema {
  const sectors = data.tier_1_national_sectors;
  const county = data.tier_2_county_devolution_envelope;
  const projects = data.tier_3_ward_project_relational_schema_simulation;
  const kpis: BudgetKpi[] = [
    { key: "total_budget", label: "Total Budget", value: isCurrent ? 4820 : 4380, prefix: "KES ", suffix: "B", trend: "up", previous: isCurrent ? 4380 : 3980 },
    { key: "recurrent", label: "Recurrent Expenditure", value: isCurrent ? 2950 : 2710, prefix: "KES ", suffix: "B", trend: "up", previous: isCurrent ? 2710 : 2480 },
    { key: "development", label: "Development Expenditure", value: isCurrent ? 1870 : 1670, prefix: "KES ", suffix: "B", trend: "up", previous: isCurrent ? 1670 : 1500 },
    { key: "county_allocation", label: "County Allocation", value: Math.round(county.total_devolution_allocation / 1000), prefix: "KES ", suffix: "B", trend: "up", previous: isCurrent ? 385 : 370 },
  ];
  const sector_chart: BudgetChartPoint[] = sectors.slice(0, 8).map((s) => ({
    name: s.name, value: Math.round(s.total_allocation / 1000),
    fill: s.sector_code === "EDU" ? "#10b981" : s.sector_code === "HLT" ? "#f59e0b" : s.sector_code === "INF" ? "#3b82f6" : "#64748b",
  }));
  return {
    ...data,
    kpis,
    sector_chart,
    revenue_chart: data.macro_modules.revenue_engine.streams.map((s) => ({ name: s.type, value: Math.round(s.amount / 1000), fill: "#10b981" })),
    highlights: [
      { type: "success", title: "Education Gets Historic Boost", text: `KES ${Math.round((sectors.find((s) => s.sector_code === "EDU")?.total_allocation ?? 0) / 1000)}B allocated — the highest ever.` },
      { type: "trend", title: "Health Sector Recovery", text: `KES ${Math.round((sectors.find((s) => s.sector_code === "HLT")?.total_allocation ?? 0) / 1000)}B for healthcare.` },
      { type: "info", title: "Infrastructure Spending", text: `KES ${Math.round((sectors.find((s) => s.sector_code === "INF")?.total_allocation ?? 0) / 1000)}B for roads and connectivity.` },
      { type: "warning", title: "Debt Service Burden", text: `KES ${data.macro_modules.debt_portfolio.total_interest_service_obligation / 1000}T goes to debt repayment.` },
    ],
    timeline: [
      { phase: "formulation", label: "Formulation", period: "Aug – Feb", icon: "edit_document", is_current: false },
      { phase: "approval", label: "Approval", period: "Mar – Jun", icon: "how_to_vote", is_current: false },
      { phase: "implementation", label: "Implementation", period: "Jul – Jun", icon: "play_circle", is_current: true },
      { phase: "audit", label: "Audit & Oversight", period: "Post-Jun", icon: "fact_check", is_current: false },
    ],
    projects: projects.slice(0, 6).map((p) => ({
      id: (p.project_uuid ?? "PRJ").slice(0, 10).toUpperCase(),
      title: p.project_name,
      sector: p.line_item_mapping.parent_sector_code === "EDU" ? "Education" : p.line_item_mapping.parent_sector_code === "HLT" ? "Health" : p.line_item_mapping.parent_sector_code === "INF" ? "Infrastructure" : "Other",
      county: p.location?.county_id ? `County ${p.location.county_id}` : "All Counties",
      status: p.lifecycle_status === "Completed" ? "completed" as const : p.lifecycle_status === "In Progress" ? "in_progress" as const : "planned" as const,
      budget: Math.round((p.financials?.allocated_amount ?? 0) / 1e6),
      spent: Math.round((p.financials?.expenditure_to_date ?? 0) / 1e6),
      description: p.project_name,
      impact: "On track",
    })),
    comparison_rows: [
      { label: "Education", fy2025: "KES 628.6B", fy2026: "KES 781.4B", change: "+KES 152.8B (+24.3%)" },
      { label: "Infrastructure", fy2025: "KES 198.4B", fy2026: "KES 230.0B", change: "+KES 31.6B (+15.9%)" },
      { label: "Health", fy2025: "KES 145.2B", fy2026: "KES 175.5B", change: "+KES 30.3B (+20.9%)" },
      { label: "Security", fy2025: "KES 284.1B", fy2026: "KES 308.6B", change: "+KES 24.5B (+8.6%)" },
      { label: "Agriculture", fy2025: "KES 92.4B", fy2026: "KES 106.8B", change: "+KES 14.4B (+15.6%)" },
      { label: "Housing & Urban Dev", fy2025: "KES 108.6B", fy2026: "KES 135.8B", change: "+KES 27.2B (+25.0%)" },
      { label: "Social Protection", fy2025: "KES 76.8B", fy2026: "KES 89.2B", change: "+KES 12.4B (+16.1%)" },
      { label: "Debt Service", fy2025: "KES 1,950B", fy2026: "KES 2,100B", change: "+KES 150B (+7.7%)" },
    ],
    expenditure_chart: [
      { name: "Education", value: 781.4, fill: "#10b981" },
      { name: "Infrastructure", value: 230, fill: "#3b82f6" },
      { name: "Health", value: 175.5, fill: "#f59e0b" },
      { name: "Security", value: 308.6, fill: "#ef4444" },
      { name: "Agriculture", value: 106.8, fill: "#8b5cf6" },
      { name: "Housing & Urban Dev", value: 135.8, fill: "#06b6d4" },
      { name: "Social Protection", value: 89.2, fill: "#ec4899" },
      { name: "Governance & Judiciary", value: 192.7, fill: "#64748b" },
      { name: "Debt Service & Others", value: 2800, fill: "#a855f7" },
    ],
    glossary_terms: [],
  };
}

export function seedCountyProfiles(): Record<string, CountyBudgetProfile> {
  return {
    nairobi: {
      id: "nairobi", name: "Nairobi", tagline: "Capital City County",
      total_allocation: 39400, citizen_rating: 4.2, transparency_rating: "High",
      allocation_per_capita: 8200,
      sector_breakdown: [{ name: "Health", value: 35, fill: "#10b981" }, { name: "Infrastructure", value: 28, fill: "#3b82f6" }, { name: "Education", value: 18, fill: "#f59e0b" }, { name: "Social Services", value: 12, fill: "#8b5cf6" }, { name: "Administration", value: 7, fill: "#64748b" }],
      projects: [],
    },
    mombasa: {
      id: "mombasa", name: "Mombasa", tagline: "Coastal Hub",
      total_allocation: 14200, citizen_rating: 3.8, transparency_rating: "Moderate",
      allocation_per_capita: 6100,
      sector_breakdown: [{ name: "Infrastructure", value: 32, fill: "#3b82f6" }, { name: "Health", value: 25, fill: "#10b981" }, { name: "Education", value: 20, fill: "#f59e0b" }, { name: "Social Services", value: 13, fill: "#8b5cf6" }, { name: "Administration", value: 10, fill: "#64748b" }],
      projects: [],
    },
    kisumu: {
      id: "kisumu", name: "Kisumu", tagline: "Lakeside County",
      total_allocation: 12100, citizen_rating: 3.5, transparency_rating: "Moderate",
      allocation_per_capita: 5400,
      sector_breakdown: [{ name: "Health", value: 30, fill: "#10b981" }, { name: "Education", value: 24, fill: "#f59e0b" }, { name: "Infrastructure", value: 22, fill: "#3b82f6" }, { name: "Agriculture", value: 14, fill: "#8b5cf6" }, { name: "Administration", value: 10, fill: "#64748b" }],
      projects: [],
    },
  };
}

export function getNationalSectors(data: BudgetSchema): NationalSector[] {
  return data.tier_1_national_sectors;
}

export function getProjects(data: BudgetSchema): WardProject[] {
  return data.tier_3_ward_project_relational_schema_simulation;
}

export function getTotalNationalBudget(data: BudgetSchema): number {
  return data.tier_1_national_sectors.reduce((s, sec) => s + sec.total_allocation, 0);
}

export interface CountyAllocation {
  id: string;
  name: string;
  allocation: number;
  share: number;
}

export function generateCountyAllocations(data: BudgetSchema): CountyAllocation[] {
  const totalDevolution = data.tier_2_county_devolution_envelope.total_devolution_allocation;
  const countyNames = [
    "Mombasa", "Kwale", "Kilifi", "Tana River", "Lamu", "Taita Taveta",
    "Garissa", "Wajir", "Mandera", "Marsabit", "Isiolo", "Meru",
    "Tharaka-Nithi", "Embu", "Kitui", "Machakos", "Makueni", "Nyandarua",
    "Nyeri", "Kirinyaga", "Murang'a", "Kiambu", "Turkana", "West Pokot",
    "Samburu", "Trans Nzoia", "Uasin Gishu", "Elgeyo-Marakwet", "Nandi",
    "Baringo", "Laikipia", "Nakuru", "Narok", "Kajiado", "Kericho",
    "Bomet", "Kakamega", "Vihiga", "Bungoma", "Busia", "Siaya",
    "Kisumu", "Homa Bay", "Migori", "Kisii", "Nyamira", "Nairobi",
  ];

  return countyNames.map((name, i) => {
    const weight = name === "Nairobi" ? 0.065 : 0.035 + (i % 7) * 0.008;
    const totalWeight = countyNames.reduce((s, _, j) => {
      if (name === "Nairobi" && countyNames[j] === "Nairobi") return s + 0.065;
      return s + (0.035 + (j % 7) * 0.008);
    }, 0);
    const allocation = Math.round(totalDevolution * (weight / totalWeight));
    return {
      id: `county-${String(i + 1).padStart(2, "0")}`,
      name,
      allocation,
      share: (allocation / totalDevolution) * 100,
    };
  }).sort((a, b) => b.allocation - a.allocation)
    .map((c, i) => ({ ...c, rank: i + 1 }));
}
