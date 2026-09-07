import type { CivicModule } from "@/types/learn";

function isNumericBadge(value?: string | null): boolean {
  return /^\d+$/.test((value ?? "").trim());
}

/**
 * Citizen UI displays:
 * - "badge" as a small icon/emoji (numeric backend ids must not leak)
 * - eyebrow as a human label (usually from badgeName/documentName)
 */
export function getModuleEyebrow(
  module: Pick<CivicModule, "badgeName" | "documentName" | "title">,
): string | null {
  const fallback = module.badgeName || module.documentName || module.title;
  return fallback && fallback !== module.title ? fallback : null;
}

export function getModuleOrderLabel(module: Pick<CivicModule, "order">): string {
  return String(module.order);
}

export function getModuleEmoji(badge?: string | null): string {
  // Backend sometimes returns numeric "badge" ids — do not render them literally.
  if (!badge || isNumericBadge(badge)) return "🧾";
  // If a long string slips in (e.g. "Infrastructure"), still degrade gracefully.
  const trimmed = badge.trim();
  return trimmed.length > 4 ? "🧾" : trimmed;
}

export type ModuleCivicHook = {
  tagline: string;
  leadHook: string;
  urgencyPill: string;
  fastStats: {
    duration: string;
    format: string;
    statute: string;
    takeaway: string;
  };
  keyMasteries: {
    title: string;
    description: string;
    icon: "zap" | "shield" | "scale" | "fileText" | "alertTriangle";
  }[];
};

const MODULE_CIVIC_HOOKS: Record<string, ModuleCivicHook> = {
  "budget-policy-statement": {
    tagline: "95% of Kenya's national budget is decided before June. Learn how to change it before lines freeze.",
    leadHook:
      "Most citizens wait for the June briefcase photo-op when taxes are already law. By then, it's too late. The real fight happens in February when the National Treasury tables sector ceilings under PFM Act Section 25. Learn how to audit the KSh 4 Trillion envelope, spot cuts to healthcare, and draft a parliamentary memorandum that demands accountability.",
    urgencyPill: "Feb 15th Statutory Deadline // PFM Act Section 25",
    fastStats: {
      duration: "15 Min Masterclass",
      format: "3 Sequential Videos",
      statute: "PFM Act Section 25 · Art. 201",
      takeaway: "Parliamentary Memo Format",
    },
    keyMasteries: [
      {
        title: "The February Window",
        description: "Submitting before Feb 20th gives citizens 10x more leverage than protesting in June.",
        icon: "zap",
      },
      {
        title: "Audit Sector Ceilings",
        description: "Verify whether Health, Education, and Agriculture grew or got quietly slashed.",
        icon: "shield",
      },
      {
        title: "Debt vs Services Check",
        description: "Track how much revenue goes to debt service before schools and hospitals get funded.",
        icon: "scale",
      },
      {
        title: "Submit to Parliament",
        description: "Get the exact memorandum structure accepted by the Clerk of the National Assembly.",
        icon: "fileText",
      },
    ],
  },
  "county-budget": {
    tagline: "Where does your county's money actually go? Follow the shilling from Treasury to your local clinic.",
    leadHook:
      "When your governor claims 'the county has no money,' do you know how to audit the claim? Learn how KSh 420B in national equitable share splits across 47 counties, where local revenue leaks, and how to use Controller of Budget (CoB) quarterly reports to hold ward and county leadership accountable.",
    urgencyPill: "KSh 420B Equitable Share // Art. 202 & 203",
    fastStats: {
      duration: "18 Min Fast-Track",
      format: "3 Video Chapters",
      statute: "DoRA · CARA · Art. 202",
      takeaway: "CoB Audit Playbook",
    },
    keyMasteries: [
      {
        title: "The 3 Money Streams",
        description: "Differentiate Equitable Share (Art. 203), Own-Source Revenue, and Conditional Grants.",
        icon: "scale",
      },
      {
        title: "Spot Wage Bill Spikes",
        description: "Catch counties spending over the statutory 35% cap on salaries instead of medicine.",
        icon: "alertTriangle",
      },
      {
        title: "Audit Pending Bills",
        description: "Detect contractors claiming fake completion certificates on unbuilt facilities.",
        icon: "shield",
      },
      {
        title: "Ward-Level Hearings",
        description: "Show up to County Fiscal Strategy Paper (CFSP) hearings armed with hard numbers.",
        icon: "fileText",
      },
    ],
  },
  "kenya-national-infrastructure-fund": {
    tagline: "Toll roads, Eurobonds, and mega-projects: How Kenya finances multi-billion infrastructure.",
    leadHook:
      "Annual budgets expire on June 30th, but expressways, ports, and power grids take decades to repay. Unpack how Special Public Funds under PFM Act Section 24, Public-Private Partnerships (PPPs), and sovereign debt under Article 211 work — and how to ensure citizen taxes don't underwrite private corporate guarantees.",
    urgencyPill: "Mega-Projects & Debt // PFM Act Section 24",
    fastStats: {
      duration: "20 Min Masterclass",
      format: "4 Video Chapters",
      statute: "Art. 211 · PPP Act 2021",
      takeaway: "Sovereign Debt Audit",
    },
    keyMasteries: [
      {
        title: "Dedicated Public Funds",
        description: "Why major infrastructure requires ring-fenced funds outside the annual cycle (PFM Section 24).",
        icon: "zap",
      },
      {
        title: "CFS Debt Service Inspection",
        description: "Audit how debt service costs crowd out productive public infrastructure investment.",
        icon: "scale",
      },
      {
        title: "PPP Concessions & Tolling",
        description: "Examine how private operators charge user fees and where sovereign guarantees hide.",
        icon: "shield",
      },
      {
        title: "Asset vs Liability Audit",
        description: "Determine whether borrowed billions create economic assets or stranded debt.",
        icon: "fileText",
      },
    ],
  },
};

const DEFAULT_ICONS: Array<"zap" | "shield" | "scale" | "fileText"> = ["zap", "shield", "scale", "fileText"];

export function getModuleCivicHook(slug: string, mod?: CivicModule | null): ModuleCivicHook {
  if (MODULE_CIVIC_HOOKS[slug]) {
    return MODULE_CIVIC_HOOKS[slug];
  }

  const title = mod?.title || "Civic Public Finance";
  const desc = mod?.description || "Master Kenyan public finance and citizen oversight.";
  const expectations = mod?.expectations || [];

  return {
    tagline: `Hold public spending accountable with the ${title} masterclass.`,
    leadHook: desc,
    urgencyPill: "Civic Fast-Track // Article 201",
    fastStats: {
      duration: `~${Math.max(10, (mod?.steps?.length || 3) * 5)} Min`,
      format: `${mod?.steps?.length || 3} Lesson Chapters`,
      statute: "Article 201 · PFM Act",
      takeaway: "Citizen Action Guide",
    },
    keyMasteries: expectations.length
      ? expectations.slice(0, 4).map((exp, idx) => ({
          title: `Core Competency 0${idx + 1}`,
          description: exp,
          icon: DEFAULT_ICONS[idx % DEFAULT_ICONS.length],
        }))
      : [
          {
            title: "Constitutional Basis",
            description: "Rooted in Article 201 values of openness, accountability, and fair tax burdens.",
            icon: "scale",
          },
          {
            title: "Public Audit Skills",
            description: "Learn how to read official Treasury documents and verify spending data.",
            icon: "shield",
          },
          {
            title: "Civic Action Window",
            description: "Know exactly when and where citizen submissions alter legislative outcomes.",
            icon: "zap",
          },
          {
            title: "Actionable Deliverables",
            description: "Templates and tools ready for ward, county, or parliamentary engagement.",
            icon: "fileText",
          },
        ],
  };
}
