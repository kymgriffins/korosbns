"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  LandingContent,
  LandingSection,
  LandingSectionEyebrow,
  LandingSectionHeader,
} from "@/layouts/landing-section";
import { LANDING_TYPOGRAPHY as T } from "@/constants/landing-typography";
import { fadeInUp, staggerContainer } from "@/motion/variants";
import {
  PROGRAMMES,
  PROGRAMMES_CLOSING,
  PROGRAMMES_LANDING,
  PROGRAMME_CARD_BLURBS,
  programmeHref,
} from "@/constants/programmes-content";
import { cn } from "@/utils";

export function ProgrammesLanding() {
  return (
    <div className="w-full bg-background">
      <LandingSection spacing="default" animateOnMount className="border-t-0">
        <LandingContent className="flex max-w-3xl flex-col gap-6">
          <LandingSectionEyebrow>Programmes</LandingSectionEyebrow>
          <h1 className={cn(T.heroTitle, "max-w-3xl text-balance")}>
            {PROGRAMMES_LANDING.headline}
          </h1>
          <p className={cn(T.lead, "max-w-2xl")}>{PROGRAMMES_LANDING.body}</p>
          <div>
            <Button asChild size="lg" className={cn(T.btnPrimary, "gap-2")}>
              <a href={PROGRAMMES_LANDING.exploreCta.href}>
                {PROGRAMMES_LANDING.exploreCta.label}
                <ArrowRight className="size-4" aria-hidden />
              </a>
            </Button>
          </div>
        </LandingContent>
      </LandingSection>

      <LandingSection id="programmes" spacing="default" aria-labelledby="programmes-grid-heading">
        <LandingSectionHeader
          title={<span id="programmes-grid-heading">Four programmes. One civic ecosystem.</span>}
          description="National tracking, county depth, newsroom capacity, and commissioned storytelling."
        />
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="mt-10 grid gap-6 sm:grid-cols-2"
        >
          {PROGRAMMES.map((programme) => (
            <motion.article
              key={programme.slug}
              variants={fadeInUp}
              id={programme.slug}
              className="flex flex-col gap-4 rounded-2xl border border-border/60 bg-card p-6 transition-shadow hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)]"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                {programme.name}
              </p>
              <h2 className="text-balance text-xl font-semibold tracking-tight text-foreground">
                {PROGRAMME_CARD_BLURBS[programme.slug]}
              </h2>
              <p className="line-clamp-4 text-sm leading-relaxed text-muted-foreground">
                {programme.body.slice(0, 220)}…
              </p>
              <div className="mt-auto pt-2">
                <Button asChild variant="outline" className="gap-2">
                  <Link href={programmeHref(programme.slug)}>
                    Explore {programme.name}
                    <ArrowRight className="size-4" aria-hidden />
                  </Link>
                </Button>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </LandingSection>

      <LandingSection spacing="default" className="bg-muted/30" aria-labelledby="partner-cta-heading">
        <LandingContent className="flex max-w-3xl flex-col gap-5">
          <LandingSectionEyebrow>Cross-programme</LandingSectionEyebrow>
          <h2 id="partner-cta-heading" className={cn(T.sectionTitle, "text-balance")}>
            {PROGRAMMES_CLOSING.headline}
          </h2>
          <p className={cn(T.lead, "max-w-2xl")}>{PROGRAMMES_CLOSING.body}</p>
          <div>
            <Button asChild size="lg" className={cn(T.btnPrimary, "gap-2")}>
              <Link href={PROGRAMMES_CLOSING.cta.href}>
                {PROGRAMMES_CLOSING.cta.label}
                <ArrowRight className="size-4" aria-hidden />
              </Link>
            </Button>
          </div>
        </LandingContent>
      </LandingSection>
    </div>
  );
}
