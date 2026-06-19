import { describe, it, expect } from "vitest";
import {
  DEFAULT_POST_LOGIN_PATH,
  buildLoginUrl,
  isAuthPage,
  isLearnProtectedPath,
  sanitizeRedirectPath,
  shouldRedirectAuthPageWhenToken,
} from "@/lib/auth-policy";

describe("sanitizeRedirectPath — open redirect hardening", () => {
  const fallback = DEFAULT_POST_LOGIN_PATH;

  it("returns fallback for nullish and empty values", () => {
    expect(sanitizeRedirectPath(null)).toBe(fallback);
    expect(sanitizeRedirectPath(undefined)).toBe(fallback);
    expect(sanitizeRedirectPath("")).toBe(fallback);
    expect(sanitizeRedirectPath("   ")).toBe(fallback);
  });

  it("allows safe internal paths", () => {
    expect(sanitizeRedirectPath("/learn")).toBe("/learn");
    expect(sanitizeRedirectPath("/learn/account")).toBe("/learn/account");
    expect(sanitizeRedirectPath("/learn/forum?tab=1")).toBe("/learn/forum?tab=1");
    expect(sanitizeRedirectPath("/auth/login?next=%2Flearn")).toBe("/auth/login?next=%2Flearn");
  });

  it("blocks absolute and protocol-relative URLs", () => {
    expect(sanitizeRedirectPath("https://evil.com")).toBe(fallback);
    expect(sanitizeRedirectPath("//evil.com")).toBe(fallback);
    expect(sanitizeRedirectPath("//evil.com/phish")).toBe(fallback);
    expect(sanitizeRedirectPath("/\\evil.com")).toBe(fallback);
  });

  it("blocks scheme tricks and encoded bypasses", () => {
    expect(sanitizeRedirectPath("javascript:alert(1)")).toBe(fallback);
    expect(sanitizeRedirectPath("/javascript:alert(1)")).toBe(fallback);
    expect(sanitizeRedirectPath("%2F%2Fevil.com")).toBe(fallback);
    expect(sanitizeRedirectPath("/%2F%2Fevil.com")).toBe(fallback);
    expect(sanitizeRedirectPath("/http://evil.com")).toBe(fallback);
    expect(sanitizeRedirectPath("/https://evil.com")).toBe(fallback);
  });

  it("blocks credential and null-byte injection", () => {
    expect(sanitizeRedirectPath("/user@evil.com")).toBe(fallback);
    expect(sanitizeRedirectPath("/learn\0/account")).toBe(fallback);
  });

  it("preserves custom fallback", () => {
    expect(sanitizeRedirectPath("//evil.com", "/about")).toBe("/about");
  });

  it("stress: rejects a large set of malicious payloads", () => {
    const malicious = [
      "https://evil.com",
      "//evil.com",
      "///evil.com",
      "/%09/evil.com",
      "/%5cevil.com",
      "/%0d%0aLocation:%20https://evil.com",
      "http://evil.com",
      "HTTPS://EVIL.COM",
      "/\\//evil.com",
      "/%252f%252fevil.com",
      "data:text/html,<script>alert(1)</script>",
      "/learn/../../../etc/passwd",
    ];

    for (const payload of malicious) {
      const result = sanitizeRedirectPath(payload);
      expect(result, `expected fallback for ${JSON.stringify(payload)}`).toBe(fallback);
    }
  });
});

describe("route policy helpers", () => {
  it("identifies learn protected paths", () => {
    expect(isLearnProtectedPath("/account")).toBe(true);
    expect(isLearnProtectedPath("/account/password")).toBe(true);
    expect(isLearnProtectedPath("/quests")).toBe(true);
    expect(isLearnProtectedPath("/quests/abc")).toBe(true);
    expect(isLearnProtectedPath("/")).toBe(false);
    expect(isLearnProtectedPath("/forum")).toBe(false);
    expect(isLearnProtectedPath("/profile")).toBe(false);
    expect(isLearnProtectedPath("/users/123")).toBe(false);
  });

  it("identifies auth pages", () => {
    expect(isAuthPage("/auth/login")).toBe(true);
    expect(isAuthPage("/auth/register")).toBe(true);
    expect(isAuthPage("/auth/verify")).toBe(true);
    expect(isAuthPage("/auth/reset")).toBe(true);
    expect(isAuthPage("/learn")).toBe(false);
  });

  it("only redirects login/register when token present", () => {
    expect(shouldRedirectAuthPageWhenToken("/auth/login")).toBe(true);
    expect(shouldRedirectAuthPageWhenToken("/auth/register")).toBe(true);
    expect(shouldRedirectAuthPageWhenToken("/auth/verify")).toBe(false);
    expect(shouldRedirectAuthPageWhenToken("/auth/reset")).toBe(false);
  });

  it("buildLoginUrl encodes pathname", () => {
    expect(buildLoginUrl("/account")).toBe("/auth/login?next=%2Faccount");
  });
});
