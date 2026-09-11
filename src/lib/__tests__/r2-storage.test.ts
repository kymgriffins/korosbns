import { describe, expect, it } from "vitest";
import { R2_CONFIG } from "@/lib/r2-storage";

describe("Cloudflare R2 Storage Configuration", () => {
  it("has valid Cloudflare account and bucket defaults", () => {
    expect(R2_CONFIG.accountId).toBe("7ff1ad5f31619e9e1a31b969ed85d05b");
    expect(R2_CONFIG.bucketName).toBe("bns");
    expect(R2_CONFIG.publicDomain).toBe("https://pub-96ce2eba58694b1da7f540033bdaa464.r2.dev");
    expect(R2_CONFIG.accessKeyId.length).toBeGreaterThan(10);
    expect(R2_CONFIG.secretAccessKey.length).toBeGreaterThan(20);
  });
});
