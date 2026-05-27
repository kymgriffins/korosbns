"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/ui/button";
import {
  fadeInUp,
  staggerContainer,
  staggerFast,
} from "@/motion/variants";
import { CLOUDINARY_HERO_LANDING_VIDEO_MP4 } from "@/constants/cloudinary";
import { SECTION_SHELL_INNER } from "@/layouts/section-shell";
import Button17 from "@/components/shadcn-space/button/button-17";
import Button16 from "@/components/shadcn-space/button/button-16";

export default function LandingHero() {
  return (
    <section
      className="relative w-full overflow-hidden bg-background text-foreground"
      aria-labelledby="landing-hero-heading"
    >
      <div className={SECTION_SHELL_INNER}>
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="grid w-full gap-8 pb-10 pt-4 md:gap-12 md:pb-14 md:pt-6 lg:grid-cols-2 lg:items-end"
        >
          <motion.div variants={fadeInUp} className="flex flex-col gap-5">
            <h1
              id="landing-hero-heading"
              className="gusto-heading max-w-xl text-foreground"
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
                <Button17 label="Explore Events" className="w-full sm:w-auto h-10 px-6" />
              </Link>
              <Link href="/about" className="w-full sm:w-auto">
                <Button16 label="How We Work" className="w-full sm:w-auto h-10 px-6" />
              </Link>
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          variants={staggerFast}
          initial="hidden"
          animate="visible"
          className="w-full pb-12 md:pb-16"
        >
          <motion.div
            variants={fadeInUp}
            className="relative aspect-video w-full min-h-[12rem] overflow-hidden rounded-2xl border border-border/60 md:rounded-3xl group cursor-pointer"
            onClick={() => window.open('https://www.youtube.com/@BudgetNdioStory', '_blank')}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
          >
            {/* Hover overlay */}
            <div className="absolute inset-0 z-10 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center gap-2">
                <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center">
                  <ArrowRight className="w-8 h-8 text-black" />
                </div>
                <span className="text-white text-sm font-bold">Watch on YouTube</span>
              </div>
            </div>
            
            <video
              autoPlay
              muted
              loop
              playsInline
              onLoadedData={() => console.log('✅ Hero video loaded successfully')}
              onError={(e) => {
                console.error('❌ Hero video error:', e);
                console.error('URL attempted:', CLOUDINARY_HERO_LANDING_VIDEO_MP4);
              }}
              className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
            >
              <source src={CLOUDINARY_HERO_LANDING_VIDEO_MP4} type="video/mp4" />
            </video>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
