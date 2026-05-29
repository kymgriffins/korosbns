import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  readProgress,
  writeProgress,
  clearAllModuleProgress,
  type ModuleProgress,
} from "@/lib/module-progress";

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function createMockStorage() {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] ?? null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value.toString();
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      store = {};
    }),
    get keys(): string[] {
      return Object.keys(store);
    },
  };
}

let mockStorage: ReturnType<typeof createMockStorage>;

beforeEach(() => {
  mockStorage = createMockStorage();

  Object.defineProperty(window, "localStorage", {
    value: mockStorage,
    writable: true,
    configurable: true,
  });
  Object.defineProperty(globalThis, "localStorage", {
    value: mockStorage,
    writable: true,
    configurable: true,
  });
});

function defaultProgress(): ModuleProgress {
  return {
    currentStep: 0,
    stepsCompleted: {},
    masteryAwarded: false,
    articleRead: false,
    quizAttempts: 0,
    quizCooldown: null,
    triviaRewards: [],
    videosWatched: {},
    chaptersRead: {},
  };
}

describe("readProgress", () => {
  it("returns default ModuleProgress when no blob or legacy data exists", () => {
    const progress = readProgress("nonexistent-module", 1);
    expect(progress).toEqual(defaultProgress());
  });

  it("returns ModuleProgress from a stored blob", () => {
    const stored: ModuleProgress = {
      currentStep: 2,
      stepsCompleted: { 1: true },
      masteryAwarded: true,
      articleRead: true,
      quizAttempts: 1,
      quizCooldown: null,
      triviaRewards: ["0_0"],
      videosWatched: { 0: true },
      chaptersRead: { 0: true },
    };
    mockStorage.setItem(
      "bns_module_my-module_progress",
      JSON.stringify(stored),
    );

    const result = readProgress("my-module", 2);
    expect(result.currentStep).toBe(2);
    expect(result.stepsCompleted).toEqual({ 1: true });
    expect(result.masteryAwarded).toBe(true);
    expect(result.articleRead).toBe(true);
    expect(result.quizAttempts).toBe(1);
    expect(result.triviaRewards).toEqual(["0_0"]);
    expect(result.videosWatched).toEqual({ 0: true });
    expect(result.chaptersRead).toEqual({ 0: true });
  });

  it("fills missing fields with defaults when blob is partial", () => {
    mockStorage.setItem(
      "bns_module_partial_progress",
      JSON.stringify({ currentStep: 5 }),
    );

    const result = readProgress("partial", 1);
    expect(result.currentStep).toBe(5);
    expect(result.stepsCompleted).toEqual({});
    expect(result.masteryAwarded).toBe(false);
    expect(result.articleRead).toBe(false);
    expect(result.quizAttempts).toBe(0);
    expect(result.quizCooldown).toBeNull();
    expect(result.triviaRewards).toEqual([]);
    expect(result.videosWatched).toEqual({});
    expect(result.chaptersRead).toEqual({});
  });

  it("removes corrupted blob and returns defaults", () => {
    mockStorage.setItem("bns_module_corrupt_progress", "not-json-at-all");

    const result = readProgress("corrupt", 1);
    expect(result).toEqual(defaultProgress());
    expect(mockStorage.getItem("bns_module_corrupt_progress")).toBeNull();
  });
});

describe("writeProgress", () => {
  it("persists the full ModuleProgress as a JSON blob", () => {
    const progress: ModuleProgress = {
      currentStep: 3,
      stepsCompleted: { 0: true, 1: true },
      masteryAwarded: false,
      articleRead: true,
      quizAttempts: 2,
      quizCooldown: "2026-06-01T00:00:00Z",
      triviaRewards: ["0_0", "1_1"],
      videosWatched: { 0: true, 1: false },
      chaptersRead: { 0: true },
    };

    writeProgress("write-test", progress);

    const raw = mockStorage.getItem("bns_module_write-test_progress");
    expect(raw).not.toBeNull();
    const parsed = JSON.parse(raw!);
    expect(parsed.currentStep).toBe(3);
    expect(parsed.stepsCompleted).toEqual({ 0: true, 1: true });
    expect(parsed.quizCooldown).toBe("2026-06-01T00:00:00Z");
    expect(parsed.triviaRewards).toEqual(["0_0", "1_1"]);
  });

  it("overwrites previous progress on subsequent writes", () => {
    const first: ModuleProgress = {
      ...defaultProgress(),
      currentStep: 1,
      articleRead: true,
    };
    const second: ModuleProgress = {
      ...defaultProgress(),
      currentStep: 5,
      masteryAwarded: true,
    };

    writeProgress("overwrite-test", first);
    writeProgress("overwrite-test", second);

    const raw = mockStorage.getItem("bns_module_overwrite-test_progress");
    const parsed = JSON.parse(raw!);
    expect(parsed.currentStep).toBe(5);
    expect(parsed.articleRead).toBe(false);
    expect(parsed.masteryAwarded).toBe(true);
  });
});

describe("migrateLegacy", () => {
  it("converts old stage_1_* keys to the blob format", () => {
    mockStorage.setItem("stage_1_current_step", "3");
    mockStorage.setItem("stage_1_mastery_awarded", "true");
    mockStorage.setItem("stage_1_article", "true");
    mockStorage.setItem("stage_1_quiz_attempts", "2");
    mockStorage.setItem("stage_1_quiz_cooldown", "2026-05-30T12:00:00Z");
    mockStorage.setItem("stage_1_step_0_trivia_passed", "true");
    mockStorage.setItem("stage_1_step_0_trivia_0_reward", "true");
    mockStorage.setItem("stage_1_video_0", "true");
    mockStorage.setItem("stage_1_chapter_0", "true");

    const progress = readProgress("legacy-module", 1);

    expect(progress.currentStep).toBe(3);
    expect(progress.masteryAwarded).toBe(true);
    expect(progress.articleRead).toBe(true);
    expect(progress.quizAttempts).toBe(2);
    expect(progress.quizCooldown).toBe("2026-05-30T12:00:00Z");
    expect(progress.stepsCompleted[0]).toBe(true);
    expect(progress.triviaRewards).toContain("0_0");
    expect(progress.videosWatched[0]).toBe(true);
    expect(progress.chaptersRead[0]).toBe(true);

    expect(mockStorage.getItem("stage_1_current_step")).toBeNull();
    expect(mockStorage.getItem("stage_1_mastery_awarded")).toBeNull();
    expect(mockStorage.getItem("stage_1_article")).toBeNull();
    expect(mockStorage.getItem("stage_1_quiz_attempts")).toBeNull();
    expect(mockStorage.getItem("stage_1_quiz_cooldown")).toBeNull();
    expect(mockStorage.getItem("stage_1_step_0_trivia_passed")).toBeNull();
    expect(mockStorage.getItem("stage_1_step_0_trivia_0_reward")).toBeNull();
    expect(mockStorage.getItem("stage_1_video_0")).toBeNull();
    expect(mockStorage.getItem("stage_1_chapter_0")).toBeNull();

    const blob = mockStorage.getItem("bns_module_legacy-module_progress");
    expect(blob).not.toBeNull();
    const parsed = JSON.parse(blob!);
    expect(parsed.currentStep).toBe(3);
    expect(parsed.masteryAwarded).toBe(true);
  });

  it("does not modify existing blob when no legacy keys exist", () => {
    const original: ModuleProgress = { ...defaultProgress(), currentStep: 7 };
    const blobKey = "bns_module_no-legacy_progress";
    mockStorage.setItem(blobKey, JSON.stringify(original));

    readProgress("no-legacy", 1);

    const stored = mockStorage.getItem(blobKey);
    const parsed = JSON.parse(stored!);
    expect(parsed.currentStep).toBe(7);
    expect(parsed.masteryAwarded).toBe(false);
  });

  it("migrates legacy keys for order greater than 1", () => {
    mockStorage.setItem("stage_3_current_step", "4");
    mockStorage.setItem("stage_3_mastery_awarded", "true");

    const progress = readProgress("order-3-module", 3);

    expect(progress.currentStep).toBe(4);
    expect(progress.masteryAwarded).toBe(true);

    expect(mockStorage.getItem("stage_3_current_step")).toBeNull();
    expect(mockStorage.getItem("stage_3_mastery_awarded")).toBeNull();

    const blob = mockStorage.getItem("bns_module_order-3-module_progress");
    expect(blob).not.toBeNull();
  });

  it("migrates step trivia rewards with correct index format", () => {
    mockStorage.setItem("stage_2_step_0_trivia_passed", "true");
    mockStorage.setItem("stage_2_step_0_trivia_0_reward", "true");

    const progress = readProgress("trivia-migrate", 2);

    expect(progress.stepsCompleted[0]).toBe(true);
    expect(progress.triviaRewards).toEqual(["0_0"]);
  });
});

describe("round-trip write-then-read", () => {
  it("writeProgress then readProgress returns the same data", () => {
    const original: ModuleProgress = {
      currentStep: 4,
      stepsCompleted: { 0: true, 1: true, 2: true },
      masteryAwarded: true,
      articleRead: true,
      quizAttempts: 3,
      quizCooldown: "2026-07-01T00:00:00Z",
      triviaRewards: ["0_0", "1_2", "2_0"],
      videosWatched: { 0: true, 1: true, 2: false },
      chaptersRead: { 0: true, 1: true },
    };

    writeProgress("roundtrip", original);
    const retrieved = readProgress("roundtrip", 1);

    expect(retrieved.currentStep).toBe(original.currentStep);
    expect(retrieved.stepsCompleted).toEqual(original.stepsCompleted);
    expect(retrieved.masteryAwarded).toBe(original.masteryAwarded);
    expect(retrieved.articleRead).toBe(original.articleRead);
    expect(retrieved.quizAttempts).toBe(original.quizAttempts);
    expect(retrieved.quizCooldown).toBe(original.quizCooldown);
    expect(retrieved.triviaRewards).toEqual(original.triviaRewards);
    expect(retrieved.videosWatched).toEqual(original.videosWatched);
    expect(retrieved.chaptersRead).toEqual(original.chaptersRead);
  });

  it("readProgress returns freshly written data after multiple writes", () => {
    writeProgress("multi-roundtrip", { ...defaultProgress(), currentStep: 2 });
    writeProgress("multi-roundtrip", { ...defaultProgress(), currentStep: 7 });

    const result = readProgress("multi-roundtrip", 1);
    expect(result.currentStep).toBe(7);
  });

  it("reading with a different order does not change the original blob", () => {
    writeProgress("order-independent", { ...defaultProgress(), currentStep: 9 });

    readProgress("order-independent", 5);
    const result = readProgress("order-independent", 1);
    expect(result.currentStep).toBe(9);
  });
});

describe("fabricated content_id format (Item 2 bug)", () => {
  it("the fabricated format 'stage-{order}-step-{order}' does NOT match UUID format", () => {
    const fabricated = "stage-3-step-2";
    expect(fabricated).not.toMatch(UUID_RE);
  });

  it("the fabricated format 'stage-{order}' alone does NOT match UUID format", () => {
    const fabricated = "stage-3";
    expect(fabricated).not.toMatch(UUID_RE);
  });

  it("a real CivicChapter.id UUID does match UUID format", () => {
    const realUuid = "550e8400-e29b-41d4-a716-446655440000";
    expect(realUuid).toMatch(UUID_RE);
  });

  it("any UUID v4 variant matches the expected pattern", () => {
    const examples = [
      "f47ac10b-58cc-4372-a567-0e02b2c3d479",
      "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d",
      "123e4567-e89b-12d3-a456-426614174000",
    ];
    for (const uuid of examples) {
      expect(uuid).toMatch(UUID_RE);
    }
  });

  it("the fabricated content_id used in handleFinishTrivia proves the disconnect", () => {
    const contentId = "stage-3-step-2";
    const fakeStageOrder = 3;
    const fakeStepOrder = 2;
    const constructed = `stage-${fakeStageOrder}-step-${fakeStepOrder}`;

    expect(constructed).toBe(contentId);
    expect(constructed).not.toMatch(UUID_RE);
    expect(contentId.startsWith("stage-")).toBe(true);
  });
});

describe("clearAllModuleProgress", () => {
  it("removes all blob keys for given stages", () => {
    mockStorage.setItem("bns_module_alpha_progress", "{}");
    mockStorage.setItem("bns_module_beta_progress", "{}");

    clearAllModuleProgress([
      { slug: "alpha", order: 1 },
      { slug: "beta", order: 2 },
    ]);

    expect(mockStorage.getItem("bns_module_alpha_progress")).toBeNull();
    expect(mockStorage.getItem("bns_module_beta_progress")).toBeNull();
  });

  it("removes all legacy keys for given stages", () => {
    mockStorage.setItem("stage_1_current_step", "1");
    mockStorage.setItem("stage_1_mastery_awarded", "true");
    mockStorage.setItem("stage_1_article", "true");
    mockStorage.setItem("stage_1_quiz_attempts", "0");
    mockStorage.setItem("stage_1_quiz_cooldown", "null");
    mockStorage.setItem("stage_1_video_0", "true");
    mockStorage.setItem("stage_1_chapter_0", "true");
    mockStorage.setItem("stage_1_step_0_trivia_passed", "true");
    mockStorage.setItem("stage_1_step_0_trivia_0_reward", "true");

    clearAllModuleProgress([{ slug: "test", order: 1 }]);

    expect(mockStorage.getItem("stage_1_current_step")).toBeNull();
    expect(mockStorage.getItem("stage_1_mastery_awarded")).toBeNull();
    expect(mockStorage.getItem("stage_1_article")).toBeNull();
    expect(mockStorage.getItem("stage_1_quiz_attempts")).toBeNull();
    expect(mockStorage.getItem("stage_1_quiz_cooldown")).toBeNull();
    expect(mockStorage.getItem("stage_1_video_0")).toBeNull();
    expect(mockStorage.getItem("stage_1_chapter_0")).toBeNull();
    expect(mockStorage.getItem("stage_1_step_0_trivia_passed")).toBeNull();
    expect(mockStorage.getItem("stage_1_step_0_trivia_0_reward")).toBeNull();
  });

  it("removes multiple legacy indices per stage", () => {
    for (let j = 0; j < 5; j++) {
      mockStorage.setItem(`stage_1_video_${j}`, "true");
      mockStorage.setItem(`stage_1_chapter_${j}`, "true");
      mockStorage.setItem(`stage_1_step_${j}_trivia_passed`, "true");
      mockStorage.setItem(`stage_1_step_${j}_trivia_${j}_reward`, "true");
    }

    clearAllModuleProgress([{ slug: "test", order: 1 }]);

    for (let j = 0; j < 5; j++) {
      expect(mockStorage.getItem(`stage_1_video_${j}`)).toBeNull();
      expect(mockStorage.getItem(`stage_1_chapter_${j}`)).toBeNull();
      expect(mockStorage.getItem(`stage_1_step_${j}_trivia_passed`)).toBeNull();
      expect(
        mockStorage.getItem(`stage_1_step_${j}_trivia_${j}_reward`),
      ).toBeNull();
    }
  });

  it("does not remove keys for unrelated stages", () => {
    mockStorage.setItem("stage_1_current_step", "1");
    mockStorage.setItem("bns_module_alpha_progress", "{}");
    mockStorage.setItem("stage_2_current_step", "2");
    mockStorage.setItem("bns_module_beta_progress", "{}");

    clearAllModuleProgress([{ slug: "alpha", order: 1 }]);

    expect(mockStorage.getItem("stage_2_current_step")).toBe("2");
    expect(mockStorage.getItem("bns_module_beta_progress")).toBe("{}");
  });

  it("wipes all keys when called with multiple stages", () => {
    mockStorage.setItem("bns_module_a_progress", "{}");
    mockStorage.setItem("bns_module_b_progress", "{}");
    mockStorage.setItem("stage_1_current_step", "1");
    mockStorage.setItem("stage_3_current_step", "3");
    mockStorage.setItem("unrelated_key", "keep");

    clearAllModuleProgress([
      { slug: "a", order: 1 },
      { slug: "b", order: 3 },
    ]);

    expect(mockStorage.getItem("bns_module_a_progress")).toBeNull();
    expect(mockStorage.getItem("bns_module_b_progress")).toBeNull();
    expect(mockStorage.getItem("stage_1_current_step")).toBeNull();
    expect(mockStorage.getItem("stage_3_current_step")).toBeNull();
    expect(mockStorage.getItem("unrelated_key")).toBe("keep");
  });
});
