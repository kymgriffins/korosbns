/**
 * Single source of truth for Kenya's FY2026/27 national budget figures.
 *
 * All figures are drawn from the National Treasury "Mwananchi Guide" for the
 * FY2026/27 Budget and the Budget Statement read by CS John Mbadi on 11 June 2026.
 * Source: https://www.treasury.go.ke/sites/default/files/Speeches/Budget%20Highlights-The%20Mwananchi%20Guide%20for%20the%20FY-2026-27%20Budget.pdf
 * Central Bank Rate from CBK MPC (9 June 2026): https://www.centralbank.go.ke
 *
 * Every component on the landing page MUST consume these values. Do not hardcode
 * budget figures elsewhere.
 */

export const BUDGET_FY = "2026/27";

export const BUDGET_SOURCE = {
  label: "National Treasury Budget Statement, FY2026/27 (read 11 June 2026)",
  shortLabel: "National Treasury Mwananchi Guide, FY2026/27",
  treasuryUrl:
    "https://www.treasury.go.ke/sites/default/files/Speeches/Budget%20Highlights-The%20Mwananchi%20Guide%20for%20the%20FY-2026-27%20Budget.pdf",
  parliamentUrl: "https://parliament.go.ke/index.php/budget-books-fy-2026-2027",
} as const;

/** Headline fiscal aggregates, in KES billions. */
export const budgetTotals = {
  expenditureBillions: 4820.4,
  revenueBillions: 3630.5,
  ordinaryRevenueBillions: 2990,
  appropriationsInAidBillions: 644.8,
  grantsBillions: 43.6,
  deficitBillions: 1146.2,
  deficitPercentGdp: 5.5,
  domesticBorrowingBillions: 1030,
  externalBorrowingBillions: 116.2,
  debtServiceBillions: 1501.3,
} as const;

/**
 * Deficit closes against the aggregates above:
 *   expenditure − revenue − grants = 4820.4 − 3630.5 − 43.6 ≈ 1146.2
 *   net financing = domestic 1030 + external 116.2 = 1146.2
 */
export const DEFICIT_CHECK_BILLIONS =
  budgetTotals.expenditureBillions -
  budgetTotals.revenueBillions -
  budgetTotals.grantsBillions;

export type Trend = "up" | "down" | "stable";

export interface EconomicIndicator {
  label: string;
  value: string;
  trend: Trend;
  note?: string;
}

export const economicIndicators: EconomicIndicator[] = [
  { label: "Real GDP Growth 2025", value: "4.6%", trend: "stable" },
  { label: "GDP Forecast 2026", value: "5.0%", trend: "up", note: "Revised down from 5.3% amid global energy shocks" },
  { label: "Inflation (May 2026)", value: "6.7%", trend: "up", note: "Within the 2.5–7.5% target band" },
  { label: "Central Bank Rate", value: "8.75%", trend: "stable", note: "Held by CBK MPC, 9 June 2026" },
];

export interface BudgetHighlight {
  label: string;
  value: string;
  trend: Trend;
}

export const budgetHighlights: BudgetHighlight[] = [
  { label: `Total Budget FY${BUDGET_FY}`, value: "KES 4.82T", trend: "up" },
  { label: "Total Revenue", value: "KES 3.63T", trend: "stable" },
  { label: "Fiscal Deficit (5.5% of GDP)", value: "KES 1.15T", trend: "down" },
  { label: "Net Domestic Borrowing", value: "KES 1.03T", trend: "up" },
];

/**
 * Official ministerial / sector ceilings (selected sectors) for FY2026/27.
 * These are the National Government Ministerial Allocations from the Mwananchi Guide.
 */
export interface SectorAllocation {
  key: string;
  label: string;
  shortLabel: string;
  allocationBillions: number;
  shareOfAllocations?: string;
}

export const sectorAllocations: SectorAllocation[] = [
  { key: "education", label: "Education", shortLabel: "Education", allocationBillions: 784.5, shareOfAllocations: "26.8%" },
  { key: "energy-infra-ict", label: "Energy, Infrastructure & ICT", shortLabel: "Energy & Infra", allocationBillions: 531.3, shareOfAllocations: "18.2%" },
  { key: "counties", label: "County Governments (equitable share)", shortLabel: "Counties", allocationBillions: 428.0 },
  { key: "public-admin", label: "Public Administration & Intl. Relations", shortLabel: "Public Admin", allocationBillions: 373.7, shareOfAllocations: "12.8%" },
  { key: "gjlo", label: "Governance, Justice, Law & Order", shortLabel: "Justice & Order", allocationBillions: 363.9, shareOfAllocations: "12.4%" },
  { key: "security", label: "National Security", shortLabel: "Security", allocationBillions: 316.2, shareOfAllocations: "10.8%" },
  { key: "health", label: "Health (UHC)", shortLabel: "Health", allocationBillions: 177.2, shareOfAllocations: "6.1%" },
  { key: "environment-water", label: "Environment, Water & Natural Resources", shortLabel: "Water & Env", allocationBillions: 121.2, shareOfAllocations: "4.1%" },
  { key: "agriculture", label: "Agriculture, Rural & Urban Development", shortLabel: "Agriculture", allocationBillions: 111.7, shareOfAllocations: "3.8%" },
  { key: "social-protection", label: "Social Protection, Culture & Recreation", shortLabel: "Social", allocationBillions: 94.3, shareOfAllocations: "3.2%" },
];

/**
 * Programme / thematic allocations used by the civic-intelligence simulator.
 * Each base allocation is the published FY2026/27 figure; the `gap` and
 * `gapLabel` fields are EDITORIAL / ILLUSTRATIVE framing, not Treasury figures.
 */
export interface ProgrammeAllocation {
  key: string;
  label: string;
  shortLabel: string;
  allocationBillions: number;
  sourceNote: string;
  gap: string;
  gapLabel: string;
  gapBody: string;
  action: string;
  actionBody: string;
  actionAccent: string;
}

export const programmeAllocations: ProgrammeAllocation[] = [
  {
    key: "education",
    label: "Education",
    shortLabel: "Education",
    allocationBillions: 784.5,
    sourceNote: "Largest sector — 26.8% of ministerial allocations",
    gap: "Capitation",
    gapLabel: "Inflation erosion",
    gapBody: "Per-learner capitation has lagged inflation for years even as the sector tops the budget — squeezing schools on the ground.",
    action: "Index capitation",
    actionBody: "Push for inflation-indexed capitation rates and school-level financial transparency portals for all recipients.",
    actionAccent: "Right to education",
  },
  {
    key: "health",
    label: "Universal Health Coverage",
    shortLabel: "Health",
    allocationBillions: 177.2,
    sourceNote: "6.1% of ministerial allocations — SHA & primary care",
    gap: "Frontline",
    gapLabel: "Admin vs. frontline",
    gapBody: "Citizens should track how much of the SHA and UHC allocation reaches facilities and community health promoters versus administration.",
    action: "Ring-fence frontline care",
    actionBody: "Push for a transparent split of SHA funds toward direct facility improvements and community health promoter stipends.",
    actionAccent: "PFM Act 2012 §107",
  },
  {
    key: "roads",
    label: "Roads & Bridges",
    shortLabel: "Roads",
    allocationBillions: 220.4,
    sourceNote: "Maintenance, rehabilitation & construction of roads",
    gap: "Per-km",
    gapLabel: "Spending efficiency",
    gapBody: "Of the KES 220.4B, KES 118.1B is maintenance and KES 58.0B rehabilitation — citizens rarely see per-kilometre cost breakdowns.",
    action: "Per-km cost breakdown",
    actionBody: "Demand per-kilometre cost breakdowns for all projects over KES 100M and a weekly delayed-project tracker.",
    actionAccent: "Public Works",
  },
  {
    key: "agriculture",
    label: "Agriculture & Food Security",
    shortLabel: "Agriculture",
    allocationBillions: 111.7,
    sourceNote: "3.8% of ministerial allocations — BETA priority",
    gap: "Last-mile",
    gapLabel: "Last-mile leakage",
    gapBody: "Subsidy programmes like the KES 18B fertiliser subsidy only work if inputs reach smallholder farmers, not intermediaries.",
    action: "Demand transparency",
    actionBody: "Insist on public beneficiary lists for all fertiliser and seed programmes within 14 days of disbursement.",
    actionAccent: "PFM Act 2012 §25",
  },
  {
    key: "housing",
    label: "Affordable Housing",
    shortLabel: "Housing",
    allocationBillions: 135.7,
    sourceNote: "Affordable Housing programme, FY2026/27",
    gap: "Delivery",
    gapLabel: "Delivery vs. spend",
    gapBody: "With KES 50.6B for affordable units and KES 20.9B for social housing, delivery must be tracked unit-by-unit against spend.",
    action: "Audit the programme",
    actionBody: "Demand a per-county completion tracker with photographic proof and independent audit reports before each tranche.",
    actionAccent: "Value for money",
  },
  {
    key: "water",
    label: "Water & Sanitation",
    shortLabel: "Water",
    allocationBillions: 70.4,
    sourceNote: "Access to clean & adequate water (within Environment vote)",
    gap: "Deadlines",
    gapLabel: "Project delays",
    gapBody: "Rural water projects routinely slip past their completion dates with few penalties — eroding value from the KES 70.4B allocation.",
    action: "Enforce deadlines",
    actionBody: "Demand penalty enforcement on water contracts exceeding deadline by 6+ months and a national completion tracker.",
    actionAccent: "Contract compliance",
  },
  {
    key: "msmes",
    label: "MSME Economy",
    shortLabel: "MSMEs",
    allocationBillions: 12.7,
    sourceNote: "Selected MSME support programmes (SAFER, NYOTA & others)",
    gap: "Disbursement",
    gapLabel: "Disbursement gap",
    gapBody: "Funds like SAFER (KES 5.4B) and NYOTA (KES 4.9B) only count when they reach enterprises — track ward-level disbursement.",
    action: "Track disbursement",
    actionBody: "Demand a quarterly MSME fund dashboard with ward-level breakdowns and a complaint channel for delayed payments.",
    actionAccent: "Accountability tool",
  },
  {
    key: "digital",
    label: "Digital Superhighway",
    shortLabel: "Digital",
    allocationBillions: 8.6,
    sourceNote: "Digital Superhighway & Creative Economy, FY2026/27",
    gap: "Coverage",
    gapLabel: "Urban bias",
    gapBody: "Connectivity investment skews to major towns — citizens outside Nairobi and Mombasa should see ward-level rollout data.",
    action: "Connectivity audits",
    actionBody: "Insist on quarterly connectivity audits for all 47 counties with a live dashboard of active vs. planned hotspots per ward.",
    actionAccent: "Digital inclusion",
  },
];

export type MilestoneStatus = "completed" | "running" | "pending";

export type MilestoneIcon =
  | "circular"
  | "policy"
  | "approve"
  | "estimates"
  | "participation"
  | "vote"
  | "reading"
  | "finance-bill"
  | "fiscal-year"
  | "appropriation";

export interface BudgetMilestone {
  id: number;
  date: string;
  title: string;
  description: string;
  status: MilestoneStatus;
  icon: MilestoneIcon;
  details: string;
  impact?: string;
}

export const budgetMilestones: BudgetMilestone[] = [
  {
    id: 1,
    date: "Aug 30, 2025",
    title: "MTEF Budget Circular Issued",
    description: "Treasury issued spending ceilings to all MDAs for FY2026/27",
    status: "completed",
    icon: "circular",
    details:
      "Sector Working Groups began reviewing bids against strategic priorities under the Bottom-Up Economic Transformation Agenda (BETA).",
  },
  {
    id: 2,
    date: "Feb 15, 2026",
    title: "Budget Policy Statement Tabled",
    description: "BPS 2026 submitted to Parliament by CS John Mbadi by the statutory deadline",
    status: "completed",
    icon: "policy",
    details:
      "Set the medium-term fiscal framework and sector ceilings ahead of the detailed estimates.",
    impact: "Policy Blueprint",
  },
  {
    id: 3,
    date: "Mar 2026",
    title: "BPS Approved by Parliament",
    description: "National Assembly approved the Budget Policy Statement and sector ceilings",
    status: "completed",
    icon: "approve",
    details:
      "County equitable share anchored at KES 428.0B, with counties receiving KES 502.0B in total once conditional grants are included.",
    impact: "Approved",
  },
  {
    id: 4,
    date: "Apr 30, 2026",
    title: "Budget Estimates Published",
    description: "Detailed revenue & expenditure estimates tabled: a KES 4.82 trillion budget",
    status: "completed",
    icon: "estimates",
    details:
      "Education KES 784.5B, Energy, Infrastructure & ICT KES 531.3B, National Security KES 316.2B and Health KES 177.2B headline the sector ceilings.",
  },
  {
    id: 5,
    date: "May–Jun 2026",
    title: "Committee Review & Public Participation",
    description: "Budget & Appropriations Committee review with public participation",
    status: "completed",
    icon: "participation",
    details:
      "Public hearings held across counties; civil society submitted memoranda on sector allocations under Article 201 and the PFM Act.",
    impact: "Public Input",
  },
  {
    id: 6,
    date: "Jun 11, 2026",
    title: "Budget Statement: CS Mbadi Reads KES 4.82T Budget",
    description: "Budget Statement delivered — KES 4.82T expenditure, KES 1.15T deficit",
    status: "completed",
    icon: "reading",
    details:
      "Theme: 'Sustaining BETA for Resilient and Inclusive Growth amid Global Uncertainty'. Revenue KES 3.63T (incl. AIA), deficit KES 1.15T at 5.5% of GDP, financed by KES 1.03T net domestic and KES 116.2B net external borrowing. Interest & pensions KES 1.5T.",
    impact: "Key Milestone",
  },
  {
    id: 7,
    date: "Jun–Jul 2026",
    title: "Finance Bill 2026 Debate",
    description: "Second and third reading of the Finance Bill in the National Assembly",
    status: "running",
    icon: "finance-bill",
    details:
      "Tax proposals under debate include VAT, excise and income-tax measures set out in the Budget Statement.",
    impact: "Ongoing Debate",
  },
  {
    id: 8,
    date: "Jul 1, 2026",
    title: "FY 2026/27 Begins",
    description: "New financial year starts under interim spending authority",
    status: "pending",
    icon: "fiscal-year",
    details:
      "Government operates on provisional authority (Vote on Account) until the Appropriation Act is signed.",
  },
  {
    id: 9,
    date: "Aug 2026",
    title: "Appropriation Act Signed",
    description: "Budget becomes law upon Presidential assent",
    status: "pending",
    icon: "appropriation",
    details:
      "Final legal authority for all government spending in FY2026/27.",
  },
];

/** Current live position in the budget cycle (used by the evergreen stepper). */
export const CURRENT_CYCLE_STAGE_ID = 6;

/** Formats a KES billions value to a compact "KES 4.82T" / "KES 784.5B" label. */
export function formatKesBillions(billions: number): string {
  if (billions >= 1000) {
    return `KES ${(billions / 1000).toFixed(2)}T`;
  }
  return `KES ${billions.toFixed(1)}B`;
}
