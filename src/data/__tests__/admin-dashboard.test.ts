import { describe, it, expect, vi, beforeEach } from "vitest";
import { adminUsersApi, adminContentApi, adminModulesApi, adminForumApi } from "@/lib/admin-api";

vi.mock("@/lib/admin-api", () => ({
  adminUsersApi: { list: vi.fn() },
  adminContentApi: { list: vi.fn() },
  adminModulesApi: { list: vi.fn() },
  adminForumApi: { listThreads: vi.fn() },
}));

import { dashboardData, type AdminDashboardSummary } from "@/data/admin-dashboard";

const mockUsersRes = { count: 150, results: [{ id: "1", email: "a@b.com", first_name: "A", last_name: "B", role: "viewer", is_active: true, date_joined: "2024-01-01" }] };
const mockArticlesRes = { count: 40, results: [] };
const mockVideosRes = { count: 15, results: [] };
const mockStoriesRes = { count: 8, results: [] };
const mockModulesRes = { count: 10, results: [] };
const mockForumRes = { count: 25, results: [] };

beforeEach(() => {
  vi.clearAllMocks();
});

describe("dashboardData", () => {
  it("fetch() returns combined summary on success", async () => {
    (adminUsersApi.list as any).mockResolvedValue(mockUsersRes);
    (adminContentApi.list as any).mockImplementation((type: string) => {
      if (type === "articles") return Promise.resolve(mockArticlesRes);
      if (type === "videos") return Promise.resolve(mockVideosRes);
      if (type === "stories") return Promise.resolve(mockStoriesRes);
      return Promise.resolve({ count: 0, results: [] });
    });
    (adminModulesApi.list as any).mockResolvedValue(mockModulesRes);
    (adminForumApi.listThreads as any).mockResolvedValue(mockForumRes);

    const result = await dashboardData.fetch();

    expect(result.users.total).toBe(150);
    expect(result.content.total).toBe(63);
    expect(result.content.articles).toBe(40);
    expect(result.content.videos).toBe(15);
    expect(result.content.stories).toBe(8);
    expect(result.modules.total).toBe(10);
    expect(result.forum.total_threads).toBe(25);
  });

  it("fetch() falls back to DEFAULT_SUMMARY on full API failure", async () => {
    (adminUsersApi.list as any).mockRejectedValue(new Error("fail"));
    (adminContentApi.list as any).mockRejectedValue(new Error("fail"));
    (adminModulesApi.list as any).mockRejectedValue(new Error("fail"));
    (adminForumApi.listThreads as any).mockRejectedValue(new Error("fail"));

    const result = await dashboardData.fetch();

    expect(result.users.total).toBe(0);
    expect(result.users.active).toBe(0);
    expect(result.content.total).toBe(0);
    expect(result.modules.total).toBe(0);
    expect(result.forum.total_threads).toBe(0);
  });

  it("fetch() handles partial failures gracefully", async () => {
    (adminUsersApi.list as any).mockResolvedValue(mockUsersRes);
    (adminContentApi.list as any).mockRejectedValue(new Error("fail"));
    (adminModulesApi.list as any).mockResolvedValue(mockModulesRes);
    (adminForumApi.listThreads as any).mockRejectedValue(new Error("fail"));

    const result = await dashboardData.fetch();

    expect(result.users.total).toBe(150);
    expect(result.content.total).toBe(0);
    expect(result.content.articles).toBe(0);
    expect(result.modules.total).toBe(10);
    expect(result.forum.total_threads).toBe(0);
  });

  it("get() returns the cached summary", async () => {
    (adminUsersApi.list as any).mockResolvedValue(mockUsersRes);
    (adminContentApi.list as any).mockResolvedValue(mockArticlesRes);
    (adminModulesApi.list as any).mockResolvedValue(mockModulesRes);
    (adminForumApi.listThreads as any).mockResolvedValue(mockForumRes);

    await dashboardData.fetch();
    const result = dashboardData.get();

    expect(result.users.total).toBe(150);
  });
});
