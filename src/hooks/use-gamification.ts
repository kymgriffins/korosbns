import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api-client";
import type { GamificationState, LeaderboardEntry } from "@/types/gamification";
import type { ChallengeData, ReferralData, BadgeCatalogResponse } from "@/types/gamification";
import type { CertificateData } from "@/types/learn";
import type { ApiListResponse } from "@/types/api";
import type { PointHistoryEvent } from "@/lib/trophy-profile-data";
import { gamificationData } from "@/data/gamification";

export function useGamificationMe() {
  return useQuery({
    queryKey: ["gamification", "me"],
    queryFn: () => apiFetch<GamificationState>("/gamification/me/", { auth: true }),
    staleTime: 1000 * 30,
    retry: false,
  });
}

export function useBadgeCatalog() {
  return useQuery({
    queryKey: ["gamification", "badges"],
    queryFn: () => gamificationData.badges.fetch() as Promise<BadgeCatalogResponse>,
    staleTime: 1000 * 30,
    retry: false,
  });
}

export function useLeaderboard(limit = 20) {
  return useQuery({
    queryKey: ["leaderboard", limit],
    queryFn: () => gamificationData.leaderboard.fetch(limit).then((results) => ({ results })),
    staleTime: 1000 * 60,
  });
}

export function usePointHistory(limit = 120) {
  return useQuery({
    queryKey: ["gamification", "history", limit],
    queryFn: () =>
      apiFetch<{ results: PointHistoryEvent[]; total: number }>(
        `/gamification/history/?limit=${limit}`,
        { auth: true },
      ),
    staleTime: 1000 * 60,
    retry: false,
  });
}

export function useRecordEvent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: {
      event_type: string;
      points?: number;
      object_id?: string;
      idempotency_key: string;
      metadata?: Record<string, unknown>;
    }) =>
      apiFetch<GamificationState>("/gamification/events/", {
        method: "POST",
        auth: true,
        body: JSON.stringify(body),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gamification"] });
    },
  });
}

export function useChallenges() {
  return useQuery({
    queryKey: ["challenges"],
    queryFn: () => gamificationData.challenges.fetch() as Promise<ApiListResponse<ChallengeData>>,
    staleTime: 1000 * 60 * 5,
  });
}

export function useSubmitChallenge() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (challengeId: string) =>
      apiFetch<{ points_awarded: number }>(`/gamification/challenges/${challengeId}/submit/`, {
        method: "POST",
        auth: true,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["challenges"] });
      queryClient.invalidateQueries({ queryKey: ["gamification"] });
    },
  });
}

export function useCertificates() {
  return useQuery({
    queryKey: ["certificates"],
    queryFn: () => gamificationData.certificates.fetch() as Promise<ApiListResponse<CertificateData>>,
    staleTime: 1000 * 60 * 5,
  });
}

export function useIssueCertificate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (civicModuleId: string) =>
      apiFetch<CertificateData>("/gamification/certificates/issue/", {
        method: "POST",
        auth: true,
        body: JSON.stringify({ civic_module_id: civicModuleId }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["certificates"] });
    },
  });
}

export function useReferralMe() {
  return useQuery({
    queryKey: ["referral", "me"],
    queryFn: () => gamificationData.referral.fetch() as Promise<ReferralData>,
    staleTime: 1000 * 60 * 5,
  });
}

export function useClaimReferral() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (referralCode: string) =>
      apiFetch<{ referrer_points: number }>("/gamification/referrals/claim/", {
        method: "POST",
        auth: true,
        body: JSON.stringify({ referral_code: referralCode }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gamification"] });
    },
  });
}
