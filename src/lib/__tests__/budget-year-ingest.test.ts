import { describe, expect, it } from "vitest";
import {
  getYearIngestStub,
  listIngestStubYears,
  portalsForYear,
} from "@/lib/budget-year-ingest";

describe("budget year ingest stubs (P1)", () => {
  it("scaffolds 2013/14–2024/25 as SOURCE_LISTED without metrics", () => {
    const years = listIngestStubYears();
    expect(years[0]).toBe("2013/14");
    expect(years[years.length - 1]).toBe("2024/25");
    expect(years).toHaveLength(12);
    for (const fy of years) {
      const stub = getYearIngestStub(fy);
      expect(stub?.status).toBe("SOURCE_LISTED");
      expect(stub?.seed_available).toBe(false);
    }
  });

  it("returns official portal links for SOURCE_LISTED years", () => {
    const portals = portalsForYear("2024/25");
    expect(portals.length).toBeGreaterThan(0);
    expect(portals.every((p) => p.url.startsWith("https://"))).toBe(true);
    expect(getYearIngestStub("2025/26")).toBeUndefined();
  });
});
