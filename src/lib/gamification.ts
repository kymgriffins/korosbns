import { getAccessToken } from "@/lib/api-client";
import { resolveAppUrl } from "@/lib/api-url";

const GAMIFICATION_ID_STORAGE_KEY = "bns_gamification_id";

export type GamificationState = {
  points: number;
  level: number;
  streak_days: number;
  badges?: Array<{ slug: string; name: string; description?: string; icon?: string }>;
};

export function getGamificationDeviceId(): string {
  if (typeof window === "undefined") return "";
  const existing = window.localStorage.getItem(GAMIFICATION_ID_STORAGE_KEY);
  if (existing) return existing;
  const generated = `device-${crypto.randomUUID()}`;
  window.localStorage.setItem(GAMIFICATION_ID_STORAGE_KEY, generated);
  return generated;
}

export function gamificationHeaders(): HeadersInit {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "X-Gamification-Id": getGamificationDeviceId(),
  };
  const token = getAccessToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  return headers;
}

export async function fetchGamificationMe(): Promise<GamificationState | null> {
  try {
    const res = await fetch(resolveAppUrl("/api/gamification/me/"), {
      headers: gamificationHeaders(),
    });
    if (!res.ok) return null;
    return (await res.json()) as GamificationState;
  } catch {
    return null;
  }
}

export async function postGamificationEvent(body: {
  event_type: string;
  points?: number;
  object_id?: string;
  idempotency_key: string;
  metadata?: Record<string, unknown>;
}): Promise<GamificationState | null> {
  try {
    const res = await fetch(resolveAppUrl("/api/gamification/events/"), {
      method: "POST",
      headers: gamificationHeaders(),
      body: JSON.stringify(body),
    });
    if (!res.ok) return null;
    return (await res.json()) as GamificationState;
  } catch {
    return null;
  }
}

export type LeaderboardRow = {
  rank: number;
  name: string | null;
  points: number;
  level: number;
  streak_days: number;
  badge_count: number;
};

export async function fetchLeaderboard(limit = 20): Promise<LeaderboardRow[]> {
  try {
    const res = await fetch(resolveAppUrl(`/api/gamification/leaderboard/?limit=${limit}`), {
      headers: gamificationHeaders(),
    });
    if (!res.ok) return [];
    const data = (await res.json()) as { results: LeaderboardRow[] };
    return data.results ?? [];
  } catch {
    return [];
  }
}

export type ChallengeData = {
  id: string;
  title: string;
  description?: string;
  challenge_type: string;
  status?: string;
  points_reward: number;
  badge_reward_slug?: string | null;
  badge_reward_name?: string | null;
  is_completed?: boolean;
  starts_at: string;
  ends_at: string;
};

export type CertificateData = {
  id: string;
  civic_module_id: string;
  civic_module_title: string;
  civic_module_slug: string;
  issued_at: string;
  certificate_url: string;
};

export async function fetchChallenges(): Promise<ChallengeData[]> {
  try {
    const res = await fetch(resolveAppUrl("/api/gamification/challenges/"), {
      headers: gamificationHeaders(),
    });
    if (!res.ok) return [];
    const data = (await res.json()) as { results: ChallengeData[] };
    return data.results ?? [];
  } catch {
    return [];
  }
}

export async function submitChallenge(challengeId: string): Promise<{ points_awarded: number } | null> {
  try {
    const res = await fetch(resolveAppUrl(`/api/gamification/challenges/${challengeId}/submit/`), {
      method: "POST",
      headers: gamificationHeaders(),
      body: JSON.stringify({ idempotency_key: `challenge_submit:${challengeId}:${getGamificationDeviceId()}` }),
    });
    if (!res.ok) return null;
    return (await res.json()) as { points_awarded: number };
  } catch {
    return null;
  }
}

export async function fetchCertificates(): Promise<CertificateData[]> {
  try {
    const res = await fetch(resolveAppUrl("/api/gamification/certificates/"), {
      headers: gamificationHeaders(),
    });
    if (!res.ok) return [];
    const data = (await res.json()) as { results: CertificateData[] };
    return data.results ?? [];
  } catch {
    return [];
  }
}

export async function issueCertificate(civicModuleId: string): Promise<CertificateData | null> {
  try {
    const res = await fetch(resolveAppUrl("/api/gamification/certificates/issue/"), {
      method: "POST",
      headers: gamificationHeaders(),
      body: JSON.stringify({ civic_module_id: civicModuleId }),
    });
    if (!res.ok) return null;
    return (await res.json()) as CertificateData;
  } catch {
    return null;
  }
}

export async function trackAnalytics(
  eventName: string,
  payload?: Record<string, unknown>,
): Promise<void> {
  try {
    await fetch(resolveAppUrl("/api/analytics/events/"), {
      method: "POST",
      headers: gamificationHeaders(),
      body: JSON.stringify({ event_name: eventName, payload: payload ?? {} }),
    });
  } catch {
    /* optional */
  }
}
