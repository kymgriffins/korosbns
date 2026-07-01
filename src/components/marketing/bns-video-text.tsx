"use client";

import React from "react";
import { motion } from "motion/react";
import { VideoText } from "@/components/ui/video-text";
import { Landmark } from "lucide-react";

const BNS_VIDEO_URL = "https://cdn.pixabay.com/video/2024/04/20/207655_tiny.mp4";

export function BnsVideoText() {
  return (
    <section className="relative overflow-hidden border-t border-border/40 bg-background py-16 md:py-20">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="mx-auto flex h-[200px] max-w-4xl items-center justify-center px-4 md:h-[300px]"
      >
        <VideoText
          src={BNS_VIDEO_URL}
          fontSize={16}
          fontWeight="black"
          fontFamily="sans-serif"
          className="size-full"
        >
          BNS
        </VideoText>
      </motion.div>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2 }}
        className="mx-auto mt-4 max-w-2xl text-center text-xs text-muted-foreground"
      >
        <Landmark className="mr-1 inline size-3" />
        Budget Ndio Story — Making Kenya&apos;s Budget Yours.
      </motion.p>
    </section>
  );
}
