import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import { API_BASE_URL } from "@/lib/api-config";

const API_BASE = API_BASE_URL;
const PROFILE_ENDPOINT = `${API_BASE_URL}/api/auth/profile/`;
const REFRESH_ENDPOINT = `${API_BASE_URL}/api/auth/refresh/`;

const setAccessCookie = (response: NextResponse, access: string) => {
  response.cookies.set("bns_admin_session", access, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60,
  });
};

const doProfileFetch = (token: string) =>
  fetch(PROFILE_ENDPOINT, {
    method: "GET",
    headers: { Accept: "application/json", Authorization: `Bearer ${token}` },
    cache: "no-store",
  });

export async function GET() {
  const cookieStore = await cookies();
  let access = cookieStore.get("bns_admin_session")?.value;
  const refresh = cookieStore.get("bns_admin_refresh")?.value;

  if (!access && refresh) {
    const refreshResponse = await fetch(REFRESH_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ refresh }),
      cache: "no-store",
    });

    if (refreshResponse.ok) {
      const refreshPayload = await refreshResponse.json().catch(() => ({}));
      access = refreshPayload?.access as string | undefined;
    }
  }

  if (!access) {
    return NextResponse.json({ message: "Unauthenticated" }, { status: 401 });
  }

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

const doProfilePatch = (token: string, body: unknown) =>
  fetch(PROFILE_ENDPOINT, {
    method: "PATCH",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
    cache: "no-store",
  });

export async function PATCH(req: Request) {
  const cookieStore = await cookies();
  let access = cookieStore.get("bns_admin_session")?.value;
  const refresh = cookieStore.get("bns_admin_refresh")?.value;

  if (!access && refresh) {
    const refreshResponse = await fetch(REFRESH_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ refresh }),
      cache: "no-store",
    });

    if (refreshResponse.ok) {
      const refreshPayload = await refreshResponse.json().catch(() => ({}));
      access = refreshPayload?.access as string | undefined;
    }
  }

  if (!access) {
    return NextResponse.json({ message: "Unauthenticated" }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));

  let response = await doProfilePatch(access, body);
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
        response = await doProfilePatch(access, body);
      }
    }
  }

  const payload = await response.json().catch(() => ({}));
  const out = NextResponse.json(payload, { status: response.status });
  if (access && access !== cookieStore.get("bns_admin_session")?.value) {
    setAccessCookie(out, access);
  }
  return out;
}
