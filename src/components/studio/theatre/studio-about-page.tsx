"use client";

import Image from "next/image";
import { getProgramme } from "@/content";
import { StudioBookingForm } from "@/components/studio/StudioBookingForm";
import { StudioSiteFooter, StudioSiteNav } from "@/components/studio/theatre/studio-site-nav";
import { useState } from "react";

const studios = getProgramme("studios")!;

export function StudioAboutPage() {
  const [bookingOpen, setBookingOpen] = useState(false);
  const gallery = studios.visual?.gallery ?? [];

  return (
    <div className="studio-about-page">
      <StudioSiteNav active="about" />

      <div className="studio-about-hero">
        <div className="studio-about-copy">
          <p className="studio-about-eyebrow">{studios.eyebrow}</p>
          <h1 className="studio-about-title">{studios.headline}</h1>
          <p className="studio-about-body">{studios.body}</p>
          <p className="studio-about-formats">{studios.formats}</p>
          <p className="studio-about-highlight">{studios.highlight}</p>
        </div>
        {studios.visual?.hero ? (
          <div className="studio-about-visual">
            <Image
              src={studios.visual.hero}
              alt={studios.visual.heroAlt ?? "BNS Studios production"}
              fill
              className="object-cover object-center"
              sizes="(max-width: 1024px) 100vw, 40vw"
              priority
            />
          </div>
        ) : null}
      </div>

      {gallery.length > 0 ? (
        <div className="studio-about-gallery">
          {gallery.map((item) => (
            <div key={item.src} className="studio-about-gallery-item">
              <Image
                src={item.src}
                alt={item.alt}
                fill
                className="object-cover object-center"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            </div>
          ))}
        </div>
      ) : null}

      <section id="contact" className="studio-about-contact">
        <h2 className="studio-about-contact-title">Commission BNS Studios</h2>
        <p className="studio-about-contact-lead">
          Tell us about your podcast, explainer, town hall, or campaign — we respond with scope
          and timeline.
        </p>
        <StudioBookingForm open={bookingOpen} onOpenChange={setBookingOpen} />
        <button
          type="button"
          onClick={() => setBookingOpen(true)}
          className="studio-about-cta"
        >
          Open enquiry form
        </button>
      </section>

      <StudioSiteFooter />
    </div>
  );
}
