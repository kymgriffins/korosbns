"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { partnerData, type Partner } from "@/data/partners";
import { useOrg } from "@/contexts/org-context";
import {
  LandingContent,
  LandingSection,
  LandingSectionEyebrow,
} from "@/layouts/landing-section";
import { BNS_PARTNERS_NAMED } from "@/constants/programmes-content";
import { cn } from "@/utils";

type NamedPartner = (typeof BNS_PARTNERS_NAMED)[number] & {
  logo_url?: string;
};

const PARTNER_DEFAULTS: Record<
  string,
  Pick<Partner, "name" | "website" | "logo_url">
> = {
  "house-of-fiscal-wisdom": {
    name: "House of Fiscal Wisdom",
    website: "https://house-of-fiscal-wisdom.org/",
    logo_url: "",
  },
  "committee-on-fiscal-studies": {
    name: "Committee on Fiscal Studies",
    website: "https://cfs.uonbi.ac.ke/",
    logo_url:
      "https://cfs.uonbi.ac.ke/sites/default/files/inline-images/UoN_Logo_4.png",
  },
  tisa: {
    name: "TISA Kenya",
    website: "https://newtisa.tisa.co.ke/",
    logo_url:
      "https://newtisa.tisa.co.ke/wp-content/uploads/2025/03/New-TISA-logo.svg",
  },
};

function mapOrgPartners(
  apiPartners: NonNullable<ReturnType<typeof useOrg>["config"]["partners"]>,
): Partner[] {
  return apiPartners.map((p, index) => ({
    id: p.slug ?? `partner-${index}`,
    name: p.name,
    website: p.website_url,
    role: p.role ?? p.description,
    logo_url: p.logo_url,
    tier: p.tier,
    is_active: true,
    is_consortium: p.is_consortium ?? false,
  }));
}

function PartnerLogo({
  partner,
  onNavigateGuard,
}: {
  partner: Partner;
  onNavigateGuard: () => boolean;
}) {
  const href = partner.website || undefined;
  const isTextLogo = !partner.logo_url;

  const inner = (
    <div
      className={cn(
        "relative flex h-16 w-44 items-center justify-center transition-transform duration-300 md:h-20 md:w-52",
        "group-hover:scale-[1.03]",
      )}
    >
      {partner.logo_url ? (
        <Image
          src={partner.logo_url}
          alt={`${partner.name} logo`}
          fill
          className="object-contain opacity-90 transition-opacity group-hover:opacity-100"
          sizes="(max-width: 768px) 176px, 208px"
          draggable={false}
        />
      ) : (
        <span className="px-2 text-center font-heading text-sm font-semibold leading-snug tracking-tight text-foreground md:text-base">
          {partner.name}
        </span>
      )}
    </div>
  );

  if (!href) {
    return (
      <div
        className="group flex shrink-0 items-center justify-center px-6 md:px-10"
        aria-label={partner.name}
      >
        {inner}
      </div>
    );
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "group flex shrink-0 cursor-pointer items-center justify-center px-6 md:px-10",
        "outline-none focus-visible:ring-2 focus-visible:ring-ring",
        isTextLogo && "px-5 py-3",
      )}
      aria-label={`Visit ${partner.name}`}
      onClick={(event) => {
        if (!onNavigateGuard()) {
          event.preventDefault();
        }
      }}
      draggable={false}
    >
      {inner}
    </a>
  );
}

function DraggableMarquee({ partners }: { partners: Partner[] }) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const offsetRef = useRef(0);
  const dragStartXRef = useRef(0);
  const dragStartOffsetRef = useRef(0);
  const hasDraggedRef = useRef(false);
  const halfWidthRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [paused, setPaused] = useState(false);

  const loop = partners.length > 0 ? [...partners, ...partners, ...partners] : [];

  const measure = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    // One full set ≈ total / 3
    halfWidthRef.current = track.scrollWidth / 3;
  }, []);

  const applyTransform = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const width = halfWidthRef.current || track.scrollWidth / 3;
    if (width <= 0) return;
    let next = offsetRef.current;
    while (next <= -width) next += width;
    while (next > 0) next -= width;
    offsetRef.current = next;
    track.style.transform = `translate3d(${next}px, 0, 0)`;
  }, []);

  useEffect(() => {
    measure();
    const onResize = () => {
      measure();
      applyTransform();
    };
    window.addEventListener("resize", onResize);
    const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(onResize) : null;
    if (trackRef.current && ro) ro.observe(trackRef.current);
    return () => {
      window.removeEventListener("resize", onResize);
      ro?.disconnect();
    };
  }, [measure, applyTransform, partners]);

  useEffect(() => {
    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    const speed = 0.35; // px per frame ~21px/s at 60fps
    const tick = () => {
      if (!paused && !isDragging) {
        offsetRef.current -= speed;
        applyTransform();
      }
      rafRef.current = window.requestAnimationFrame(tick);
    };
    rafRef.current = window.requestAnimationFrame(tick);
    return () => {
      if (rafRef.current != null) window.cancelAnimationFrame(rafRef.current);
    };
  }, [paused, isDragging, applyTransform]);

  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    setIsDragging(true);
    setPaused(true);
    hasDraggedRef.current = false;
    dragStartXRef.current = event.clientX;
    dragStartOffsetRef.current = offsetRef.current;
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    const delta = event.clientX - dragStartXRef.current;
    if (Math.abs(delta) > 6) hasDraggedRef.current = true;
    offsetRef.current = dragStartOffsetRef.current + delta;
    applyTransform();
  };

  const endDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    setIsDragging(false);
    setPaused(false);
  };

  const allowNavigate = () => !hasDraggedRef.current;

  if (loop.length === 0) return null;

  return (
    <div
      ref={viewportRef}
      className={cn(
        "relative w-full overflow-hidden select-none",
        isDragging ? "cursor-grabbing" : "cursor-grab",
      )}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      onPointerLeave={() => {
        /* keep drag if capture held */
      }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => {
        if (!isDragging) setPaused(false);
      }}
      role="region"
      aria-label="Partner logos marquee. Drag to scroll."
    >
      <div
        ref={trackRef}
        className="flex w-max items-center will-change-transform"
        style={{ transform: "translate3d(0,0,0)" }}
      >
        {loop.map((partner, index) => (
          <PartnerLogo
            key={`${partner.id}-${index}`}
            partner={partner}
            onNavigateGuard={allowNavigate}
          />
        ))}
      </div>
    </div>
  );
}

export default function PartnersMarquee({
  eyebrow = "BNS Partners",
}: {
  eyebrow?: string;
} = {}) {
  const { config } = useOrg();
  const [partners, setPartners] = useState<Partner[]>([]);

  useEffect(() => {
    const fromApi = config.partners?.length ? mapOrgPartners(config.partners) : [];
    const all = fromApi.length ? fromApi : partnerData.get();

    const resolved: Partner[] = (BNS_PARTNERS_NAMED as NamedPartner[]).map((named) => {
      const defaults = PARTNER_DEFAULTS[named.id];
      const match = all.find(
        (p) =>
          p.id === named.id ||
          p.name.toLowerCase().includes(named.name.toLowerCase().split(" ")[0]!.toLowerCase()),
      );

      return {
        id: named.id,
        name: defaults?.name ?? named.name,
        website: match?.website || named.website || defaults?.website || "",
        logo_url: named.logo_url || match?.logo_url || defaults?.logo_url || "",
        role: named.role,
        tier: "partner",
        is_active: true,
        is_consortium: false,
      };
    });

    setPartners(resolved.filter((p) => p.is_active !== false));
  }, [config.partners]);

  if (partners.length === 0) return null;

  return (
    <LandingSection>
      <LandingSectionEyebrow muted>{eyebrow}</LandingSectionEyebrow>
      <LandingContent className="overflow-hidden">
        <DraggableMarquee partners={partners} />
      </LandingContent>
    </LandingSection>
  );
}
