import type { UserProfileApi } from "@/lib/api-client";
import {
  buildOnboardingProfilePatch,
  type OnboardingFormValues,
} from "@/lib/onboarding-profile-patch";

export const PROFILE_STORAGE_KEYS = {
  hub: "bns_user_profile",
  onboarding: "bns_onboarding_profile",
  pendingPatch: "bns_pending_profile_patch",
  gamificationQueue: "bns_pending_gamification_events",
  learnProgressQueue: "bns_pending_learn_progress",
} as const;

/** Draft captured at register / pre-verify; pushed to DB after login. */
export type OnboardingDraft = {
  priorities?: string[];
  county?: string;
  ward?: string;
  ageRange?: string;
  educationLevel?: string;
  language?: string;
  breakName?: string;
  pseudoName?: string;
  phone?: string;
  notifications?: boolean;
  whatsappFallback?: boolean;
  dateOfBirth?: string;
  consentGranted?: boolean;
  consentTimestamp?: string;
  onboardingCompleted?: boolean;
};

function canUseStorage(): boolean {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function readJson<T>(key: string): T | null {
  if (!canUseStorage()) return null;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

function writeJson(key: string, value: unknown): void {
  if (!canUseStorage()) return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* quota / private mode */
  }
}

function removeKey(key: string): void {
  if (!canUseStorage()) return;
  try {
    window.localStorage.removeItem(key);
  } catch {
    /* noop */
  }
}

export function readOnboardingDraft(): OnboardingDraft | null {
  return readJson<OnboardingDraft>(PROFILE_STORAGE_KEYS.onboarding);
}

export function writeOnboardingDraft(draft: OnboardingDraft): void {
  writeJson(PROFILE_STORAGE_KEYS.onboarding, draft);
}

export function clearOnboardingDraft(): void {
  removeKey(PROFILE_STORAGE_KEYS.onboarding);
}

export function readHubProfile<T extends Record<string, unknown> = Record<string, unknown>>(): T | null {
  return readJson<T>(PROFILE_STORAGE_KEYS.hub);
}

export function writeHubProfile(profile: Record<string, unknown>): void {
  writeJson(PROFILE_STORAGE_KEYS.hub, profile);
  if (canUseStorage()) {
    window.dispatchEvent(new Event("bns-profile-updated"));
  }
}

export function readPendingProfilePatch(): Partial<UserProfileApi> | null {
  return readJson<Partial<UserProfileApi>>(PROFILE_STORAGE_KEYS.pendingPatch);
}

/** Merge a PATCH into the offline queue (last write wins per field). */
export function mergePendingProfilePatch(patch: Partial<UserProfileApi>): void {
  const prev = readPendingProfilePatch() ?? {};
  const next: Partial<UserProfileApi> = { ...prev, ...patch };
  if (patch.metadata || prev.metadata) {
    next.metadata = {
      ...(typeof prev.metadata === "object" && prev.metadata ? prev.metadata : {}),
      ...(typeof patch.metadata === "object" && patch.metadata ? patch.metadata : {}),
    };
  }
  writeJson(PROFILE_STORAGE_KEYS.pendingPatch, next);
}

export function clearPendingProfilePatch(): void {
  removeKey(PROFILE_STORAGE_KEYS.pendingPatch);
}

/**
 * Maps a register/onboarding localStorage draft to a Profile API PATCH.
 * Includes budget_priorities from registration interests.
 */
export function onboardingDraftToPatch(
  draft: OnboardingDraft,
  identity?: Partial<OnboardingFormValues>,
): Partial<UserProfileApi> {
  const base = buildOnboardingProfilePatch({
    breakName: identity?.breakName || draft.breakName || "",
    pseudoName: identity?.pseudoName || draft.pseudoName || "",
    county: draft.county || identity?.county || "",
    ward: draft.ward || identity?.ward,
    language: (draft.language || identity?.language || "EN") as OnboardingFormValues["language"],
    educationLevel: draft.educationLevel || identity?.educationLevel,
    ageRange: draft.ageRange || identity?.ageRange,
    dateOfBirth: draft.dateOfBirth || identity?.dateOfBirth,
    notifications: draft.notifications ?? identity?.notifications,
    whatsappFallback: draft.whatsappFallback ?? identity?.whatsappFallback,
    phone: draft.phone || identity?.phone,
    consentGranted: draft.consentGranted ?? identity?.consentGranted,
    consentTimestamp: draft.consentTimestamp || identity?.consentTimestamp,
    priorities: draft.priorities?.length ? draft.priorities : identity?.priorities,
  });
  return base;
}

export type GamificationEventPayload = {
  event_type: string;
  points?: number;
  object_id?: string;
  idempotency_key: string;
  metadata?: Record<string, unknown>;
};

export function readGamificationQueue(): GamificationEventPayload[] {
  return readJson<GamificationEventPayload[]>(PROFILE_STORAGE_KEYS.gamificationQueue) ?? [];
}

export function enqueueGamificationEvent(event: GamificationEventPayload): void {
  const queue = readGamificationQueue();
  if (queue.some((e) => e.idempotency_key === event.idempotency_key)) return;
  queue.push(event);
  writeJson(PROFILE_STORAGE_KEYS.gamificationQueue, queue.slice(-50));
}

export function writeGamificationQueue(events: GamificationEventPayload[]): void {
  if (!events.length) {
    removeKey(PROFILE_STORAGE_KEYS.gamificationQueue);
    return;
  }
  writeJson(PROFILE_STORAGE_KEYS.gamificationQueue, events);
}

export type LearnProgressPayload = {
  content_type: string;
  content_id: string;
  progress_percent?: number;
};

export function readLearnProgressQueue(): LearnProgressPayload[] {
  return readJson<LearnProgressPayload[]>(PROFILE_STORAGE_KEYS.learnProgressQueue) ?? [];
}

export function enqueueLearnProgress(item: LearnProgressPayload): void {
  const queue = readLearnProgressQueue();
  const idx = queue.findIndex(
    (q) => q.content_type === item.content_type && q.content_id === item.content_id,
  );
  if (idx >= 0) queue[idx] = item;
  else queue.push(item);
  writeJson(PROFILE_STORAGE_KEYS.learnProgressQueue, queue.slice(-100));
}

export function writeLearnProgressQueue(items: LearnProgressPayload[]): void {
  if (!items.length) {
    removeKey(PROFILE_STORAGE_KEYS.learnProgressQueue);
    return;
  }
  writeJson(PROFILE_STORAGE_KEYS.learnProgressQueue, items);
}
