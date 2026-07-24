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
import { LANDING_TYPOGRAPHY as T } from "@/constants/landing-typography";
import { SECTION_SHELL_INNER } from "@/layouts/landing-section";
import { cn } from "@/utils";

/**
 * Landing hero — Mason-inspired composition (large rounded media + overlay type)
 * with Budget Ndio Story branding colors and copy.
 */
export default function LandingHero() {
  return (
    <section
      className="relative w-full overflow-hidden border-b border-border/40 bg-background text-foreground"
      aria-labelledby="landing-hero-heading"
    >
      <div className={cn(SECTION_SHELL_INNER, "pb-10 pt-4 md:pb-14 md:pt-6")}>
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="relative min-h-[70svh] overflow-hidden rounded-[1.75rem] border border-border/50 md:min-h-[78svh] md:rounded-[2rem]"
        >
          <video
            autoPlay
            muted
            loop
            playsInline
            onError={(e) => {
              console.warn("Hero video failed to load:", e);
            }}
            className="absolute inset-0 size-full object-cover"
          >
            <source src={CLOUDINARY_HERO_LANDING_VIDEO_MP4} type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/55 to-background/10" />
          <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-background/25 to-transparent" />

          <div className="relative z-10 flex min-h-[70svh] flex-col justify-end gap-6 p-6 md:min-h-[78svh] md:p-10 lg:p-14">
            <motion.div variants={fadeInUp} className="flex max-w-2xl flex-col gap-4">
              <span className="font-heading text-sm font-semibold text-foreground">
                Budget Ndio Story
              </span>
              <h1 id="landing-hero-heading" className={cn(T.heroTitle, "max-w-2xl text-foreground")}>
                Follow the budget.{" "}
                <span className={T.highlight}>Find the story.</span>
              </h1>
              <p className="max-w-lg text-sm leading-relaxed text-foreground/80 md:text-base">
                Kenya&apos;s public money moves fast, and mostly out of sight. We track it —
                nationally and in four select counties — and turn it into stories, data,
                and training young Kenyans, journalists, government, and partners actually use.
              </p>
            </motion.div>

            <motion.div variants={fadeInUp} className="flex flex-wrap items-center gap-3">
              <Button asChild size="lg" variant="white" className={cn(T.btnHero, "rounded-full")}>
                <Link href="/programmes">
                  Explore our programmes
                  <ArrowRight className="size-5" aria-hidden />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="rounded-full border-foreground/20 bg-background/70 backdrop-blur-sm"
              >
                <Link href="/reports">Open reports</Link>
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
