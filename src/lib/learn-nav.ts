import { Routes } from "@/constants/routes";
import type { LearnTab } from "@/contexts/learn-context";

/** Map hub tab → dedicated shareable route. */
export function learnTabToHref(tab: LearnTab): string {
  switch (tab) {
    case "home":
    case "learn":
      return Routes.Learn;
    case "alerts":
      return Routes.LearnAlerts;
    case "documents":
      return Routes.LearnDocuments;
    case "forum":
      return Routes.LearnForum;
    case "profile":
      return Routes.LearnProfile;
  }
}

/** Resolve hub tab from current location; null for Content routes (videos/articles/…). */
export function learnTabFromLocation(
  pathname: string,
  tabParam: string | null,
): LearnTab | null {
  const path = pathname.replace(/\/$/, "") || "/";

  if (path === Routes.LearnForum || path.startsWith(`${Routes.LearnForum}/`)) {
    return "forum";
  }
  if (path === Routes.LearnDocuments || path.startsWith(`${Routes.LearnDocuments}/`)) {
    return "documents";
  }
  if (path === Routes.LearnProfile || path.startsWith(`${Routes.LearnProfile}/`)) {
    return "profile";
  }
  if (path === Routes.LearnModules || path === Routes.Learn) {
    return "learn";
  }
  if (path === Routes.LearnAlerts) {
    return "alerts";
  }

  // Module detail / immersive — not a hub tab highlight
  if (path.startsWith(`${Routes.LearnModules}/`)) {
    return null;
  }

  if (path !== Routes.Learn) {
    return null;
  }

  switch (tabParam) {
    case "modules":
    case "home":
      return "learn";
    case "alerts":
      return "alerts";
    case "profile":
      return "profile";
    case "documents":
      return "documents";
    case "forum":
      return "forum";
    default:
      return "learn";
  }
}

/** Active state for sidebar / hub links. */
export function isLearnNavHrefActive(
  pathname: string,
  _tabParam: string | null,
  href: string,
): boolean {
  const path = pathname.replace(/\/$/, "") || "/";
  const target = (href.split("?")[0] ?? href).replace(/\/$/, "") || "/";

  if (target === Routes.Learn || target === Routes.LearnModules) {
    return path === Routes.Learn || path === Routes.LearnModules;
  }

  return path === target || path.startsWith(`${target}/`);
}

/** Legacy /learn?tab=* → dedicated routes (for redirects). */
export function legacyLearnTabRedirect(tabParam: string | null): string | null {
  switch (tabParam) {
    case "modules":
    case "home":
      return Routes.Learn;
    case "alerts":
      return Routes.LearnAlerts;
    case "documents":
      return Routes.LearnDocuments;
    case "forum":
      return Routes.LearnForum;
    case "profile":
      return Routes.LearnProfile;
    default:
      return null;
  }
}
