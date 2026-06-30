import { describe, it, expect, vi, beforeEach } from "vitest";
import { citizenApi } from "@/lib/api-client";

vi.mock("@/lib/api-client", () => ({
  citizenApi: {
    getMe: vi.fn(),
    getPublicUser: vi.fn(),
    getTeamMembers: vi.fn(),
    getNotifications: vi.fn(),
    getBookmarks: vi.fn(),
    toggleBookmark: vi.fn(),
    getSocialLinks: vi.fn(),
  },
}));

import { userData } from "@/data/users";

beforeEach(() => {
  vi.clearAllMocks();
});

describe("userData profile.fetchNotifications", () => {
  it("calls citizenApi.getNotifications and returns data", async () => {
    const mockData = { results: [{ id: "1", message: "New notification" }] };
    (citizenApi.getNotifications as any).mockResolvedValue(mockData);
    const result = await userData.profile.fetchNotifications();
    expect(citizenApi.getNotifications).toHaveBeenCalled();
    expect(result).toEqual(mockData);
  });

  it("falls back to { results: [] } on API error", async () => {
    (citizenApi.getNotifications as any).mockRejectedValue(new Error("fail"));
    const result = await userData.profile.fetchNotifications();
    expect(result).toEqual({ results: [] });
  });
});

describe("userData profile.fetchBookmarks", () => {
  it("calls citizenApi.getBookmarks and returns data", async () => {
    const mockData = { results: [{ id: "1", title: "Bookmarked Article" }] };
    (citizenApi.getBookmarks as any).mockResolvedValue(mockData);
    const result = await userData.profile.fetchBookmarks();
    expect(citizenApi.getBookmarks).toHaveBeenCalled();
    expect(result).toEqual(mockData);
  });

  it("falls back to { results: [] } on API error", async () => {
    (citizenApi.getBookmarks as any).mockRejectedValue(new Error("fail"));
    const result = await userData.profile.fetchBookmarks();
    expect(result).toEqual({ results: [] });
  });
});

describe("userData profile.toggleBookmark", () => {
  it("calls citizenApi.toggleBookmark with correct args", async () => {
    const mockData = { toggle: true, bookmarks: [] };
    (citizenApi.toggleBookmark as any).mockResolvedValue(mockData);
    const result = await userData.profile.toggleBookmark("article", "1");
    expect(citizenApi.toggleBookmark).toHaveBeenCalledWith("article", "1");
    expect(result).toEqual(mockData);
  });

  it("falls back to null on API error", async () => {
    (citizenApi.toggleBookmark as any).mockRejectedValue(new Error("fail"));
    const result = await userData.profile.toggleBookmark("article", "1");
    expect(result).toBeNull();
  });
});

describe("userData profile.fetchSocialLinks", () => {
  it("calls citizenApi.getSocialLinks and returns data", async () => {
    const mockData = [{ platform: "twitter", url: "https://x.com/user" }];
    (citizenApi.getSocialLinks as any).mockResolvedValue(mockData);
    const result = await userData.profile.fetchSocialLinks();
    expect(citizenApi.getSocialLinks).toHaveBeenCalled();
    expect(result).toEqual(mockData);
  });

  it("falls back to [] on API error", async () => {
    (citizenApi.getSocialLinks as any).mockRejectedValue(new Error("fail"));
    const result = await userData.profile.fetchSocialLinks();
    expect(result).toEqual([]);
  });
});
