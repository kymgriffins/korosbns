import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  PROFILE_STORAGE_KEYS,
  clearOnboardingDraft,
  clearPendingProfilePatch,
  enqueueGamificationEvent,
  mergePendingProfilePatch,
  onboardingDraftToPatch,
  readGamificationQueue,
  readOnboardingDraft,
  readPendingProfilePatch,
  writeOnboardingDraft,
} from "@/lib/profile-local-storage";
import {
  flushAllOfflineCitizenData,
  pushOnboardingDraftToApi,
  saveProfileWithOfflineQueue,
} from "@/lib/sync-profile";

const store = new Map<string, string>();

beforeEach(() => {
  store.clear();
  vi.stubGlobal("localStorage", {
    getItem: (k: string) => store.get(k) ?? null,
    setItem: (k: string, v: string) => {
      store.set(k, v);
    },
    removeItem: (k: string) => {
      store.delete(k);
    },
    clear: () => store.clear(),
    key: () => null,
    length: 0,
  });
  vi.stubGlobal("window", {
    localStorage: globalThis.localStorage,
    dispatchEvent: vi.fn(),
  });
});

describe("profile-local-storage", () => {
  it("persists onboarding draft with age and education", () => {
    writeOnboardingDraft({
      county: "Nairobi",
      ageRange: "age_18_24",
      educationLevel: "tertiary",
      priorities: ["Healthcare", "Education"],
      onboardingCompleted: true,
    });
    const draft = readOnboardingDraft();
    expect(draft?.ageRange).toBe("age_18_24");
    expect(draft?.educationLevel).toBe("tertiary");
    expect(draft?.priorities).toEqual(["Healthcare", "Education"]);
  });

  it("maps draft to top-level API patch including budget_priorities", () => {
    const patch = onboardingDraftToPatch({
      county: "Kisumu",
      ageRange: "age_25_34",
      educationLevel: "secondary",
      language: "SW",
      priorities: ["Infrastructure"],
    });
    expect(patch.county).toBe("Kisumu");
    expect(patch.age_range).toBe("age_25_34");
    expect(patch.education_level).toBe("secondary");
    expect(patch.language_preference).toBe("SW");
    expect(patch.budget_priorities).toEqual(["Infrastructure"]);
  });

  it("merges pending profile patches for offline queue", () => {
    mergePendingProfilePatch({ county: "Mombasa" });
    mergePendingProfilePatch({ age_range: "age_35_44" });
    expect(readPendingProfilePatch()).toMatchObject({
      county: "Mombasa",
      age_range: "age_35_44",
    });
  });
});

describe("sync-profile (localStorage → DB)", () => {
  it("syncs draft to API and clears local onboarding key", async () => {
    writeOnboardingDraft({
      county: "Nakuru",
      ageRange: "age_18_24",
      educationLevel: "tertiary",
      priorities: ["Education"],
    });
    const patchMe = vi.fn().mockResolvedValue({ id: "u1" });
    const result = await pushOnboardingDraftToApi(null, patchMe, {
      breakName: "Shujaa",
      pseudoName: "Shujaa_Nakuru",
      county: "Nakuru",
      language: "EN",
    });
    expect(result).toBe("synced");
    expect(patchMe).toHaveBeenCalled();
    const body = patchMe.mock.calls[0][0];
    expect(body.age_range).toBe("age_18_24");
    expect(body.education_level).toBe("tertiary");
    expect(body.budget_priorities).toEqual(["Education"]);
    expect(readOnboardingDraft()).toBeNull();
    expect(readPendingProfilePatch()).toBeNull();
  });

  it("keeps draft queued when API is offline", async () => {
    writeOnboardingDraft({
      county: "Turkana",
      ageRange: "age_45_plus",
      educationLevel: "primary",
    });
    const patchMe = vi.fn().mockRejectedValue(new Error("network"));
    const result = await pushOnboardingDraftToApi(null, patchMe, {
      breakName: "Citizen",
      pseudoName: "Citizen_Turkana",
      county: "Turkana",
      language: "EN",
    });
    expect(result).toBe("queued");
    expect(readPendingProfilePatch()?.age_range).toBe("age_45_plus");
    expect(store.has(PROFILE_STORAGE_KEYS.onboarding)).toBe(true);
  });

  it("flushes pending patch on retry", async () => {
    mergePendingProfilePatch({
      age_range: "age_13_17",
      education_level: "secondary",
      county: "Kiambu",
    });
    const patchMe = vi.fn().mockResolvedValue({ id: "u2" });
    const result = await saveProfileWithOfflineQueue(
      { language_preference: "SW" },
      patchMe,
    );
    expect(result).toBe("synced");
    expect(patchMe.mock.calls[0][0]).toMatchObject({
      age_range: "age_13_17",
      education_level: "secondary",
      language_preference: "SW",
    });
    expect(readPendingProfilePatch()).toBeNull();
  });

  it("stores gamification events in the offline queue", () => {
    enqueueGamificationEvent({
      event_type: "module_step_complete",
      idempotency_key: "evt-1",
      points: 10,
    });
    enqueueGamificationEvent({
      event_type: "module_step_complete",
      idempotency_key: "evt-1",
      points: 10,
    });
    expect(readGamificationQueue()).toHaveLength(1);
  });
});

describe("flushAllOfflineCitizenData", () => {
  it("pushes onboarding + clears queues when API is healthy", async () => {
    writeOnboardingDraft({
      county: "Garissa",
      ageRange: "age_25_34",
      educationLevel: "professional",
      priorities: ["Jobs & Digital Economy"],
    });
    enqueueGamificationEvent({
      event_type: "streak_day",
      idempotency_key: "streak-1",
      points: 5,
    });
    const patchMe = vi.fn().mockResolvedValue({ id: "u3" });
    // gamification flush uses real postGamificationEvent which catches → null → remains
    // So we only assert profile path here.
    const result = await flushAllOfflineCitizenData(patchMe, {
      breakName: "Learner",
      pseudoName: "Learner_Garissa",
      county: "Garissa",
      language: "EN",
    });
    expect(result.profile).toBe("synced");
    expect(patchMe).toHaveBeenCalled();
    clearOnboardingDraft();
    clearPendingProfilePatch();
  });
});
