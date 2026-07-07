"use client";

import React from "react";
import { motion } from "motion/react";
import { fadeInUp, staggerContainer } from "@/motion/variants";
import { LANDING_YOUTUBE_EMBED } from "@/constants/cloudinary";
import { SectionHeader, SectionShell } from "@/layouts/section-shell";
import { LANDING_TYPOGRAPHY as T } from "@/constants/landing-typography";

export default function LandingYoutube() {
  return (
    <SectionShell className="border-y border-border/40 bg-background">
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
      >
        <SectionHeader
          eyebrow="Watch & Learn"
          title={
            <>
              The Budget <span className={T.highlight}>Mtaani</span> Series
            </>
          }
          description="See how we translate complex fiscal policy into stories that meet youth where they are."
        />

        <motion.div
          variants={fadeInUp}
          className="relative rounded-2xl border border-border bg-card p-2 md:rounded-3xl"
        >
          <div className="relative aspect-video overflow-hidden rounded-xl bg-muted md:rounded-2xl">
            <iframe
              src={LANDING_YOUTUBE_EMBED}
              title="Budget Ndio Story overview"
              className="absolute inset-0 h-full w-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              loading="lazy"
            />
          </div>
        </motion.div>
      </motion.div>
    </SectionShell>
  );
}
