import { describe, it, expect, vi, beforeEach } from "vitest";
import { learnHubApi } from "@/lib/learn-hub";

vi.mock("@/lib/learn-hub", () => ({
  learnHubApi: { getForumThreads: vi.fn(), getForumThread: vi.fn(), createForumThread: vi.fn(), createForumPost: vi.fn() },
}));

import { forumData } from "@/data/forum";

beforeEach(() => {
  vi.clearAllMocks();
});

describe("forumData threads.fetchByChapterId", () => {
  it("fetchByChapterId(chapterId) calls learnHubApi.getForumThreads and returns threads", async () => {
    const mockThreads = { results: [{ id: "1", title: "Thread Title" }], count: 1 };
    (learnHubApi.getForumThreads as any).mockResolvedValue(mockThreads);
    const result = await forumData.threads.fetchByChapterId("chapter-1");
    expect(learnHubApi.getForumThreads).toHaveBeenCalledWith("chapter-1");
    expect(result).toEqual(mockThreads.results);
  });

  it("fetchByChapterId(chapterId) falls back to [] on API error", async () => {
    (learnHubApi.getForumThreads as any).mockRejectedValue(new Error("fail"));
    const result = await forumData.threads.fetchByChapterId("chapter-1");
    expect(result).toEqual([]);
  });
});
