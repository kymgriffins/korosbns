"use client";

import React from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { fadeInUp, staggerContainer, float } from "@/motion/variants";
import { ProjectImpactMetrics } from "./ProjectImpactMetrics";
import { SectionShell, SectionHeader } from "@/layouts/section-shell";
import { Heart, Eye, Lightbulb, ArrowRight, Sparkles, Target, Users, BookOpen } from "lucide-react";
import { useCohortImages } from "@/hooks/use-marketing";

const initiatives = [
  {
    id: "budget-literacy",
    title: "Budget Literacy Programme",
    desc: "Interactive learning modules that break down the budget cycle, sector allocations, and parliamentary processes into digestible lessons.",
    icon: BookOpen,
  },
  {
    id: "county-budget-tracking",
    title: "County Budget Tracking",
    desc: "Hyper-local budget analysis for all 47 counties, enabling citizens to track development projects and county expenditure.",
    icon: Target,
  },
  {
    id: "public-participation",
    title: "Public Participation Hub",
    desc: "A centralized platform that notifies citizens about public comment windows and guides them through submitting memoranda.",
    icon: Users,
  },
];

export function BNSProjectClient() {
  const { data: cohortData } = useCohortImages();
  const projectImages = cohortData?.images ?? [];

  return (
    <>
      {/* Mission — with motion flair */}
      <SectionShell className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,color-mix(in_oklch,var(--primary)_8%,transparent),transparent_60%)]" />
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="relative z-10 max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-center"
        >
          <motion.div variants={fadeInUp} className="space-y-6">
            <motion.div
              animate={{ rotate: [0, 5, 0, -5, 0], scale: [1, 1.05, 1] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="inline-flex size-14 items-center justify-center rounded-2xl bg-primary/10 border border-primary/20 text-primary"
            >
              <Heart className="size-7" />
            </motion.div>
            <motion.h2
              variants={fadeInUp}
              className="text-4xl md:text-5xl font-bold font-heading tracking-tight"
            >
              Our{" "}
              <span className="bg-linear-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Mission
              </span>
            </motion.h2>
            <motion.p
              variants={fadeInUp}
              className="text-lg text-muted-foreground leading-relaxed"
            >
              To transform Kenya&apos;s national and county budgets from
              impenetrable government documents into clear, actionable narratives
              that empower every citizen to participate in the democratic process
              of resource allocation.
            </motion.p>
            <motion.div variants={fadeInUp} className="flex gap-3 pt-2">
              {["Transparency", "Empowerment", "Participation"].map((tag) => (
                <span
                  key={tag}
                  className="text-xs font-semibold px-3 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-primary"
                >
                  {tag}
                </span>
              ))}
            </motion.div>
          </motion.div>
          <motion.div
            variants={fadeInUp}
            className="relative h-72 md:h-80 rounded-2xl overflow-hidden border border-border/40 bg-gradient-to-br from-primary/5 to-primary/10 hidden md:block"
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                variants={float}
                animate="animate"
                className="flex flex-col items-center gap-4 text-primary/20"
              >
                <Heart className="size-24" />
                <span className="text-lg font-bold tracking-widest uppercase">BNS</span>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </SectionShell>

      {/* Vision — with motion flair */}
      <SectionShell className="bg-muted/30 relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_70%_80%,color-mix(in_oklch,var(--primary)_6%,transparent),transparent_60%)]" />
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="relative z-10 max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-center"
        >
          <motion.div
            variants={fadeInUp}
            className="relative h-72 md:h-80 rounded-2xl overflow-hidden border border-border/40 bg-gradient-to-br from-primary/5 to-blue-500/10 hidden md:block order-first md:order-first"
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                animate={{ scale: [1, 1.08, 1], rotate: [0, 3, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="flex flex-col items-center gap-4 text-primary/20"
              >
                <Eye className="size-24" />
                <span className="text-lg font-bold tracking-widest uppercase">2040</span>
              </motion.div>
            </div>
          </motion.div>
          <motion.div variants={fadeInUp} className="space-y-6">
            <motion.div
              animate={{ rotate: [0, -5, 0, 5, 0], scale: [1, 1.05, 1] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="inline-flex size-14 items-center justify-center rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-500"
            >
              <Eye className="size-7" />
            </motion.div>
            <motion.h2
              variants={fadeInUp}
              className="text-4xl md:text-5xl font-bold font-heading tracking-tight"
            >
              Our{" "}
              <span className="bg-linear-to-r from-blue-500 to-blue-400 bg-clip-text text-transparent">
                Vision
              </span>
            </motion.h2>
            <motion.p
              variants={fadeInUp}
              className="text-lg text-muted-foreground leading-relaxed"
            >
              A Kenya where every citizen — regardless of education level,
              language, or location — can understand, question, and influence how
              public resources are allocated and spent.
            </motion.p>
            <motion.div variants={fadeInUp} className="flex gap-3 pt-2">
              {["Inclusion", "Accountability", "Equity"].map((tag) => (
                <span
                  key={tag}
                  className="text-xs font-semibold px-3 py-1.5 rounded-full border border-blue-500/20 bg-blue-500/5 text-blue-500"
                >
                  {tag}
                </span>
              ))}
            </motion.div>
          </motion.div>
        </motion.div>
      </SectionShell>

      {/* Impact Metrics */}
      <SectionShell>
        <SectionHeader
          eyebrow="Impact"
          title="By the Numbers"
          description="Tracking our progress toward fiscal literacy for all Kenyans."
        />
        <ProjectImpactMetrics />
      </SectionShell>

      {/* Project Gallery — images from landing page */}
      {projectImages.length > 0 && (
        <SectionShell className="bg-muted/30">
          <SectionHeader
            eyebrow="In Action"
            title="Our Projects in the Field"
            description="Moments from our civic workshops, townhalls, and community engagements across Kenya."
          />
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {projectImages.slice(0, 6).map((img, i) => (
              <motion.div
                key={i}
                variants={fadeInUp}
                custom={i}
                className="group relative aspect-[4/3] rounded-xl overflow-hidden border border-border/60 bg-card"
              >
                <img
                  src={img.src}
                  alt={img.alt}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                  <span className="text-sm font-semibold text-white">{img.alt}</span>
                </div>
              </motion.div>
            ))}
            {initiatives.slice(0, Math.max(0, 6 - projectImages.length)).map((initiative, i) => {
              const Icon = initiative.icon;
              return (
                <motion.div
                  key={initiative.id}
                  variants={fadeInUp}
                  custom={projectImages.length + i}
                >
                  <Link
                    href={`/bns-project/${initiative.id}`}
                    className="group block h-full rounded-xl border border-border/60 bg-card p-6 transition-all duration-300 hover:border-primary/30 hover:shadow-lg"
                  >
                    <Icon className="size-10 text-primary mb-4" />
                    <h3 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors">
                      {initiative.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                      {initiative.desc}
                    </p>
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary">
                      View Timeline <ArrowRight className="size-3" />
                    </span>
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>
        </SectionShell>
      )}

      {/* Key Initiatives */}
      <SectionShell>
        <SectionHeader
          eyebrow="Initiatives"
          title="Key Initiatives"
          description="Our flagship programs driving civic engagement and budget transparency."
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
            return (
              <motion.div
                key={initiative.id}
                variants={fadeInUp}
                className="group p-6 rounded-xl border border-border/60 bg-card transition-all duration-300 hover:border-primary/30 hover:shadow-lg"
              >
                <Icon className="size-8 text-primary mb-4" />
                <h3 className="font-semibold text-lg mb-2">{initiative.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                  {initiative.desc}
                </p>
                <Link
                  href={`/bns-project/${initiative.id}`}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:gap-2 transition-all"
                >
                  View details <ArrowRight className="size-3" />
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      </SectionShell>
    </>
  );
}
