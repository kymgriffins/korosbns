import type { Metadata } from "next";
import { metaDescription, canonicalUrl } from "@/utils/metadata";
import { BudgetNewsChapterClient } from "./client";

export const revalidate = 3600;

function titleFromSlug(slug: string): string {
  return slug
    .replace(/-/g, " ")
    .replace(/\bfy(\d{4}) (\d{2})\b/gi, "FY$1/$2")
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .replace(/\bFy/g, "FY");
}

export async function generateMetadata(
  props: { params: Promise<{ slug: string; chapterSlug: string }> }
): Promise<Metadata> {
  const { slug, chapterSlug } = await props.params;
  const title = titleFromSlug(chapterSlug);

  return {
    title: `${title} | Budget News | Budget Ndio Story`,
    description: metaDescription(
      `Budget analysis: ${chapterSlug.replace(/-/g, " ")}. Part of Kenya's FY2026/27 budget sector breakdown with allocations, impact, and what it means for citizens.`
    ),
    alternates: { canonical: canonicalUrl(`/budgetnews/${slug}/${chapterSlug}`) },
    openGraph: {
      title: `${title} | Budget Ndio Story`,
      description: `Kenya FY2026/27 budget analysis: ${chapterSlug.replace(/-/g, " ")}.`,
      url: canonicalUrl(`/budgetnews/${slug}/${chapterSlug}`),
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | Budget Ndio Story`,
      description: `Kenya FY2026/27 budget: ${chapterSlug.replace(/-/g, " ")}.`,
    },
  };
}

export async function generateStaticParams() {
  return [];
}

export default async function BudgetNewsChapterPage(
  props: { params: Promise<{ slug: string; chapterSlug: string }> }
) {
  const { slug, chapterSlug } = await props.params;
  return <BudgetNewsChapterClient slug={slug} chapterSlug={chapterSlug} />;
}
