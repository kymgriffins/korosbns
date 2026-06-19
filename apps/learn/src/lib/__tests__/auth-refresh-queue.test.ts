import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { apiFetch, setAuthTokens, clearAuthTokens, getAccessToken } from "@/lib/api-client";

const mockFetch = vi.fn();
vi.stubGlobal("fetch", mockFetch);

const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, value: string) => { store[key] = value; },
    removeItem: (key: string) => { delete store[key]; },
    clear: () => { store = {}; },
    get length() { return Object.keys(store).length; },
    key: (i: number) => Object.keys(store)[i] ?? null,
  };
})();

Object.defineProperty(globalThis, "localStorage", { value: localStorageMock });
Object.defineProperty(globalThis, "sessionStorage", {
  value: {
    ...localStorageMock,
    key: (i: number) => Object.keys(localStorageMock).sort()[i] ?? null,
  },
});

Object.defineProperty(document, "cookie", {
  writable: true,
  value: "",
});

// buildApiUrl resolves to /api/v1/{path} when API_BASE_URL is "" (browser default)
const REFRESH_PATH = "/api/v1/auth/token/refresh/";
const USER_ME_PATH = "/api/v1/users/me/";

describe("apiFetch — concurrent token refresh queuing", () => {
  beforeEach(() => {
    localStorageMock.clear();
    mockFetch.mockReset();
    setAuthTokens("expired-access-token", "valid-refresh-token");
  });

  afterEach(() => {
    clearAuthTokens();
  });

  it("buffers concurrent 401s into a single refresh call", async () => {
    let refreshCallCount = 0;

    mockFetch.mockImplementation(async (url: string) => {
      if (url === REFRESH_PATH) {
        refreshCallCount += 1;
        return new Response(JSON.stringify({ access: "new-access-token" }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      }
      if (url === USER_ME_PATH) {
        if (getAccessToken() === "new-access-token") {
          return new Response(JSON.stringify({ id: "1", email: "test@example.com" }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          });
        }
        return new Response(JSON.stringify({ detail: "Unauthorized" }), {
          status: 401,
          headers: { "Content-Type": "application/json" },
        });
      }
      return new Response(null, { status: 404 });
    });

    const [result1, result2, result3] = await Promise.all([
      apiFetch("/users/me/", { auth: true }),
      apiFetch("/users/me/", { auth: true }),
      apiFetch("/users/me/", { auth: true }),
    ]);

    expect(refreshCallCount).toBe(1);
    expect(result1).toMatchObject({ email: "test@example.com" });
    expect(result2).toMatchObject({ email: "test@example.com" });
    expect(result3).toMatchObject({ email: "test@example.com" });
  });
});
