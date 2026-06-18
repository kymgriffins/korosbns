"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { fadeInUp, staggerContainer } from "@/motion/variants";
import { X, Play } from "lucide-react";

type PortfolioItem = {
  id: string;
  title: string;
  category: string;
  media_type: "image" | "video";
  image_url: string;
  video_url?: string;
  description?: string;
};

const categories = ["All", "Videography", "Photography", "Events", "Brand"];

const defaultItems: PortfolioItem[] = [
  {
    id: "1",
    title: "Budget Breakdown 2026",
    category: "Videography",
    media_type: "video",
    image_url: "/placeholder.svg",
    video_url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    description: "Animated explainer breaking down the FY2026/27 budget allocations.",
  },
  {
    id: "2",
    title: "County Legislative Process",
    category: "Videography",
    media_type: "video",
    image_url: "/placeholder.svg",
    video_url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    description: "Documentary on how county assemblies process budgets.",
  },
  {
    id: "3",
    title: "Youth Civic Engagement",
    category: "Photography",
    media_type: "image",
    image_url: "/placeholder.svg",
    description: "Photo series capturing youth participation in public forums.",
  },
  {
    id: "4",
    title: "Finance Bill Town Hall",
    category: "Events",
    media_type: "video",
    image_url: "/placeholder.svg",
    video_url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    description: "Coverage of public participation forums on the Finance Bill.",
  },
  {
    id: "5",
    title: "BNS Brand Documentary",
    category: "Brand",
    media_type: "video",
    image_url: "/placeholder.svg",
    video_url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    description: "Brand film showcasing the Budget Ndio Story mission and impact.",
  },
  {
    id: "6",
    title: "Parliamentary Proceedings",
    category: "Videography",
    media_type: "video",
    image_url: "/placeholder.svg",
    video_url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    description: "Coverage of National Assembly budget committee sessions.",
  },
];

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
                {item.media_type === "video" && item.video_url ? (
                  <>
                    <iframe
                      src={item.video_url}
                      className="absolute inset-0 size-full pointer-events-none"
                      title={item.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-black/20 z-10" />
                    <div className="absolute inset-0 flex items-center justify-center z-20">
                      <div className="size-14 rounded-full bg-white/20 backdrop-blur flex items-center justify-center group-hover:bg-white/30 transition-colors">
                        <Play className="size-6 text-white ml-0.5" />
                      </div>
                    </div>
                  </>
                ) : (
                  <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url(${item.image_url})` }}
                  />
                )}
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
              <div className="aspect-video bg-muted">
                {lightbox.media_type === "video" && lightbox.video_url ? (
                  <iframe
                    src={lightbox.video_url}
                    className="size-full"
                    title={lightbox.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <img
                    src={lightbox.image_url}
                    alt={lightbox.title}
                    className="size-full object-cover"
                  />
                )}
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
