import type { Metadata } from "next";
import Link from "next/link";
import { ScrollReveal } from "@/components/clean-slate/scroll-reveal";

export const metadata: Metadata = {
  title: "Contact | Budget Ndio Story",
  description:
    "Get in touch with the Budget Ndio Story investigations desk. Submit tips, partnerships, or inquiries.",
  alternates: { canonical: "https://budgetndiostory.org/contact" },
};

export default function ContactPage() {
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
            <h1 className="cs-display">Contact</h1>
          </ScrollReveal>
          <ScrollReveal delay={80}>
            <p
              className="cs-body"
              style={{ marginTop: "16px", color: "var(--cs-gray-600)", maxWidth: "50ch" }}
            >
              Investigation tip-offs, partnerships, and inquiries.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Form + Info */}
      <section className="cs-section cs-section-muted">
        <div className="cs-container">
          <div style={{ display: "grid", gridTemplateColumns: "7fr 5fr", gap: "48px" }}>
            {/* Form */}
            <ScrollReveal>
              <form
                onSubmit={(e) => e.preventDefault()}
                style={{ display: "flex", flexDirection: "column", gap: "20px" }}
              >
                <div>
                  <label className="cs-label" style={{ display: "block", marginBottom: "8px", color: "var(--cs-gray-600)" }}>
                    Name
                  </label>
                  <input type="text" className="cs-input" placeholder="Your name" />
                </div>
                <div>
                  <label className="cs-label" style={{ display: "block", marginBottom: "8px", color: "var(--cs-gray-600)" }}>
                    Email
                  </label>
                  <input type="email" className="cs-input" placeholder="you@example.com" />
                </div>
                <div>
                  <label className="cs-label" style={{ display: "block", marginBottom: "8px", color: "var(--cs-gray-600)" }}>
                    Subject
                  </label>
                  <select className="cs-select">
                    <option value="">Select a subject</option>
                    <option value="tip-off">Investigation Tip-Off</option>
                    <option value="partnership">Partnership Inquiry</option>
                    <option value="media">Media Request</option>
                    <option value="general">General Question</option>
                  </select>
                </div>
                <div>
                  <label className="cs-label" style={{ display: "block", marginBottom: "8px", color: "var(--cs-gray-600)" }}>
                    Message
                  </label>
                  <textarea className="cs-textarea" placeholder="Your message" />
                </div>
                <button type="submit" className="cs-btn cs-btn-primary" style={{ alignSelf: "flex-start" }}>
                  Send Message
                </button>
              </form>
            </ScrollReveal>

            {/* Info */}
            <ScrollReveal delay={100}>
              <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
                <div>
                  <p className="cs-label" style={{ color: "var(--cs-gray-400)", marginBottom: "8px" }}>
                    Email
                  </p>
                  <a href="mailto:tips@budgetndiostory.org" className="cs-link" style={{ fontSize: "1rem" }}>
                    tips@budgetndiostory.org
                  </a>
                </div>
                <div>
                  <p className="cs-label" style={{ color: "var(--cs-gray-400)", marginBottom: "8px" }}>
                    Location
                  </p>
                  <p className="cs-body">Nairobi, Kenya</p>
                </div>
                <div>
                  <p className="cs-label" style={{ color: "var(--cs-gray-400)", marginBottom: "8px" }}>
                    Anonymous Tip-Offs
                  </p>
                  <p className="cs-body" style={{ color: "var(--cs-gray-600)" }}>
                    All tip-offs can be submitted anonymously. We do not trace or share source information.
                  </p>
                </div>
                <div>
                  <p className="cs-label" style={{ color: "var(--cs-gray-400)", marginBottom: "8px" }}>
                    Social
                  </p>
                  <div style={{ display: "flex", gap: "16px" }}>
                    <a href="https://twitter.com/budgetndiostory" className="cs-link" target="_blank" rel="noopener noreferrer">
                      Twitter
                    </a>
                    <a href="https://facebook.com/budgetndiostory" className="cs-link" target="_blank" rel="noopener noreferrer">
                      Facebook
                    </a>
                    <a href="https://youtube.com/@budgetndiostory" className="cs-link" target="_blank" rel="noopener noreferrer">
                      YouTube
                    </a>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>
    </>
  );
}
