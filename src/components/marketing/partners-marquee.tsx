"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { partnerData, type Partner } from "@/data/partners";
import { useOrg } from "@/contexts/org-context";
import {
  LandingContent,
  LandingSection,
  LandingSectionEyebrow,
} from "@/layouts/landing-section";

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

    setMainSponsors([tisaFromData ? { ...TISA_SPONSOR, ...tisaFromData, logo_url: TISA_SPONSOR.logo_url } : TISA_SPONSOR]);
  }, [config.partners]);

  if (mainSponsors.length === 0) return null;

  return (
    <LandingSection>
      <LandingSectionEyebrow muted>Partners</LandingSectionEyebrow>
      <LandingContent className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
        {mainSponsors.map((partner) => (
          <PartnerLogo key={partner.id || partner.name} partner={partner} prominent />
        ))}
      </LandingContent>
    </LandingSection>
  );
}
