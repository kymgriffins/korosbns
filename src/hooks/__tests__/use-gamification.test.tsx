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

vi.mock("@/lib/api-client", () => ({
  apiFetch: vi.fn(),
}));

import { gamificationData } from "@/data/gamification";
import { apiFetch } from "@/lib/api-client";
import {
  useBadgeCatalog,
  useChallenges,
  useCertificates,
  useReferralMe,
  useLeaderboard,
  useGamificationMe,
  useRecordEvent,
  useSubmitChallenge,
  useIssueCertificate,
  useClaimReferral,
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

describe("useGamificationMe", () => {
  it("calls apiFetch and returns gamification state", async () => {
    const mockState = { total_points: 100, level: 2, streak_days: 5, badges: [] };
    vi.mocked(apiFetch).mockResolvedValue(mockState);

    const { result } = renderHook(() => useGamificationMe(), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(apiFetch).toHaveBeenCalledWith("/gamification/me/", { auth: true });
    expect(result.current.data).toEqual(mockState);
  });
});

describe("useRecordEvent", () => {
  it("calls apiFetch POST and invalidates gamification cache", async () => {
    vi.mocked(apiFetch).mockResolvedValue({ total_points: 110 });

    const { result } = renderHook(() => useRecordEvent(), { wrapper: createWrapper() });
    const payload = { event_type: "article_read", idempotency_key: "abc-123" };
    result.current.mutate(payload);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(apiFetch).toHaveBeenCalledWith("/gamification/events/", {
      method: "POST",
      auth: true,
      body: JSON.stringify(payload),
    });
  });
});

describe("useSubmitChallenge", () => {
  it("calls apiFetch POST and returns points_awarded", async () => {
    vi.mocked(apiFetch).mockResolvedValue({ points_awarded: 50 });

    const { result } = renderHook(() => useSubmitChallenge(), { wrapper: createWrapper() });
    result.current.mutate("challenge-1");

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(apiFetch).toHaveBeenCalledWith("/gamification/challenges/challenge-1/submit/", {
      method: "POST",
      auth: true,
    });
    expect(result.current.data).toEqual({ points_awarded: 50 });
  });
});

describe("useIssueCertificate", () => {
  it("calls apiFetch POST with civic module id", async () => {
    vi.mocked(apiFetch).mockResolvedValue({ id: "cert-1", module_title: "Module Complete", module_slug: "m1", issued_at: "2026-01-01T00:00:00Z" });

    const { result } = renderHook(() => useIssueCertificate(), { wrapper: createWrapper() });
    result.current.mutate("module-1");

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(apiFetch).toHaveBeenCalledWith("/gamification/certificates/issue/", {
      method: "POST",
      auth: true,
      body: JSON.stringify({ civic_module_id: "module-1" }),
    });
    expect(result.current.data?.module_title).toBe("Module Complete");
  });
});

describe("useClaimReferral", () => {
  it("calls apiFetch POST with referral code", async () => {
    vi.mocked(apiFetch).mockResolvedValue({ referrer_points: 25 });

    const { result } = renderHook(() => useClaimReferral(), { wrapper: createWrapper() });
    result.current.mutate("REFCODE");

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(apiFetch).toHaveBeenCalledWith("/gamification/referrals/claim/", {
      method: "POST",
      auth: true,
      body: JSON.stringify({ referral_code: "REFCODE" }),
    });
    expect(result.current.data).toEqual({ referrer_points: 25 });
  });
});
