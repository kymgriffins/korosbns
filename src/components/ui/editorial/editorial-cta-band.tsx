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
  images,
  className,
}: EditorialCtaBandProps) {
  return (
    <section className={cn("editorial-surface", className)} aria-label={title}>
      <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-16">
        <div className="space-y-5 lg:col-span-6">
          <EditorialPill>{eyebrow}</EditorialPill>
          <h2 className={cn(T.sectionTitle, "max-w-lg")}>{title}</h2>
          {description ? (
            <p className={cn(T.lead, "max-w-md")}>{description}</p>
          ) : null}
          <PillButtonGroup href={ctaHref} label={ctaLabel} className="pt-2" />
        </div>

        {images && images.length > 0 ? (
          <div className="flex gap-4 lg:col-span-6 lg:justify-end">
            {images.map((img, i) => (
              <div
                key={img.src + i}
                className={cn(
                  "relative hidden overflow-hidden rounded-2xl sm:block",
                  i === 0 ? "aspect-[3/4] w-36 md:w-44" : "aspect-[3/4] w-36 md:w-44 lg:mt-8",
                )}
              >
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  className="object-cover"
                  sizes="180px"
                />
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
