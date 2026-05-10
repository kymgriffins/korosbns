import {
  IconGauge,
  IconClipboardList,
  IconBook2,
  IconUsers,
  IconSettings,
  IconTarget,
  IconMessageCircle,
  IconShieldCheck,
  IconDatabase,
} from "@tabler/icons-react";

export const SIDEBAR_GROUPS = [
  {
    id: "overview",
    title: "Overview",
    icon: IconGauge,
    models: ["dashboard", "user", "organizationmember", "auditlog"],
  },
  {
    id: "execution",
    title: "Execution",
    icon: IconTarget,
    models: [
      "project",
      "campaign",
      "program",
      "programcohort",
      "budgetverificationreport",
      "campushubreport",
      "townhallreport",
      "activity",
      "impactmetric",
      "roadmapitem",
      "organizationfinancial"
    ],
  },
  {
    id: "knowledge",
    title: "Knowledge Hub",
    icon: IconBook2,
    models: [
      "story",
      "deepdivearticle",
      "trivia",
      "document",
      "knowledgeentry",
      "docfolder",
    ],
  },
  {
    id: "automation",
    title: "Automation & Growth",
    icon: IconMessageCircle,
    models: ["subscriber", "teamquote", "partner", "socialaccount"],
  },
  {
    id: "system",
    title: "System Settings",
    icon: IconSettings,
    models: [
      "organization",
      "teammember",
      "changelog",
      "versioninfo",
      "gamificationprofile",
      "pointevent",
    ],
  },
];

export const MAX_PRIMARY_SIDEBAR_ITEMS = 5;
