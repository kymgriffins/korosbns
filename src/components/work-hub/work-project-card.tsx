import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import type { StudioProjectEvidence } from "@/data/studios-evidence";
import { cn } from "@/utils";

const DELIVERY_LABELS = {
  "bns-led": "BNS-led",
  "co-produced": "Co-produced",
  commissioned: "Commissioned",
} as const;

type WorkProjectCardProps = {
  project: StudioProjectEvidence;
  variant?: "rail" | "spotlight" | "compact";
  className?: string;
  priority?: boolean;
};

export function WorkProjectCard({
  project,
  variant = "rail",
  className,
  priority = false,
}: WorkProjectCardProps) {
  const isSpotlight = variant === "spotlight";
  const isCompact = variant === "compact";

  return (
    <Link
      href={`/bns-studio/${project.slug}`}
      className={cn(
        "group flex shrink-0 flex-col overflow-hidden rounded-3xl border border-border/40 bg-card",
        "transition-colors hover:border-primary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        isSpotlight ? "w-full" : isCompact ? "w-[min(100%,18rem)]" : "w-[min(100%,20rem)] sm:w-[22rem]",
        className,
      )}
    >
      <div
        className={cn(
          "relative w-full overflow-hidden bg-muted",
          isSpotlight ? "aspect-[16/10]" : "aspect-[4/3]",
        )}
      >
        <Image
          src={project.media.posterUrl}
          alt={project.title}
          fill
          priority={priority}
          className={cn(
            "object-cover transition-transform duration-500 group-hover:scale-[1.02]",
            project.media.posterPosition || "object-center",
          )}
          sizes={
            isSpotlight
              ? "(max-width: 768px) 100vw, 50vw"
              : "(max-width: 768px) 85vw, 22rem"
          }
        />
      </div>
      <div className={cn("flex flex-1 flex-col gap-2", isSpotlight ? "p-6" : "p-4")}>
        <div className="flex flex-wrap items-center gap-2 text-[10px] font-semibold uppercase tracking-wider">
          <span className="text-primary">{project.contentType}</span>
          <span className="text-muted-foreground">·</span>
          <span className="text-muted-foreground">
            {DELIVERY_LABELS[project.deliveryMode]}
          </span>
        </div>
        <h3
          className={cn(
            "font-heading font-bold leading-snug text-foreground group-hover:text-primary",
            isSpotlight ? "text-xl md:text-2xl" : "text-sm",
          )}
        >
          {project.title}
        </h3>
        {!isCompact ? (
          <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground">
            {project.briefChallenge}
          </p>
        ) : null}
        <span className="mt-auto inline-flex items-center gap-1 pt-1 text-xs font-semibold text-foreground">
          Open dossier
          <ArrowUpRight className="size-3.5" aria-hidden />
        </span>
      </div>
    </Link>
  );
}
