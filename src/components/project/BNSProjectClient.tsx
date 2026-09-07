"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "motion/react";
import { ArrowRight, BookOpen, Sparkles, Target, Users } from "lucide-react";
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
    id: "terra",
    title: "Project One: Project TERRA",
    subtitle: "In conjunction with House of Fiscal Wisdom & Luminate",
    desc: "Led by Dr. Lyla Latif, Project TERRA investigates how platform algorithms and data centre tax holidays exclude African women workers from public revenue systems.",
    icon: Sparkles,
    image: "/images/marketing newsletter subcribe/Nelly with The Mic.jpg",
    badge: "Flagship Initiative • 2026–2027",
    href: "/bns-project/terra",
  },
  {
    id: "budget-literacy",
    title: "Budget Literacy Programme",
    subtitle: "National Civic Literacy Rails",
    desc: "Interactive learning modules that break down the budget cycle, sector allocations, and parliamentary processes into digestible lessons.",
    icon: BookOpen,
    image: BNS_COMMUNITY_IMAGES.cohortB,
    href: "/bns-project/budget-literacy",
  },
  {
    id: "county-budget-tracking",
    title: "County Budget Tracking",
    subtitle: "Devolved Expenditure Intelligence",
    desc: "County budget literacy and tracking where CRA/API data is available — we do not invent coverage for all 47 counties.",
    icon: Target,
    image: BNS_COMMUNITY_IMAGES.forumE,
    href: "/bns-project/county-budget-tracking",
  },
  {
    id: "public-participation",
    title: "Public Participation Hub",
    subtitle: "Civic Input & Memoranda Desk",
    desc: "A centralized platform that notifies citizens about public comment windows and guides them through submitting memoranda.",
    icon: Users,
    image: BNS_COMMUNITY_IMAGES.stakeholdersA,
    href: "/bns-project/public-participation",
  },
];

export function BNSProjectClient() {
  return (
    <LandingSection className="bg-muted/20 py-20 md:py-28">
      <LandingSectionHeader
        eyebrow="Our Research & Action"
        title={
          <>
            Flagship <span className={T.highlight}>projects</span>
          </>
        }
        description="Key investigative and civic initiatives driving public fiscal justice, platform accountability, and sovereign transparency across Africa."
      />

      <LandingContent>
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid gap-6 md:grid-cols-2"
        >
          {initiatives.map((initiative) => {
            const Icon = initiative.icon;

            return (
              <motion.div
                key={initiative.id}
                variants={fadeInUp}
                className="group h-full"
              >
                <Link
                  href={initiative.href}
                  className="flex h-full flex-col overflow-hidden rounded-2xl border border-border/60 bg-card transition-all duration-300 hover:border-primary/40 hover:shadow-xl"
                >
                  <div className="relative aspect-[16/9] overflow-hidden bg-muted">
                    <Image
                      src={initiative.image}
                      alt={initiative.title}
                      fill
                      className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                    {initiative.badge && (
                      <div className="absolute top-3 left-3 rounded-full bg-black/75 backdrop-blur-md px-3 py-1 text-xs font-mono font-semibold text-white border border-white/20">
                        {initiative.badge}
                      </div>
                    )}
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <div className={cn(T.inlineTitle, "mb-2 items-start gap-3")}>
                      <div className={cn(T.inlineIcon, "mt-0.5 shrink-0")}>
                        <Icon className="size-4 sm:size-5" />
                      </div>
                      <div>
                        <h3
                          className={cn(
                            T.cardTitle,
                            "min-w-0 group-hover:text-primary transition-colors text-lg sm:text-xl",
                          )}
                        >
                          {initiative.title}
                        </h3>
                        {initiative.subtitle && (
                          <p className="text-xs text-muted-foreground font-mono mt-0.5">
                            {initiative.subtitle}
                          </p>
                        )}
                      </div>
                    </div>
                    <p className={cn(T.caption, "mb-6 flex-1 text-sm text-muted-foreground leading-relaxed")}>
                      {initiative.desc}
                    </p>
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-primary group-hover:gap-2 transition-all">
                      Read full dossier <ArrowRight className="size-3.5" />
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
