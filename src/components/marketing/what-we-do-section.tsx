"use client";

import React from "react";
import { motion } from "motion/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, BarChart3, Users, Newspaper, Video, FileCheck, Globe } from "lucide-react";
import { fadeInUp, staggerContainer } from "@/motion/variants";
import { SectionHeader, SectionShell } from "@/layouts/section-shell";
import { Routes } from "@/constants/routes";

const services = [
  { icon: BarChart3, title: "Budget Analysis", description: "Breaking down complex national and county budgets into clear, visual insights." },
  { icon: Newspaper, title: "Civic Journalism", description: "Investigative stories that connect budget data to real-world impact on communities." },
  { icon: Users, title: "Community Training", description: "Workshops and resources empowering citizens to track public spending." },
  { icon: Video, title: "Multimedia Content", description: "Engaging videos, infographics, and interactive tools for fiscal literacy." },
  { icon: FileCheck, title: "Policy Tracking", description: "Monitoring legislation and policy changes that affect budget allocation." },
  { icon: Globe, title: "Digital Tools", description: "Open-source platforms for budget visualization, alerts, and civic engagement." },
];

const WhatWeDoSection = () => {
  return (
    <SectionShell className="relative overflow-hidden border-t border-border/40 bg-background text-foreground">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,color-mix(in_oklch,var(--primary)_8%,transparent),transparent_70%)]" />
      <div className="relative z-10">
        <SectionHeader
          eyebrow="What We Do"
          title={<>Making <span className="font-heading italic text-primary">fiscal</span> literacy accessible to all Kenyans</>}
          description="From budget analysis to community training — we equip citizens with the tools to understand and engage with public finance."
        />
        <motion.div
          variants={staggerContainer}
          initial="hidden" whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
        >
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={service.title}
                variants={fadeInUp}
                className="group relative rounded-2xl border border-border/30 bg-card p-6 transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5"
              >
                <div className="mb-4 flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <Icon className="size-6" />
                </div>
                <h3 className="mb-2 text-lg font-bold text-foreground">{service.title}</h3>
                <p className="text-sm leading-relaxed text-foreground/60">{service.description}</p>
              </motion.div>
            );
          })}
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="mt-12 text-center"
        >
          <Link href={Routes.BudgetNews}>
            <Button variant="outline" size="lg" className="gap-2 rounded-full px-8 py-6 text-base font-bold">
              Explore Our Work <ArrowRight className="size-5" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </SectionShell>
  );
};

export default WhatWeDoSection;
