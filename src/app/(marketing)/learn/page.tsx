import type { Metadata } from "next";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { LearnPathsHome } from "@/components/learn/learn-paths-home";
import { metaDescription, canonicalUrl } from "@/utils/metadata";
import { legacyLearnTabRedirect } from "@/lib/learn-nav";
import { BreadcrumbJsonLd, ArticleJsonLd } from "@/components/seo/json-ld";

const learnDescription = metaDescription(
  "Learn Kenya’s national and county budget cycle — free civic modules, articles, and paths. No paywall. Optional account to save progress.",
);

export const metadata: Metadata = {
  title: "Learn Kenya’s Budget | Budget Ndio Story",
  description: learnDescription,
  keywords: [
    "Kenya budget learning",
    "budget literacy hub Kenya",
    "Finance Bill explained",
    "Appropriation Bill guide",
    "fiscal policy education",
    "public finance learning paths",
    "county budget CIDP CFSP",
    "Kenya budget cycle BPS",
  ],
  alternates: { canonical: canonicalUrl("/learn") },
  openGraph: {
    title: "Learn Kenya’s Budget | Budget Ndio Story",
    description: learnDescription,
    url: canonicalUrl("/learn"),
    images: [{ url: "/logo.svg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Learn Kenya’s Budget | Budget Ndio Story",
    description: learnDescription,
    images: ["/logo.svg"],
  },
};

export const revalidate = 3600;

type PageProps = {
  searchParams: Promise<{ tab?: string }>;
};

export default async function LearnPage({ searchParams }: PageProps) {
  const { tab } = await searchParams;
  const legacy = legacyLearnTabRedirect(tab ?? null);
  if (legacy) redirect(legacy);

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", item: "https://budgetndiostory.org" },
          { name: "Learn", item: "https://budgetndiostory.org/learn" },
        ]}
      />
      <ArticleJsonLd
        title="Learn Kenya’s Budget — Civic Learning Hub"
        description={learnDescription}
        url="https://budgetndiostory.org/learn"
      />
      <Suspense fallback={<div className="min-h-[50vh] animate-pulse bg-muted/20" />}>
        <LearnPathsHome tab="learn" />
      </Suspense>
    </>
  );
}
