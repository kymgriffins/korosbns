import type { Metadata } from "next";
import Link from "next/link";
import { ScrollReveal } from "@/components/clean-slate/scroll-reveal";

export const metadata: Metadata = {
  title: "BNS Mashinani | County Delivery Evidence",
  description:
    "Following funds past county treasury accounts to verify clinics, boreholes, feeder roads, and community bursaries across Kenya.",
  alternates: { canonical: "https://budgetndiostory.org/programmes/mashinani" },
};

const COUNTIES = [
  { name: "Nairobi", stat: "KSh 2.1B", note: "Office renovations vs clinic funding gap" },
  { name: "Nakuru", stat: "34 Clinics", note: "Disbursed but unfinished maternal wards" },
  { name: "Kisumu", stat: "KSh 890M", note: "Road contractor payment verification" },
  { name: "Mombasa", stat: "12 Boreholes", note: "Drilled but non-functional water points" },
  { name: "Uasin Gishu", stat: "KSh 450M", note: "Bursary fund allocation tracking" },
  { name: "Kiambu", stat: "28 Schools", note: "Classroom construction verification" },
];

const FIELD_EVIDENCE = [
  {
    image: "/images/towwnhallmay/129A3912.jpg",
    caption: "County road in Nakuru, photographed during ground verification.",
  },
  {
    image: "/images/towwnhallmay/129A3912.jpg",
    caption: "Dispensary in Kisumu with incomplete roofing despite full payment.",
  },
  {
    image: "/images/towwnhallmay/129A3912.jpg",
    caption: "Borehole installation in Mombasa, non-functional after six months.",
  },
  {
    image: "/images/towwnhallmay/129A3912.jpg",
    caption: "Community meeting in Uasin Gishu discussing bursary allocations.",
  },
];

const VERIFICATION_STEPS = [
  {
    number: "01",
    title: "Document Collection",
    description: "We obtain county expenditure reports, payment vouchers, and contractor filings through public participation requests.",
  },
  {
    number: "02",
    title: "Ground Verification",
    description: "Our field teams photograph physical works, interview community members, and cross-reference delivered goods against payment records.",
  },
  {
    number: "03",
    title: "Evidence Publication",
    description: "Verified findings are published as open-source evidence packages, available to citizens, journalists, and oversight bodies.",
  },
];

export default function MashinaniPage() {
  return (
    <>
      {/* Hero — full-bleed image */}
      <section style={{ position: "relative", height: "100dvh", overflow: "hidden" }}>
        <img
          src="/images/towwnhallmay/129A3912.jpg"
          alt="County road in rural Kenya"
          className="cs-image"
          style={{ position: "absolute", inset: 0, filter: "brightness(0.4)" }}
        />
        <div
          style={{
            position: "relative",
            zIndex: 1,
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <div className="cs-container">
            <ScrollReveal>
              <h1 className="cs-display" style={{ color: "var(--cs-white)" }}>
                BNS Mashinani
              </h1>
            </ScrollReveal>
            <ScrollReveal delay={80}>
              <p
                className="cs-body"
                style={{ marginTop: "16px", color: "rgba(255,255,255,0.8)", maxWidth: "40ch", fontSize: "1.125rem" }}
              >
                County Delivery Evidence
              </p>
            </ScrollReveal>
          </div>
        </div>
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "2px", background: "var(--cs-black)" }} />
      </section>

      {/* County Grid */}
      <section className="cs-section">
        <div className="cs-container">
          <ScrollReveal>
            <h2 className="cs-headline" style={{ marginBottom: "48px" }}>
              Counties
            </h2>
          </ScrollReveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1px", background: "var(--cs-gray-200)" }}>
            {COUNTIES.map((county, i) => (
              <ScrollReveal key={county.name} delay={i * 60}>
                <div style={{ background: "var(--cs-white)", padding: "24px" }}>
                  <p style={{ fontWeight: 600, fontSize: "0.9375rem", marginBottom: "8px" }}>
                    {county.name}
                  </p>
                  <div className="cs-stat-number" style={{ fontSize: "1.5rem" }}>{county.stat}</div>
                  <p className="cs-body" style={{ marginTop: "8px", color: "var(--cs-gray-600)", fontSize: "0.875rem" }}>
                    {county.note}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Field Evidence */}
      <section className="cs-section cs-section-muted">
        <div className="cs-container">
          <ScrollReveal>
            <h2 className="cs-headline" style={{ marginBottom: "48px" }}>
              Field Evidence
            </h2>
          </ScrollReveal>
          <div style={{ display: "grid", gridTemplateColumns: "7fr 5fr", gap: "24px" }}>
            {FIELD_EVIDENCE.map((item, i) => (
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

      {/* Verification Steps */}
      <section className="cs-section">
        <div className="cs-container">
          <ScrollReveal>
            <h2 className="cs-headline" style={{ marginBottom: "48px" }}>
              How We Verify
            </h2>
          </ScrollReveal>
          <div style={{ display: "flex", flexDirection: "column" }}>
            {VERIFICATION_STEPS.map((step, i) => (
              <ScrollReveal key={step.number} delay={i * 60}>
                <div
                  style={{
                    padding: "24px 0",
                    borderBottom: i < VERIFICATION_STEPS.length - 1 ? "1px solid var(--cs-gray-200)" : "none",
                    display: "grid",
                    gridTemplateColumns: "80px 1fr",
                    gap: "32px",
                    alignItems: "start",
                  }}
                >
                  <span className="cs-mono" style={{ color: "var(--cs-gray-400)" }}>
                    {step.number}
                  </span>
                  <div>
                    <p style={{ fontWeight: 600, fontSize: "0.9375rem", marginBottom: "8px" }}>
                      {step.title}
                    </p>
                    <p className="cs-body" style={{ color: "var(--cs-gray-600)", maxWidth: "55ch" }}>
                      {step.description}
                    </p>
                  </div>
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
            <h2 className="cs-display" style={{ color: "var(--cs-white)", maxWidth: "14ch" }}>
              Verify the ground truth
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
