"use client";

import { motion } from "motion/react";
import { fadeInUp, staggerContainer } from "@/motion/variants";
import { Button } from "@/ui/button";
import { Camera, ChevronDown } from "lucide-react";

export function StudioHero() {
  return (
    <section className="relative w-full min-h-[80vh] flex items-center justify-center overflow-hidden bg-gradient-to-b from-background via-primary/5 to-background">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 blur-[150px] rounded-full" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-teal-500/10 blur-[150px] rounded-full" />
      </div>

      <div className="max-w-5xl mx-auto px-6 md:px-16 text-center">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="space-y-6"
        >
          <motion.div variants={fadeInUp}>
            <div className="size-16 mx-auto mb-6 rounded-2xl bg-primary/10 flex items-center justify-center">
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
                  .getElementById("services")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            >
              Our Services
            </Button>
          </motion.div>

          <motion.div variants={fadeInUp} className="pt-8">
            <ChevronDown className="size-6 mx-auto text-muted-foreground animate-bounce" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
