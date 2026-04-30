import { NextResponse } from "next/server";
import { getAuthHeaders, refreshAccessIfNeeded } from "@/lib/server/django-auth";
import { API_BASE_URL } from "@/lib/api-config";

const API_BASE = API_BASE_URL;
const endpoint = (memberId: string) => `${API_BASE}/api/admin/workflows/memberships/${memberId}/`;

async function withRetry(url: string, method: string, body?: unknown) {
  const { headers } = await getAuthHeaders();
  let response = await fetch(url, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
    cache: "no-store",
  });
  let refreshed: string | undefined | null;
  if (response.status === 401) {
    refreshed = await refreshAccessIfNeeded(response.status);
    if (refreshed) {
      response = await fetch(url, {
        method,
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${refreshed}`,
        },
        body: body ? JSON.stringify(body) : undefined,
        cache: "no-store",
      });
    }
  }
  const payload = await response.json().catch(() => ({}));
  const out = NextResponse.json(payload, { status: response.status });
  if (refreshed) {
    out.cookies.set("bns_admin_session", refreshed, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60,
    });
  }
  return out;
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ memberId: string }> }
) {
  const { memberId } = await params;
  const body = await request.json();
  return withRetry(endpoint(memberId), "PATCH", body);
}
