"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { StudioReelShooter } from "@/components/studio/theatre/studio-reel-shooter";
import {
  DEFAULT_PAGE_LOADING,
  resolvePageLoadingByPath,
} from "@/lib/page-loading";
import { partnerPageSectionsCms } from "@/lib/partner-page-cms";
import type { PageLoadingConfig, PartnerPageSectionsLike } from "@/lib/partner-page-cms";

/**
 * Client gate for shared segment `loading.tsx` files.
 * Starts from seed (defaults OFF → no flash), then hydrates live CMS when available.
 */
export function RouteLoadingGate() {
  const pathname = usePathname() || "/";
  const [config, setConfig] = useState<PageLoadingConfig>(() =>
    resolvePageLoadingByPath(pathname, partnerPageSectionsCms),
  );

  useEffect(() => {
    setConfig(resolvePageLoadingByPath(pathname, partnerPageSectionsCms));
    let cancelled = false;

    void (async () => {
      try {
        const res = await fetch("/api/cms/partner-page-sections", {
          cache: "no-store",
        });
        if (!res.ok || cancelled) return;
        const json = (await res.json()) as { data?: PartnerPageSectionsLike };
        if (cancelled || !json.data) return;
        setConfig(resolvePageLoadingByPath(pathname, json.data));
      } catch {
        // Keep seed config.
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [pathname]);

  if (!config.enabled || config.variant === "none") return null;

  if (config.variant === "studio-reel") {
    return (
      <StudioReelShooter
        className="studio-reel-shooter"
        durationMs={config.minMs && config.minMs > 0 ? config.minMs : 2200}
      />
    );
  }

  if (config.variant === "spinner") {
    return (
      <div className="flex min-h-[40vh] items-center justify-center p-6">
        <div
          className="h-8 w-8 animate-spin rounded-full border-2 border-muted-foreground/30 border-t-primary"
          role="status"
          aria-label="Loading"
        />
      </div>
    );
  }

  if (config.variant === "text") {
    return (
      <div className="flex min-h-[40vh] items-center justify-center p-6">
        <p className="text-sm text-muted-foreground">Loading content...</p>
      </div>
    );
  }

  return null;
}

/** Explicit never-show helper for pages that must not flash chrome. */
export function NeverRouteLoading() {
  void DEFAULT_PAGE_LOADING;
  return null;
}
