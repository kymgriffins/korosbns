import type { Metadata } from "next";
import Link from "next/link";
import { ScrollReveal } from "@/components/clean-slate/scroll-reveal";
import {
  getProjectsByProgramme,
  getCommunityImages,
} from "@/data/marketing";

export const metadata: Metadata = {
  title: "Wanahabari Lab | Investigative Journalism Training",
  description:
    "Equipping grassroots reporters and community radios with forensic data toolkits to investigate public procurement.",
  alternates: { canonical: "https://budgetndiostory.org/programmes/wanahabari-lab" },
};

const TRAINING_AREAS = [
  {
    label: "CIDP Decoding",
    description: "Reading and interpreting County Integrated Development Plans to identify misallocated funds.",
  },
  {
    label: "Procurement Forensics",
    description: "Tracing public procurement from tender to delivery, matching vouchers against physical works.",
  },
  {
    label: "Data Journalism",
    description: "Using spreadsheets, databases, and visual tools to turn raw budget data into publishable stories.",
  },
  {
    label: "Interview Technique",
    description: "Questioning local officials with receipts, evidence, and documented facts.",
  },
  {
    label: "Broadcast Production",
    description: "Producing radio and video segments that communicate budget findings to community audiences.",
  },
];

export default function WanahabariPage() {
  const projects = getProjectsByProgramme("wanahabari-lab");
  const images = getCommunityImages();

  return (
    <>
      {/* Hero */}
      <section
        className="cs-section"
        style={{ borderBottom: "2px solid var(--cs-black)", paddingBottom: "32px" }}
      >
        <div className="cs-container">
          <ScrollReveal>
            <h1 className="cs-display">Wanahabari Lab</h1>
          </ScrollReveal>
          <ScrollReveal delay={80}>
            <p
              className="cs-body"
              style={{ marginTop: "12px", color: "var(--cs-gray-600)", maxWidth: "45ch" }}
            >
              Forensic Journalism Training
            </p>
          </ScrollReveal>
          <ScrollReveal delay={120}>
            <div style={{ marginTop: "24px", display: "flex", gap: "32px", flexWrap: "wrap" }}>
              <div>
                <div className="cs-stat-number">{projects.length}</div>
                <div className="cs-stat-label">Investigations</div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Mission — editorial 2-col */}
      <section className="cs-section cs-section-muted">
        <div className="cs-container">
          <div className="cs-editorial-2col">
            <ScrollReveal>
              <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                <p className="cs-body" style={{ maxWidth: "65ch" }}>
                  Community radios in Kenya reach millions of citizens who never read a newspaper or open a budget document.
                  Wanahabari Lab trains grassroots journalists to decode County Integrated Development Plans,
                  interview local officials with receipts, and produce broadcast segments that make budget findings
                  accessible to their audiences.
                </p>
                <p className="cs-body" style={{ maxWidth: "65ch" }}>
                  Each cohort graduates with a forensic data toolkit, a published investigation, and a network
                  of editors across 12 counties. The programme is designed for reporters who work in Sheng,
                  Kiswahili, and local languages, not just English.
                </p>
                <p className="cs-body" style={{ maxWidth: "65ch" }}>
                  Since launch, Wanahabari Lab fellows have published investigations covering
                  county health budgets, bursary allocations, and infrastructure spending. Their work
                  has been cited by parliamentary committees and national media outlets.
                </p>
              </div>
            </ScrollReveal>
            <ScrollReveal delay={150}>
              <div className="cs-aspect-3/4 cs-image-wrap">
                <img
                  src={images.cohortA}
                  alt="Journalist reviewing budget documents"
                  className="cs-image"
                  style={{ filter: "grayscale(1)" }}
                />
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Impact Numbers */}
      <section className="cs-section">
        <div className="cs-container">
          <div className="cs-stats-row">
            {[
              { number: String(projects.length || 120), label: "Stories Published" },
              { number: "45", label: "Journalists Trained" },
              { number: "28", label: "Community Radios" },
              { number: "12", label: "Counties Reached" },
            ].map((item, i) => (
              <ScrollReveal key={item.label} delay={i * 60} style={{ padding: "24px" }}>
                <div className="cs-stat-number">{item.number}</div>
                <div className="cs-stat-label" style={{ marginTop: "8px" }}>{item.label}</div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Training Areas */}
      <section className="cs-section cs-section-muted">
        <div className="cs-container">
          <ScrollReveal>
            <h2 className="cs-headline" style={{ marginBottom: "32px" }}>
              Training Areas
            </h2>
          </ScrollReveal>
          <div style={{ display: "flex", flexDirection: "column" }}>
            {TRAINING_AREAS.map((area, i) => (
              <ScrollReveal key={area.label} delay={i * 60}>
                <div
                  style={{
                    padding: "20px 0",
                    borderBottom: i < TRAINING_AREAS.length - 1 ? "1px solid var(--cs-gray-200)" : "none",
                  }}
                >
                  <p style={{ fontWeight: 600, fontSize: "0.9375rem", marginBottom: "8px" }}>
                    {area.label}
                  </p>
                  <p className="cs-body" style={{ color: "var(--cs-gray-600)", maxWidth: "55ch" }}>
                    {area.description}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Published Investigations */}
      {projects.length > 0 && (
        <section className="cs-section">
          <div className="cs-container">
            <ScrollReveal>
              <h2 className="cs-headline" style={{ marginBottom: "32px" }}>
                Published Work
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

      {/* Featured Investigation — full-bleed */}
      <section style={{ position: "relative", minHeight: "60dvh", overflow: "hidden" }}>
        <img
          src={images.forumD}
          alt="Investigation field work"
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
            justifyContent: "flex-end",
            padding: "48px 0",
          }}
        >
          <div className="cs-container">
            <ScrollReveal>
              <p className="cs-label" style={{ color: "rgba(255,255,255,0.6)", marginBottom: "8px" }}>
                Featured Investigation
              </p>
              <h2 className="cs-display" style={{ color: "var(--cs-white)", maxWidth: "16ch" }}>
                Disbursed Yet Unfinished Clinics
              </h2>
              <p
                className="cs-body"
                style={{ marginTop: "12px", color: "rgba(255,255,255,0.7)", maxWidth: "50ch" }}
              >
                Our grassroots auditors surveyed maternal wards in Nakuru, Kisumu, and Mombasa
                to match bank debit transfers against actual roofing sheets.
              </p>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cs-section cs-section-dark">
        <div className="cs-container">
          <ScrollReveal>
            <h2 className="cs-display" style={{ color: "var(--cs-white)", maxWidth: "10ch" }}>
              Join the Lab
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={100}>
            <Link href="/contact" className="cs-btn cs-btn-primary" style={{ marginTop: "24px" }}>
              Apply Now
            </Link>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
