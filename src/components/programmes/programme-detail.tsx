"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import { EditorialCtaBand, EditorialPill, PillButtonGroup } from "@/components/ui/editorial";
import { LandingSection } from "@/layouts/landing-section";
import { ProgrammeOtherProgrammes } from "@/components/programmes/programme-other-programmes";
import { LANDING_TYPOGRAPHY as T } from "@/constants/landing-typography";
import type { ProgrammeBlock } from "@/content";
import { GsapReveal } from "@/motion/gsap";
import { SECTION_SHELL_INNER, SECTION_SHELL_PADDING } from "@/layouts/section-shell";
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

const READ_MINUTES: Record<string, number> = {
  connect: 4,
  mashinani: 4,
  "wanahabari-lab": 3,
  studios: 3,
};

export function ProgrammeDetail({ programme }: { programme: ProgrammeBlock }) {
  const paragraphs = splitBody(programme.body);
  const chips = formatChips(programme.formats);
  const readMinutes = READ_MINUTES[programme.slug] ?? 3;

  return (
    <div className="w-full scroll-smooth bg-background">
      {/* Article header */}
      <section
        className={cn(
          SECTION_SHELL_PADDING,
          "border-b border-border/30 bg-background pt-24 md:pt-28",
        )}
      >
        <div className={cn(SECTION_SHELL_INNER, "max-w-4xl space-y-5")}>
          <Link
            href="/programmes"
            className="inline-flex w-fit items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <ArrowLeft className="size-4" aria-hidden />
            All programmes
          </Link>
          <EditorialPill className="mb-0">{programme.eyebrow}</EditorialPill>
          <h1 className={cn(T.heroTitle, "text-balance text-foreground")}>
            {programme.headline}
          </h1>
        </div>
      </section>

      {/* Hero image */}
      <div className={cn(SECTION_SHELL_INNER, "py-8 md:py-10")}>
        <GsapReveal>
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
        </GsapReveal>
      </div>

      {/* Body + sidebar */}
      <section className={cn(SECTION_SHELL_PADDING, "border-t border-border/30")}>
        <div className={cn(SECTION_SHELL_INNER, "grid gap-10 lg:grid-cols-12 lg:gap-16")}>
          <article className="space-y-6 lg:col-span-7">
            {paragraphs.map((paragraph) => (
              <p
                key={paragraph.slice(0, 48)}
                className="text-base leading-relaxed text-foreground/85 md:text-lg"
              >
                {paragraph}
              </p>
            ))}
            {programme.highlight ? (
              <blockquote className="border-l-4 border-primary/40 pl-5 text-base font-medium leading-relaxed text-foreground md:text-lg">
                {programme.highlight}
              </blockquote>
            ) : null}
          </article>

          <aside className="space-y-6 lg:col-span-5 lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-3xl border border-border/40 bg-muted/30 p-6">
              <dl className="space-y-4 text-sm">
                <div className="flex justify-between gap-4 border-b border-border/40 pb-3">
                  <dt className="text-muted-foreground">Read time</dt>
                  <dd className="font-semibold text-foreground">{readMinutes} min</dd>
                </div>
                <div className="flex justify-between gap-4 border-b border-border/40 pb-3">
                  <dt className="text-muted-foreground">Programme</dt>
                  <dd className="font-semibold text-foreground">{programme.name}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">Focus</dt>
                  <dd className="text-right font-semibold text-foreground">{programme.eyebrow}</dd>
                </div>
              </dl>
            </div>

            {chips.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {chips.map((chip) => (
                  <span
                    key={chip}
                    className="rounded-full border border-border/60 bg-background px-3 py-1 text-xs font-medium text-foreground"
                  >
                    {chip}
                  </span>
                ))}
              </div>
            ) : null}

            <PillButtonGroup href={programme.cta.href} label={programme.cta.label} />
          </aside>
        </div>
      </section>

      {/* Gallery strip — mobile-friendly horizontal scroll */}
      {programme.visual.gallery.length > 0 ? (
        <section className="border-t border-border/30 py-8 md:py-10">
          <div
            className={cn(
              SECTION_SHELL_INNER,
              "flex gap-3 overflow-x-auto pb-2 scrollbar-hide snap-x snap-mandatory md:gap-4",
            )}
          >
            {programme.visual.gallery.map((shot) => (
              <div
                key={shot.src}
                className="relative aspect-[4/3] w-64 shrink-0 snap-start overflow-hidden rounded-2xl border border-border/30 md:w-80 md:rounded-3xl"
              >
                <Image
                  src={shot.src}
                  alt={shot.alt}
                  fill
                  className="object-cover"
                  sizes="320px"
                />
              </div>
            ))}
          </div>
        </section>
      ) : null}

      <ProgrammeOtherProgrammes currentSlug={programme.slug} />

      <LandingSection>
        <EditorialCtaBand
          eyebrow="Start now"
          title={`Ready to engage with ${programme.name}?`}
          description="Join Kenya's youth-led civic platform — track public spending, learn the budget cycle, and turn numbers into stories."
          ctaHref={programme.cta.href}
          ctaLabel={programme.cta.label}
          images={programme.visual.gallery.slice(0, 2).map((g) => ({
            src: g.src,
            alt: g.alt,
          }))}
        />
      </LandingSection>
    </div>
  );
}
