"use client";

import React from "react";
import { motion } from "motion/react";
import { fadeInUp, staggerContainer } from "@/motion/variants";
import { LANDING_YOUTUBE_EMBED } from "@/constants/cloudinary";
import { LANDING_TYPOGRAPHY as T } from "@/constants/landing-typography";
import {
  LandingContent,
  LandingSection,
  LandingSectionHeader,
} from "@/layouts/landing-section";

export default function LandingYoutube() {
  return (
    <LandingSection>
      <LandingSectionHeader
        eyebrow="Watch & Learn"
        title={
          <>
            The Budget <span className={T.highlight}>Mtaani</span> Series
          </>
        }
        description="See how we translate complex fiscal policy into stories that meet youth where they are."
      />

      <LandingContent className={T.mediaFrame}>
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
      </LandingContent>
    </LandingSection>
  );
}
