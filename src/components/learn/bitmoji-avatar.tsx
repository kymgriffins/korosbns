"use client";

import React from "react";
import { cn } from "@/utils";

export type Gender = "female" | "male";

function FemaleSVG({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 80 80" className={className}>
      <circle cx="40" cy="30" r="18" fill="#ec4899" />
      <circle cx="40" cy="22" r="14" fill="#fdf2f8" />
      <circle cx="35" cy="20" r="1.5" fill="#1f2937" />
      <circle cx="45" cy="20" r="1.5" fill="#1f2937" />
      <path d="M35 27 Q40 32 45 27" stroke="#1f2937" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <path d="M33 14 Q40 10 47 14" stroke="#ec4899" strokeWidth="2" fill="none" strokeLinecap="round" />
      <rect x="37" y="28" width="6" height="3" rx="1.5" fill="#ec4899" />
      <path d="M40 48 L40 70" stroke="#ec4899" strokeWidth="3" strokeLinecap="round" />
      <path d="M32 54 L40 58 L48 54" stroke="#ec4899" strokeWidth="2.5" fill="none" strokeLinecap="round" />
    </svg>
  );
}

function MaleSVG({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 80 80" className={className}>
      <circle cx="40" cy="30" r="18" fill="#3b82f6" />
      <circle cx="40" cy="22" r="14" fill="#eff6ff" />
      <circle cx="35" cy="20" r="1.5" fill="#1f2937" />
      <circle cx="45" cy="20" r="1.5" fill="#1f2937" />
      <path d="M35 27 Q40 32 45 27" stroke="#1f2937" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <path d="M33 12 Q40 8 47 12" stroke="#3b82f6" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <rect x="37" y="28" width="6" height="3" rx="1.5" fill="#3b82f6" />
      <path d="M40 48 L40 70" stroke="#3b82f6" strokeWidth="3" strokeLinecap="round" />
      <path d="M32 54 L40 58 L48 54" stroke="#3b82f6" strokeWidth="2.5" fill="none" strokeLinecap="round" />
    </svg>
  );
}

function NeutralSVG({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 80 80" className={className}>
      <circle cx="40" cy="30" r="18" fill="#a78bfa" />
      <circle cx="40" cy="22" r="14" fill="#f5f3ff" />
      <circle cx="35" cy="20" r="1.5" fill="#1f2937" />
      <circle cx="45" cy="20" r="1.5" fill="#1f2937" />
      <path d="M35 27 Q40 32 45 27" stroke="#1f2937" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <rect x="37" y="28" width="6" height="3" rx="1.5" fill="#a78bfa" />
      <path d="M40 48 L40 70" stroke="#a78bfa" strokeWidth="3" strokeLinecap="round" />
      <path d="M32 54 L40 58 L48 54" stroke="#a78bfa" strokeWidth="2.5" fill="none" strokeLinecap="round" />
    </svg>
  );
}

interface BitmojiAvatarProps {
  gender?: Gender | null;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

const sizeMap = {
  sm: "size-8",
  md: "size-12",
  lg: "size-16",
  xl: "size-20",
};

export function BitmojiAvatar({ gender, size = "md", className }: BitmojiAvatarProps) {
  const cls = cn(sizeMap[size], className);
  if (gender === "female") return <FemaleSVG className={cls} />;
  if (gender === "male") return <MaleSVG className={cls} />;
  return <NeutralSVG className={cls} />;
}

export function FemaleBitmoji({ selected, className }: { selected?: boolean; className?: string }) {
  return (
    <svg viewBox="0 0 80 80" className={className}>
      <circle cx="40" cy="30" r="18" fill={selected ? "#ec4899" : "#f9a8d4"} />
      <circle cx="40" cy="22" r="14" fill={selected ? "#fdf2f8" : "#fce7f3"} />
      <circle cx="35" cy="20" r="1.5" fill="#1f2937" />
      <circle cx="45" cy="20" r="1.5" fill="#1f2937" />
      <path d="M35 27 Q40 32 45 27" stroke="#1f2937" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <path d="M33 14 Q40 10 47 14" stroke={selected ? "#ec4899" : "#f472b6"} strokeWidth="2" fill="none" strokeLinecap="round" />
      <rect x="37" y="28" width="6" height="3" rx="1.5" fill="#ec4899" />
      <path d="M40 48 L40 70" stroke={selected ? "#ec4899" : "#f9a8d4"} strokeWidth="3" strokeLinecap="round" />
      <path d="M32 54 L40 58 L48 54" stroke={selected ? "#ec4899" : "#f9a8d4"} strokeWidth="2.5" fill="none" strokeLinecap="round" />
    </svg>
  );
}

export function MaleBitmoji({ selected, className }: { selected?: boolean; className?: string }) {
  return (
    <svg viewBox="0 0 80 80" className={className}>
      <circle cx="40" cy="30" r="18" fill={selected ? "#3b82f6" : "#93c5fd"} />
      <circle cx="40" cy="22" r="14" fill={selected ? "#eff6ff" : "#dbeafe"} />
      <circle cx="35" cy="20" r="1.5" fill="#1f2937" />
      <circle cx="45" cy="20" r="1.5" fill="#1f2937" />
      <path d="M35 27 Q40 32 45 27" stroke="#1f2937" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <path d="M33 12 Q40 8 47 12" stroke={selected ? "#3b82f6" : "#60a5fa"} strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <rect x="37" y="28" width="6" height="3" rx="1.5" fill="#3b82f6" />
      <path d="M40 48 L40 70" stroke={selected ? "#3b82f6" : "#93c5fd"} strokeWidth="3" strokeLinecap="round" />
      <path d="M32 54 L40 58 L48 54" stroke={selected ? "#3b82f6" : "#93c5fd"} strokeWidth="2.5" fill="none" strokeLinecap="round" />
    </svg>
  );
}
