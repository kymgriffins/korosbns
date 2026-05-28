import { describe, it, expect, vi, afterEach } from "vitest";

describe("civic-fallback", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.resetModules();
  });

  it("returns null takeaways when fallback is disabled", async () => {
    vi.stubEnv("NEXT_PUBLIC_CIVIC_FALLBACK", "false");
    vi.stubEnv("NODE_ENV", "production");
    const { getStepTakeaway } = await import("@/lib/civic-fallback");
    expect(getStepTakeaway(1, 1)).toBeNull();
    expect(getStepTakeaway(1, 1, [{ type: "info", title: "API", text: "From CMS" }])).toEqual({
      type: "info",
      title: "API",
      text: "From CMS",
    });
  });

  it("uses legacy takeaways when local fallback is enabled", async () => {
    vi.stubEnv("NEXT_PUBLIC_CIVIC_FALLBACK", "true");
    const { getStepTakeaway } = await import("@/lib/civic-fallback");
    const takeaway = getStepTakeaway(1, 1);
    expect(takeaway?.title).toBe("Key Principle");
  });

  it("does not enable fallback in development unless explicitly opted in", async () => {
    vi.stubEnv("NODE_ENV", "development");
    vi.stubEnv("NEXT_PUBLIC_CIVIC_FALLBACK", "");
    const { USE_LOCAL_CIVIC_FALLBACK, getStepTakeaway } = await import("@/lib/civic-fallback");
    expect(USE_LOCAL_CIVIC_FALLBACK).toBe(false);
    expect(getStepTakeaway(1, 1)).toBeNull();
  });
});
