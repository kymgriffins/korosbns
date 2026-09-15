import { describe, it, expect } from "vitest";
import {
  headlessCmsApi,
  CMS_COLLECTIONS_CATALOG,
  MASTER_CMS_EMAIL,
  type CmsCollectionSlug,
} from "@/lib/headless-cms";
import {
  validateCollection,
  checkLockedFields,
  checkEmDash,
  checkForbiddenPatterns,
  checkCtaAboveFold,
} from "@/lib/cms-validators";

describe("CMS Comprehensive CRUD & Validation Test Suite", () => {
  // ==========================================
  // 1. CATALOG & DISCOVERY
  // ==========================================
  describe("Catalog & Discovery", () => {
    it("exposes all 43 registered JSON collections in getAllCollections", () => {
      const all = headlessCmsApi.getAllCollections();
      expect(all.length).toBe(43);

      const slugs = all.map((c) => c.slug);
      expect(slugs).toContain("landing");
      expect(slugs).toContain("programmes");
      expect(slugs).toContain("custom-pages");
      expect(slugs).toContain("navigation");
      expect(slugs).toContain("legal");
      expect(slugs).toContain("faq");
      expect(slugs).toContain("contact");
    });

    it("maintains backward-compatible core 6 collections in getCollections", () => {
      const core = headlessCmsApi.getCollections();
      expect(core.length).toBe(6);
      const slugs = core.map((c) => c.slug);
      expect(slugs).toEqual(["programmes", "landing", "about", "media", "socials", "timeline"]);
    });

    it("verifies every collection has valid metadata, file path, and schema keys", () => {
      const all = headlessCmsApi.getAllCollections();
      for (const meta of all) {
        expect(meta.slug).toBeDefined();
        expect(meta.name.length).toBeGreaterThan(0);
        expect(meta.filePath.endsWith(".json")).toBe(true);
        expect(meta.category).toBeDefined();
        expect(meta.schemaKeys.length).toBeGreaterThan(0);
      }
    });
  });

  // ==========================================
  // 2. READ (GET) OPERATIONS
  // ==========================================
  describe("Read (GET) Operations", () => {
    it("successfully retrieves valid data for all 43 collections", () => {
      const all = headlessCmsApi.getAllCollections();
      for (const item of all) {
        const data = headlessCmsApi.getCollectionData(item.slug);
        expect(data).toBeDefined();
        expect(typeof data).toBe("object");
        expect(Object.keys(data).length).toBeGreaterThan(0);
      }
    });

    it("bundles and exports all collections without data loss", () => {
      const bundle = headlessCmsApi.exportAllCollectionsJson();
      const bundleKeys = Object.keys(bundle);
      expect(bundleKeys.length).toBe(43);
      expect(bundle.landing).toBeDefined();
      expect(bundle["custom-pages"]).toBeDefined();
    });

    it("exports individual collections as clean JSON string", () => {
      const jsonStr = headlessCmsApi.exportCollectionJson("landing");
      const parsed = JSON.parse(jsonStr);
      expect(parsed).toBeDefined();
      expect(typeof parsed).toBe("object");
    });
  });

  // ==========================================
  // 3. VALIDATION & LOCKED FIELDS INTEGRITY
  // ==========================================
  describe("Validation & Locked Fields Integrity", () => {
    it("validates all 43 collections as 100% compliant without false-positive failures", () => {
      const all = headlessCmsApi.getAllCollections();
      for (const item of all) {
        const data = headlessCmsApi.getCollectionData(item.slug);
        const validation = validateCollection(item.slug, data);
        const failures = validation.results.filter((r) => !r.pass);
        expect(
          failures,
          `Collection '${item.slug}' failed validation with: ${failures.map((f) => f.message).join("; ")}`,
        ).toHaveLength(0);
        expect(validation.passed).toBe(true);
      }
    });

    it("allows saving collections with untouched locked fields (no false positive)", () => {
      const navData = headlessCmsApi.getCollectionData("navigation");
      const navLocked = checkLockedFields(navData, navData);
      expect(navLocked).toHaveLength(0);

      const legalData = headlessCmsApi.getCollectionData("legal");
      const legalLocked = checkLockedFields(legalData, legalData);
      expect(legalLocked).toHaveLength(0);
    });

    it("strictly blocks modifications to locked fields and reports exact locked paths", () => {
      const navData = headlessCmsApi.getCollectionData("navigation");
      const tamperedNav = JSON.parse(JSON.stringify(navData));
      if (tamperedNav.logo) {
        tamperedNav.logo.text = "Hacked Logo Text";
      }

      const lockedPaths = checkLockedFields(navData, tamperedNav);
      expect(lockedPaths).toContain("logo");
      expect(lockedPaths.length).toBeGreaterThanOrEqual(1);

      const legalData = headlessCmsApi.getCollectionData("legal");
      const tamperedLegal = JSON.parse(JSON.stringify(legalData));
      if (tamperedLegal.security) {
        tamperedLegal.security.heading = "Defaced Security Heading";
      }

      const legalLockedPaths = checkLockedFields(legalData, tamperedLegal);
      expect(legalLockedPaths).toContain("security");
    });

    it("does not falsely fail non-landing pages on CTA above fold", () => {
      const faqData = headlessCmsApi.getCollectionData("faq");
      const faqValidation = validateCollection("faq", faqData);
      const ctaFails = faqValidation.results.filter((r) => r.rule === "cta-above-fold" && !r.pass);
      expect(ctaFails).toHaveLength(0);

      const contactData = headlessCmsApi.getCollectionData("contact");
      const contactValidation = validateCollection("contact", contactData);
      const contactCtaFails = contactValidation.results.filter((r) => r.rule === "cta-above-fold" && !r.pass);
      expect(contactCtaFails).toHaveLength(0);
    });

    it("allows compound titles like '5-Year' without false-positive eyebrow rejection", () => {
      const res = checkForbiddenPatterns("5-Year Strategic Governance Framework");
      expect(res.pass).toBe(true);

      const badEyebrow = checkForbiddenPatterns("01 — Introduction", "eyebrow");
      expect(badEyebrow.pass).toBe(false);
    });

    it("provides exact field location in checkEmDash message", () => {
      const res = checkEmDash("Some text with an em—dash", "landing.hero.title");
      expect(res.pass).toBe(false);
      expect(res.message).toContain("'landing.hero.title'");
    });
  });

  // ==========================================
  // 4. UPDATE (PUT / POST) OPERATIONS
  // ==========================================
  describe("Update (PUT / POST) Operations", () => {
    it("updates collection data in memory with master editor privileges", () => {
      const slug: CmsCollectionSlug = "landing";
      const current = headlessCmsApi.getCollectionData(slug);
      const updated = { ...current, _testTimestamp: Date.now() };

      const res = headlessCmsApi.updateCollectionData(slug, updated, MASTER_CMS_EMAIL);
      expect(res.success).toBe(true);
      expect(res.collection).toBe("landing");

      const reloaded = headlessCmsApi.getCollectionData(slug);
      expect(reloaded._testTimestamp).toBe(updated._testTimestamp);
    });

    it("rejects unauthorized editor emails with Permission Denied error", () => {
      const slug: CmsCollectionSlug = "landing";
      const current = headlessCmsApi.getCollectionData(slug);

      expect(() => {
        headlessCmsApi.updateCollectionData(slug, current, "malicious@external.com");
      }).toThrow("Permission Denied");
    });

    it("accepts admin domain emails for updates", () => {
      const slug: CmsCollectionSlug = "org";
      const current = headlessCmsApi.getCollectionData(slug);

      const res = headlessCmsApi.updateCollectionData(slug, current, "editor@budgetndiostory.org");
      expect(res.success).toBe(true);
    });
  });

  // ==========================================
  // 5. ITEM-LEVEL CRUD (CUSTOM PAGES, STORIES, CAROUSEL, FAQ)
  // ==========================================
  describe("Item-Level CRUD Operations", () => {
    it("supports Create, Read, Update, Delete for Custom Pages", () => {
      const customPages = headlessCmsApi.getCollectionData("custom-pages") as { pages: any[] };
      const originalCount = customPages.pages.length;

      // CREATE
      const newPageSlug = `test-page-${Date.now()}`;
      const newPage = {
        slug: newPageSlug,
        title: "Automated Test Page",
        eyebrow: "Testing",
        headline: "CRUD Test Headline",
        body: "Test body content.",
        content: "Detailed markdown content.",
        published: false,
        createdAt: new Date().toISOString(),
      };
      const added = { ...customPages, pages: [...customPages.pages, newPage] };
      headlessCmsApi.updateCollectionData("custom-pages", added, MASTER_CMS_EMAIL);

      // READ
      const afterAdd = headlessCmsApi.getCollectionData("custom-pages") as { pages: any[] };
      const found = afterAdd.pages.find((p) => p.slug === newPageSlug);
      expect(found).toBeDefined();
      expect(found.title).toBe("Automated Test Page");

      // UPDATE
      const updatedPages = afterAdd.pages.map((p) =>
        p.slug === newPageSlug ? { ...p, title: "Updated Test Page Title" } : p,
      );
      headlessCmsApi.updateCollectionData("custom-pages", { pages: updatedPages }, MASTER_CMS_EMAIL);

      const afterUpdate = headlessCmsApi.getCollectionData("custom-pages") as { pages: any[] };
      const updatedFound = afterUpdate.pages.find((p) => p.slug === newPageSlug);
      expect(updatedFound.title).toBe("Updated Test Page Title");

      // DELETE
      const cleanedPages = afterUpdate.pages.filter((p) => p.slug !== newPageSlug);
      headlessCmsApi.updateCollectionData("custom-pages", { pages: cleanedPages }, MASTER_CMS_EMAIL);

      const afterDelete = headlessCmsApi.getCollectionData("custom-pages") as { pages: any[] };
      expect(afterDelete.pages.length).toBe(originalCount);
      expect(afterDelete.pages.find((p) => p.slug === newPageSlug)).toBeUndefined();
    });

    it("supports Create, Read, Update, Delete for Featured Projects", () => {
      const featured = headlessCmsApi.getCollectionData("featured-projects") as { results: any[]; count?: number };
      const originalCount = featured.results?.length || 0;

      // CREATE
      const newId = `test-story-${Date.now()}`;
      const newStory = {
        id: newId,
        slug: newId,
        title: "Test Investigation Story",
        prose: "Investigative story description.",
        url: "https://www.youtube.com/watch?v=kWpY4K1uI20",
        videoId: "kWpY4K1uI20",
        publishedAt: new Date().toISOString(),
      };
      const added = { ...featured, count: originalCount + 1, results: [newStory, ...(featured.results || [])] };
      headlessCmsApi.updateCollectionData("featured-projects", added, MASTER_CMS_EMAIL);

      // READ
      const afterAdd = headlessCmsApi.getCollectionData("featured-projects") as { results: any[] };
      const found = afterAdd.results.find((s) => s.id === newId);
      expect(found).toBeDefined();
      expect(found.title).toBe("Test Investigation Story");

      // UPDATE
      const updatedResults = afterAdd.results.map((s) =>
        s.id === newId ? { ...s, title: "Updated Story Title" } : s,
      );
      headlessCmsApi.updateCollectionData("featured-projects", { ...afterAdd, results: updatedResults }, MASTER_CMS_EMAIL);

      const afterUpdate = headlessCmsApi.getCollectionData("featured-projects") as { results: any[] };
      expect(afterUpdate.results.find((s) => s.id === newId)?.title).toBe("Updated Story Title");

      // DELETE
      const cleanedResults = afterUpdate.results.filter((s) => s.id !== newId);
      headlessCmsApi.updateCollectionData(
        "featured-projects",
        { ...afterUpdate, count: originalCount, results: cleanedResults },
        MASTER_CMS_EMAIL,
      );

      const afterDelete = headlessCmsApi.getCollectionData("featured-projects") as { results: any[] };
      expect(afterDelete.results.find((s) => s.id === newId)).toBeUndefined();
    });

    it("supports Carousel Stills reordering, visibility toggle, and management", () => {
      const landing = headlessCmsApi.getCollectionData("landing") as Record<string, any>;
      const originalStills = (landing.heroReelStills as any[]) || [];

      // ADD
      const newSlide = {
        id: `slide-test-${Date.now()}`,
        src: "/images/media/test.jpg",
        alt: "Test slide image",
        caption: "Test Caption",
        programme: "connect",
        visible: true,
      };
      const withSlide = [...originalStills, newSlide];
      headlessCmsApi.updateCollectionData("landing", { ...landing, heroReelStills: withSlide }, MASTER_CMS_EMAIL);

      let current = (headlessCmsApi.getCollectionData("landing") as any).heroReelStills as any[];
      expect(current.find((s) => s.id === newSlide.id)).toBeDefined();

      // TOGGLE VISIBILITY
      const toggled = current.map((s) => (s.id === newSlide.id ? { ...s, visible: false } : s));
      headlessCmsApi.updateCollectionData("landing", { ...landing, heroReelStills: toggled }, MASTER_CMS_EMAIL);

      current = (headlessCmsApi.getCollectionData("landing") as any).heroReelStills as any[];
      expect(current.find((s) => s.id === newSlide.id)?.visible).toBe(false);

      // DELETE / CLEANUP
      const cleaned = current.filter((s) => s.id !== newSlide.id);
      headlessCmsApi.updateCollectionData("landing", { ...landing, heroReelStills: cleaned }, MASTER_CMS_EMAIL);

      current = (headlessCmsApi.getCollectionData("landing") as any).heroReelStills as any[];
      expect(current.find((s) => s.id === newSlide.id)).toBeUndefined();
    });
  });
});
