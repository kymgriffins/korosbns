import type { GamificationState, BadgeCatalogEntry, BadgeState, GamificationEventPayload, LeaderboardEntry } from "@/types/gamification";
import type { ApiListResponse } from "@/types/api";
import { apiFetch } from "@/lib/api-client";
import { withFallback } from "@/data/adapter";

export type { GamificationState, BadgeCatalogEntry, GamificationEventPayload, LeaderboardEntry };

const DEFAULT_STATE: GamificationState = {
  points: 0,
  level: 1,
  streak_days: 0,
  badges: [],
  certificates: [],
  recent_progress: [],
  total_progress: 0,
};

let _state: GamificationState = { ...DEFAULT_STATE };

export const gamificationData = {
  state: {
    get: () => _state,
    set: (s: GamificationState) => { _state = s; },
    fetch: () =>
      withFallback(
        "gamification",
        () => apiFetch<{ gamification: GamificationState | null; progress: unknown[] }>("/gamification/me/", { auth: true }),
        () => ({ gamification: null, progress: [] }),
        { silent: true },
      ),
  },
  leaderboard: {
    fetch: (limit = 20) =>
      withFallback(
        "gamification",
        () => apiFetch<ApiListResponse<LeaderboardEntry>>(`/gamification/leaderboard/?limit=${limit}`),
        () => ({ results: [] as LeaderboardEntry[], count: 0 }),
      ).then((r) => r.results ?? []),
  },
};
