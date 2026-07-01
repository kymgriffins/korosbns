"use client";

import React from "react";
import { motion } from "motion/react";
import { team } from "@/constants/team";
import Image from "next/image";
import { SectionHeader, SectionShell } from "@/layouts/section-shell";
import { fadeInUp, staggerContainer } from "@/motion/variants";

export default function LandingTeam() {
  return (
    <SectionShell spacing="loose" className="overflow-hidden border-t border-border/10 bg-background">
      <SectionHeader
        eyebrow="Our Team"
        title={<>Meet the <span className="font-heading italic text-primary">people</span> behind the story</>}
        description="Youth leaders, data journalists, and civic technologists driving fiscal transparency in Kenya."
      />
      <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }} className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {team.slice(0, 8).map((member) => (
          <motion.div key={member.name} variants={fadeInUp} className="group">
            <div className="relative mb-4 aspect-[3/4] overflow-hidden rounded-2xl border border-border/30 bg-muted transition-all duration-300 group-hover:border-primary/30 group-hover:shadow-lg group-hover:shadow-primary/5">
              <Image src={member.image} alt={member.name} fill className="object-cover transition-all duration-500 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            </div>
            <h3 className="text-sm font-bold text-foreground">{member.name}</h3>
            {member.role && <p className="mt-0.5 text-xs text-foreground/50">{member.role}</p>}
          </motion.div>
        ))}
      </motion.div>
    </SectionShell>
  );
}
