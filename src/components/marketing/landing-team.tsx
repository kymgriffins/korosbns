"use client";

import React from "react";
import { motion } from "motion/react";
import Link from "next/link";
import Image from "next/image";
import { team } from "@/data/org";
import { slugifyName } from "@/lib/team";
import { LANDING_TYPOGRAPHY as T } from "@/constants/landing-typography";
import { landingContent } from "@/content";
import {
  LandingSection,
  LandingSectionHeader,
} from "@/layouts/landing-section";
import { cn } from "@/utils";

export default function LandingTeam() {
  return (
    <LandingSection>
      <LandingSectionHeader
        eyebrow={landingContent.team.eyebrow}
        title={
          <>
            {landingContent.team.titleBefore}{" "}
            <span className={T.highlight}>{landingContent.team.titleHighlight}</span>
            {landingContent.team.titleAfter}
          </>
        }
        description={landingContent.team.description}
      />

      <div className="hidden gap-x-8 gap-y-16 md:grid md:grid-cols-2 lg:grid-cols-3">
        {team.map((member, i) => {
          const href = `/team/${slugifyName(member.name)}`;
          return (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.7, delay: i * 0.1 }}
              className="group"
            >
              <Link href={href} className="block outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-3xl">
                <div className="relative mb-6 aspect-[4/5] overflow-hidden rounded-3xl border border-border/40 bg-muted">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover object-top transition-transform duration-700 group-hover:scale-104"
                    sizes="(max-width: 1024px) 50vw, 33vw"
                  />
                </div>
                <h3 className={cn(T.cardTitle, "transition-colors group-hover:text-primary")}>{member.name}</h3>
                <p className={cn(T.role, "mb-4 mt-1")}>{member.role}</p>
                <p className={T.caption}>{member.description}</p>
              </Link>
            </motion.div>
          );
        })}
      </div>

      <div className="flex w-full flex-col gap-6 md:hidden">
        {team.map((member, i) => {
          const href = `/team/${slugifyName(member.name)}`;
          return (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
            >
              <Link
                href={href}
                className="flex w-full flex-col gap-4 rounded-3xl border border-border bg-card p-5 outline-none transition-colors hover:border-primary/40 focus-visible:ring-2 focus-visible:ring-ring"
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-border/20 bg-muted">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover object-top"
                    sizes="100vw"
                  />
                </div>
                <div>
                  <h3 className={T.cardTitle}>{member.name}</h3>
                  <p className={cn(T.role, "mb-2.5 mt-0.5")}>{member.role}</p>
                  <p className={T.caption}>{member.description}</p>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </LandingSection>
  );
}
