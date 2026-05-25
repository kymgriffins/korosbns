"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/ui/button";
import {
  fadeInUp,
  staggerContainer,
  staggerFast,
} from "@/motion/variants";
import {
  CLOUDINARY_HERO_LANDING_VIDEO_MP4,
  CLOUDINARY_HERO_LANDING_VIDEO_WEBM,
} from "@/constants/cloudinary";

export function HeroSection7() {
  return (
    <section
      className="relative min-h-[100dvh] w-full overflow-hidden bg-background text-foreground pt-20 md:pt-24"
      aria-labelledby="landing-hero-heading"
    >
      <div
        className="pointer-events-none absolute inset-0 z-0"
        aria-hidden
      >
        <div className="absolute inset-0 z-10 bg-gradient-to-b from-background/75 via-background/55 to-background" />
        <video
          autoPlay
          muted
          loop
          playsInline
          className="h-full w-full object-cover opacity-40 dark:opacity-35"
        >
          <source
            src={CLOUDINARY_HERO_LANDING_VIDEO_WEBM}
            type="video/webm"
          />
          <source
            src={CLOUDINARY_HERO_LANDING_VIDEO_MP4}
            type="video/mp4"
          />
        </video>
      </div>

      <div className="relative z-10 mx-auto flex min-h-[calc(100dvh-5rem)] w-full max-w-[1400px] flex-col justify-center gap-10 px-6 pb-16 md:gap-14 md:px-16 md:pb-20">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="grid w-full gap-8 lg:grid-cols-2 lg:gap-12 lg:items-end"
        >
          <motion.div variants={fadeInUp} className="flex flex-col gap-5">
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1.5 text-xs font-bold uppercase tracking-widest text-primary backdrop-blur-md">
              <Sparkles className="size-3.5 animate-pulse" />
              <span>Civic Movement</span>
            </div>
            <h1
              id="landing-hero-heading"
              className="gusto-heading max-w-xl tracking-[-0.03em] leading-[1.05] text-foreground"
            >
              Translating{" "}
              <span className="font-heading italic text-primary">numbers</span>{" "}
              into civic narratives.
            </h1>
          </motion.div>

          <motion.div variants={fadeInUp} className="flex flex-col gap-6 lg:gap-8">
            <p className="max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              Budget Ndio Story is a youth-led initiative in Kenya turning complex
              national budgets into clear, actionable stories for county engagement
              and democratic audit.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <Link href="/events" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  className="w-full gap-2 rounded-full px-8 py-6 text-base font-bold sm:w-auto"
                >
                  Explore Events
                  <ArrowRight className="size-5" />
                </Button>
              </Link>
              <Link href="/about" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full rounded-full px-8 py-6 text-base font-bold sm:w-auto"
                >
                  How We Work
                </Button>
              </Link>
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          variants={staggerFast}
          initial="hidden"
          animate="visible"
          className="w-full"
        >
          <motion.div
            variants={fadeInUp}
            className="relative w-full overflow-hidden rounded-2xl border border-border/60 bg-card/30 shadow-lg backdrop-blur-sm md:rounded-3xl"
          >
            <div className="aspect-[21/9] w-full min-h-[12rem] md:min-h-[16rem]">
              <video
                autoPlay
                muted
                loop
                playsInline
                className="h-full w-full object-cover"
              >
                <source
                  src={CLOUDINARY_HERO_LANDING_VIDEO_WEBM}
                  type="video/webm"
                />
                <source
                  src={CLOUDINARY_HERO_LANDING_VIDEO_MP4}
                  type="video/mp4"
                />
              </video>
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
