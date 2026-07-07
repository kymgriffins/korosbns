"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { fadeInUp, staggerContainer } from "@/motion/variants";
import { Button } from "@/components/ui/button";
import { Camera, ChevronDown } from "lucide-react";
import { BNS_STUDIO_HERO_IMAGE } from "@/constants/bns-studio-content";
import { LANDING_TYPOGRAPHY as T } from "@/constants/landing-typography";
import { cn } from "@/utils";

export function StudioHero() {
  return (
    <section className="relative w-full min-h-[80vh] flex items-center justify-center overflow-hidden border-b border-border/40">
      <Image
        src={BNS_STUDIO_HERO_IMAGE}
        alt="BNS Studio production on set"
        fill
        className="object-cover object-top"
        priority
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-background/90 via-background/75 to-background" />

      <div className="relative z-10 max-w-5xl mx-auto px-6 md:px-16 text-center">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="space-y-6"
        >
          <motion.div variants={fadeInUp}>
            <div className="size-16 mx-auto mb-6 rounded-2xl bg-primary/10 flex items-center justify-center backdrop-blur-sm">
              <Camera className="size-8 text-primary" />
            </div>
            <span className={cn(T.eyebrow, "mb-0 text-center")}>BNS Studio</span>
          </motion.div>

          <motion.h1 variants={fadeInUp} className={cn(T.heroTitle, "mx-auto max-w-4xl")}>
            Telling Kenya&apos;s stories through{" "}
            <span className={T.highlight}>film & photo</span>
          </motion.h1>

          <motion.p variants={fadeInUp} className={cn(T.lead, "mx-auto max-w-2xl md:max-w-2xl")}>
            Professional videography, photography, and post-production powered by
            Budget Ndio Story. Every booking supports civic education in Kenya.
          </motion.p>

          <motion.div
            variants={fadeInUp}
            className="flex flex-wrap justify-center gap-4 pt-4"
          >
            <Button
              size="lg"
              className={cn(T.btnPrimary, "px-8")}
              onClick={() =>
                document.getElementById("booking")?.scrollIntoView({ behavior: "smooth" })
              }
            >
              Book a Shoot
            </Button>
            <Button
              size="lg"
              variant="outline"
              className={cn(T.btnPrimary, "px-8")}
              onClick={() =>
                document.getElementById("portfolio")?.scrollIntoView({ behavior: "smooth" })
              }
            >
              View Portfolio
            </Button>
          </motion.div>

          <motion.div variants={fadeInUp} className="pt-8">
            <ChevronDown className="size-6 mx-auto text-muted-foreground" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
