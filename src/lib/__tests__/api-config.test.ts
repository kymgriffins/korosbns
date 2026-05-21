import { afterEach, describe, expect, it, vi } from "vitest";

describe("api-config", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.resetModules();
  });

  it("uses empty browser base for same-origin proxy on localhost", async () => {
    vi.stubEnv("NEXT_PUBLIC_API_BASE_URL", "https://bnske.budgetndiostory.org");
    vi.stubGlobal("window", {
      location: { hostname: "localhost", origin: "http://localhost:3000" },
    } as Window & typeof globalThis);
    const { API_BASE_URL, SERVER_API_BASE_URL } = await import("@/lib/api-config");
    expect(API_BASE_URL).toBe("");
    expect(SERVER_API_BASE_URL).toBe("https://bnske.budgetndiostory.org");
  });

  it("uses same-origin proxy on production citizen host", async () => {
    vi.stubEnv("NEXT_PUBLIC_API_BASE_URL", "https://bnske.budgetndiostory.org");
    vi.stubGlobal("window", {
      location: {
        hostname: "budgetndiostory.org",
        origin: "https://budgetndiostory.org",
      },
    } as Window & typeof globalThis);
    const { API_BASE_URL } = await import("@/lib/api-config");
    expect(API_BASE_URL).toBe("");
  });

  it("uses server base in browser when target is also localhost", async () => {
    vi.stubEnv("NEXT_PUBLIC_API_BASE_URL", "http://localhost:8000");
    vi.stubGlobal("window", {
      location: { hostname: "localhost" },
    } as Window & typeof globalThis);
    const { API_BASE_URL, SERVER_API_BASE_URL } = await import("@/lib/api-config");
    expect(API_BASE_URL).toBe("http://localhost:8000");
    expect(SERVER_API_BASE_URL).toBe("http://localhost:8000");
  });

  it("defaults server base to production when env unset", async () => {
    vi.stubEnv("NEXT_PUBLIC_API_BASE_URL", "");
    vi.stubGlobal("window", undefined);
    const { SERVER_API_BASE_URL, getApiProxyTarget } = await import("@/lib/api-config");
    expect(SERVER_API_BASE_URL).toBe("https://bnske.budgetndiostory.org");
    expect(getApiProxyTarget()).toBe("https://bnske.budgetndiostory.org");
  });

  it("strips trailing slashes from configured base", async () => {
    vi.stubEnv("NEXT_PUBLIC_API_BASE_URL", "https://bnske.budgetndiostory.org/");
    vi.stubGlobal("window", undefined);
    const { SERVER_API_BASE_URL } = await import("@/lib/api-config");
    expect(SERVER_API_BASE_URL).toBe("https://bnske.budgetndiostory.org");
  });
});
