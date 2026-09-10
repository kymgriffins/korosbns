"use client";

import Image from "next/image";
import {
  EditorialCtaBand,
  EditorialPill,
  PillButtonGroup,
} from "@/components/ui/editorial";
import { ProgrammeProjectGrid } from "@/components/programmes/programme-project-grid";
import { ProgrammeScorecard } from "@/components/programmes/programme-scorecard";
import {
  LandingSection,
} from "@/layouts/landing-section";
import {
  HERO_SECTION_PADDING,
  SECTION_SHELL_INNER,
} from "@/layouts/section-shell";
import { LANDING_TYPOGRAPHY as T } from "@/constants/landing-typography";
import {
  CIVIC_PROGRAMMES,
  PROGRAMMES_CLOSING,
  type ProgrammeBlock,
  type ProgrammeSlug,
} from "@/content";
import { isSectionVisible } from "@/lib/partner-page-cms";
import { cn } from "@/utils";

const PAGE_ID_BY_SLUG: Record<Exclude<ProgrammeSlug, "studios">, string> = {
  connect: "programmeConnect",
  mashinani: "programmeMashinani",
  "wanahabari-lab": "programmeWanahabari",
};

/**
 * Shared landing-format layout for civic programmes (Connect, Mashinani, Wanahabari).
 * Spine: Hero → body → projects → other programmes → CTA.
 * BNS Studio is separate at /bns-studio. Legacy scrollytelling kept, not rendered.
 */
export function ProgrammeLandingLayout({
  programme,
}: {
  programme: ProgrammeBlock;
}) {
  if (programme.slug === "studios") {
    return null;
  }

  const pageId = PAGE_ID_BY_SLUG[programme.slug];
  const others = CIVIC_PROGRAMMES.filter((p) => p.slug !== programme.slug);
  const primaryCta = programme.cta;

  return (
    <div className="w-full min-h-dvh bg-background overflow-x-clip text-foreground">
      {isSectionVisible(pageId, "hero") ? (
        <section
          className={cn(HERO_SECTION_PADDING, "border-b border-border/30 bg-background")}
          aria-labelledby={`programme-${programme.slug}-heading`}
        >
          <div className={SECTION_SHELL_INNER}>
            <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12 lg:gap-12">
              <div className="flex flex-col items-start gap-4 lg:col-span-7">
                <EditorialPill dot pulse variant="default">
                  {programme.eyebrow}
                </EditorialPill>
                <p className={cn(T.caption, "font-semibold uppercase tracking-wider text-primary")}>
                  {programme.name}
                </p>
                <h1
                  id={`programme-${programme.slug}-heading`}
                  className={cn(T.heroTitle, "text-balance text-foreground")}
                >
                  {programme.headline}
                </h1>
                <p className={cn(T.lead, "max-w-2xl text-foreground/75")}>
                  {programme.body}
                </p>
                <div className="flex w-full flex-col gap-3 pt-2 sm:w-auto sm:flex-row sm:items-center">
                  <PillButtonGroup
                    href={primaryCta.href}
                    label={primaryCta.label}
                    variant="primary"
                    className="w-full justify-center sm:w-auto"
                  />
                  <PillButtonGroup
                    href="/programmes"
                    label="All programmes"
                    variant="outline"
                    className="w-full justify-center sm:w-auto"
                  />
                </div>
              </div>

              <div className="lg:col-span-5">
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl border border-border/40 bg-muted shadow-xl md:aspect-[16/11] lg:aspect-[4/3]">
                  <Image
                    src={programme.visual.hero}
                    alt={programme.visual.heroAlt}
                    fill
                    priority
                    className="object-cover object-center"
                    sizes="(max-width: 1024px) 100vw, 45vw"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {isSectionVisible(pageId, "body") ? (
        <LandingSection aria-labelledby={`programme-${programme.slug}-body`}>
          <div className="mx-auto max-w-3xl space-y-6 text-center">
            <h2 id={`programme-${programme.slug}-body`} className={T.sectionTitle}>
              What this programme does
            </h2>
            {programme.highlight ? (
              <p className={cn(T.lead, "text-foreground/80")}>{programme.highlight}</p>
            ) : null}
          </div>

          {programme.stats && programme.stats.length > 0 ? (
            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              {programme.stats.map((stat) => (
                <div
                  key={`${stat.value}-${stat.label}`}
                  className="rounded-3xl border border-border/40 bg-card p-5 text-center"
                >
                  <p className="font-heading text-2xl font-bold text-foreground md:text-3xl">
                    {stat.value}
                  </p>
                  <p className={cn(T.caption, "mt-2 text-muted-foreground")}>{stat.label}</p>
                </div>
              ))}
            </div>
          ) : null}

          {programme.pillars && programme.pillars.length > 0 ? (
            <div className="mt-10 grid gap-4 md:grid-cols-2">
              {programme.pillars.slice(0, 4).map((pillar) => (
                <div
                  key={pillar.title}
                  className="rounded-3xl border border-border/40 bg-card p-5 md:p-6"
                >
                  <h3 className="font-heading text-base font-bold text-foreground md:text-lg">
                    {pillar.title}
                  </h3>
                  <p className={cn(T.caption, "mt-2 leading-relaxed text-muted-foreground")}>
                    {pillar.body}
                  </p>
                </div>
              ))}
            </div>
          ) : null}
        </LandingSection>
      ) : null}

      {isSectionVisible(pageId, "projects") ? (
        <ProgrammeProjectGrid programmeSlug={programme.slug} />
      ) : null}

      {isSectionVisible(pageId, "otherProgrammes") && others.length > 0 ? (
        <LandingSection aria-labelledby="other-programmes-heading">
          <div className="mb-8 flex flex-col gap-4 md:mb-10 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <h2 id="other-programmes-heading" className={T.sectionTitle}>
                Other programmes
              </h2>
            </div>
            <p className={cn(T.lead, "max-w-sm md:text-right")}>
              Same format across Connect, Mashinani, and Wanahabari — pick the next programme.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
            {others.map((item, index) => (
              <ProgrammeScorecard
                key={item.slug}
                programme={item}
                compact
                priority={index === 0}
              />
            ))}
          </div>
        </LandingSection>
      ) : null}

      {isSectionVisible(pageId, "cta") ? (
        <EditorialCtaBand
          eyebrow="Next step"
          title={PROGRAMMES_CLOSING.headline}
          description={PROGRAMMES_CLOSING.body}
          ctaHref={PROGRAMMES_CLOSING.cta.href}
          ctaLabel={PROGRAMMES_CLOSING.cta.label}
          images={[
            { src: programme.visual.hero, alt: programme.visual.heroAlt },
            ...others.slice(0, 1).map((p) => ({
              src: p.visual.hero,
              alt: p.visual.heroAlt,
            })),
          ]}
        />
      ) : null}
    </div>
  );
}
