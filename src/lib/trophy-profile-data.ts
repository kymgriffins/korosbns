import type { UserAchievement } from "@/components/ui/achievement-badge";
import type { PointsChartDataPoint } from "@/components/ui/points-chart";
import type { StreakPeriod } from "@/components/ui/streak-calendar";
import type { LeaderboardRankingItem } from "@/components/ui/leaderboard-rankings";
import type { LeaderboardRanking } from "@/components/ui/leaderboard-podium";
import type {
  BadgeCatalogEntry,
  GamificationState,
  LeaderboardEntry,
} from "@/types/gamification";
import type { BadgeData, CivicModule, ProgressRow } from "@/types/learn";
import { getModuleEmoji } from "@/lib/learn-module-display";

export type PointHistoryEvent = {
  id: string;
  event_type: string;
  points: number;
  object_id: string;
  metadata?: Record<string, unknown>;
  created_at: string;
};

function toDateKey(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function triggerForBadge(badge: BadgeCatalogEntry | BadgeData): UserAchievement["trigger"] {
  const ct = "condition_type" in badge ? badge.condition_type : "";
  if (ct.includes("streak")) return "streak";
  if (ct.includes("content") || ct.includes("course")) return "metric";
  return "metric";
}

export function mapCatalogBadgeToAchievement(badge: BadgeCatalogEntry): UserAchievement {
  const earned = badge.state === "earned";
  return {
    id: badge.id || badge.slug,
    name: badge.name,
    description: badge.description ?? null,
    trigger: triggerForBadge(badge),
    badgeUrl: badge.icon?.startsWith("http") ? badge.icon : null,
    iconEmoji: badge.icon && !badge.icon.startsWith("http") ? badge.icon : "🏅",
    progress: earned ? 100 : badge.progress?.percent ?? 0,
    achievedAt: earned ? badge.earned_at : null,
  };
}

export function mapEarnedBadgeToAchievement(badge: BadgeData): UserAchievement {
  return {
    id: badge.slug,
    name: badge.name,
    description: badge.description ?? null,
    trigger: "metric",
    iconEmoji: badge.icon && !badge.icon.startsWith("http") ? badge.icon : "🏅",
    badgeUrl: badge.icon?.startsWith("http") ? badge.icon : null,
    progress: 100,
    achievedAt: badge.awarded_at ?? null,
  };
}

export function mapModuleBadgeToAchievement(
  stage: CivicModule,
  unlocked: boolean,
  completedAt?: string | null,
): UserAchievement {
  return {
    id: `module-${stage.slug}`,
    name: stage.badgeName || stage.title,
    description: stage.description ?? null,
    trigger: "metric",
    iconEmoji: getModuleEmoji(stage.badge),
    progress: unlocked ? 100 : 0,
    achievedAt: unlocked && completedAt ? completedAt : null,
  };
}

function moduleCompletionDate(
  stage: CivicModule,
  progress: ProgressRow[],
): string | null {
  const match = progress.find(
    (row) =>
      row.content_id === stage.slug ||
      row.content_id === stage.id ||
      (row.content_type?.includes("module") &&
        (row.content_id === stage.slug || row.content_id === stage.id)),
  );
  return match?.completed_at ?? null;
}

export function mergeAchievements(
  catalog: BadgeCatalogEntry[],
  earned: BadgeData[],
  stages: CivicModule[],
  unlockedModuleBadges: string[] = [],
  progress: ProgressRow[] = [],
): UserAchievement[] {
  if (catalog.length > 0) {
    return catalog.map(mapCatalogBadgeToAchievement);
  }
  const fromEarned = earned.map(mapEarnedBadgeToAchievement);
  const fromModules = stages.map((stage) =>
    mapModuleBadgeToAchievement(
      stage,
      unlockedModuleBadges.includes(stage.badge),
      moduleCompletionDate(stage, progress),
    ),
  );
  return [...fromEarned, ...fromModules];
}

export function collectActivityDateKeys(
  progress: ProgressRow[],
  events: PointHistoryEvent[],
): string[] {
  const keys = new Set<string>();
  for (const row of progress) {
    const key = toDateKey(row.completed_at);
    if (key) keys.add(key);
  }
  for (const event of events) {
    const key = toDateKey(event.created_at);
    if (key) keys.add(key);
  }
  return [...keys].sort();
}

/** Build StreakPeriod[] from real activity dates (consecutive-day runs). */
export function buildStreakPeriods(dateKeys: string[]): StreakPeriod[] {
  if (!dateKeys.length) return [];

  const periods: StreakPeriod[] = [];
  let runStart = dateKeys[0];
  let prev = dateKeys[0];

  const nextDay = (key: string) => {
    const d = new Date(`${key}T12:00:00`);
    d.setDate(d.getDate() + 1);
    return toDateKey(d.toISOString());
  };

  for (let i = 1; i < dateKeys.length; i++) {
    const key = dateKeys[i];
    if (key === nextDay(prev)) {
      prev = key;
      continue;
    }
    periods.push({ periodStart: runStart, periodEnd: prev });
    runStart = key;
    prev = key;
  }
  periods.push({ periodStart: runStart, periodEnd: prev });
  return periods;
}

export function longestStreakFromDates(dateKeys: string[]): number {
  if (!dateKeys.length) return 0;
  let longest = 1;
  let current = 1;
  const nextDay = (key: string) => {
    const d = new Date(`${key}T12:00:00`);
    d.setDate(d.getDate() + 1);
    return toDateKey(d.toISOString());
  };
  for (let i = 1; i < dateKeys.length; i++) {
    if (dateKeys[i] === nextDay(dateKeys[i - 1])) {
      current += 1;
      longest = Math.max(longest, current);
    } else {
      current = 1;
    }
  }
  return longest;
}

export function buildPointsChartFromHistory(
  events: PointHistoryEvent[],
  currentPoints: number,
): PointsChartDataPoint[] {
  if (!events.length) return [];

  const sorted = [...events].sort(
    (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
  );

  const daily = new Map<string, number>();
  for (const event of sorted) {
    const key = toDateKey(event.created_at);
    if (!key) continue;
    daily.set(key, (daily.get(key) ?? 0) + (event.points ?? 0));
  }

  let cumulative = 0;
  const points: PointsChartDataPoint[] = [];
  for (const [key, change] of [...daily.entries()].sort()) {
    cumulative += change;
    const label = new Date(`${key}T12:00:00`).toLocaleDateString("en-KE", {
      month: "short",
      day: "numeric",
    });
    points.push({ date: label, total: cumulative, change });
  }

  if (currentPoints > cumulative && points.length) {
    points[points.length - 1] = {
      ...points[points.length - 1],
      total: currentPoints,
    };
  }

  return points;
}

export function mapLeaderboardPodium(entries: LeaderboardEntry[]): LeaderboardRanking[] {
  return entries
    .filter((e) => e.rank != null && e.rank <= 3)
    .map((entry, i) => ({
      userId: entry.name ?? `rank-${entry.rank ?? i + 1}`,
      userName: entry.name,
      rank: entry.rank ?? i + 1,
      value: entry.points,
      avatarUrl: entry.avatar_url ?? null,
    }));
}

export function mapLeaderboardRankings(
  entries: LeaderboardEntry[],
  currentUserName?: string | null,
): LeaderboardRankingItem[] {
  return entries.map((entry, i) => ({
    userId: entry.name ?? `rank-${entry.rank ?? i + 1}`,
    userName: entry.name,
    rank: entry.rank ?? i + 1,
    value: entry.points,
    avatarUrl: entry.avatar_url ?? null,
    byline:
      entry.streak_days > 0
        ? `${entry.streak_days}-day streak · L${entry.level}`
        : `Level ${entry.level}`,
    displayed: true,
    ...(currentUserName &&
    entry.name &&
    entry.name.toLowerCase() === currentUserName.toLowerCase()
      ? {}
      : {}),
  }));
}

export function chartLevelMarkers(level: number): { value: number; color: string }[] {
  const markers: { value: number; color: string }[] = [];
  for (let lv = 2; lv <= Math.max(level + 1, 3); lv++) {
    markers.push({ value: (lv - 1) * 100, color: "var(--civic-blue, var(--primary))" });
  }
  return markers;
}

export function gamificationProgressRows(state: GamificationState | undefined): ProgressRow[] {
  return state?.recent_progress ?? [];
}
