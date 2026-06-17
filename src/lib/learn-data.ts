import { learnHubApi, type LearnHubSummary } from "@/lib/learn-hub";
import type { CivicModule } from "@/types/learn";

const DEFAULT_RETRIES = 3;
const RETRY_BASE_MS = 800;

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Retry transient API failures so production hub stays populated when the backend is up. */
export async function fetchCivicModulesWithRetry(
  retries = DEFAULT_RETRIES,
): Promise<CivicModule[]> {
  let lastError: unknown;

  for (let attempt = 0; attempt < retries; attempt += 1) {
    try {
      const data = await learnHubApi.stages();
      return data?.results ?? [];
    } catch (err) {
      lastError = err;
      if (attempt < retries - 1) {
        await sleep(RETRY_BASE_MS * (attempt + 1));
      }
    }
  }

  throw lastError instanceof Error
    ? lastError
    : new Error("Failed to load learning modules");
}

export async function fetchLearnSummaryWithRetry(
  retries = DEFAULT_RETRIES,
): Promise<LearnHubSummary | null> {
  let lastError: unknown;

  for (let attempt = 0; attempt < retries; attempt += 1) {
    try {
      return await learnHubApi.summary();
    } catch (err) {
      lastError = err;
      if (attempt < retries - 1) {
        await sleep(RETRY_BASE_MS * (attempt + 1));
      }
    }
  }

  throw lastError instanceof Error ? lastError : new Error("Failed to load learn summary");
}

/** Minimal profile for read-only hub browsing before onboarding. */
export function createGuestBrowseProfile() {
  return {
    userId: "guest_browse",
    breakName: "Guest",
    pseudoName: "guest",
    county: "Kenya",
    ward: "",
    language: "EN" as const,
    notifications: false,
    whatsappFallback: false,
    phone: "",
    consentGranted: false,
    consentTimestamp: null as string | null,
    sovereigns: 0,
    stageProgress: [1],
    streakDays: 0,
    lastActive: Date.now(),
    trackedDocs: [] as string[],
    badges: [] as string[],
    isGuestBrowse: true as const,
  };
}

export type LearnHubProfile = ReturnType<typeof createGuestBrowseProfile> & {
  isGuestBrowse?: boolean;
  avatar_url?: string | null;
};
