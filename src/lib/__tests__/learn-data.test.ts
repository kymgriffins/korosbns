import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  fetchCivicModulesWithRetry,
} from "@/lib/learn-data";
import { learnHubApi } from "@/lib/learn-hub";

vi.mock("@/lib/learn-hub", () => ({
  learnHubApi: {
    stages: vi.fn(),
  },
}));

beforeEach(() => {
  vi.mocked(learnHubApi.stages).mockReset();
});

describe("fetchCivicModulesWithRetry", () => {
  it("returns results array even when empty", async () => {
    vi.mocked(learnHubApi.stages).mockResolvedValue({ results: [], count: 0 });
    await expect(fetchCivicModulesWithRetry()).resolves.toEqual([]);
  });

  it("retries after transient failure then succeeds", async () => {
    vi.mocked(learnHubApi.stages)
      .mockRejectedValueOnce(new Error("network"))
      .mockResolvedValueOnce({ results: [{ slug: "bps" } as never], count: 1 });

    const results = await fetchCivicModulesWithRetry(2);
    expect(results).toHaveLength(1);
    expect(learnHubApi.stages).toHaveBeenCalledTimes(2);
  });

  it("throws after exhausting retries", async () => {
    vi.mocked(learnHubApi.stages).mockRejectedValue(new Error("down"));
    await expect(fetchCivicModulesWithRetry(2)).rejects.toThrow("down");
  });
});
