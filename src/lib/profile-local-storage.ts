import type { UserProfileApi } from "@/lib/api-client";
import {
  buildOnboardingProfilePatch,
  type OnboardingFormValues,
} from "@/lib/onboarding-profile-patch";

/** Bump when localStorage shape changes — migrate/scrub on read. */
export const STORAGE_SCHEMA_VERSION = 1;

export const PROFILE_STORAGE_KEYS = {
  schema: "bns_storage_schema",
  hub: "bns_user_profile",
  onboarding: "bns_onboarding_profile",
  pendingPatch: "bns_pending_profile_patch",
  gamificationQueue: "bns_pending_gamification_events",
  learnProgressQueue: "bns_pending_learn_progress",
} as const;

/** Must match Django Profile.AgeRange / EducationLevel / Language. */
export const VALID_AGE_RANGES = [
  "under_13",
  "age_13_17",
  "age_18_24",
  "age_25_34",
  "age_35_44",
  "age_45_plus",
] as const;

export const VALID_EDUCATION_LEVELS = [
  "primary",
  "secondary",
  "tertiary",
  "professional",
] as const;

export const VALID_LANGUAGES = ["EN", "SW", "SH"] as const;

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

function ensureSchema(): void {
  if (!canUseStorage()) return;
  try {
    const raw = window.localStorage.getItem(PROFILE_STORAGE_KEYS.schema);
    const ver = raw ? Number(raw) : 0;
    if (ver === STORAGE_SCHEMA_VERSION) return;
    // Future migrations go here. v0 → v1: scrub corrupt JSON blobs.
    for (const key of [
      PROFILE_STORAGE_KEYS.hub,
      PROFILE_STORAGE_KEYS.onboarding,
      PROFILE_STORAGE_KEYS.pendingPatch,
      PROFILE_STORAGE_KEYS.gamificationQueue,
      PROFILE_STORAGE_KEYS.learnProgressQueue,
    ]) {
      const value = window.localStorage.getItem(key);
      if (!value) continue;
      try {
        JSON.parse(value);
      } catch {
        window.localStorage.removeItem(key);
      }
    }
    window.localStorage.setItem(
      PROFILE_STORAGE_KEYS.schema,
      String(STORAGE_SCHEMA_VERSION),
    );
  } catch {
    /* private mode */
  }
}

function readJson<T>(key: string): T | null {
  if (!canUseStorage()) return null;
  ensureSchema();
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw) as T;
  } catch {
    try {
      window.localStorage.removeItem(key);
    } catch {
      /* noop */
    }
    return null;
  }
}

function writeJson(key: string, value: unknown): void {
  if (!canUseStorage()) return;
  ensureSchema();
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

export function isValidAgeRange(value: string | undefined | null): boolean {
  return !!value && (VALID_AGE_RANGES as readonly string[]).includes(value);
}

export function isValidEducationLevel(value: string | undefined | null): boolean {
  return !!value && (VALID_EDUCATION_LEVELS as readonly string[]).includes(value);
}

export function isValidLanguage(value: string | undefined | null): boolean {
  return !!value && (VALID_LANGUAGES as readonly string[]).includes(value.toUpperCase());
}

/**
 * Strip invalid enum values so a bad localStorage draft cannot 400 forever
 * and block the offline sync queue.
 */
export function sanitizeProfilePatch(
  patch: Partial<UserProfileApi>,
): Partial<UserProfileApi> {
  const out: Partial<UserProfileApi> = { ...patch };
  if (out.age_range != null && !isValidAgeRange(out.age_range)) {
    delete out.age_range;
  }
  if (out.education_level != null && !isValidEducationLevel(out.education_level)) {
    delete out.education_level;
  }
  if (out.language_preference != null) {
    const lang = String(out.language_preference).toUpperCase();
    if (isValidLanguage(lang)) out.language_preference = lang;
    else delete out.language_preference;
  }
  if (Array.isArray(out.budget_priorities)) {
    out.budget_priorities = out.budget_priorities
      .filter((p): p is string => typeof p === "string" && p.trim().length > 0)
      .slice(0, 12);
  }
  // Drop empty-string optionals that Django may reject.
  for (const key of Object.keys(out) as (keyof UserProfileApi)[]) {
    if (out[key] === "") delete out[key];
  }
  return out;
}

export function readOnboardingDraft(): OnboardingDraft | null {
  const draft = readJson<OnboardingDraft>(PROFILE_STORAGE_KEYS.onboarding);
  if (!draft || typeof draft !== "object") return null;
  return {
    ...draft,
    ageRange: isValidAgeRange(draft.ageRange) ? draft.ageRange : undefined,
    educationLevel: isValidEducationLevel(draft.educationLevel)
      ? draft.educationLevel
      : undefined,
    language: isValidLanguage(draft.language)
      ? String(draft.language).toUpperCase()
      : draft.language,
  };
}

export function writeOnboardingDraft(draft: OnboardingDraft): void {
  writeJson(PROFILE_STORAGE_KEYS.onboarding, {
    ...draft,
    ageRange: isValidAgeRange(draft.ageRange) ? draft.ageRange : undefined,
    educationLevel: isValidEducationLevel(draft.educationLevel)
      ? draft.educationLevel
      : undefined,
    language: isValidLanguage(draft.language)
      ? String(draft.language).toUpperCase()
      : draft.language,
  });
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

export function clearHubProfile(): void {
  removeKey(PROFILE_STORAGE_KEYS.hub);
}

export function readPendingProfilePatch(): Partial<UserProfileApi> | null {
  const pending = readJson<Partial<UserProfileApi>>(PROFILE_STORAGE_KEYS.pendingPatch);
  return pending ? sanitizeProfilePatch(pending) : null;
}

/** Merge a PATCH into the offline queue (last write wins per field). */
export function mergePendingProfilePatch(patch: Partial<UserProfileApi>): void {
  const prev = readPendingProfilePatch() ?? {};
  const clean = sanitizeProfilePatch(patch);
  const next: Partial<UserProfileApi> = { ...prev, ...clean };
  if (clean.metadata || prev.metadata) {
    next.metadata = {
      ...(typeof prev.metadata === "object" && prev.metadata ? prev.metadata : {}),
      ...(typeof clean.metadata === "object" && clean.metadata ? clean.metadata : {}),
    };
  }
  writeJson(PROFILE_STORAGE_KEYS.pendingPatch, sanitizeProfilePatch(next));
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
  return sanitizeProfilePatch(base);
}

export type GamificationEventPayload = {
  event_type: string;
  points?: number;
  object_id?: string;
  idempotency_key: string;
  metadata?: Record<string, unknown>;
};

export function readGamificationQueue(): GamificationEventPayload[] {
  const q = readJson<GamificationEventPayload[]>(PROFILE_STORAGE_KEYS.gamificationQueue);
  return Array.isArray(q) ? q : [];
}

export function enqueueGamificationEvent(event: GamificationEventPayload): void {
  if (!event.idempotency_key || !event.event_type) return;
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
  const q = readJson<LearnProgressPayload[]>(PROFILE_STORAGE_KEYS.learnProgressQueue);
  return Array.isArray(q) ? q : [];
}

export function enqueueLearnProgress(item: LearnProgressPayload): void {
  if (!item.content_type || !item.content_id) return;
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

/**
 * Logout / session clear. Keeps onboarding draft + pending profile patch by default
 * so a later login can still push personalization to the DB.
 */
export function clearCitizenLocalSession(options?: {
  /** Also wipe register draft + pending PATCH (full privacy wipe). */
  wipePendingPersonalization?: boolean;
}): void {
  if (!canUseStorage()) return;
  clearHubProfile();
  removeKey(PROFILE_STORAGE_KEYS.gamificationQueue);
  removeKey(PROFILE_STORAGE_KEYS.learnProgressQueue);
  if (options?.wipePendingPersonalization) {
    clearOnboardingDraft();
    clearPendingProfilePatch();
  }
  try {
    for (let i = window.localStorage.length - 1; i >= 0; i--) {
      const key = window.localStorage.key(i);
      if (!key) continue;
      if (key.startsWith("bns_module_") || key.startsWith("stage_")) {
        window.localStorage.removeItem(key);
      }
    }
    window.sessionStorage.removeItem("bns_streak_toast");
    window.localStorage.removeItem("bns_story_watched");
  } catch {
    /* noop */
  }
  window.dispatchEvent(new Event("bns-profile-updated"));
}
