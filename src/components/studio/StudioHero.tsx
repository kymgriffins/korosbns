"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { fadeInUp, staggerContainer } from "@/motion/variants";
import { Button } from "@/components/ui/button";
import { Camera, ChevronDown } from "lucide-react";
import { BNS_MEDIA_IMAGES } from "@/constants/bns-media-images";

export function StudioHero() {
  return (
    <section className="relative w-full min-h-[80vh] flex items-center justify-center overflow-hidden">
      <Image
        src={BNS_MEDIA_IMAGES.main}
        alt="BNS Studio production"
        fill
        className="object-cover object-center"
        priority
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-background/85 via-background/70 to-background" />
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 blur-[150px] rounded-full" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-teal-500/10 blur-[150px] rounded-full" />
      </div>

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
            <span className="text-xs font-bold uppercase tracking-widest text-primary">
              BNS Studio
            </span>
          </motion.div>

          <motion.h1
            variants={fadeInUp}
            className="text-4xl md:text-6xl lg:text-7xl font-bold font-heading tracking-tight"
          >
            Telling Kenya&apos;s Stories
            <br />
            <span className="text-primary">Through Film & Photo</span>
          </motion.h1>

          <motion.p
            variants={fadeInUp}
            className="text-lg text-muted-foreground max-w-2xl mx-auto"
          >
            Professional videography, photography, and post-production services
            powered by Budget Ndio Story. Every booking supports civic education
            in Kenya.
          </motion.p>

          <motion.div
            variants={fadeInUp}
            className="flex flex-wrap justify-center gap-4 pt-4"
          >
            <Button
              size="lg"
              className="gap-2 rounded-full px-8"
              onClick={() =>
                document
                  .getElementById("booking")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            >
              Book a Shoot
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="rounded-full px-8"
              onClick={() =>
                document
                  .getElementById("portfolio")
                  ?.scrollIntoView({ behavior: "smooth" })
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
