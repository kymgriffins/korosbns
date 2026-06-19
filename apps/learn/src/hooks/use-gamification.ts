import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api-client";
import type { GamificationState, LeaderboardEntry, ChallengeData, ReferralData, BadgeCatalogResponse } from "@/types/gamification";
import type { CertificateData } from "@/types/learn";
import type { ApiListResponse } from "@/types/api";

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
    queryFn: () => apiFetch<BadgeCatalogResponse>("/gamification/badges/"),
    staleTime: 1000 * 30,
    retry: false,
  });
}

export function useLeaderboard(limit = 20) {
  return useQuery({
    queryKey: ["leaderboard", limit],
    queryFn: () => apiFetch<ApiListResponse<LeaderboardEntry>>(`/gamification/leaderboard/?limit=${limit}`),
    staleTime: 1000 * 60,
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
    queryFn: () => apiFetch<ApiListResponse<ChallengeData>>("/gamification/challenges/"),
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
    queryFn: () => apiFetch<ApiListResponse<CertificateData>>("/gamification/certificates/", { auth: true }),
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
    queryFn: () => apiFetch<ReferralData>("/gamification/referrals/me/", { auth: true }),
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
