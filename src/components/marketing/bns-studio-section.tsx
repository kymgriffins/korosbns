"use client";

import { motion } from "motion/react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Camera, Video, Monitor, Scissors, ArrowRight } from "lucide-react";
import { BNS_MEDIA_IMAGES } from "@/constants/bns-media-images";
import { LANDING_TYPOGRAPHY as T } from "@/constants/landing-typography";
import {
  LandingContent,
  LandingSection,
  LandingSectionHeader,
} from "@/layouts/landing-section";
import { cn } from "@/utils";

const services = [
  { icon: Video, label: "Videography", desc: "Corporate events, documentaries, music videos" },
  { icon: Camera, label: "Photography", desc: "Portraits, events, product photography" },
  { icon: Monitor, label: "Studio Rental", desc: "Fully equipped studio with lighting & backdrops" },
  { icon: Scissors, label: "Post-Production", desc: "Editing, color grading, motion graphics" },
];

export function BNSStudioSection() {
  return (
    <LandingSection>
      <LandingSectionHeader
        eyebrow="BNS Studio"
        title="Professional Media Production for Storytellers"
        description="From budget explainers to brand documentaries, BNS Studio offers end-to-end videography, photography, and post-production services. Revenue supports our civic education mission."
      />

      <LandingContent className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            {services.map((s, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <s.icon className="size-5 text-primary" />
                </div>
                <div>
                  <div className="text-sm font-semibold">{s.label}</div>
                  <div className={T.caption}>{s.desc}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-4 pt-2">
            <Link href="/bns-studio">
              <Button size="lg" className={cn(T.btnPrimary, "gap-2")}>
                Book a Shoot <ArrowRight className="size-4" />
              </Button>
            </Link>
            <Link href="/bns-studio#portfolio">
              <Button size="lg" variant="outline" className={T.btnPrimary}>
                View Portfolio
              </Button>
            </Link>
            <Link href="/bns-studio#booking">
              <Button size="lg" variant="ghost" className={T.btnPrimary}>
                Get a Quote
              </Button>
            </Link>
          </div>
        </div>

        <motion.div
          whileHover={{ scale: 1.01 }}
          transition={{ duration: 0.3 }}
          className="relative aspect-video lg:aspect-square rounded-2xl overflow-hidden border border-border/60"
        >
          <Image
            src={BNS_MEDIA_IMAGES.main}
            alt="BNS Studio main production"
            fill
            className="object-cover object-center"
            sizes="(max-width: 1024px) 100vw, 50vw"
            priority={false}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
          <div className="absolute bottom-4 left-4 right-4">
            <p className="text-white text-sm font-semibold">BNS Studio</p>
            <p className="text-white/80 text-xs">Audio-visual production for civic storytelling</p>
          </div>
        </motion.div>
      </LandingContent>
    </LandingSection>
  );
}
