import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";

vi.mock("@/data/gamification", () => ({
  gamificationData: {
    badges: { fetch: vi.fn() },
    challenges: { fetch: vi.fn() },
    certificates: { fetch: vi.fn() },
    referral: { fetch: vi.fn() },
    leaderboard: { fetch: vi.fn() },
  },
}));

import { gamificationData } from "@/data/gamification";
import {
  useBadgeCatalog,
  useChallenges,
  useCertificates,
  useReferralMe,
  useLeaderboard,
} from "@/hooks/use-gamification";

function createWrapper() {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return function Wrapper({ children }: { children: ReactNode }) {
    return <QueryClientProvider client={qc}>{children}</QueryClientProvider>;
  };
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe("useBadgeCatalog", () => {
  it("calls gamificationData.badges.fetch and returns data", async () => {
    const mockBadges = {
      results: [{ id: "1", slug: "test-badge", name: "Test Badge" }],
      summary: { earned: 0, in_progress: 1, locked: 0, total: 1 },
    };
    vi.mocked(gamificationData.badges.fetch).mockResolvedValue(mockBadges as any);

    const { result } = renderHook(() => useBadgeCatalog(), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(gamificationData.badges.fetch).toHaveBeenCalled();
    expect(result.current.data).toEqual(mockBadges);
  });
});

describe("useChallenges", () => {
  it("calls gamificationData.challenges.fetch and returns data", async () => {
    const mockChallenges = [{ id: "1", title: "Challenge 1" }];
    vi.mocked(gamificationData.challenges.fetch).mockResolvedValue(mockChallenges as any);

    const { result } = renderHook(() => useChallenges(), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(gamificationData.challenges.fetch).toHaveBeenCalled();
    expect(result.current.data).toEqual(mockChallenges);
  });
});

describe("useCertificates", () => {
  it("calls gamificationData.certificates.fetch and returns data", async () => {
    const mockCerts = [{ id: "1", title: "Certificate 1" }];
    vi.mocked(gamificationData.certificates.fetch).mockResolvedValue(mockCerts as any);

    const { result } = renderHook(() => useCertificates(), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(gamificationData.certificates.fetch).toHaveBeenCalled();
    expect(result.current.data).toEqual(mockCerts);
  });
});

describe("useReferralMe", () => {
  it("calls gamificationData.referral.fetch and returns data", async () => {
    const mockReferral = { code: "ABC123", count: 5, earnings: 50 };
    vi.mocked(gamificationData.referral.fetch).mockResolvedValue(mockReferral as any);

    const { result } = renderHook(() => useReferralMe(), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(gamificationData.referral.fetch).toHaveBeenCalled();
    expect(result.current.data).toEqual(mockReferral);
  });
});

describe("useLeaderboard", () => {
  it("calls gamificationData.leaderboard.fetch with default limit and wraps results", async () => {
    const mockEntries = [{ rank: 1, name: "Player 1", points: 100, level: 2, streak_days: 3, badge_count: 1 }];
    vi.mocked(gamificationData.leaderboard.fetch).mockResolvedValue(mockEntries as any);

    const { result } = renderHook(() => useLeaderboard(), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(gamificationData.leaderboard.fetch).toHaveBeenCalledWith(20);
    expect(result.current.data).toEqual({ results: mockEntries });
  });

  it("calls gamificationData.leaderboard.fetch with custom limit", async () => {
    vi.mocked(gamificationData.leaderboard.fetch).mockResolvedValue([]);

    const { result } = renderHook(() => useLeaderboard(10), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(gamificationData.leaderboard.fetch).toHaveBeenCalledWith(10);
  });
});
