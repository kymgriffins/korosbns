/**
 * @sdp-provenance
 * capability: CAP-course-detail
 * spec_id: LJP-004
 * contracts: sic-cap-004@1.0.0
 */

/** SIC-CAP-004 — Estimated Time display */
export function formatJourneyTime(durationMinutes: number): string {
  if (durationMinutes < 60) return `${durationMinutes} min`;
  const hours = Math.floor(durationMinutes / 60);
  const minutes = durationMinutes % 60;
  if (minutes === 0) return `~${hours}h`;
  return `~${hours}h ${minutes}m`;
}

/** SIC-CAP-004 §7 — max 4 outcomes from course or module objectives */
export function resolveLearningOutcomes(course: {
  learningOutcomes?: string[];
  modules: { objectives: string[] }[];
}): string[] {
  if (course.learningOutcomes?.length) {
    return course.learningOutcomes.slice(0, 4);
  }
  const seen = new Set<string>();
  const out: string[] = [];
  for (const mod of course.modules) {
    for (const objective of mod.objectives) {
      if (seen.has(objective)) continue;
      seen.add(objective);
      out.push(objective);
      if (out.length >= 4) return out;
    }
  }
  return out;
}

/** SIC-CAP-004 §9 — auto-expand if exactly one in_progress module */
export function resolveDefaultOpenModule(
  modules: { slug: string; status: string }[],
): string | undefined {
  const inProgress = modules.filter((m) => m.status === "in_progress");
  if (inProgress.length === 1) return inProgress[0].slug;
  return undefined;
}
