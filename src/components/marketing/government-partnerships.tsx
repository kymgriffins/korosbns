"use client";

import React from "react";
import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/ui/button";
import { ArrowRight } from "lucide-react";
import { slideInLeft, slideInRight } from "@/motion/variants";
import { CLOUDINARY_PARTNERSHIPS } from "@/constants/cloudinary";
import { SectionShell } from "@/layouts/section-shell";

const GovernmentPartnerships = () => {
  return (
    <SectionShell className="overflow-hidden border-t border-border/40 bg-background">
      <div className="space-y-16 md:space-y-20">
        <div className="grid items-center gap-8 md:grid-cols-2 md:gap-12">
          <motion.div
            variants={slideInLeft}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <span className="mb-4 block text-xs font-bold uppercase tracking-widest text-primary">
              National Partnership
            </span>
            <h2 className="mb-4 text-2xl font-black text-foreground md:text-4xl">
              Decoding the{" "}
              <span className="font-heading italic text-primary">Budget Policy Statement</span>
            </h2>
            <p className="mb-4 text-base leading-relaxed text-muted-foreground">
              We track and decode the outputs of the National Treasury and Parliament&apos;s Budget &
              Appropriations Committee, translating the annual Budget Policy Statement into
              accessible narratives for citizens.
            </p>
            <p className="mb-6 text-base leading-relaxed text-muted-foreground">
              Our workshops and explainer series break down fiscal frameworks, revenue
              projections, and spending priorities — empowering Kenyans to understand where
              their taxes go.
            </p>
          </motion.div>

          <motion.div
            variants={slideInRight}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid w-full max-w-md grid-cols-2 gap-3 md:max-w-none"
          >
            <div className="relative aspect-[4/5] overflow-hidden rounded-xl border border-border">
              <Image
                src={CLOUDINARY_PARTNERSHIPS.nationalTreasuryWorkshop}
                alt="National Treasury workshop"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 45vw, 300px"
              />
            </div>
            <div className="relative mt-6 aspect-[4/5] overflow-hidden rounded-xl border border-border">
              <Image
                src={CLOUDINARY_PARTNERSHIPS.bpsSession}
                alt="Budget Policy Statement session"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 45vw, 300px"
              />
            </div>
            <div className="relative -mt-6 aspect-[4/5] overflow-hidden rounded-xl border border-border">
              <Image
                src={CLOUDINARY_PARTNERSHIPS.parliamentEngagement}
                alt="Parliament engagement"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 45vw, 300px"
              />
            </div>
            <div className="relative aspect-[4/5] overflow-hidden rounded-xl border border-border">
              <Image
                src={CLOUDINARY_PARTNERSHIPS.fiscalFramework}
                alt="Fiscal framework discussion"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 45vw, 300px"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </SectionShell>
  );
};

export default GovernmentPartnerships;
