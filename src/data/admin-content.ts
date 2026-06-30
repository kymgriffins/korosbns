import { adminContentApi, adminModulesApi, adminForumApi } from "@/lib/admin-api";
import type { ApiListResponse } from "@/types/api";
import { withFallback } from "@/data/adapter";
import type { AdminContentItem, AdminModule, AdminForumThread } from "@/lib/admin-api";

export type { AdminContentItem, AdminModule, AdminForumThread };

let _content: AdminContentItem[] = [];
let _modules: AdminModule[] = [];
let _forumThreads: AdminForumThread[] = [];

const DEFAULT_CONTENT_TYPES = ["articles", "videos", "stories", "documents"] as const;

export const adminContentData = {
  content: {
    get: () => _content,
    set: (items: AdminContentItem[]) => { _content = items; },
    fetch: (contentType: string = "articles") =>
      withFallback(
        "admin-content",
        () => adminContentApi.list(contentType).then((r) => {
          const results = r.results ?? [];
          _content = results;
          return results;
        }),
        () => _content,
      ),
    fetchList: (contentType: string, params?: { page?: number; search?: string }) =>
      withFallback(
        "admin-content",
        () => adminContentApi.list(contentType, params).then((r) => {
          _content = r.results ?? [];
          return r;
        }),
        () => ({ count: _content.length, results: _content } as ApiListResponse<AdminContentItem>),
      ),
    fetchById: (contentType: string, id: string) =>
      withFallback(
        "admin-content",
        () => adminContentApi.get(contentType, id),
        () => _content.find((c) => c.id === id) ?? null,
      ),
    create: (contentType: string, data: Partial<AdminContentItem>) =>
      withFallback(
        "admin-content",
        () => adminContentApi.create(contentType, data),
        () => {
          const item: AdminContentItem = {
            id: `new-${Date.now()}`,
            title: data.title ?? "Untitled",
            slug: data.slug ?? `untitled-${Date.now()}`,
            content_type: contentType,
            status: "draft",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          };
          _content.unshift(item);
          return item;
        },
      ),
    update: (contentType: string, id: string, data: Partial<AdminContentItem>) =>
      withFallback(
        "admin-content",
        () => adminContentApi.update(contentType, id, data),
        () => {
          const idx = _content.findIndex((c) => c.id === id);
          if (idx !== -1) _content[idx] = { ..._content[idx], ...data };
          return _content[idx] ?? null;
        },
      ),
    delete: (contentType: string, id: string) =>
      withFallback(
        "admin-content",
        () => adminContentApi.delete(contentType, id).then(() => {
          _content = _content.filter((c) => c.id !== id);
        }),
        () => { _content = _content.filter((c) => c.id !== id); },
      ),
  },

  modules: {
    get: () => _modules,
    set: (items: AdminModule[]) => { _modules = items; },
    fetch: () =>
      withFallback(
        "admin-content",
        () => adminModulesApi.list().then((r) => {
          const results = r.results ?? [];
          _modules = results;
          return results;
        }),
        () => _modules,
      ),
    fetchList: (params?: { page?: number; search?: string }) =>
      withFallback(
        "admin-content",
        () => adminModulesApi.list(params).then((r) => {
          _modules = r.results ?? [];
          return r;
        }),
        () => ({ count: _modules.length, results: _modules } as ApiListResponse<AdminModule>),
      ),
    fetchBySlug: (slug: string) =>
      withFallback(
        "admin-content",
        () => adminModulesApi.get(slug),
        () => _modules.find((m) => m.slug === slug) ?? null,
      ),
    create: (data: Partial<AdminModule>) =>
      withFallback(
        "admin-content",
        () => adminModulesApi.create(data),
        () => {
          const m: AdminModule = {
            id: `new-${Date.now()}`,
            title: data.title ?? "Untitled",
            slug: data.slug ?? `untitled-${Date.now()}`,
            description: data.description ?? "",
            badge: data.badge ?? "",
            badgeName: data.badgeName ?? "",
            status: "draft",
            steps: [],
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          };
          _modules.unshift(m);
          return m;
        },
      ),
    update: (slug: string, data: Partial<AdminModule>) =>
      withFallback(
        "admin-content",
        () => adminModulesApi.update(slug, data),
        () => {
          const idx = _modules.findIndex((m) => m.slug === slug);
          if (idx !== -1) _modules[idx] = { ..._modules[idx], ...data };
          return _modules[idx] ?? null;
        },
      ),
    delete: (slug: string) =>
      withFallback(
        "admin-content",
        () => adminModulesApi.delete(slug).then(() => {
          _modules = _modules.filter((m) => m.slug !== slug);
        }),
        () => { _modules = _modules.filter((m) => m.slug !== slug); },
      ),
  },

  forum: {
    get: () => _forumThreads,
    set: (items: AdminForumThread[]) => { _forumThreads = items; },
    fetch: () =>
      withFallback(
        "admin-content",
        () => adminForumApi.listThreads().then((r) => {
          const results = r.results ?? [];
          _forumThreads = results;
          return results;
        }),
        () => _forumThreads,
      ),
    fetchList: (params?: { page?: number; search?: string }) =>
      withFallback(
        "admin-content",
        () => adminForumApi.listThreads(params).then((r) => {
          _forumThreads = r.results ?? [];
          return r;
        }),
        () => ({ count: _forumThreads.length, results: _forumThreads } as ApiListResponse<AdminForumThread>),
      ),
    deleteThread: (id: string) =>
      withFallback(
        "admin-content",
        () => adminForumApi.deleteThread(id).then(() => {
          _forumThreads = _forumThreads.filter((t) => t.id !== id);
        }),
        () => { _forumThreads = _forumThreads.filter((t) => t.id !== id); },
      ),
    deletePost: (threadId: string, postId: string) =>
      withFallback(
        "admin-content",
        () => adminForumApi.deletePost(threadId, postId),
        () => {},
      ),
  },
};
