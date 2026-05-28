import { describe, it, expect, vi, beforeEach } from "vitest";
import { learnHubApi } from "@/lib/learn-hub";
import { mapCivicModulesToStages } from "@/lib/civic-stages";

const mockLocalStorage = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] ?? null),
    setItem: vi.fn((key: string, value: string) => { store[key] = value; }),
    removeItem: vi.fn((key: string) => { delete store[key]; }),
    clear: vi.fn(() => { store = {}; }),
  };
})();
Object.defineProperty(window, "localStorage", { value: mockLocalStorage, writable: true });

vi.mock("@/lib/gamification", () => ({
  gamificationHeaders: () => ({
    "Content-Type": "application/json",
    "X-Gamification-Id": "device-test-123",
  }),
  getGamificationDeviceId: () => "device-test-123",
}));

describe("learnHubApi civic integration", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("maps civic modules into stage-compatible structures", () => {
    const stages = mapCivicModulesToStages([
      {
        id: "constitution",
        slug: "constitution",
        title: "Constitution",
        order: 1,
        steps: [
          {
            id: "chapter-1",
            title: "Chapter 1",
            order: 1,
            youtube_url: "https://www.youtube.com/watch?v=abc123xyz",
            trivia_id: "trivia-1",
            is_completed: false,
            is_locked: false,
          },
        ],
      },
    ]);

    expect(stages).toHaveLength(1);
    expect(stages[0].slug).toBe("constitution");
    expect(stages[0].steps[0].youtubeId).toBe("abc123xyz");
    expect(stages[0].steps[0].chapterId).toBe("chapter-1");
  });

  it("posts chapter completion with gamification headers", async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ detail: "Chapter marked as completed.", module_completed: false }),
    });
    vi.stubGlobal("fetch", mockFetch);

    const result = await learnHubApi.completeChapter("chapter-uuid");
    expect(result.detail).toContain("Chapter marked");
    expect(mockFetch).toHaveBeenCalledTimes(1);
    const [, init] = mockFetch.mock.calls[0];
    expect(init.method).toBe("POST");
    expect(init.headers["X-Gamification-Id"]).toBe("device-test-123");
  });

  it("submits trivia attempts with gamification headers", async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ score: 10 }),
    });
    vi.stubGlobal("fetch", mockFetch);

    const result = await learnHubApi.submitTriviaAttempt("trivia-uuid", { "q-1": 0 });
    expect(result.score).toBe(10);
    const [url, init] = mockFetch.mock.calls[0];
    expect(String(url)).toContain("/engagement/trivia/trivia-uuid/attempt/");
    expect(init.method).toBe("POST");
    expect(init.headers["X-Gamification-Id"]).toBe("device-test-123");
  });

  it("surfaces 404 when civic modules API is not deployed", async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 404,
      json: () => Promise.resolve({}),
    });
    vi.stubGlobal("fetch", mockFetch);

    await expect(learnHubApi.civicModules()).rejects.toThrow(/Request failed \(404\)/);
  });

  it("surfaces backend errors from markProgress", async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: false,
      text: () => Promise.resolve("Authentication required"),
    });
    vi.stubGlobal("fetch", mockFetch);

    await expect(
      learnHubApi.markProgress({
        content_type: "lesson",
        content_id: "chapter-1",
        progress_percent: 100,
      }),
    ).rejects.toThrow("Authentication required");
  });
});
