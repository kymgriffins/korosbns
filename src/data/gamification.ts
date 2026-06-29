import type { GamificationState, BadgeCatalogEntry, BadgeState, LeaderboardEntry, GamificationEventPayload } from "@/types/gamification";
import { learnHubApi } from "@/lib/learn-hub";
import { withFallback } from "@/data/adapter";

export type { GamificationState, BadgeCatalogEntry, LeaderboardEntry, GamificationEventPayload };

const DEFAULT_STATE: GamificationState = {
  points: 0,
  level: 1,
  streak_days: 0,
  badges: [],
};

let _state: GamificationState = { ...DEFAULT_STATE };

export const gamificationData = {
  state: {
    get: () => _state,
    set: (s: GamificationState) => { _state = s; },
    fetch: () =>
      withFallback(
        "gamification",
        () => learnHubApi.profile(),
        () => ({ gamification: null, progress: [] }),
        { silent: true },
      ),
  },
  leaderboard: {
    fetch: (limit = 20) =>
      withFallback(
        "gamification",
        () => learnHubApi.leaderboard(limit),
        () => ({ results: [] as LeaderboardEntry[] }),
      ).then((r) => r.results ?? []),
  },
};
