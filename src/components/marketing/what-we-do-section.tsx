"use client";

import React from "react";
import { motion } from "motion/react";
import Link from "next/link";
import { Button } from "@/ui/button";
import { ArrowRight } from "lucide-react";
import { fadeInUp, staggerFast } from "@/motion/variants";
import { SectionHeader, SectionShell } from "@/layouts/section-shell";

const WhatWeDoSection = () => {
  return (
    <SectionShell className="relative overflow-hidden border-t border-border/40 bg-background text-foreground">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,color-mix(in_oklch,var(--primary)_15%,transparent),transparent_70%)]" />

      <div className="relative z-10">
        <SectionHeader
          eyebrow="What We Do"
          title={
            <>
              We turn{" "}
              <span className="font-heading italic text-primary">complex budgets</span>{" "}
              into{" "}
              <span className="font-heading italic text-primary">civic action</span>.
            </>
          }
          description="Decode national and county fiscal documents, create spaces for participation, and equip citizens to track execution and demand accountability."
        />

        <motion.div
          variants={staggerFast}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="mb-12 grid gap-10 md:mb-14 md:grid-cols-3 md:gap-14"
        >
          <motion.div variants={fadeInUp}>
            <h3 className="mb-4 text-xl font-bold text-primary md:text-2xl">01. Decode</h3>
            <p className="leading-relaxed text-muted-foreground">
              We break down the Budget Policy Statement, County Fiscal Strategy Papers,
              and appropriations bills into clear, accessible narratives.
            </p>
          </motion.div>

          <motion.div variants={fadeInUp}>
            <h3 className="mb-4 text-xl font-bold text-primary md:text-2xl">02. Engage</h3>
            <p className="leading-relaxed text-muted-foreground">
              Through campus forums, barazas, and digital platforms, we create spaces
              for citizens to participate in budget-making processes.
            </p>
          </motion.div>

          <motion.div variants={fadeInUp}>
            <h3 className="mb-4 text-xl font-bold text-primary md:text-2xl">03. Track</h3>
            <p className="leading-relaxed text-muted-foreground">
              We monitor budget execution, flag discrepancies, and equip citizens
              with tools to demand accountability from their representatives.
            </p>
          </motion.div>
        </motion.div>

        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="flex w-full flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4"
        >
          <Link href="/about" className="w-full sm:w-auto">
            <Button
              size="lg"
              variant="white"
              className="w-full gap-2 rounded-full px-8 py-6 text-base font-bold sm:w-auto md:px-10 md:py-7 md:text-lg"
            >
              Start Your Journey
              <ArrowRight className="h-5 w-5" />
            </Button>
          </Link>
          <Link href="/events" className="w-full sm:w-auto">
            <Button
              size="lg"
              variant="outline"
              className="w-full gap-2 rounded-full px-8 py-6 text-base font-bold sm:w-auto md:px-10 md:py-7 md:text-lg"
            >
              View All Events
              <ArrowRight className="h-5 w-5" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </SectionShell>
  );
};

export default WhatWeDoSection;
