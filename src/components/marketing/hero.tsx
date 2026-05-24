"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform, useReducedMotion } from "motion/react";
import { Button } from "@/ui/button";
import { ArrowRight, Play, Sparkles } from "lucide-react";
import { cn } from "@/utils";
import Balancer from "react-wrap-balancer";

const badges = [
  { text: "Budget Stories 🎭", top: "15%", left: "5%" },
  { text: "County Spending 📊", top: "25%", right: "8%" },
  { text: "Data Visuals 📉", top: "60%", left: "10%" },
  { text: "Action Steps 📲", top: "70%", right: "12%" },
];

const FloatingBadge = ({ text, top, left, right, index }: { text: string; top: string; left?: string; right?: string; index: number }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{
        opacity: 1,
        scale: 1,
        y: [0, -10, 0],
      }}
      transition={{
        opacity: { delay: 0.5 + index * 0.15, duration: 0.5 },
        scale: { delay: 0.5 + index * 0.15, duration: 0.5 },
        y: {
          duration: 3 + index,
          repeat: Infinity,
          ease: "easeInOut",
        }
      }}
      style={{
        top,
        left,
        right,
      }}
      className="absolute hidden lg:block z-30 pointer-events-none"
    >
      <div className="px-3.5 py-1.5 rounded-full border border-zinc-800/80 bg-zinc-950/80 backdrop-blur-md shadow-lg shadow-black/40">
        <span className="text-xs font-bold text-zinc-300 whitespace-nowrap">
          {text}
        </span>
      </div>
    </motion.div>
  );
};

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  // Scroll linked values for hero parallax
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  // Compositor-friendly scroll mappings
  const videoY = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);
  const videoScale = useTransform(scrollYProgress, [0, 1], [1.02, 1.12]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const contentY = useTransform(scrollYProgress, [0, 1], [0, -40]);

  // Video paths
  const videoWebm = "https://res.cloudinary.com/dn8lut2fc/video/upload/f_webm,q_auto/v1778496651/Untitled_design_maph6q.webm";
  const videoMp4 = "https://res.cloudinary.com/dn8lut2fc/video/upload/q_auto/v1778496651/Untitled_design_maph6q.mp4";

  return (
    <section
      ref={containerRef}
      className="relative min-h-[92dvh] w-full overflow-hidden flex items-center justify-center bg-black pt-16"
    >
      {/* BACKGROUND VIDEO WITH SCROLL PARALLAX */}
      <motion.div
        style={shouldReduceMotion ? {} : { y: videoY, scale: videoScale }}
        className="absolute inset-0 z-0 pointer-events-none"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/60 to-black z-10" />
        <video
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover grayscale opacity-35"
        >
          <source src={videoWebm} type="video/webm" />
          <source src={videoMp4} type="video/mp4" />
          <div className="w-full h-full bg-zinc-950" />
        </video>
      </motion.div>

      {/* FLOATERS */}
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

      {/* MAIN CONTENT */}
      <motion.div
        style={shouldReduceMotion ? {} : { opacity: contentOpacity, y: contentY }}
        className="relative z-20 text-center px-6 max-w-5xl mx-auto space-y-8"
      >
        {/* Mission Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-bold"
        >
          <Sparkles className="size-3.5 fill-current animate-pulse" />
          <span>Bridging Youth Energy & Fiscal Policy</span>
        </motion.div>

        {/* Hero Header */}
        <div className="space-y-4">
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black text-white leading-[1.05] tracking-tight">
            Translating <span className="text-primary italic font-serif font-normal">numbers</span> <br />
            into civic narratives.
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            <Balancer>
              Budget Ndio Story is a youth-led initiative turning complex Kenyan budgets into clear, actionable stories for county engagement and democratic audit.
            </Balancer>
          </p>
        </div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2"
        >
          <Link href="/learn" className="w-full sm:w-auto">
            <Button size="lg" className="w-full sm:w-auto rounded-full px-8 py-6 text-base font-bold gap-2">
              Start Learning Path <ArrowRight className="size-4" />
            </Button>
          </Link>
          <Link href="/research" className="w-full sm:w-auto">
            <Button size="lg" variant="outline" className="w-full sm:w-auto rounded-full px-8 py-6 text-base font-bold border-zinc-800 text-zinc-300 hover:bg-zinc-900/40">
              Dive into Data
            </Button>
          </Link>
        </motion.div>

        {/* Embedded Video Showcase with Reveal */}
        <motion.div
          initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-4xl mx-auto pt-8 relative group"
        >
          <div className="relative mx-auto rounded-2xl md:rounded-[32px] border border-zinc-800/80 bg-zinc-950/60 p-2 backdrop-blur-xs">
            <div className="absolute top-1/4 left-1/2 -z-10 w-4/5 h-1/3 -translate-x-1/2 -translate-y-1/2 bg-primary/20 blur-[80px] opacity-40 rounded-full" />
            
            <div className="rounded-xl md:rounded-[24px] border border-zinc-900 bg-black overflow-hidden relative aspect-[16/10]">
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
    </section>
  );
}
