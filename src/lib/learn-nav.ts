import { Routes } from "@/constants/routes";
import type { LearnTab } from "@/contexts/learn-context";

/** Map hub tab → dedicated shareable route (same speed model as Content pages). */
export function learnTabToHref(tab: LearnTab): string {
  switch (tab) {
    case "home":
      return Routes.Learn;
    case "learn":
      return Routes.LearnModules;
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
  if (path === Routes.LearnModules) {
    return "learn";
  }
  if (path === Routes.LearnAlerts) {
    return "alerts";
  }

  // Module detail pages are under /learn/modules/[slug] — not a hub tab
  if (path.startsWith(`${Routes.LearnModules}/`)) {
    return null;
  }

  if (path !== Routes.Learn) {
    return null;
  }

  // Legacy ?tab= on /learn (redirects should clear these; keep for active-state races)
  switch (tabParam) {
    case "modules":
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
      return "home";
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

  if (target === Routes.Learn) {
    return path === Routes.Learn;
  }

  if (target === Routes.LearnModules) {
    return path === Routes.LearnModules;
  }

  return path === target || path.startsWith(`${target}/`);
}

/** Legacy /learn?tab=* → dedicated routes (for redirects). */
export function legacyLearnTabRedirect(tabParam: string | null): string | null {
  switch (tabParam) {
    case "modules":
      return Routes.LearnModules;
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
