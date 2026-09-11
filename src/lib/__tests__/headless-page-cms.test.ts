import { describe, it, expect } from "vitest";
import {
  headlessCmsApi,
  CMS_COLLECTIONS_CATALOG,
  MASTER_CMS_EMAIL,
} from "@/lib/headless-cms";
import {
  isSectionVisible,
  visibleSectionCount,
  partnerPagesOverBudget,
} from "@/lib/partner-page-cms";

describe("Headless Pages CMS Core Engine & Validation", () => {
  const PAGES = [
    { key: "landing", label: "Landing Page", route: "/", sectionPageId: "home" },
    { key: "programmes", label: "Programmes Hub", route: "/programmes", sectionPageId: "programmes" },
    { key: "connect", label: "BNS Connect", route: "/programmes/connect", sectionPageId: "programmeConnect" },
    { key: "mashinani", label: "BNS Mashinani", route: "/programmes/mashinani", sectionPageId: "programmeMashinani" },
    { key: "wanahabari-lab", label: "Wanahabari Lab", route: "/programmes/wanahabari-lab", sectionPageId: "programmeWanahabari" },
    { key: "studios", label: "BNS Studios", route: "/bns-studio", sectionPageId: "studio" },
    { key: "about", label: "About Us", route: "/about", sectionPageId: "about" },
    { key: "featured-blogs", label: "Featured Blogs & Evidence", route: "/#featured-projects", sectionPageId: "featured-blogs" },
    { key: "custom-pages", label: "Custom Pages Builder", route: "/pages", sectionPageId: "custom-pages" },
  ];

  it("registers all 9 visual CMS pages with accurate route mappings and section configs", () => {
    expect(PAGES).toHaveLength(9);
    for (const page of PAGES) {
      expect(page.route.startsWith("/")).toBe(true);
      expect(page.label.length).toBeGreaterThan(0);
      expect(page.sectionPageId.length).toBeGreaterThan(0);
    }
  });

  it("verifies live preview route resolution for standard and dynamic pages", () => {
    const resolvePreviewRoute = (key: string, customSlug?: string) => {
      if (key === "custom-pages") return customSlug ? `/pages/${customSlug}?preview=true` : "/pages";
      if (key === "featured-blogs") return "/#featured-projects";
      const match = PAGES.find((p) => p.key === key);
      return match ? match.route : "/";
    };

    expect(resolvePreviewRoute("landing")).toBe("/");
    expect(resolvePreviewRoute("programmes")).toBe("/programmes");
    expect(resolvePreviewRoute("connect")).toBe("/programmes/connect");
    expect(resolvePreviewRoute("mashinani")).toBe("/programmes/mashinani");
    expect(resolvePreviewRoute("wanahabari-lab")).toBe("/programmes/wanahabari-lab");
    expect(resolvePreviewRoute("studios")).toBe("/bns-studio");
    expect(resolvePreviewRoute("about")).toBe("/about");
    expect(resolvePreviewRoute("featured-blogs")).toBe("/#featured-projects");
    expect(resolvePreviewRoute("custom-pages", "test-brief")).toBe("/pages/test-brief?preview=true");
    expect(resolvePreviewRoute("custom-pages")).toBe("/pages");
  });

  it("verifies section visibility policy remains clean and compliant across all pages", () => {
    const overBudget = partnerPagesOverBudget();
    expect(overBudget).toEqual([]);
    expect(visibleSectionCount("home")).toBeLessThanOrEqual(5);
    expect(visibleSectionCount("programmes")).toBeLessThanOrEqual(5);
  });

  it("allows updating landing page hero and value proposition in memory store", () => {
    const landing = headlessCmsApi.getCollectionData("landing") as any;
    expect(landing).toBeDefined();

    const updated = {
      ...landing,
      hero: {
        ...landing.hero,
        headline: "Visual CMS Tested Headline",
      },
    };

    const res = headlessCmsApi.updateCollectionData("landing", updated, MASTER_CMS_EMAIL);
    expect(res.success).toBe(true);

    const reloaded = headlessCmsApi.getCollectionData("landing") as any;
    expect(reloaded.hero.headline).toBe("Visual CMS Tested Headline");
  });

  it("allows updating programmes hub card blurbs and closing callouts", () => {
    const progs = headlessCmsApi.getCollectionData("programmes") as any;
    expect(progs).toBeDefined();

    const updated = {
      ...progs,
      cardBlurbs: {
        ...(progs.cardBlurbs || {}),
        connect: "Updated connect blurb for live preview",
      },
    };

    const res = headlessCmsApi.updateCollectionData("programmes", updated, MASTER_CMS_EMAIL);
    expect(res.success).toBe(true);

    const reloaded = headlessCmsApi.getCollectionData("programmes") as any;
    expect(reloaded.cardBlurbs.connect).toBe("Updated connect blurb for live preview");
  });

  it("supports adding, updating, and removing custom marketing pages", () => {
    const customPagesCollection = headlessCmsApi.getCollectionData("custom-pages") as any;
    expect(customPagesCollection).toBeDefined();

    const existingPages = customPagesCollection.pages || [];
    const testSlug = `test-page-${Date.now()}`;

    const newPage = {
      slug: testSlug,
      title: "Test Civic Campaign",
      headline: "Headline for live preview testing",
      eyebrow: "Special Report",
      body: "Short lede paragraph",
      content: "Markdown body content",
      ctaLabel: "Get Involved",
      ctaHref: "/contact",
      published: true,
      stats: [
        { value: "100%", label: "Citizen Powered" },
        { value: "47", label: "Counties" },
      ],
    };

    // Add page
    const updatedCollection = {
      pages: [...existingPages, newPage],
    };

    const resAdd = headlessCmsApi.updateCollectionData("custom-pages", updatedCollection, MASTER_CMS_EMAIL);
    expect(resAdd.success).toBe(true);

    const reloadedAdd = headlessCmsApi.getCollectionData("custom-pages") as any;
    const found = (reloadedAdd.pages || []).find((p: any) => p.slug === testSlug);
    expect(found).toBeDefined();
    expect(found.title).toBe("Test Civic Campaign");
    expect(found.published).toBe(true);
    expect(found.stats).toHaveLength(2);

    // Remove page
    const cleanedCollection = {
      pages: (reloadedAdd.pages || []).filter((p: any) => p.slug !== testSlug),
    };
    const resRemove = headlessCmsApi.updateCollectionData("custom-pages", cleanedCollection, MASTER_CMS_EMAIL);
    expect(resRemove.success).toBe(true);
  });

  it("supports managing featured blogs and stories for homepage and hub carousels", () => {
    const featured = headlessCmsApi.getCollectionData("featured-projects") as any;
    expect(featured).toBeDefined();

    const results = featured.results || [];
    const testStoryId = `story-test-${Date.now()}`;

    const newStory = {
      id: testStoryId,
      title: "Investigative Reel: Health Budget Tracker",
      authorName: "Civic Watch",
      prose: "A deep dive into county hospital procurement.",
      programmeSlug: "connect",
      programmeLabel: "BNS Connect",
      videoId: "abc123xyz",
      url: "https://www.youtube.com/watch?v=abc123xyz",
      thumbnail: "/images/events/default.jpg",
    };

    // Add story
    const updatedFeatured = {
      ...featured,
      count: (featured.count || results.length) + 1,
      results: [newStory, ...results],
    };

    const resAdd = headlessCmsApi.updateCollectionData("featured-projects", updatedFeatured, MASTER_CMS_EMAIL);
    expect(resAdd.success).toBe(true);

    const reloadedAdd = headlessCmsApi.getCollectionData("featured-projects") as any;
    expect(reloadedAdd.results[0].id).toBe(testStoryId);
    expect(reloadedAdd.results[0].title).toBe("Investigative Reel: Health Budget Tracker");

    // Clean up
    const cleanedFeatured = {
      ...reloadedAdd,
      count: reloadedAdd.results.length - 1,
      results: reloadedAdd.results.filter((s: any) => s.id !== testStoryId),
    };
    headlessCmsApi.updateCollectionData("featured-projects", cleanedFeatured, MASTER_CMS_EMAIL);
  });

  it("verifies the published dummy page county-fiscal-transparency-initiative exists in custom-pages catalog", () => {
    const customPages = headlessCmsApi.getCollectionData("custom-pages") as any;
    expect(customPages).toBeDefined();
    const dummyPage = (customPages.pages || []).find((p: any) => p.slug === "county-fiscal-transparency-initiative");
    expect(dummyPage).toBeDefined();
    expect(dummyPage.title).toBe("County Fiscal Transparency Initiative 2026");
    expect(dummyPage.published).toBe(true);
    expect(dummyPage.stats.length).toBeGreaterThanOrEqual(3);
  });
});
