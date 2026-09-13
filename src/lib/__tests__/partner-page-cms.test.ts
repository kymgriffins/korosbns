import { describe, expect, it } from "vitest";
import {
  isSectionVisible,
  listPartnerAttentionPages,
  partnerPageSectionsCms,
  partnerPagesOverBudget,
  visibleSectionCount,
} from "@/lib/partner-page-cms";
import {
  getGlobalSplashConfig,
  resolvePageLoadingById,
  resolvePageLoadingByPath,
} from "@/lib/page-loading";

describe("partner-page-cms ≤5 block policy", () => {
  it("keeps every partnerAttention non-blog page at or under maxBlocks", () => {
    const over = partnerPagesOverBudget();
    expect(
      over.map((row) => `${row.id}:${row.visibleCount}`),
      "Flip section.visible=false in partner-page-sections.json until under budget",
    ).toEqual([]);
  });

  it("lists partner pages with expected home mutes", () => {
    expect(isSectionVisible("home", "hero")).toBe(true);
    expect(isSectionVisible("home", "whoHow")).toBe(true);
    expect(isSectionVisible("home", "programmeExplains")).toBe(true);
    expect(isSectionVisible("home", "featuredProjects")).toBe(true);
    expect(isSectionVisible("home", "partners")).toBe(false);
    expect(isSectionVisible("home", "storyNearYou")).toBe(false);
    expect(isSectionVisible("home", "programmes")).toBe(false);
    expect(isSectionVisible("home", "team")).toBe(false);
    expect(isSectionVisible("home", "budgetCycle")).toBe(false);
    expect(visibleSectionCount("home")).toBeLessThanOrEqual(
      partnerPageSectionsCms.policy.maxBlocksPartnerPages,
    );
  });

  it("showcases featured YouTube projects on programmes hub under budget", () => {
    expect(isSectionVisible("programmes", "featuredProjects")).toBe(true);
    expect(isSectionVisible("programmes", "partners")).toBe(false);
    expect(visibleSectionCount("programmes")).toBeLessThanOrEqual(
      partnerPageSectionsCms.policy.maxBlocksPartnerPages,
    );
  });

  it("keeps about under budget with dense sections muted", () => {
    expect(isSectionVisible("about", "originStory")).toBe(false);
    expect(isSectionVisible("about", "theoryOfChange")).toBe(false);
    expect(isSectionVisible("about", "integrityCharter")).toBe(false);
    expect(visibleSectionCount("about")).toBe(3);
  });

  it("exempts blogLike pages from the partner budget", () => {
    const blog = listPartnerAttentionPages().filter((r) => r.page.blogLike);
    expect(blog).toHaveLength(0);
    expect(partnerPageSectionsCms.pages.projectDetail.blogLike).toBe(true);
    expect(partnerPageSectionsCms.pages.reportDetail.blogLike).toBe(true);
  });

  it("marks learn as non-partner and forum as muted", () => {
    expect(partnerPageSectionsCms.pages.learn.partnerAttention).toBe(false);
    expect(isSectionVisible("forum", "forum")).toBe(false);
  });
});

describe("page loading policy", () => {
  it("keeps global splash off by default", () => {
    expect(getGlobalSplashConfig().enabled).toBe(false);
    expect(partnerPageSectionsCms.policy.loadingDefaults?.globalSplash).toBe(false);
  });

  it("never shows the fake BNS Studios reel unless opted in", () => {
    const studio = resolvePageLoadingById("studio");
    expect(studio.enabled).toBe(false);
    expect(studio.variant).toBe("studio-reel");
  });

  it("keeps connect / home / learn without route loading pages", () => {
    expect(resolvePageLoadingByPath("/programmes/connect").enabled).toBe(false);
    expect(resolvePageLoadingByPath("/").enabled).toBe(false);
    expect(resolvePageLoadingByPath("/learn").enabled).toBe(false);
  });
});
