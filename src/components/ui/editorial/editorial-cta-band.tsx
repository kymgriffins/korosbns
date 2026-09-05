"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { EditorialPill } from "./editorial-pill";
import { PillButtonGroup } from "./pill-button-group";
import { cn } from "@/utils";
import { LANDING_TYPOGRAPHY as T } from "@/constants/landing-typography";

type EditorialCtaBandProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  ctaHref: string;
  ctaLabel: string;
  secondaryHref?: string;
  secondaryLabel?: string;
  images?: Array<{ src: string; alt: string }>;
  motionBackground?: boolean;
  className?: string;
};

/**
 * Premium editorial CTA band with optional subtle motion background.
 */
export function EditorialCtaBand({
  eyebrow = "Start now",
  title,
  description,
  ctaHref,
  ctaLabel,
  secondaryHref,
  secondaryLabel,
  images,
  motionBackground = true,
  className,
}: EditorialCtaBandProps) {
  const hasImages = Boolean(images && images.length > 0);

  return (
    <section className={cn("editorial-surface relative overflow-hidden", className)} aria-label={title}>
      {/* Subtle Premium Motion Background Glow */}
      {motionBackground && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden>
          <motion.div
            animate={{
              scale: [1, 1.15, 1],
              opacity: [0.15, 0.28, 0.15],
              x: ["-5%", "5%", "-5%"],
              y: ["-5%", "5%", "-5%"],
            }}
            transition={{
              duration: 14,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute -top-1/3 -right-1/4 size-[500px] rounded-full bg-linear-to-br from-primary/30 via-sky-400/20 to-transparent blur-[90px]"
          />
          <motion.div
            animate={{
              scale: [1.1, 1, 1.1],
              opacity: [0.1, 0.22, 0.1],
              x: ["5%", "-5%", "5%"],
              y: ["5%", "-5%", "5%"],
            }}
            transition={{
              duration: 18,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute -bottom-1/3 -left-1/4 size-[500px] rounded-full bg-linear-to-tr from-amber-500/20 via-primary/20 to-transparent blur-[100px]"
          />
        </div>
      )}

      {hasImages ? (
        <div className="relative z-10 grid items-center gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="space-y-5 lg:col-span-7">
            <EditorialPill dot pulse>{eyebrow}</EditorialPill>
            <h2 className={cn(T.sectionTitle, "max-w-xl text-balance font-black tracking-tight leading-tight")}>{title}</h2>
            {description ? (
              <p className={cn(T.lead, "max-w-xl text-foreground/80 leading-relaxed")}>{description}</p>
            ) : null}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2 w-full sm:w-auto">
              <PillButtonGroup
                href={ctaHref}
                label={ctaLabel}
                size="default"
                className="w-full sm:w-auto justify-center"
              />
              {secondaryHref && secondaryLabel ? (
                <PillButtonGroup
                  href={secondaryHref}
                  label={secondaryLabel}
                  variant="outline"
                  size="default"
                  className="hidden sm:inline-flex w-full sm:w-auto justify-center"
                />
              ) : null}
            </div>
          </div>

          <div className="relative z-10 flex gap-4 lg:col-span-5 lg:justify-end">
            {images!.map((img, i) => (
              <div
                key={img.src + i}
                className={cn(
                  "relative hidden overflow-hidden rounded-2xl border border-border/60 shadow-md sm:block",
                  i === 0 ? "aspect-[3/4] w-36 md:w-48" : "aspect-[3/4] w-36 md:w-48 lg:mt-8",
                )}
              >
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  className="object-cover"
                  sizes="200px"
                />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="relative z-10 grid items-center gap-8 lg:grid-cols-12 lg:gap-12">
          <div className="space-y-4 lg:col-span-8">
            <EditorialPill dot pulse>{eyebrow}</EditorialPill>
            <h2 className={cn(T.sectionTitle, "text-balance font-black tracking-tight leading-tight")}>{title}</h2>
            {description ? (
              <p className={cn(T.lead, "max-w-2xl text-foreground/80 leading-relaxed")}>{description}</p>
            ) : null}
          </div>

          <div className="relative z-10 flex flex-col items-start gap-4 lg:col-span-4 lg:items-end lg:justify-center">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
              <PillButtonGroup
                href={ctaHref}
                label={ctaLabel}
                size="default"
                className="w-full sm:w-auto justify-center"
              />
              {secondaryHref && secondaryLabel ? (
                <PillButtonGroup
                  href={secondaryHref}
                  label={secondaryLabel}
                  variant="outline"
                  size="default"
                  className="hidden sm:inline-flex w-full sm:w-auto justify-center"
                />
              ) : null}
            </div>
            <div className="flex flex-col gap-1 text-xs font-mono text-muted-foreground lg:text-right">
              <span className="inline-flex items-center gap-1.5 font-bold text-foreground">
                <span className="size-1.5 rounded-full bg-primary animate-pulse" />
                Sovereign Public Standard
              </span>
              <span>47 Counties · Non-Partisan Oversight</span>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
