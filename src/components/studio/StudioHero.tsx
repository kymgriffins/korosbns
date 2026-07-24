"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { fadeInUp, staggerContainer } from "@/motion/variants";
import { Button } from "@/components/ui/button";
import { BNS_STUDIO_HERO_IMAGE } from "@/constants/bns-studio-content";
import { LANDING_TYPOGRAPHY as T } from "@/constants/landing-typography";
import { getProgramme } from "@/constants/programmes-content";
import { cn } from "@/utils";

const studios = getProgramme("studios")!;

export function StudioHero() {
  return (
    <section className="relative flex min-h-[85svh] w-full items-end overflow-hidden border-b border-border/40 md:min-h-[92svh]">
      <Image
        src={BNS_STUDIO_HERO_IMAGE}
        alt={studios.visual.heroAlt}
        fill
        className="object-cover object-top"
        priority
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/75 to-background/25" />
      <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/40 to-transparent" />

      <div className="relative z-10 mx-auto w-full max-w-[1400px] px-6 pb-14 pt-28 md:px-16 md:pb-20">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="flex max-w-3xl flex-col gap-5"
        >
          <motion.p variants={fadeInUp} className="font-heading text-sm font-semibold text-foreground">
            BNS Studios
          </motion.p>
          <motion.h1 variants={fadeInUp} className={cn(T.heroTitle, "max-w-3xl")}>
            The stories behind the{" "}
            <span className={T.highlight}>numbers</span>
          </motion.h1>
          <motion.p variants={fadeInUp} className={cn(T.lead, "max-w-2xl text-base text-foreground/80 md:text-lg")}>
            {studios.body.slice(0, 260)}…
          </motion.p>
          <motion.div variants={fadeInUp} className="flex flex-wrap gap-3 pt-2">
            <Button
              size="lg"
              className={cn(T.btnPrimary, "px-8")}
              onClick={() =>
                document.getElementById("booking")?.scrollIntoView({ behavior: "smooth" })
              }
            >
              Commission BNS Studios
            </Button>
            <Button size="lg" variant="outline" className={cn(T.btnPrimary, "px-8")} asChild>
              <a href="mailto:info@budgetndiostory.org">info@budgetndiostory.org</a>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
