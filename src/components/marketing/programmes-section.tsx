"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  LandingContent,
  LandingSection,
} from "@/layouts/landing-section";
import { LANDING_TYPOGRAPHY as T } from "@/constants/landing-typography";
import {
  PROGRAMMES,
  PROGRAMME_CARD_BLURBS,
  programmeHref,
} from "@/constants/programmes-content";
import { fadeInUp, staggerContainer } from "@/motion/variants";
import { cn } from "@/utils";

/** Homepage programmes — image-led bands, not equal card grids. */
export function ProgrammesSection() {
  return (
    <LandingSection id="programmes" spacing="loose" aria-labelledby="home-programmes-heading" className="border-t-0">
      <LandingContent className="mb-12 max-w-3xl md:mb-16">
        <h2 id="home-programmes-heading" className={T.sectionTitle}>
          Four programmes. One civic ecosystem.
        </h2>
        <p className={cn(T.lead, "mt-4 max-w-2xl text-base text-foreground/75")}>
          National tracking, county depth, newsroom capacity, and commissioned storytelling —
          each with a job, each with a face.
        </p>
      </LandingContent>

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        className="flex flex-col gap-10 md:gap-14"
      >
        {PROGRAMMES.map((programme, index) => {
          const imageLeft = index % 2 === 0;
          return (
            <motion.article
              key={programme.slug}
              variants={fadeInUp}
              className="grid items-stretch gap-6 md:grid-cols-12 md:gap-8"
            >
              <Link
                href={programmeHref(programme.slug)}
                className={cn(
                  "group relative block overflow-hidden rounded-2xl border border-border/50 md:col-span-7",
                  !imageLeft && "md:order-2",
                  index === 0 ? "min-h-[22rem] md:min-h-[28rem]" : "min-h-[18rem] md:min-h-[22rem]",
                )}
              >
                <Image
                  src={programme.visual.hero}
                  alt={programme.visual.heroAlt}
                  fill
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                  sizes="(max-width: 768px) 100vw, 60vw"
                  priority={index === 0}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-5 md:p-7">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-foreground/80">
                    {programme.name}
                  </p>
                  <p className="mt-2 max-w-md font-heading text-xl font-semibold tracking-tight text-foreground md:text-2xl">
                    {PROGRAMME_CARD_BLURBS[programme.slug]}
                  </p>
                </div>
              </Link>

              <div
                className={cn(
                  "flex flex-col justify-center gap-4 md:col-span-5",
                  !imageLeft && "md:order-1",
                )}
              >
                <p className="text-sm font-medium text-muted-foreground">{programme.eyebrow}</p>
                <h3 className="font-heading text-2xl font-bold tracking-tight text-foreground md:text-3xl">
                  {programme.headline}
                </h3>
                <p className="text-sm leading-relaxed text-foreground/70 md:text-base">
                  {programme.body.slice(0, 180)}…
                </p>
                <div>
                  <Button asChild variant="outline" className="gap-2">
                    <Link href={programmeHref(programme.slug)}>
                      Explore {programme.name}
                      <ArrowRight className="size-4" aria-hidden />
                    </Link>
                  </Button>
                </div>
              </div>
            </motion.article>
          );
        })}
      </motion.div>

      <LandingContent className="mt-12 md:mt-16">
        <Button asChild size="lg" className={cn(T.btnPrimary, "gap-2")}>
          <Link href="/programmes">
            View all programmes
            <ArrowRight className="size-4" aria-hidden />
          </Link>
        </Button>
      </LandingContent>
    </LandingSection>
  );
}
