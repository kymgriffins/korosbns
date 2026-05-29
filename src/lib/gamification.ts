import { apiFetch } from "@/lib/api-client";
import type { ApiListResponse } from "@/types/api";
import type { GamificationState, LeaderboardEntry, ChallengeData, ReferralData } from "@/types/gamification";
import type { CertificateData } from "@/types/learn";

export type { GamificationState, LeaderboardEntry, ChallengeData, CertificateData, ReferralData };

export function fetchGamificationMe(): Promise<GamificationState | null> {
  return apiFetch<GamificationState>("/gamification/me/").catch(() => null);
}

export function postGamificationEvent(body: {
  event_type: string;
  points?: number;
  object_id?: string;
  idempotency_key: string;
  metadata?: Record<string, unknown>;
}): Promise<GamificationState | null> {
  return apiFetch<GamificationState>("/gamification/events/", {
    method: "POST",
    body: JSON.stringify(body),
  }).catch(() => null);
}

export function fetchLeaderboard(limit = 20): Promise<LeaderboardEntry[]> {
  return apiFetch<ApiListResponse<LeaderboardEntry>>(`/gamification/leaderboard/?limit=${limit}`)
    .then((res) => res.results ?? [])
    .catch(() => []);
}

export function fetchChallenges(): Promise<ChallengeData[]> {
  return apiFetch<ApiListResponse<ChallengeData>>("/gamification/challenges/")
    .then((res) => res.results ?? [])
    .catch(() => []);
}

export function submitChallenge(challengeId: string): Promise<{ points_awarded: number } | null> {
  return apiFetch<{ points_awarded: number }>(`/gamification/challenges/${challengeId}/submit/`, {
    method: "POST",
  }).catch(() => null);
}

export function fetchCertificates(): Promise<CertificateData[]> {
  return apiFetch<ApiListResponse<CertificateData>>("/gamification/certificates/")
    .then((res) => res.results ?? [])
    .catch(() => []);
}

export function issueCertificate(civicModuleId: string): Promise<CertificateData | null> {
  return apiFetch<CertificateData>("/gamification/certificates/issue/", {
    method: "POST",
    body: JSON.stringify({ civic_module_id: civicModuleId }),
  }).catch(() => null);
}

export function trackAnalytics(
  eventName: string,
  payload?: Record<string, unknown>,
): Promise<void> {
  return apiFetch<void>("/analytics/events/", {
    method: "POST",
    body: JSON.stringify({ event_name: eventName, payload: payload ?? {} }),
  }).catch(() => undefined);
}
