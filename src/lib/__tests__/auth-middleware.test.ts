import { describe, it, expect } from "vitest";
import { evaluateAuthMiddleware } from "@/lib/auth-middleware";
import { DEFAULT_POST_LOGIN_PATH } from "@/lib/auth-policy";

describe("evaluateAuthMiddleware — gated routes (/learn, /reports)", () => {
  const gatedPaths = [
    "/learn",
    "/learn/account",
    "/learn/quests",
    "/learn/forum",
    "/learn/profile",
    "/learn/videos",
    "/learnhub",
    "/reports",
  ];

  it("redirects unauthenticated users on gated routes to login", () => {
    for (const path of gatedPaths) {
      const result = evaluateAuthMiddleware(path, null);
      expect(result.action, path).toBe("redirect");
      if (result.action === "redirect") {
        expect(result.location).toContain("/auth/login?next=");
      }
    }
  });

  it("allows authenticated users on gated routes", () => {
    for (const path of gatedPaths) {
      expect(evaluateAuthMiddleware(path, "valid-token")).toEqual({ action: "next" });
    }
  });
});

describe("evaluateAuthMiddleware — auth pages", () => {
  it("redirects authenticated users from /auth/login to DEFAULT_POST_LOGIN_PATH", () => {
    const result = evaluateAuthMiddleware("/auth/login", "valid-token");
    expect(result).toEqual({ action: "redirect", location: DEFAULT_POST_LOGIN_PATH });
  });

  it("redirects authenticated users from /auth/register to DEFAULT_POST_LOGIN_PATH", () => {
    const result = evaluateAuthMiddleware("/auth/register", "valid-token");
    expect(result).toEqual({ action: "redirect", location: DEFAULT_POST_LOGIN_PATH });
  });

  it("allows authenticated users on /auth/verify (email verification)", () => {
    expect(evaluateAuthMiddleware("/auth/verify", "valid-token")).toEqual({ action: "next" });
  });

  it("allows authenticated users on /auth/reset (password reset with stale cookie)", () => {
    expect(evaluateAuthMiddleware("/auth/reset", "valid-token")).toEqual({ action: "next" });
  });

  it("allows unauthenticated users on all auth pages", () => {
    for (const path of ["/auth/login", "/auth/register", "/auth/verify", "/auth/reset"]) {
      expect(evaluateAuthMiddleware(path, null), path).toEqual({ action: "next" });
    }
  });
});

describe("evaluateAuthMiddleware — stress matrix", () => {
  const adminProtectedPaths = ["/admin", "/dashboard", "/dashboard/task"];
  const publicPaths = ["/", "/about", "/events", "/programmes", "/contact"];

  it("every admin path requires token", () => {
    for (const path of adminProtectedPaths) {
      expect(evaluateAuthMiddleware(path, null).action, path).toBe("redirect");
      expect(evaluateAuthMiddleware(path, "token").action, path).toBe("next");
    }
  });

  it("every public path allows anonymous access", () => {
    for (const path of publicPaths) {
      expect(evaluateAuthMiddleware(path, null).action, path).toBe("next");
    }
  });
});

