"use client";

import { useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { EditorialCtaBand, EditorialPill, PillButtonGroup } from "@/components/ui/editorial";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { LandingSection } from "@/layouts/landing-section";
import { ProgrammeOtherProgrammes } from "@/components/programmes/programme-other-programmes";
import { LANDING_TYPOGRAPHY as T } from "@/constants/landing-typography";
import {
  PROGRAMMES_CLOSING,
  PROGRAMME_CARD_BLURBS,
  type ProgrammeBlock,
} from "@/content";
import { getAllReports } from "@/data/reports-bulletin";
import { studiosEvidenceData } from "@/data/studios-evidence";
import { HERO_SECTION_PADDING, SECTION_SHELL_INNER, SECTION_SHELL_PADDING } from "@/layouts/section-shell";
import { cn } from "@/utils";

function splitBody(body: string): string[] {
  const chunks = body
    .split(/(?<=\.)\s+/)
    .map((s) => s.trim())
    .filter(Boolean);
  if (chunks.length <= 1) return [body];
  const paragraphs: string[] = [];
  for (let i = 0; i < chunks.length; i += 2) {
    paragraphs.push(chunks.slice(i, i + 2).join(" "));
  }
  return paragraphs;
}

function formatChips(formats?: string): string[] {
  if (!formats) return [];
  return formats
    .split(/[·•|,]/)
    .map((s) => s.trim())
    .filter(Boolean);
}

export function ProgrammeDetail({ programme }: { programme: ProgrammeBlock }) {
  const paragraphs = splitBody(programme.body);
  const chips = formatChips(programme.formats);
  const [lede, ...rest] = paragraphs;

  const evidence = useMemo(() => {
    const lane = studiosEvidenceData
      .getProgrammeLanes()
      .find((l) => l.programmeSlug === programme.slug);
    let reportCount = 0;
    try {
      reportCount = getAllReports().length;
    } catch {
      reportCount = 0;
    }
    return {
      studioWorks: lane?.projects.length ?? 0,
      reportCount,
    };
  }, [programme.slug]);

  const faqSchema =
    programme.faqs && programme.faqs.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: programme.faqs.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }
      : null;

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: programme.headline,
    description: programme.seoDescription,
    image: [programme.visual.hero],
    author: { "@type": "Organization", name: "Budget Ndio Story" },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "/" },
      { "@type": "ListItem", position: 2, name: "Programmes", item: "/programmes" },
      {
        "@type": "ListItem",
        position: 3,
        name: programme.name,
        item: `/programmes/${programme.slug}`,
      },
    ],
  };

  return (
    <div className="w-full scroll-smooth bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {faqSchema ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      ) : null}

      {/* Hero */}
      <section
        className={cn(
          HERO_SECTION_PADDING,
          "border-b border-border/30 bg-background",
        )}
      >
        <div className={cn(SECTION_SHELL_INNER, "grid gap-8 lg:grid-cols-12 lg:gap-12")}>
          <div className="space-y-5 lg:col-span-7">
            <nav aria-label="Breadcrumb">
              <ol className="flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
                <li>
                  <Link href="/" className="transition-colors hover:text-foreground">
                    Home
                  </Link>
                </li>
                <li aria-hidden>/</li>
                <li>
                  <Link
                    href="/programmes"
                    className="transition-colors hover:text-foreground"
                  >
                    Programmes
                  </Link>
                </li>
                <li aria-hidden>/</li>
                <li aria-current="page" className="font-semibold text-foreground">
                  {programme.name}
                </li>
              </ol>
            </nav>
            <Link
              href="/programmes"
              className="inline-flex w-fit items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <ArrowLeft className="size-4" aria-hidden />
              All programmes
            </Link>
            <EditorialPill className="mb-0">{programme.name}</EditorialPill>
            <h1 className={cn(T.heroTitle, "text-balance text-foreground")}>
              {programme.headline}
            </h1>
            {lede ? (
              <p className="max-w-2xl text-base leading-relaxed text-foreground/85 md:text-lg">
                {lede}
              </p>
            ) : null}
          </div>

          <aside className="rounded-3xl border border-border/40 bg-muted/25 p-5 lg:col-span-5 lg:self-end">
            <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Programme scorecard
            </p>
            <dl className="space-y-3 text-sm">
              <div>
                <dt className="text-muted-foreground">Focus</dt>
                <dd className="font-semibold text-foreground">{programme.eyebrow}</dd>
              </div>
              {programme.highlight ? (
                <div>
                  <dt className="text-muted-foreground">Key indicator</dt>
                  <dd className="font-semibold leading-snug text-foreground">
                    {programme.highlight}
                  </dd>
                </div>
              ) : null}
              {programme.audience ? (
                <div>
                  <dt className="text-muted-foreground">Who it&apos;s for</dt>
                  <dd className="leading-snug text-foreground/85">{programme.audience}</dd>
                </div>
              ) : null}
            </dl>
            <div className="mt-5">
              <PillButtonGroup href={programme.cta.href} label={programme.cta.label} />
            </div>
          </aside>
        </div>
      </section>

      {/* Stats strip */}
      {programme.stats && programme.stats.length > 0 ? (
        <section className="border-b border-border/30" aria-label={`${programme.name} in numbers`}>
          <div className={cn(SECTION_SHELL_INNER, "grid grid-cols-1 gap-6 py-8 sm:grid-cols-3 md:py-10")}>
            {programme.stats.map((stat) => (
              <div key={stat.label}>
                <p className="text-3xl font-extrabold tracking-tight text-foreground md:text-4xl">
                  {stat.value}
                </p>
                <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {/* Hero image + gallery */}
      <div className={cn(SECTION_SHELL_INNER, "py-8 md:py-10")}>
        <div className="relative aspect-[16/10] w-full overflow-hidden rounded-3xl border border-border/30">
          <Image
            src={programme.visual.hero}
            alt={programme.visual.heroAlt}
            fill
            priority
            className="object-cover"
            sizes="(max-width: 1200px) 100vw, 1200px"
          />
        </div>
        {programme.visual.gallery.length > 0 ? (
          <div className="mt-3 grid grid-cols-3 gap-3">
            {programme.visual.gallery.map((item) => (
              <div
                key={item.src}
                className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-border/30"
              >
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 33vw, 400px"
                />
              </div>
            ))}
          </div>
        ) : null}
      </div>

      {/* Story */}
      <section className={cn(SECTION_SHELL_PADDING, "border-t border-border/30")}>
        <div className={cn(SECTION_SHELL_INNER, "max-w-3xl space-y-6")}>
          <p className="text-xs font-semibold uppercase tracking-wider text-primary">
            01 / The story
          </p>
          {rest.map((paragraph) => (
            <p
              key={paragraph.slice(0, 48)}
              className="text-base leading-relaxed text-foreground/85 md:text-lg"
            >
              {paragraph}
            </p>
          ))}

          {chips.length > 0 ? (
            <div className="border-t border-border/30 pt-6">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                BNS Studios content types
              </p>
              <ul className="flex flex-wrap gap-2">
                {chips.map((chip) => (
                  <li
                    key={chip}
                    className="rounded-full border border-border/60 bg-muted/30 px-3 py-1 text-xs font-medium text-foreground"
                  >
                    {chip}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      </section>

      {/* Pillars */}
      {programme.pillars && programme.pillars.length > 0 ? (
        <section className={cn(SECTION_SHELL_PADDING, "border-t border-border/30 bg-muted/20")}>
          <div className={SECTION_SHELL_INNER}>
            <p className="text-xs font-semibold uppercase tracking-wider text-primary">
              02 / What we do
            </p>
            <h2 className="mt-2 max-w-2xl text-2xl font-extrabold tracking-tight text-foreground md:text-3xl">
              The pillars of {programme.name}
            </h2>
            <div className="mt-8 grid gap-5 md:grid-cols-3">
              {programme.pillars.map((pillar, i) => (
                <article
                  key={pillar.title}
                  className="rounded-2xl border border-border/40 bg-card p-6"
                >
                  <p className="text-xs font-extrabold tracking-[0.2em] text-primary">
                    {String(i + 1).padStart(2, "0")}
                  </p>
                  <h3 className="mt-2 text-lg font-bold text-foreground">
                    {pillar.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {pillar.body}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {/* Process */}
      {programme.process && programme.process.length > 0 ? (
        <section className={cn(SECTION_SHELL_PADDING, "border-t border-border/30")}>
          <div className={cn(SECTION_SHELL_INNER, "max-w-3xl")}>
            <p className="text-xs font-semibold uppercase tracking-wider text-primary">
              03 / How it works
            </p>
            <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-foreground md:text-3xl">
              From signal to story
            </h2>
            <ol className="mt-8 space-y-7">
              {programme.process.map((step, i) => (
                <li key={step.title} className="grid grid-cols-[3rem_1fr] gap-3">
                  <span className="text-sm font-extrabold tracking-[0.15em] text-primary">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className="text-base font-bold text-foreground md:text-lg">
                      {step.title}
                    </h3>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground md:text-base">
                      {step.body}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>
      ) : null}

      {/* Evidence */}
      <section className={cn(SECTION_SHELL_PADDING, "border-t border-border/30 bg-muted/20")}>
        <div className={SECTION_SHELL_INNER}>
          <p className="text-xs font-semibold uppercase tracking-wider text-primary">
            04 / Evidence
          </p>
          <h2 className="mt-2 max-w-2xl text-2xl font-extrabold tracking-tight text-foreground md:text-3xl">
            See the work
          </h2>
          <div className="mt-8 grid gap-5 sm:grid-cols-2">
            <Link
              href="/bns-studio/work"
              className="group rounded-2xl border border-border/40 bg-card p-6 transition-colors hover:border-primary/50"
            >
              <p className="text-3xl font-extrabold tracking-tight text-foreground">
                {evidence.studioWorks}
              </p>
              <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Studio productions in this lane
              </p>
              <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-primary group-hover:underline">
                Browse productions
                <ArrowUpRight className="size-3.5" aria-hidden />
              </span>
            </Link>
            <Link
              href="/reports"
              className="group rounded-2xl border border-border/40 bg-card p-6 transition-colors hover:border-primary/50"
            >
              <p className="text-3xl font-extrabold tracking-tight text-foreground">
                {evidence.reportCount}
              </p>
              <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Reports & scorecards in the library
              </p>
              <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-primary group-hover:underline">
                Open the library
                <ArrowUpRight className="size-3.5" aria-hidden />
              </span>
            </Link>
          </div>
          <p className="mt-4 text-xs text-muted-foreground">
            {PROGRAMME_CARD_BLURBS[programme.slug]}
          </p>
        </div>
      </section>

      {/* FAQ */}
      {programme.faqs && programme.faqs.length > 0 ? (
        <section className={cn(SECTION_SHELL_PADDING, "border-t border-border/30")}>
          <div className={cn(SECTION_SHELL_INNER, "max-w-3xl")}>
            <p className="text-xs font-semibold uppercase tracking-wider text-primary">
              05 / Questions
            </p>
            <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-foreground md:text-3xl">
              Asked about {programme.name}
            </h2>
            <Accordion type="single" collapsible className="mt-6 w-full space-y-3">
              {programme.faqs.map((faq, i) => (
                <AccordionItem
                  key={faq.q}
                  value={`item-${i}`}
                  className="rounded-xl border border-border/40 px-4"
                >
                  <AccordionTrigger className="text-left text-sm font-bold text-foreground hover:no-underline md:text-base">
                    {faq.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                    {faq.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>
      ) : null}

      <ProgrammeOtherProgrammes currentSlug={programme.slug} />

      <LandingSection>
        <EditorialCtaBand
          eyebrow="The BNS ecosystem"
          title={PROGRAMMES_CLOSING.headline}
          description={PROGRAMMES_CLOSING.body}
          ctaHref={PROGRAMMES_CLOSING.cta.href}
          ctaLabel={PROGRAMMES_CLOSING.cta.label}
        />
      </LandingSection>
    </div>
  );
}
