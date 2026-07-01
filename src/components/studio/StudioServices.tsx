"use client";

import { motion } from "motion/react";
import { fadeInUp, staggerContainer } from "@/motion/variants";
import { Camera, Video, Monitor, Scissors, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const serviceIcons: Record<string, React.ReactNode> = {
  Videography: <Video className="size-8" />,
  Photography: <Camera className="size-8" />,
  "Studio Rental": <Monitor className="size-8" />,
  "Post-Production": <Scissors className="size-8" />,
};

type Props = {
  services?: { name: string; description: string; price: string; features: string[] }[];
};

const defaultServices = [
  {
    name: "Videography",
    description: "Corporate events, documentaries, music videos, and budget explainers.",
    price: "From KES 25,000",
    features: ["4K/HD recording", "Professional audio", "Multi-camera setup", "Same-day edit option"],
  },
  {
    name: "Photography",
    description: "Portraits, events, product photography, and branded content.",
    price: "From KES 15,000",
    features: ["High-resolution RAW", "Professional lighting", "Edited gallery", "Print-ready files"],
  },
  {
    name: "Studio Rental",
    description: "Fully equipped studio with professional lighting and backdrop options.",
    price: "KES 5,000/hr",
    features: ["Continuous/ flash lighting", "Backdrop system", "Changing room", "Audio equipment"],
  },
  {
    name: "Post-Production",
    description: "Editing, color grading, motion graphics, and sound design.",
    price: "From KES 10,000",
    features: ["DaVinci Resolve / Premiere Pro", "Color grading", "Motion graphics", "Sound mixing"],
  },
];

export function StudioServices({ services }: Props) {
  const items = services && services.length ? services : defaultServices;

  return (
    <section id="services" className="w-full py-20 md:py-32">
      <div className="max-w-6xl mx-auto px-6 md:px-16">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <motion.span
            variants={fadeInUp}
            className="text-xs font-bold uppercase tracking-widest text-primary"
          >
            Services
          </motion.span>
          <motion.h2
            variants={fadeInUp}
            className="text-3xl md:text-5xl font-bold font-heading tracking-tight mt-3"
          >
            What We Offer
          </motion.h2>
          <motion.p
            variants={fadeInUp}
            className="text-muted-foreground mt-4 max-w-xl mx-auto"
          >
            Professional media production services to bring your stories to life.
          </motion.p>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {items.map((service, index) => (
            <motion.div
              key={index}
              variants={fadeInUp}
              className="p-6 rounded-xl border border-border/60 bg-card flex flex-col"
            >
              <div className="mb-4 text-primary">
                {serviceIcons[service.name] || <Camera className="size-8" />}
              </div>
              <h3 className="text-lg font-semibold mb-2">{service.name}</h3>
              <p className="text-sm text-muted-foreground mb-4">
                {service.description}
              </p>
              <div className="text-xl font-bold font-heading mb-4">
                {service.price}
              </div>
              <ul className="space-y-2 mb-6 flex-1">
                {service.features.map((f, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                    <CheckCircle className="size-3.5 text-primary shrink-0 mt-0.5" />
                    {f}
                  </li>
                ))}
              </ul>
              <Button
                variant="outline"
                className="w-full rounded-full"
                onClick={() =>
                  document
                    .getElementById("booking")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
              >
                Book Now
              </Button>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
