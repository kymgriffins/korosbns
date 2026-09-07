"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { getProgramme } from "@/content";
import { BNS_STUDIO_PAGE_SERVICES } from "@/constants/bns-studio-content";
import { STUDIO_REEL_FEATURED_TYPES } from "@/lib/studio-reel-slides";
import { StudioBookingForm } from "@/components/studio/StudioBookingForm";
import { BNS_COMMUNITY_IMAGES, BNS_MEDIA_IMAGES } from "@/constants/bns-media-images";

const studios = getProgramme("studios")!;

const craftServices = STUDIO_REEL_FEATURED_TYPES.map(
  (type) => BNS_STUDIO_PAGE_SERVICES.find((s) => s.contentType === type)!,
).filter(Boolean);

const fieldImages = [
  { src: BNS_MEDIA_IMAGES.productionA, alt: "On-set videography for a BNS Studios commission" },
  { src: BNS_MEDIA_IMAGES.productionB, alt: "Studio portrait and interview session" },
  { src: BNS_MEDIA_IMAGES.hall, alt: "Hall event coverage by BNS Studios" },
  { src: BNS_COMMUNITY_IMAGES.forumA, alt: "Town hall forum with citizens" },
  { src: BNS_COMMUNITY_IMAGES.forumD, alt: "Community listening session in session" },
  { src: BNS_COMMUNITY_IMAGES.cohortA, alt: "Youth cohort groundworks session" },
  { src: BNS_COMMUNITY_IMAGES.stakeholdersB, alt: "Stakeholder roundtable on camera" },
  { src: BNS_COMMUNITY_IMAGES.forumB, alt: "Citizens engaging county budget discussions" },
];

export function StudioAboutPage() {
  const [bookingOpen, setBookingOpen] = useState(false);
  const gallery = studios.visual?.gallery ?? [];

  return (
    <div className="studio-about-page studio-about-borderless">
      {/* 01 — Hero: studio statement */}
      <section className="studio-about-section studio-about-hero-v2">
        <div className="studio-about-copy">
          <p className="studio-about-eyebrow">{studios.eyebrow}</p>
          <h1 className="studio-about-title-xl">{studios.headline}</h1>
          <p className="studio-about-lede">{studios.body}</p>
          {studios.highlight ? (
            <p className="studio-about-formats-v2">{studios.highlight}</p>
          ) : null}
          <div className="studio-about-hero-ctas">
            <button
              type="button"
              onClick={() => setBookingOpen(true)}
              className="studio-about-cta"
            >
              Commission the studio
            </button>
            <Link href="/bns-studio/work" className="studio-about-ghost">
              See featured work
              <ArrowUpRight className="size-4" aria-hidden />
            </Link>
          </div>
        </div>
        {studios.visual?.hero ? (
          <div className="studio-about-visual-v2">
            <Image
              src={studios.visual.hero}
              alt={studios.visual.heroAlt ?? "BNS Studios production"}
              fill
              className="object-cover object-center"
              sizes="(max-width: 1024px) 100vw, 44vw"
              priority
            />
          </div>
        ) : null}
      </section>

      {/* 02 — Audio & visual craft: the 4 reel formats */}
      <section className="studio-about-section studio-about-craft">
        <div className="studio-about-section-head">
          <p className="studio-about-index">01 / Craft</p>
          <h2 className="studio-about-h2">Audio & visuals, done properly.</h2>
          <p className="studio-about-standfirst">
            Four formats carry the landing reel — bilingual audio, motion
            explainers, and cinematic documentary. Everything else lives in
            featured work.
          </p>
        </div>
        <div className="studio-about-craft-grid">
          {craftServices.map((service, i) => (
            <article key={service.contentType} className="studio-about-craft-card">
              <div className="studio-about-craft-media">
                <Image
                  src={service.image}
                  alt={`${service.name} — BNS Studios`}
                  fill
                  className="object-cover object-center"
                  sizes="(max-width: 768px) 100vw, 25vw"
                />
                <span className="studio-about-craft-num">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>
              <h3 className="studio-about-craft-title">{service.name}</h3>
              <p className="studio-about-craft-desc">{service.description}</p>
              <p className="studio-about-craft-best">{service.bestFor}</p>
            </article>
          ))}
        </div>
      </section>

      {/* 03 — In the field: image-led production story */}
      <section className="studio-about-section studio-about-field">
        <div className="studio-about-section-head">
          <p className="studio-about-index">02 / In the field</p>
          <h2 className="studio-about-h2">Shot on location. Cut in studio.</h2>
          <p className="studio-about-standfirst">
            Town halls, county forums, youth cohorts, and interview rooms —
            the raw material behind every commission.
          </p>
        </div>
        <div className="studio-about-field-grid">
          {fieldImages.map((item) => (
            <div key={item.src} className="studio-about-field-item">
              <Image
                src={item.src}
                alt={item.alt}
                fill
                className="object-cover object-center"
                sizes="(max-width: 768px) 50vw, 25vw"
              />
            </div>
          ))}
        </div>
        {gallery.length > 0 ? (
          <div className="studio-about-field-strip">
            {gallery.map((item) => (
              <div key={item.src} className="studio-about-field-strip-item">
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  className="object-cover object-center"
                  sizes="(max-width: 768px) 80vw, 30vw"
                />
              </div>
            ))}
          </div>
        ) : null}
      </section>

      {/* 04 — Why BNS: editorial text + double impact */}
      <section className="studio-about-section studio-about-why">
        <div className="studio-about-why-copy">
          <p className="studio-about-index">03 / Why BNS</p>
          <h2 className="studio-about-h2-xl">
            Mission-aligned. Editorially independent. Built for reach.
          </h2>
          <p className="studio-about-lede-sm">{studios.highlight}</p>
          <div className="studio-about-stats">
            <div className="studio-about-stat">
              <p className="studio-about-stat-num">04</p>
              <p className="studio-about-stat-label">Core audio-visual formats on the reel</p>
            </div>
            <div className="studio-about-stat">
              <p className="studio-about-stat-num">08</p>
              <p className="studio-about-stat-label">Full production formats available to commission</p>
            </div>
            <div className="studio-about-stat">
              <p className="studio-about-stat-num">2×</p>
              <p className="studio-about-stat-label">Double impact — content for you, funding for civic media</p>
            </div>
          </div>
          <p className="studio-about-body-sm">
            Governments meeting participation mandates, development partners
            pursuing localisation, companies delivering ESG, and CSOs without
            in-house capacity — one studio, fluent in strategy and production.
          </p>
        </div>
        <div className="studio-about-why-visuals">
          <div className="studio-about-why-main">
            <Image
              src={BNS_MEDIA_IMAGES.main}
              alt="BNS Studio flagship production"
              fill
              className="object-cover object-center"
              sizes="(max-width: 1024px) 100vw, 30vw"
            />
          </div>
          <div className="studio-about-why-sub">
            <Image
              src={BNS_COMMUNITY_IMAGES.forumC}
              alt="Community dialogue captured by BNS Studios"
              fill
              className="object-cover object-center"
              sizes="(max-width: 1024px) 100vw, 30vw"
            />
          </div>
        </div>
      </section>

      {/* 05 — Commission */}
      <section id="contact" className="studio-about-section studio-about-contact-v2">
        <div className="studio-about-contact-copy">
          <p className="studio-about-index">04 / Commission</p>
          <h2 className="studio-about-h2">Tell us what you need to move.</h2>
          <p className="studio-about-standfirst">
            Podcasts, explainers, town halls, or full campaigns — we respond
            with scope and timeline.
          </p>
          <div className="studio-about-hero-ctas">
            <button
              type="button"
              onClick={() => setBookingOpen(true)}
              className="studio-about-cta"
            >
              Open enquiry form
            </button>
            <Link href="/bns-studio/work" className="studio-about-ghost">
              See featured work
              <ArrowUpRight className="size-4" aria-hidden />
            </Link>
          </div>
        </div>
        <div className="studio-about-contact-visual">
          <Image
            src={BNS_COMMUNITY_IMAGES.stakeholdersC}
            alt="Stakeholder session documented by BNS Studios"
            fill
            className="object-cover object-center"
            sizes="(max-width: 1024px) 100vw, 36vw"
          />
        </div>
      </section>

      <StudioBookingForm open={bookingOpen} onOpenChange={setBookingOpen} />
    </div>
  );
}
