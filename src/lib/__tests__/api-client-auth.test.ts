import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const storage = new Map<string, string>();

describe("api-client auth helpers", () => {
  beforeEach(() => {
    storage.clear();
    const mockStorage = {
      getItem: (key: string) => storage.get(key) ?? null,
      setItem: (key: string, value: string) => {
        storage.set(key, value);
      },
      removeItem: (key: string) => {
        storage.delete(key);
      },
      clear: () => {
        storage.clear();
      },
    };
    vi.stubGlobal("window", { localStorage: mockStorage, sessionStorage: mockStorage } as Window & typeof globalThis);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.resetModules();
  });

  it("stores and reads access tokens", async () => {
    const { setAuthTokens, getAccessToken, isAuthenticated, clearAuthTokens } =
      await import("@/lib/api-client");
    expect(isAuthenticated()).toBe(false);
    setAuthTokens("access-abc", "refresh-xyz");
    expect(getAccessToken()).toBe("access-abc");
    expect(isAuthenticated()).toBe(true);
    clearAuthTokens();
    expect(isAuthenticated()).toBe(false);
  });

  it("apiFetch surfaces network failures as Error messages", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new TypeError("Failed to fetch")));
    const { apiFetch } = await import("@/lib/api-client");
    await expect(apiFetch("/engagement/surveys/")).rejects.toThrow(/Unable to reach/);
  });
});
