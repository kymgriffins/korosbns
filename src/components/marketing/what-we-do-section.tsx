"use client";

import React from "react";
import { motion } from "motion/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { fadeInUp, staggerFast } from "@/motion/variants";
import { SectionHeader, SectionShell } from "@/layouts/section-shell";
import { landingSectionsContent } from "@/content";

const WhatWeDoSection = () => {
  return (
    <SectionShell className="relative overflow-hidden border-t border-border/40 bg-background text-foreground">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,color-mix(in_oklch,var(--primary)_15%,transparent),transparent_70%)]" />

      <div className="relative z-10">
        <SectionHeader
          eyebrow={landingSectionsContent.whatWeDo.eyebrow}
          title={
            <>
              {landingSectionsContent.whatWeDo.title}
            </>
          }
          description={landingSectionsContent.whatWeDo.description}
        />

        <motion.div
          variants={staggerFast}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="mb-12 grid gap-10 md:mb-14 md:grid-cols-3 md:gap-14"
        >
          {(landingSectionsContent.whatWeDo.steps as Array<{ number: string; title: string; description: string }>).map((step) => (
            <motion.div key={step.number} variants={fadeInUp}>
              <h3 className="mb-4 text-xl font-bold text-primary md:text-2xl">{step.number}. {step.title}</h3>
              <p className="leading-relaxed text-muted-foreground">{step.description}</p>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <Link href="/about">
            <Button
              size="lg"
              variant="white"
              className="gap-2 rounded-full px-10 py-7 text-lg font-bold"
            >
              {landingSectionsContent.whatWeDo.primaryCta.label}
              <ArrowRight className="h-5 w-5" />
            </Button>
          </Link>
          <Link href="/events">
            <Button
              size="lg"
              variant="outline"
              className="gap-2 rounded-full px-10 py-7 text-lg font-bold"
            >
              {landingSectionsContent.whatWeDo.secondaryCta.label}
              <ArrowRight className="h-5 w-5" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </SectionShell>
  );
};

export default WhatWeDoSection;
