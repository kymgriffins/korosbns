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
    name: "National Treasury",
    logo: "https://res.cloudinary.com/dn8lut2fc/image/upload/v1/partners/national-treasury",
    url: "/partners/national-treasury"
  },
  {
    name: "Council of Governors",
    logo: "https://res.cloudinary.com/dn8lut2fc/image/upload/v1/partners/cog",
    url: "/partners/council-of-governors"
  },
  {
    name: "University of Nairobi",
    logo: "https://res.cloudinary.com/dn8lut2fc/image/upload/v1/partners/uon",
    url: "/partners/university-of-nairobi"
  },
  {
    name: "Institute of Economic Affairs",
    logo: "https://res.cloudinary.com/dn8lut2fc/image/upload/v1/partners/iea",
    url: "/partners/iea"
  },
  {
    name: "Transparency International",
    logo: "https://res.cloudinary.com/dn8lut2fc/image/upload/v1/partners/ti-kenya",
    url: "/partners/transparency-international"
  },
  {
    name: "Kenya School of Government",
    logo: "https://res.cloudinary.com/dn8lut2fc/image/upload/v1/partners/ksg",
    url: "/partners/kenya-school-of-government"
  },
];

const PartnersMarquee = () => {
  // Duplicate partners for seamless loop
  const duplicatedPartners = [...partners, ...partners];

  return (
    <section className="py-16 md:py-24 bg-background border-y border-border/40 overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-8 md:px-16 mb-12">
        <span className="text-muted-foreground uppercase tracking-[0.3em] text-xs block text-center">
          Trusted By Leading Institutions
        </span>
      </div>

      <div className="relative">
        {/* Gradient overlays for fade effect */}
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-background to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-background to-transparent z-10" />

        <motion.div
          className="flex gap-16 md:gap-24"
          animate={{
            x: [0, -50 * partners.length],
          }}
          transition={{
            x: {
              repeat: Infinity,
              repeatType: "loop",
              duration: 45,
              ease: "linear",
            },
          }}
        >
          {duplicatedPartners.map((partner, index) => (
            <a
              key={`${partner.name}-${index}`}
              href={partner.url}
              className="flex-shrink-0 group"
              aria-label={`Visit ${partner.name} partnership page`}
            >
              <div className="relative w-32 h-16 md:w-40 md:h-20 grayscale hover:grayscale-0 opacity-60 hover:opacity-100 transition-all duration-500">
                <Image
                  src={partner.logo}
                  alt={`${partner.name} logo`}
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 128px, 160px"
                />
              </div>
            </a>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default PartnersMarquee;
