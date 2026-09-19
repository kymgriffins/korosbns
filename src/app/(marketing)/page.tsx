import type { Metadata } from "next";
import Link from "next/link";
import { ScrollReveal } from "@/components/clean-slate/scroll-reveal";
import {
  getProgrammeCards,
  getImpactStats,
  getFeaturedProjects,
  getCommunityImages,
} from "@/data/marketing";

export const metadata: Metadata = {
  title: "Budget Ndio Story | Kenya's Public Wealth, Made Clear",
  description:
    "Translating Kenya's complex national budget into clear, actionable civic narratives. Independent journalism tracking public money from Nairobi to the grassroots.",
  alternates: { canonical: "https://budgetndiostory.org/" },
  openGraph: {
    title: "Budget Ndio Story",
    description: "Kenya's public wealth, made clear.",
    url: "/",
    type: "website",
  },
};

export default function LandingPage() {
  const programmes = getProgrammeCards();
  const stats = getImpactStats();
  const featured = getFeaturedProjects(3);
  const images = getCommunityImages();

  return (
    <>
      {/* Hero */}
      <section className="cs-hero" style={{ borderBottom: "2px solid var(--cs-black)" }}>
        <div className="cs-container">
          <ScrollReveal>
            <h1 className="cs-display" style={{ maxWidth: "14ch" }}>
              Budget Ndio Story
            </h1>
          </ScrollReveal>
          <ScrollReveal delay={100}>
            <p
              className="cs-body"
              style={{
                marginTop: "16px",
                maxWidth: "50ch",
                color: "var(--cs-gray-600)",
                fontSize: "clamp(1rem, 2.5vw, 1.125rem)",
              }}
            >
              Kenya&apos;s public wealth, translated into clear, actionable civic narratives.
            </p>
          </ScrollReveal>
          <ScrollReveal delay={200}>
            <Link href="/programmes" className="cs-btn cs-btn-primary" style={{ marginTop: "24px" }}>
              Explore Programmes
            </Link>
          </ScrollReveal>
        </div>
      </section>

      {/* Manifesto */}
      <section className="cs-section cs-section-muted">
        <div className="cs-container">
          <div className="cs-editorial-2col">
            <ScrollReveal>
              <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                <p className="cs-body" style={{ maxWidth: "65ch" }}>
                  Public budgets in Kenya have historically lived behind dense bureaucratic language,
                  releasing numbers only when policy decisions are already irreversible.
                </p>
                <p className="cs-body" style={{ maxWidth: "65ch" }}>
                  We open the paper trail, verify physical works, and hand the evidence back to citizens.
                  Every claim is sourced from National Treasury and Parliament.
                </p>
                <p className="cs-body" style={{ maxWidth: "65ch" }}>
                  From Treasury appropriations in Nairobi to county dispensaries and rural roads,
                  we track the verified trajectory of public money through independent reporting.
                </p>
              </div>
            </ScrollReveal>
            <ScrollReveal delay={150}>
              <div className="cs-aspect-3/4 cs-image-wrap">
                <img
                  src={images.forumB}
                  alt="Community town hall meeting in Kenya"
                  className="cs-image"
                  style={{ filter: "grayscale(1)" }}
                />
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Programmes Bento */}
      <section className="cs-section">
        <div className="cs-container">
          <ScrollReveal>
            <h2 className="cs-headline" style={{ marginBottom: "32px" }}>
              Programmes
            </h2>
          </ScrollReveal>
          <div className="cs-bento">
            {programmes.map((p, i) => (
              <ScrollReveal
                key={p.slug}
                delay={i * 80}
                className="cs-cell"
                style={{ gridColumn: "span 12" }}
              >
                <Link
                  href={`/programmes/${p.slug}`}
                  className="cs-project-card"
                  style={{ display: "block", padding: "24px 0" }}
                >
                  <div className="cs-grid-sidebar">
                    <div>
                      {i === 0 && (
                        <div
                          className="cs-aspect-16/9 cs-image-wrap"
                          style={{ marginBottom: "16px" }}
                        >
                          <img src={p.thumbnail} alt={p.title} className="cs-image" />
                        </div>
                      )}
                      <h3 className="cs-headline cs-project-card-title" style={{ fontSize: "clamp(1.125rem, 2.5vw, 1.5rem)" }}>
                        {p.title}
                      </h3>
                      <p
                        className="cs-body"
                        style={{ marginTop: "8px", color: "var(--cs-gray-600)", maxWidth: "50ch" }}
                      >
                        {p.description}
                      </p>
                    </div>
                    <div style={{ display: "flex", gap: "16px", alignItems: "baseline" }}>
                      <div>
                        <div className="cs-stat-number" style={{ fontSize: "clamp(1.5rem, 3vw, 2.5rem)" }}>
                          {p.projectCount}
                        </div>
                        <div className="cs-stat-label">Projects</div>
                      </div>
                    </div>
                  </div>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Impact Numbers */}
      <section className="cs-section cs-section-muted">
        <div className="cs-container">
          <div className="cs-stats-row">
            {[
              { number: String(stats.productionCount || 55), label: "Productions Completed" },
              { number: String(stats.partnerCount || 8), label: "Partner Organisations" },
              { number: String(stats.programmeCount || 4), label: "Active Programmes" },
              { number: String(stats.bnsLedCount || 12), label: "BNS-Led Projects" },
            ].map((item, i) => (
              <ScrollReveal key={item.label} delay={i * 60} style={{ padding: "24px" }}>
                <div className="cs-stat-number">{item.number}</div>
                <div className="cs-stat-label" style={{ marginTop: "8px" }}>
                  {item.label}
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      {featured.length > 0 && (
        <section className="cs-section">
          <div className="cs-container">
            <ScrollReveal>
              <h2 className="cs-headline" style={{ marginBottom: "32px" }}>
                Featured Work
              </h2>
            </ScrollReveal>
            <div className="cs-grid-3">
              {featured.map((project, i) => (
                <ScrollReveal key={project.id} delay={i * 80}>
                  <Link
                    href={project.href}
                    className="cs-project-card"
                    style={{ display: "block" }}
                  >
                    <div
                      className="cs-aspect-16/9 cs-image-wrap"
                      style={{ marginBottom: "12px" }}
                    >
                      <img
                        src={project.thumbnail}
                        alt={project.title}
                        className="cs-image"
                      />
                    </div>
                    <p className="cs-label" style={{ color: "var(--cs-gray-400)", marginBottom: "4px" }}>
                      {project.programmeLabel}
                    </p>
                    <h3 className="cs-headline cs-project-card-title" style={{ fontSize: "1rem" }}>
                      {project.title}
                    </h3>
                    {project.subtitle && (
                      <p className="cs-body" style={{ marginTop: "4px", color: "var(--cs-gray-600)", fontSize: "0.875rem" }}>
                        {project.subtitle}
                      </p>
                    )}
                  </Link>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="cs-section cs-section-dark">
        <div className="cs-container">
          <ScrollReveal>
            <h2 className="cs-display" style={{ color: "var(--cs-white)", maxWidth: "12ch" }}>
              Get in touch
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={100}>
            <p
              className="cs-body"
              style={{ marginTop: "12px", color: "var(--cs-gray-400)", maxWidth: "50ch" }}
            >
              Investigation tip-offs, partnerships, and inquiries.
            </p>
          </ScrollReveal>
          <ScrollReveal delay={200}>
            <Link href="/contact" className="cs-btn cs-btn-primary" style={{ marginTop: "24px" }}>
              Contact Us
            </Link>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
