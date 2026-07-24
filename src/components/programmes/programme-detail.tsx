"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  LandingContent,
  LandingSection,
} from "@/layouts/landing-section";
import { LANDING_TYPOGRAPHY as T } from "@/constants/landing-typography";
import type { ProgrammeBlock } from "@/constants/programmes-content";
import { PROGRAMMES_CLOSING } from "@/constants/programmes-content";
import { GsapHeroChoreography, GsapReveal, GsapStaggerReveal } from "@/motion/gsap";
import { cn } from "@/utils";

export function ProgrammeDetail({ programme }: { programme: ProgrammeBlock }) {
  return (
    <div className="w-full bg-background">
      <GsapHeroChoreography className="relative min-h-[75svh] overflow-hidden border-b border-border/40 md:min-h-[90svh]">
        <div data-gsap-hero-media className="absolute inset-0">
          <Image
            src={programme.visual.hero}
            alt={programme.visual.heroAlt}
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/20" />
          <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/40 to-transparent" />
        </div>

        <div
          data-gsap-hero-content
          className="relative z-10 mx-auto flex min-h-[75svh] max-w-[1400px] flex-col justify-end px-6 pb-14 pt-28 md:min-h-[90svh] md:px-16 md:pb-20"
        >
          <div className="flex max-w-3xl flex-col gap-5">
            <Link
              href="/programmes"
              className="inline-flex w-fit items-center gap-1.5 text-sm text-foreground/80 transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <ArrowLeft className="size-4" aria-hidden />
              All programmes
            </Link>
            <p className="text-sm font-medium text-foreground/70">{programme.eyebrow}</p>
            <p className="font-heading text-sm font-semibold text-foreground">{programme.name}</p>
            <h1 className={cn(T.heroTitle, "max-w-3xl")}>{programme.headline}</h1>
          </div>
        </div>
      </GsapHeroChoreography>

      <GsapStaggerReveal className="mx-auto grid max-w-[1400px] grid-cols-3 gap-2 px-6 py-4 md:gap-3 md:px-16 md:py-6">
        {programme.visual.gallery.map((shot) => (
          <div
            key={shot.src}
            data-gsap-item
            className="relative aspect-[5/3] overflow-hidden rounded-xl border border-border/40 md:aspect-[16/9] md:rounded-2xl"
          >
            <Image
              src={shot.src}
              alt={shot.alt}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 33vw, 30vw"
            />
          </div>
        ))}
      </GsapStaggerReveal>

      <LandingSection spacing="default" className="border-t-0">
        <GsapReveal>
          <LandingContent className="flex max-w-3xl flex-col gap-6">
            <p className={cn(T.lead, "max-w-2xl text-base text-foreground/80 md:text-lg")}>
              {programme.body}
            </p>
            {programme.formats ? (
              <p className="text-sm font-medium text-foreground md:text-base">{programme.formats}</p>
            ) : null}
            {programme.highlight ? (
              <p className="rounded-xl border border-border/60 bg-muted/40 px-4 py-3 text-sm font-medium leading-relaxed text-foreground md:text-base">
                {programme.highlight}
              </p>
            ) : null}
            <div className="flex flex-wrap gap-3 pt-2">
              <Button asChild size="lg" className={cn(T.btnPrimary, "gap-2")}>
                <Link href={programme.cta.href}>
                  {programme.cta.label}
                  <ArrowRight className="size-4" aria-hidden />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/programmes">View all programmes</Link>
              </Button>
            </div>
          </LandingContent>
        </GsapReveal>
      </LandingSection>

      <LandingSection spacing="default" className="bg-muted/30">
        <GsapReveal>
          <LandingContent className="flex max-w-2xl flex-col gap-4">
            <h2 className={T.sectionTitle}>{PROGRAMMES_CLOSING.headline}</h2>
            <p className="text-sm leading-relaxed text-muted-foreground md:text-base">
              {PROGRAMMES_CLOSING.body}
            </p>
            <Button asChild variant="outline" className="w-fit gap-2">
              <Link href={PROGRAMMES_CLOSING.cta.href}>
                {PROGRAMMES_CLOSING.cta.label}
                <ArrowRight className="size-4" aria-hidden />
              </Link>
            </Button>
          </LandingContent>
        </GsapReveal>
      </LandingSection>
    </div>
  );
}
