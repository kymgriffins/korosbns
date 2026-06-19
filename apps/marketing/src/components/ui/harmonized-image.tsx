"use client";

/* eslint-disable @next/next/no-img-element */
import { useMemo, useState } from "react";
import { ImageOff } from "lucide-react";
import { cn } from "@/utils";

type HarmonizedImageProps = {
  src?: string | null;
  alt: string;
  aspectClassName?: string;
  className?: string;
  imageClassName?: string;
  fallbackLabel?: string;
};

function normalizeUrl(src?: string | null): string {
  if (!src) return "";
  const trimmed = src.trim();
  if (!trimmed) return "";
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://") || trimmed.startsWith("/")) {
    return trimmed;
  }
  return "";
}

export function HarmonizedImage({
  src,
  alt,
  aspectClassName = "aspect-video",
  className,
  imageClassName,
  fallbackLabel = "Image unavailable",
}: HarmonizedImageProps) {
  const normalizedSrc = useMemo(() => normalizeUrl(src), [src]);
  const [isLoading, setIsLoading] = useState(Boolean(normalizedSrc));
  const [isBroken, setIsBroken] = useState(false);
  const showImage = Boolean(normalizedSrc) && !isBroken;
  const showFallbackLabel = fallbackLabel.trim().length > 0;

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl border border-border/60 bg-muted/40",
        aspectClassName,
        className,
      )}
    >
      {showImage ? (
        <img
          src={normalizedSrc}
          alt={alt}
          loading="lazy"
          className={cn(
            "absolute inset-0 h-full w-full object-cover transition-transform duration-500",
            imageClassName,
          )}
          onLoad={() => setIsLoading(false)}
          onError={() => {
            setIsLoading(false);
            setIsBroken(true);
          }}
        />
      ) : null}

      {isLoading ? (
        <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-muted/80 to-muted/40" />
      ) : null}

      {!showImage && showFallbackLabel ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 px-3 text-center text-muted-foreground">
          <ImageOff className="size-5 opacity-70" />
          <span className="text-[11px] font-medium">{fallbackLabel}</span>
        </div>
      ) : null}
    </div>
  );
}
