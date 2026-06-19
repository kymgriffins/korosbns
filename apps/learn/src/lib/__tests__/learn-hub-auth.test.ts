import { describe, it, expect, vi, beforeEach } from "vitest";
import { learnHubApi } from "@/lib/learn-hub";
import { apiFetch } from "@/lib/api-client";

vi.mock("@/lib/api-client", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/api-client")>();
  return {
    ...actual,
    apiFetch: vi.fn().mockResolvedValue({}),
  };
});

function lastAuthFlag(): boolean | undefined {
  const lastCall = vi.mocked(apiFetch).mock.calls.at(-1);
  return (lastCall?.[1] as { auth?: boolean } | undefined)?.auth;
}

beforeEach(() => {
  vi.mocked(apiFetch).mockClear();
});

describe("learnHubApi authenticated endpoints", () => {
  it("profile uses auth:true", async () => {
    await learnHubApi.profile();
    expect(lastAuthFlag()).toBe(true);
  });

  it("markProgress uses auth:true", async () => {
    await learnHubApi.markProgress({ content_type: "chapter", content_id: "1" });
    expect(lastAuthFlag()).toBe(true);
  });

  it("completeChapter uses auth:true", async () => {
    await learnHubApi.completeChapter("ch-1");
    expect(lastAuthFlag()).toBe(true);
  });

  it("submitTriviaAttempt uses auth:true", async () => {
    await learnHubApi.submitTriviaAttempt("t1", { q1: 1 });
    expect(lastAuthFlag()).toBe(true);
  });

  it("createForumThread uses auth:true", async () => {
    await learnHubApi.createForumThread({ title: "Hi" });
    expect(lastAuthFlag()).toBe(true);
  });

  it("createForumPost uses auth:true", async () => {
    await learnHubApi.createForumPost("t1", "hello");
    expect(lastAuthFlag()).toBe(true);
  });
});

describe("learnHubApi public reads", () => {
  it("stages does not set auth:true", async () => {
    await learnHubApi.stages();
    expect(lastAuthFlag()).toBeUndefined();
  });

  it("getForumThreads does not set auth:true", async () => {
    await learnHubApi.getForumThreads();
    expect(lastAuthFlag()).toBeUndefined();
  });
});
