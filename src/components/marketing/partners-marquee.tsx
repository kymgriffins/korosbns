"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Marquee } from "@/components/ui/marquee";
import { SECTION_SHELL_INNER } from "@/layouts/section-shell";
import { partnerData, type Partner } from "@/data/partners";
import { motion } from "motion/react";
import { fadeInUp, staggerContainer } from "@/motion/variants";

function PartnerLogo({ partner }: { partner: Partner }) {
  return (
    <a href={partner.website || "#"} target="_blank" rel="noopener noreferrer" className="group relative flex h-16 w-40 shrink-0 items-center justify-center rounded-xl border border-border/20 bg-card/50 px-6 transition-all duration-300 hover:border-primary/30 hover:bg-card hover:shadow-md">
      {partner.logo_url ? (
        <Image src={partner.logo_url} alt={partner.name} width={100} height={32} className="max-h-8 w-auto object-contain grayscale transition-all duration-300 group-hover:grayscale-0" />
      ) : (
        <span className="text-xs font-semibold text-muted-foreground group-hover:text-foreground transition-colors">{partner.name}</span>
      )}
    </a>
  );
}

export default function PartnersMarquee() {
  const [partners, setPartners] = useState<Partner[]>([]);
  useEffect(() => { partnerData.fetch().then(setPartners); }, []);
  if (!partners.length) return null;

  return (
    <section className="relative overflow-hidden border-y border-border/10 bg-background py-16">
      <div className={SECTION_SHELL_INNER}>
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }} className="mb-8 flex flex-col items-center gap-4">
          <motion.span variants={fadeInUp} className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Trusted by</motion.span>
        </motion.div>
      </div>
      <Marquee pauseOnHover className="[--duration:40s]">
        {partners.map((partner, idx) => <PartnerLogo key={partner.name + idx} partner={partner} />)}
      </Marquee>
      <Marquee pauseOnHover reverse className="[--duration:40s] mt-4">
        {partners.map((partner, idx) => <PartnerLogo key={`rev-${partner.name}-${idx}`} partner={partner} />)}
      </Marquee>
    </section>
  );
}
