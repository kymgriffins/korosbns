"use client";

import { motion } from "motion/react";
import { fadeInUp, staggerContainer } from "@/motion/variants";
import { Button } from "@/ui/button";
import Link from "next/link";
import { Camera, Video, Monitor, Scissors, ArrowRight } from "lucide-react";

const services = [
  { icon: Video, label: "Videography", desc: "Corporate events, documentaries, music videos" },
  { icon: Camera, label: "Photography", desc: "Portraits, events, product photography" },
  { icon: Monitor, label: "Studio Rental", desc: "Fully equipped studio with lighting & backdrops" },
  { icon: Scissors, label: "Post-Production", desc: "Editing, color grading, motion graphics" },
];

export function BNSStudioSection() {
  return (
    <section className="w-full py-20 md:py-32 overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-6 md:px-16">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center"
        >
          <motion.div variants={fadeInUp} className="space-y-6">
            <span className="text-xs font-semibold text-primary">
              BNS Studio
            </span>
            <h2 className="text-3xl md:text-5xl font-bold font-heading tracking-tight">
              Professional Media Production for Storytellers
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              From budget explainers to brand documentaries, BNS Studio offers
              end-to-end videography, photography, and post-production services.
              Revenue supports our civic education mission.
            </p>

            <div className="grid grid-cols-2 gap-4 pt-4">
              {services.map((s, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <s.icon className="size-5 text-primary" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold">{s.label}</div>
                    <div className="text-xs text-muted-foreground">{s.desc}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-4 pt-4">
              <Link href="/bns-studio">
                <Button size="lg" className="gap-2 rounded-full">
                  Book a Shoot <ArrowRight className="size-4" />
                </Button>
              </Link>
              <Link href="/bns-studio#portfolio">
                <Button size="lg" variant="outline" className="rounded-full">
                  View Portfolio
                </Button>
              </Link>
              <Link href="/bns-studio#booking">
                <Button size="lg" variant="ghost" className="rounded-full">
                  Get a Quote
                </Button>
              </Link>
            </div>
          </motion.div>

          <motion.div
            variants={fadeInUp}
            className="relative aspect-video lg:aspect-square rounded-2xl overflow-hidden border border-border/60 bg-primary/5"
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <Camera className="size-16 mx-auto mb-4 text-primary/40" />
                <p className="text-muted-foreground text-sm">BNS Studio</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
