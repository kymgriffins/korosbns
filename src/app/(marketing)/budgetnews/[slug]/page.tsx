import type { Metadata } from "next";
import { metaDescription, canonicalUrl } from "@/utils/metadata";
import { BudgetNewsDetailClient } from "./client";

export const revalidate = 3600;

function titleFromSlug(slug: string): string {
  return slug
    .replace(/-/g, " ")
    .replace(/\bfy(\d{4}) (\d{2})\b/gi, "FY$1/$2")
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .replace(/\bFy/g, "FY");
}

export async function generateMetadata(
  props: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await props.params;
  const title = titleFromSlug(slug);

  return {
    title: `${title} | Budget News | Budget Ndio Story`,
    description: metaDescription(
      `Detailed financial year analysis: ${slug.replace(/-/g, " ")}. Kenya budget sector breakdown, allocations, and citizen impact.`
    ),
    alternates: { canonical: canonicalUrl(`/budgetnews/${slug}`) },
    openGraph: {
      title: `${title} | Budget Ndio Story`,
      description: `Financial year analysis of Kenya's ${slug.replace(/-/g, " ")}.`,
      url: canonicalUrl(`/budgetnews/${slug}`),
      images: [{ url: "/logo.svg", width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | Budget Ndio Story`,
      description: `Financial year analysis of Kenya's ${slug.replace(/-/g, " ")}.`,
      images: ["/logo.svg"],
    },
  };
}

export async function generateStaticParams() {
  return [];
}

export default async function BudgetNewsDetailPage(
  props: { params: Promise<{ slug: string }> }
) {
  const { slug } = await props.params;
  return <BudgetNewsDetailClient slug={slug} />;
}
