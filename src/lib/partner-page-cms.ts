/**
 * Partner-page section CMS — visibility flags for Jan's ≤5-block clarity rule.
 * Source of truth: `src/content/partner-page-sections.json` (seed) + R2 live overlay.
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

export type PartnerPageSectionsLike = {
  pages?: Record<string, { sections?: Array<{ id: string; visible?: boolean }> }>;
  policy?: { maxBlocksPartnerPages?: number };
};

export function getPartnerPage(
  pageId: string,
  config?: PartnerPageSectionsLike | null,
): PartnerPageConfig | undefined {
  const live = config?.pages?.[pageId] as PartnerPageConfig | undefined;
  if (live?.sections) return live;
  return partnerPageSectionsCms.pages[pageId];
}

/**
 * Section visibility. Prefer live `config` from `getLivePartnerPageSections()`
 * so CMS toggles apply without redeploy. Falls back to bundled JSON.
 */
export function isSectionVisible(
  pageId: string,
  sectionId: string,
  config?: PartnerPageSectionsLike | null,
): boolean {
  const page = getPartnerPage(pageId, config);
  if (!page) return true;
  const section = page.sections.find((s) => s.id === sectionId);
  return section?.visible ?? true;
}

export function visibleSectionCount(
  pageId: string,
  config?: PartnerPageSectionsLike | null,
): number {
  const page = getPartnerPage(pageId, config);
  if (!page) return 0;
  return page.sections.filter((s) => s.visible).length;
}

export function listPartnerAttentionPages(
  config?: PartnerPageSectionsCms | null,
): Array<{
  id: string;
  page: PartnerPageConfig;
  visibleCount: number;
  overBudget: boolean;
}> {
  const source = config ?? partnerPageSectionsCms;
  const max = source.policy.maxBlocksPartnerPages;
  return Object.entries(source.pages)
    .filter(([, page]) => page.partnerAttention)
    .map(([id, page]) => {
      const visibleCount = page.sections.filter((s) => s.visible).length;
      const overBudget = !page.blogLike && visibleCount > max;
      return { id, page, visibleCount, overBudget };
    });
}

/** Pages that violate the ≤5 visible-blocks rule (partnerAttention, not blogLike). */
export function partnerPagesOverBudget(
  config?: PartnerPageSectionsCms | null,
): ReturnType<typeof listPartnerAttentionPages> {
  return listPartnerAttentionPages(config).filter((row) => row.overBudget);
}
