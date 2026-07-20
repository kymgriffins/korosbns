"use client";

import type { BudgetSchema, NationalSector, WardProject } from "@/lib/budget-schema";
import { API_BASE_URL } from "@/lib/api-config";
import seededBudgetOverview from "../data/budget-fy2026-27.json";

const V2_BUDGET_OVERVIEW_URL = `${API_BASE_URL}/api/v2/budget/overview/`;
const V2_FISCAL_YEARS_URL = `${API_BASE_URL}/api/v2/budget/fiscal-years/`;

export interface FiscalYearMeta {
  id: string;
  label: string;
  is_current: boolean;
}

export interface CountyAllocation {
  id: string;
  name: string;
  allocation: number;
  share: number;
  rank?: number;
  /** Always "api" when sourced from CRA/overview profiles — never synthetic weights. */
  provenance: "api";
}

export interface ReportProvenance {
  source: string;
  fiscal_year: string | null;
  synced_at: string | null;
  data_status: "ok" | "unavailable" | "partial";
}

/** Default FY chrome when API fiscal-years list is empty — UI still only shows years with payloads. */
export const FISCAL_YEARS: FiscalYearMeta[] = [
  { id: "fy2026", label: "FY 2026/27", is_current: true },
];

export const VISIBLE_FISCAL_YEARS = FISCAL_YEARS;

function fiscalYearIdFromLabel(label: string | undefined | null): string {
  if (!label) return "current";
  const m = label.match(/(\d{4})\s*\/\s*(\d{2,4})/);
  if (m) {
    const start = m[1];
    return `fy${start}`;
  }
  const digits = label.replace(/\D/g, "");
  if (digits.length >= 4) return `fy${digits.slice(0, 4)}`;
  return "current";
}

function emptySchema(label = "Unavailable"): BudgetSchema {
  return {
    $schema: "",
    metadata: {
      sdk_version: "1.0.0-beta",
      fiscal_year: label,
      base_currency: "KES",
      unit_scale: "RAW_INTEGER",
      theme: "",
      presented_by: "",
      presented_date: "",
      approved_date: "",
      provenance_level: 0,
      source_verbatim: "",
    },
    stakeholder_ledger: { allocators: [], oversight: [], implementers: [] },
    macro_modules: {
      revenue_engine: { total_projected_revenue: 0, streams: [] },
      debt_portfolio: {
        total_interest_service_obligation: 0,
        fiscal_deficit_gap: 0,
        deficit_gdp_ratio_pct: 0,
        target_deficit_fy2028_29_pct: 0,
        financing_plan: { domestic_borrowing_target: 0, external_borrowing_target: 0 },
        systemic_risks: [],
      },
    },
    tier_1_national_sectors: [],
    tier_2_county_devolution_envelope: {
      total_devolution_allocation: 0,
      national_budget_share_pct: 0,
      funding_split: {
        unconditional_equitable_share: 0,
        additional_national_conditional_allocations: 0,
        equalisation_fund_marginalised_areas: 0,
        development_partner_conditional_grants: 0,
      },
      conditional_allocation_breakdown: [],
      county_profiles: [],
      data_status: "unavailable",
      provenance: {
        source: "none",
        fiscal_year: null,
        note: "No overview payload from API.",
      },
    },
    tier_3_ward_project_relational_schema_simulation: [],
  };
}

const SEEDED_OVERVIEW = seededBudgetOverview as BudgetSchema;

function overviewHasNationalSectors(data: BudgetSchema | null | undefined): boolean {
  return (data?.tier_1_national_sectors?.length ?? 0) > 0;
}

/** Verbatim FY 2026/27 catalogue — not scaled or synthesized from other years. */
export function getSeededBudgetOverview(): BudgetSchema {
  return SEEDED_OVERVIEW;
}

/**
 * Fetch live overview. Never applies client-side FY scale factors.
 * Falls back to seeded FY 2026/27 JSON when the API is unreachable or empty.
 */
export async function fetchBudgetOverview(_fyId?: string): Promise<BudgetSchema | null> {
  try {
    const res = await fetch(V2_BUDGET_OVERVIEW_URL, {
      method: "GET",
      headers: { Accept: "application/json" },
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return getSeededBudgetOverview();
    const data = (await res.json()) as BudgetSchema;
    return overviewHasNationalSectors(data) ? data : getSeededBudgetOverview();
  } catch {
    return getSeededBudgetOverview();
  }
}

async function fetchFiscalYearMetas(): Promise<FiscalYearMeta[]> {
  try {
    const res = await fetch(V2_FISCAL_YEARS_URL, {
      method: "GET",
      headers: { Accept: "application/json" },
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return [];
    const body = await res.json();
    const rows = Array.isArray(body) ? body : Array.isArray(body?.results) ? body.results : [];
    return rows.map((row: { fiscal_year?: number; label?: string; is_current?: boolean }) => {
      const year = row.fiscal_year ?? 0;
      return {
        id: year ? `fy${year}` : fiscalYearIdFromLabel(row.label),
        label: row.label?.startsWith("FY") ? row.label : `FY ${row.label ?? year}`,
        is_current: Boolean(row.is_current),
      };
    });
  } catch {
    return [];
  }
}

/**
 * Only years with a real API payload. Does not clone/scale one FY into prior years.
 */
export async function fetchAllYearsData(): Promise<Record<string, BudgetSchema>> {
  const overview = await fetchBudgetOverview();
  if (!overview) return {};

  const id = fiscalYearIdFromLabel(overview.metadata?.fiscal_year);
  return { [id]: overview };
}

export async function fetchReportFiscalYears(): Promise<FiscalYearMeta[]> {
  const metas = await fetchFiscalYearMetas();
  const data = await fetchAllYearsData();
  const availableIds = new Set(Object.keys(data));
  if (availableIds.size === 0) return [];
  const filtered = metas.filter((m) => availableIds.has(m.id));
  if (filtered.length > 0) return filtered;
  // Derive chrome from payload keys when fiscal-years list is empty/mismatched
  return Object.keys(data).map((id) => ({
    id,
    label: data[id].metadata?.fiscal_year
      ? `FY ${data[id].metadata.fiscal_year}`
      : id,
    is_current: true,
  }));
}

export function getNationalSectors(data: BudgetSchema): NationalSector[] {
  return data.tier_1_national_sectors ?? [];
}

export function getProjects(data: BudgetSchema): WardProject[] {
  return data.tier_3_ward_project_relational_schema_simulation ?? [];
}

export function getTotalNationalBudget(data: BudgetSchema): number {
  return (data.tier_1_national_sectors ?? []).reduce((s, sec) => s + (sec.total_allocation || 0), 0);
}

/**
 * County rows from API `county_profiles` only. Empty when CRA data is missing.
 * Replaces the removed synthetic `generateCountyAllocations` weight generator.
 */
export function extractCountyAllocations(data: BudgetSchema | null | undefined): CountyAllocation[] {
  if (!data) return [];
  const envelope = data.tier_2_county_devolution_envelope as BudgetSchema["tier_2_county_devolution_envelope"] & {
    county_profiles?: Array<{
      county_id?: number;
      county_name?: string;
      received_equitable_share_floor?: number;
      total_allocation?: number;
    }>;
  };
  const profiles = envelope?.county_profiles ?? [];
  if (!profiles.length) return [];

  const total =
    envelope.total_devolution_allocation ||
    profiles.reduce(
      (s, p) => s + (p.total_allocation ?? p.received_equitable_share_floor ?? 0),
      0,
    );

  return profiles
    .map((p, i) => {
      const allocation = p.total_allocation ?? p.received_equitable_share_floor ?? 0;
      return {
        id: `county-${String(p.county_id ?? i + 1).padStart(2, "0")}`,
        name: p.county_name ?? `County ${i + 1}`,
        allocation,
        share: total > 0 ? (allocation / total) * 100 : 0,
        provenance: "api" as const,
      };
    })
    .sort((a, b) => b.allocation - a.allocation)
    .map((c, i) => ({ ...c, rank: i + 1 }));
}

export function getReportProvenance(data: BudgetSchema | null | undefined): ReportProvenance {
  if (!data) {
    return {
      source: "none",
      fiscal_year: null,
      synced_at: null,
      data_status: "unavailable",
    };
  }
  const isSeeded =
    data.metadata?.source_verbatim === "budget_fy2026_27.json" ||
    data === SEEDED_OVERVIEW;
  const envelope = data.tier_2_county_devolution_envelope as {
    data_status?: string;
    provenance?: { source?: string; fiscal_year?: string | null };
  };
  const hasSectors = (data.tier_1_national_sectors?.length ?? 0) > 0;
  const hasCounties = (envelope as { county_profiles?: unknown[] })?.county_profiles?.length;
  let data_status: ReportProvenance["data_status"] = "unavailable";
  if (hasSectors && hasCounties) data_status = "ok";
  else if (hasSectors || hasCounties) data_status = "partial";
  else if (envelope?.data_status === "ok") data_status = "ok";

  return {
    source: isSeeded
      ? "seeded:budget_fy2026_27.json"
      : envelope?.provenance?.source ||
        data.metadata?.source_verbatim ||
        "bnscore_v2 overview",
    fiscal_year: data.metadata?.fiscal_year ?? envelope?.provenance?.fiscal_year ?? null,
    synced_at: new Date().toISOString(),
    data_status,
  };
}

export { emptySchema };
