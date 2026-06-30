import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";

vi.mock("@/data/users", () => ({
  userData: {
    profile: {
      fetchNotifications: vi.fn(),
      fetchBookmarks: vi.fn(),
      fetchSocialLinks: vi.fn(),
    },
  },
}));

import { userData } from "@/data/users";
import {
  useNotifications,
  useBookmarks,
  useSocialLinks,
} from "@/hooks/use-profile";

function createWrapper() {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return function Wrapper({ children }: { children: ReactNode }) {
    return <QueryClientProvider client={qc}>{children}</QueryClientProvider>;
  };
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe("useNotifications", () => {
  it("calls userData.profile.fetchNotifications and returns data", async () => {
    const mockNotifications = { results: [{ id: "1", message: "Test notification" }] };
    vi.mocked(userData.profile.fetchNotifications).mockResolvedValue(mockNotifications as any);

    const { result } = renderHook(() => useNotifications(), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(userData.profile.fetchNotifications).toHaveBeenCalled();
    expect(result.current.data).toEqual(mockNotifications);
  });
});

describe("useBookmarks", () => {
  it("calls userData.profile.fetchBookmarks and returns data", async () => {
    const mockBookmarks = { results: [{ id: "1", title: "Bookmarked Article" }] };
    vi.mocked(userData.profile.fetchBookmarks).mockResolvedValue(mockBookmarks as any);

    const { result } = renderHook(() => useBookmarks(), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(userData.profile.fetchBookmarks).toHaveBeenCalled();
    expect(result.current.data).toEqual(mockBookmarks);
  });
});

describe("useSocialLinks", () => {
  it("calls userData.profile.fetchSocialLinks and returns data", async () => {
    const mockLinks = [{ platform: "twitter", url: "https://twitter.com/test", visibility: "public" }];
    vi.mocked(userData.profile.fetchSocialLinks).mockResolvedValue(mockLinks as any);

    const { result } = renderHook(() => useSocialLinks(), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(userData.profile.fetchSocialLinks).toHaveBeenCalled();
    expect(result.current.data).toEqual(mockLinks);
  });
});
