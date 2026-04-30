import { NextResponse } from "next/server";
import { getAuthHeaders, refreshAccessIfNeeded } from "@/lib/server/django-auth";
import { API_BASE_URL } from "@/lib/api-config";

const API_BASE = API_BASE_URL;
const endpoint = `${API_BASE}/api/audit/`;

function withOrgHeader(base: HeadersInit, orgId?: string | null): HeadersInit {
  if (!orgId) return base;
  return { ...(base as Record<string, string>), "X-Org-ID": orgId };
}

export async function GET(request: Request) {
  const { headers } = await getAuthHeaders();
  const url = new URL(request.url);
  const orgId = url.searchParams.get("orgId");
  let response = await fetch(endpoint, {
    method: "GET",
    headers: withOrgHeader(headers, orgId),
    cache: "no-store",
  });
  let refreshed: string | undefined | null;
  if (response.status === 401) {
    refreshed = await refreshAccessIfNeeded(response.status);
    if (refreshed) {
      response = await fetch(endpoint, {
        method: "GET",
        headers: withOrgHeader(
          { Accept: "application/json", Authorization: `Bearer ${refreshed}` },
          orgId
        ),
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
