"use client";

import Link from "next/link";
import Image from "next/image";
import { LandingSeeMore } from "@/components/marketing/landing-see-more";
import { EditorialCtaBand, EditorialPill, PillButtonGroup } from "@/components/ui/editorial";
import { ProgrammesTeamTeaser } from "@/components/programmes/programmes-team-teaser";
import { ProgrammesContactSection } from "@/components/programmes/programmes-contact-section";
import {
  LandingContent,
  LandingSection,
  LandingSectionHeader,
} from "@/layouts/landing-section";
import { LANDING_TYPOGRAPHY as T } from "@/constants/landing-typography";
import {
  PROGRAMMES,
  PROGRAMMES_LANDING,
  PROGRAMME_CARD_BLURBS,
  programmeHref,
  type ProgrammeBlock,
  type ProgrammeSlug,
} from "@/content";
import { GsapHeroChoreography, GsapReveal } from "@/motion/gsap";
import { SECTION_SHELL_INNER } from "@/layouts/section-shell";
import { cn } from "@/utils";

const PROGRAMME_STEPS: Record<ProgrammeSlug, { step: string; tag: string }> = {
  connect: { step: "Track", tag: "National scope" },
  mashinani: { step: "Localise", tag: "4 counties" },
  "wanahabari-lab": { step: "Train", tag: "120–200 / year" },
  studios: { step: "Produce", tag: "8 formats" },
};

type ProgrammeCardProps = {
  programme: ProgrammeBlock;
  index: number;
};

function ProgrammeCard({ programme, index }: ProgrammeCardProps) {
  const alignEnd = index % 2 === 1;
  const blurb = PROGRAMME_CARD_BLURBS[programme.slug];
  const meta = PROGRAMME_STEPS[programme.slug];
  const href = programmeHref(programme.slug);

  return (
    <GsapReveal
      id={programme.slug}
      className="group grid gap-8 scroll-mt-28 md:grid-cols-2 md:items-center md:gap-12 lg:gap-16"
    >
      <Link
        href={href}
        className={cn(
          "relative block aspect-[4/3] overflow-hidden rounded-3xl border border-border/40 md:aspect-[3/2]",
          "transition-shadow duration-500 group-hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          alignEnd && "md:order-2",
        )}
        aria-label={`Explore ${programme.name}`}
      >
        <Image
          src={programme.visual.hero}
          alt={programme.visual.heroAlt}
          fill
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
          sizes="(max-width: 768px) 100vw, 50vw"
          priority={index === 0}
        />
      </Link>

      <div className={cn(alignEnd && "md:order-1")}>
        <div className="flex flex-wrap items-center gap-2">
          <span className={T.eyebrow}>{meta.step}</span>
          <span className="rounded-full border border-border/60 bg-muted/40 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            {meta.tag}
          </span>
        </div>
        <p className="mt-2 text-sm font-semibold text-primary">{programme.name}</p>
        <h2 className={cn(T.sectionTitle, "mt-1 text-balance")}>{programme.headline}</h2>
        <p className="mt-1 text-xs font-medium text-muted-foreground">{programme.eyebrow}</p>
        <p className={cn(T.lead, "mt-3 max-w-lg text-sm text-foreground/75")}>{blurb}</p>
        {programme.highlight ? (
          <p className="mt-3 max-w-lg border-l-2 border-primary/30 pl-3 text-xs leading-relaxed text-muted-foreground">
            {programme.highlight}
          </p>
        ) : null}
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <PillButtonGroup href={href} label={`Explore ${programme.name}`} />
        </div>
      </div>
    </GsapReveal>
  );
}

export function ProgrammesLanding() {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Budget Ndio Story",
    alternateName: "BNS",
    url: "https://budgetndiostory.org/programmes",
    logo: "https://budgetndiostory.org/logo.svg",
    description:
      "Kenya's leading youth civic initiative tracking national and county public spending, training journalists, and producing impact media.",
    sameAs: [
      "https://youtube.com/@budgetndiostory",
      "https://www.linkedin.com/company/budget-ndio-story/",
      "https://www.tiktok.com/@budget.ndio.story",
    ],
  };

  return (
    <div className="w-full scroll-smooth bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />

      <section className="relative overflow-hidden border-b border-border/30 bg-background py-20 md:py-28 lg:py-32">
        <div className={cn(SECTION_SHELL_INNER, "relative z-10")}>
          <GsapHeroChoreography className="max-w-3xl">
            <EditorialPill data-gsap-hero-content className="mb-4">
              Track · Localise · Train · Produce
            </EditorialPill>
            <h1
              data-gsap-hero-content
              className={cn(T.heroTitle, "max-w-3xl text-balance text-foreground")}
            >
              {PROGRAMMES_LANDING.headline}
            </h1>
            <p
              data-gsap-hero-content
              className={cn(T.lead, "mt-4 max-w-2xl text-base text-muted-foreground md:text-lg")}
            >
              {PROGRAMMES_LANDING.body}
            </p>
            <div data-gsap-hero-content className="mt-8">
              <LandingSeeMore
                href={PROGRAMMES_LANDING.exploreCta.href}
                label={PROGRAMMES_LANDING.exploreCta.label}
              />
            </div>
          </GsapHeroChoreography>
        </div>
      </section>

      <LandingSection id="programmes" aria-labelledby="programmes-heading">
        <LandingSectionHeader
          title={
            <>
              <span className="text-primary">Four programmes.</span> One civic ecosystem.
            </>
          }
          description="Each card links to live work — national tracking, county depth, journalist training, and impact production."
          className="mb-12 md:mb-16"
        />
        <LandingContent>
          <div className="space-y-16 md:space-y-24 lg:space-y-28">
            {PROGRAMMES.map((programme, index) => (
              <ProgrammeCard key={programme.slug} programme={programme} index={index} />
            ))}
          </div>
        </LandingContent>
      </LandingSection>

      <ProgrammesTeamTeaser />

      <LandingSection>
        <EditorialCtaBand
          eyebrow="Start now"
          title="Discover civic impact beyond the headlines."
          description="Explore programmes, learn the budget cycle, and follow public spending in your county."
          ctaHref="/learn"
          ctaLabel="Start Learning"
        />
      </LandingSection>

      <ProgrammesContactSection />
    </div>
  );
}
