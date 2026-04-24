"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { X } from "lucide-react";
import { Marquee } from "@/components/ui/marquee";
import { cn } from "@/utils";

const promoStories = [
  {
    icon: "🔥",
    title: "Let's Decode",
    vibe: "Punchy social explainers",
    href: "/learn?story=lets-decode",
  },
  {
    icon: "🏙️",
    title: "Citizen Street",
    vibe: "Real-life budget impact",
    href: "/learn?story=citizen-street",
  },
  {
    icon: "🧪",
    title: "Future Lab",
    vibe: "Neon data story mode",
    href: "/learn?story=future-lab",
  },
];

const STORAGE_KEY = "bns_story_promo_closed";

export default function StoriesPromoMarquee() {
  const [closed, setClosed] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved === "1") setClosed(true);
  }, []);

  const handleClose = () => {
    setClosed(true);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, "1");
    }
  };

  if (closed) return null;

  return (
    <div className="relative z-30 mx-auto mt-4 w-[min(1200px,96%)] rounded-2xl border border-primary/20 bg-background/70 backdrop-blur-md">
      <button
        onClick={handleClose}
        aria-label="Close stories promo"
        className="absolute right-2 top-2 z-10 rounded-full border border-foreground/15 bg-background/90 p-1.5 text-foreground/70 hover:text-foreground"
      >
        <X className="size-4" />
      </button>

      <div className="flex items-center gap-2 border-b border-foreground/10 px-4 py-2.5">
        <span className="text-xs font-semibold uppercase tracking-wider text-primary">
          New Story Drops
        </span>
        <span className="text-xs text-foreground/60">
          Swipe the vibe, pick your lane
        </span>
      </div>

      <Marquee pauseOnHover className="py-2 [--duration:30s]">
        {promoStories.map((story) => (
          <Link
            key={story.title}
            href={story.href}
            className={cn(
              "mx-2 inline-flex items-center gap-2 rounded-full border border-foreground/15",
              "bg-white/5 px-4 py-2 text-sm text-foreground/90 hover:bg-white/10 transition-colors"
            )}
          >
            <span>{story.icon}</span>
            <span className="font-medium">{story.title}</span>
            <span className="text-foreground/50">• {story.vibe}</span>
          </Link>
        ))}
      </Marquee>
    </div>
  );
}
