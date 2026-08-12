"use client";

import React from "react";
import Image from "next/image";
import { ShieldCheck, ExternalLink, Building2 } from "lucide-react";
import { LandingContent, LandingSection, LandingSectionHeader } from "@/layouts/landing-section";

const PARTNERS = [
  {
    id: "house-of-fiscal-wisdom",
    name: "House of Fiscal Wisdom",
    role: "Fiscal literacy and public finance dialogue",
    website: "https://house-of-fiscal-wisdom.org/",
    logo_url: "",
    tag: "Knowledge Partner",
  },
  {
    id: "committee-on-fiscal-studies",
    name: "Committee on Fiscal Studies (UoN)",
    role: "Academic and policy research on public finance",
    website: "https://cfs.uonbi.ac.ke/",
    logo_url: "https://cfs.uonbi.ac.ke/sites/default/files/inline-images/UoN_Logo_4.png",
    tag: "Research Partner",
  },
  {
    id: "tisa",
    name: "TISA Kenya",
    role: "Transparency, integrity and social accountability",
    website: "https://newtisa.tisa.co.ke/",
    logo_url: "https://newtisa.tisa.co.ke/wp-content/uploads/2025/03/New-TISA-logo.svg",
    tag: "Accountability Partner",
  },
];

export function ProgrammesTrustBar() {
  return (
    <LandingSection id="partners" aria-labelledby="partners-heading" className="py-12 border-t border-border/40">
      <LandingSectionHeader
        title={
          <>
            <span className="text-primary">Institutional & Knowledge Partners.</span> Grounded in evidence.
          </>
        }
        description="We collaborate with leading research institutions, fiscal policy experts, and integrity advocates across Kenya."
        className="mb-8"
      />
      <LandingContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {PARTNERS.map((partner) => (
            <a
              key={partner.id}
              href={partner.website}
              target="_blank"
              rel="noopener noreferrer"
              className="group p-5 rounded-2xl border border-border/60 bg-card hover:border-primary/50 transition-all shadow-xs space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                  {partner.tag}
                </span>
                <ExternalLink className="size-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>

              <div className="flex items-center gap-3">
                {partner.logo_url ? (
                  <div className="relative size-10 rounded-lg bg-muted p-1 border border-border/50 shrink-0">
                    <Image
                      src={partner.logo_url}
                      alt={partner.name}
                      fill
                      className="object-contain p-1"
                    />
                  </div>
                ) : (
                  <div className="p-2.5 rounded-lg bg-primary/10 text-primary shrink-0">
                    <Building2 className="size-5" />
                  </div>
                )}
                <div>
                  <h4 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">
                    {partner.name}
                  </h4>
                  <p className="text-xs text-muted-foreground leading-snug">{partner.role}</p>
                </div>
              </div>
            </a>
          ))}
        </div>
      </LandingContent>
    </LandingSection>
  );
}
