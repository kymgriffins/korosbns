import type { CivicModule } from "@/types/learn";

export type PersonalizationPrefs = {
  county?: string | null;
  language?: string | null;
  ageRange?: string | null;
  educationLevel?: string | null;
  interests?: string[] | null;
};

/**
 * Rank published modules for a logged-in learner using soft signals.
 * Never hides modules — only reorders / picks recommendations.
 */
export function recommendModules(
  modules: CivicModule[],
  prefs: PersonalizationPrefs,
  limit = 3,
): CivicModule[] {
  if (!modules.length) return [];
  const county = (prefs.county || "").toLowerCase().trim();
  const lang = (prefs.language || "EN").toUpperCase();
  const interests = (prefs.interests || []).map((i) => i.toLowerCase());
  const age = (prefs.ageRange || "").toLowerCase();

  const scored = modules.map((mod, index) => {
    let score = modules.length - index; // preserve publish order as base
    const hay = `${mod.title} ${mod.description || ""} ${mod.badge || ""}`.toLowerCase();

    if (county && (hay.includes("county") || hay.includes(county))) score += 8;
    if (lang === "SW" && (hay.includes("kiswahili") || hay.includes("swahili"))) score += 6;
    if (age.includes("youth") || age.includes("15") || age.includes("18")) {
      if (hay.includes("youth") || hay.includes("school") || hay.includes("101")) score += 4;
    }
    for (const interest of interests) {
      if (interest && hay.includes(interest)) score += 5;
    }
    return { mod, score };
  });

  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((s) => s.mod);
}
