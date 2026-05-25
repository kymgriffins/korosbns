"use client";

import React, { useRef } from "react";
import Image from "next/image";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
} from "motion/react";
import { Button } from "@/ui/button";
import { ArrowRight, Sparkles, Landmark, BarChart3, Users } from "lucide-react";
import Link from "next/link";
import {
  fadeInUp,
  fadeInDelay5,
  staggerContainer,
} from "@/motion/variants";
import { CLOUDINARY_HERO_BARAZA } from "@/constants/cloudinary";

export default function LandingHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.05]);

  return (
    <section
      ref={containerRef}
      className="relative h-screen w-full overflow-hidden flex flex-col justify-between bg-background text-foreground px-6 md:px-16 pt-28 pb-12 md:pb-16"
    >
      <motion.div
        className="absolute inset-0 z-0"
        style={shouldReduceMotion ? undefined : { y, scale }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/50 to-background z-10" />
        <Image
          src={CLOUDINARY_HERO_BARAZA}
          alt=""
          fill
          priority
          className="object-cover object-center opacity-80 dark:opacity-70"
          sizes="100vw"
        />
      </motion.div>

      <div className="h-4 z-20 pointer-events-none" />

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="relative z-20 w-full max-w-6xl mx-auto flex flex-col items-start text-left mt-auto mb-auto"
        style={shouldReduceMotion ? undefined : { opacity }}
      >
        <motion.div
          variants={fadeInUp}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest mb-6 backdrop-blur-md"
        >
          <Sparkles className="w-3.5 h-3.5 animate-pulse" />
          <span>Civic Movement</span>
        </motion.div>

        <motion.h1
          variants={fadeInUp}
          className="gusto-heading mb-6 max-w-5xl tracking-[-0.03em] leading-[1.05] text-foreground"
        >
          Translating <span className="text-primary italic font-heading">numbers</span>{" "}
          <br />
          into civic narratives.
        </motion.h1>

        <motion.p
          variants={fadeInUp}
          className="text-base sm:text-lg text-muted-foreground max-w-2xl mb-10 leading-relaxed font-normal"
        >
          Budget Ndio Story is a youth-led initiative in Kenya turning complex national
          budgets into clear, actionable stories for county engagement and democratic audit.
        </motion.p>

        <motion.div
          variants={fadeInUp}
          className="flex flex-row items-center gap-4 w-full sm:w-auto"
        >
          <Link href="/events" className="w-full sm:w-auto">
            <Button
              size="lg"
              className="w-full sm:w-auto rounded-full px-8 py-6 text-base font-bold gap-2"
            >
              Explore Events
              <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
          <Link href="/about" className="w-full sm:w-auto">
            <Button
              size="lg"
              variant="outline"
              className="w-full sm:w-auto rounded-full px-8 py-6 text-base font-bold"
            >
              How We Work
            </Button>
          </Link>
        </motion.div>
      </motion.div>

      <motion.div
        variants={fadeInDelay5}
        initial="hidden"
        animate="visible"
        className="relative z-20 w-full max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pt-6 border-t border-border/40 mt-auto"
      >
        <div className="flex items-center gap-3 text-muted-foreground">
          <div className="flex -space-x-2">
            <span className="flex size-8 items-center justify-center rounded-full bg-muted/80 backdrop-blur-md border border-border">
              <Landmark className="size-4 text-primary" />
            </span>
            <span className="flex size-8 items-center justify-center rounded-full bg-muted/80 backdrop-blur-md border border-border">
              <BarChart3 className="size-4 text-primary" />
            </span>
            <span className="flex size-8 items-center justify-center rounded-full bg-muted/80 backdrop-blur-md border border-border">
              <Users className="size-4 text-primary" />
            </span>
          </div>
          <span className="text-xs font-semibold uppercase tracking-widest text-foreground/80">
            Youth-Led Fiscal Desks
          </span>
        </div>
      </motion.div>
    </section>
  );
}
