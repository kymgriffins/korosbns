import { getAccessToken } from "@/lib/api-client";
import { resolveAppUrl } from "@/lib/api-url";

const GAMIFICATION_ID_STORAGE_KEY = "bns_gamification_id";

export type GamificationState = {
  points: number;
  level: number;
  streak_days: number;
  badges?: Array<{ slug: string; name: string; icon?: string }>;
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
