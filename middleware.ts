import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

function isExpiredJwt(token: string): boolean {
  try {
    const parts = token.split(".");
    if (parts.length < 2) return true;
    const payload = parts[1];
    const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
    const padded = normalized + "=".repeat((4 - (normalized.length % 4)) % 4);
    const decoded = atob(padded);
    const parsed = JSON.parse(decoded) as { exp?: number };
    if (!parsed.exp) return false;
    const now = Math.floor(Date.now() / 1000);
    return parsed.exp <= now;
  } catch {
    return true;
  }
}

export function middleware(request: NextRequest) {
  const protectedPrefixes = ["/dashboard.internal", "/admin/dashboard"];
  const isProtected = protectedPrefixes.some((prefix) =>
    request.nextUrl.pathname.startsWith(prefix)
  );

  if (isProtected) {
    const session = request.cookies.get("bns_admin_session")?.value;
    if (!session || isExpiredJwt(session)) {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("reason", "expired");
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard.internal/:path*", "/admin/dashboard/:path*"],
};
