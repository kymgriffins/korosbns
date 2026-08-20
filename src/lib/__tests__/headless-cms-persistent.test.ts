import { describe, it, expect } from "vitest";
import {
  headlessCmsApi,
  CMS_COLLECTIONS_CATALOG,
  MASTER_CMS_EMAIL,
  type CmsCollectionSlug,
} from "@/lib/headless-cms";

describe("Persistent Headless CMS & JSON Studio Test Suite", () => {
  it("maintains backward-compatible getCollections returning 6 core collections", () => {
    const coreCollections = headlessCmsApi.getCollections();
    expect(coreCollections.length).toBe(6);
    const slugs = coreCollections.map((c) => c.slug);
    expect(slugs).toContain("programmes");
    expect(slugs).toContain("landing");
    expect(slugs).toContain("about");
    expect(slugs).toContain("media");
    expect(slugs).toContain("socials");
    expect(slugs).toContain("timeline");
  });

  it("exposes all 22 registered JSON datasets in getAllCollections", () => {
    const all = headlessCmsApi.getAllCollections();
    expect(all.length).toBe(22);

    const slugs = all.map((c) => c.slug);
    expect(slugs).toContain("org");
    expect(slugs).toContain("counties-allocations");
    expect(slugs).toContain("bns-config");
    expect(slugs).toContain("doc-repository");
    expect(slugs).toContain("budget-fy-episodes");
    expect(slugs).toContain("budget-fy2025-26");
    expect(slugs).toContain("budget-fy2026-27");
    expect(slugs).toContain("civic-modules");
    expect(slugs).toContain("learn-articles");
    expect(slugs).toContain("learn-trivia");
    expect(slugs).toContain("video-transcripts");
  });

  it("ensures all 22 collections have valid file paths, categories and schema keys", () => {
    const all = headlessCmsApi.getAllCollections();

    for (const item of all) {
      expect(item.filePath).toBeDefined();
      expect(item.filePath.endsWith(".json")).toBe(true);
      expect(item.category).toBeDefined();
      expect(item.schemaKeys.length).toBeGreaterThan(0);
      expect(item.name.length).toBeGreaterThan(0);
    }
  });

  it("retrieves valid JSON data for every single collection slug", () => {
    const all = headlessCmsApi.getAllCollections();

    for (const item of all) {
      const data = headlessCmsApi.getCollectionData(item.slug);
      expect(data).toBeDefined();
      expect(typeof data).toBe("object");
    }
  });

  it("allows updating and exporting JSON collection data with disk path metadata", () => {
    const slug: CmsCollectionSlug = "org";
    const currentData = headlessCmsApi.getCollectionData(slug);
    expect(currentData).toBeDefined();

    const res = headlessCmsApi.updateCollectionData(
      slug,
      { ...currentData, _lastEditedBy: "admin@budgetndiostory.org" },
      "admin@budgetndiostory.org",
    );

    expect(res.success).toBe(true);
    expect(res.collection).toBe("org");
    expect(res.filePath).toBe("src/data/org/org.json");

    const exported = headlessCmsApi.exportCollectionJson(slug);
    const parsed = JSON.parse(exported);
    expect(parsed._lastEditedBy).toBe("admin@budgetndiostory.org");
  });

  it("exports a complete bundle of all 22 collections", () => {
    const bundle = headlessCmsApi.exportAllCollectionsJson();
    expect(Object.keys(bundle).length).toBe(22);
    expect(bundle.landing).toBeDefined();
    expect(bundle.org).toBeDefined();
    expect(bundle["bns-config"]).toBeDefined();
  });

  it("rejects unauthorized external emails from editing JSON collections", () => {
    const slug: CmsCollectionSlug = "landing";
    const data = headlessCmsApi.getCollectionData(slug);

    expect(() => {
      headlessCmsApi.updateCollectionData(slug, data, "intruder@external.io");
    }).toThrow(/Permission Denied/i);
  });
});
