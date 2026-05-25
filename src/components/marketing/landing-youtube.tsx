"use client";

import React from "react";
import { motion } from "motion/react";
import { fadeInUp, staggerContainer } from "@/motion/variants";
import { LANDING_YOUTUBE_EMBED } from "@/constants/cloudinary";

export default function LandingYoutube() {
  return (
    <section className="py-16 md:py-24 bg-background border-y border-border/40">
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        className="max-w-4xl mx-auto px-6 md:px-16"
      >
        <motion.div variants={fadeInUp} className="mb-8 md:mb-10 text-center md:text-left">
          <span className="text-primary font-bold uppercase tracking-widest text-xs mb-3 block">
            Watch & Learn
          </span>
          <h2 className="gusto-subheading text-foreground">
            The Budget <span className="italic font-heading text-primary">Mtaani</span> Series
          </h2>
          <p className="text-muted-foreground text-sm md:text-base mt-3 max-w-xl leading-relaxed">
            See how we translate complex fiscal policy into stories that meet youth where they are.
          </p>
        </motion.div>

        <motion.div
          variants={fadeInUp}
          className="relative rounded-2xl md:rounded-3xl border border-border bg-card p-2 shadow-sm"
        >
          <div className="relative aspect-video rounded-xl md:rounded-2xl overflow-hidden bg-muted">
            <iframe
              src={LANDING_YOUTUBE_EMBED}
              title="Budget Ndio Story overview"
              className="absolute inset-0 w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              loading="lazy"
            />
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
