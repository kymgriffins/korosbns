import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const DEFAULT_LOGOUT_ENDPOINT = `${process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://127.0.0.1:8000"}/api/auth/logout/`;

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
