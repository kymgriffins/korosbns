import { Routes } from "@/constants/routes";
import type { LearnTab } from "@/contexts/learn-context";

/** Map hub tab → shareable route */
export function learnTabToHref(tab: LearnTab): string {
  switch (tab) {
    case "home":
      return Routes.Learn;
    case "learn":
      return `${Routes.Learn}?tab=modules`;
    case "alerts":
      return `${Routes.Learn}?tab=alerts`;
    case "documents":
      return Routes.LearnDocuments;
    case "forum":
      return Routes.LearnForum;
    case "profile":
      return `${Routes.Learn}?tab=profile`;
  }
}

/** Resolve hub tab from current location; null when path is unrelated hub content (articles, etc.) */
export function learnTabFromLocation(
  pathname: string,
  tabParam: string | null,
): LearnTab | null {
  if (pathname === Routes.LearnForum || pathname.startsWith(`${Routes.LearnForum}/`)) {
    return "forum";
  }
  if (pathname === Routes.LearnDocuments || pathname.startsWith(`${Routes.LearnDocuments}/`)) {
    return "documents";
  }
  if (pathname !== Routes.Learn) {
    return null;
  }

  switch (tabParam) {
    case "modules":
      return "learn";
    case "alerts":
      return "alerts";
    case "profile":
      return "profile";
    default:
      return "home";
  }
}
