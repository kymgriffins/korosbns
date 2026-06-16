"use client";

import React from "react";
import { motion } from "motion/react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/ui/button";
import { ArrowRight } from "lucide-react";
import { fadeInUp, staggerFast, slideInRight } from "@/motion/variants";
import { SectionHeader, SectionShell } from "@/layouts/section-shell";
import { CLOUDINARY_PARTNERSHIPS } from "@/constants/cloudinary";

const STEPS = [
  {
    number: "01",
    title: "Decode",
    body: "We break down the Budget Policy Statement, County Fiscal Strategy Papers, and appropriations bills into clear, accessible narratives.",
  },
  {
    number: "02",
    title: "Engage",
    body: "Through campus forums, barazas, and digital platforms, we create spaces for citizens to participate in budget-making processes.",
  },
  {
    number: "03",
    title: "Track",
    body: "We monitor budget execution, flag discrepancies, and equip citizens with tools to demand accountability from their representatives.",
  },
];

const PARTNERSHIP_IMAGES = [
  { src: CLOUDINARY_PARTNERSHIPS.nationalTreasuryWorkshop, alt: "National Treasury workshop", offset: "" },
  { src: CLOUDINARY_PARTNERSHIPS.bpsSession, alt: "Budget Policy Statement session", offset: "mt-6" },
  { src: CLOUDINARY_PARTNERSHIPS.parliamentEngagement, alt: "Parliament engagement", offset: "-mt-6" },
  { src: CLOUDINARY_PARTNERSHIPS.fiscalFramework, alt: "Fiscal framework discussion", offset: "" },
];

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

        <div className="mb-12 grid items-center gap-10 md:mb-14 md:grid-cols-2 md:gap-14">
          <motion.div
            variants={staggerFast}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            className="flex flex-col gap-8"
          >
            {STEPS.map((step) => (
              <motion.div key={step.number} variants={fadeInUp} className="flex gap-4">
                <span className="shrink-0 font-mono text-2xl font-black tracking-tight text-primary/30 md:text-3xl">
                  {step.number}
                </span>
                <div>
                  <h3 className="mb-2 text-xl font-bold text-primary md:text-2xl">{step.title}</h3>
                  <p className="leading-relaxed text-muted-foreground">{step.body}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            variants={slideInRight}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid w-full max-w-md grid-cols-2 gap-3 sm:mx-auto md:max-w-none"
          >
            {PARTNERSHIP_IMAGES.map((image) => (
              <div
                key={image.src}
                className={`relative aspect-[4/5] w-full overflow-hidden rounded-xl border border-border ${image.offset}`}
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 45vw, 25vw"
                />
              </div>
            ))}
          </motion.div>
        </div>

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
