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
    subtitle: "A BNS Studios Production · In Partnership with House of Fiscal Wisdom & Luminate",
    desc: "Led by Dr. Lyla Latif, Project TERRA investigates how platform algorithms and data centre tax holidays exclude African women workers from public revenue systems.",
    icon: Sparkles,
    image: "https://img.youtube.com/vi/it8rOKSYKnc/hqdefault.jpg",
    badge: "BNS Studios · Flagship 2026–2027",
    programme: "BNS Studios",
    partner: "House of Fiscal Wisdom & Luminate",
    href: "/bns-project/terra",
  },
  {
    id: "cabri-digital-pfm",
    title: "Project Two: Digital PFM Reform Stories",
    subtitle: "A BNS Studios Continental Production · In Partnership with CABRI",
    desc: "A pan-African bilingual documentary series documenting public financial management digital transformations across 10 African nations with interactive English/French edition switching.",
    icon: Sparkles,
    image: "https://img.youtube.com/vi/kWpY4K1uI20/hqdefault.jpg",
    badge: "BNS Studios · Pan-African Bilingual 2026",
    programme: "BNS Studios",
    partner: "CABRI",
    href: "/projects/cabri-digital-pfm-reforms",
  },
  {
    id: "hofw-iff",
    title: "Project Three: Illicit Financial Flows & Extractive Governance",
    subtitle: "A Wanahabari Lab Forensic Investigation · In Partnership with House of Fiscal Wisdom",
    desc: "Forensic video briefing led by Dr. Lyla Latif exposing how multinational resource extraction contracts disguise capital flight as allowable business expenses in Benin and Cabo Verde.",
    icon: Target,
    image: "https://img.youtube.com/vi/G5ddu4I6mNs/hqdefault.jpg",
    badge: "Wanahabari Lab · Forensic Spotlight 2026",
    programme: "Wanahabari Lab",
    partner: "House of Fiscal Wisdom",
    href: "/projects/illicit-financial-flows-benin-cabo-verde",
  },
  {
    id: "afrodad-debt-and-contracts",
    title: "Project Four: Sovereign Debt Justice & Contract Red Flags",
    subtitle: "A BNS Connect & Wanahabari Lab Initiative · In Partnership with AFRODAD & HOFW",
    desc: "Continental public debt mobilization in Nairobi featuring Dr. Lyla Latif's 'Red Flags in Government Contracts' book launch, sovereign debt cancellation, and forensic citizen contract audits.",
    icon: Users,
    image: "/images/events/afrodad-2026/george-wajackoyah.jpeg",
    badge: "BNS Connect · Continental Plenary 2026",
    programme: "BNS Connect",
    partner: "AFRODAD & House of Fiscal Wisdom",
    href: "/events/event-afrodad-debt-conference-2026",
  },
  {
    id: "budget-literacy",
    title: "Budget Literacy Programme (UoN Cohort One)",
    subtitle: "A BNS Mashinani Initiative · National Civic Literacy Rails",
    desc: "Interactive learning modules that break down the budget cycle, sector allocations, and parliamentary processes into digestible lessons.",
    icon: BookOpen,
    image: "/images/towwnhallmay/129A3863.jpg",
    badge: "BNS Mashinani · Grassroots",
    programme: "BNS Mashinani",
    partner: "Grassroots Alliances",
    href: "/bns-project/story-mty40jp1",
  },
  {
    id: "public-participation",
    title: "Public Participation Hub",
    subtitle: "A BNS Connect Initiative · Civic Input & Memoranda Desk",
    desc: "A centralized platform that notifies citizens about public comment windows and guides them through submitting memoranda.",
    icon: Users,
    image: BNS_COMMUNITY_IMAGES.stakeholdersA,
    badge: "BNS Connect · Citizen Oversight",
    programme: "BNS Connect",
    partner: "Civil Society Coalitions",
    href: "/programmes/connect",
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
