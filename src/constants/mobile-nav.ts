import type { LucideIcon } from "lucide-react";
import {
  BookOpen,
  Calendar,
  ClipboardList,
  Home,
  MoreHorizontal,
} from "lucide-react";
import { Routes } from "./routes";

export type MarketingMobileNavItem = {
  id: string;
  label: string;
  href?: string;
  icon: LucideIcon;
  /** Opens the overflow menu sheet instead of navigating */
  opensMenu?: boolean;
  /** Path prefixes that mark this tab active (defaults to [href]) */
  matchPrefixes?: string[];
};

export const MARKETING_MOBILE_NAV: MarketingMobileNavItem[] = [
  {
    id: "home",
    label: "Home",
    href: Routes.Home,
    icon: Home,
    matchPrefixes: ["/"],
  },
  {
    id: "learn",
    label: "Learn",
    href: Routes.Learn,
    icon: BookOpen,
    matchPrefixes: ["/learn"],
  },
  {
    id: "surveys",
    label: "Surveys",
    href: Routes.Surveys,
    icon: ClipboardList,
    matchPrefixes: ["/surveys"],
  },
  {
    id: "events",
    label: "Events",
    href: Routes.Events,
    icon: Calendar,
    matchPrefixes: ["/events"],
  },
  {
    id: "more",
    label: "More",
    icon: MoreHorizontal,
    opensMenu: true,
    matchPrefixes: ["/faq", "/contact", "/articles", "/knowledge", "/trivia"],
  },
];
