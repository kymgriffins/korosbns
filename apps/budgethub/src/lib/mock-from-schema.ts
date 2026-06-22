import budgetData from "@/data/budget-fy2026-27.json";
import { COUNTIES } from "@/constants/counties";
import type { BudgetSchema, NationalSector } from "@/lib/budget-schema";
import type {
  BudgetFiscalYear,
  BudgetAllocation,
  BudgetEntity,
  BudgetKpiRaw,
  BudgetHighlightRaw,
} from "@/lib/budget-api";

const schema = budgetData as unknown as BudgetSchema;

// ─── Fiscal Years ───
export const FISCAL_YEARS: BudgetFiscalYear[] = [
  { id: "fy2024", fiscal_year: 2024, label: "FY 2024/25", starts_at: "2024-07-01", ends_at: "2025-06-30", is_current: false },
  { id: "fy2025", fiscal_year: 2025, label: "FY 2025/26", starts_at: "2025-07-01", ends_at: "2026-06-30", is_current: false },
  { id: "fy2026", fiscal_year: 2026, label: "FY 2026/27", starts_at: "2026-07-01", ends_at: "2027-06-30", is_current: true },
];

// ─── Build National Entities (one per sector) ───
function buildNationalEntities(): BudgetEntity[] {
  return schema.tier_1_national_sectors.map((s, i) => ({
    id: `nat-${s.sector_code.toLowerCase()}`,
    type: "national" as const,
    code: s.sector_code,
    name: s.name,
    parent: null,
    gfs_code: `N${String(i + 1).padStart(3, "0")}`,
    is_active: true,
    sort_order: i + 1,
  }));
}

// ─── Build County Entities ───
function buildCountyEntities(): BudgetEntity[] {
  return COUNTIES.map((name, i) => ({
    id: `county-${String(i + 1).padStart(2, "0")}`,
    type: "county" as const,
    code: `CG-${String(i + 1).padStart(2, "0")}`,
    name: `${name} County Government`,
    parent: null,
    gfs_code: `C${String(i + 1).padStart(3, "0")}`,
    is_active: true,
    sort_order: 100 + i,
  }));
}

// ─── Build National Allocations (real schema data) ───
function buildNationalAllocations(fiscalYearId: string): BudgetAllocation[] {
  const FISCAL_YEAR_LABEL = FISCAL_YEARS.find((y) => y.id === fiscalYearId)?.label ?? "";

  return schema.tier_1_national_sectors.flatMap((sector) =>
    sector.sub_vote_breakdown.map((sub, i) => ({
      id: `nat-alloc-${fiscalYearId}-${sector.sector_code}-${i}`,
      fiscal_year: fiscalYearId,
      fiscal_year_label: FISCAL_YEAR_LABEL,
      entity: `nat-${sector.sector_code.toLowerCase()}`,
      entity_name: `${sector.name} - ${sub.vote_head}`,
      entity_type: "national" as const,
      allocation_type: "approved" as const,
      amount: String(sub.amount),
      amount_previous: null,
      notes: sub.note ?? "",
    }))
  );
}

// ─── Build County Allocations (pro-rated from schema envelope) ───
function buildCountyAllocations(fiscalYearId: string): BudgetAllocation[] {
  const FISCAL_YEAR_LABEL = FISCAL_YEARS.find((y) => y.id === fiscalYearId)?.label ?? "";
  const envelope = schema.tier_2_county_devolution_envelope;
  const totalDevolution = envelope.total_devolution_allocation;

  return COUNTIES.map((name, i) => {
    const isNairobi = name === "Nairobi";
    const weight = isNairobi ? 0.065 : 0.035 + (i % 7) * 0.008;
    const amount = Math.round(totalDevolution * weight);

    return {
      id: `county-alloc-${fiscalYearId}-${String(i + 1).padStart(2, "0")}`,
      fiscal_year: fiscalYearId,
      fiscal_year_label: FISCAL_YEAR_LABEL,
      entity: `county-${String(i + 1).padStart(2, "0")}`,
      entity_name: `${name} County Government`,
      entity_type: "county" as const,
      allocation_type: "approved" as const,
      amount: String(amount),
      amount_previous: String(Math.round(amount * (0.92 + (i % 5) * 0.02))),
      notes: "",
    };
  });
}

// ─── Build KPIs (from schema macro modules) ───
function buildKpis(fiscalYearId: string): BudgetKpiRaw[] {
  const rev = schema.macro_modules.revenue_engine;
  const debt = schema.macro_modules.debt_portfolio;

  return [
    {
      id: `kpi-${fiscalYearId}-total-revenue`,
      fiscal_year: fiscalYearId,
      entity: null,
      entity_name: "National Government",
      key: "total_revenue",
      label: "Total Projected Revenue",
      value: String(rev.total_projected_revenue),
      previous_value: String(Math.round(rev.total_projected_revenue * 0.925)),
      trend: "up",
      suffix: "",
      description: schema.metadata.theme,
      sort_order: 1,
    },
    {
      id: `kpi-${fiscalYearId}-ordinary-revenue`,
      fiscal_year: fiscalYearId,
      entity: null,
      entity_name: "National Government",
      key: "ordinary_revenue",
      label: "Ordinary Revenue (KRA)",
      value: String(rev.streams[0]?.amount ?? 0),
      previous_value: String(Math.round((rev.streams[0]?.amount ?? 0) * 0.93)),
      trend: "up",
      suffix: "",
      description: "Income Tax, VAT, Excise, Customs, Rental Income",
      sort_order: 2,
    },
    {
      id: `kpi-${fiscalYearId}-interest-obligation`,
      fiscal_year: fiscalYearId,
      entity: null,
      entity_name: "National Government",
      key: "interest_obligation",
      label: "Interest Payment Obligation",
      value: String(debt.total_interest_service_obligation),
      previous_value: String(Math.round(debt.total_interest_service_obligation * 1.08)),
      trend: "down",
      suffix: "",
      description: "Total debt service cost",
      sort_order: 3,
    },
    {
      id: `kpi-${fiscalYearId}-fiscal-deficit`,
      fiscal_year: fiscalYearId,
      entity: null,
      entity_name: "National Government",
      key: "fiscal_deficit",
      label: "Fiscal Deficit Gap",
      value: String(debt.fiscal_deficit_gap),
      previous_value: String(Math.round(debt.fiscal_deficit_gap * 0.95)),
      trend: "up",
      suffix: "",
      description: `${debt.deficit_gdp_ratio_pct}% of GDP`,
      sort_order: 4,
    },
    {
      id: `kpi-${fiscalYearId}-devolution`,
      fiscal_year: fiscalYearId,
      entity: null,
      entity_name: "National Government",
      key: "devolution_allocation",
      label: "County Devolution Allocation",
      value: String(schema.tier_2_county_devolution_envelope.total_devolution_allocation),
      previous_value: String(Math.round(schema.tier_2_county_devolution_envelope.total_devolution_allocation * 0.96)),
      trend: "up",
      suffix: "",
      description: `${schema.tier_2_county_devolution_envelope.national_budget_share_pct}% of national budget`,
      sort_order: 5,
    },
    {
      id: `kpi-${fiscalYearId}-aia`,
      fiscal_year: fiscalYearId,
      entity: null,
      entity_name: "National Government",
      key: "appropriations_in_aid",
      label: "Appropriations-in-Aid (AIA)",
      value: String(rev.streams[1]?.amount ?? 0),
      previous_value: String(Math.round((rev.streams[1]?.amount ?? 0) * 0.97)),
      trend: "up",
      suffix: "",
      description: "Fees & charges retained by MDAs",
      sort_order: 6,
    },
    {
      id: `kpi-${fiscalYearId}-grants`,
      fiscal_year: fiscalYearId,
      entity: null,
      entity_name: "National Government",
      key: "grants",
      label: "External Grants",
      value: String(rev.streams[2]?.amount ?? 0),
      previous_value: String(Math.round((rev.streams[2]?.amount ?? 0) * 1.02)),
      trend: "up",
      suffix: "",
      description: "Development partner funding",
      sort_order: 7,
    },
  ];
}

// ─── Build Highlights (from schema + debt risks) ───
function buildHighlights(fiscalYearId: string): BudgetHighlightRaw[] {
  const debt = schema.macro_modules.debt_portfolio;
  const meta = schema.metadata;

  return [
    {
      id: `hl-${fiscalYearId}-theme`,
      fiscal_year: fiscalYearId,
      entity: null,
      entity_name: "National Government",
      type: "info",
      title: "Budget Theme",
      text: meta.theme,
      sort_order: 1,
    },
    {
      id: `hl-${fiscalYearId}-deficit`,
      fiscal_year: fiscalYearId,
      entity: null,
      entity_name: "National Government",
      type: "warning",
      title: `Fiscal Deficit at ${debt.deficit_gdp_ratio_pct}% of GDP`,
      text: `Gap of KES ${(debt.fiscal_deficit_gap / 1e9).toFixed(0)}B. Target to reduce to ${debt.target_deficit_fy2028_29_pct}% by FY 2028/29.`,
      sort_order: 2,
    },
    {
      id: `hl-${fiscalYearId}-borrowing`,
      fiscal_year: fiscalYearId,
      entity: null,
      entity_name: "National Government",
      type: "trend",
      title: "Borrowing Plan",
      text: `Domestic: KES ${(debt.financing_plan.domestic_borrowing_target / 1e9).toFixed(0)}B · External: KES ${(debt.financing_plan.external_borrowing_target / 1e9).toFixed(0)}B`,
      sort_order: 3,
    },
    {
      id: `hl-${fiscalYearId}-envelope`,
      fiscal_year: fiscalYearId,
      entity: null,
      entity_name: "National Government",
      type: "success",
      title: "County Devolution Envelope",
      text: `KES ${(schema.tier_2_county_devolution_envelope.total_devolution_allocation / 1e9).toFixed(0)}B allocated (${schema.tier_2_county_devolution_envelope.national_budget_share_pct}% of national budget) across 47 counties.`,
      sort_order: 4,
    },
  ];
}

// ─── Caches ───
let cachedEntities: BudgetEntity[] | null = null;
const allocCache: Record<string, BudgetAllocation[]> = {};
const kpiCache: Record<string, BudgetKpiRaw[]> = {};

function ensureData(fiscalYearId: string) {
  if (allocCache[fiscalYearId]) return;

  if (!cachedEntities) {
    cachedEntities = [...buildNationalEntities(), ...buildCountyEntities()];
  }

  allocCache[fiscalYearId] = [
    ...buildNationalAllocations(fiscalYearId),
    ...buildCountyAllocations(fiscalYearId),
  ];
  kpiCache[fiscalYearId] = buildKpis(fiscalYearId);
}

// ══════════════════════════════════════════════════════════════════
// Public API
// ══════════════════════════════════════════════════════════════════

export function schemaFetchFiscalYears(): Promise<BudgetFiscalYear[]> {
  return Promise.resolve(FISCAL_YEARS);
}

export function schemaFetchEntities(): Promise<BudgetEntity[]> {
  if (!cachedEntities) cachedEntities = [...buildNationalEntities(), ...buildCountyEntities()];
  return Promise.resolve(cachedEntities);
}

export function schemaFetchAllocations(params?: {
  fiscal_year?: string;
  entity?: string;
  allocation_type?: string;
}): Promise<BudgetAllocation[]> {
  const year = params?.fiscal_year || "fy2026";
  ensureData(year);
  let result = allocCache[year] || [];
  if (params?.entity) result = result.filter((a) => a.entity === params.entity);
  if (params?.allocation_type) result = result.filter((a) => a.allocation_type === params.allocation_type);
  return Promise.resolve(result);
}

export function schemaFetchKpis(params?: {
  fiscal_year?: string;
}): Promise<BudgetKpiRaw[]> {
  const year = params?.fiscal_year || "fy2026";
  ensureData(year);
  return Promise.resolve(kpiCache[year] || []);
}

export function schemaFetchHighlights(params?: {
  fiscal_year?: string;
}): Promise<BudgetHighlightRaw[]> {
  const year = params?.fiscal_year || "fy2026";
  return Promise.resolve(buildHighlights(year));
}

export function getSchemaMeta() {
  return schema.metadata;
}

export function getSchemaSummary() {
  return {
    totalNationalBudget: schema.tier_1_national_sectors.reduce((s, sec) => s + sec.total_allocation, 0),
    totalCountyAllocation: schema.tier_2_county_devolution_envelope.total_devolution_allocation,
    totalRevenue: schema.macro_modules.revenue_engine.total_projected_revenue,
    totalDebtInterest: schema.macro_modules.debt_portfolio.total_interest_service_obligation,
    fiscalDeficit: schema.macro_modules.debt_portfolio.fiscal_deficit_gap,
    deficitRatio: schema.macro_modules.debt_portfolio.deficit_gdp_ratio_pct,
  };
}
