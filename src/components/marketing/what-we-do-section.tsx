"use client";

import React from "react";
import { motion } from "motion/react";
import Link from "next/link";
import { Button } from "@/ui/button";
import { ArrowRight } from "lucide-react";
import {
  fadeInUp,
  staggerContainer,
  staggerFast,
} from "@/motion/variants";

const WhatWeDoSection = () => {
  return (
    <section className="relative py-24 md:py-36 bg-background text-foreground overflow-hidden border-t border-border/40">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,color-mix(in_oklch,var(--primary)_15%,transparent),transparent_70%)] pointer-events-none" />

      <div className="max-w-[1400px] mx-auto px-6 md:px-16 relative z-10">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="mb-14 md:mb-20"
        >
          <motion.h2
            variants={fadeInUp}
            className="gusto-heading leading-[1.05] mb-2 md:mb-4"
          >
            We turn{" "}
            <span className="text-primary italic font-heading">complex budgets</span>
          </motion.h2>
          <motion.h2 variants={fadeInUp} className="gusto-heading leading-[1.05]">
            into <span className="text-primary italic font-heading">civic action</span>.
          </motion.h2>
        </motion.div>

        <motion.div
          variants={staggerFast}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="grid md:grid-cols-3 gap-10 md:gap-14 mb-14 md:mb-16"
        >
          <motion.div variants={fadeInUp}>
            <h3 className="text-xl md:text-2xl font-bold mb-4 text-primary">01. Decode</h3>
            <p className="text-muted-foreground leading-relaxed">
              We break down the Budget Policy Statement, County Fiscal Strategy Papers,
              and appropriations bills into clear, accessible narratives.
            </p>
          </motion.div>

          <motion.div variants={fadeInUp}>
            <h3 className="text-xl md:text-2xl font-bold mb-4 text-primary">02. Engage</h3>
            <p className="text-muted-foreground leading-relaxed">
              Through campus forums, barazas, and digital platforms, we create spaces
              for citizens to participate in budget-making processes.
            </p>
          </motion.div>

          <motion.div variants={fadeInUp}>
            <h3 className="text-xl md:text-2xl font-bold mb-4 text-primary">03. Track</h3>
            <p className="text-muted-foreground leading-relaxed">
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
          className="flex flex-col sm:flex-row gap-4 items-center justify-center"
        >
          <Link href="/about">
            <Button
              size="lg"
              className="rounded-full px-10 py-7 text-lg font-bold gap-2"
            >
              Start Your Journey
              <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
          <Link href="/events">
            <Button
              size="lg"
              variant="outline"
              className="rounded-full px-10 py-7 text-lg font-bold gap-2"
            >
              View All Events
              <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default WhatWeDoSection;
