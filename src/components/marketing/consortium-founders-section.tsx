"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import Wrapper from "@/components/global/wrapper";
import SectionBadge from "@/components/ui/section-badge";
import { CONSORTIUM_FOUNDERS, CONSORTIUM_SUMMARY } from "@/constants/consortium-founders";
import { ease } from "@/motion/variants";

export default function ConsortiumFoundersSection() {
  return (
    <section id="consortium-founders" className="relative w-full py-16 lg:py-24 bg-muted/30 border-y border-border/40">
      <Wrapper>
        <div className="max-w-3xl mx-auto text-center mb-12 lg:mb-16">
          <SectionBadge title="Consortium Founders" />
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1, ease: ease.expo }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold font-heading tracking-tight mt-6"
          >
            The founding partners behind BNS
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2, ease: ease.expo }}
            className="text-base md:text-lg text-muted-foreground mt-4 leading-relaxed"
          >
            {CONSORTIUM_SUMMARY}
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
          {CONSORTIUM_FOUNDERS.map((founder, index) => (
            <motion.article
              key={founder.id}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.55, delay: index * 0.08, ease: ease.expo }}
              className="group flex flex-col rounded-2xl lg:rounded-3xl border border-border bg-card p-6 lg:p-8 shadow-sm hover:border-primary/30 hover:shadow-md transition-all duration-300"
            >
              <Link
                href={founder.website}
                target="_blank"
                rel="noopener noreferrer"
                className="relative mb-6 h-16 w-full max-w-[180px] grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300"
              >
                <Image
                  src={founder.logoUrl}
                  alt={`${founder.name} logo`}
                  fill
                  className="object-contain object-left"
                  sizes="180px"
                />
              </Link>

              <h3 className="text-xl font-bold text-foreground">{founder.name}</h3>
              <p className="mt-2 text-sm font-medium text-primary">{founder.role}</p>
              <p className="mt-4 text-sm text-muted-foreground leading-relaxed flex-1">
                {founder.description}
              </p>

              <Link
                href={founder.website}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-foreground hover:text-primary transition-colors"
              >
                Visit website
                <ArrowUpRight className="size-4" />
              </Link>
            </motion.article>
          ))}
        </div>
      </Wrapper>
    </section>
  );
}
