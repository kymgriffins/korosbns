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
import { BNS_PARTNERS_NAMED } from "@/constants/programmes-content";

const TISA_SPONSOR: Partner = {
  id: "tisa",
  name: "TISA Kenya",
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
  const href = partner.website || undefined;
  const className = "group flex shrink-0 items-center justify-center px-6 md:px-10";
  const inner = (
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
        <div className="flex h-full w-full items-center justify-center px-2 text-center text-xs font-semibold leading-snug text-foreground md:text-sm">
          {partner.name}
        </div>
      )}
    </div>
  );

  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
        aria-label={`Visit ${partner.name} website`}
      >
        {inner}
      </a>
    );
  }

  return (
    <div className={className} aria-label={partner.name}>
      {inner}
    </div>
  );
}

export default function PartnersMarquee() {
  const { config } = useOrg();
  const [partners, setPartners] = useState<Partner[]>([]);

  useEffect(() => {
    const fromApi = config.partners?.length ? mapOrgPartners(config.partners) : [];
    const all = fromApi.length ? fromApi : partnerData.get();

    const resolved: Partner[] = BNS_PARTNERS_NAMED.map((named) => {
      const match = all.find(
        (p) =>
          p.id === named.id ||
          p.name.toLowerCase().includes(named.name.toLowerCase().split(" ")[0]!.toLowerCase()),
      );
      if (named.id === "tisa") {
        return {
          ...TISA_SPONSOR,
          ...match,
          name: "TISA Kenya",
          logo_url: TISA_SPONSOR.logo_url,
          website: match?.website || TISA_SPONSOR.website,
        };
      }
      return {
        id: named.id,
        name: named.name,
        website: match?.website || named.website || "",
        logo_url: match?.logo_url || "",
        role: named.role,
        tier: "partner",
        is_active: true,
        is_consortium: false,
      };
    });

    setPartners(resolved);
  }, [config.partners]);

  if (partners.length === 0) return null;

  return (
    <LandingSection>
      <LandingSectionEyebrow muted>BNS Partners</LandingSectionEyebrow>
      <LandingContent className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
        {partners.map((partner) => (
          <PartnerLogo key={partner.id || partner.name} partner={partner} prominent />
        ))}
      </LandingContent>
    </LandingSection>
  );
}
