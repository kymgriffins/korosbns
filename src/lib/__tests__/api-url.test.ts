import { afterEach, describe, expect, it, vi } from "vitest";

describe("buildApiUrl", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.resetModules();
  });

  it("builds absolute API paths when target is localhost", async () => {
    vi.stubEnv("NEXT_PUBLIC_API_BASE_URL", "http://localhost:8000");
    vi.stubGlobal("window", {
      location: { hostname: "localhost", origin: "http://localhost:3000" },
    } as Window & typeof globalThis);
    const { buildApiUrl } = await import("@/lib/api-url");
    expect(buildApiUrl("/engagement/surveys/")).toBe(
      "http://localhost:8000/api/v1/engagement/surveys/",
    );
    expect(buildApiUrl("/content/articles/", { status: "published" })).toBe(
      "http://localhost:8000/api/v1/content/articles/?status=published",
    );
  });

  it("builds relative API paths when target is remote production and browser is localhost", async () => {
    vi.stubEnv("NEXT_PUBLIC_API_BASE_URL", "https://bnske.budgetndiostory.org");
    vi.stubGlobal("window", {
      location: { hostname: "localhost", origin: "http://localhost:3000" },
    } as Window & typeof globalThis);
    const { buildApiUrl } = await import("@/lib/api-url");
    expect(buildApiUrl("/engagement/surveys/")).toBe(
      "/api/v1/engagement/surveys/",
    );
    expect(buildApiUrl("/content/articles/", { status: "published" })).toBe(
      "/api/v1/content/articles/?status=published",
    );
  });

  it("builds absolute v1 paths on the server", async () => {
    vi.stubEnv("NEXT_PUBLIC_API_BASE_URL", "https://bnske.budgetndiostory.org");
    vi.stubGlobal("window", undefined);
    const { buildApiUrl } = await import("@/lib/api-url");
    expect(buildApiUrl("/engagement/surveys/")).toBe(
      "https://bnske.budgetndiostory.org/api/v1/engagement/surveys/",
    );
  });

  it("preserves paths that already include /api/v1", async () => {
    vi.stubGlobal("window", undefined);
    vi.stubEnv("NEXT_PUBLIC_API_BASE_URL", "https://bnske.budgetndiostory.org");
    const { buildApiUrl } = await import("@/lib/api-url");
    expect(buildApiUrl("/api/v1/org/config/")).toBe(
      "https://bnske.budgetndiostory.org/api/v1/org/config/",
    );
  });
});

describe("resolveAppUrl", () => {
  it("uses window origin for same-origin API routes in the browser", async () => {
    vi.stubGlobal("window", { location: { origin: "http://localhost:3000" } } as Window);
    const { resolveAppUrl } = await import("@/lib/api-url");
    expect(resolveAppUrl("/api/gamification/me/")).toBe(
      "http://localhost:3000/api/gamification/me/",
    );
  });

  it("uses server base when window is unavailable", async () => {
    vi.stubGlobal("window", undefined);
    vi.stubEnv("NEXT_PUBLIC_API_BASE_URL", "http://localhost:8000");
    vi.resetModules();
    const { resolveAppUrl } = await import("@/lib/api-url");
    expect(resolveAppUrl("/api/youtube")).toBe("http://localhost:8000/api/youtube");
  });
});

describe("networkErrorMessage", () => {
  it("maps fetch failures to a helpful message", async () => {
    const { networkErrorMessage } = await import("@/lib/api-url");
    expect(networkErrorMessage(new TypeError("Failed to fetch"))).toMatch(/Unable to reach/);
    const networkErr = new Error("NetworkError when attempting to fetch resource.");
    networkErr.name = "NetworkError";
    expect(networkErrorMessage(networkErr)).toMatch(/Network error/);
  });
});
