"use client";

import React from 'react';
import { motion } from 'motion/react';
import Image from 'next/image';

interface Partner {
  name: string;
  logo: string;
  url: string;
}

const partners: Partner[] = [
  {
    name: "Sen Media",
    logo: "https://res.cloudinary.com/dn8lut2fc/image/upload/v1779284903/senmedia_ylb5wt.png",
    url: "https://senmedia-events.co.ke/"
  },
  {
    name: "The Continental Pot",
    logo: "https://res.cloudinary.com/dn8lut2fc/image/upload/v1779284902/The-Continental-Pot-Vertical-removebg-preview_b9mpzf.png",
    url: "https://continentalpot.africa/"
  },
  {
    name: "Color Twist",
    logo: "https://res.cloudinary.com/dn8lut2fc/image/upload/v1779284904/colortwist_pv33rt.png",
    url: "https://colortwistmedia.com/"
  }
];

export default function PartnersMarquee() {
  // Duplicate partners multiple times (e.g., 6 times to make 18 logos) to ensure there is enough elements to fill a wide viewport
  const duplicatedPartners = Array(6).fill(partners).flat();

  return (
    <section className="py-16 md:py-24 bg-background border-y border-border/40 overflow-hidden relative">
      <div className="max-w-[1400px] mx-auto px-8 md:px-16 mb-12">
        <span className="text-muted-foreground uppercase tracking-[0.3em] text-xs block text-center font-bold">
          Trusted By Leading Institutions
        </span>
      </div>

      <div className="relative w-full flex overflow-x-hidden">
        {/* Gradient overlays for premium fade effect */}
        <div className="absolute left-0 top-0 bottom-0 w-24 md:w-48 bg-gradient-to-r from-background via-background/70 to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 md:w-48 bg-gradient-to-l from-background via-background/70 to-transparent z-10 pointer-events-none" />

        <motion.div
          className="flex gap-16 md:gap-24 w-max flex-nowrap"
          animate={{
            x: [0, "-50%"],
          }}
          transition={{
            x: {
              repeat: Infinity,
              repeatType: "loop",
              duration: 20, // adjust speed for a smooth marquee loop
              ease: "linear",
            },
          }}
        >
          {duplicatedPartners.map((partner, index) => (
            <a
              key={`${partner.name}-${index}`}
              href={partner.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-shrink-0 group flex items-center justify-center"
              aria-label={`Visit ${partner.name} website`}
            >
              <div className="relative w-32 h-16 md:w-44 md:h-20 grayscale hover:grayscale-0 opacity-40 hover:opacity-100 transition-all duration-500 transform hover:scale-104">
                <Image
                  src={partner.logo}
                  alt={`${partner.name} logo`}
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 128px, 176px"
                />
              </div>
            </a>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
