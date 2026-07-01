"use client";

import { motion } from "motion/react";
import { fadeInUp, staggerContainer } from "@/motion/variants";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Camera, Video, Monitor, Scissors, ArrowRight, Sparkles } from "lucide-react";
import { SectionShell, SectionHeader } from "@/layouts/section-shell";

const services = [
  { icon: Video, label: "Videography", desc: "Corporate events, documentaries, music videos" },
  { icon: Camera, label: "Photography", desc: "Portraits, events, product photography" },
  { icon: Monitor, label: "Studio Rental", desc: "Fully equipped studio with lighting & backdrops" },
  { icon: Scissors, label: "Post-Production", desc: "Editing, color grading, motion graphics" },
];

export function BNSStudioSection() {
  return (
    <SectionShell className="relative overflow-hidden border-t border-border/40 bg-gradient-to-b from-background to-primary/[0.02]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,color-mix(in_oklch,var(--primary)_5%,transparent),transparent_70%)]" />
      <div className="relative z-10">
        <SectionHeader
          eyebrow="BNS Studio"
          title={<><Sparkles className="mr-2 inline size-6 text-primary" />Premium media <span className="font-heading italic text-primary">production</span></>}
          description="From concept to final cut — professional videography, photography, and post-production services."
        />
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }} className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((s) => {
            const Icon = s.icon;
            return (
              <motion.div key={s.label} variants={fadeInUp} className="group relative overflow-hidden rounded-2xl border border-border/30 bg-card p-6 transition-all duration-300 hover:border-primary/30 hover:shadow-lg">
                <div className="mb-4 flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-all group-hover:bg-primary group-hover:text-primary-foreground group-hover:shadow-lg group-hover:shadow-primary/20">
                  <Icon className="size-6" />
                </div>
                <h3 className="mb-1.5 text-lg font-bold text-foreground">{s.label}</h3>
                <p className="text-sm leading-relaxed text-foreground/60">{s.desc}</p>
              </motion.div>
            );
          })}
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.5, duration: 0.5 }} className="mt-10 text-center">
          <Button variant="outline" size="lg" className="gap-2 rounded-full px-8 py-6 text-base font-bold" asChild>
            <Link href="/contact">Book a Session <ArrowRight className="size-5" /></Link>
          </Button>
        </motion.div>
      </div>
    </SectionShell>
  );
}
