import { NextResponse } from "next/server";

import { API_BASE_URL } from "@/lib/api-config";
import { extractApiErrorMessage } from "@/lib/api-errors";

export async function POST(request: Request) {
  const endpoint = `${API_BASE_URL}/api/auth/login/`;
  try {
    const body = await request.json();

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(body),
      cache: "no-store",
      signal: AbortSignal.timeout(10000),
    });

    const payload = await response.json().catch(() => ({}));

    if (!response.ok) {
      return NextResponse.json(
        { message: extractApiErrorMessage(payload, "Login failed.") },
        { status: response.status },
      );
    }

    const accessToken = payload?.access ?? payload?.token ?? payload?.key;
    const refreshToken = payload?.refresh;

    if (!accessToken) {
      return NextResponse.json(
        { message: "Login response missing access token." },
        { status: 502 },
      );
    }

    const out = NextResponse.json({ ok: true });
    out.cookies.set("bns_admin_session", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60,
    });
    if (refreshToken) {
      out.cookies.set("bns_admin_refresh", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
      });
    }
    return out;
  } catch (error) {
    const detail = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      {
        message: "Could not complete login.",
        detail,
        endpoint,
        hint: "Ensure Django API is running and DJANGO_AUTH_LOGIN_URL is reachable from Next.js server.",
      },
      { status: 500 },
    );
  }
}
