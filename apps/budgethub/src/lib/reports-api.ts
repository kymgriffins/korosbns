"use client";

import type { BudgetSchema, NationalSector, WardProject } from "@/lib/budget-schema";
import budgetJson from "@/data/budget-fy2026-27.json";

const schema = budgetJson as unknown as BudgetSchema;

export interface FiscalYearMeta {
  id: string;
  label: string;
  is_current: boolean;
}

export const FISCAL_YEARS: FiscalYearMeta[] = [
  { id: "fy2024", label: "FY 2024/25", is_current: false },
  { id: "fy2025", label: "FY 2025/26", is_current: false },
  { id: "fy2026", label: "FY 2026/27", is_current: true },
  { id: "fy2027", label: "FY 2027/28", is_current: false },
];

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
  return Promise.resolve(scaleBudgetSchema(schema, target));
}

export async function fetchAllYearsData(): Promise<Record<string, BudgetSchema>> {
  const entries = await Promise.all(
    FISCAL_YEARS.map(async (fy) => [fy.id, await fetchBudgetOverview(fy.id)] as const),
  );
  return Object.fromEntries(entries);
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
