import type { Metadata } from "next";
import Link from "next/link";
import { ScrollReveal } from "@/components/clean-slate/scroll-reveal";
import {
  getStudioProjects,
  getContentTypeCounts,
  getAllOrganizations,
} from "@/data/marketing";
import { BNS_STUDIO_PORTFOLIO_IMAGES } from "@/constants/bns-media-images";

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

export default function StudioPage() {
  const studioProjects = getStudioProjects();
  const typeCounts = getContentTypeCounts();
  const orgs = getAllOrganizations();
  const portfolio = BNS_STUDIO_PORTFOLIO_IMAGES;

  return (
    <>
      {/* Hero — dark background */}
      <section
        className="cs-hero"
        style={{
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
              style={{ marginTop: "12px", color: "var(--cs-gray-400)", maxWidth: "40ch", fontSize: "clamp(1rem, 2.5vw, 1.125rem)" }}
            >
              Evidence Production
            </p>
          </ScrollReveal>
          <ScrollReveal delay={120}>
            <div style={{ marginTop: "24px", display: "flex", gap: "32px", flexWrap: "wrap" }}>
              <div>
                <div className="cs-stat-number" style={{ color: "var(--cs-white)" }}>
                  {studioProjects.length}
                </div>
                <div className="cs-stat-label">Productions</div>
              </div>
              <div>
                <div className="cs-stat-number" style={{ color: "var(--cs-white)" }}>
                  {orgs.length}
                </div>
                <div className="cs-stat-label">Partners</div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Services — dark bento */}
      <section style={{ background: "var(--cs-black)", color: "var(--cs-white)", padding: "var(--cs-section-y) 0", borderBottom: "1px solid var(--cs-gray-600)" }}>
        <div className="cs-container">
          <ScrollReveal>
            <h2 className="cs-headline" style={{ color: "var(--cs-white)", marginBottom: "32px" }}>
              What We Produce
            </h2>
          </ScrollReveal>
          <div className="cs-services-grid">
            {SERVICES.map((service, i) => (
              <ScrollReveal key={service.title} delay={i * 80}>
                <div style={{ background: "var(--cs-black)", padding: "24px" }}>
                  <h3 style={{ fontWeight: 600, fontSize: "0.9375rem", marginBottom: "8px" }}>
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
            <h2 className="cs-headline" style={{ marginBottom: "32px" }}>
              Selected Work
            </h2>
          </ScrollReveal>
          <div className="cs-hscroll">
            {portfolio.map((item, i) => (
              <ScrollReveal key={item.id} delay={i * 60}>
                <div style={{ width: "320px" }}>
                  <div className="cs-aspect-16/9 cs-image-wrap" style={{ marginBottom: "12px" }}>
                    <img src={item.image_url} alt={item.title} className="cs-image" />
                  </div>
                  <p style={{ fontWeight: 500, fontSize: "0.875rem" }}>{item.title}</p>
                  <p className="cs-body" style={{ color: "var(--cs-gray-600)", fontSize: "0.8125rem", marginTop: "4px" }}>
                    {item.category}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Projects */}
      {studioProjects.length > 0 && (
        <section className="cs-section cs-section-muted">
          <div className="cs-container">
            <ScrollReveal>
              <h2 className="cs-headline" style={{ marginBottom: "32px" }}>
                Recent Productions
              </h2>
            </ScrollReveal>
            <div className="cs-grid-3">
              {studioProjects.slice(0, 6).map((project, i) => (
                <ScrollReveal key={project.id} delay={i * 80}>
                  <Link
                    href={`/bns-studio/${project.slug}`}
                    className="cs-project-card"
                    style={{ display: "block" }}
                  >
                    <div className="cs-aspect-16/9 cs-image-wrap" style={{ marginBottom: "12px" }}>
                      <img
                        src={project.media?.posterUrl || "/images/hall/129A4248.jpg"}
                        alt={project.title}
                        className="cs-image"
                      />
                    </div>
                    <h3 className="cs-headline cs-project-card-title" style={{ fontSize: "1rem" }}>
                      {project.title}
                    </h3>
                    <p className="cs-body" style={{ marginTop: "4px", color: "var(--cs-gray-600)", fontSize: "0.875rem" }}>
                      {project.organization?.name}
                    </p>
                  </Link>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>
      )}

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
