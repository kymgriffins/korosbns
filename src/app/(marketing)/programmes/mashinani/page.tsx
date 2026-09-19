import type { Metadata } from "next";
import Link from "next/link";
import { ScrollReveal } from "@/components/clean-slate/scroll-reveal";
import { getProjectsByProgramme, getCommunityImages } from "@/data/marketing";

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
  const projects = getProjectsByProgramme("mashinani");
  const images = getCommunityImages();

  return (
    <>
      {/* Hero */}
      <section style={{ position: "relative", minHeight: "100dvh", overflow: "hidden" }}>
        <img
          src={images.forumB}
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
                style={{ marginTop: "12px", color: "rgba(255,255,255,0.8)", maxWidth: "40ch", fontSize: "clamp(1rem, 2.5vw, 1.125rem)" }}
              >
                County Delivery Evidence
              </p>
            </ScrollReveal>
            <ScrollReveal delay={120}>
              <div style={{ marginTop: "24px" }}>
                <div className="cs-stat-number" style={{ color: "var(--cs-white)" }}>
                  {projects.length}
                </div>
                <div className="cs-stat-label" style={{ color: "rgba(255,255,255,0.6)" }}>
                  Field Investigations
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "2px", background: "var(--cs-black)" }} />
      </section>

      {/* County Grid */}
      <section className="cs-section">
        <div className="cs-container">
          <ScrollReveal>
            <h2 className="cs-headline" style={{ marginBottom: "32px" }}>
              Counties
            </h2>
          </ScrollReveal>
          <div className="cs-county-grid" style={{ background: "var(--cs-gray-200)", gap: "1px" }}>
            {COUNTIES.map((county, i) => (
              <ScrollReveal key={county.name} delay={i * 60}>
                <div style={{ background: "var(--cs-white)", padding: "20px" }}>
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
      {projects.length > 0 && (
        <section className="cs-section cs-section-muted">
          <div className="cs-container">
            <ScrollReveal>
              <h2 className="cs-headline" style={{ marginBottom: "32px" }}>
                Field Evidence
              </h2>
            </ScrollReveal>
            <div className="cs-grid-3">
              {projects.slice(0, 6).map((project, i) => (
                <ScrollReveal key={project.id} delay={i * 80}>
                  <Link
                    href={project.href}
                    className="cs-project-card"
                    style={{ display: "block" }}
                  >
                    <div className="cs-aspect-16/9 cs-image-wrap" style={{ marginBottom: "12px" }}>
                      <img src={project.thumbnail} alt={project.title} className="cs-image" />
                    </div>
                    <h3 className="cs-headline cs-project-card-title" style={{ fontSize: "1rem" }}>
                      {project.title}
                    </h3>
                    {project.organisationName && (
                      <p className="cs-body" style={{ marginTop: "4px", color: "var(--cs-gray-600)", fontSize: "0.875rem" }}>
                        {project.organisationName}
                      </p>
                    )}
                  </Link>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Verification Steps */}
      <section className="cs-section">
        <div className="cs-container">
          <ScrollReveal>
            <h2 className="cs-headline" style={{ marginBottom: "32px" }}>
              How We Verify
            </h2>
          </ScrollReveal>
          <div style={{ display: "flex", flexDirection: "column" }}>
            {VERIFICATION_STEPS.map((step, i) => (
              <ScrollReveal key={step.number} delay={i * 60}>
                <div
                  style={{
                    padding: "20px 0",
                    borderBottom: i < VERIFICATION_STEPS.length - 1 ? "1px solid var(--cs-gray-200)" : "none",
                  }}
                >
                  <div style={{ display: "flex", gap: "16px", alignItems: "start" }}>
                    <span className="cs-mono" style={{ color: "var(--cs-gray-400)", flexShrink: 0 }}>
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
