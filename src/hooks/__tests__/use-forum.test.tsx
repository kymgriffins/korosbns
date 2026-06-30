import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";

vi.mock("@/data/forum", () => ({
  forumData: {
    threads: {
      fetch: vi.fn(),
      fetchByChapterId: vi.fn(),
      fetchById: vi.fn(),
      create: vi.fn(),
    },
    posts: {
      create: vi.fn(),
    },
  },
}));

import { forumData } from "@/data/forum";
import { useForumThreads, useForumThread } from "@/hooks/use-forum";

function createWrapper() {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return function Wrapper({ children }: { children: ReactNode }) {
    return <QueryClientProvider client={qc}>{children}</QueryClientProvider>;
  };
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe("useForumThreads", () => {
  it("calls forumData.threads.fetchByChapterId when chapterId is provided", async () => {
    const mockThreads = [{ id: "1", title: "Thread 1" }];
    vi.mocked(forumData.threads.fetchByChapterId).mockResolvedValue(mockThreads as any);

    const { result } = renderHook(
      () => useForumThreads({ chapterId: "ch-1" }),
      { wrapper: createWrapper() },
    );
    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(forumData.threads.fetchByChapterId).toHaveBeenCalledWith("ch-1");
    expect(result.current.data).toEqual({ count: 1, results: mockThreads });
  });

  it("calls forumData.threads.fetch when no moduleId and no chapterId", async () => {
    const mockThreads = [{ id: "1", title: "Thread 1" }];
    vi.mocked(forumData.threads.fetch).mockResolvedValue(mockThreads as any);

    const { result } = renderHook(() => useForumThreads(), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(forumData.threads.fetch).toHaveBeenCalled();
    expect(result.current.data).toEqual({ count: 1, results: mockThreads });
  });
});

describe("useForumThread", () => {
  it("calls forumData.threads.fetchById with threadId", async () => {
    const mockThread = { id: "1", title: "Thread Detail", posts: [] };
    vi.mocked(forumData.threads.fetchById).mockResolvedValue(mockThread as any);

    const { result } = renderHook(() => useForumThread("1"), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(forumData.threads.fetchById).toHaveBeenCalledWith("1");
    expect(result.current.data).toEqual(mockThread);
  });
});
