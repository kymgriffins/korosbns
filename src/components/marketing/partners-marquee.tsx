"use client";

import React from "react";
import Image from "next/image";
import { Marquee } from "@/ui/marquee";
import { SECTION_SHELL_INNER } from "@/layouts/section-shell";

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
      className="group flex shrink-0 items-center justify-center px-6 md:px-10"
      aria-label={`Visit ${partner.name} website`}
    >
      <div className="relative h-14 w-28 opacity-50 grayscale transition-all duration-500 group-hover:scale-105 group-hover:opacity-100 group-hover:grayscale-0 md:h-20 md:w-40">
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
    <section className="overflow-hidden border-y border-border/40 bg-background py-12 md:py-20">
      <div className={`${SECTION_SHELL_INNER} mb-8`}>
        <span className="block text-center text-xs font-semibold text-muted-foreground">
          Trusted By Leading Institutions
        </span>
      </div>

      <div className="relative">
        <Marquee pauseOnHover className="[--duration:28s] [--gap:2rem] md:[--gap:3rem]">
          {partners.map((partner) => (
            <PartnerLogo key={partner.name} partner={partner} />
          ))}
        </Marquee>
      </div>
    </section>
  );
}
