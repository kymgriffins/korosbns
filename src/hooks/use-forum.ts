"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { forumData } from "@/data/forum";
import type { ForumThread, ForumThreadDetail } from "@/types/learn";
import type { ApiListResponse } from "@/types/api";

export function useForumThreads(filters?: { chapterId?: string; moduleId?: string }) {
  return useQuery({
    queryKey: ["forum", "threads", filters],
    queryFn: async () => {
      if (filters?.chapterId) {
        const threads = await forumData.threads.fetchByChapterId(filters.chapterId);
        return { count: threads.length, results: threads } as ApiListResponse<ForumThread>;
      }
      const threads = await forumData.threads.fetch(filters?.chapterId);
      return { count: threads.length, results: threads } as ApiListResponse<ForumThread>;
    },
    staleTime: 1000 * 60,
  });
}

export function useForumThread(threadId: string) {
  return useQuery({
    queryKey: ["forum", "thread", threadId],
    queryFn: () =>
      forumData.threads.fetchById(threadId) as Promise<ForumThreadDetail>,
    staleTime: 1000 * 30,
  });
}

export function useCreateForumThread() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: { title: string; civic_module?: string; civic_chapter?: string }) =>
      forumData.threads.create(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["forum"] });
    },
  });
}

export function useCreateForumPost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ threadId, content }: { threadId: string; content: string }) =>
      forumData.posts.create(threadId, content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["forum"] });
    },
  });
}
