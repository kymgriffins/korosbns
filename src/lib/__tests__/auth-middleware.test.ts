import { describe, it, expect } from "vitest";
import { evaluateAuthMiddleware } from "@/lib/auth-middleware";

describe("evaluateAuthMiddleware — protected learn routes", () => {
  it("redirects unauthenticated users from /learn/account to login", () => {
    const result = evaluateAuthMiddleware("/learn/account", null);
    expect(result.action).toBe("redirect");
    if (result.action === "redirect") {
      expect(result.location).toContain("/auth/login");
      expect(result.location).toContain("next=%2Flearn%2Faccount");
    }
  });

  it("redirects unauthenticated users from /learn/account/password", () => {
    const result = evaluateAuthMiddleware("/learn/account/password", null);
    expect(result.action).toBe("redirect");
  });

  it("redirects unauthenticated users from /learn/quests", () => {
    const result = evaluateAuthMiddleware("/learn/quests", null);
    expect(result.action).toBe("redirect");
  });

  it("allows authenticated users on protected paths", () => {
    expect(evaluateAuthMiddleware("/learn/account", "valid-token")).toEqual({ action: "next" });
    expect(evaluateAuthMiddleware("/learn/quests", "valid-token")).toEqual({ action: "next" });
  });

  it("allows unauthenticated users on public learn paths", () => {
    const publicPaths = [
      "/learn",
      "/learn/forum",
      "/learn/profile",
      "/learn/users/abc",
      "/learn/authors/jane",
      "/learn/videos",
      "/learn/documents",
      "/learn/bps-2026",
    ];

    for (const path of publicPaths) {
      expect(evaluateAuthMiddleware(path, null), path).toEqual({ action: "next" });
    }
  });
});

describe("evaluateAuthMiddleware — auth pages", () => {
  it("redirects authenticated users from /auth/login to /learn", () => {
    const result = evaluateAuthMiddleware("/auth/login", "valid-token");
    expect(result).toEqual({ action: "redirect", location: "/learn" });
  });

  it("redirects authenticated users from /auth/register to /learn", () => {
    const result = evaluateAuthMiddleware("/auth/register", "valid-token");
    expect(result).toEqual({ action: "redirect", location: "/learn" });
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
  const protectedPaths = ["/learn/account", "/learn/account/sign-out", "/learn/quests", "/learn/quests/x"];
  const publicPaths = ["/", "/about", "/learn", "/learn/forum", "/learn/profile", "/events"];

  it("every protected path requires token", () => {
    for (const path of protectedPaths) {
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
