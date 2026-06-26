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
export type LearnHubLanguage = "EN" | "SW" | "SH";

export type LearnHubProfile = {
  userId: string;
  breakName: string;
  pseudoName: string;
  county: string;
  ward: string;
  language: LearnHubLanguage;
  notifications: boolean;
  whatsappFallback: boolean;
  phone: string;
  consentGranted: boolean;
  consentTimestamp: string | null;
  sovereigns: number;
  stageProgress: number[];
  streakDays: number;
  lastActive: number;
  trackedDocs: string[];
  badges: string[];
  avatar_url?: string | null;
  participationLogs?: unknown[];
};
