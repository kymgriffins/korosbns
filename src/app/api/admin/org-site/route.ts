import { NextResponse } from "next/server";

import { getAuthHeaders, refreshAccessIfNeeded } from "@/lib/server/django-auth";
import { API_BASE_URL } from "@/lib/api-config";

const ENDPOINT = `${API_BASE_URL}/api/admin/organization/site/`;

const setSessionCookie = (response: NextResponse, access: string) => {
  response.cookies.set("bns_admin_session", access, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60,
  });
};

async function proxyRequest(init: RequestInit) {
  const { headers } = await getAuthHeaders();
  let response = await fetch(ENDPOINT, { ...init, headers, cache: "no-store" });

  let refreshed: string | undefined | null = null;
  if (response.status === 401) {
    refreshed = await refreshAccessIfNeeded(401);
    if (refreshed) {
      response = await fetch(ENDPOINT, {
        ...init,
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${refreshed}`,
        },
        cache: "no-store",
      });
    }
  }

  const data = await response.json().catch(() => ({}));
  const out = NextResponse.json(data, { status: response.status });
  if (refreshed) setSessionCookie(out, refreshed);
  return out;
}

export async function GET() {
  try {
    return await proxyRequest({ method: "GET" });
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Failed" },
      { status: 500 },
    );
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    return await proxyRequest({
      method: "PATCH",
      body: JSON.stringify(body),
    });
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Failed" },
      { status: 500 },
    );
  }
}
