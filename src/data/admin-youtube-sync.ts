import { adminYouTubeSyncApi } from "@/lib/admin-api";
import type { YouTubeSyncResult } from "@/lib/admin-api";
import { withFallback } from "@/data/adapter";

export type { YouTubeSyncResult };

export const adminYouTubeSyncData = {
  sync: () =>
    withFallback(
      "admin-youtube-sync",
      () => adminYouTubeSyncApi.sync(),
      () => ({ detail: "Sync unavailable offline.", created: 0, updated: 0, skipped: 0 }),
    ),
};
