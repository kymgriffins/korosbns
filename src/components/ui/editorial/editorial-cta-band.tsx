import Image from "next/image";
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
  className?: string;
};

/**
 * Light gray rounded CTA band — Marwa "Discover your next perfect desert escape" pattern.
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
  className,
}: EditorialCtaBandProps) {
  const hasImages = Boolean(images && images.length > 0);

  return (
    <section className={cn("editorial-surface", className)} aria-label={title}>
      {hasImages ? (
        <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="space-y-5 lg:col-span-7">
            <EditorialPill dot pulse>{eyebrow}</EditorialPill>
            <h2 className={cn(T.sectionTitle, "max-w-xl text-balance")}>{title}</h2>
            {description ? (
              <p className={cn(T.lead, "max-w-xl text-foreground/80 leading-relaxed")}>{description}</p>
            ) : null}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <PillButtonGroup href={ctaHref} label={ctaLabel} size="lg" />
              {secondaryHref && secondaryLabel ? (
                <PillButtonGroup
                  href={secondaryHref}
                  label={secondaryLabel}
                  variant="outline"
                  size="lg"
                />
              ) : null}
            </div>
          </div>

          <div className="flex gap-4 lg:col-span-5 lg:justify-end">
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
        <div className="grid items-center gap-8 lg:grid-cols-12 lg:gap-12">
          <div className="space-y-4 lg:col-span-8">
            <EditorialPill dot pulse>{eyebrow}</EditorialPill>
            <h2 className={cn(T.sectionTitle, "text-balance")}>{title}</h2>
            {description ? (
              <p className={cn(T.lead, "max-w-2xl text-foreground/80 leading-relaxed")}>{description}</p>
            ) : null}
          </div>

          <div className="flex flex-col items-start gap-4 lg:col-span-4 lg:items-end lg:justify-center">
            <div className="flex flex-wrap items-center gap-3">
              <PillButtonGroup href={ctaHref} label={ctaLabel} size="lg" />
              {secondaryHref && secondaryLabel ? (
                <PillButtonGroup
                  href={secondaryHref}
                  label={secondaryLabel}
                  variant="outline"
                  size="lg"
                />
              ) : null}
            </div>
            <div className="flex flex-col gap-1 text-xs font-mono text-muted-foreground lg:text-right">
              <span className="inline-flex items-center gap-1.5 font-bold text-foreground">
                <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
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
