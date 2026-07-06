"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { fadeInUp, staggerContainer } from "@/motion/variants";
import { X } from "lucide-react";
import { BNS_STUDIO_PORTFOLIO_IMAGES } from "@/constants/bns-media-images";

type PortfolioItem = {
  id: string;
  title: string;
  category: string;
  media_type: "image" | "video";
  image_url: string;
  video_url?: string;
  video_platform?: "youtube" | "vimeo" | "cloudinary" | "other";
  description?: string;
};

const categories = ["All", "Videography", "Photography", "Events", "Brand"];

const defaultItems: PortfolioItem[] = BNS_STUDIO_PORTFOLIO_IMAGES.map((item) => ({
  id: item.id,
  title: item.title,
  category: item.category,
  media_type: "image" as const,
  image_url: item.image_url,
  description: item.description,
}));

type Props = {
  items?: PortfolioItem[];
};

export function StudioPortfolio({ items }: Props) {
  const portfolio = items && items.length ? items : defaultItems;
  const [filter, setFilter] = useState("All");
  const [lightbox, setLightbox] = useState<PortfolioItem | null>(null);

  const filtered =
    filter === "All"
      ? portfolio
      : portfolio.filter((item) => item.category === filter);

  return (
    <section id="portfolio" className="w-full py-20 md:py-32 bg-muted/30">
      <div className="max-w-6xl mx-auto px-6 md:px-16">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <motion.span
            variants={fadeInUp}
            className="text-xs font-bold uppercase tracking-widest text-primary"
          >
            Portfolio
          </motion.span>
          <motion.h2
            variants={fadeInUp}
            className="text-3xl md:text-5xl font-bold font-heading tracking-tight mt-3"
          >
            Our Work
          </motion.h2>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-2 mb-10"
        >
          {categories.map((cat) => (
            <motion.button
              key={cat}
              variants={fadeInUp}
              onClick={() => setFilter(cat)}
              className={`px-4 py-2 text-xs font-bold rounded-full border transition-colors ${
                filter === cat
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-card text-muted-foreground border-border hover:border-primary/50"
              }`}
            >
              {cat}
            </motion.button>
          ))}
        </motion.div>

        <motion.div
          layout
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          <AnimatePresence mode="popLayout">
            {filtered.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="group relative aspect-video rounded-xl overflow-hidden border border-border/60 bg-card cursor-pointer"
                onClick={() => setLightbox(item)}
              >
                <Image
                  src={item.image_url}
                  alt={item.title}
                  fill
                  className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-30" />
                <div className="absolute bottom-0 left-0 right-0 p-4 z-40 opacity-0 group-hover:opacity-100 transition-opacity">
                  <h3 className="text-white font-semibold text-sm">
                    {item.title}
                  </h3>
                  <span className="text-white/70 text-xs">{item.category}</span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Lightbox */}
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
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="relative max-w-4xl w-full rounded-xl overflow-hidden bg-card"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative aspect-video bg-muted">
                <Image
                  src={lightbox.image_url}
                  alt={lightbox.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 896px) 100vw, 896px"
                />
              </div>
              <div className="p-5">
                <h3 className="font-semibold text-lg">{lightbox.title}</h3>
                <span className="text-xs text-muted-foreground">
                  {lightbox.category}
                </span>
                {lightbox.description && (
                  <p className="text-sm text-muted-foreground mt-2">
                    {lightbox.description}
                  </p>
                )}
              </div>
              <button
                onClick={() => setLightbox(null)}
                className="absolute top-3 right-3 size-8 rounded-full bg-black/50 flex items-center justify-center text-white hover:bg-black/70 transition-colors"
              >
                <X className="size-4" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
