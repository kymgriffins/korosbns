import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import { API_BASE_URL } from "@/lib/api-config";

const DEFAULT_LOGOUT_ENDPOINT = `${API_BASE_URL}/api/auth/logout/`;

export async function POST() {
  const endpoint = process.env.DJANGO_AUTH_LOGOUT_URL ?? DEFAULT_LOGOUT_ENDPOINT;
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("bns_admin_session")?.value;

  try {
    await fetch(endpoint, {
      method: "POST",
      headers: {
        Accept: "application/json",
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      },
      cache: "no-store",
    });
  } catch {
    // no-op, local session is still cleared
  }

  const out = NextResponse.json({ ok: true });
  out.cookies.set("bns_admin_session", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
  out.cookies.set("bns_admin_refresh", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
  return out;
}
