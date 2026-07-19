import { citizenApi, type UserProfileApi } from "@/lib/api-client";
import { learnHubApi } from "@/lib/learn-hub";
import { postGamificationEvent } from "@/lib/gamification";
import {
  clearOnboardingDraft,
  clearPendingProfilePatch,
  enqueueGamificationEvent,
  enqueueLearnProgress,
  mergePendingProfilePatch,
  onboardingDraftToPatch,
  readGamificationQueue,
  readLearnProgressQueue,
  readOnboardingDraft,
  readPendingProfilePatch,
  writeGamificationQueue,
  writeLearnProgressQueue,
  type GamificationEventPayload,
  type LearnProgressPayload,
  type OnboardingDraft,
} from "@/lib/profile-local-storage";

export type SyncResult = {
  profile: "synced" | "queued" | "empty" | "skipped";
  gamification: { flushed: number; remaining: number };
  learnProgress: { flushed: number; remaining: number };
};

type PatchFn = (body: Partial<UserProfileApi>) => Promise<UserProfileApi>;

/**
 * Persist prefs locally first, then PATCH /users/me/.
 * On network failure the merged patch stays queued for the next flush.
 */
export async function saveProfileWithOfflineQueue(
  patch: Partial<UserProfileApi>,
  patchMe: PatchFn = (body) => citizenApi.patchMe(body),
): Promise<"synced" | "queued"> {
  mergePendingProfilePatch(patch);
  const toSend = readPendingProfilePatch() ?? patch;
  try {
    await patchMe(toSend);
    clearPendingProfilePatch();
    return "synced";
  } catch {
    return "queued";
  }
}

/** Build + queue/push the register draft (age, education, county, priorities…). */
export async function pushOnboardingDraftToApi(
  draft?: OnboardingDraft | null,
  patchMe: PatchFn = (body) => citizenApi.patchMe(body),
  identity?: Parameters<typeof onboardingDraftToPatch>[1],
): Promise<"synced" | "queued" | "empty"> {
  const source = draft ?? readOnboardingDraft();
  if (
    !source ||
    (!source.county &&
      !source.ageRange &&
      !source.educationLevel &&
      !source.priorities?.length)
  ) {
    return "empty";
  }
  const patch = onboardingDraftToPatch(source, identity);
  const result = await saveProfileWithOfflineQueue(patch, patchMe);
  if (result === "synced") clearOnboardingDraft();
  return result;
}

export async function flushPendingProfilePatch(
  patchMe: PatchFn = (body) => citizenApi.patchMe(body),
): Promise<"synced" | "queued" | "empty"> {
  const pending = readPendingProfilePatch();
  if (!pending || Object.keys(pending).length === 0) return "empty";
  try {
    await patchMe(pending);
    clearPendingProfilePatch();
    return "synced";
  } catch {
    return "queued";
  }
}

/** Post gamification event; queue locally when offline so XP is not lost. */
export async function trackGamificationWithQueue(
  body: GamificationEventPayload,
): Promise<"synced" | "queued"> {
  const state = await postGamificationEvent(body);
  if (state) return "synced";
  enqueueGamificationEvent(body);
  return "queued";
}

export async function flushGamificationQueue(): Promise<{
  flushed: number;
  remaining: number;
}> {
  const queue = readGamificationQueue();
  if (!queue.length) return { flushed: 0, remaining: 0 };
  const remaining: GamificationEventPayload[] = [];
  let flushed = 0;
  for (const event of queue) {
    const state = await postGamificationEvent(event);
    if (state) flushed += 1;
    else remaining.push(event);
  }
  writeGamificationQueue(remaining);
  return { flushed, remaining: remaining.length };
}

export async function recordLearnProgressWithQueue(
  body: LearnProgressPayload,
): Promise<"synced" | "queued"> {
  try {
    await learnHubApi.markProgress(body);
    return "synced";
  } catch {
    enqueueLearnProgress(body);
    return "queued";
  }
}

export async function flushLearnProgressQueue(): Promise<{
  flushed: number;
  remaining: number;
}> {
  const queue = readLearnProgressQueue();
  if (!queue.length) return { flushed: 0, remaining: 0 };
  const remaining: LearnProgressPayload[] = [];
  let flushed = 0;
  for (const item of queue) {
    try {
      await learnHubApi.markProgress(item);
      flushed += 1;
    } catch {
      remaining.push(item);
    }
  }
  writeLearnProgressQueue(remaining);
  return { flushed, remaining: remaining.length };
}

/**
 * After login / when browser comes online: push draft + pending patches +
 * queued gamification / learn progress so personalization works offline-first.
 */
export async function flushAllOfflineCitizenData(
  patchMe: PatchFn = (body) => citizenApi.patchMe(body),
  identity?: Parameters<typeof onboardingDraftToPatch>[1],
): Promise<SyncResult> {
  const draftResult = await pushOnboardingDraftToApi(null, patchMe, identity);
  const pendingResult = await flushPendingProfilePatch(patchMe);
  const profile: SyncResult["profile"] =
    draftResult === "synced" || pendingResult === "synced"
      ? "synced"
      : draftResult === "queued" || pendingResult === "queued"
        ? "queued"
        : "empty";

  const gamification = await flushGamificationQueue();
  const learnProgress = await flushLearnProgressQueue();
  return { profile, gamification, learnProgress };
}
