import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { apiFetch, clearAuthTokens } from "@/lib/api-client";

const mockFetch = vi.fn();
vi.stubGlobal("fetch", mockFetch);

// Set document.cookie for hasSession() checks
Object.defineProperty(document, "cookie", {
  writable: true,
  value: "",
});

// buildApiUrl resolves to /api/v1/{path} when API_BASE_URL is "" (browser default)
const REFRESH_PATH = "/api/v1/auth/token/refresh/";
const USER_ME_PATH = "/api/v1/users/me/";

describe("apiFetch — concurrent token refresh queuing", () => {
  beforeEach(() => {
    mockFetch.mockReset();
    document.cookie = "bns_has_session=true; path=/";
    clearAuthTokens();
  });

  afterEach(() => {
    document.cookie = "bns_has_session=; path=/; max-age=0";
    clearAuthTokens();
  });

  it("buffers concurrent 401s into a single refresh call", async () => {
    let refreshCallCount = 0;

    mockFetch.mockImplementation(async (url: string) => {
      if (url === REFRESH_PATH) {
        refreshCallCount += 1;
        // Simulate successful refresh (new cookies set by server)
        return new Response(JSON.stringify({ detail: "Token refreshed." }), {
          status: 200,
          headers: {
            "Content-Type": "application/json",
            "set-cookie": "bns_at=new-access-token; Path=/; HttpOnly; SameSite=Lax",
          },
        });
      }
      if (url === USER_ME_PATH) {
        // After refresh, all requests should succeed
        if (refreshCallCount >= 1) {
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

    // Only one refresh call should have been made (deduplication)
    expect(refreshCallCount).toBe(1);
    expect(result1).toMatchObject({ email: "test@example.com" });
    expect(result2).toMatchObject({ email: "test@example.com" });
    expect(result3).toMatchObject({ email: "test@example.com" });
  });
});
