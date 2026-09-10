"use client";

import Image from "next/image";
import Link from "next/link";
import {
  EditorialCtaBand,
  EditorialPill,
  PillButtonGroup,
} from "@/components/ui/editorial";
import { ProgrammeProjectGrid } from "@/components/programmes/programme-project-grid";
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
  programmeHref,
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
 * Quiet editorial surface — hairlines, flat imagery, no card chrome.
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
          className={cn(HERO_SECTION_PADDING, "border-b border-border/50 bg-background")}
          aria-labelledby={`programme-${programme.slug}-heading`}
        >
          <div className={SECTION_SHELL_INNER}>
            <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-12 lg:gap-16">
              <div className="flex flex-col items-start gap-4 lg:col-span-5">
                <EditorialPill dot pulse variant="default">
                  {programme.eyebrow}
                </EditorialPill>
                <p className={cn(T.caption, "font-semibold uppercase tracking-wider text-muted-foreground")}>
                  {programme.name}
                </p>
                <h1
                  id={`programme-${programme.slug}-heading`}
                  className={cn(T.heroTitle, "text-balance text-foreground")}
                >
                  {programme.headline}
                </h1>
                <p className={cn(T.lead, "max-w-md text-foreground/75")}>
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

              <figure className="space-y-2.5 lg:col-span-7">
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted md:aspect-[16/10]">
                  <Image
                    src={programme.visual.hero}
                    alt={programme.visual.heroAlt}
                    fill
                    priority
                    className="object-cover object-center"
                    sizes="(max-width: 1024px) 100vw, 55vw"
                  />
                </div>
                <figcaption className={cn(T.caption, "text-muted-foreground")}>
                  {programme.visual.heroAlt}
                </figcaption>
              </figure>
            </div>
          </div>
        </section>
      ) : null}

      {isSectionVisible(pageId, "body") ? (
        <LandingSection
          aria-labelledby={`programme-${programme.slug}-body`}
          className="border-t border-border/50"
        >
          <div className="mx-auto max-w-3xl space-y-5">
            <h2
              id={`programme-${programme.slug}-body`}
              className={cn(T.sectionTitle, "text-balance text-foreground")}
            >
              What this programme does
            </h2>
            {programme.highlight ? (
              <p className={cn(T.lead, "text-foreground/75")}>{programme.highlight}</p>
            ) : null}
          </div>

          {programme.stats && programme.stats.length > 0 ? (
            <dl className="mt-12 grid gap-0 border-y border-border/50 sm:grid-cols-3">
              {programme.stats.map((stat) => (
                <div
                  key={`${stat.value}-${stat.label}`}
                  className="border-border/50 px-0 py-6 sm:border-r sm:px-6 sm:py-8 sm:first:pl-0 sm:last:border-r-0 sm:last:pr-0"
                >
                  <dt className="font-heading text-2xl font-bold tracking-tight text-foreground md:text-3xl">
                    {stat.value}
                  </dt>
                  <dd className={cn(T.caption, "mt-2 text-muted-foreground")}>
                    {stat.label}
                  </dd>
                </div>
              ))}
            </dl>
          ) : null}

          {programme.pillars && programme.pillars.length > 0 ? (
            <ul className="mt-12 divide-y divide-border/50 border-y border-border/50">
              {programme.pillars.slice(0, 4).map((pillar) => (
                <li
                  key={pillar.title}
                  className="grid gap-3 py-6 md:grid-cols-12 md:gap-8 md:py-8"
                >
                  <h3
                    className={cn(
                      "font-heading text-base font-bold text-foreground md:col-span-4 md:text-lg",
                    )}
                  >
                    {pillar.title}
                  </h3>
                  <p
                    className={cn(
                      T.lead,
                      "max-w-2xl text-foreground/75 md:col-span-8 md:text-base",
                    )}
                  >
                    {pillar.body}
                  </p>
                </li>
              ))}
            </ul>
          ) : null}
        </LandingSection>
      ) : null}

      {isSectionVisible(pageId, "projects") ? (
        <ProgrammeProjectGrid programmeSlug={programme.slug} />
      ) : null}

      {isSectionVisible(pageId, "otherProgrammes") && others.length > 0 ? (
        <LandingSection
          aria-labelledby="other-programmes-heading"
          className="border-t border-border/50"
        >
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
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3 lg:gap-12">
            {others.map((item) => (
              <Link
                key={item.slug}
                href={programmeHref(item.slug)}
                className="group flex flex-col gap-3 outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                  <Image
                    src={item.visual.hero}
                    alt={item.visual.heroAlt}
                    fill
                    className="object-cover object-center"
                    sizes="(max-width: 1024px) 100vw, 30vw"
                  />
                </div>
                <p className={cn(T.eyebrow, "text-muted-foreground")}>{item.name}</p>
                <p className={cn(T.itemTitle, "text-balance text-foreground")}>
                  {item.headline}
                </p>
                <span className="text-sm font-medium text-foreground transition-colors group-hover:text-primary">
                  View programme
                  <span aria-hidden className="ml-1">
                    →
                  </span>
                </span>
              </Link>
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
