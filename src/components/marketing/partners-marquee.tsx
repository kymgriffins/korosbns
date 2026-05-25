"use client";

import React from "react";
import Image from "next/image";
import { Marquee } from "@/ui/marquee";

interface Partner {
  name: string;
  logo: string;
  url: string;
}

const partners: Partner[] = [
  {
    name: "Sen Media",
    logo: "https://res.cloudinary.com/dn8lut2fc/image/upload/v1779284903/senmedia_ylb5wt.png",
    url: "https://senmedia-events.co.ke/",
  },
  {
    name: "The Continental Pot",
    logo: "https://res.cloudinary.com/dn8lut2fc/image/upload/v1779284902/The-Continental-Pot-Vertical-removebg-preview_b9mpzf.png",
    url: "https://continentalpot.africa/",
  },
  {
    name: "Color Twist",
    logo: "https://res.cloudinary.com/dn8lut2fc/image/upload/v1779284904/colortwist_pv33rt.png",
    url: "https://colortwistmedia.com/",
  },
];

function PartnerLogo({ partner }: { partner: Partner }) {
  return (
    <a
      href={partner.url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex shrink-0 items-center justify-center px-6 md:px-10 group"
      aria-label={`Visit ${partner.name} website`}
    >
      <div className="relative w-28 h-14 md:w-40 md:h-20 grayscale group-hover:grayscale-0 opacity-50 group-hover:opacity-100 transition-all duration-500 group-hover:scale-105">
        <Image
          src={partner.logo}
          alt={`${partner.name} logo`}
          fill
          className="object-contain"
          sizes="(max-width: 768px) 112px, 160px"
        />
      </div>
    </a>
  );
}

export default function PartnersMarquee() {
  return (
    <section className="py-12 md:py-20 bg-background border-y border-border/40 overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-6 md:px-16 mb-8">
        <span className="text-muted-foreground uppercase tracking-[0.3em] text-xs block text-center font-bold">
          Trusted By Leading Institutions
        </span>
      </div>

      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 md:w-32 bg-gradient-to-r from-background to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 md:w-32 bg-gradient-to-l from-background to-transparent" />

        <Marquee pauseOnHover className="[--gap:2rem] md:[--gap:3rem] [--duration:28s]">
          {partners.map((partner) => (
            <PartnerLogo key={partner.name} partner={partner} />
          ))}
        </Marquee>
      </div>
    </section>
  );
}
