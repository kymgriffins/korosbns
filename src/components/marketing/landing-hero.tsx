"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "motion/react";
import { ArrowRight, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Routes } from "@/constants/routes";
import { CLOUDINARY_HERO_LANDING_VIDEO_MP4 } from "@/constants/cloudinary";

export default function LandingHero() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const videoScale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);
  const videoOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const textY = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const ctaY = useTransform(scrollYProgress, [0, 1], [0, 80]);
  const ctaOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  return (
    <section
      ref={sectionRef}
      className="relative h-[90vh] md:h-screen w-full overflow-hidden bg-background"
      aria-labelledby="landing-hero-heading"
    >
      {/* Video background */}
      <motion.div
        className="absolute inset-0 z-0"
        style={{ scale: videoScale, opacity: videoOpacity }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-background/20 z-10" />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-transparent z-10" />
        <video
          autoPlay muted loop playsInline
          onError={(e) => console.warn("Hero video failed to load:", e)}
          className="h-full w-full object-cover"
        >
          <source src={CLOUDINARY_HERO_LANDING_VIDEO_MP4} type="video/mp4" />
        </video>
      </motion.div>

      <div className="absolute inset-0 z-[1] bg-[radial-gradient(ellipse_at_top_right,color-mix(in_oklch,var(--primary)_8%,transparent),transparent_50%),radial-gradient(ellipse_at_bottom_left,color-mix(in_oklch,var(--primary)_5%,transparent),transparent_50%)]" />

      <div className="relative z-20 flex h-full items-center">
        <div className="max-w-[1400px] mx-auto px-6 md:px-16 w-full">
          <div className="grid gap-10 md:grid-cols-2 md:items-end">
            <motion.div style={{ y: textY }} className="max-w-xl">
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="mb-4 block text-xs font-semibold tracking-widest uppercase text-primary"
              >
                Youth-Led Civic Initiative
              </motion.span>
              <motion.h1
                id="landing-hero-heading"
                initial={{ opacity: 0, y: 40, filter: "blur(8px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="gusto-heading text-5xl leading-[1.05] tracking-tight text-foreground sm:text-6xl md:text-7xl lg:text-8xl"
              >
                Translating{" "}
                <span className="font-heading italic text-primary">numbers</span>
                <br />into civic<br />narratives.
              </motion.h1>
            </motion.div>

            <motion.div
              style={{ y: ctaY, opacity: ctaOpacity }}
              className="max-w-lg pb-8 md:pb-16"
            >
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="mb-8 text-base leading-relaxed text-foreground/70 sm:text-lg"
              >
                Budget Ndio Story is a youth-led initiative making Kenya&apos;s
                national budgets clear, actionable stories for civic engagement
                and democratic audit.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.45 }}
                className="flex flex-col gap-4 sm:flex-row"
              >
                <Link href={Routes.BudgetNews}>
                  <Button size="lg" variant="white" className="w-full gap-2 rounded-full px-8 py-6 text-base font-bold sm:w-auto">
                    Explore Budget News
                    <ArrowRight className="size-5" />
                  </Button>
                </Link>
                <Link href={Routes.Learn}>
                  <Button size="lg" variant="outline" className="w-full gap-2 rounded-full px-8 py-6 text-base font-bold sm:w-auto">
                    <BookOpen className="size-5" />
                    Start Learning
                  </Button>
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        className="absolute bottom-8 left-1/2 z-20 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center gap-2"
        >
          <span className="text-[10px] font-semibold uppercase tracking-widest text-foreground/40">Scroll</span>
          <div className="h-8 w-[1px] bg-foreground/20" />
        </motion.div>
      </motion.div>
    </section>
  );
}
