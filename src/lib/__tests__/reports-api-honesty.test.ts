import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import type { BudgetSchema } from "@/lib/budget-schema";

/**
 * P0 Trust: production reports path must not invent county weights or FY scale factors.
 */

const minimalSchema = (overrides: Partial<BudgetSchema> = {}): BudgetSchema =>
  ({
    metadata: {
      sdk_version: "1.0.0-beta",
      fiscal_year: "2026/27",
      base_currency: "KES",
      unit_scale: "RAW_INTEGER",
      theme: "",
      presented_by: "",
      presented_date: "",
      approved_date: "",
      provenance_level: 1,
      source_verbatim: "CRA",
    },
    stakeholder_ledger: { allocators: [], oversight: [], implementers: [] },
    macro_modules: {
      revenue_engine: { total_projected_revenue: 1_000_000, streams: [] },
      debt_portfolio: {
        total_interest_service_obligation: 0,
        fiscal_deficit_gap: 0,
        deficit_gdp_ratio_pct: 0,
        target_deficit_fy2028_29_pct: 0,
        financing_plan: { domestic_borrowing_target: 0, external_borrowing_target: 0 },
        systemic_risks: [],
      },
    },
    tier_1_national_sectors: [
      {
        sector_code: "HEALTH",
        name: "Health",
        total_allocation: 100_000,
        national_budget_share_pct: 10,
        beta_alignment_tags: [],
        sub_vote_breakdown: [],
      },
    ],
    tier_2_county_devolution_envelope: {
      total_devolution_allocation: 500_000_000_000,
      national_budget_share_pct: 15,
      funding_split: {
        unconditional_equitable_share: 400_000_000_000,
        additional_national_conditional_allocations: 0,
        equalisation_fund_marginalised_areas: 0,
        development_partner_conditional_grants: 0,
      },
      conditional_allocation_breakdown: [],
      county_profiles: [],
    },
    tier_3_ward_project_relational_schema_simulation: [],
    ...overrides,
  }) as BudgetSchema;

describe("reports-api honesty (P0 Trust)", () => {
  beforeEach(() => {
    vi.resetModules();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("extractCountyAllocations returns only API county_profiles (no synthetic 47-county weights)", async () => {
    const { extractCountyAllocations } = await import("@/lib/reports-api");
    const empty = extractCountyAllocations(minimalSchema());
    expect(empty).toEqual([]);

    const withProfiles = extractCountyAllocations(
      minimalSchema({
        tier_2_county_devolution_envelope: {
          total_devolution_allocation: 10_000,
          national_budget_share_pct: 15,
          funding_split: {
            unconditional_equitable_share: 10_000,
            additional_national_conditional_allocations: 0,
            equalisation_fund_marginalised_areas: 0,
            development_partner_conditional_grants: 0,
          },
          conditional_allocation_breakdown: [],
          county_profiles: [
            {
              county_id: 47,
              county_name: "Nairobi",
              received_equitable_share_floor: 6_000,
              own_source_revenue_target: 0,
              estimated_pending_bills_liability: 0,
            },
            {
              county_id: 1,
              county_name: "Mombasa",
              received_equitable_share_floor: 4_000,
              own_source_revenue_target: 0,
              estimated_pending_bills_liability: 0,
            },
          ],
        },
      }),
    );
    expect(withProfiles).toHaveLength(2);
    expect(withProfiles.map((c) => c.name).sort()).toEqual(["Mombasa", "Nairobi"]);
    expect(withProfiles.every((c) => c.provenance === "api")).toBe(true);
    // Must not invent the full 47-county list
    expect(withProfiles).toHaveLength(2);
  });

  it("generateCountyAllocations is not exported (synthetic generator removed from production path)", async () => {
    const mod = await import("@/lib/reports-api");
    expect("generateCountyAllocations" in mod).toBe(false);
  });

  it("fetchBudgetOverview does not scale amounts by FY factors (0.88 / 0.94)", async () => {
    const live = minimalSchema();
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => live,
      }),
    );

    const { fetchBudgetOverview } = await import("@/lib/reports-api");
    const fy2024 = await fetchBudgetOverview("fy2024");
    const fy2026 = await fetchBudgetOverview("fy2026");
    expect(fy2024).not.toBeNull();
    expect(fy2026).not.toBeNull();

    // Same live payload for any requested year — no client-side linear scaling
    expect(fy2024!.tier_1_national_sectors[0].total_allocation).toBe(100_000);
    expect(fy2026!.tier_1_national_sectors[0].total_allocation).toBe(100_000);
    expect(fy2024!.macro_modules.revenue_engine.total_projected_revenue).toBe(1_000_000);
  });

  it("fetchAllYearsData only includes years with real payloads (no fabricated prior-FY clones)", async () => {
    const live = minimalSchema();
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => live,
      }),
    );

    const { fetchAllYearsData } = await import("@/lib/reports-api");
    const all = await fetchAllYearsData();
    const years = Object.keys(all);
    expect(years.length).toBeGreaterThanOrEqual(1);
    // Must not fabricate three scaled clones from one payload
    if (years.length > 1) {
      const allocations = years.map(
        (y) => all[y].tier_1_national_sectors[0]?.total_allocation,
      );
      // Distinct years may share values only if API said so — never 0.88/0.94 ratios
      const base = allocations[0];
      for (const a of allocations) {
        if (base && a) {
          const ratio = a / base;
          expect(ratio).not.toBeCloseTo(0.88, 2);
          expect(ratio).not.toBeCloseTo(0.94, 2);
        }
      }
    }
  });
});
