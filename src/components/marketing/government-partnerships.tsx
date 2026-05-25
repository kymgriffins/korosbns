"use client";

import React from "react";
import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/ui/button";
import { ArrowRight } from "lucide-react";
import { slideInLeft, slideInRight } from "@/motion/variants";
import { CLOUDINARY_PARTNERSHIPS } from "@/constants/cloudinary";

const GovernmentPartnerships = () => {
  return (
    <section className="py-16 md:py-28 bg-background overflow-hidden border-t border-border/40">
      <div className="max-w-[1200px] mx-auto px-6 md:px-16 space-y-16 md:space-y-20">
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
          <motion.div
            variants={slideInLeft}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <span className="text-primary font-bold uppercase tracking-widest text-xs mb-4 block">
              National Partnership
            </span>
            <h2 className="text-2xl md:text-4xl font-black mb-4 text-foreground">
              Decoding the{" "}
              <span className="text-primary italic font-heading">Budget Policy Statement</span>
            </h2>
            <p className="text-muted-foreground text-base leading-relaxed mb-4">
              Working directly with the National Treasury and Parliament&apos;s Budget &
              Appropriations Committee, we translate the annual Budget Policy Statement into
              accessible narratives for citizens.
            </p>
            <p className="text-muted-foreground text-base leading-relaxed mb-6">
              Our workshops and explainer series break down fiscal frameworks, revenue
              projections, and spending priorities — empowering Kenyans to understand where
              their taxes go.
            </p>
            <Link href="/partnerships/national">
              <Button size="lg" className="rounded-full px-6 py-5 text-sm font-bold gap-2">
                View Partnership Details
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </motion.div>

          <motion.div
            variants={slideInRight}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-2 gap-3 max-w-md md:max-w-none md:ml-auto"
          >
            <div className="relative aspect-[4/5] rounded-xl overflow-hidden border border-border">
              <Image
                src={CLOUDINARY_PARTNERSHIPS.nationalTreasuryWorkshop}
                alt="National Treasury workshop"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 40vw, 200px"
              />
            </div>
            <div className="relative aspect-[4/5] rounded-xl overflow-hidden border border-border mt-6">
              <Image
                src={CLOUDINARY_PARTNERSHIPS.bpsSession}
                alt="Budget Policy Statement session"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 40vw, 200px"
              />
            </div>
            <div className="relative aspect-[4/5] rounded-xl overflow-hidden border border-border -mt-6">
              <Image
                src={CLOUDINARY_PARTNERSHIPS.parliamentEngagement}
                alt="Parliament engagement"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 40vw, 200px"
              />
            </div>
            <div className="relative aspect-[4/5] rounded-xl overflow-hidden border border-border">
              <Image
                src={CLOUDINARY_PARTNERSHIPS.fiscalFramework}
                alt="Fiscal framework discussion"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 40vw, 200px"
              />
            </div>
          </motion.div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
          <motion.div
            variants={slideInLeft}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="relative aspect-video rounded-2xl overflow-hidden border border-border order-2 md:order-1 max-h-[280px] md:max-h-none"
          >
            <Image
              src={CLOUDINARY_PARTNERSHIPS.countyAssemblyHearing}
              alt="County assembly public hearing"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4">
              <p className="text-foreground text-xs uppercase tracking-widest font-semibold">
                County Assembly • Public Participation Forum
              </p>
            </div>
          </motion.div>

          <motion.div
            variants={slideInRight}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="order-1 md:order-2"
          >
            <span className="text-primary font-bold uppercase tracking-widest text-xs mb-4 block">
              County Partnership
            </span>
            <h2 className="text-2xl md:text-4xl font-black mb-4 text-foreground">
              Amplifying{" "}
              <span className="text-primary italic font-heading">Citizen Voices</span> in
              County Budgets
            </h2>
            <p className="text-muted-foreground text-base leading-relaxed mb-4">
              We partner with county governments to facilitate meaningful public participation
              in the County Fiscal Strategy Paper (CFSP) and annual budget-making process.
            </p>
            <p className="text-muted-foreground text-base leading-relaxed mb-6">
              Through barazas, campus forums, and digital platforms, we ensure citizens can
              submit memoranda, track budget allocations, and hold county assemblies accountable.
            </p>
            <Link href="/partnerships/county">
              <Button
                size="lg"
                variant="outline"
                className="rounded-full px-6 py-5 text-sm font-bold gap-2"
              >
                Explore County Work
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default GovernmentPartnerships;
