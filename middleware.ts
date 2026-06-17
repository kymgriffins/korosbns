import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedPaths = [
  "/learn/account",
  "/learn/forum",
  "/learn/profile",
  "/learn/quests",
];

const authPaths = [
  "/auth/login",
  "/auth/register",
  "/auth/reset",
  "/auth/verify",
];

const DEVICE_COOKIE = "bns_gid";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("access_token")?.value
    ?? request.headers.get("authorization")?.replace("Bearer ", "");

  const isProtected = protectedPaths.some((p) => pathname === p || pathname.startsWith(p + "/"));
  const isAuthPage = authPaths.some((p) => pathname === p || pathname.startsWith(p + "/"));

  if (isProtected && !token) {
    const loginUrl = new URL("/auth/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isAuthPage && token) {
    return NextResponse.redirect(new URL("/learn", request.url));
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
