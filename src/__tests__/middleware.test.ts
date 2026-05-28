import { describe, it, expect, vi } from "vitest";

const protectedPaths = ["/account", "/learn/quests"];
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
    return { redirect: "/account" };
  }
  return { next: true };
}

describe("Middleware - protected routes", () => {
  it("redirects unauthenticated users from /account to login", () => {
    const result = middlewareLogic("/account", null);
    expect(result.redirect).toContain("/auth/login");
    expect(result.redirect).toContain("next=%2Faccount");
  });

  it("allows unauthenticated users on /learn/profile", () => {
    const result = middlewareLogic("/learn/profile", null);
    expect(result.next).toBe(true);
  });

  it("redirects unauthenticated users from /learn/quests", () => {
    const result = middlewareLogic("/learn/quests", null);
    expect(result.redirect).toContain("/auth/login");
  });

  it("redirects unauthenticated users from /account/sub-page", () => {
    const result = middlewareLogic("/account/password", null);
    expect(result.redirect).toContain("/auth/login");
  });

  it("allows authenticated users on protected paths", () => {
    const result = middlewareLogic("/account", "valid-token");
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
  it("redirects authenticated users from /auth/login to /account", () => {
    const result = middlewareLogic("/auth/login", "valid-token");
    expect(result.redirect).toBe("/account");
  });

  it("redirects authenticated users from /auth/register", () => {
    const result = middlewareLogic("/auth/register", "valid-token");
    expect(result.redirect).toBe("/account");
  });

  it("redirects authenticated users from /auth/reset?token=xxx", () => {
    const result = middlewareLogic("/auth/reset", "valid-token");
    expect(result.redirect).toBe("/account");
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
