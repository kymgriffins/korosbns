import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ACCESS_TOKEN_COOKIE } from "@/lib/auth-policy";
import { evaluateAuthMiddleware } from "@/lib/auth-middleware";

// CMS-managed redirects — read from the canonical JSON.
// Editors update this file via the /api/cms/redirects endpoint.
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { redirects: cmsRedirects } = require("./src/content/redirects.json") as {
  redirects: Array<{ from: string; to: string; status: number; reason: string }>;
};

const DEVICE_COOKIE = "bns_gid";

function matchRedirect(
  pathname: string,
  redirects: typeof cmsRedirects,
): { to: string; status: number } | null {
  // Strip trailing slash for comparison (trailingSlash: true in next.config)
  const normalized = pathname.replace(/\/+$/, "") || "/";
  for (const r of redirects) {
    const rFrom = r.from.replace(/\/+$/, "") || "/";
    if (normalized === rFrom) {
      return { to: r.to, status: r.status };
    }
  }
  return null;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. CMS-managed redirects (editor-controlled, no build required)
  const redirectMatch = matchRedirect(pathname, cmsRedirects);
  if (redirectMatch) {
    return NextResponse.redirect(
      new URL(redirectMatch.to, request.url),
      { status: redirectMatch.status },
    );
  }

  // 2. Auth-based redirects
  const accessToken = request.cookies.get(ACCESS_TOKEN_COOKIE)?.value ?? null;
  const decision = evaluateAuthMiddleware(pathname, accessToken);

  if (decision.action === "redirect") {
    return NextResponse.redirect(new URL(decision.location, request.url));
  }

  const response = NextResponse.next();
  const existingDeviceId = request.cookies.get(DEVICE_COOKIE)?.value;
  if (!existingDeviceId) {
    const deviceId = crypto.randomUUID();
    response.cookies.set(DEVICE_COOKIE, deviceId, {
      maxAge: 31536000,
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|logo.svg|sitemap.xml|robots.txt).*)",
  ],
};
