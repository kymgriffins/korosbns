"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { fadeInUp, staggerContainer } from "@/motion/variants";
import { ChevronLeft, ChevronRight, Star, Quote } from "lucide-react";

type Testimonial = {
  id: string;
  client_name: string;
  role?: string;
  content: string;
  rating: number;
  avatar_url?: string;
};

const defaultTestimonials: Testimonial[] = [
  {
    id: "1",
    client_name: "Jane Wanjiku",
    role: "Program Manager, CIPIT",
    content:
      "BNS Studio produced an exceptional documentary on Kenya's budget process. Their attention to detail and understanding of civic issues made the final product both informative and engaging.",
    rating: 5,
    avatar_url: "/images/media/129A3905.jpg",
  },
  {
    id: "2",
    client_name: "Peter Ochieng",
    role: "Communications Lead, TISA",
    content:
      "Working with BNS Studio was a pleasure. They brought our county budget workshops to life through beautiful videography and photography. Highly recommend their services.",
    rating: 5,
    avatar_url: "/images/towwnhallmay/129A3912.jpg",
  },
  {
    id: "3",
    client_name: "Faith Mwangi",
    role: "Youth Leader, Ushahidi",
    content:
      "The team at BNS Studio understood our vision immediately. The explainer video they created has been instrumental in helping young people understand the Finance Bill.",
    rating: 5,
    avatar_url: "/images/media/129A4039.jpg",
  },
  {
    id: "4",
    client_name: "Dr. Kamau Gitau",
    role: "Lecturer, University of Nairobi",
    content:
      "BNS Studio's documentary on parliamentary budget processes is now used as teaching material in our political science department. Outstanding quality and research depth.",
    rating: 4,
    avatar_url: "/images/media/main%20media%20image.jpg",
  },
];

type Props = {
  testimonials?: Testimonial[];
};

export function StudioTestimonials({ testimonials }: Props) {
  const items = testimonials && testimonials.length ? testimonials : defaultTestimonials;
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % items.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [items.length]);

  const prev = () =>
    setCurrent((c) => (c === 0 ? items.length - 1 : c - 1));
  const next = () =>
    setCurrent((c) => (c + 1) % items.length);

  return (
    <section id="testimonials" className="w-full py-20 md:py-32">
      <div className="max-w-4xl mx-auto px-6 md:px-16 text-center">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mb-10"
        >
          <motion.span
            variants={fadeInUp}
            className="text-xs font-bold uppercase tracking-widest text-primary"
          >
            Testimonials
          </motion.span>
          <motion.h2
            variants={fadeInUp}
            className="text-3xl md:text-5xl font-bold font-heading tracking-tight mt-3"
          >
            What Clients Say
          </motion.h2>
        </motion.div>

        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="p-8 md:p-12 rounded-2xl border border-border/60 bg-card"
            >
              {items[current].avatar_url ? (
                <div className="relative size-14 mx-auto mb-6 rounded-full overflow-hidden border border-border">
                  <img
                    src={items[current].avatar_url}
                    alt={items[current].client_name}
                    className="size-full object-cover"
                  />
                </div>
              ) : (
                <Quote className="size-8 text-primary/30 mx-auto mb-6" />
              )}
              <p className="text-lg md:text-xl leading-relaxed text-foreground/90 mb-6">
                &ldquo;{items[current].content}&rdquo;
              </p>
              <div className="flex justify-center gap-1 mb-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`size-4 ${
                      i < items[current].rating
                        ? "text-amber-500 fill-amber-500"
                        : "text-muted-foreground/30"
                    }`}
                  />
                ))}
              </div>
              <div className="font-semibold">{items[current].client_name}</div>
              {items[current].role && (
                <div className="text-sm text-muted-foreground">
                  {items[current].role}
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          <div className="flex items-center justify-center gap-4 mt-6">
            <button
              onClick={prev}
              className="size-10 rounded-full border border-border/60 flex items-center justify-center hover:bg-muted transition-colors"
            >
              <ChevronLeft className="size-4" />
            </button>
            <div className="flex gap-2">
              {items.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`size-2 rounded-full transition-colors ${
                    i === current ? "bg-primary" : "bg-muted-foreground/30"
                  }`}
                />
              ))}
            </div>
            <button
              onClick={next}
              className="size-10 rounded-full border border-border/60 flex items-center justify-center hover:bg-muted transition-colors"
            >
              <ChevronRight className="size-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
