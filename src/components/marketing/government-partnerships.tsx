"use client";

import React from "react";
import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Building2 } from "lucide-react";
import { slideInLeft, slideInRight, staggerContainer } from "@/motion/variants";
import { CLOUDINARY_PARTNERSHIPS } from "@/constants/cloudinary";
import { SectionShell } from "@/layouts/section-shell";

const GovernmentPartnerships = () => {
  return (
    <SectionShell className="overflow-hidden border-t border-border/40 bg-background">
      <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} className="grid items-center gap-12 lg:grid-cols-2">
        <motion.div variants={slideInLeft} className="grid grid-cols-2 gap-3">
          <div className="relative aspect-[4/5] overflow-hidden rounded-xl border border-border">
            <Image src={CLOUDINARY_PARTNERSHIPS.nationalTreasuryWorkshop} alt="National Treasury workshop" fill className="object-cover transition-transform duration-500 hover:scale-105" sizes="(max-width: 768px) 40vw, 200px" />
          </div>
          <div className="relative mt-6 aspect-[4/5] overflow-hidden rounded-xl border border-border">
            <Image src={CLOUDINARY_PARTNERSHIPS.bpsSession} alt="Budget Policy Statement session" fill className="object-cover transition-transform duration-500 hover:scale-105" sizes="(max-width: 768px) 40vw, 200px" />
          </div>
          <div className="relative -mt-6 aspect-[4/5] overflow-hidden rounded-xl border border-border">
            <Image src={CLOUDINARY_PARTNERSHIPS.parliamentEngagement} alt="Parliament engagement" fill className="object-cover transition-transform duration-500 hover:scale-105" sizes="(max-width: 768px) 40vw, 200px" />
          </div>
          <div className="relative aspect-[4/5] overflow-hidden rounded-xl border border-border">
            <Image src={CLOUDINARY_PARTNERSHIPS.fiscalFramework} alt="Fiscal framework discussion" fill className="object-cover transition-transform duration-500 hover:scale-105" sizes="(max-width: 768px) 40vw, 200px" />
          </div>
        </motion.div>
        <motion.div variants={slideInRight} className="flex flex-col gap-6">
          <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/10">
            <Building2 className="size-7 text-primary" />
          </div>
          <h2 className="gusto-heading text-3xl leading-tight md:text-4xl">Working with <span className="font-heading italic text-primary">government</span> for transparency</h2>
          <p className="text-base leading-relaxed text-foreground/60">We partner with county and national government agencies to make budget data more accessible to citizens.</p>
          <ul className="space-y-3">
            {["County budget transparency initiatives", "Public participation workshop facilitation", "Open data portal development support", "Civic education curriculum development"].map((item) => (
              <li key={item} className="flex items-start gap-3"><span className="mt-1.5 size-2 shrink-0 rounded-full bg-primary" /><span className="text-sm text-foreground/70">{item}</span></li>
            ))}
          </ul>
          <div className="pt-2">
            <Button variant="outline" size="lg" className="gap-2 rounded-full px-8 py-6 text-base font-bold" asChild>
              <Link href="/contact">Partner With Us <ArrowRight className="size-5" /></Link>
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </SectionShell>
  );
};

export default GovernmentPartnerships;
