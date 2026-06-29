import type { ForumThread, ForumThreadDetail, ForumPost } from "@/types/learn";
import type { ApiListResponse } from "@/types/api";
import { learnHubApi } from "@/lib/learn-hub";
import { withFallback } from "@/data/adapter";

export type { ForumThread, ForumThreadDetail, ForumPost };

const DEFAULT_THREADS: ForumThread[] = [];

let _threads: ForumThread[] = [...DEFAULT_THREADS];

export const forumData = {
  threads: {
    get: () => _threads,
    set: (items: ForumThread[]) => { _threads = items; },
    fetch: (chapterId?: string) =>
      withFallback(
        "forum",
        () => learnHubApi.getForumThreads(chapterId),
        () => ({ count: _threads.length, results: _threads }),
      ).then((r) => r.results ?? []),
    fetchById: (threadId: string) =>
      withFallback(
        "forum",
        () => learnHubApi.getForumThread(threadId),
        () => null as unknown as ForumThreadDetail,
      ),
    create: (body: { title: string; civic_module?: string; civic_chapter?: string }) =>
      withFallback(
        "forum",
        () => learnHubApi.createForumThread(body),
        () => {
          const t: ForumThread = {
            id: `new-${Date.now()}`,
            title: body.title,
            posts_count: 0,
            author_name: "Anonymous",
            created_at: new Date().toISOString(),
            civic_module: body.civic_module ?? null,
            civic_chapter: body.civic_chapter ?? null,
            author_initials: "AN",
            author_id: null,
            author_avatar: null,
          };
          _threads.unshift(t);
          return t;
        },
      ),
  },
  posts: {
    create: (threadId: string, content: string) =>
      withFallback(
        "forum",
        () => learnHubApi.createForumPost(threadId, content),
        () => {
          const p: ForumPost = {
            id: `new-${Date.now()}`,
            content,
            upvotes: 0,
            author_name: "Anonymous",
            author_initials: "AN",
            author_id: null,
            author_avatar: null,
            created_at: new Date().toISOString(),
          };
          return p;
        },
      ),
  },
};
