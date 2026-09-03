"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { ProgrammesPartners } from "@/components/programmes/programmes-partners";
import { ProgrammesFaq } from "@/components/programmes/programmes-faq";
import { ProgrammesImpactHub } from "@/components/work-hub/programmes-impact-hub";
import { LandingSection } from "@/layouts/landing-section";
import { EditorialCtaBand } from "@/components/ui/editorial";
import {
  PROGRAMMES,
  PROGRAMMES_CLOSING,
  PROGRAMMES_LANDING,
  PROGRAMME_CARD_BLURBS,
  programmeHref,
} from "@/content";
import { cn } from "@/utils";

export function ProgrammesLanding() {
  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: PROGRAMMES_LANDING.seoTitle,
    description: PROGRAMMES_LANDING.seoDescription,
    mainEntity: {
      "@type": "ItemList",
      itemListElement: PROGRAMMES.map((p, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: p.name,
        description: p.seoDescription,
        url: programmeHref(p.slug),
      })),
    },
  };

  return (
    <div className="prog-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />

      {/* 01 — Statement hero */}
      <section className="prog-section prog-hero">
        <p className="prog-index">Programmes</p>
        <h1 className="prog-title-xl">{PROGRAMMES_LANDING.headline}</h1>
        <p className="prog-lede">{PROGRAMMES_LANDING.body}</p>
        <p className="prog-sub">{PROGRAMMES_LANDING.subhead}</p>
        <nav aria-label="Programmes" className="prog-anchor-nav">
          {PROGRAMMES.map((p, i) => (
            <Link key={p.slug} href={programmeHref(p.slug)} className="prog-anchor">
              <span className="prog-anchor-num">{String(i + 1).padStart(2, "0")}</span>
              {p.name}
              <ArrowUpRight className="size-4" aria-hidden />
            </Link>
          ))}
        </nav>
      </section>

      {/* 02 — Programme index: alternating image rows */}
      <section id="programmes" className="prog-section">
        <p className="prog-index">01 / The programmes</p>
        <h2 className="prog-h2">Four programmes, one budget truth</h2>
        <div className="prog-rows">
          {PROGRAMMES.map((p, i) => (
            <Link
              key={p.slug}
              href={programmeHref(p.slug)}
              className={cn("prog-row", i % 2 === 1 && "prog-row-flip")}
            >
              <div className="prog-row-media">
                <Image
                  src={p.visual.hero}
                  alt={p.visual.heroAlt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <span className="prog-row-num">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>
              <div className="prog-row-copy">
                <p className="prog-eyebrow">{p.eyebrow}</p>
                <h3 className="prog-row-title">{p.name}</h3>
                <p className="prog-row-blurb">{PROGRAMME_CARD_BLURBS[p.slug]}</p>
                {p.stats?.[0] ? (
                  <p className="prog-row-stat">
                    <strong>{p.stats[0].value}</strong>
                    <span> — {p.stats[0].label}</span>
                  </p>
                ) : null}
                <span className="prog-row-cta">
                  Explore {p.name}
                  <ArrowUpRight className="size-4" aria-hidden />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 03 — Ecosystem numbers */}
      <ProgrammesImpactHub />

      {/* 04 — Latest evidence: editorial index, not cards */}
      <section className="prog-section">
        <p className="prog-index">02 / Fresh evidence</p>
        <h2 className="prog-h2">Latest from the field</h2>
        <div className="prog-evidence">
          {[
            {
              kind: "Report",
              title: "FY2026/27 Kenya National Budget Brief & Analysis",
              note: "Revenue targets, debt servicing, sector allocations.",
              href: "/reports",
              date: "July 2026",
            },
            {
              kind: "County scrutiny",
              title: "County Budget Scorecard: Kakamega, Kilifi, Nakuru & Wajir",
              note: "Revenue vs development execution, quarterly.",
              href: "/reports",
              date: "Q2 2026",
            },
            {
              kind: "Civic explainer",
              title: "Where Does Kenya's KES 4.8 Trillion Go?",
              note: "Equitable shares, recurrent vs development.",
              href: "/learn",
              date: "Active guide",
            },
          ].map((item, i) => (
            <Link key={item.title} href={item.href} className="prog-evidence-row">
              <span className="prog-evidence-num">{String(i + 1).padStart(2, "0")}</span>
              <span className="prog-evidence-main">
                <span className="prog-eyebrow">{item.kind} · {item.date}</span>
                <span className="prog-evidence-title">{item.title}</span>
                <span className="prog-evidence-note">{item.note}</span>
              </span>
              <ArrowUpRight className="size-5 shrink-0" aria-hidden />
            </Link>
          ))}
        </div>
      </section>

      <ProgrammesPartners />

      {/* 05 — FAQ */}
      <ProgrammesFaq />

      <LandingSection>
        <EditorialCtaBand
          eyebrow="Partner with BNS"
          title={PROGRAMMES_CLOSING.headline}
          description={PROGRAMMES_CLOSING.body}
          ctaHref={PROGRAMMES_CLOSING.cta.href}
          ctaLabel={PROGRAMMES_CLOSING.cta.label}
        />
      </LandingSection>
    </div>
  );
}
