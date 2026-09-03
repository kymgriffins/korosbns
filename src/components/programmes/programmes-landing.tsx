"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { EditorialCtaBand, EditorialPill, PillButtonGroup } from "@/components/ui/editorial";
import { ProgrammesPartners } from "@/components/programmes/programmes-partners";
import { ProgrammesLatestContent } from "@/components/programmes/programmes-latest-content";
import { ProgrammesFaq } from "@/components/programmes/programmes-faq";
import { ProgrammesImpactHub } from "@/components/work-hub/programmes-impact-hub";
import { LandingSection } from "@/layouts/landing-section";
import { LANDING_TYPOGRAPHY as T } from "@/constants/landing-typography";
import {
  PROGRAMMES,
  PROGRAMMES_CLOSING,
  PROGRAMMES_LANDING,
  PROGRAMME_CARD_BLURBS,
  programmeHref,
} from "@/content";
import { GsapHeroChoreography } from "@/motion/gsap";
import { HERO_SECTION_PADDING, SECTION_SHELL_INNER, SECTION_SHELL_PADDING } from "@/layouts/section-shell";
import { cn } from "@/utils";

export function ProgrammesLanding() {
  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: PROGRAMMES_LANDING.seoTitle,
    description: PROGRAMMES_LANDING.seoDescription,
    mainEntity: {
      "@type": "ItemList",
      itemListElement: PROGRAMMES.map((p, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: p.name,
        description: p.seoDescription,
        url: programmeHref(p.slug),
      })),
    },
  };

  return (
    <div className="w-full scroll-smooth bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />

      {/* 01 — Hero */}
      <section
        className={cn(
          HERO_SECTION_PADDING,
          "border-b border-border/30 bg-background",
        )}
      >
        <div className={SECTION_SHELL_INNER}>
          <GsapHeroChoreography className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between md:gap-12">
            <div data-gsap-hero-content className="max-w-2xl space-y-4">
              <EditorialPill>Programmes</EditorialPill>
              <h1 className={cn(T.heroTitle, "text-balance text-foreground")}>
                {PROGRAMMES_LANDING.headline}
              </h1>
            </div>
            <p
              data-gsap-hero-content
              className={cn(T.lead, "max-w-md md:pb-2 md:text-right")}
            >
              {PROGRAMMES_LANDING.body}
            </p>
          </GsapHeroChoreography>
          <div data-gsap-hero-content className="mt-8 flex flex-wrap items-center gap-3">
            <PillButtonGroup
              href={PROGRAMMES_LANDING.exploreCta.href}
              label={PROGRAMMES_LANDING.exploreCta.label}
            />
            <nav aria-label="Programmes" className="flex flex-wrap gap-2">
              {PROGRAMMES.map((p) => (
                <Link
                  key={p.slug}
                  href={programmeHref(p.slug)}
                  className="rounded-full border border-border/60 px-3 py-1.5 text-xs font-semibold text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground"
                >
                  {p.name}
                </Link>
              ))}
            </nav>
          </div>
          <p data-gsap-hero-content className="mt-4 text-sm text-muted-foreground">
            {PROGRAMMES_LANDING.subhead}
          </p>
        </div>
      </section>

      {/* 02 — Programme index: image cards with hero stat */}
      <section id="programmes" className={cn(SECTION_SHELL_PADDING, "border-b border-border/30")}>
        <div className={SECTION_SHELL_INNER}>
          <p className="text-xs font-semibold uppercase tracking-wider text-primary">
            01 / The programmes
          </p>
          <h2 className="mt-2 max-w-2xl text-2xl font-extrabold tracking-tight text-foreground md:text-3xl">
            Four programmes, one budget truth
          </h2>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {PROGRAMMES.map((p, i) => (
              <Link
                key={p.slug}
                href={programmeHref(p.slug)}
                className="group overflow-hidden rounded-2xl border border-border/40 bg-card transition-colors hover:border-primary/50"
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  <Image
                    src={p.visual.hero}
                    alt={p.visual.heroAlt}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    sizes="(max-width: 768px) 100vw, 25vw"
                  />
                  <span className="absolute left-3 top-2.5 text-[11px] font-extrabold tracking-[0.2em] text-white/90">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <div className="p-5">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-primary">
                    {p.eyebrow}
                  </p>
                  <h3 className="mt-1 text-lg font-bold text-foreground">
                    {p.name}
                  </h3>
                  <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                    {PROGRAMME_CARD_BLURBS[p.slug]}
                  </p>
                  {p.stats?.[0] ? (
                    <p className="mt-3 text-sm">
                      <span className="font-extrabold text-foreground">
                        {p.stats[0].value}
                      </span>{" "}
                      <span className="text-muted-foreground">
                        — {p.stats[0].label}
                      </span>
                    </p>
                  ) : null}
                  <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-primary group-hover:underline">
                    Explore {p.name}
                    <ArrowUpRight className="size-3.5" aria-hidden />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 03 — Ecosystem numbers (existing hub, kept) */}
      <ProgrammesImpactHub />

      {/* 04 — Latest evidence (previously orphaned, now wired) */}
      <ProgrammesLatestContent />

      <ProgrammesPartners />

      {/* 05 — FAQ (previously orphaned, now wired) */}
      <ProgrammesFaq />

      <LandingSection>
        <EditorialCtaBand
          eyebrow="Partner with BNS"
          title={PROGRAMMES_CLOSING.headline}
          description={PROGRAMMES_CLOSING.body}
          ctaHref={PROGRAMMES_CLOSING.cta.href}
          ctaLabel={PROGRAMMES_CLOSING.cta.label}
        />
      </LandingSection>
    </div>
  );
}
