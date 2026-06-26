import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  getAccessToken,
  getRefreshToken,
  setAuthTokens,
  clearAuthTokens,
  isAuthenticated,
  getTokenStorageMode,
  hasSession,
  citizenApi,
} from "@/lib/api-client";

describe("getAccessToken (deprecated)", () => {
  it("always returns null (tokens are now HttpOnly cookies)", () => {
    expect(getAccessToken()).toBeNull();
  });
});

describe("getRefreshToken (deprecated)", () => {
  it("always returns null (refresh token is now an HttpOnly cookie)", () => {
    expect(getRefreshToken()).toBeNull();
  });
});

describe("setAuthTokens / clearAuthTokens (deprecated)", () => {
  it("setAuthTokens is a no-op but does not throw", () => {
    expect(() => setAuthTokens("access-123", "refresh-456")).not.toThrow();
  });

  it("clearAuthTokens is a no-op but does not throw", () => {
    expect(() => clearAuthTokens()).not.toThrow();
  });
});

describe("isAuthenticated / hasSession", () => {
  beforeEach(() => {
    // Reset document.cookie mock
    Object.defineProperty(document, "cookie", {
      writable: true,
      value: "",
    });
  });

  it("returns false when no session marker cookie", () => {
    document.cookie = "";
    expect(hasSession()).toBe(false);
    expect(isAuthenticated()).toBe(false);
  });

  it("returns true when bns_has_session cookie is set", () => {
    document.cookie = "bns_has_session=true; path=/";
    expect(hasSession()).toBe(true);
    expect(isAuthenticated()).toBe(true);
  });

  it("returns false when bns_has_session is set to false", () => {
    document.cookie = "bns_has_session=false; path=/";
    expect(hasSession()).toBe(false);
  });
});

describe("getTokenStorageMode (deprecated)", () => {
  it("always returns hybrid", () => {
    expect(getTokenStorageMode()).toBe("hybrid");
  });
});

describe("citizenApi", () => {
  describe("register", () => {
    it("calls apiFetch with correct path and body", async () => {
      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ user: { id: "1", email: "a@b.com" }, detail: "ok" }),
      });
      vi.stubGlobal("fetch", mockFetch);

      const result = await citizenApi.register({
        email: " a@b.com ",
        password: "StrongPass123!",
        first_name: "Test",
        last_name: "User",
      });

      expect(mockFetch).toHaveBeenCalledTimes(1);
      const callUrl = mockFetch.mock.calls[0][0];
      expect(callUrl.toString()).toContain("/auth/register/");
      const body = JSON.parse(mockFetch.mock.calls[0][1].body);
      expect(body.email).toBe("a@b.com");
      expect(body.first_name).toBe("Test");
      expect(body.last_name).toBe("User");
      expect(result.user.email).toBe("a@b.com");
    });
  });

  describe("login", () => {
    it("calls apiFetch with email and password", async () => {
      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ detail: "Login successful." }),
        headers: new Headers({
          "set-cookie": "bns_at=token123; Path=/; HttpOnly; SameSite=Lax",
        }),
      });
      vi.stubGlobal("fetch", mockFetch);

      const result = await citizenApi.login("user@test.com", "StrongPass123!");
      expect(mockFetch).toHaveBeenCalledTimes(1);
      const callUrl = mockFetch.mock.calls[0][0];
      expect(callUrl.toString()).toContain("/auth/login/");
      const body = JSON.parse(mockFetch.mock.calls[0][1].body);
      expect(body.email).toBe("user@test.com");
      expect(result.detail).toBe("Login successful.");
    });
  });

  describe("changePassword", () => {
    it("calls apiFetch with auth and correct body", async () => {
      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ detail: "Password changed successfully." }),
      });
      vi.stubGlobal("fetch", mockFetch);

      const result = await citizenApi.changePassword("oldPass1!", "newPass123!");

      expect(mockFetch).toHaveBeenCalledTimes(1);
      const callUrl = mockFetch.mock.calls[0][0];
      expect(callUrl.toString()).toContain("/auth/password/change/");
      // Cookie-based auth: credentials should be 'include'
      const fetchOptions = mockFetch.mock.calls[0][1];
      expect(fetchOptions.credentials).toBe("include");
      const body = JSON.parse(fetchOptions.body);
      expect(body.current_password).toBe("oldPass1!");
      expect(body.new_password).toBe("newPass123!");
      expect(result.detail).toBe("Password changed successfully.");
    });
  });

  describe("resendVerification", () => {
    it("calls apiFetch with email", async () => {
      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ detail: "sent" }),
      });
      vi.stubGlobal("fetch", mockFetch);

      const result = await citizenApi.resendVerification("user@test.com");
      expect(mockFetch).toHaveBeenCalledTimes(1);
      const callUrl = mockFetch.mock.calls[0][0];
      expect(callUrl.toString()).toContain("/auth/verify/resend/");
      const body = JSON.parse(mockFetch.mock.calls[0][1].body);
      expect(body.email).toBe("user@test.com");
      expect(result.detail).toBe("sent");
    });
  });

  describe("patchMe", () => {
    it("sends onboarding fields to backend with credentials:include", async () => {
      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({
          county: "Nairobi",
          ward: "Westlands",
          budget_priorities: ["health", "education"],
          language_preference: "EN",
        }),
      });
      vi.stubGlobal("fetch", mockFetch);

      const result = await citizenApi.patchMe({
        county: "Nairobi",
        ward: "Westlands",
        budget_priorities: ["health", "education"],
      });

      expect(mockFetch).toHaveBeenCalledTimes(1);
      const callUrl = mockFetch.mock.calls[0][0];
      expect(callUrl.toString()).toContain("/users/me/");
      expect(mockFetch.mock.calls[0][1].method).toBe("PATCH");
      // Cookie-based auth: credentials should be 'include'
      expect(mockFetch.mock.calls[0][1].credentials).toBe("include");
      const body = JSON.parse(mockFetch.mock.calls[0][1].body);
      expect(body.county).toBe("Nairobi");
      expect(body.ward).toBe("Westlands");
      expect(result.county).toBe("Nairobi");
    });
  });

  describe("verifyEmail", () => {
    it("calls apiFetch with token", async () => {
      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ detail: "Email verified successfully." }),
      });
      vi.stubGlobal("fetch", mockFetch);

      const result = await citizenApi.verifyEmail("verify-token-123");
      expect(mockFetch).toHaveBeenCalledTimes(1);
      const callUrl = mockFetch.mock.calls[0][0];
      expect(callUrl.toString()).toContain("/auth/verify/");
      const body = JSON.parse(mockFetch.mock.calls[0][1].body);
      expect(body.token).toBe("verify-token-123");
    });
  });

  describe("getMe", () => {
    it("fetches authenticated user profile with credentials:include", async () => {
      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ email: "user@test.com", county: "Nairobi" }),
      });
      vi.stubGlobal("fetch", mockFetch);

      const result = await citizenApi.getMe();
      expect(mockFetch).toHaveBeenCalledTimes(1);
      // Cookie-based auth: credentials should be 'include'
      expect(mockFetch.mock.calls[0][1].credentials).toBe("include");
      expect(result.email).toBe("user@test.com");
      expect(result.county).toBe("Nairobi");
    });
  });

  describe("logout", () => {
    it("calls apiFetch with auth (no body — cookie-based)", async () => {
      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ detail: "Logged out successfully." }),
      });
      vi.stubGlobal("fetch", mockFetch);

      const result = await citizenApi.logout();
      expect(mockFetch).toHaveBeenCalledTimes(1);
      const callUrl = mockFetch.mock.calls[0][0];
      expect(callUrl.toString()).toContain("/auth/logout/");
      // Cookie-based auth: no body needed, refresh token is in cookie
      const fetchOptions = mockFetch.mock.calls[0][1];
      expect(fetchOptions.method).toBe("POST");
      expect(fetchOptions.credentials).toBe("include");
    });
  });
});
