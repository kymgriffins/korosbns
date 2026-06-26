"use client";

import React from "react";
import { motion } from "motion/react";
import { team } from "@/constants/team";
import Image from "next/image";
import { SectionHeader, SectionShell } from "@/layouts/section-shell";

export default function LandingTeam() {
  return (
    <SectionShell
      spacing="loose"
      className="overflow-hidden border-t border-border/10 bg-background"
    >
      <SectionHeader
        eyebrow="Our Team"
        title={
          <>
            Meet the minds behind the{" "}
            <span className="font-heading italic">story</span>.
          </>
        }
        description="A dedicated group of researchers, storytellers, and tech innovators working together to bring transparency to Kenya's public budgets."
      />

      <div className="hidden gap-x-8 gap-y-16 md:grid md:grid-cols-2 lg:grid-cols-3">
        {team.map((member, i) => (
          <motion.div
            key={member.name}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, delay: i * 0.1 }}
            className="group"
          >
            <div className="relative mb-6 aspect-[4/5] overflow-hidden rounded-3xl border border-border/40 bg-zinc-100 dark:bg-zinc-900">
              <Image
                src={member.image}
                alt={member.name}
                fill
                className="object-cover object-top transition-transform duration-700 group-hover:scale-104"
                sizes="(max-width: 1024px) 50vw, 33vw"
              />
            </div>
            <h3 className="mb-1 text-2xl font-bold tracking-tight">{member.name}</h3>
            <p className="mb-4 text-xs font-semibold text-primary">
              {member.role}
            </p>
            <p className="text-sm leading-relaxed text-foreground/70">
              {member.description}
            </p>
          </motion.div>
        ))}
      </div>

      <div className="flex w-full flex-col gap-6 md:hidden">
        {team.map((member, i) => (
          <motion.div
            key={member.name}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5, delay: i * 0.05 }}
            className="flex w-full flex-col gap-4 rounded-3xl border border-border bg-card p-5"
          >
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-border/20 bg-zinc-100 dark:bg-zinc-900">
              <Image
                src={member.image}
                alt={member.name}
                fill
                className="object-cover object-top"
                sizes="100vw"
              />
            </div>
            <div>
              <h3 className="mb-0.5 text-xl font-bold tracking-tight">{member.name}</h3>
              <p className="mb-2.5 text-xs font-semibold text-primary">
                {member.role}
              </p>
              <p className="text-xs leading-relaxed text-foreground/80">
                {member.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </SectionShell>
  );
}
