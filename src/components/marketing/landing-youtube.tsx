"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { fadeInUp, staggerContainer } from "@/motion/variants";
import { LANDING_YOUTUBE_EMBED } from "@/constants/cloudinary";
import { SectionHeader, SectionShell } from "@/layouts/section-shell";

export default function LandingYoutube() {
  const parallaxRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: parallaxRef, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [60, -60]);

  return (
    <SectionShell className="border-y border-border/40 bg-background">
      <div ref={parallaxRef}>
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }}>
          <SectionHeader eyebrow="Watch & Learn" title={<>Featured <span className="font-heading italic text-primary">video</span></>} description="Deep dives into Kenya's budget data, fiscal policy, and civic accountability." />
          <motion.div variants={fadeInUp} style={{ y }} className="relative">
            <div className="relative mx-auto aspect-video w-full max-w-4xl overflow-hidden rounded-2xl border border-border/40 shadow-xl">
              <iframe src={LANDING_YOUTUBE_EMBED} title="Budget Ndio Story Featured Video" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen className="h-full w-full" />
            </div>
          </motion.div>
        </motion.div>
      </div>
    </SectionShell>
  );
}
