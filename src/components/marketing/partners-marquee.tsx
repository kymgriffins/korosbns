"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Marquee } from "@/ui/marquee";
import { SECTION_SHELL_INNER } from "@/layouts/section-shell";
import { partnerData, type Partner } from "@/data/partners";
import { motion } from "motion/react";
import { fadeInUp, staggerContainer } from "@/motion/variants";

function PartnerLogo({ partner }: { partner: Partner }) {
  return (
    <a
      href={partner.website || "#"}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex shrink-0 items-center justify-center px-6 md:px-10"
      aria-label={`Visit ${partner.name} website`}
    >
      <div className="relative h-14 w-28 opacity-50 grayscale transition-all duration-500 group-hover:scale-105 group-hover:opacity-100 group-hover:grayscale-0 md:h-20 md:w-40">
        {partner.logo_url ? (
          <Image
            src={partner.logo_url}
            alt={`${partner.name} logo`}
            fill
            className="object-contain"
            sizes="(max-width: 768px) 112px, 160px"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-xs font-semibold text-muted-foreground">
            {partner.name}
          </div>
        )}
      </div>
    </a>
  );
}

export default function PartnersMarquee() {
  const [activePartners, setActivePartners] = useState<Partner[]>([]);
  const [foundingPartners, setFoundingPartners] = useState<Partner[]>([]);

  useEffect(() => {
    const all = partnerData.get();
    setActivePartners(all.filter((p) => p.is_active));
    setFoundingPartners(all.filter((p) => !p.is_active));
  }, []);

  return (
    <section className="overflow-hidden border-y border-border/40 bg-background py-12 md:py-20">
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <motion.div variants={fadeInUp}>
          <div className={`${SECTION_SHELL_INNER} mb-8 text-center`}>
            <span className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Partnering for Impact
            </span>
          </div>
        </motion.div>

        {activePartners.length > 0 && (
          <motion.div variants={fadeInUp}>
            <div className="relative">
              <Marquee pauseOnHover className="[--duration:28s] [--gap:2rem] md:[--gap:3rem]">
                {activePartners.map((partner) => (
                  <PartnerLogo key={partner.id || partner.name} partner={partner} />
                ))}
              </Marquee>
            </div>
          </motion.div>
        )}

        {foundingPartners.length > 0 && (
          <motion.div variants={fadeInUp} className="mt-12">
            <div className={`${SECTION_SHELL_INNER} mb-6 text-center`}>
              <span className="text-xs text-muted-foreground/60 uppercase tracking-wider">
                Founding Consortium
              </span>
            </div>
            <div className="relative">
              <Marquee pauseOnHover className="[--duration:22s] [--gap:2rem] md:[--gap:3rem]">
                {foundingPartners.map((partner) => (
                  <PartnerLogo key={partner.id || partner.name} partner={partner} />
                ))}
              </Marquee>
            </div>
          </motion.div>
        )}
      </motion.div>
    </section>
  );
}
