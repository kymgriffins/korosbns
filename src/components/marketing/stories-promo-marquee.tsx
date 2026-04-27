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
const API_BASE_URL =
  (process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000").replace(
    /\/+$/,
    "",
  );

export default function StoriesPromoMarquee() {
  const [closed, setClosed] = useState(false);
  const [usdKes, setUsdKes] = useState<number | null>(null);
  const [fxError, setFxError] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved === "1") setClosed(true);
  }, []);

  useEffect(() => {
    let mounted = true;

    const fetchUsdKes = async () => {
      // 1. Try Backend First
      try {
        const response = await fetch(`${API_BASE_URL}/api/forex/usd-kes/`);
        if (response.ok) {
          const data = await response.json();
          const usdKesRate = Number(data?.usd_kes);
          if (Number.isFinite(usdKesRate) && usdKesRate > 0) {
            if (mounted) {
              setUsdKes(usdKesRate);
              setFxError(false);
              return; // Success, exit
            }
          }
        }
      } catch (e) {
        console.warn("Backend FX fetch failed, trying fallback...", e);
      }

      // 2. Try Public Fallback (Google Finance alternative / Open Exchange Rate)
      try {
        const response = await fetch("https://open.er-api.com/v6/latest/USD");
        if (response.ok) {
          const data = await response.json();
          const usdKesRate = Number(data?.rates?.KES);
          if (Number.isFinite(usdKesRate) && usdKesRate > 0) {
            if (mounted) {
              setUsdKes(usdKesRate);
              setFxError(false);
              return;
            }
          }
        }
      } catch (e) {
        console.error("Global FX fallback failed:", e);
      }

      // 3. If all fails
      if (mounted) setFxError(true);
    };

    fetchUsdKes();
    const intervalId = window.setInterval(fetchUsdKes, 60_000);
    return () => {
      mounted = false;
      window.clearInterval(intervalId);
    };
  }, []);

  const handleClose = () => {
    setClosed(true);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, "1");
    }
  };

  if (closed) return null;

  return (
    <div className="relative z-30 mx-auto mt-4 w-[min(1200px,96%)] rounded-2xl border border-primary/20 bg-background/70 backdrop-blur-md overflow-hidden">
      <button
        onClick={handleClose}
        aria-label="Close stories promo"
        className="absolute right-2 top-2 z-20 rounded-full border border-foreground/15 bg-background/90 p-1.5 text-foreground/70 hover:text-foreground"
      >
        <X className="size-4" />
      </button>

      <div className="flex items-center justify-between border-b border-foreground/10 px-4 py-2.5">
        <div className="flex items-center gap-2 overflow-hidden">
          <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-primary shrink-0">
            New Story Drops
          </span>
          <span className="hidden sm:inline-block text-xs text-foreground/60 truncate">
            Swipe the vibe, pick your lane
          </span>
        </div>
        
        <div className="flex items-center gap-2 mr-8">
            <div className="rounded-full border border-foreground/10 bg-foreground/[0.03] px-2 py-0.5 text-[10px] sm:text-[11px] font-medium text-foreground/70">
                {fxError ? (
                  "USD/KES unavailable"
                ) : usdKes ? (
                  <>USD/KES <span className="text-primary font-bold">{usdKes.toFixed(2)}</span></>
                ) : (
                  "USD/KES ..."
                )}
            </div>
        </div>
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
