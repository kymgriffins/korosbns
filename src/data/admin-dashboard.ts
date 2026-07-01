import { adminUsersApi, adminContentApi, adminModulesApi, adminForumApi } from "@/lib/admin-api";
import { withFallback } from "@/data/adapter";

export interface AdminDashboardSummary {
  users: { total: number; active: number; new_this_month: number };
  content: { total: number; published: number; drafts: number; articles: number; videos: number; stories: number };
  modules: { total: number; published: number };
  forum: { total_threads: number; total_posts: number; reported: number };
}

const DEFAULT_SUMMARY: AdminDashboardSummary = {
  users: { total: 0, active: 0, new_this_month: 0 },
  content: { total: 0, published: 0, drafts: 0, articles: 0, videos: 0, stories: 0 },
  modules: { total: 0, published: 0 },
  forum: { total_threads: 0, total_posts: 0, reported: 0 },
};

let _cached: AdminDashboardSummary = { ...DEFAULT_SUMMARY };

const contentTypes = ["articles", "videos", "stories", "documents"] as const;

async function fetchAllContentCounts(): Promise<{ articles: number; videos: number; stories: number; total: number }> {
  let articles = 0, videos = 0, stories = 0, total = 0;
  const results = await Promise.allSettled(
    contentTypes.map((ct) =>
      adminContentApi.list(ct, { page: 1 }).then((r) => ({ type: ct, count: r.count ?? 0 }))
    )
  );
  for (const r of results) {
    if (r.status === "fulfilled") {
      const { type, count } = r.value;
      if (type === "articles") articles = count;
      else if (type === "videos") videos = count;
      else if (type === "stories") stories = count;
      total += count;
    }
  }
  return { articles, videos, stories, total };
}

export const dashboardData = {
  get: () => _cached,
  set: (data: AdminDashboardSummary) => { _cached = data; },
  fetch: (): Promise<AdminDashboardSummary> =>
    withFallback(
      "admin-dashboard",
      async () => {
        const [usersRes, modulesRes, forumRes] = await Promise.allSettled([
          adminUsersApi.list({ page: 1 }),
          adminModulesApi.list({ page: 1 }),
          adminForumApi.listThreads({ page: 1 }),
        ]);
        const contentCounts = await fetchAllContentCounts();

        const users = usersRes.status === "fulfilled" ? usersRes.value : { count: 0, results: [] as { is_active: boolean }[] };
        const modules = modulesRes.status === "fulfilled" ? modulesRes.value : { count: 0, results: [] as { status: string }[] };
        const forum = forumRes.status === "fulfilled" ? forumRes.value : { count: 0, results: [] };

        const summary: AdminDashboardSummary = {
          users: {
            total: users.count ?? 0,
            active: users.results?.filter((u) => u.is_active).length ?? 0,
            new_this_month: 0,
          },
          content: {
            total: contentCounts.total,
            published: 0,
            drafts: 0,
            articles: contentCounts.articles,
            videos: contentCounts.videos,
            stories: contentCounts.stories,
          },
          modules: {
            total: modules.count ?? 0,
            published: modules.results?.filter((m) => m.status === "published").length ?? 0,
          },
          forum: {
            total_threads: forum.count ?? 0,
            total_posts: 0,
            reported: 0,
          },
        };

        _cached = summary;
        return summary;
      },
      () => {
        _cached = { ...DEFAULT_SUMMARY };
        return _cached;
      },
    ),
};
