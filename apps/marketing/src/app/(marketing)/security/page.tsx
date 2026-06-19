import React from "react";
import { Metadata } from "next";
import { buildPageMetadata } from "@/utils/page-metadata";
import { Shield, Lock, Key, FileCheck, Eye, Mail } from "lucide-react";

export const metadata: Metadata = buildPageMetadata({
  title: "Security | Budget Ndio Story",
  description:
    "Learn about Budget Ndio Story's security practices — encryption in-transit and at-rest, JWT authentication with refresh rotation, security headers, and vulnerability disclosure policy.",
  path: "/security",
});

const sections = [
  {
    icon: Lock,
    title: "Encryption in Transit",
    description:
      "All data transmitted between your browser and our servers is encrypted using TLS 1.3 (Transport Layer Security). This ensures that no third party can intercept or read your communications with Budget Ndio Story. Our SSL/TLS certificates are managed and auto-renewed through trusted certificate authorities.",
  },
  {
    icon: Key,
    title: "Encryption at Rest",
    description:
      "Sensitive user data stored in our databases is encrypted using AES-256 encryption. Passwords are never stored in plain text — they are hashed using bcrypt with a cost factor of 12. Personal identifiable information (PII) is encrypted at the application layer before being written to the database.",
  },
  {
    icon: Shield,
    title: "Authentication & Session Management",
    description:
      "We use JSON Web Tokens (JWT) for stateless authentication. Access tokens have a short expiry (15 minutes) and are rotated frequently using refresh tokens stored securely in localStorage. Refresh tokens are single-use and rotated on each request to prevent replay attacks. All authentication follows the OWASP best practices for session management.",
  },
  {
    icon: FileCheck,
    title: "Security Headers",
    description:
      "Our platform implements a comprehensive set of security headers to protect against common web vulnerabilities: Content Security Policy (CSP) restricts script and resource origins; HTTP Strict Transport Security (HSTS) enforces HTTPS; X-Content-Type-Options prevents MIME sniffing; X-Frame-Options prevents clickjacking; and Referrer-Policy controls referrer information leakage.",
  },
  {
    icon: Eye,
    title: "Regular Security Audits",
    description:
      "We conduct quarterly security audits and penetration tests on our platform. Our codebase undergoes automated security scanning through GitHub's Dependabot and CodeQL, with weekly dependency vulnerability checks. We also perform manual code reviews for all authentication and payment-related changes.",
  },
  {
    icon: Mail,
    title: "Vulnerability Disclosure Policy",
    description:
      "We welcome responsible disclosure of security vulnerabilities. If you discover a security issue, please email us at security@budgetndiostory.org with details. We commit to acknowledging receipt within 48 hours and will work diligently to address verified vulnerabilities. We ask that you refrain from publicly disclosing vulnerabilities until we have had reasonable time to address them.",
  },
];

export default function SecurityPage() {
  return (
    <section className="relative w-full min-h-screen bg-background overflow-hidden">
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/10 blur-[120px] rounded-full opacity-50" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-teal-500/10 blur-[120px] rounded-full opacity-50" />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 lg:py-24">
        <div className="text-center mb-16">
          <Shield className="size-12 mx-auto mb-6 text-primary" />
          <h1 className="text-3xl md:text-5xl font-bold font-heading tracking-tight mb-4">
            Security
          </h1>
          <p className="text-muted-foreground text-sm md:text-base max-w-2xl mx-auto">
            Budget Ndio Story is committed to protecting your data and privacy.
            Here is how we keep our platform safe and secure.
          </p>
        </div>

        <div className="space-y-10">
          {sections.map((section, index) => (
            <div
              key={index}
              className="p-6 md:p-8 rounded-xl border border-border/60 bg-card"
            >
              <div className="flex items-start gap-4">
                <div className="shrink-0 size-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <section.icon className="size-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-bold font-heading mb-3">
                    {section.title}
                  </h2>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {section.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
