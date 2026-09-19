import type { Metadata } from "next";
import Link from "next/link";
import { ScrollReveal } from "@/components/clean-slate/scroll-reveal";
import { getProgrammeCards, getImpactStats } from "@/data/marketing";

export const metadata: Metadata = {
  title: "Programmes | Budget Ndio Story",
  description:
    "Four programmes tracking Kenya's public wealth from national treasury to county communities.",
  alternates: { canonical: "https://budgetndiostory.org/programmes" },
};

export default function ProgrammesPage() {
  const programmes = getProgrammeCards();
  const stats = getImpactStats();

  const connect = programmes.find((p) => p.slug === "connect");
  const mashinani = programmes.find((p) => p.slug === "mashinani");
  const wanahabari = programmes.find((p) => p.slug === "wanahabari-lab");
  const studio = programmes.find((p) => p.slug === "studios");

  return (
    <>
      {/* Hero */}
      <section
        className="cs-section"
        style={{ borderBottom: "2px solid var(--cs-black)", paddingBottom: "32px" }}
      >
        <div className="cs-container">
          <ScrollReveal>
            <h1 className="cs-display">Programmes</h1>
          </ScrollReveal>
          <ScrollReveal delay={80}>
            <p
              className="cs-body"
              style={{ marginTop: "12px", color: "var(--cs-gray-600)", maxWidth: "50ch" }}
            >
              Four programmes tracking Kenya&apos;s public wealth from national treasury to county communities.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Programme Cards */}
      <section className="cs-section">
        <div className="cs-container">
          <div className="cs-bento">
            {/* Connect — full width */}
            {connect && (
              <ScrollReveal className="cs-cell" style={{ gridColumn: "span 12" }}>
                <Link
                  href="/programmes/connect"
                  className="cs-project-card"
                  style={{ display: "block", padding: "24px 0" }}
                >
                  <div className="cs-grid-sidebar">
                    <div>
                      <div className="cs-aspect-16/9 cs-image-wrap" style={{ marginBottom: "16px" }}>
                        <img src={connect.thumbnail} alt={connect.title} className="cs-image" />
                      </div>
                      <h2 className="cs-headline cs-project-card-title">{connect.title}</h2>
                      <p className="cs-body" style={{ marginTop: "8px", color: "var(--cs-gray-600)" }}>
                        {connect.description}
                      </p>
                    </div>
                    <div>
                      <div className="cs-stat-number">{connect.projectCount}</div>
                      <div className="cs-stat-label">Projects</div>
                    </div>
                  </div>
                </Link>
              </ScrollReveal>
            )}

            {/* Mashinani + Wanahabari — half width */}
            {[mashinani, wanahabari].filter(Boolean).map((p, i) => (
              <ScrollReveal key={p!.slug} className="cs-cell" delay={i * 80} style={{ gridColumn: "span 12" }}>
                <Link
                  href={`/programmes/${p!.slug}`}
                  className="cs-project-card"
                  style={{ display: "block", padding: "24px 0" }}
                >
                  <h3 className="cs-headline cs-project-card-title" style={{ fontSize: "clamp(1.125rem, 2.5vw, 1.5rem)" }}>
                    {p!.title}
                  </h3>
                  <p className="cs-body" style={{ marginTop: "8px", color: "var(--cs-gray-600)", maxWidth: "40ch" }}>
                    {p!.description}
                  </p>
                  <div style={{ marginTop: "16px" }}>
                    <div className="cs-stat-number" style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)" }}>
                      {p!.projectCount}
                    </div>
                    <div className="cs-stat-label">Projects</div>
                  </div>
                </Link>
              </ScrollReveal>
            ))}

            {/* Studio — full width strip */}
            {studio && (
              <ScrollReveal className="cs-cell" delay={160} style={{ gridColumn: "span 12" }}>
                <Link
                  href="/programmes/studios"
                  className="cs-project-card"
                  style={{ display: "block", padding: "24px 0" }}
                >
                  <div className="cs-grid-sidebar">
                    <div>
                      <h3 className="cs-headline cs-project-card-title" style={{ fontSize: "clamp(1.125rem, 2.5vw, 1.5rem)" }}>
                        {studio.title}
                      </h3>
                      <p className="cs-body" style={{ marginTop: "4px", color: "var(--cs-gray-600)" }}>
                        {studio.description}
                      </p>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div className="cs-stat-number" style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)" }}>
                        {studio.projectCount}
                      </div>
                      <div className="cs-stat-label">Productions</div>
                    </div>
                  </div>
                </Link>
              </ScrollReveal>
            )}
          </div>
        </div>
      </section>

      {/* Comparison */}
      <section className="cs-section cs-section-muted">
        <div className="cs-container">
          <ScrollReveal>
            <h2 className="cs-headline" style={{ marginBottom: "32px" }}>
              At a glance
            </h2>
          </ScrollReveal>
          <div className="cs-grid-3">
            {programmes.map((p, i) => (
              <ScrollReveal key={p.slug} delay={i * 60} style={{ padding: "16px 0" }}>
                <p style={{ fontWeight: 600, fontSize: "0.9375rem", marginBottom: "12px" }}>
                  {p.title}
                </p>
                <div>
                  <div className="cs-stat-number" style={{ fontSize: "1.5rem" }}>
                    {p.projectCount}
                  </div>
                  <div className="cs-stat-label">{p.projectCount === 1 ? "Project" : "Projects"}</div>
                </div>
                <p className="cs-body" style={{ marginTop: "8px", color: "var(--cs-gray-600)", fontSize: "0.875rem" }}>
                  {p.description}
                </p>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cs-section cs-section-dark">
        <div className="cs-container">
          <ScrollReveal>
            <h2 className="cs-display" style={{ color: "var(--cs-white)" }}>
              Follow the money
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={100}>
            <Link href="/programmes/connect" className="cs-btn cs-btn-primary" style={{ marginTop: "24px" }}>
              Start with BNS Connect
            </Link>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
