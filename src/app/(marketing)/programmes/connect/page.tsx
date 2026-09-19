import type { Metadata } from "next";
import Link from "next/link";
import { ScrollReveal } from "@/components/clean-slate/scroll-reveal";

export const metadata: Metadata = {
  title: "BNS Connect | National Budget Intelligence",
  description:
    "Tracking debt amortization, national appropriations, and parliamentary fiscal legislation before bills become binding law.",
  alternates: { canonical: "https://budgetndiostory.org/programmes/connect" },
};

const TRACKING_AREAS = [
  {
    label: "Debt Amortization",
    description: "Statutory debt servicing claims over sixty percent of collected revenues before a single shilling reaches hospital drugs or school classrooms.",
  },
  {
    label: "National Appropriations",
    description: "Tracking every shilling from Treasury to implementing agencies, verifying that allocations match actual expenditure.",
  },
  {
    label: "Parliamentary Fiscal Legislation",
    description: "Monitoring Finance Bills, Appropriation Bills, and County Allocation Bills before they become binding law.",
  },
  {
    label: "Public Participation",
    description: "Ensuring citizens can engage with budget processes at every stage, from BPS to implementation.",
  },
];

const EVIDENCE = [
  {
    image: "/images/towwnhallmay/129A3912.jpg",
    caption: "Treasury headquarters in Nairobi, where national appropriations originate.",
  },
  {
    image: "/images/towwnhallmay/129A3912.jpg",
    caption: "Parliamentary committee reviewing the Finance Bill.",
  },
  {
    image: "/images/towwnhallmay/129A3912.jpg",
    caption: "County assembly budget hearing session.",
  },
  {
    image: "/images/towwnhallmay/129A3912.jpg",
    caption: "Citizens engaging with budget documents at a community forum.",
  },
];

export default function BNSConnectPage() {
  return (
    <>
      {/* Hero — blue background */}
      <section
        style={{
          minHeight: "80dvh",
          display: "flex",
          alignItems: "center",
          background: "var(--cs-blue)",
          color: "var(--cs-white)",
          borderBottom: "2px solid var(--cs-black)",
        }}
      >
        <div className="cs-container">
          <ScrollReveal>
            <h1 className="cs-display" style={{ color: "var(--cs-white)" }}>
              BNS Connect
            </h1>
          </ScrollReveal>
          <ScrollReveal delay={80}>
            <p
              className="cs-body"
              style={{ marginTop: "16px", color: "rgba(255,255,255,0.8)", maxWidth: "40ch", fontSize: "1.125rem" }}
            >
              National Budget Intelligence
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Key Figures */}
      <section className="cs-section">
        <div className="cs-container">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0" }}>
            {[
              { number: "KSh 4.8T", label: "National Budget Tracked" },
              { number: "23", label: "Bills Monitored" },
              { number: "6", label: "Key Counties" },
            ].map((item, i) => (
              <ScrollReveal
                key={item.label}
                delay={i * 60}
                style={{
                  padding: "32px 24px",
                  borderRight: i < 2 ? "1px solid var(--cs-gray-200)" : "none",
                }}
              >
                <div className="cs-stat-number">{item.number}</div>
                <div className="cs-stat-label" style={{ marginTop: "8px" }}>{item.label}</div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* What We Track */}
      <section className="cs-section cs-section-muted">
        <div className="cs-container">
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "48px", alignItems: "start" }}>
            <ScrollReveal>
              <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
                {TRACKING_AREAS.map((area, i) => (
                  <div
                    key={area.label}
                    style={{
                      padding: "24px 0",
                      borderBottom: i < TRACKING_AREAS.length - 1 ? "1px solid var(--cs-gray-200)" : "none",
                    }}
                  >
                    <p style={{ fontWeight: 600, fontSize: "0.9375rem", marginBottom: "8px" }}>
                      {area.label}
                    </p>
                    <p className="cs-body" style={{ color: "var(--cs-gray-600)", maxWidth: "55ch" }}>
                      {area.description}
                    </p>
                  </div>
                ))}
              </div>
            </ScrollReveal>
            <ScrollReveal delay={100}>
              <div style={{ aspectRatio: "4/3", background: "var(--cs-gray-200)", overflow: "hidden" }}>
                <img
                  src="/images/towwnhallmay/129A3912.jpg"
                  alt="Kenya budget data visualization"
                  className="cs-image"
                />
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Evidence Grid */}
      <section className="cs-section">
        <div className="cs-container">
          <ScrollReveal>
            <h2 className="cs-headline" style={{ marginBottom: "48px" }}>
              Evidence
            </h2>
          </ScrollReveal>
          <div style={{ display: "grid", gridTemplateColumns: "7fr 5fr", gap: "24px" }}>
            {EVIDENCE.map((item, i) => (
              <ScrollReveal
                key={i}
                delay={i * 80}
                style={{ gridColumn: i % 3 === 0 ? "span 7" : "span 5" }}
              >
                <div style={{ aspectRatio: i % 3 === 0 ? "16/10" : "4/3", background: "var(--cs-gray-200)", overflow: "hidden", marginBottom: "12px" }}>
                  <img src={item.image} alt={item.caption} className="cs-image" />
                </div>
                <p className="cs-body" style={{ color: "var(--cs-gray-600)", fontSize: "0.875rem" }}>
                  {item.caption}
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
            <h2 className="cs-display" style={{ color: "var(--cs-white)", maxWidth: "12ch" }}>
              Follow the money
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={100}>
            <Link href="/programmes" className="cs-btn cs-btn-primary" style={{ marginTop: "24px" }}>
              View All Programmes
            </Link>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
