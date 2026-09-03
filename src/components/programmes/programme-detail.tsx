"use client";

import { useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { EditorialCtaBand } from "@/components/ui/editorial";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { LandingSection } from "@/layouts/landing-section";
import { ProgrammeOtherProgrammes } from "@/components/programmes/programme-other-programmes";
import {
  PROGRAMMES_CLOSING,
  PROGRAMME_CARD_BLURBS,
  type ProgrammeBlock,
} from "@/content";
import { getAllReports } from "@/data/reports-bulletin";
import { studiosEvidenceData } from "@/data/studios-evidence";

function splitBody(body: string): string[] {
  const chunks = body
    .split(/(?<=\.)\s+/)
    .map((s) => s.trim())
    .filter(Boolean);
  if (chunks.length <= 1) return [body];
  const paragraphs: string[] = [];
  for (let i = 0; i < chunks.length; i += 2) {
    paragraphs.push(chunks.slice(i, i + 2).join(" "));
  }
  return paragraphs;
}

function formatChips(formats?: string): string[] {
  if (!formats) return [];
  return formats
    .split(/[·•|,]/)
    .map((s) => s.trim())
    .filter(Boolean);
}

export function ProgrammeDetail({ programme }: { programme: ProgrammeBlock }) {
  const paragraphs = splitBody(programme.body);
  const chips = formatChips(programme.formats);
  const [lede, ...rest] = paragraphs;

  const evidence = useMemo(() => {
    const lane = studiosEvidenceData
      .getProgrammeLanes()
      .find((l) => l.programmeSlug === programme.slug);
    let reportCount = 0;
    try {
      reportCount = getAllReports().length;
    } catch {
      reportCount = 0;
    }
    return {
      studioWorks: lane?.projects.length ?? 0,
      reportCount,
    };
  }, [programme.slug]);

  const faqSchema =
    programme.faqs && programme.faqs.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: programme.faqs.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }
      : null;

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: programme.headline,
    description: programme.seoDescription,
    image: [programme.visual.hero],
    author: { "@type": "Organization", name: "Budget Ndio Story" },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "/" },
      { "@type": "ListItem", position: 2, name: "Programmes", item: "/programmes" },
      {
        "@type": "ListItem",
        position: 3,
        name: programme.name,
        item: `/programmes/${programme.slug}`,
      },
    ],
  };

  return (
    <div className="prog-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {faqSchema ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      ) : null}

      {/* Hero */}
      <section className="prog-section prog-hero">
        <nav aria-label="Breadcrumb" className="prog-crumb">
          <Link href="/programmes" className="prog-back">
            <ArrowLeft className="size-4" aria-hidden />
            All programmes
          </Link>
        </nav>
        <p className="prog-index">{programme.eyebrow}</p>
        <h1 className="prog-title-xl">{programme.headline}</h1>
        {lede ? <p className="prog-lede">{lede}</p> : null}
        {programme.audience ? (
          <p className="prog-audience">For: {programme.audience}</p>
        ) : null}
      </section>

      {/* Stats band */}
      {programme.stats && programme.stats.length > 0 ? (
        <section className="prog-stats" aria-label={`${programme.name} in numbers`}>
          {programme.stats.map((stat) => (
            <div key={stat.label}>
              <p className="prog-stat-num">{stat.value}</p>
              <p className="prog-stat-label">{stat.label}</p>
            </div>
          ))}
        </section>
      ) : null}

      {/* Hero image + gallery */}
      <div className="prog-media">
        <div className="prog-hero-image">
          <Image
            src={programme.visual.hero}
            alt={programme.visual.heroAlt}
            fill
            priority
            className="object-cover"
            sizes="(max-width: 1200px) 100vw, 1200px"
          />
        </div>
        {programme.visual.gallery.length > 0 ? (
          <div className="prog-gallery">
            {programme.visual.gallery.map((item) => (
              <div key={item.src} className="prog-gallery-item">
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 33vw, 400px"
                />
              </div>
            ))}
          </div>
        ) : null}
      </div>

      {/* Story */}
      <section className="prog-section prog-narrow">
        <p className="prog-index">01 / The story</p>
        {rest.map((paragraph) => (
          <p key={paragraph.slice(0, 48)} className="prog-prose">
            {paragraph}
          </p>
        ))}
        {programme.highlight ? (
          <p className="prog-pull">{programme.highlight}</p>
        ) : null}
        {chips.length > 0 ? (
          <p className="prog-formats">{chips.join(" · ")}</p>
        ) : null}
      </section>

      {/* Pillars */}
      {programme.pillars && programme.pillars.length > 0 ? (
        <section className="prog-section">
          <p className="prog-index">02 / What we do</p>
          <h2 className="prog-h2">The pillars of {programme.name}</h2>
          <div className="prog-pillars">
            {programme.pillars.map((pillar, i) => (
              <article key={pillar.title} className="prog-pillar">
                <span className="prog-pillar-num">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="prog-pillar-title">{pillar.title}</h3>
                  <p className="prog-pillar-body">{pillar.body}</p>
                </div>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      {/* Process */}
      {programme.process && programme.process.length > 0 ? (
        <section className="prog-section prog-narrow">
          <p className="prog-index">03 / How it works</p>
          <h2 className="prog-h2">From signal to story</h2>
          <ol className="prog-steps">
            {programme.process.map((step, i) => (
              <li key={step.title} className="prog-step">
                <span className="prog-step-num">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="prog-step-title">{step.title}</h3>
                  <p className="prog-step-body">{step.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>
      ) : null}

      {/* Evidence */}
      <section className="prog-section">
        <p className="prog-index">04 / Evidence</p>
        <h2 className="prog-h2">See the work</h2>
        <div className="prog-evidence">
          <Link href="/bns-studio/work" className="prog-evidence-row">
            <span className="prog-evidence-num">{evidence.studioWorks}</span>
            <span className="prog-evidence-main">
              <span className="prog-eyebrow">Studio productions in this lane</span>
              <span className="prog-evidence-title">Browse productions</span>
            </span>
            <ArrowUpRight className="size-5 shrink-0" aria-hidden />
          </Link>
          <Link href="/reports" className="prog-evidence-row">
            <span className="prog-evidence-num">{evidence.reportCount}</span>
            <span className="prog-evidence-main">
              <span className="prog-eyebrow">Reports & scorecards in the library</span>
              <span className="prog-evidence-title">Open the library</span>
            </span>
            <ArrowUpRight className="size-5 shrink-0" aria-hidden />
          </Link>
        </div>
        <p className="prog-blurb">{PROGRAMME_CARD_BLURBS[programme.slug]}</p>
      </section>

      {/* FAQ */}
      {programme.faqs && programme.faqs.length > 0 ? (
        <section className="prog-section prog-narrow">
          <p className="prog-index">05 / Questions</p>
          <h2 className="prog-h2">Asked about {programme.name}</h2>
          <Accordion type="single" collapsible className="prog-faq">
            {programme.faqs.map((faq, i) => (
              <AccordionItem key={faq.q} value={`item-${i}`} className="prog-faq-item">
                <AccordionTrigger className="prog-faq-q">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="prog-faq-a">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>
      ) : null}

      <ProgrammeOtherProgrammes currentSlug={programme.slug} />

      <LandingSection>
        <EditorialCtaBand
          eyebrow="The BNS ecosystem"
          title={PROGRAMMES_CLOSING.headline}
          description={PROGRAMMES_CLOSING.body}
          ctaHref={PROGRAMMES_CLOSING.cta.href}
          ctaLabel={PROGRAMMES_CLOSING.cta.label}
        />
      </LandingSection>
    </div>
  );
}
