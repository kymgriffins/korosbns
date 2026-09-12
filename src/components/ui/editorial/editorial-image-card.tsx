import Image from "next/image";
import Link from "next/link";
import { cn } from "@/utils";

type EditorialImageCardProps = {
  href: string;
  imageSrc: string;
  imageAlt: string;
  title: string;
  meta?: string;
  className?: string;
  aspectClassName?: string;
  priority?: boolean;
  sizes?: string;
};

/**
 * Full-bleed image card with bottom-left overlay text - Marwa blog grid pattern.
 */
export function EditorialImageCard({
  href,
  imageSrc,
  imageAlt,
  title,
  meta,
  className,
  aspectClassName = "aspect-[4/3]",
  priority = false,
  sizes = "(max-width: 768px) 100vw, 33vw",
}: EditorialImageCardProps) {
  return (
    <Link
      href={href}
      className={cn(
        "editorial-image-card group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        aspectClassName,
        className,
      )}
    >
      <Image
        src={imageSrc}
        alt={imageAlt}
        fill
        priority={priority}
        sizes={sizes}
        className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
      />
      <div className="editorial-image-card-overlay">
        {meta ? (
          <p className="mb-1 text-xs font-medium text-white/70">{meta}</p>
        ) : null}
        <h3 className="font-heading text-lg font-bold leading-snug text-white md:text-xl">
          {title}
        </h3>
      </div>
    </Link>
  );
}
