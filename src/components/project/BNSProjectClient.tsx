"use client";

import React from "react";
import { motion } from "motion/react";
import { fadeInUp, staggerContainer } from "@/motion/variants";
import { ProjectTimeline } from "./ProjectTimeline";
import { ProjectImpactMetrics } from "./ProjectImpactMetrics";
import { SectionShell, SectionHeader } from "@/layouts/section-shell";
import { Heart, Eye, Lightbulb } from "lucide-react";

export function BNSProjectClient() {
  return (
    <>
      {/* Mission */}
      <SectionShell>
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center"
        >
          <motion.div variants={fadeInUp}>
            <Heart className="size-10 mx-auto mb-6 text-primary" />
            <h2 className="text-3xl md:text-5xl font-bold font-heading tracking-tight mb-6">
              Our Mission
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-3xl mx-auto">
              To transform Kenya&apos;s national and county budgets from
              impenetrable government documents into clear, actionable narratives
              that empower every citizen to participate in the democratic process
              of resource allocation.
            </p>
          </motion.div>
        </motion.div>
      </SectionShell>

      {/* Vision */}
      <SectionShell className="bg-muted/30">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center"
        >
          <motion.div variants={fadeInUp}>
            <Eye className="size-10 mx-auto mb-6 text-primary" />
            <h2 className="text-3xl md:text-5xl font-bold font-heading tracking-tight mb-6">
              Our Vision
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-3xl mx-auto">
              A Kenya where every citizen — regardless of education level,
              language, or location — can understand, question, and influence how
              public resources are allocated and spent.
            </p>
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

      {/* Timeline */}
      <SectionShell className="bg-muted/30">
        <SectionHeader
          eyebrow="Journey"
          title="Project Timeline"
          description="From inception to scale — the milestones that define our growth."
        />
        <ProjectTimeline />
      </SectionShell>

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
          {[
            {
              title: "Budget Literacy Programme",
              desc: "Interactive learning modules that break down the budget cycle, sector allocations, and parliamentary processes into digestible lessons.",
            },
            {
              title: "County Budget Tracking",
              desc: "Hyper-local budget analysis for all 47 counties, enabling citizens to track development projects and county expenditure.",
            },
            {
              title: "Public Participation Hub",
              desc: "A centralized platform that notifies citizens about public comment windows and guides them through submitting memoranda.",
            },
          ].map((initiative, i) => (
            <motion.div
              key={i}
              variants={fadeInUp}
              className="p-6 rounded-xl border border-border/60 bg-card"
            >
              <Lightbulb className="size-8 text-primary mb-4" />
              <h3 className="font-semibold text-lg mb-2">{initiative.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {initiative.desc}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </SectionShell>
    </>
  );
}
