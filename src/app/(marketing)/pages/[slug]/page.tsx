import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { buildPageMetadata } from "@/utils/page-metadata";
import { HERO_SECTION_PADDING, SECTION_SHELL_INNER } from "@/layouts/section-shell";
import { LandingSection } from "@/layouts/landing-section";
import { EditorialPill, PillButtonGroup, EditorialCtaBand } from "@/components/ui/editorial";
import { LANDING_TYPOGRAPHY as T } from "@/constants/landing-typography";
import { cn } from "@/utils";
import customPagesJson from "@/content/custom-pages.json";

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

function getCustomPage(slug: string): CustomPageItem | undefined {
  const pages = (customPagesJson.pages || []) as CustomPageItem[];
  return pages.find((p) => p.slug === slug && p.published !== false);
}

export function generateStaticParams() {
  const pages = (customPagesJson.pages || []) as CustomPageItem[];
  return pages.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const page = getCustomPage(slug);
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
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = getCustomPage(slug);

  if (!page) {
    notFound();
  }

  return (
    <div className="w-full min-h-dvh bg-background text-foreground overflow-x-clip">
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
