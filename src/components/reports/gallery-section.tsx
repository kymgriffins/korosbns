"use client";

import { motion } from "motion/react";
import { useState } from "react";
import { Image as ImageIcon, X, ChevronLeft, ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motionTokens } from "@/motion/motion-tokens";

const GALLERY_ITEMS = [
  { src: "/placeholder-budget-1.jpg", alt: "Budget Speech Presentation", label: "Budget Speech 2026" },
  { src: "/placeholder-budget-2.jpg", alt: "Treasury Building", label: "National Treasury HQ" },
  { src: "/placeholder-budget-3.jpg", alt: "County Allocation Meeting", label: "County Budget Workshop" },
  { src: "/placeholder-budget-4.jpg", alt: "Public Participation Forum", label: "Public Participation Drive" },
  { src: "/placeholder-budget-5.jpg", alt: "Infrastructure Project", label: "Road Project Inspection" },
  { src: "/placeholder-budget-6.jpg", alt: "Education Initiative", label: "School Infrastructure Visit" },
];

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
};

const fadeItem = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: motionTokens.enter.framer },
};

export function GallerySection() {
  const [lightbox, setLightbox] = useState<number | null>(null);

  return (
    <motion.div variants={container} initial="hidden" animate="show">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm font-semibold">
            <ImageIcon className="size-4 text-primary" />
            Budget Gallery
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {GALLERY_ITEMS.map((item, i) => (
              <motion.button
                key={i}
                variants={fadeItem}
                onClick={() => setLightbox(i)}
                className="group relative aspect-video overflow-hidden rounded-xl border border-border/40 bg-muted/40 transition-all hover:shadow-md"
              >
                <div className="flex h-full w-full items-center justify-center">
                  <ImageIcon className="size-8 text-muted-foreground/40" />
                </div>
                <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/50 to-transparent p-2 opacity-0 transition-opacity group-hover:opacity-100">
                  <span className="text-xs font-medium text-white">{item.label}</span>
                </div>
              </motion.button>
            ))}
          </div>
        </CardContent>
      </Card>

      {lightbox !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
          onClick={() => setLightbox(null)}>
          <div className="relative max-w-3xl w-full" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-center aspect-video rounded-xl bg-muted/20 border border-border/30">
              <ImageIcon className="size-16 text-muted-foreground/30" />
            </div>
            <p className="text-center text-sm text-white/80 mt-3">{GALLERY_ITEMS[lightbox]?.label}</p>
            <div className="flex items-center justify-center gap-3 mt-4">
              <Button variant="ghost" size="icon" onClick={() => setLightbox(Math.max(0, lightbox - 1))}
                disabled={lightbox === 0} className="text-white hover:bg-white/20">
                <ChevronLeft className="size-5" />
              </Button>
              <span className="text-xs text-white/60">{lightbox + 1} / {GALLERY_ITEMS.length}</span>
              <Button variant="ghost" size="icon" onClick={() => setLightbox(Math.min(GALLERY_ITEMS.length - 1, lightbox + 1))}
                disabled={lightbox === GALLERY_ITEMS.length - 1} className="text-white hover:bg-white/20">
                <ChevronRight className="size-5" />
              </Button>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setLightbox(null)}
              className="absolute -top-10 right-0 text-white/80 hover:text-white">
              <X className="size-5" />
            </Button>
          </div>
        </div>
      )}
    </motion.div>
  );
}
