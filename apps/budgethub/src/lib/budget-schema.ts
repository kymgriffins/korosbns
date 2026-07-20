// ─── Full Kenya Budget SDK Blueprint types (from gemini-code JSON) ───

export interface BudgetSchemaMetadata {
  sdk_version: string;
  fiscal_year: string;
  base_currency: string;
  unit_scale: string;
  theme: string;
  presented_by: string;
  presented_date: string;
  approved_date: string;
  provenance_level: number;
  source_verbatim: string;
}

export interface StakeholderEntry {
  code: string;
  name: string;
}

export interface StakeholderLedger {
  allocators: StakeholderEntry[];
  oversight: StakeholderEntry[];
  implementers: StakeholderEntry[];
}

export interface RevenueSubStream {
  name: string;
  is_automated_kra?: boolean;
  standard_rate_pct?: number;
  targets?: string[];
  fixed_rate_pct?: number;
}

export interface RevenueStream {
  type: string;
  amount: number;
  description?: string;
  sub_streams?: RevenueSubStream[];
}

export interface RevenueEngine {
  total_projected_revenue: number;
  streams: RevenueStream[];
}

export interface FinancingPlan {
  domestic_borrowing_target: number;
  external_borrowing_target: number;
}

export interface DebtPortfolio {
  total_interest_service_obligation: number;
  fiscal_deficit_gap: number;
  deficit_gdp_ratio_pct: number;
  target_deficit_fy2028_29_pct: number;
  financing_plan: FinancingPlan;
  systemic_risks: string[];
}

export interface MacroModules {
  revenue_engine: RevenueEngine;
  debt_portfolio: DebtPortfolio;
}

export interface SubVoteBreakdown {
  vote_head: string;
  amount: number;
  share_of_vote_pct?: number;
  beneficiaries_count?: number;
  note?: string;
  uhc_anchor_status?: boolean;
  asset_preservation_focus?: boolean;
}

export interface NationalSector {
  sector_code: string;
  name: string;
  total_allocation: number;
  national_budget_share_pct: number;
  expenditure_type_split?: {
    recurrent: number;
    development: number;
  };
  beta_alignment_tags: string[];
  sub_vote_breakdown: SubVoteBreakdown[];
}

export interface FundingSplit {
  unconditional_equitable_share: number;
  additional_national_conditional_allocations: number;
  equalisation_fund_marginalised_areas: number;
  development_partner_conditional_grants: number;
}

export interface ConditionalAllocation {
  item: string;
  amount: number;
}

export interface CountyProfileExample {
  county_id: number;
  county_name: string;
  received_equitable_share_floor: number;
  total_allocation?: number;
  own_source_revenue_target: number;
  estimated_pending_bills_liability: number;
}

export interface CountyEnvelopeProvenance {
  source: string;
  fiscal_year: string | null;
  note?: string;
}

export interface CountyDevolutionEnvelope {
  total_devolution_allocation: number;
  national_budget_share_pct: number;
  funding_split: FundingSplit;
  conditional_allocation_breakdown: ConditionalAllocation[];
  /** CRA-backed profiles from API (empty when unavailable). */
  county_profiles?: CountyProfileExample[];
  /** @deprecated Legacy mock field — prefer county_profiles. */
  sdk_mock_county_profile_example?: CountyProfileExample;
  data_status?: "ok" | "unavailable" | "partial";
  provenance?: CountyEnvelopeProvenance;
}

export interface ProjectLocation {
  county_id: number;
  constituency_id: string;
  ward_id: string;
  ward_name: string;
}

export interface ProjectFinancials {
  allocated_amount: number;
  released_amount: number;
  expenditure_to_date: number;
}

export interface ContractorMetadata {
  company_name: string;
  cr12_registration_number: string;
  contract_value: number;
}

export interface LineItemMapping {
  parent_sector_code: string;
  national_vote_head_reference: string;
  parent_macro_allocation_ref_kes: number;
}

export interface OversightMetrics {
  absorption_rate_pct: number;
  last_audit_date: string;
  stalled_flag: boolean;
  citizen_reports_count: number;
}

export interface WardProject {
  project_uuid: string;
  project_name: string;
  location: ProjectLocation;
  financials: ProjectFinancials;
  lifecycle_status: string;
  funding_source_entity: string;
  contractor_metadata: ContractorMetadata;
  line_item_mapping: LineItemMapping;
  oversight_metrics: OversightMetrics;
}

export interface BudgetSchema {
  $schema: string;
  metadata: BudgetSchemaMetadata;
  stakeholder_ledger: StakeholderLedger;
  macro_modules: MacroModules;
  tier_1_national_sectors: NationalSector[];
  tier_2_county_devolution_envelope: CountyDevolutionEnvelope;
  tier_3_ward_project_relational_schema_simulation: WardProject[];
}
