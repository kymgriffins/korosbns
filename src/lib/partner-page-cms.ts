/**
 * Partner-page section CMS — visibility flags for Jan's ≤5-block clarity rule.
 * Source of truth: `src/content/partner-page-sections.json`
 */

import partnerPageSectionsJson from "@/content/partner-page-sections.json";

export type PartnerPageSection = {
  id: string;
  label: string;
  visible: boolean;
};

export type PartnerPageConfig = {
  route: string;
  title: string;
  partnerAttention: boolean;
  blogLike: boolean;
  composer: string;
  sections: PartnerPageSection[];
};

export type PartnerPageSectionsCms = {
  policy: {
    maxBlocksPartnerPages: number;
    blogLikeExempt: boolean;
    notes: string;
  };
  pages: Record<string, PartnerPageConfig>;
};

export const partnerPageSectionsCms =
  partnerPageSectionsJson as PartnerPageSectionsCms;

export type PartnerPageId = keyof typeof partnerPageSectionsJson.pages;

export function getPartnerPage(pageId: string): PartnerPageConfig | undefined {
  return partnerPageSectionsCms.pages[pageId];
}

export function isSectionVisible(pageId: string, sectionId: string): boolean {
  const page = getPartnerPage(pageId);
  if (!page) return true;
  const section = page.sections.find((s) => s.id === sectionId);
  return section?.visible ?? true;
}

export function visibleSectionCount(pageId: string): number {
  const page = getPartnerPage(pageId);
  if (!page) return 0;
  return page.sections.filter((s) => s.visible).length;
}

export function listPartnerAttentionPages(): Array<{
  id: string;
  page: PartnerPageConfig;
  visibleCount: number;
  overBudget: boolean;
}> {
  const max = partnerPageSectionsCms.policy.maxBlocksPartnerPages;
  return Object.entries(partnerPageSectionsCms.pages)
    .filter(([, page]) => page.partnerAttention)
    .map(([id, page]) => {
      const visibleCount = page.sections.filter((s) => s.visible).length;
      const overBudget =
        !page.blogLike && visibleCount > max;
      return { id, page, visibleCount, overBudget };
    });
}

/** Pages that violate the ≤5 visible-blocks rule (partnerAttention, not blogLike). */
export function partnerPagesOverBudget(): ReturnType<
  typeof listPartnerAttentionPages
> {
  return listPartnerAttentionPages().filter((row) => row.overBudget);
}
