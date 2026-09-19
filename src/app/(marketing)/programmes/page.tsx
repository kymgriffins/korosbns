import type { Metadata } from "next";
import Link from "next/link";
import { ScrollReveal } from "@/components/clean-slate/scroll-reveal";

export const metadata: Metadata = {
  title: "Programmes | Budget Ndio Story",
  description:
    "Four programmes tracking Kenya's public wealth from national treasury to county communities.",
  alternates: { canonical: "https://budgetndiostory.org/programmes" },
};

const PROGRAMMES = [
  {
    slug: "connect",
    title: "BNS Connect",
    eyebrow: "National Intelligence",
    description: "Tracking debt amortization, national appropriations, and parliamentary fiscal legislation.",
    stat: "KSh 4.8T",
    statLabel: "Appropriation Tracked",
    image: "/images/towwnhallmay/129A3912.jpg",
  },
  {
    slug: "mashinani",
    title: "BNS Mashinani",
    eyebrow: "Ground Forensics",
    description: "Following funds past county treasury accounts to verify clinics, boreholes, and roads.",
    stat: "47",
    statLabel: "Counties",
    image: "/images/towwnhallmay/129A3912.jpg",
  },
  {
    slug: "wanahabari-lab",
    title: "Wanahabari Lab",
    eyebrow: "Newsroom Support",
    description: "Equipping grassroots reporters with forensic data toolkits to investigate procurement.",
    stat: "120+",
    statLabel: "Stories Published",
    image: "/images/towwnhallmay/129A3912.jpg",
  },
  {
    slug: "studios",
    title: "BNS Studio",
    eyebrow: "Creative Evidence",
    description: "Translating audit spreadsheets into compelling cinematic documentaries and investigations.",
    stat: "100%",
    statLabel: "Public Record",
    image: "/images/towwnhallmay/129A3912.jpg",
  },
];

export default function ProgrammesPage() {
  return (
    <>
      {/* Hero */}
      <section
        className="cs-section"
        style={{
          borderBottom: "2px solid var(--cs-black)",
          paddingBottom: "48px",
        }}
      >
        <div className="cs-container">
          <ScrollReveal>
            <h1 className="cs-display">Programmes</h1>
          </ScrollReveal>
          <ScrollReveal delay={80}>
            <p
              className="cs-body"
              style={{ marginTop: "16px", color: "var(--cs-gray-600)", maxWidth: "50ch" }}
            >
              Four programmes tracking Kenya&apos;s public wealth from national treasury to county communities.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Bento Grid */}
      <section className="cs-section">
        <div className="cs-container">
          <div className="cs-bento">
            {/* Connect — full width, large image */}
            <ScrollReveal className="cs-cell" style={{ gridColumn: "span 12" }}>
              <Link
                href="/programmes/connect"
                style={{ display: "block", textDecoration: "none", color: "inherit" }}
              >
                <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "32px", padding: "32px 0", alignItems: "center" }}>
                  <div style={{ aspectRatio: "16/10", background: "var(--cs-gray-200)", overflow: "hidden" }}>
                    <img src={PROGRAMMES[0].image} alt={PROGRAMMES[0].title} className="cs-image" />
                  </div>
                  <div>
                    <p className="cs-label" style={{ color: "var(--cs-gray-400)", marginBottom: "8px" }}>
                      {PROGRAMMES[0].eyebrow}
                    </p>
                    <h2 className="cs-headline">{PROGRAMMES[0].title}</h2>
                    <p className="cs-body" style={{ marginTop: "12px", color: "var(--cs-gray-600)" }}>
                      {PROGRAMMES[0].description}
                    </p>
                    <div style={{ marginTop: "24px" }}>
                      <div className="cs-stat-number">{PROGRAMMES[0].stat}</div>
                      <div className="cs-stat-label">{PROGRAMMES[0].statLabel}</div>
                    </div>
                  </div>
                </div>
              </Link>
            </ScrollReveal>

            {/* Mashinani + Wanahabari — half width each */}
            {PROGRAMMES.slice(1, 3).map((p, i) => (
              <ScrollReveal key={p.slug} className="cs-cell" delay={i * 80} style={{ gridColumn: "span 6" }}>
                <Link
                  href={`/programmes/${p.slug}`}
                  style={{ display: "block", textDecoration: "none", color: "inherit", padding: "32px 0" }}
                >
                  <p className="cs-label" style={{ color: "var(--cs-gray-400)", marginBottom: "8px" }}>
                    {p.eyebrow}
                  </p>
                  <h3 className="cs-headline" style={{ fontSize: "1.25rem" }}>{p.title}</h3>
                  <p className="cs-body" style={{ marginTop: "8px", color: "var(--cs-gray-600)", maxWidth: "40ch" }}>
                    {p.description}
                  </p>
                  <div style={{ marginTop: "24px" }}>
                    <div className="cs-stat-number" style={{ fontSize: "1.75rem" }}>{p.stat}</div>
                    <div className="cs-stat-label">{p.statLabel}</div>
                  </div>
                </Link>
              </ScrollReveal>
            ))}

            {/* Studio — full width strip */}
            <ScrollReveal className="cs-cell" delay={160} style={{ gridColumn: "span 12" }}>
              <Link
                href="/programmes/studios"
                style={{ display: "block", textDecoration: "none", color: "inherit" }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "32px", padding: "32px 0" }}>
                  <div style={{ width: "200px", aspectRatio: "16/10", background: "var(--cs-gray-200)", overflow: "hidden", flexShrink: 0 }}>
                    <img src={PROGRAMMES[3].image} alt={PROGRAMMES[3].title} className="cs-image" />
                  </div>
                  <div style={{ flex: 1 }}>
                    <p className="cs-label" style={{ color: "var(--cs-gray-400)", marginBottom: "4px" }}>
                      {PROGRAMMES[3].eyebrow}
                    </p>
                    <h3 className="cs-headline" style={{ fontSize: "1.25rem" }}>{PROGRAMMES[3].title}</h3>
                    <p className="cs-body" style={{ marginTop: "4px", color: "var(--cs-gray-600)" }}>
                      {PROGRAMMES[3].description}
                    </p>
                  </div>
                  <div style={{ textAlign: "right", flexShrink: 0 }}>
                    <div className="cs-stat-number" style={{ fontSize: "1.75rem" }}>{PROGRAMMES[3].stat}</div>
                    <div className="cs-stat-label">{PROGRAMMES[3].statLabel}</div>
                  </div>
                </div>
              </Link>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Comparison */}
      <section className="cs-section cs-section-muted">
        <div className="cs-container">
          <ScrollReveal>
            <h2 className="cs-headline" style={{ marginBottom: "48px" }}>
              At a glance
            </h2>
          </ScrollReveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0" }}>
            {PROGRAMMES.slice(0, 3).map((p, i) => (
              <ScrollReveal
                key={p.slug}
                delay={i * 60}
                style={{
                  padding: "24px",
                  borderRight: i < 2 ? "1px solid var(--cs-gray-200)" : "none",
                }}
              >
                <p style={{ fontWeight: 600, fontSize: "0.9375rem", marginBottom: "16px" }}>
                  {p.title}
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  <div>
                    <div className="cs-stat-number" style={{ fontSize: "1.5rem" }}>{p.stat}</div>
                    <div className="cs-stat-label">{p.statLabel}</div>
                  </div>
                  <p className="cs-body" style={{ color: "var(--cs-gray-600)", fontSize: "0.875rem" }}>
                    {p.description}
                  </p>
                </div>
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
