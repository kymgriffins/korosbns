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
        () => _modules.find((m) => m.slug === slug || m.id === slug) ?? null,
      ),
    create: (data: Partial<AdminModule>) =>
      withFallback(
        "admin-content",
        () =>
          adminModulesApi.create({
            title: data.title ?? "Untitled",
            slug: data.slug ?? `untitled-${Date.now()}`,
            description: data.description,
            image_url: data.image_url,
            status: data.status,
            author_id: data.author_id,
            author_is_team: data.author_is_team,
            order: data.order,
            is_financial_year_analysis: data.is_financial_year_analysis,
            fiscal_year_id: data.fiscal_year_id,
          }),
        () => {
          const m: AdminModule = {
            id: `new-${Date.now()}`,
            title: data.title ?? "Untitled",
            slug: data.slug ?? `untitled-${Date.now()}`,
            description: data.description ?? "",
            status: "draft",
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
        () =>
          adminModulesApi.update(slug, {
            title: data.title,
            slug: data.slug,
            description: data.description,
            image_url: data.image_url,
            status: data.status,
            author_id: data.author_id,
            author_is_team: data.author_is_team,
            order: data.order,
            is_financial_year_analysis: data.is_financial_year_analysis,
            fiscal_year_id: data.fiscal_year_id,
          }),
        () => {
          const idx = _modules.findIndex((m) => m.slug === slug || m.id === slug);
          if (idx !== -1) _modules[idx] = { ..._modules[idx], ...data };
          return _modules[idx] ?? null;
        },
      ),
    delete: (slug: string) =>
      withFallback(
        "admin-content",
        () =>
          adminModulesApi.delete(slug).then(() => {
            _modules = _modules.filter((m) => m.slug !== slug && m.id !== slug);
          }),
        () => {
          _modules = _modules.filter((m) => m.slug !== slug && m.id !== slug);
        },
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
    create: (data: { title: string; civic_module?: string | null }) =>
      withFallback(
        "admin-content",
        () => adminForumApi.createThread(data).then((r) => {
          _forumThreads.unshift(r);
          return r;
        }),
        () => {
          const t: AdminForumThread = {
            id: `new-${Date.now()}`,
            title: data.title,
            author_name: "Admin",
            posts_count: 0,
            created_at: new Date().toISOString(),
            civic_module: data.civic_module ?? null,
          };
          _forumThreads.unshift(t);
          return t;
        },
      ),
    update: (id: string, data: { title?: string; civic_module?: string | null }) =>
      withFallback(
        "admin-content",
        async () => {
          // No PATCH thread API — soft-delete + recreate is the admin path; local merge only.
          throw new Error("Forum thread update is not available on the Django JSON API.");
        },
        () => {
          const idx = _forumThreads.findIndex((t) => t.id === id);
          if (idx !== -1) _forumThreads[idx] = { ..._forumThreads[idx], ...data };
          return _forumThreads[idx] ?? null;
        },
      ),
    deleteThread: (id: string) =>
      withFallback(
        "admin-content",
        () =>
          adminForumApi.softDeleteThread(id).then(() => {
            _forumThreads = _forumThreads.filter((t) => t.id !== id);
          }),
        () => {
          _forumThreads = _forumThreads.filter((t) => t.id !== id);
        },
      ),
    deletePost: (threadId: string, postId: string) =>
      withFallback(
        "admin-content",
        () => adminForumApi.softDeletePost(threadId, postId),
        () => {},
      ),
  },
};
