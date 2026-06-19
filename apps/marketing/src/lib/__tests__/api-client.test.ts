import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  getAccessToken,
  getRefreshToken,
  setAuthTokens,
  clearAuthTokens,
  isAuthenticated,
  getTokenStorageMode,
  citizenApi,
} from "@/lib/api-client";

const ACCESS_KEY = "access_token";
const REFRESH_KEY = "refresh_token";
const STORAGE_MODE_KEY = "bns_token_storage_mode";

function mockSessionStorage(): Record<string, string> {
  const store: Record<string, string> = {};
  return store;
}

beforeEach(() => {
  vi.stubGlobal("window", {
    ...window,
    sessionStorage: {
      getItem: vi.fn((key: string) => null),
      setItem: vi.fn(),
      removeItem: vi.fn(),
    },
    localStorage: {
      getItem: vi.fn((key: string) => null),
      setItem: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn(),
    },
  });
});

describe("getAccessToken", () => {
  it("returns null when no token exists", () => {
    expect(getAccessToken()).toBeNull();
  });

  it("returns token from sessionStorage when present", () => {
    vi.mocked(window.sessionStorage.getItem).mockImplementation((key: string) => {
      if (key === ACCESS_KEY) return "test-access-token";
      return null;
    });
    expect(getAccessToken()).toBe("test-access-token");
  });

  it("migrates legacy token from localStorage to sessionStorage", () => {
    vi.mocked(window.sessionStorage.getItem).mockImplementation(() => null);
    vi.mocked(window.localStorage.getItem).mockImplementation((key: string) => {
      if (key === ACCESS_KEY) return "legacy-token";
      if (key === STORAGE_MODE_KEY) return "legacy";
      return null;
    });
    const token = getAccessToken();
    expect(token).toBe("legacy-token");
    expect(window.sessionStorage.setItem).toHaveBeenCalledWith(ACCESS_KEY, "legacy-token");
    expect(window.localStorage.removeItem).toHaveBeenCalledWith(ACCESS_KEY);
    expect(window.localStorage.setItem).toHaveBeenCalledWith(STORAGE_MODE_KEY, "hybrid");
  });
});

describe("setAuthTokens / clearAuthTokens", () => {
  it("stores access and refresh tokens", () => {
    setAuthTokens("access-123", "refresh-456");
    expect(window.sessionStorage.setItem).toHaveBeenCalledWith(ACCESS_KEY, "access-123");
    expect(window.localStorage.setItem).toHaveBeenCalledWith(STORAGE_MODE_KEY, "hybrid");
    expect(window.localStorage.setItem).toHaveBeenCalledWith(REFRESH_KEY, "refresh-456");
  });

  it("clears all tokens", () => {
    clearAuthTokens();
    expect(window.sessionStorage.removeItem).toHaveBeenCalledWith(ACCESS_KEY);
    expect(window.localStorage.removeItem).toHaveBeenCalledWith(ACCESS_KEY);
    expect(window.localStorage.removeItem).toHaveBeenCalledWith(REFRESH_KEY);
    expect(window.localStorage.removeItem).toHaveBeenCalledWith(STORAGE_MODE_KEY);
  });
});

describe("isAuthenticated", () => {
  it("returns false when no token", () => {
    expect(isAuthenticated()).toBe(false);
  });

  it("returns true when token exists", () => {
    vi.mocked(window.sessionStorage.getItem).mockImplementation((key: string) => {
      if (key === ACCESS_KEY) return "some-token";
      return null;
    });
    expect(isAuthenticated()).toBe(true);
  });
});

describe("getTokenStorageMode", () => {
  it("defaults to hybrid", () => {
    expect(getTokenStorageMode()).toBe("hybrid");
  });

  it("returns legacy when set", () => {
    vi.mocked(window.localStorage.getItem).mockImplementation((key: string) => {
      if (key === STORAGE_MODE_KEY) return "legacy";
      return null;
    });
    expect(getTokenStorageMode()).toBe("legacy");
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
        json: () => Promise.resolve({ access: "access-token", refresh: "refresh-token" }),
      });
      vi.stubGlobal("fetch", mockFetch);

      const result = await citizenApi.login("user@test.com", "StrongPass123!");
      expect(mockFetch).toHaveBeenCalledTimes(1);
      const callUrl = mockFetch.mock.calls[0][0];
      expect(callUrl.toString()).toContain("/auth/login/");
      const body = JSON.parse(mockFetch.mock.calls[0][1].body);
      expect(body.email).toBe("user@test.com");
      expect(result.access).toBe("access-token");
    });
  });

  describe("changePassword", () => {
    it("calls apiFetch with auth and correct body", async () => {
      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ detail: "Password changed successfully." }),
      });
      vi.stubGlobal("fetch", mockFetch);
      vi.mocked(window.sessionStorage.getItem).mockImplementation((key: string) => {
        if (key === ACCESS_KEY) return "valid-token";
        return null;
      });

      const result = await citizenApi.changePassword("oldPass1!", "newPass123!");

      expect(mockFetch).toHaveBeenCalledTimes(1);
      const callUrl = mockFetch.mock.calls[0][0];
      expect(callUrl.toString()).toContain("/auth/password/change/");
      expect(mockFetch.mock.calls[0][1].headers?.Authorization || mockFetch.mock.calls[0][1].headers?.get?.("Authorization")).toBeDefined();
      const body = JSON.parse(mockFetch.mock.calls[0][1].body);
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
    it("sends onboarding fields to backend", async () => {
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
      vi.mocked(window.sessionStorage.getItem).mockImplementation((key: string) => {
        if (key === ACCESS_KEY) return "valid-token";
        return null;
      });

      const result = await citizenApi.patchMe({
        county: "Nairobi",
        ward: "Westlands",
        budget_priorities: ["health", "education"],
      });

      expect(mockFetch).toHaveBeenCalledTimes(1);
      const callUrl = mockFetch.mock.calls[0][0];
      expect(callUrl.toString()).toContain("/users/me/");
      expect(mockFetch.mock.calls[0][1].method || mockFetch.mock.calls[0][1].method).toBe("PATCH");
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
    it("fetches authenticated user profile", async () => {
      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ email: "user@test.com", county: "Nairobi" }),
      });
      vi.stubGlobal("fetch", mockFetch);
      vi.mocked(window.sessionStorage.getItem).mockImplementation((key: string) => {
        if (key === ACCESS_KEY) return "valid-token";
        return null;
      });

      const result = await citizenApi.getMe();
      expect(mockFetch).toHaveBeenCalledTimes(1);
      expect(result.email).toBe("user@test.com");
      expect(result.county).toBe("Nairobi");
    });
  });
});
