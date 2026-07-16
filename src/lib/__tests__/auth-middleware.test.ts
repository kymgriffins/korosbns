import { describe, it, expect } from "vitest";
import { evaluateAuthMiddleware } from "@/lib/auth-middleware";
import { DEFAULT_POST_LOGIN_PATH } from "@/lib/auth-policy";

describe("evaluateAuthMiddleware — public learn routes", () => {
  it("allows unauthenticated users on /learn/account (protected client-side, not middleware)", () => {
    expect(evaluateAuthMiddleware("/learn/account", null)).toEqual({ action: "next" });
  });

  it("allows unauthenticated users on /learn/quests (protected client-side, not middleware)", () => {
    expect(evaluateAuthMiddleware("/learn/quests", null)).toEqual({ action: "next" });
  });

  it("allows authenticated users on all learn paths", () => {
    expect(evaluateAuthMiddleware("/learn/account", "valid-token")).toEqual({ action: "next" });
    expect(evaluateAuthMiddleware("/learn/quests", "valid-token")).toEqual({ action: "next" });
  });

  it("allows unauthenticated users on all learn paths", () => {
    for (const path of ["/learn", "/learn/forum", "/learn/profile", "/learn/videos"]) {
      expect(evaluateAuthMiddleware(path, null), path).toEqual({ action: "next" });
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
  const publicPaths = ["/", "/about", "/learn", "/learn/account", "/learn/quests", "/events"];

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
