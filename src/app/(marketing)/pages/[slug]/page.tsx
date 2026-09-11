import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { buildPageMetadata } from "@/utils/page-metadata";
import { HERO_SECTION_PADDING, SECTION_SHELL_INNER } from "@/layouts/section-shell";
import { LandingSection } from "@/layouts/landing-section";
import { EditorialPill, PillButtonGroup, EditorialCtaBand } from "@/components/ui/editorial";
import { LANDING_TYPOGRAPHY as T } from "@/constants/landing-typography";
import { cn } from "@/utils";
import fs from "node:fs";
import path from "node:path";
import customPagesJson from "@/content/custom-pages.json";

export const dynamicParams = true;

export type CustomPageItem = {
  slug: string;
  title: string;
  seoDescription?: string;
  eyebrow?: string;
  headline: string;
  body: string;
  content?: string;
  ctaLabel?: string;
  ctaHref?: string;
  secondaryLabel?: string;
  secondaryHref?: string;
  stats?: Array<{ value: string; label: string }>;
  published?: boolean;
  createdAt?: string;
};

function getAllCustomPages(): CustomPageItem[] {
  try {
    const filePath = path.resolve(process.cwd(), "src/content/custom-pages.json");
    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, "utf-8");
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed?.pages)) {
        return parsed.pages;
      }
    }
  } catch {
    // fallback
  }
  return (customPagesJson.pages || []) as CustomPageItem[];
}

function getCustomPage(slug: string, isPreview = false): CustomPageItem | undefined {
  const pages = getAllCustomPages();
  return pages.find((p) => p.slug === slug && (isPreview || p.published !== false));
}

export function generateStaticParams() {
  const pages = getAllCustomPages();
  return pages.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const page = getCustomPage(slug, true);
  if (!page) {
    return buildPageMetadata({
      title: "Page Not Found | Budget Ndio Story",
      description: "The requested page could not be found.",
      path: `/pages/${slug}`,
    });
  }

  return buildPageMetadata({
    title: `${page.title} | Budget Ndio Story`,
    description: page.seoDescription || page.body,
    path: `/pages/${page.slug}`,
  });
}

export default async function DynamicCustomPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<{ preview?: string }>;
}) {
  const { slug } = await params;
  const search = searchParams ? await searchParams : {};
  const isPreview = search?.preview === "true";
  const page = getCustomPage(slug, isPreview);

  if (!page) {
    notFound();
  }

  const isDraft = page.published === false;

  return (
    <div className="w-full min-h-dvh bg-background text-foreground overflow-x-clip">
      {/* Draft or Preview Banner */}
      {isDraft ? (
        <div className="w-full bg-amber-500/15 border-b border-amber-500/30 px-4 sm:px-6 py-3 flex items-center justify-between gap-4 text-amber-900 dark:text-amber-200">
          <div className="flex items-center gap-2 text-xs font-semibold">
            <span className="flex size-2 rounded-full bg-amber-500 animate-pulse" />
            <span>🟡 DRAFT PREVIEW MODE — This page is saved in Drafts and is NOT visible to public live visitors.</span>
          </div>
          <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-900 dark:text-amber-100 font-bold">
            Draft
          </span>
        </div>
      ) : isPreview ? (
        <div className="w-full bg-emerald-500/15 border-b border-emerald-500/30 px-4 sm:px-6 py-3 flex items-center justify-between gap-4 text-emerald-900 dark:text-emerald-200">
          <div className="flex items-center gap-2 text-xs font-semibold">
            <span className="flex size-2 rounded-full bg-emerald-500" />
            <span>🟢 LIVE PUBLISHED PAGE — This page is live for all public visitors at /pages/{page.slug}</span>
          </div>
          <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-900 dark:text-emerald-100 font-bold">
            Live
          </span>
        </div>
      ) : null}
      {/* Hero Section */}
      <section
        className={cn(HERO_SECTION_PADDING, "border-b border-border/50 bg-background")}
        aria-labelledby="custom-page-hero-heading"
      >
        <div className={SECTION_SHELL_INNER}>
          <div className="max-w-3xl space-y-5">
            {page.eyebrow ? (
              <EditorialPill dot pulse variant="default">
                {page.eyebrow}
              </EditorialPill>
            ) : null}

            <h1
              id="custom-page-hero-heading"
              className={cn(T.heroTitle, "text-balance text-foreground")}
            >
              {page.headline}
            </h1>

            <p className={cn(T.lead, "text-foreground/75 leading-relaxed")}>
              {page.body}
            </p>

            {(page.ctaLabel || page.secondaryLabel) ? (
              <div className="flex flex-wrap items-center gap-3 pt-3">
                {page.ctaLabel ? (
                  <PillButtonGroup
                    href={page.ctaHref || "/contact"}
                    label={page.ctaLabel}
                    variant="primary"
                  />
                ) : null}
                {page.secondaryLabel ? (
                  <PillButtonGroup
                    href={page.secondaryHref || "/programmes"}
                    label={page.secondaryLabel}
                    variant="outline"
                  />
                ) : null}
              </div>
            ) : null}
          </div>
        </div>
      </section>

      {/* Scale / Key Metrics Stats if available */}
      {page.stats && page.stats.length > 0 ? (
        <LandingSection className="border-b border-border/50 py-10 bg-muted/20">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {page.stats.map((stat, idx) => (
              <div key={idx} className="space-y-1">
                <div className="font-mono text-3xl font-bold tracking-tight text-foreground md:text-4xl">
                  {stat.value}
                </div>
                <div className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </LandingSection>
      ) : null}

      {/* Main Editorial Content Body */}
      {page.content ? (
        <LandingSection className="border-b border-border/50 py-16">
          <article className="prose prose-neutral dark:prose-invert max-w-3xl space-y-6 text-foreground/80 leading-relaxed text-sm md:text-base">
            {page.content.split("\n\n").map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </article>
        </LandingSection>
      ) : null}

      {/* Closing CTA */}
      <EditorialCtaBand
        eyebrow="Budget Ndio Story"
        title="Partner with us on verified public finance intelligence."
        description="Collaborate with our teams on national tracking, county accountability, and newsroom investigative training."
        ctaLabel={page.ctaLabel || "Discuss Partnership"}
        ctaHref={page.ctaHref || "/contact?intent=partner"}
        secondaryLabel="Explore Programmes"
        secondaryHref="/programmes"
      />
    </div>
  );
}
