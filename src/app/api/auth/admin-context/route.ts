import { NextResponse } from "next/server";
import { getAuthHeaders, refreshAccessIfNeeded } from "@/lib/server/django-auth";
import { API_BASE_URL } from "@/lib/api-config";

const API_BASE = API_BASE_URL;
const CONTEXT_ENDPOINT =
  process.env.DJANGO_AUTH_ADMIN_CONTEXT_URL ?? `${API_BASE}/api/auth/admin-context/`;

export async function GET() {
  try {
    const { headers } = await getAuthHeaders();
    let response = await fetch(CONTEXT_ENDPOINT, { method: "GET", headers, cache: "no-store" });
    let refreshed: string | undefined | null;
    if (response.status === 401) {
      refreshed = await refreshAccessIfNeeded(response.status);
      if (refreshed) {
        response = await fetch(CONTEXT_ENDPOINT, {
          method: "GET",
          headers: { Accept: "application/json", Authorization: `Bearer ${refreshed}` },
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
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Failed" },
      { status: 500 }
    );
  }
}
