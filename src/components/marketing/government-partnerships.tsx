"use client";

import React from 'react';
import { motion } from 'motion/react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/ui/button';
import { ArrowRight } from 'lucide-react';

const GovernmentPartnerships = () => {
  return (
    <section className="py-24 md:py-48 bg-muted/30 overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-8 md:px-16 space-y-32">
        
        {/* National Government Partnership */}
        <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
          {/* Text Content - Left */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-primary font-bold uppercase tracking-widest text-sm mb-6 block">
              National Partnership
            </span>
            <h2 className="text-4xl md:text-5xl font-black mb-6">
              Decoding the <span className="text-primary italic font-serif">Budget Policy Statement</span>
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-6">
              Working directly with the National Treasury and Parliament's Budget & Appropriations Committee, 
              we translate the annual Budget Policy Statement into accessible narratives for citizens.
            </p>
            <p className="text-muted-foreground text-lg leading-relaxed mb-8">
              Our workshops and explainer series break down fiscal frameworks, revenue projections, and 
              spending priorities — empowering Kenyans to understand where their taxes go.
            </p>
            <Link href="/partnerships/national">
              <Button size="lg" className="rounded-full px-8 py-6 text-base font-bold gap-2">
                View Partnership Details
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          </motion.div>

          {/* Image Grid - Right */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="grid grid-cols-2 gap-4"
          >
            <div className="relative aspect-[4/5] rounded-2xl overflow-hidden">
              <Image
                src="https://res.cloudinary.com/dn8lut2fc/image/upload/f_auto,q_auto/v1/partnerships/national-treasury-workshop"
                alt="National Treasury workshop"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 50vw, 25vw"
              />
            </div>
            <div className="relative aspect-[4/5] rounded-2xl overflow-hidden mt-8">
              <Image
                src="https://res.cloudinary.com/dn8lut2fc/image/upload/f_auto,q_auto/v1/partnerships/bps-session"
                alt="Budget Policy Statement session"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 50vw, 25vw"
              />
            </div>
            <div className="relative aspect-[4/5] rounded-2xl overflow-hidden -mt-8">
              <Image
                src="https://res.cloudinary.com/dn8lut2fc/image/upload/f_auto,q_auto/v1/partnerships/parliament-engagement"
                alt="Parliament engagement"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 50vw, 25vw"
              />
            </div>
            <div className="relative aspect-[4/5] rounded-2xl overflow-hidden">
              <Image
                src="https://res.cloudinary.com/dn8lut2fc/image/upload/f_auto,q_auto/v1/partnerships/fiscal-framework"
                alt="Fiscal framework discussion"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 50vw, 25vw"
              />
            </div>
          </motion.div>
        </div>

        {/* County Government Partnership */}
        <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
          {/* Image - Left (reversed order on desktop) */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative aspect-video rounded-3xl overflow-hidden order-2 md:order-1"
          >
            <Image
              src="https://res.cloudinary.com/dn8lut2fc/image/upload/f_auto,q_auto/v1/partnerships/county-assembly-hearing"
              alt="County assembly public hearing"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-8 left-8 right-8">
              <p className="text-white text-sm uppercase tracking-widest font-semibold">
                County Assembly • Public Participation Forum
              </p>
            </div>
          </motion.div>

          {/* Text Content - Right */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="order-1 md:order-2"
          >
            <span className="text-primary font-bold uppercase tracking-widest text-sm mb-6 block">
              County Partnership
            </span>
            <h2 className="text-4xl md:text-5xl font-black mb-6">
              Amplifying <span className="text-primary italic font-serif">Citizen Voices</span> in County Budgets
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-6">
              We partner with 47 county governments to facilitate meaningful public participation in the 
              County Fiscal Strategy Paper (CFSP) and annual budget-making process.
            </p>
            <p className="text-muted-foreground text-lg leading-relaxed mb-8">
              Through barazas, campus forums, and digital platforms, we ensure citizens can submit 
              memoranda, track budget allocations, and hold county assemblies accountable for spending decisions.
            </p>
            <Link href="/partnerships/county">
              <Button size="lg" variant="outline" className="rounded-full px-8 py-6 text-base font-bold gap-2">
                Explore County Work
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          </motion.div>
        </div>

      </div>
    </section>
  );
};

export default GovernmentPartnerships;
