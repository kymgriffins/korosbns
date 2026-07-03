"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { SECTION_SHELL_INNER } from "@/layouts/section-shell";
import { partnerData, type Partner } from "@/data/partners";
import { useOrg } from "@/contexts/org-context";
import { motion } from "motion/react";
import { fadeInUp, staggerContainer } from "@/motion/variants";

const TISA_SPONSOR: Partner = {
  id: "tisa",
  name: "Tax Justice Network Africa (TISA)",
  website: "https://newtisa.tisa.co.ke/",
  logo_url: "https://newtisa.tisa.co.ke/wp-content/uploads/2025/03/New-TISA-logo.svg",
  tier: "sponsor",
  is_active: true,
  is_consortium: false,
};

function mapOrgPartners(
  apiPartners: NonNullable<ReturnType<typeof useOrg>["config"]["partners"]>,
): Partner[] {
  return apiPartners.map((p, index) => ({
    id: p.slug ?? `partner-${index}`,
    name: p.name,
    website: p.website_url,
    role: p.role ?? p.description,
    logo_url: p.logo_url,
    tier: p.tier,
    is_active: true,
    is_consortium: p.is_consortium ?? false,
  }));
}

function PartnerLogo({ partner, prominent = false }: { partner: Partner; prominent?: boolean }) {
  return (
    <a
      href={partner.website || "#"}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex shrink-0 items-center justify-center px-6 md:px-10"
      aria-label={`Visit ${partner.name} website`}
    >
      <div
        className={`relative transition-all duration-500 group-hover:scale-105 ${
          prominent
            ? "h-20 w-44 opacity-90 grayscale-0 md:h-24 md:w-52"
            : "h-14 w-28 opacity-50 grayscale group-hover:opacity-100 group-hover:grayscale-0 md:h-20 md:w-40"
        }`}
      >
        {partner.logo_url ? (
          <Image
            src={partner.logo_url}
            alt={`${partner.name} logo`}
            fill
            className="object-contain"
            sizes={prominent ? "(max-width: 768px) 176px, 208px" : "(max-width: 768px) 112px, 160px"}
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
  const { config } = useOrg();
  const [mainSponsors, setMainSponsors] = useState<Partner[]>([]);

  useEffect(() => {
    const fromApi = config.partners?.length ? mapOrgPartners(config.partners) : [];
    const all = fromApi.length ? fromApi : partnerData.get();
    const tisaFromData = all.find(
      (p) =>
        (p.id?.toLowerCase() === "tisa" ||
          p.name.toLowerCase().includes("tisa") ||
          p.website?.includes("newtisa.tisa.co.ke")) &&
        (p.is_active ?? true) &&
        !p.is_consortium,
    );

    // Always show TISA as the main sponsor logo on landing.
    setMainSponsors([tisaFromData ? { ...TISA_SPONSOR, ...tisaFromData, logo_url: TISA_SPONSOR.logo_url } : TISA_SPONSOR]);
  }, [config.partners]);

  if (mainSponsors.length === 0) return null;

  return (
    <section className="overflow-hidden border-y border-border/40 bg-background py-12 md:py-16">
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <motion.div variants={fadeInUp}>
          <div className={`${SECTION_SHELL_INNER} mb-8 text-center`}>
            <span className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Main Sponsor
            </span>
          </div>
        </motion.div>

        <motion.div variants={fadeInUp}>
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
            {mainSponsors.map((partner) => (
              <PartnerLogo key={partner.id || partner.name} partner={partner} prominent />
            ))}
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
