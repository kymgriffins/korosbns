import { cookies } from "next/headers";

import { API_BASE_URL } from "@/lib/api-config";

const API_BASE = API_BASE_URL;
const REFRESH_ENDPOINT = process.env.DJANGO_AUTH_REFRESH_URL ?? `${API_BASE}/api/auth/refresh/`;

export async function getAuthHeaders() {
  const cookieStore = await cookies();
  let access = cookieStore.get("bns_admin_session")?.value;
  const refresh = cookieStore.get("bns_admin_refresh")?.value;

  if (!access || !refresh) {
    return { headers: { Accept: "application/json", "Content-Type": "application/json" } as HeadersInit };
  }

  return {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${access}`,
    } as HeadersInit,
  };
}

export async function refreshAccessIfNeeded(status: number) {
  if (status !== 401) return null;
  const cookieStore = await cookies();
  const refresh = cookieStore.get("bns_admin_refresh")?.value;
  if (!refresh) return null;

  const response = await fetch(REFRESH_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ refresh }),
    cache: "no-store",
  });
  if (!response.ok) return null;
  const payload = await response.json().catch(() => ({}));
  return payload?.access as string | undefined;
}
