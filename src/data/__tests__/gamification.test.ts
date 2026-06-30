import { describe, it, expect, vi, beforeEach } from "vitest";
import { apiFetch } from "@/lib/api-client";

vi.mock("@/lib/api-client", () => ({ apiFetch: vi.fn() }));

import { gamificationData } from "@/data/gamification";

beforeEach(() => {
  vi.clearAllMocks();
});

describe("gamificationData badges", () => {
  it("fetch() calls apiFetch and returns badges", async () => {
    const mockData = [{ id: "1", slug: "test-badge", name: "Test Badge" }];
    (apiFetch as any).mockResolvedValue(mockData);
    const result = await gamificationData.badges.fetch();
    expect(apiFetch).toHaveBeenCalledWith("/gamification/badges/");
    expect(result).toEqual(mockData);
  });

  it("fetch() falls back to [] on API error", async () => {
    (apiFetch as any).mockRejectedValue(new Error("fail"));
    const result = await gamificationData.badges.fetch();
    expect(result).toEqual([]);
  });
});

describe("gamificationData challenges", () => {
  it("fetch() calls apiFetch and returns challenges", async () => {
    const mockData = [{ id: "1", title: "Challenge 1" }];
    (apiFetch as any).mockResolvedValue(mockData);
    const result = await gamificationData.challenges.fetch();
    expect(apiFetch).toHaveBeenCalledWith("/gamification/challenges/");
    expect(result).toEqual(mockData);
  });

  it("fetch() falls back to [] on API error", async () => {
    (apiFetch as any).mockRejectedValue(new Error("fail"));
    const result = await gamificationData.challenges.fetch();
    expect(result).toEqual([]);
  });
});

describe("gamificationData certificates", () => {
  it("fetch() calls apiFetch and returns certificates", async () => {
    const mockData = [{ id: "1", title: "Certificate 1" }];
    (apiFetch as any).mockResolvedValue(mockData);
    const result = await gamificationData.certificates.fetch();
    expect(apiFetch).toHaveBeenCalledWith("/gamification/certificates/");
    expect(result).toEqual(mockData);
  });

  it("fetch() falls back to [] on API error", async () => {
    (apiFetch as any).mockRejectedValue(new Error("fail"));
    const result = await gamificationData.certificates.fetch();
    expect(result).toEqual([]);
  });
});

describe("gamificationData referral", () => {
  it("fetch() calls apiFetch and returns referral data", async () => {
    const mockData = { code: "ABC123", count: 42, earnings: 100 };
    (apiFetch as any).mockResolvedValue(mockData);
    const result = await gamificationData.referral.fetch();
    expect(apiFetch).toHaveBeenCalledWith("/gamification/referrals/");
    expect(result).toEqual(mockData);
  });

  it("fetch() falls back to default on API error", async () => {
    (apiFetch as any).mockRejectedValue(new Error("fail"));
    const result = await gamificationData.referral.fetch();
    expect(result).toEqual({ code: "", count: 0, earnings: 0 });
  });
});
