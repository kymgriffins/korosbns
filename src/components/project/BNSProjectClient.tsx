"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "motion/react";
import { ArrowRight, BookOpen, Target, Users } from "lucide-react";
import { fadeInUp, staggerContainer } from "@/motion/variants";
import { BNS_COMMUNITY_IMAGES } from "@/constants/bns-media-images";
import { LANDING_TYPOGRAPHY as T } from "@/constants/landing-typography";
import {
  LandingContent,
  LandingSection,
  LandingSectionHeader,
} from "@/layouts/landing-section";
import { cn } from "@/utils";

const initiatives = [
  {
    id: "budget-literacy",
    title: "Budget Literacy Programme",
    desc: "Interactive learning modules that break down the budget cycle, sector allocations, and parliamentary processes into digestible lessons.",
    icon: BookOpen,
    image: BNS_COMMUNITY_IMAGES.cohortB,
  },
  {
    id: "county-budget-tracking",
    title: "County Budget Tracking",
    desc: "County budget literacy and tracking where CRA/API data is available — we do not invent coverage for all 47 counties.",
    icon: Target,
    image: BNS_COMMUNITY_IMAGES.forumE,
  },
  {
    id: "public-participation",
    title: "Public Participation Hub",
    desc: "A centralized platform that notifies citizens about public comment windows and guides them through submitting memoranda.",
    icon: Users,
    image: BNS_COMMUNITY_IMAGES.stakeholdersA,
  },
];

export function BNSProjectClient() {
  return (
    <LandingSection className="bg-muted/20">
      <LandingSectionHeader
        eyebrow="Our Work"
        title={
          <>
            Core <span className={T.highlight}>projects</span>
          </>
        }
        description="Three flagship initiatives driving civic engagement and budget transparency across Kenya."
      />

      <LandingContent>
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid gap-4 sm:gap-6 md:grid-cols-3"
        >
          {initiatives.map((initiative) => {
            const Icon = initiative.icon;

            return (
              <motion.div key={initiative.id} variants={fadeInUp} className="group h-full">
                <Link
                  href={`/bns-project/${initiative.id}`}
                  className="flex h-full flex-col overflow-hidden rounded-2xl border border-border/60 bg-card transition-all duration-300 hover:border-primary/30 hover:shadow-lg"
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Image
                      src={initiative.image}
                      alt={initiative.title}
                      fill
                      className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-4 sm:p-5">
                    <div className={cn(T.inlineTitle, "mb-2")}>
                      <div className={T.inlineIcon}>
                        <Icon className="size-4 sm:size-5" />
                      </div>
                      <h3 className={cn(T.cardTitle, "min-w-0 group-hover:text-primary transition-colors")}>
                        {initiative.title}
                      </h3>
                    </div>
                    <p className={cn(T.caption, "mb-4 flex-1")}>{initiative.desc}</p>
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary">
                      Explore project <ArrowRight className="size-3" />
                    </span>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      </LandingContent>
    </LandingSection>
  );
}
