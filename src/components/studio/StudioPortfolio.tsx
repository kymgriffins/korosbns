"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { X } from "lucide-react";
import { BNS_STUDIO_PORTFOLIO } from "@/constants/bns-studio-content";
import { LANDING_TYPOGRAPHY as T } from "@/constants/landing-typography";
import {
  LandingContent,
  LandingSection,
  LandingSectionHeader,
} from "@/layouts/landing-section";
import { cn } from "@/utils";

type PortfolioItem = (typeof BNS_STUDIO_PORTFOLIO)[number];

const categories = ["All", "Videography", "Photography", "Events", "Brand"] as const;

export function StudioPortfolio() {
  const [filter, setFilter] = useState<(typeof categories)[number]>("All");
  const [lightbox, setLightbox] = useState<PortfolioItem | null>(null);

  const filtered =
    filter === "All"
      ? BNS_STUDIO_PORTFOLIO
      : BNS_STUDIO_PORTFOLIO.filter((item) => item.category === filter);

  return (
    <LandingSection id="portfolio" className="bg-muted/20">
      <LandingSectionHeader
        eyebrow="Portfolio"
        title={
          <>
            Recent <span className={T.highlight}>productions</span>
          </>
        }
        description="A selection of civic forums, studio sessions, and field shoots captured by the BNS team."
      />

      <LandingContent>
        <div className="mb-8 flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setFilter(cat)}
              className={cn(
                "rounded-full border px-4 py-2 text-xs font-semibold transition-colors",
                filter === cat
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card text-muted-foreground hover:border-primary/50",
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="border-x border-b border-border">
          <motion.div layout className="grid gap-0 sm:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {filtered.map((item, index) => (
                <motion.button
                  key={item.id}
                  type="button"
                  layout
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.25 }}
                  onClick={() => setLightbox(item)}
                  className={cn(
                    "group relative aspect-4/3 overflow-hidden border-t border-border text-left",
                    index % 3 !== 0 && "sm:border-l",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  )}
                >
                  <Image
                    src={item.image_url}
                    alt={item.title}
                    fill
                    className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-80 transition-opacity group-hover:opacity-100" />
                  <div className="absolute inset-x-0 bottom-0 p-4">
                    <p className="text-sm font-semibold text-white">{item.title}</p>
                    <p className="text-xs text-white/70">{item.category}</p>
                  </div>
                </motion.button>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>

        <div className="h-18 border-x border-t border-border md:h-28" />
      </LandingContent>

      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
            onClick={() => setLightbox(null)}
          >
            <motion.div
              initial={{ scale: 0.94, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.94, opacity: 0 }}
              className="relative max-w-4xl w-full overflow-hidden rounded-2xl border border-border bg-card"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative aspect-4/3 bg-muted">
                <Image
                  src={lightbox.image_url}
                  alt={lightbox.title}
                  fill
                  className="object-cover object-center"
                  sizes="(max-width: 896px) 100vw, 896px"
                />
              </div>
              <div className="space-y-2 p-5">
                <h3 className={T.cardTitle}>{lightbox.title}</h3>
                <p className={T.role}>{lightbox.category}</p>
                {lightbox.description ? (
                  <p className={T.caption}>{lightbox.description}</p>
                ) : null}
              </div>
              <button
                type="button"
                onClick={() => setLightbox(null)}
                className="absolute top-3 right-3 flex size-8 items-center justify-center rounded-full bg-black/50 text-white transition-colors hover:bg-black/70"
                aria-label="Close preview"
              >
                <X className="size-4" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </LandingSection>
  );
}
