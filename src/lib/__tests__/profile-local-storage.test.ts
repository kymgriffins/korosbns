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
  sanitizeProfilePatch,
  writeOnboardingDraft,
  clearCitizenLocalSession,
} from "@/lib/profile-local-storage";
import {
  __resetFlushLockForTests,
  flushAllOfflineCitizenData,
  pushOnboardingDraftToApi,
  saveProfileWithOfflineQueue,
} from "@/lib/sync-profile";
import fallbackModules from "@/data/fallbacks/civic-modules.json";
import fallbackArticles from "@/data/fallbacks/learn-articles.json";
import fallbackPaths from "@/data/fallbacks/learn-paths.json";
import fallbackStories from "@/data/fallbacks/learn-stories.json";
import fallbackQuests from "@/data/fallbacks/learn-quests.json";
import fallbackTrivia from "@/data/fallbacks/learn-trivia.json";

const store = new Map<string, string>();

beforeEach(() => {
  store.clear();
  __resetFlushLockForTests();
  vi.stubGlobal("localStorage", {
    getItem: (k: string) => store.get(k) ?? null,
    setItem: (k: string, v: string) => {
      store.set(k, v);
    },
    removeItem: (k: string) => {
      store.delete(k);
    },
    clear: () => store.clear(),
    key: (i: number) => Array.from(store.keys())[i] ?? null,
    get length() {
      return store.size;
    },
  });
  vi.stubGlobal("window", {
    localStorage: globalThis.localStorage,
    sessionStorage: {
      removeItem: vi.fn(),
    },
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

  it("scrubs invalid age/education so bad drafts cannot 400 the API forever", () => {
    writeOnboardingDraft({
      county: "Nairobi",
      ageRange: "teen",
      educationLevel: "phd",
    });
    const draft = readOnboardingDraft();
    expect(draft?.ageRange).toBeUndefined();
    expect(draft?.educationLevel).toBeUndefined();
    expect(sanitizeProfilePatch({ age_range: "nope", education_level: "tertiary" })).toEqual({
      education_level: "tertiary",
    });
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

  it("removes corrupt JSON blobs instead of throwing", () => {
    store.set(PROFILE_STORAGE_KEYS.onboarding, "{not-json");
    expect(readOnboardingDraft()).toBeNull();
    expect(store.has(PROFILE_STORAGE_KEYS.onboarding)).toBe(false);
  });

  it("logout keeps onboarding draft for a later login sync", () => {
    writeOnboardingDraft({ county: "Narok", ageRange: "age_18_24", educationLevel: "tertiary" });
    mergePendingProfilePatch({ county: "Narok" });
    clearCitizenLocalSession({ wipePendingPersonalization: false });
    expect(readOnboardingDraft()?.county).toBe("Narok");
    expect(readPendingProfilePatch()?.county).toBe("Narok");
  });

  it("stores gamification events in the offline queue (deduped)", () => {
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

  it("dedupes concurrent flushAllOfflineCitizenData into one PATCH", async () => {
    writeOnboardingDraft({
      county: "Garissa",
      ageRange: "age_25_34",
      educationLevel: "professional",
      priorities: ["Jobs & Digital Economy"],
    });
    let resolvePatch!: (v: unknown) => void;
    const patchMe = vi.fn(
      () =>
        new Promise((resolve) => {
          resolvePatch = resolve;
        }),
    );
    const a = flushAllOfflineCitizenData(patchMe as never, {
      breakName: "Learner",
      pseudoName: "Learner_Garissa",
      county: "Garissa",
      language: "EN",
    });
    const b = flushAllOfflineCitizenData(patchMe as never, {
      breakName: "Learner",
      pseudoName: "Learner_Garissa",
      county: "Garissa",
      language: "EN",
    });
    expect(patchMe).toHaveBeenCalledTimes(1);
    resolvePatch({ id: "u3" });
    const [ra, rb] = await Promise.all([a, b]);
    expect(ra.profile).toBe("synced");
    expect(rb.profile).toBe("synced");
    clearOnboardingDraft();
    clearPendingProfilePatch();
  });
});

describe("JSON fallback contracts (read-only catalogue)", () => {
  it("civic-modules fallback has slug, title, steps for every entry", () => {
    expect(fallbackModules.results.length).toBeGreaterThan(0);
    for (const mod of fallbackModules.results) {
      expect(mod.slug).toBeTruthy();
      expect(mod.title).toBeTruthy();
      expect(Array.isArray(mod.steps)).toBe(true);
      expect(mod.steps.length).toBeGreaterThan(0);
    }
  });

  it("articles and paths fallbacks are non-empty learn hub items", () => {
    expect(fallbackArticles.results.length).toBeGreaterThan(0);
    expect(fallbackPaths.results.length).toBeGreaterThan(0);
    for (const item of [...fallbackArticles.results, ...fallbackPaths.results]) {
      expect(item.slug).toBeTruthy();
      expect(item.title).toBeTruthy();
      expect(item.content_type).toBeTruthy();
    }
  });

  it("stories, quests, and trivia fallbacks are non-empty", () => {
    expect(fallbackStories.results.length).toBeGreaterThan(0);
    expect(fallbackQuests.results.length).toBeGreaterThan(0);
    expect(fallbackTrivia.results.length).toBeGreaterThan(0);
    for (const item of [...fallbackStories.results, ...fallbackQuests.results]) {
      expect(item.slug).toBeTruthy();
      expect(item.title).toBeTruthy();
      expect(item.content_type).toBeTruthy();
    }
    for (const set of fallbackTrivia.results) {
      expect(set.id || set.slug).toBeTruthy();
      expect(set.title).toBeTruthy();
      expect(Array.isArray(set.questions)).toBe(true);
    }
  });
});
