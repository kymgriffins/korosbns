"use client";

import React, { useRef } from "react";
import Link from "next/link";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
} from "motion/react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import Balancer from "react-wrap-balancer";
import { ease } from "@/motion/variants";

const badges = [
  { text: "Budget Stories 🎭", top: "15%", left: "5%" },
  { text: "County Spending 📊", top: "25%", right: "8%" },
  { text: "Data Visuals 📉", top: "60%", left: "10%" },
  { text: "Action Steps 📲", top: "70%", right: "12%" },
];

const FloatingBadge = ({
  text,
  top,
  left,
  right,
  index,
}: {
  text: string;
  top: string;
  left?: string;
  right?: string;
  index: number;
}) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.75, y: 10 }}
    animate={{
      opacity: 1,
      scale: 1,
      y: [0, -10, 0],
    }}
    transition={{
      opacity: { delay: 0.7 + index * 0.12, duration: 0.45, ease: ease.expo },
      scale: { delay: 0.7 + index * 0.12, duration: 0.45, ease: ease.expo },
      y: {
        duration: 3.5 + index * 0.4,
        repeat: Infinity,
        ease: "easeInOut",
        delay: 1.2 + index * 0.12,
      },
    }}
    style={{ "--hero-top": top, "--hero-left": left, "--hero-right": right } as React.CSSProperties}
    className="top-[var(--hero-top)] left-[var(--hero-left)] right-[var(--hero-right)] absolute hidden lg:block z-30 pointer-events-none"
  >
    <div className="px-3.5 py-1.5 rounded-full border border-border/60 bg-card">
      <span className="text-xs font-bold text-foreground/80 whitespace-nowrap">
        {text}
      </span>
    </div>
  </motion.div>
);

// Stagger container for hero text block
const heroContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.15,
    },
  },
};

const heroItem = {
  hidden: { opacity: 0, y: 28, filter: "blur(6px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.65, ease: ease.expo },
  },
};

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const videoY = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);
  const videoScale = useTransform(scrollYProgress, [0, 1], [1.02, 1.12]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.55], [1, 0]);
  const contentY = useTransform(scrollYProgress, [0, 1], [0, -50]);

  const videoWebm = "/images/tiktoklanding.mp4";
  const videoMp4 = "/images/tiktoklanding.mp4";

  return (
    <section
      ref={containerRef}
      className="relative min-h-[92dvh] w-full overflow-hidden flex items-center justify-center bg-background pt-16"
    >
      {/* ── Background video with scroll parallax ── */}
      <motion.div
        style={shouldReduceMotion ? {} : { y: videoY, scale: videoScale }}
        className="absolute inset-0 z-0 pointer-events-none"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-background/20 via-background/60 to-background z-10" />
        <video
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover grayscale opacity-30 dark:opacity-35"
        >
          <source src={videoWebm} type="video/webm" />
          <source src={videoMp4} type="video/mp4" />
          <div className="w-full h-full bg-background" />
        </video>
      </motion.div>

      {/* ── Floating badges ── */}
      {badges.map((badge, index) => (
        <FloatingBadge
          key={index}
          text={badge.text}
          top={badge.top}
          left={badge.left}
          right={badge.right}
          index={index}
        />
      ))}

      {/* ── Main content ── */}
      <motion.div
        style={shouldReduceMotion ? {} : { opacity: contentOpacity, y: contentY }}
        className="relative z-20 text-center px-6 max-w-5xl mx-auto"
      >
        <motion.div
          variants={heroContainer}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          {/* Mission badge */}
          <motion.div variants={heroItem} className="flex justify-center">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/25 bg-primary/8 text-primary text-xs font-bold">
              <Sparkles className="size-3.5 fill-current animate-pulse" />
              <span>Bridging Youth Energy & Fiscal Policy</span>
            </div>
          </motion.div>

          {/* Headline */}
          <motion.div variants={heroItem} className="space-y-4">
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-black text-foreground leading-[1.05] tracking-tight">
              Translating{" "}
              <span className="text-primary italic font-serif font-normal">
                numbers
              </span>{" "}
              <br />
              into civic narratives.
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              <Balancer>
                Budget Ndio Story is a youth-led initiative turning complex
                Kenyan budgets into clear, actionable stories for civic
                engagement and democratic audit.
              </Balancer>
            </p>
          </motion.div>

          {/* CTA buttons */}
          <motion.div
            variants={heroItem}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2"
          >
            <Link href="/learn" className="w-full sm:w-auto">
              <Button
                size="lg"
                className="w-full sm:w-auto rounded-full px-8 py-6 text-base font-bold gap-2"
              >
                Start Learning Path <ArrowRight className="size-4" />
              </Button>
            </Link>
            <Link href="/learn" className="w-full sm:w-auto">
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto rounded-full px-8 py-6 text-base font-bold border-border text-foreground/80 hover:bg-foreground/5"
              >
                Dive into Data
              </Button>
            </Link>
          </motion.div>

          {/* Video showcase */}
          <motion.div
            variants={heroItem}
            className="max-w-4xl mx-auto pt-8 relative"
          >
            <div className="relative mx-auto rounded-2xl md:rounded-[32px] border border-border/60 bg-background/60 p-2 backdrop-blur-xs">
              {/* Glow */}
              <div className="absolute top-1/4 left-1/2 -z-10 w-4/5 h-1/3 -translate-x-1/2 -translate-y-1/2 bg-primary/15 blur-[80px] opacity-50 rounded-full" />

              <div className="rounded-xl md:rounded-[24px] border border-border/40 bg-background overflow-hidden relative aspect-[16/10]">
                <iframe
                  src="https://www.youtube-nocookie.com/embed/Ed9lP0-komE?rel=0&modestbranding=1"
                  title="Budget Ndio Story overview"
                  className="absolute inset-0 w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  loading="lazy"
                />
              </div>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}
