"use client";

import React from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { fadeInUp, staggerContainer } from "@/motion/variants";
import { SectionShell, SectionHeader } from "@/layouts/section-shell";
import { ArrowRight, BookOpen, Target, Users } from "lucide-react";
import { useCohortImages } from "@/hooks/use-marketing";
import { BNS_COMMUNITY_IMAGES } from "@/constants/bns-media-images";

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
    desc: "Hyper-local budget analysis for all 47 counties, enabling citizens to track development projects and county expenditure.",
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
  const { data: cohortData } = useCohortImages();
  const projectImages = cohortData?.images ?? [];

  return (
    <SectionShell className="bg-muted/30">
      <SectionHeader
        eyebrow="Our Work"
        title="Core Projects"
        description="Three flagship initiatives driving civic engagement and budget transparency across Kenya."
      />
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="grid md:grid-cols-3 gap-6"
      >
        {initiatives.map((initiative, i) => {
          const Icon = initiative.icon;
          const projectImage = projectImages[i]?.src ?? initiative.image;
          return (
            <motion.div key={initiative.id} variants={fadeInUp} className="group">
              <Link
                href={`/bns-project/${initiative.id}`}
                className="block h-full rounded-xl overflow-hidden border border-border/60 bg-card transition-all duration-300 hover:border-primary/30 hover:shadow-lg"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={projectImage}
                    alt={initiative.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-5">
                  <div className="inline-flex size-11 items-center justify-center rounded-xl bg-primary/10 border border-primary/20 text-primary mb-3">
                    <Icon className="size-5" />
                  </div>
                  <h3 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors">
                    {initiative.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                    {initiative.desc}
                  </p>
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary">
                    Explore project <ArrowRight className="size-3" />
                  </span>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </motion.div>
    </SectionShell>
  );
}
