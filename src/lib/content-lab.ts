/**
 * Admin Content Lab / Test Runner v1 — inventory + presence + suite.
 * Spec: audit/ADMIN-CONTENT-TEST-RUNNER.md · PRD Section 8.4
 *
 * Required keys are a hardcoded mirror of learn-hub.yaml critical surfaces
 * plus BUDGET_YEAR_CRITICAL_KEYS. Not a full CMS.
 */

import civicModulesFallback from "@/data/fallbacks/civic-modules.json";
import learnStoriesFallback from "@/data/fallbacks/learn-stories.json";
import { getVideos } from "@/data/videos";
import { getFyEpisode, listInAppEpisodes } from "@/lib/budget-episodes";
import {
  BUDGET_YEAR_CRITICAL_KEYS,
  getBudgetSources,
  getBudgetSourcesUpdated,
  level1SourcesOnly,
  type BudgetSource,
} from "@/lib/budget-sources";
import { ensureModulesBpsYoutube, filterModulesWithPublishableContent } from "@/lib/civic-module-content";
import type { CivicModule } from "@/types/learn";

export type PresenceStatus = "API" | "FALLBACK" | "MISSING";

export type SurfaceRequiredKey = {
  key: string;
  required: boolean;
  fallbackHint?: string;
};

export type SurfaceContractMirror = {
  id: string;
  job: string;
  keys: SurfaceRequiredKey[];
  /** Admin edit deep-link (local /dashboard path). */
  editUrl?: string;
};

export type PresenceCell = {
  surfaceId: string;
  key: string;
  status: PresenceStatus;
  detail: string;
};

export type SuiteCheck = {
  id: string;
  name: string;
  pass: boolean;
  message: string;
  editUrl?: string;
};

export type ContentLabSnapshot = {
  ranAt: string;
  sourcesUpdated: string;
  level1Sources: BudgetSource[];
  surfaces: SurfaceContractMirror[];
  matrix: PresenceCell[];
  suite: SuiteCheck[];
  summary: { pass: number; fail: number; api: number; fallback: number; missing: number };
};

/** Hardcoded mirror of agent/spec/surface-contracts/learn-hub.yaml (critical rows). */
export const LEARN_HUB_SURFACE_MIRROR: SurfaceContractMirror[] = [
  {
    id: "learn.hub.hero",
    job: "Start the next budget lesson in one tap",
    editUrl: "/dashboard/modules",
    keys: [
      { key: "headline", required: true, fallbackHint: "Learn Kenya's budget" },
      { key: "subcopy", required: true, fallbackHint: "Free civic syllabus" },
      { key: "primary_module_slug", required: true, fallbackHint: "budget-policy-statement" },
      { key: "primary_href", required: true, fallbackHint: "/learn/modules/…" },
    ],
  },
  {
    id: "learn.hub.continue",
    job: "Resume unfinished modules",
    editUrl: "/dashboard/modules",
    keys: [
      { key: "items[].slug", required: true, fallbackHint: "civic-modules.json" },
      { key: "items[].title", required: true, fallbackHint: "civic-modules.json" },
      { key: "items[].pct", required: true, fallbackHint: "0 (local)" },
      { key: "items[].href", required: true, fallbackHint: "/learn/modules/{slug}" },
    ],
  },
  {
    id: "learn.hub.watch",
    job: "Pick a video or podcast chapter",
    editUrl: "/dashboard/media",
    keys: [
      { key: "items[].id", required: true, fallbackHint: "DEFAULT_VIDEOS" },
      { key: "items[].title", required: true, fallbackHint: "DEFAULT_VIDEOS" },
      { key: "items[].youtube_id", required: false, fallbackHint: "" },
    ],
  },
  {
    id: "learn.hub.stories",
    job: "Complete one short budget story beat",
    editUrl: "/dashboard/stories",
    keys: [
      { key: "stories[].slug", required: true, fallbackHint: "learn-stories.json" },
      { key: "stories[].slides[].text", required: true, fallbackHint: "learn-stories.json" },
    ],
  },
  {
    id: "learn.hub.numbers",
    job: "Understand one budget number",
    editUrl: "/dashboard/ke-budget",
    keys: [
      { key: "rows[].label", required: true, fallbackHint: "episode metrics" },
      { key: "rows[].value", required: true, fallbackHint: "episode metrics" },
      { key: "rows[].meaning", required: true, fallbackHint: "citizen_impact" },
      { key: "fy", required: true, fallbackHint: "2026/27" },
    ],
  },
  {
    id: "learn.hub.know",
    job: "See what you now know",
    editUrl: "/dashboard/gamification",
    keys: [
      { key: "chips[].id", required: true, fallbackHint: "[] local" },
      { key: "chips[].label", required: true, fallbackHint: "derived" },
      { key: "soft_xp", required: true, fallbackHint: "0" },
    ],
  },
];

export const BUDGET_YEAR_SURFACE_ID = "budget.year.episode";

export function budgetYearSurfaceMirror(fy = "2026/27"): SurfaceContractMirror {
  return {
    id: BUDGET_YEAR_SURFACE_ID,
    job: `Critical metrics for FY ${fy} (TESTED_TRUE gate)`,
    editUrl: "/dashboard/ke-budget",
    keys: BUDGET_YEAR_CRITICAL_KEYS.map((key) => ({
      key,
      required: true,
      fallbackHint: "budget-fy-episodes.json",
    })),
  };
}

export function allSurfacesMirror(): SurfaceContractMirror[] {
  return [...LEARN_HUB_SURFACE_MIRROR, budgetYearSurfaceMirror()];
}

const FALLBACK_MODULES = ensureModulesBpsYoutube(
  filterModulesWithPublishableContent(
    (civicModulesFallback.results ?? []) as unknown as CivicModule[],
  ),
);

function present(value: unknown): boolean {
  if (value == null) return false;
  if (typeof value === "string") return value.trim().length > 0;
  if (typeof value === "number") return Number.isFinite(value);
  if (Array.isArray(value)) return value.length > 0;
  return true;
}

function probeBudgetYearKey(key: string, fy = "2026/27"): PresenceCell {
  const episode = getFyEpisode(fy);
  const surfaceId = BUDGET_YEAR_SURFACE_ID;
  if (!episode) {
    return {
      surfaceId,
      key,
      status: "MISSING",
      detail: `No episode seed for ${fy}`,
    };
  }

  const map: Record<string, unknown> = {
    fy: episode.fy,
    total_expenditure: episode.metrics?.total_expenditure_billions,
    total_revenue: episode.metrics?.total_revenue_billions,
    deficit: episode.metrics?.deficit_billions,
    recurrent: episode.metrics?.recurrent_billions,
    development: episode.metrics?.development_billions,
    top_sectors: episode.top_sectors,
    "provenance.sources": episode.sources,
  };

  const value = map[key];
  if (key === "top_sectors") {
    const ok = Array.isArray(value) && value.length >= 5;
    return {
      surfaceId,
      key,
      status: ok ? "FALLBACK" : "MISSING",
      detail: ok
        ? `${(value as unknown[]).length} sectors in episode seed`
        : "Need ≥5 top_sectors in episode seed",
    };
  }
  if (key === "provenance.sources") {
    const ok = Array.isArray(value) && value.length >= 2;
    return {
      surfaceId,
      key,
      status: ok ? "FALLBACK" : "MISSING",
      detail: ok
        ? `${(value as unknown[]).length} Level-1 sources on episode`
        : "Need ≥2 provenance sources",
    };
  }

  return {
    surfaceId,
    key,
    status: present(value) ? "FALLBACK" : "MISSING",
    detail: present(value)
      ? `Present in episode seed (${fy})`
      : `Missing on episode ${fy}`,
  };
}

function probeLearnKey(surfaceId: string, key: string): PresenceCell {
  const videos = getVideos();
  const stories = (learnStoriesFallback.results ?? []) as unknown[];

  switch (`${surfaceId}::${key}`) {
    case "learn.hub.hero::headline":
    case "learn.hub.hero::subcopy":
      return {
        surfaceId,
        key,
        status: "FALLBACK",
        detail: "Hardcoded seed copy (YAML fallback)",
      };
    case "learn.hub.hero::primary_module_slug":
    case "learn.hub.hero::primary_href": {
      const slug = FALLBACK_MODULES[0]?.slug;
      return {
        surfaceId,
        key,
        status: slug ? "FALLBACK" : "MISSING",
        detail: slug
          ? `civic-modules.json → ${slug}`
          : "No publishable module in civic-modules.json",
      };
    }
    case "learn.hub.continue::items[].slug":
    case "learn.hub.continue::items[].title":
    case "learn.hub.continue::items[].href": {
      const ok = FALLBACK_MODULES.length > 0;
      return {
        surfaceId,
        key,
        status: ok ? "FALLBACK" : "MISSING",
        detail: ok
          ? `${FALLBACK_MODULES.length} module(s) in civic-modules.json`
          : "civic-modules.json empty",
      };
    }
    case "learn.hub.continue::items[].pct":
      return {
        surfaceId,
        key,
        status: "FALLBACK",
        detail: "Local progress defaults to 0",
      };
    case "learn.hub.watch::items[].id":
    case "learn.hub.watch::items[].title": {
      const ok = videos.length > 0;
      return {
        surfaceId,
        key,
        status: ok ? "FALLBACK" : "MISSING",
        detail: ok ? `${videos.length} DEFAULT_VIDEOS` : "No DEFAULT_VIDEOS",
      };
    }
    case "learn.hub.watch::items[].youtube_id":
      return {
        surfaceId,
        key,
        status: videos.some((v) => v.videoId) ? "FALLBACK" : "MISSING",
        detail: "Optional youtube id on seeded videos",
      };
    case "learn.hub.stories::stories[].slug":
    case "learn.hub.stories::stories[].slides[].text": {
      const ok = stories.length > 0;
      return {
        surfaceId,
        key,
        status: ok ? "FALLBACK" : "MISSING",
        detail: ok
          ? `${stories.length} stories in learn-stories.json`
          : "learn-stories.json empty",
      };
    }
    case "learn.hub.numbers::fy": {
      const ep = getFyEpisode("2026/27");
      return {
        surfaceId,
        key,
        status: ep?.fy ? "FALLBACK" : "MISSING",
        detail: ep?.fy ? `Episode fy=${ep.fy}` : "No 2026/27 episode",
      };
    }
    case "learn.hub.numbers::rows[].label":
    case "learn.hub.numbers::rows[].value": {
      const ep = getFyEpisode("2026/27");
      const ok = present(ep?.metrics?.total_expenditure_billions);
      return {
        surfaceId,
        key,
        status: ok ? "FALLBACK" : "MISSING",
        detail: ok ? "Episode metrics seed" : "Episode metrics missing",
      };
    }
    case "learn.hub.numbers::rows[].meaning": {
      const ep = getFyEpisode("2026/27");
      const ok = Boolean(ep?.citizen_impact?.blurbs?.length);
      return {
        surfaceId,
        key,
        status: ok ? "FALLBACK" : "MISSING",
        detail: ok
          ? "citizen_impact.blurbs on episode"
          : "No citizen_impact meaning blurbs",
      };
    }
    case "learn.hub.know::chips[].id":
    case "learn.hub.know::chips[].label":
    case "learn.hub.know::soft_xp":
      return {
        surfaceId,
        key,
        status: "FALLBACK",
        detail: "Local events / soft XP defaults (never blank)",
      };
    default:
      return {
        surfaceId,
        key,
        status: "MISSING",
        detail: "No probe mapped for this key",
      };
  }
}

/** Learning catalogue is JSON-only — no civic-modules API upgrade path. */
async function tryUpgradeModulesToApi(_matrix: PresenceCell[]): Promise<void> {
  // Intentionally empty: modules come from civic-modules.json only.
}

export async function buildPresenceMatrix(): Promise<PresenceCell[]> {
  const cells: PresenceCell[] = [];

  for (const surface of LEARN_HUB_SURFACE_MIRROR) {
    for (const field of surface.keys) {
      cells.push(probeLearnKey(surface.id, field.key));
    }
  }

  for (const key of BUDGET_YEAR_CRITICAL_KEYS) {
    cells.push(probeBudgetYearKey(key));
  }

  await tryUpgradeModulesToApi(cells);

  return cells;
}

export function runSuiteChecks(matrix: PresenceCell[]): SuiteCheck[] {
  const checks: SuiteCheck[] = [];
  const bySurface = new Map<string, PresenceCell[]>();
  for (const cell of matrix) {
    const list = bySurface.get(cell.surfaceId) ?? [];
    list.push(cell);
    bySurface.set(cell.surfaceId, list);
  }

  for (const surface of allSurfacesMirror()) {
    const cells = bySurface.get(surface.id) ?? [];
    const required = cells.filter((c) => {
      const meta = surface.keys.find((k) => k.key === c.key);
      return meta?.required !== false;
    });
    const missing = required.filter((c) => c.status === "MISSING");
    checks.push({
      id: `surface:${surface.id}`,
      name: `Required data — ${surface.id}`,
      pass: missing.length === 0,
      message:
        missing.length === 0
          ? `All ${required.length} required keys present (API or FALLBACK)`
          : `Missing: ${missing.map((m) => m.key).join(", ")}`,
      editUrl: surface.editUrl,
    });
  }

  const level1 = level1SourcesOnly(getBudgetSources());
  checks.push({
    id: "sources:level1",
    name: "Level-1 sources inventory",
    pass: level1.length >= 5,
    message:
      level1.length >= 5
        ? `${level1.length} Level-1 sources listed (lastChecked present)`
        : `Only ${level1.length} Level-1 sources — expect ≥5`,
    editUrl: "/dashboard/ke-budget",
  });

  const stale = level1.filter((s) => !s.lastChecked);
  checks.push({
    id: "sources:lastChecked",
    name: "Level-1 lastChecked dates",
    pass: stale.length === 0,
    message:
      stale.length === 0
        ? "All Level-1 sources have lastChecked"
        : `Missing lastChecked: ${stale.map((s) => s.id).join(", ")}`,
  });

  const episodes = listInAppEpisodes();
  checks.push({
    id: "budget:in_app_episodes",
    name: "IN_APP budget year episodes",
    pass: episodes.length >= 1,
    message:
      episodes.length >= 1
        ? `${episodes.length} IN_APP episode(s): ${episodes.map((e) => e.fy).join(", ")}`
        : "No IN_APP episodes in budget-fy-episodes.json",
    editUrl: "/dashboard/ke-budget",
  });

  const modulesOk = FALLBACK_MODULES.length > 0;
  checks.push({
    id: "learn:modules_fallback",
    name: "Civic modules fallback catalogue",
    pass: modulesOk,
    message: modulesOk
      ? `${FALLBACK_MODULES.length} publishable module(s) in civic-modules.json`
      : "civic-modules.json has no publishable modules",
    editUrl: "/dashboard/modules",
  });

  return checks;
}

export async function runContentLabSuite(): Promise<ContentLabSnapshot> {
  const matrix = await buildPresenceMatrix();
  const suite = runSuiteChecks(matrix);
  const level1 = level1SourcesOnly(getBudgetSources());
  const pass = suite.filter((c) => c.pass).length;
  const fail = suite.length - pass;

  return {
    ranAt: new Date().toISOString(),
    sourcesUpdated: getBudgetSourcesUpdated(),
    level1Sources: level1,
    surfaces: allSurfacesMirror(),
    matrix,
    suite,
    summary: {
      pass,
      fail,
      api: matrix.filter((c) => c.status === "API").length,
      fallback: matrix.filter((c) => c.status === "FALLBACK").length,
      missing: matrix.filter((c) => c.status === "MISSING").length,
    },
  };
}
