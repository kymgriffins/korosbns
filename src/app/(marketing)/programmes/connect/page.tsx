import type { Metadata } from "next";
import Link from "next/link";
import { ScrollReveal } from "@/components/clean-slate/scroll-reveal";
import {
  getProjectsByProgramme,
  getImpactStats,
  getCommunityImages,
} from "@/data/marketing";

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

export default function BNSConnectPage() {
  const projects = getProjectsByProgramme("connect");
  const stats = getImpactStats();
  const images = getCommunityImages();

  return (
    <>
      {/* Hero — blue background */}
      <section
        className="cs-hero"
        style={{
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
              style={{ marginTop: "12px", color: "rgba(255,255,255,0.8)", maxWidth: "40ch", fontSize: "clamp(1rem, 2.5vw, 1.125rem)" }}
            >
              National Budget Intelligence
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Key Figures */}
      <section className="cs-section">
        <div className="cs-container">
          <div className="cs-stats-row">
            {[
              { number: String(projects.length || 23), label: "Projects Tracked" },
              { number: String(stats.productionCount || 55), label: "Productions" },
              { number: String(stats.partnerCount || 8), label: "Partner Organisations" },
            ].map((item, i) => (
              <ScrollReveal key={item.label} delay={i * 60} style={{ padding: "24px" }}>
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
          <div className="cs-editorial-2col">
            <ScrollReveal>
              <div style={{ display: "flex", flexDirection: "column" }}>
                {TRACKING_AREAS.map((area, i) => (
                  <div
                    key={area.label}
                    style={{
                      padding: "20px 0",
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
              <div className="cs-aspect-4/3 cs-image-wrap">
                <img
                  src={images.forumA}
                  alt="Kenya budget data visualization"
                  className="cs-image"
                />
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Project Evidence */}
      {projects.length > 0 && (
        <section className="cs-section">
          <div className="cs-container">
            <ScrollReveal>
              <h2 className="cs-headline" style={{ marginBottom: "32px" }}>
                Evidence
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
