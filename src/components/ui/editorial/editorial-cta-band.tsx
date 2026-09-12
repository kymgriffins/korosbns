"use client";

import Image from "next/image";
import { EditorialPill } from "./editorial-pill";
import { PillButtonGroup, PillButton } from "./pill-button-group";
import { cn } from "@/utils";
import { LANDING_TYPOGRAPHY as T } from "@/constants/landing-typography";
import { SECTION_SHELL_INNER } from "@/layouts/section-shell";

type EditorialCtaBandProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  ctaHref?: string;
  ctaLabel?: string;
  ctaVariant?: "primary" | "outline" | "secondary";
  onCtaClick?: () => void;
  secondaryHref?: string;
  secondaryLabel?: string;
  secondaryVariant?: "primary" | "outline" | "secondary";
  buttonAlign?: "left" | "center" | "right" | "stretch";
  theme?: "default" | "muted" | "card" | "contrast";
  images?: Array<{ src: string; alt: string }>;
  /** @deprecated Glow backgrounds removed for a quieter band */
  motionBackground?: boolean;
  className?: string;
};

const THEME_CLASSES: Record<string, string> = {
  default: "bg-background",
  muted: "bg-muted/30",
  card: "bg-card border-border/80 shadow-xs",
  contrast: "bg-neutral-900 text-white dark:bg-black",
};

/**
 * Full-bleed minimal CTA band - square edges, page-width surface, pills only.
 */
export function EditorialCtaBand({
  eyebrow = "Start now",
  title,
  description,
  ctaHref,
  ctaLabel = "Get started",
  ctaVariant = "primary",
  onCtaClick,
  secondaryHref,
  secondaryLabel,
  secondaryVariant = "outline",
  buttonAlign = "right",
  theme = "muted",
  images,
  motionBackground: _motionBackground = false,
  className,
}: EditorialCtaBandProps) {
  void _motionBackground;
  const hasImages = Boolean(images && images.length > 0);
  const themeClass = THEME_CLASSES[theme] || THEME_CLASSES.muted;

  const alignClass =
    buttonAlign === "left"
      ? "lg:w-auto lg:justify-start"
      : buttonAlign === "center"
      ? "lg:w-auto lg:justify-center"
      : buttonAlign === "stretch"
      ? "w-full justify-stretch"
      : "lg:w-auto lg:justify-end";

  return (
    <section
      className={cn(
        "relative w-full border-y border-border/50",
        themeClass,
        className,
      )}
      aria-label={title}
    >
      <div
        className={cn(
          SECTION_SHELL_INNER,
          "flex flex-col gap-10 py-14 md:gap-12 md:py-20 lg:py-24",
        )}
      >
        <div className="flex w-full flex-col gap-8 lg:flex-row lg:items-end lg:justify-between lg:gap-16">
          <div className="min-w-0 flex-1 space-y-4">
            <EditorialPill>{eyebrow}</EditorialPill>
            <h2
              className={cn(
                T.sectionTitle,
                "max-w-3xl text-balance font-bold tracking-tight text-foreground",
              )}
            >
              {title}
            </h2>
            {description ? (
              <p
                className={cn(
                  T.lead,
                  "max-w-2xl text-foreground/75",
                )}
              >
                {description}
              </p>
            ) : null}
          </div>

          <div className={cn("flex w-full shrink-0 flex-col gap-3 sm:flex-row sm:items-center", alignClass)}>
            {onCtaClick ? (
              <PillButton
                onClick={onCtaClick}
                label={ctaLabel}
                variant={ctaVariant}
                size="default"
                className="w-full justify-center sm:w-auto"
              />
            ) : ctaHref ? (
              <PillButtonGroup
                href={ctaHref}
                label={ctaLabel}
                variant={ctaVariant}
                size="default"
                className="w-full justify-center sm:w-auto"
              />
            ) : null}
            {secondaryHref && secondaryLabel ? (
              <PillButtonGroup
                href={secondaryHref}
                label={secondaryLabel}
                variant={secondaryVariant}
                size="default"
                className="w-full justify-center sm:w-auto"
              />
            ) : null}
          </div>
        </div>

        {hasImages ? (
          <div className="grid w-full grid-cols-2 gap-px overflow-hidden border border-border/50 bg-border/50">
            {images!.map((img, i) => (
              <div
                key={img.src + i}
                className="relative aspect-[16/9] min-h-[9rem] w-full bg-muted md:aspect-[21/9] md:min-h-[12rem]"
              >
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  className="object-cover"
                  sizes="50vw"
                />
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
