import type {
  BudgetSchema,
  NationalSector,
  RevenueStream,
  SubVoteBreakdown,
  WardProject,
} from "@/lib/budget-schema";
import { formatKesBillions } from "@/lib/budget-format";
import { getTotalNationalBudget } from "@/lib/reports-api";

export type BriefChapterId =
  | "pulse"
  | "revenue"
  | "debt"
  | "sectors"
  | "counties"
  | "projects";

export interface BriefChapter {
  id: BriefChapterId;
  label: string;
  shortLabel: string;
  emoji: string;
}

export interface CategoryBrief {
  id: string;
  title: string;
  amountBillions: number;
  sharePct: number | null;
  summary: string;
  takeaway: string;
  accent: string;
  tags?: string[];
  lines?: { label: string; amountBillions: number; note?: string }[];
}

export interface ReportsBriefModel {
  fiscalYear: string;
  theme: string;
  presentedBy: string;
  totalNationalBillions: number;
  totalRevenueBillions: number;
  deficitBillions: number;
  deficitGdpPct: number;
  devolutionBillions: number;
  chapters: BriefChapter[];
  pulse: CategoryBrief;
  revenue: CategoryBrief;
  debt: CategoryBrief;
  sectors: CategoryBrief[];
  counties: CategoryBrief;
  projects: CategoryBrief[];
}

export const BRIEF_CHAPTERS: BriefChapter[] = [
  { id: "pulse", label: "Pulse", shortLabel: "Pulse", emoji: "◎" },
  { id: "revenue", label: "Revenue", shortLabel: "Income", emoji: "↗" },
  { id: "debt", label: "Debt & gap", shortLabel: "Debt", emoji: "△" },
  { id: "sectors", label: "Sectors", shortLabel: "Sectors", emoji: "▦" },
  { id: "counties", label: "Counties", shortLabel: "Counties", emoji: "⌂" },
  { id: "projects", label: "Projects", shortLabel: "Projects", emoji: "◈" },
];

const SECTOR_ACCENTS: Record<string, string> = {
  "SEC-EDU": "from-sky-500/20 to-blue-600/5",
  "SEC-GJLO": "from-violet-500/20 to-purple-600/5",
  "SEC-SEC": "from-slate-500/20 to-zinc-600/5",
  "SEC-INF": "from-amber-500/20 to-orange-600/5",
  "SEC-HEA": "from-rose-500/20 to-red-600/5",
  "SEC-HOU": "from-teal-500/20 to-cyan-600/5",
  "SEC-AGR": "from-lime-500/20 to-green-600/5",
  "SEC-SOC-YTH-WAT": "from-emerald-500/20 to-green-700/5",
  "SEC-ENG-ICT": "from-indigo-500/20 to-blue-700/5",
};

function toBillions(raw: number): number {
  return Math.round((raw / 1e9) * 10) / 10;
}

function shortSectorName(name: string): string {
  return name
    .replace(" & Rural Development", "")
    .replace(" & Urban Development", "")
    .replace(", Youth, Water & Climate Infrastructure Cluster", "")
    .replace(" & Digital Economy Cluster", "");
}

function topVote(sector: NationalSector): SubVoteBreakdown | undefined {
  return [...(sector.sub_vote_breakdown ?? [])].sort((a, b) => b.amount - a.amount)[0];
}

function revenueStreamLabel(stream: RevenueStream): string {
  switch (stream.type) {
    case "ORDINARY_REVENUE":
      return "Ordinary revenue (KRA)";
    case "APPROPRIATIONS_IN_AID_AIA":
      return "Appropriations-in-Aid";
    case "GRANTS":
      return "External grants";
    default:
      return stream.type.replace(/_/g, " ").toLowerCase();
  }
}

function buildSectorBrief(sector: NationalSector, totalNational: number): CategoryBrief {
  const top = topVote(sector);
  const amountBillions = toBillions(sector.total_allocation);
  const sharePct = sector.national_budget_share_pct;
  const topShare =
    top && sector.total_allocation > 0
      ? ((top.amount / sector.total_allocation) * 100).toFixed(0)
      : null;

  const summary = top
    ? `${shortSectorName(sector.name)} is allocated ${formatKesBillions(amountBillions, { prefix: false })} (${sharePct.toFixed(1)}% of national spending). The largest vote line is ${top.vote_head} at ${formatKesBillions(toBillions(top.amount), { prefix: false })}${topShare ? ` — ${topShare}% of this sector` : ""}.`
    : `${shortSectorName(sector.name)} is allocated ${formatKesBillions(amountBillions, { prefix: false })} (${sharePct.toFixed(1)}% of national spending).`;

  let takeaway = "Track how this sector's vote lines translate into services in your county and constituency.";
  if (sector.beta_alignment_tags?.length) {
    takeaway = `Aligned to ${sector.beta_alignment_tags[0]}. Ask your MP and county assembly how this envelope reaches citizens — not just headline totals.`;
  }
  if (top?.beneficiaries_count) {
    takeaway = `About ${top.beneficiaries_count.toLocaleString()} beneficiaries are named in the top vote line. Verify delivery where you live.`;
  }
  if (top?.note) {
    takeaway = top.note;
  }

  return {
    id: sector.sector_code,
    title: shortSectorName(sector.name),
    amountBillions,
    sharePct,
    summary,
    takeaway,
    accent: SECTOR_ACCENTS[sector.sector_code] ?? "from-primary/15 to-primary/5",
    tags: sector.beta_alignment_tags,
    lines: (sector.sub_vote_breakdown ?? []).slice(0, 5).map((v) => ({
      label: v.vote_head,
      amountBillions: toBillions(v.amount),
      note: v.note,
    })),
  };
}

function buildRevenueBrief(data: BudgetSchema): CategoryBrief {
  const rev = data.macro_modules.revenue_engine;
  const total = toBillions(rev.total_projected_revenue);
  const streams = rev.streams ?? [];
  const ordinary = streams.find((s) => s.type === "ORDINARY_REVENUE");

  return {
    id: "revenue",
    title: "How Kenya earns",
    amountBillions: total,
    sharePct: null,
    summary: `The state projects ${formatKesBillions(total, { prefix: false })} in revenue for ${data.metadata.fiscal_year}. Ordinary revenue collected by KRA remains the backbone at ${formatKesBillions(toBillions(ordinary?.amount ?? 0), { prefix: false })}.`,
    takeaway:
      "When ordinary revenue underperforms, borrowing and service cuts fill the gap. Watch KRA collection updates during the year — they signal whether planned spending is realistic.",
    accent: "from-emerald-500/20 to-green-600/5",
    lines: streams.map((s) => ({
      label: revenueStreamLabel(s),
      amountBillions: toBillions(s.amount),
      note: s.description,
    })),
  };
}

function buildDebtBrief(data: BudgetSchema): CategoryBrief {
  const debt = data.macro_modules.debt_portfolio;
  const deficit = toBillions(debt.fiscal_deficit_gap);
  const interest = toBillions(debt.total_interest_service_obligation);
  const domestic = toBillions(debt.financing_plan.domestic_borrowing_target);
  const external = toBillions(debt.financing_plan.external_borrowing_target);

  return {
    id: "debt",
    title: "Debt & fiscal gap",
    amountBillions: deficit,
    sharePct: debt.deficit_gdp_ratio_pct,
    summary: `Kenya plans to borrow to cover a ${formatKesBillions(deficit, { prefix: false })} gap (${debt.deficit_gdp_ratio_pct}% of GDP). Interest payments alone are ${formatKesBillions(interest, { prefix: false })} — money that cannot hire teachers or build roads.`,
    takeaway: `Domestic borrowing (${formatKesBillions(domestic, { prefix: false })}) crowds out private credit. The target is to shrink the deficit to ${debt.target_deficit_fy2028_29_pct}% of GDP by FY 2028/29 — citizens should track whether that path is credible.`,
    accent: "from-orange-500/20 to-red-600/5",
    tags: debt.systemic_risks?.slice(0, 2),
    lines: [
      { label: "Domestic borrowing", amountBillions: domestic },
      { label: "External borrowing", amountBillions: external },
      { label: "Interest obligation", amountBillions: interest },
    ],
  };
}

function buildCountiesBrief(data: BudgetSchema): CategoryBrief {
  const env = data.tier_2_county_devolution_envelope;
  const total = toBillions(env.total_devolution_allocation);
  const split = env.funding_split;
  const profiles = env.county_profiles ?? [];

  const summary =
    profiles.length > 0
      ? `${formatKesBillions(total, { prefix: false })} flows to counties (${env.national_budget_share_pct}% of national budget). ${profiles.length} county profiles are published from CRA data.`
      : `${formatKesBillions(total, { prefix: false })} is the county devolution envelope (${env.national_budget_share_pct}% of national budget). Equitable share is ${formatKesBillions(toBillions(split.unconditional_equitable_share), { prefix: false })} before conditional grants.`;

  return {
    id: "counties",
    title: "County devolution",
    amountBillions: total,
    sharePct: env.national_budget_share_pct,
    summary,
    takeaway:
      "Your county's equitable share is the floor, not the ceiling. Conditional grants (UHC, CAIPs, climate pools) come with rules — follow county finance bills to see what actually arrives.",
    accent: "from-cyan-500/20 to-teal-600/5",
    lines: (env.conditional_allocation_breakdown ?? []).slice(0, 5).map((c) => ({
      label: c.item,
      amountBillions: toBillions(c.amount),
    })),
  };
}

function buildProjectBrief(project: WardProject): CategoryBrief {
  const allocated = toBillions(project.financials.allocated_amount);
  const spent = toBillions(project.financials.expenditure_to_date);
  const absorption = project.oversight_metrics.absorption_rate_pct;

  return {
    id: project.project_uuid,
    title: project.project_name,
    amountBillions: allocated,
    sharePct: absorption,
    summary: `${project.location.ward_name} ward · ${project.lifecycle_status.replace(/_/g, " ")}. ${formatKesBillions(allocated, { prefix: false })} allocated with ${absorption}% absorption.`,
    takeaway: project.oversight_metrics.stalled_flag
      ? "Flagged as potentially stalled — this is exactly where citizen reporting matters."
      : "Ward-level projects are where national budget lines meet your neighbourhood. Compare releases vs expenditure on the ground.",
    accent: "from-fuchsia-500/20 to-pink-600/5",
    lines: [
      {
        label: "Released",
        amountBillions: toBillions(project.financials.released_amount),
      },
      {
        label: "Spent to date",
        amountBillions: spent,
      },
    ],
  };
}

export function buildReportsBrief(data: BudgetSchema): ReportsBriefModel {
  const totalNational = getTotalNationalBudget(data);
  const totalNationalBillions = toBillions(totalNational);
  const totalRevenueBillions = toBillions(data.macro_modules.revenue_engine.total_projected_revenue);
  const deficitBillions = toBillions(data.macro_modules.debt_portfolio.fiscal_deficit_gap);
  const devolutionBillions = toBillions(
    data.tier_2_county_devolution_envelope.total_devolution_allocation,
  );

  const sectors = [...(data.tier_1_national_sectors ?? [])]
    .sort((a, b) => b.total_allocation - a.total_allocation)
    .map((s) => buildSectorBrief(s, totalNational));

  const projects = (data.tier_3_ward_project_relational_schema_simulation ?? []).map(
    buildProjectBrief,
  );

  const pulse: CategoryBrief = {
    id: "pulse",
    title: `FY ${data.metadata.fiscal_year} at a glance`,
    amountBillions: totalNationalBillions,
    sharePct: null,
    summary: data.metadata.theme,
    takeaway: `Presented by ${data.metadata.presented_by}. National sectors total ${formatKesBillions(totalNationalBillions, { prefix: false })} against ${formatKesBillions(totalRevenueBillions, { prefix: false })} projected revenue — a ${formatKesBillions(deficitBillions, { prefix: false })} gap filled largely through borrowing.`,
    accent: "from-primary/20 to-primary/5",
    lines: [
      { label: "National sectors", amountBillions: totalNationalBillions },
      { label: "Projected revenue", amountBillions: totalRevenueBillions },
      { label: "County devolution", amountBillions: devolutionBillions },
      { label: "Fiscal gap", amountBillions: deficitBillions },
    ],
  };

  return {
    fiscalYear: data.metadata.fiscal_year,
    theme: data.metadata.theme,
    presentedBy: data.metadata.presented_by,
    totalNationalBillions,
    totalRevenueBillions,
    deficitBillions,
    deficitGdpPct: data.macro_modules.debt_portfolio.deficit_gdp_ratio_pct,
    devolutionBillions,
    chapters: BRIEF_CHAPTERS,
    pulse,
    revenue: buildRevenueBrief(data),
    debt: buildDebtBrief(data),
    sectors,
    counties: buildCountiesBrief(data),
    projects,
  };
}
