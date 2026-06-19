import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ACCESS_TOKEN_COOKIE } from "@/lib/auth-policy";
import { evaluateAuthMiddleware } from "@/lib/auth-middleware";

const DEVICE_COOKIE = "bns_gid";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token =
    request.cookies.get(ACCESS_TOKEN_COOKIE)?.value ??
    request.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ??
    null;

  const decision = evaluateAuthMiddleware(pathname, token);

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
