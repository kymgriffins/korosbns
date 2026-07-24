"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  fadeInUp,
  staggerContainer,
} from "@/motion/variants";
import { CLOUDINARY_HERO_LANDING_VIDEO_MP4 } from "@/constants/cloudinary";
import { PROGRAMMES_LANDING } from "@/constants/programmes-content";
import { LANDING_TYPOGRAPHY as T } from "@/constants/landing-typography";
import { cn } from "@/utils";

/** Full-bleed Civic Studio hero — brand, one claim, one CTA, atmosphere media. */
export default function LandingHero() {
  return (
    <section
      className="relative flex min-h-[100svh] w-full items-end overflow-hidden border-b border-border/40"
      aria-labelledby="landing-hero-heading"
    >
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 size-full object-cover"
        onError={(e) => {
          console.warn("Hero video failed to load:", e);
        }}
      >
        <source src={CLOUDINARY_HERO_LANDING_VIDEO_MP4} type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/30" />
      <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/40 to-transparent" />

      <div className="relative z-10 mx-auto w-full max-w-[1400px] px-6 pb-16 pt-28 md:px-16 md:pb-24 md:pt-32">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="flex max-w-3xl flex-col gap-6"
        >
          <motion.p variants={fadeInUp} className="font-heading text-sm font-semibold tracking-tight text-foreground">
            Budget Ndio Story
          </motion.p>
          <motion.h1
            id="landing-hero-heading"
            variants={fadeInUp}
            className={cn(T.heroTitle, "max-w-3xl")}
          >
            Follow the budget.{" "}
            <span className={T.highlight}>Find the story.</span>
          </motion.h1>
          <motion.p variants={fadeInUp} className={cn(T.lead, "max-w-xl text-base text-foreground/80 md:text-lg")}>
            {PROGRAMMES_LANDING.body}
          </motion.p>
          <motion.div variants={fadeInUp} className="flex flex-wrap gap-3 pt-2">
            <Button asChild size="lg" variant="white" className={T.btnHero}>
              <Link href="/programmes">
                Explore our programmes
                <ArrowRight className="size-5" aria-hidden />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className={cn(T.btnPrimary, "border-foreground/20 bg-background/60 backdrop-blur-sm")}>
              <Link href="/reports">Open reports</Link>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
