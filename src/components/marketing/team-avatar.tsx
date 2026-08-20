"use client";

import { useState } from "react";
import Image from "next/image";

export function TeamAvatar({
  src,
  alt,
  initials,
  size = "lg",
}: {
  src: string;
  alt: string;
  initials: string;
  size?: "sm" | "md" | "lg";
}) {
  const [error, setError] = useState(false);

  if (size === "sm" || size === "md") {
    const dimClass = size === "md" ? "size-14" : "size-12";
    if (error || !src) {
      return (
        <div className={`mb-3 flex ${dimClass} items-center justify-center rounded-2xl border border-primary/30 bg-primary/10 text-sm font-bold text-primary`}>
          {initials}
        </div>
      );
    }
    return (
      <div className={`relative mb-3 ${dimClass} overflow-hidden rounded-2xl border border-border/80 shadow-xs shrink-0`}>
        <Image
          src={src}
          alt={alt}
          fill
          onError={() => setError(true)}
          className="object-cover object-top"
          sizes="56px"
        />
      </div>
    );
  }

  if (error || !src) {
    return (
      <div className="relative flex size-32 items-center justify-center rounded-3xl border-2 border-primary/30 bg-gradient-to-br from-primary/20 via-primary/10 to-card shadow-xl sm:size-40">
        <span className="font-heading text-4xl font-black tracking-widest text-primary sm:text-5xl">
          {initials}
        </span>
        <div className="absolute -bottom-2.5 rounded-full border border-primary/30 bg-card px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary shadow-xs">
          BNS Team
        </div>
      </div>
    );
  }

  return (
    <div className="relative inline-block">
      <div className="absolute inset-0 rounded-3xl bg-primary/20 blur-xl" />
      <div className="relative size-32 overflow-hidden rounded-3xl border-4 border-background shadow-2xl ring-2 ring-primary/20 sm:size-40">
        <Image
          src={src}
          alt={alt}
          fill
          onError={() => setError(true)}
          className="object-cover object-top"
          priority
          sizes="(max-width: 640px) 128px, 160px"
        />
      </div>
    </div>
  );
}
