import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { buildPageMetadata } from "@/utils/page-metadata";
import { HERO_SECTION_PADDING, SECTION_SHELL_INNER } from "@/layouts/section-shell";
import { LandingSection } from "@/layouts/landing-section";
import { EditorialPill, PillButtonGroup, EditorialCtaBand } from "@/components/ui/editorial";
import { LANDING_TYPOGRAPHY as T } from "@/constants/landing-typography";
import { cn } from "@/utils";
import fs from "node:fs";
import path from "node:path";
import customPagesJson from "@/content/custom-pages.json";
import { MediaEmbed } from "@/components/ui/media-embed";
import {
  type CustomPageItem,
  type PageSection,
  ensurePageSections,
} from "@/lib/headless-page-cms";
import { ArrowRight, CheckCircle2, ChevronRight } from "lucide-react";
import { ObamaOrgShowcase } from "@/components/marketing/obama-org-showcase";

export const dynamicParams = true;

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
  const sections = ensurePageSections(page).filter((s) => s.enabled !== false);

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

      {/* Render Sovereign Showcase for obama-org, or All Enabled Modular Sections */}
      {page.slug === "obama-org" ? (
        <ObamaOrgShowcase />
      ) : (
        sections.map((section) => {
        switch (section.type) {
          case "hero":
            return (
              <section
                key={section.id}
                className={cn(HERO_SECTION_PADDING, "border-b border-border/50 bg-background")}
                aria-labelledby={`sec-${section.id}-heading`}
              >
                <div className={SECTION_SHELL_INNER}>
                  <div className="grid items-center gap-10 lg:grid-cols-12">
                    <div className={cn("space-y-5", section.media?.url ? "lg:col-span-7" : "max-w-3xl lg:col-span-12")}>
                      {section.eyebrow ? (
                        <EditorialPill dot pulse variant="default">
                          {section.eyebrow}
                        </EditorialPill>
                      ) : null}

                      <h1
                        id={`sec-${section.id}-heading`}
                        className={cn(T.heroTitle, "text-balance text-foreground")}
                      >
                        {section.headline}
                      </h1>

                      {section.body ? (
                        <p className={cn(T.lead, "text-foreground/75 leading-relaxed")}>
                          {section.body}
                        </p>
                      ) : null}

                      {/* Active Buttons */}
                      {section.buttons && section.buttons.filter((b) => b.enabled).length > 0 ? (
                        <div className="flex flex-wrap items-center gap-3 pt-3">
                          {section.buttons
                            .filter((b) => b.enabled)
                            .map((btn) => (
                              <PillButtonGroup
                                key={btn.id}
                                href={btn.href}
                                label={btn.label}
                                variant={btn.variant === "primary" ? "primary" : "outline"}
                              />
                            ))}
                        </div>
                      ) : null}
                    </div>

                    {/* Featured Media in Hero */}
                    {section.media?.url ? (
                      <div className="lg:col-span-5">
                        <div className="rounded-lg overflow-hidden border border-border/60 shadow-lg">
                          <MediaEmbed
                            src={section.media.url}
                            type={section.media.type}
                            title={section.media.title}
                            caption={section.media.caption}
                          />
                        </div>
                      </div>
                    ) : null}
                  </div>
                </div>
              </section>
            );

          case "video_showcase":
            return (
              <LandingSection key={section.id} className="border-b border-border/50 py-16 bg-muted/10">
                <div className="max-w-4xl mx-auto space-y-6">
                  <div className="space-y-2 text-center">
                    {section.eyebrow ? (
                      <EditorialPill dot variant="default">
                        {section.eyebrow}
                      </EditorialPill>
                    ) : null}
                    <h2 className={cn(T.sectionTitle, "text-foreground")}>
                      {section.headline}
                    </h2>
                    {section.body ? (
                      <p className={cn(T.lead, "text-muted-foreground max-w-2xl mx-auto text-sm md:text-base")}>
                        {section.body}
                      </p>
                    ) : null}
                  </div>

                  {section.media?.url ? (
                    <div className="rounded-xl overflow-hidden border border-border/80 shadow-2xl bg-black">
                      <MediaEmbed
                        src={section.media.url}
                        type={section.media.type}
                        title={section.media.title}
                        caption={section.media.caption}
                        controls
                      />
                    </div>
                  ) : null}

                  {section.buttons && section.buttons.filter((b) => b.enabled).length > 0 ? (
                    <div className="flex justify-center items-center gap-3 pt-2">
                      {section.buttons
                        .filter((b) => b.enabled)
                        .map((btn) => (
                          <PillButtonGroup
                            key={btn.id}
                            href={btn.href}
                            label={btn.label}
                            variant={btn.variant === "primary" ? "primary" : "outline"}
                          />
                        ))}
                    </div>
                  ) : null}
                </div>
              </LandingSection>
            );

          case "stats_grid":
            return (
              <LandingSection key={section.id} className="border-b border-border/50 py-12 bg-muted/20">
                {section.headline ? (
                  <div className="mb-6 space-y-1">
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      {section.headline}
                    </h3>
                  </div>
                ) : null}
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                  {(section.items || []).filter((i) => i.enabled !== false).map((stat) => (
                    <div key={stat.id} className="space-y-1 border-l-2 border-primary/40 pl-4">
                      <div className="font-mono text-3xl font-bold tracking-tight text-foreground md:text-4xl">
                        {stat.value || stat.title}
                      </div>
                      <div className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                        {stat.label || stat.description}
                      </div>
                    </div>
                  ))}
                </div>
              </LandingSection>
            );

          case "feature_cards":
            return (
              <LandingSection key={section.id} className="border-b border-border/50 py-16">
                <div className="space-y-4 mb-10">
                  {section.eyebrow ? (
                    <EditorialPill variant="default">{section.eyebrow}</EditorialPill>
                  ) : null}
                  <h2 className={cn(T.sectionTitle, "text-foreground")}>
                    {section.headline}
                  </h2>
                  {section.body ? (
                    <p className={cn(T.lead, "text-muted-foreground max-w-2xl")}>
                      {section.body}
                    </p>
                  ) : null}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {(section.items || []).filter((i) => i.enabled !== false).map((card) => (
                    <div
                      key={card.id}
                      className="border border-border/60 bg-background p-6 space-y-3 flex flex-col justify-between hover:border-primary/50 transition-colors"
                    >
                      <div className="space-y-2">
                        {card.tag ? (
                          <span className="inline-block font-mono text-[10px] font-bold uppercase tracking-wider text-primary px-2 py-0.5 rounded bg-primary/10">
                            {card.tag}
                          </span>
                        ) : null}
                        <h4 className="font-heading text-lg font-bold text-foreground">
                          {card.title}
                        </h4>
                        <p className="text-xs leading-relaxed text-foreground/75 md:text-sm">
                          {card.description}
                        </p>
                      </div>

                      {card.link ? (
                        <Link
                          href={card.link}
                          className="inline-flex items-center text-xs font-semibold text-primary hover:underline pt-2"
                        >
                          Learn more <ArrowRight className="ml-1 size-3" />
                        </Link>
                      ) : null}
                    </div>
                  ))}
                </div>
              </LandingSection>
            );

          case "narrative":
            return (
              <LandingSection key={section.id} className="border-b border-border/50 py-16">
                <div className="max-w-3xl space-y-6">
                  {section.headline ? (
                    <h2 className="font-heading text-2xl font-bold tracking-tight text-foreground md:text-3xl">
                      {section.headline}
                    </h2>
                  ) : null}
                  <article className="prose prose-neutral dark:prose-invert space-y-5 text-foreground/80 leading-relaxed text-sm md:text-base">
                    {(section.content || "").split("\n\n").map((para, i) => (
                      <p key={i}>{para}</p>
                    ))}
                  </article>
                </div>
              </LandingSection>
            );

          case "faq":
            return (
              <LandingSection key={section.id} className="border-b border-border/50 py-16 bg-muted/10">
                <div className="max-w-3xl space-y-8">
                  <div className="space-y-2">
                    <h2 className={cn(T.sectionTitle, "text-foreground")}>
                      {section.headline || "Frequently Asked Questions"}
                    </h2>
                    {section.body ? (
                      <p className="text-sm text-muted-foreground">{section.body}</p>
                    ) : null}
                  </div>

                  <div className="divide-y divide-border/60 border-y border-border/60">
                    {(section.items || []).filter((i) => i.enabled !== false).map((faq) => (
                      <div key={faq.id} className="py-5 space-y-2">
                        <h4 className="font-heading text-base font-bold text-foreground flex items-center gap-2">
                          <CheckCircle2 className="size-4 text-primary shrink-0" />
                          {faq.title}
                        </h4>
                        <p className="text-sm text-foreground/75 leading-relaxed pl-6">
                          {faq.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </LandingSection>
            );

          case "cta_banner":
            return (
              <EditorialCtaBand
                key={section.id}
                eyebrow={section.eyebrow || "Budget Ndio Story"}
                title={section.headline || "Partner with us on verified public finance intelligence."}
                description={section.body || "Collaborate with our teams on national tracking, county accountability, and newsroom investigative training."}
                ctaLabel={section.buttons?.[0]?.enabled ? (section.buttons[0].label || "Get started") : undefined}
                ctaHref={section.buttons?.[0]?.enabled ? section.buttons[0].href : undefined}
                secondaryLabel={section.buttons?.[1]?.enabled ? section.buttons[1].label : undefined}
                secondaryHref={section.buttons?.[1]?.enabled ? section.buttons[1].href : undefined}
              />
            );

          default:
            return null;
        }
      }))}
    </div>
  );
}
