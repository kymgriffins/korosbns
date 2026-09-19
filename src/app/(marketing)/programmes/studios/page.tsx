import type { Metadata } from "next";
import Link from "next/link";
import { ScrollReveal } from "@/components/clean-slate/scroll-reveal";

export const metadata: Metadata = {
  title: "BNS Studio | Evidence Production",
  description:
    "Commissioned evidence production that funds Budget Ndio Story programmes. Cinematic documentaries, short-form investigations, and public records.",
  alternates: { canonical: "https://budgetndiostory.org/programmes/studios" },
};

const SERVICES = [
  {
    title: "Documentary Production",
    description: "Full-length investigative documentaries translating complex audit data into compelling visual narratives.",
  },
  {
    title: "Short-Form Investigations",
    description: "60-second to 5-minute video investigations optimised for social media distribution.",
  },
  {
    title: "Data Visualisation",
    description: "Interactive graphics and motion graphics that make budget data accessible to citizens.",
  },
  {
    title: "Public Records",
    description: "Open-source evidence packages that citizens and journalists can use for accountability.",
  },
];

const PORTFOLIO = [
  { title: "Project TERRA", image: "/images/towwnhallmay/129A3912.jpg" },
  { title: "County Dispensary Audit", image: "/images/towwnhallmay/129A3912.jpg" },
  { title: "Borehole Verification", image: "/images/towwnhallmay/129A3912.jpg" },
  { title: "Road Infrastructure Check", image: "/images/towwnhallmay/129A3912.jpg" },
  { title: "School Bursary Tracking", image: "/images/towwnhallmay/129A3912.jpg" },
];

export default function StudioPage() {
  return (
    <>
      {/* Hero — dark background */}
      <section
        style={{
          minHeight: "100dvh",
          display: "flex",
          alignItems: "center",
          background: "var(--cs-black)",
          color: "var(--cs-white)",
          borderBottom: "1px solid var(--cs-gray-600)",
        }}
      >
        <div className="cs-container">
          <ScrollReveal>
            <h1 className="cs-display" style={{ color: "var(--cs-white)" }}>
              BNS Studio
            </h1>
          </ScrollReveal>
          <ScrollReveal delay={80}>
            <p
              className="cs-body"
              style={{ marginTop: "16px", color: "var(--cs-gray-400)", maxWidth: "40ch", fontSize: "1.125rem" }}
            >
              Evidence Production
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Services — dark bento */}
      <section style={{ background: "var(--cs-black)", color: "var(--cs-white)", padding: "var(--cs-section-y) 0", borderBottom: "1px solid var(--cs-gray-600)" }}>
        <div className="cs-container">
          <ScrollReveal>
            <h2 className="cs-headline" style={{ color: "var(--cs-white)", marginBottom: "48px" }}>
              What We Produce
            </h2>
          </ScrollReveal>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1px", background: "var(--cs-gray-600)" }}>
            {SERVICES.map((service, i) => (
              <ScrollReveal key={service.title} delay={i * 80}>
                <div style={{ background: "var(--cs-black)", padding: "32px" }}>
                  <h3 style={{ fontWeight: 600, fontSize: "1rem", marginBottom: "8px" }}>
                    {service.title}
                  </h3>
                  <p className="cs-body" style={{ color: "var(--cs-gray-400)", maxWidth: "45ch" }}>
                    {service.description}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Portfolio — horizontal scroll */}
      <section className="cs-section">
        <div className="cs-container">
          <ScrollReveal>
            <h2 className="cs-headline" style={{ marginBottom: "48px" }}>
              Selected Work
            </h2>
          </ScrollReveal>
          <div
            style={{
              display: "flex",
              gap: "24px",
              overflowX: "auto",
              paddingBottom: "16px",
              scrollSnapType: "x mandatory",
            }}
          >
            {PORTFOLIO.map((item, i) => (
              <ScrollReveal key={item.title} delay={i * 60}>
                <div
                  style={{
                    minWidth: "320px",
                    flexShrink: 0,
                    scrollSnapAlign: "start",
                  }}
                >
                  <div
                    style={{
                      width: "100%",
                      aspectRatio: "16/10",
                      background: "var(--cs-gray-200)",
                      overflow: "hidden",
                      marginBottom: "12px",
                    }}
                  >
                    <img src={item.image} alt={item.title} className="cs-image" />
                  </div>
                  <p style={{ fontWeight: 500, fontSize: "0.875rem" }}>{item.title}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA — blue */}
      <section style={{ background: "var(--cs-blue)", color: "var(--cs-white)", padding: "var(--cs-section-y) 0", borderTop: "2px solid var(--cs-black)" }}>
        <div className="cs-container">
          <ScrollReveal>
            <h2 className="cs-display" style={{ color: "var(--cs-white)", maxWidth: "12ch" }}>
              Commission Evidence
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={100}>
            <Link href="/contact" className="cs-btn cs-btn-white" style={{ marginTop: "24px" }}>
              Get in Touch
            </Link>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
