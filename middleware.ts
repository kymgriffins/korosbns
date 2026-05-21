import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { env } from "@/env";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const wipRoutes = new Set(["/test", "/test2", "/cafe"]);
  const isWipRoute =
    wipRoutes.has(pathname) || pathname.startsWith("/cafe/");
  if (
    isWipRoute &&
    env.NODE_ENV === "production" &&
    !env.NEXT_PUBLIC_ENABLE_WIP
  ) {
    return NextResponse.rewrite(new URL("/404", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/test/:path*", "/test2/:path*", "/cafe/:path*"],
};
