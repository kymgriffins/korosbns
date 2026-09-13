import { StudioReelShooter } from "@/components/studio/theatre/studio-reel-shooter";
import {
  partnerPageSectionsCms,
  type PageLoadingConfig,
  type PartnerPageSectionsLike,
} from "@/lib/partner-page-cms";
import { resolvePageLoadingById, resolvePageLoadingByPath } from "@/lib/page-loading";
import { getLivePartnerPageSections } from "@/lib/cms-live-data";

/**
 * Prefer live R2 config, but bail to seed within 120ms so we never stall
 * navigation behind a cosmetic loader fetch.
 */
async function resolveLoadingConfig(opts: {
  pageId?: string;
  pathname?: string;
}): Promise<PageLoadingConfig> {
  const seed = opts.pageId
    ? resolvePageLoadingById(opts.pageId)
    : resolvePageLoadingByPath(opts.pathname || "/");

  if (!seed.enabled) {
    // Most pages: stay off without touching R2.
    // Still check live briefly in case CMS re-enabled — but only if seed was on.
    return seed;
  }

  try {
    const live = await Promise.race([
      getLivePartnerPageSections(),
      new Promise<null>((resolve) => {
        setTimeout(() => resolve(null), 120);
      }),
    ]);
    if (!live) return seed;
    return opts.pageId
      ? resolvePageLoadingById(opts.pageId, live as PartnerPageSectionsLike)
      : resolvePageLoadingByPath(opts.pathname || "/", live as PartnerPageSectionsLike);
  } catch {
    return seed;
  }
}

function LoadingChrome({ config }: { config: PageLoadingConfig }) {
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

  return (
    <div className="flex min-h-[40vh] items-center justify-center p-6">
      <p className="text-sm text-muted-foreground">Loading content...</p>
    </div>
  );
}

/** Sync seed check — use when you must not await (instant null for disabled pages). */
export function SeedRouteLoading({
  pageId,
  pathname,
}: {
  pageId?: string;
  pathname?: string;
}) {
  const config = pageId
    ? resolvePageLoadingById(pageId, partnerPageSectionsCms)
    : resolvePageLoadingByPath(pathname || "/", partnerPageSectionsCms);
  return <LoadingChrome config={config} />;
}

/** Async route loading gate used by App Router `loading.tsx` files. */
export async function CmsRouteLoading({
  pageId,
  pathname,
}: {
  pageId?: string;
  pathname?: string;
}) {
  // Fast path from seed: disabled ⇒ render nothing (no fake BNS Studios / splash).
  const seed = pageId
    ? resolvePageLoadingById(pageId)
    : resolvePageLoadingByPath(pathname || "/");
  if (!seed.enabled) return null;

  const config = await resolveLoadingConfig({ pageId, pathname });
  return <LoadingChrome config={config} />;
}
