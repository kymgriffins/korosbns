import { NextResponse } from "next/server";

import { getAuthHeaders, refreshAccessIfNeeded } from "@/lib/server/django-auth";
import { API_BASE_URL } from "@/lib/api-config";

const ENDPOINT = `${API_BASE_URL}/api/auth/change-password/`;

const setSessionCookie = (response: NextResponse, access: string) => {
  response.cookies.set("bns_admin_session", access, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60,
  });
};

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const { headers } = await getAuthHeaders();

    let response = await fetch(ENDPOINT, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
      cache: "no-store",
    });

    let refreshed: string | undefined | null = null;
    if (response.status === 401) {
      refreshed = await refreshAccessIfNeeded(401);
      if (refreshed) {
        response = await fetch(ENDPOINT, {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${refreshed}`,
          },
          body: JSON.stringify(body),
          cache: "no-store",
        });
      }
    }

    const payload = await response.json().catch(() => ({}));
    const out = NextResponse.json(payload, { status: response.status });
    if (refreshed) {
      setSessionCookie(out, refreshed);
    }
    return out;
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Password request failed" },
      { status: 500 }
    );
  }
}
