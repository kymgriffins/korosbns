import { describe, expect, it, beforeEach, vi } from "vitest";
import {
  buildReferralShareUrl,
  captureReferralFromUrl,
  getPendingReferralCode,
  storePendingReferralCode,
} from "@/lib/referral";

describe("referral helpers", () => {
  beforeEach(() => {
    vi.stubGlobal("window", {
      localStorage: {
        store: {} as Record<string, string>,
        getItem(key: string) {
          return this.store[key] ?? null;
        },
        setItem(key: string, value: string) {
          this.store[key] = value;
        },
        removeItem(key: string) {
          delete this.store[key];
        },
      },
      location: {
        origin: "https://example.com",
        search: "?ref=ABC123",
      },
    });
  });

  it("stores referral code from URL", () => {
    const code = captureReferralFromUrl();
    expect(code).toBe("ABC123");
    expect(getPendingReferralCode()).toBe("ABC123");
  });

  it("builds share url with referral code", () => {
    storePendingReferralCode("XYZ789");
    const url = buildReferralShareUrl("XYZ789", "/learn");
    expect(url).toContain("ref=XYZ789");
  });
});
