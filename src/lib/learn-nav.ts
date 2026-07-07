import { LmsRoutes } from "@/data/lms/routes";

export type LmsNavId = "home" | "learn" | "progress" | "achievements" | "profile";

export function lmsNavToHref(id: LmsNavId): string {
  switch (id) {
    case "home":
      return LmsRoutes.home;
    case "learn":
      return LmsRoutes.catalogue;
    case "progress":
      return LmsRoutes.progress;
    case "achievements":
      return LmsRoutes.achievements;
    case "profile":
      return LmsRoutes.profile;
  }
}

export function isLmsNavActive(pathname: string, href: string): boolean {
  if (href === LmsRoutes.home) {
    return pathname === LmsRoutes.home;
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

/** @deprecated Use isLmsNavActive — kept for dashboard-shell nav compatibility */
export function isLearnNavHrefActive(
  pathname: string,
  _tabParam: string | null,
  href: string,
): boolean {
  return isLmsNavActive(pathname, href.split("?")[0] ?? href);
}

/** @deprecated Use lmsNavToHref */
export function learnTabToHref(tab: string): string {
  const map: Record<string, string> = {
    home: LmsRoutes.home,
    learn: LmsRoutes.catalogue,
    modules: LmsRoutes.catalogue,
    profile: LmsRoutes.profile,
    progress: LmsRoutes.progress,
    achievements: LmsRoutes.achievements,
  };
  return map[tab] ?? LmsRoutes.home;
}
