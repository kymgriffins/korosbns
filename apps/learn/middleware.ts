import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const DEVICE_COOKIE = "bns_gid";

export function middleware(request: NextRequest) {
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
