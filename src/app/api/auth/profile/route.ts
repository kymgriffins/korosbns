import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://127.0.0.1:8000";
const PROFILE_ENDPOINT = process.env.DJANGO_AUTH_PROFILE_URL ?? `${API_BASE}/api/auth/profile/`;
const REFRESH_ENDPOINT = process.env.DJANGO_AUTH_REFRESH_URL ?? `${API_BASE}/api/auth/refresh/`;

const setAccessCookie = (response: NextResponse, access: string) => {
  response.cookies.set("bns_admin_session", access, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60,
  });
};

export async function GET() {
  const cookieStore = await cookies();
  let access = cookieStore.get("bns_admin_session")?.value;
  const refresh = cookieStore.get("bns_admin_refresh")?.value;

  if (!access) {
    return NextResponse.json({ message: "Unauthenticated" }, { status: 401 });
  }

  const doProfileFetch = (token: string) =>
    fetch(PROFILE_ENDPOINT, {
      method: "GET",
      headers: { Accept: "application/json", Authorization: `Bearer ${token}` },
      cache: "no-store",
    });

  let response = await doProfileFetch(access);
  if (response.status === 401 && refresh) {
    const refreshResponse = await fetch(REFRESH_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ refresh }),
      cache: "no-store",
    });

    if (refreshResponse.ok) {
      const refreshPayload = await refreshResponse.json().catch(() => ({}));
      const nextAccess = refreshPayload?.access as string | undefined;
      if (nextAccess) {
        access = nextAccess;
        response = await doProfileFetch(access);
      }
    }
  }

  if (!response.ok) {
    return NextResponse.json({ message: "Profile request failed" }, { status: response.status });
  }

  const payload = await response.json();
  const out = NextResponse.json(payload, { status: 200 });
  if (access && access !== cookieStore.get("bns_admin_session")?.value) {
    setAccessCookie(out, access);
  }
  return out;
}
