"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight, Play } from "lucide-react";
import { Button } from "@/ui/button";
import { Routes } from "@/constants/routes";
import { fadeInUp, staggerContainer, staggerFast } from "@/motion/variants";
import { CLOUDINARY_HERO_LANDING_VIDEO_MP4 } from "@/constants/cloudinary";
import { SECTION_SHELL_INNER } from "@/layouts/section-shell";

const YOUTUBE_CHANNEL_URL = "https://www.youtube.com/@BudgetNdioStory";

const CREDIBILITY_STATS = [
  { value: "47", label: "Counties covered" },
  { value: "100+", label: "Budget documents decoded" },
  { value: "25K+", label: "Citizens reached" },
  { value: "60+", label: "Campus & community forums" },
];

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
              national budgets into clear, actionable stories for civic engagement
              and democratic audit.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <Link href={Routes.BudgetNews} className="w-full sm:w-auto">
                <Button
                  size="lg"
                  variant="white"
                  className="w-full gap-2 rounded-full px-8 py-6 text-base font-bold sm:w-auto"
                >
                  Explore Budget News
                  <ArrowRight className="size-5" />
                </Button>
              </Link>
              <Link href="#how-budget-is-made" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full gap-2 rounded-full px-8 py-6 text-base font-bold sm:w-auto"
                >
                  See how the budget is made
                  <ArrowRight className="size-5" />
                </Button>
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
          <motion.a
            variants={fadeInUp}
            href={YOUTUBE_CHANNEL_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Watch Budget Ndio Story on YouTube (opens in a new tab)"
            className="group relative block aspect-video min-h-[12rem] w-full cursor-pointer overflow-hidden rounded-2xl border border-border/60 transition-shadow duration-300 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background md:rounded-3xl"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
          >
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/0 transition-colors duration-300 group-hover:bg-black/20 group-focus-visible:bg-black/20">
              <div className="flex flex-col items-center gap-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
                <div className="flex size-16 items-center justify-center rounded-full bg-white/90 shadow-lg">
                  <Play className="size-7 fill-black text-black" />
                </div>
                <span className="text-sm font-bold text-white">Watch on YouTube</span>
              </div>
            </div>

            <video
              autoPlay
              muted
              loop
              playsInline
              aria-hidden="true"
              tabIndex={-1}
              onError={(e) => {
                console.warn("Hero video failed to load:", e);
              }}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            >
              <source src={CLOUDINARY_HERO_LANDING_VIDEO_MP4} type="video/mp4" />
            </video>
          </motion.a>
        </motion.div>

        <motion.dl
          variants={staggerFast}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="mb-12 grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-border/60 bg-border/60 md:mb-16 md:grid-cols-4"
        >
          {CREDIBILITY_STATS.map((stat) => (
            <motion.div
              key={stat.label}
              variants={fadeInUp}
              className="flex flex-col gap-1 bg-background p-5 md:p-7"
            >
              <dt className="order-2 text-xs font-medium text-muted-foreground md:text-sm">
                {stat.label}
              </dt>
              <dd className="order-1 text-3xl font-black tracking-tight text-foreground md:text-4xl">
                {stat.value}
              </dd>
            </motion.div>
          ))}
        </motion.dl>
      </div>
    </section>
  );
}
