"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import { EditorialCtaBand, EditorialPill, PillButtonGroup } from "@/components/ui/editorial";
import { LandingSection } from "@/layouts/landing-section";
import { ProgrammeOtherProgrammes } from "@/components/programmes/programme-other-programmes";
import { LANDING_TYPOGRAPHY as T } from "@/constants/landing-typography";
import { PROGRAMMES_CLOSING, type ProgrammeBlock } from "@/content";
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

  return (
    <div className="w-full scroll-smooth bg-background">
      <section
        className={cn(
          HERO_SECTION_PADDING,
          "border-b border-border/30 bg-background",
        )}
      >
        <div className={cn(SECTION_SHELL_INNER, "grid gap-8 lg:grid-cols-12 lg:gap-12")}>
          <div className="space-y-5 lg:col-span-7">
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
            </dl>
            <div className="mt-5">
              <PillButtonGroup href={programme.cta.href} label={programme.cta.label} />
            </div>
          </aside>
        </div>
      </section>

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
      </div>

      <section className={cn(SECTION_SHELL_PADDING, "border-t border-border/30")}>
        <div className={cn(SECTION_SHELL_INNER, "max-w-3xl space-y-6")}>
          {paragraphs.map((paragraph) => (
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
