import { learnHubApi, type ModuleAnalyticsResponse } from "./learn-hub";
import { trackAnalytics } from "./gamification";

export type AnalyticsQuery = {
  period?: "daily" | "weekly";
  module_slug?: string;
};

export async function fetchModuleAnalytics(
  query?: AnalyticsQuery,
): Promise<ModuleAnalyticsResponse | null> {
  try {
    return await learnHubApi.moduleAnalytics(query);
  } catch {
    return null;
  }
}

export function trackModuleEvent(
  eventName: string,
  payload?: Record<string, unknown>,
): void {
  void trackAnalytics(eventName, payload);
}

export function trackModuleView(moduleSlug: string): void {
  void trackAnalytics("module_view", {
    module_slug: moduleSlug,
    timestamp: new Date().toISOString(),
  });
}

export function trackChapterView(
  moduleSlug: string,
  chapterId: string,
): void {
  void trackAnalytics("chapter_view", {
    module_slug: moduleSlug,
    chapter_id: chapterId,
    timestamp: new Date().toISOString(),
  });
}

export function trackModuleStart(moduleSlug: string): void {
  void trackAnalytics("module_start", {
    module_slug: moduleSlug,
    timestamp: new Date().toISOString(),
  });
}

export function trackModuleComplete(moduleSlug: string): void {
  void trackAnalytics("module_complete", {
    module_slug: moduleSlug,
    timestamp: new Date().toISOString(),
  });
}
