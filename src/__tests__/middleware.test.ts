import { describe, it, expect, vi } from "vitest";

const protectedPaths = ["/learn/account", "/learn/profile", "/learn/quests"];
const authPaths = ["/auth/login", "/auth/register", "/auth/reset", "/auth/verify"];

function isProtected(pathname: string): boolean {
  return protectedPaths.some((p) => pathname === p || pathname.startsWith(p + "/"));
}

function isAuthPage(pathname: string): boolean {
  return authPaths.some((p) => pathname === p || pathname.startsWith(p + "/"));
}

function middlewareLogic(pathname: string, token: string | null) {
  const isProtectedRoute = isProtected(pathname);
  const isAuthRoute = isAuthPage(pathname);

  if (isProtectedRoute && !token) {
    return { redirect: `/auth/login?next=${encodeURIComponent(pathname)}` };
  }
  if (isAuthRoute && token) {
    return { redirect: "/learn" };
  }
  return { next: true };
}

describe("Middleware - protected routes", () => {
  it("redirects unauthenticated users from /learn/account to login", () => {
    const result = middlewareLogic("/learn/account", null);
    expect(result.redirect).toContain("/auth/login");
    expect(result.redirect).toContain("next=%2Flearn%2Faccount");
  });

  it("redirects unauthenticated users from /learn/profile", () => {
    const result = middlewareLogic("/learn/profile", null);
    expect(result.redirect).toContain("/auth/login");
  });

  it("redirects unauthenticated users from /learn/quests", () => {
    const result = middlewareLogic("/learn/quests", null);
    expect(result.redirect).toContain("/auth/login");
  });

  it("redirects unauthenticated users from /learn/account/sub-page", () => {
    const result = middlewareLogic("/learn/account/password", null);
    expect(result.redirect).toContain("/auth/login");
  });

  it("allows authenticated users on protected paths", () => {
    const result = middlewareLogic("/learn/account", "valid-token");
    expect(result.next).toBe(true);
  });

  it("allows authenticated users on non-protected paths", () => {
    const result = middlewareLogic("/about", "valid-token");
    expect(result.next).toBe(true);
  });

  it("allows unauthenticated users on public paths", () => {
    const result = middlewareLogic("/about", null);
    expect(result.next).toBe(true);
  });
});

describe("Middleware - auth pages", () => {
  it("redirects authenticated users from /auth/login to /learn", () => {
    const result = middlewareLogic("/auth/login", "valid-token");
    expect(result.redirect).toBe("/learn");
  });

  it("redirects authenticated users from /auth/register", () => {
    const result = middlewareLogic("/auth/register", "valid-token");
    expect(result.redirect).toBe("/learn");
  });

  it("redirects authenticated users from /auth/reset?token=xxx", () => {
    const result = middlewareLogic("/auth/reset", "valid-token");
    expect(result.redirect).toBe("/learn");
  });

  it("allows unauthenticated users on auth pages", () => {
    const result = middlewareLogic("/auth/login", null);
    expect(result.next).toBe(true);
  });

  it("allows unauthenticated users on /auth/verify", () => {
    const result = middlewareLogic("/auth/verify", null);
    expect(result.next).toBe(true);
  });
});
