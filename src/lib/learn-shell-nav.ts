import type { LucideIcon } from "lucide-react";
import {
  BellRing,
  CircleUserRound,
  FolderOpen,
  LayoutDashboard,
  MapPinned,
  MessagesSquare,
  Newspaper,
  PlayCircle,
  Route,
  Target,
} from "lucide-react";
import type { LearnTab } from "@/contexts/learn-context";
import { Routes } from "@/constants/routes";
import { learnTabFromLocation, learnTabToHref } from "@/lib/learn-nav";

export type LearnNavSectionId = "journey" | "explore" | "you";

export type LearnShellNavItem = {
  id: string;
  tab?: LearnTab;
  section: LearnNavSectionId;
  title: string;
  shortLabel: string;
  description: string;
  dataHint: string;
  principle: string;
  icon: LucideIcon;
  href: string;
  mobilePrimary?: boolean;
};

export const LEARN_NAV_SECTIONS: Record<
  LearnNavSectionId,
  { label: string; caption: string }
> = {
  journey: {
    label: "Your journey",
    caption: "Progress, modules, and civic participation",
  },
  explore: {
    label: "Explore more",
    caption: "Videos, stories, and short-form learning",
  },
  you: {
    label: "You",
    caption: "Identity, badges, and preferences",
  },
};

export const LEARN_SHELL_NAV: LearnShellNavItem[] = [
  {
    id: "overview",
    tab: "home",
    section: "journey",
    title: "Overview",
    shortLabel: "Overview",
    description: "Resume modules, track streaks, and see what to do next.",
    dataHint: "Your progress, quests, and leaderboard",
    principle: "Purpose",
    icon: LayoutDashboard,
    href: learnTabToHref("home"),
    mobilePrimary: true,
  },
  {
    id: "modules",
    tab: "learn",
    section: "journey",
    title: "Budget modules",
    shortLabel: "Modules",
    description: "Step-by-step lessons on Kenya's budget cycle.",
    dataHint: "Civic modules · FY analysis paths",
    principle: "Simplicity",
    icon: Route,
    href: learnTabToHref("learn"),
    mobilePrimary: true,
  },
  {
    id: "documents",
    tab: "documents",
    section: "journey",
    title: "Official documents",
    shortLabel: "Documents",
    description: "Treasury, county, and parliamentary budget files.",
    dataHint: "Repository · PDFs you can track",
    principle: "Responsibility",
    icon: FolderOpen,
    href: learnTabToHref("documents"),
    mobilePrimary: true,
  },
  {
    id: "participation",
    tab: "alerts",
    section: "journey",
    title: "Participation alerts",
    shortLabel: "Alerts",
    description: "Comment windows and hearings matched to your county.",
    dataHint: "Local participation · your tracked docs",
    principle: "Agency",
    icon: BellRing,
    href: learnTabToHref("alerts"),
  },
  {
    id: "forum",
    tab: "forum",
    section: "journey",
    title: "Citizen forum",
    shortLabel: "Forum",
    description: "Ask questions and learn with other Mwananchi.",
    dataHint: "Community threads · moderated discussion",
    principle: "Familiarity",
    icon: MessagesSquare,
    href: learnTabToHref("forum"),
    mobilePrimary: true,
  },
  {
    id: "videos",
    section: "explore",
    title: "Video explainers",
    shortLabel: "Videos",
    description: "Short budget breakdowns from BNS and partners.",
    dataHint: "YouTube library · transcripts where available",
    principle: "Flexibility",
    icon: PlayCircle,
    href: Routes.LearnVideos,
  },
  {
    id: "articles",
    section: "explore",
    title: "Budget articles",
    shortLabel: "Articles",
    description: "Standalone explainers outside structured modules.",
    dataHint: "Editorial · searchable archive",
    principle: "Clarity",
    icon: Newspaper,
    href: Routes.LearnArticles,
  },
  {
    id: "stories",
    section: "explore",
    title: "Field stories",
    shortLabel: "Stories",
    description: "On-the-ground civic engagement from across Kenya.",
    dataHint: "Community narratives · regional context",
    principle: "Delight",
    icon: MapPinned,
    href: Routes.LearnStories,
  },
  {
    id: "quests",
    section: "explore",
    title: "Daily quests",
    shortLabel: "Quests",
    description: "Quick challenges that reinforce what you learned.",
    dataHint: "Gamification · XP and badges",
    principle: "Craft",
    icon: Target,
    href: Routes.LearnQuests,
  },
  {
    id: "profile",
    tab: "profile",
    section: "you",
    title: "Your profile",
    shortLabel: "Profile",
    description: "Badges, certificates, language, and privacy choices.",
    dataHint: "Account · only what you choose to share",
    principle: "Responsibility",
    icon: CircleUserRound,
    href: learnTabToHref("profile"),
    mobilePrimary: true,
  },
];

export function getLearnNavItem(id: string): LearnShellNavItem | undefined {
  return LEARN_SHELL_NAV.find((item) => item.id === id);
}

export function getLearnNavByTab(tab: LearnTab): LearnShellNavItem | undefined {
  return LEARN_SHELL_NAV.find((item) => item.tab === tab);
}

export function getLearnNavByLocation(
  pathname: string,
  tabParam: string | null,
): LearnShellNavItem | undefined {
  const tab = learnTabFromLocation(pathname, tabParam);
  if (tab) {
    return getLearnNavByTab(tab);
  }

  const normalized =
    pathname.length > 1 && pathname.endsWith("/")
      ? pathname.slice(0, -1)
      : pathname;

  return LEARN_SHELL_NAV.find((item) => {
    const itemPath = item.href.split("?")[0].replace(/\/$/, "") || "/";
    const comparePath = normalized.replace(/\/$/, "") || "/";
    return itemPath === comparePath;
  });
}

export function learnNavGroupedBySection(): Array<{
  section: LearnNavSectionId;
  items: LearnShellNavItem[];
}> {
  const order: LearnNavSectionId[] = ["journey", "explore", "you"];
  return order.map((section) => ({
    section,
    items: LEARN_SHELL_NAV.filter((item) => item.section === section),
  }));
}

export function learnMobileNavItems(): LearnShellNavItem[] {
  const order = ["overview", "documents", "modules", "forum", "profile"] as const;
  return order
    .map((id) => getLearnNavItem(id))
    .filter((item): item is LearnShellNavItem => Boolean(item));
}
