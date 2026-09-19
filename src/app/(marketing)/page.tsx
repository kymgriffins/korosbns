import type { Metadata } from "next";
import Link from "next/link";
import { ScrollReveal } from "@/components/clean-slate/scroll-reveal";

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

const PROGRAMMES = [
  {
    slug: "connect",
    title: "BNS Connect",
    description: "National budget intelligence. Tracking debt, appropriations, and parliamentary fiscal legislation.",
    stat: "KSh 4.8T",
    statLabel: "Appropriation Tracked",
  },
  {
    slug: "mashinani",
    title: "BNS Mashinani",
    description: "County delivery evidence. Following funds past treasury accounts to verify clinics, boreholes, and roads.",
    stat: "47",
    statLabel: "Counties Monitored",
  },
  {
    slug: "wanahabari-lab",
    title: "Wanahabari Lab",
    description: "Investigative journalism lab. Equipping grassroots reporters with forensic data toolkits.",
    stat: "120+",
    statLabel: "Stories Published",
  },
  {
    slug: "studios",
    title: "BNS Studio",
    description: "Evidence production. Translating audit spreadsheets into compelling cinematic investigations.",
    stat: "100%",
    statLabel: "Public Record",
  },
];

const TEAM = [
  { name: "Faith Muthoni", role: "Grassroots Civic Fellow" },
  { name: "James Kariuki", role: "Lead Investigator" },
  { name: "Amina Hassan", role: "Data Analyst" },
];

export default function LandingPage() {
  return (
    <>
      {/* Section 1 — Hero */}
      <section
        className="cs-section"
        style={{
          minHeight: "100dvh",
          display: "flex",
          alignItems: "center",
          borderBottom: "2px solid var(--cs-black)",
        }}
      >
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
                marginTop: "24px",
                maxWidth: "50ch",
                color: "var(--cs-gray-600)",
                fontSize: "1.125rem",
              }}
            >
              Kenya&apos;s public wealth, translated into clear, actionable civic narratives.
            </p>
          </ScrollReveal>
          <ScrollReveal delay={200}>
            <Link href="/programmes" className="cs-btn cs-btn-primary" style={{ marginTop: "32px" }}>
              Explore Programmes
            </Link>
          </ScrollReveal>
        </div>
      </section>

      {/* Section 2 — Manifesto */}
      <section className="cs-section cs-section-muted">
        <div className="cs-container">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "2fr 1fr",
              gap: "48px",
              alignItems: "start",
            }}
          >
            <ScrollReveal>
              <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                <p className="cs-body" style={{ maxWidth: "65ch" }}>
                  Public budgets in Kenya have historically lived behind dense bureaucratic language,
                  releasing numbers only when policy decisions are already irreversible.
                </p>
                <p className="cs-body" style={{ maxWidth: "65ch" }}>
                  We open the paper trail, verify physical works, and hand the evidence back to citizens.
                  Every claim is sourced from National Treasury and Parliament. The design communicates
                  trust without being boring.
                </p>
                <p className="cs-body" style={{ maxWidth: "65ch" }}>
                  From Treasury appropriations in Nairobi to county dispensaries and rural roads,
                  we track the verified trajectory of public money through independent reporting.
                </p>
              </div>
            </ScrollReveal>
            <ScrollReveal delay={150}>
              <div
                style={{
                  width: "100%",
                  aspectRatio: "3/4",
                  background: "var(--cs-gray-200)",
                  overflow: "hidden",
                }}
              >
                <img
                  src="/images/towwnhallmay/129A3912.jpg"
                  alt="Community town hall meeting in Kenya"
                  className="cs-image"
                  style={{ filter: "grayscale(1)" }}
                />
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Section 3 — Programmes Bento */}
      <section className="cs-section">
        <div className="cs-container">
          <ScrollReveal>
            <h2 className="cs-headline" style={{ marginBottom: "48px" }}>
              Programmes
            </h2>
          </ScrollReveal>
          <div className="cs-bento">
            {PROGRAMMES.map((p, i) => (
              <ScrollReveal
                key={p.slug}
                delay={i * 80}
                className={
                  i === 0
                    ? "cs-cell"
                    : i === 3
                      ? "cs-cell"
                      : "cs-cell"
                }
                style={
                  i === 0
                    ? { gridColumn: "span 12" }
                    : i === 3
                      ? { gridColumn: "span 12" }
                      : { gridColumn: "span 6" }
                }
              >
                <Link
                  href={`/programmes/${p.slug}`}
                  style={{
                    display: "block",
                    padding: "32px 0",
                    textDecoration: "none",
                    color: "inherit",
                  }}
                >
                  {i === 0 && (
                    <div
                      style={{
                        width: "100%",
                        aspectRatio: "16/9",
                        background: "var(--cs-gray-200)",
                        marginBottom: "24px",
                        overflow: "hidden",
                      }}
                    >
                      <img
                        src="/images/towwnhallmay/129A3912.jpg"
                        alt={p.title}
                        className="cs-image"
                      />
                    </div>
                  )}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "24px" }}>
                    <div style={{ flex: 1 }}>
                      <h3 className="cs-headline" style={{ fontSize: "1.25rem" }}>
                        {p.title}
                      </h3>
                      <p
                        className="cs-body"
                        style={{ marginTop: "8px", color: "var(--cs-gray-600)", maxWidth: "50ch" }}
                      >
                        {p.description}
                      </p>
                    </div>
                    {i !== 0 && (
                      <div style={{ textAlign: "right", flexShrink: 0 }}>
                        <div className="cs-stat-number">{p.stat}</div>
                        <div className="cs-stat-label">{p.statLabel}</div>
                      </div>
                    )}
                  </div>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Section 4 — Impact Numbers */}
      <section className="cs-section cs-section-muted">
        <div className="cs-container">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: "0",
            }}
          >
            {[
              { number: "KSh 4.8T", label: "National Budget Tracked" },
              { number: "47", label: "Counties Monitored" },
              { number: "120+", label: "Investigations Published" },
              { number: "100%", label: "Public Record" },
            ].map((item, i) => (
              <ScrollReveal
                key={item.label}
                delay={i * 60}
                style={{
                  padding: "32px 24px",
                  borderRight: i < 3 ? "1px solid var(--cs-gray-200)" : "none",
                }}
              >
                <div className="cs-stat-number">{item.number}</div>
                <div className="cs-stat-label" style={{ marginTop: "8px" }}>
                  {item.label}
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Section 5 — Team */}
      <section className="cs-section">
        <div className="cs-container">
          <ScrollReveal>
            <h2 className="cs-headline" style={{ marginBottom: "48px" }}>
              The Desk
            </h2>
          </ScrollReveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "24px" }}>
            {TEAM.map((person, i) => (
              <ScrollReveal key={person.name} delay={i * 80}>
                <div
                  style={{
                    width: "100%",
                    aspectRatio: "1",
                    background: "var(--cs-gray-200)",
                    overflow: "hidden",
                    marginBottom: "16px",
                  }}
                >
                  <img
                    src="/images/towwnhallmay/129A3912.jpg"
                    alt={person.name}
                    className="cs-image"
                    style={{ filter: "grayscale(1)", transition: "filter 0.3s" }}
                    onMouseEnter={(e) => (e.currentTarget.style.filter = "grayscale(0)")}
                    onMouseLeave={(e) => (e.currentTarget.style.filter = "grayscale(1)")}
                  />
                </div>
                <p style={{ fontWeight: 600, fontSize: "0.9375rem" }}>{person.name}</p>
                <p className="cs-stat-label">{person.role}</p>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Section 6 — Contact CTA */}
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
              style={{ marginTop: "16px", color: "var(--cs-gray-400)", maxWidth: "50ch" }}
            >
              Investigation tip-offs, partnerships, and inquiries.
            </p>
          </ScrollReveal>
          <ScrollReveal delay={200}>
            <Link href="/contact" className="cs-btn cs-btn-primary" style={{ marginTop: "32px" }}>
              Contact Us
            </Link>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
