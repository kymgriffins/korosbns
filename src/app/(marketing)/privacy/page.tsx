import Link from "next/link";
import { Metadata } from "next";
import { buildPageMetadata } from "@/utils/page-metadata";
import { Shield, Database, Users, Clock, Cookie, Mail } from "lucide-react";

export const metadata: Metadata = buildPageMetadata({
  title: "Privacy Policy | Budget Ndio Story",
  description:
    "Privacy policy for Budget Ndio Story users and visitors engaging with Kenya budget content, Finance Bill explainers, and civic education resources.",
  path: "/privacy",
});

const sections = [
  {
    icon: Database,
    title: "Data We Collect",
    content: [
      "Account information: name, email address, phone number (optional), and display name when you register or subscribe",
      "Demographic data: county, ward, language preference, and education level to tailor content and improve local relevance",
      "Engagement data: learning progress, quiz scores, survey responses, bookmarks, and forum participation",
      "Technical data: browser type, device information, IP address, and usage patterns via analytics tools",
      "Communications: correspondence when you contact us via the contact form or directly via email",
    ],
  },
  {
    icon: Users,
    title: "How We Use Your Data",
    content: [
      "To provide and personalize our civic education content and learning modules",
      "To send you budget alerts, public participation notifications, and newsletter updates (with your consent)",
      "To improve our platform, content, and user experience through analytics",
      "To administer leaderboards, gamification features, and certificates (anonymized where possible)",
      "To comply with legal obligations under Kenya's Data Protection Act, 2019",
    ],
  },
  {
    icon: Clock,
    title: "Data Retention",
    content: [
      "Account data: retained for the duration of your active account plus 12 months after deletion for audit purposes",
      "Engagement data: retained for 3 years to track learning progress and program impact",
      "Analytics data: aggregated data retained indefinitely; individual session data retained for 26 months",
      "Newsletter subscriptions: retained until you unsubscribe or request deletion",
      "You may request earlier deletion of your data at any time by contacting our DPO",
    ],
  },
  {
    icon: Shield,
    title: "Your Rights (Under Kenya DPA 2019)",
    content: [
      "Right to be informed about the collection and use of your personal data",
      "Right of access to personal data we hold about you",
      "Right to rectification of inaccurate or incomplete data",
      "Right to erasure (right to be forgotten) — request deletion of your data",
      "Right to restrict processing of your data",
      "Right to data portability — receive your data in a structured, machine-readable format",
      "Right to object to processing of your data for direct marketing",
      "To exercise any of these rights, contact our Data Protection Officer at info@budgetndiostory.org",
    ],
  },
  {
    icon: Cookie,
    title: "Cookie Policy",
    content: [
      "Essential cookies: required for platform functionality, authentication, and security",
      "Analytics cookies: used to understand site usage (you can opt out via browser settings)",
      "Preference cookies: remember your language and display preferences",
      "We do not use third-party advertising cookies or tracking scripts for marketing purposes",
      "You can manage cookie preferences through your browser settings at any time",
    ],
  },
  {
    icon: Mail,
    title: "Contact Our Data Protection Officer",
    content: [
      "Email: info@budgetndiostory.org",
      "Phone: +254 700 000 000 (Weekdays, 9 AM - 5 PM EAT)",
      "Physical address: Budget Ndio Story, Nairobi, Kenya",
      "Response time: We aim to respond to all privacy inquiries within 72 hours",
    ],
  },
];

export default function PrivacyPage() {
  return (
    <section className="relative w-full min-h-screen bg-background overflow-hidden">
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/10 blur-[120px] rounded-full opacity-50" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-teal-500/10 blur-[120px] rounded-full opacity-50" />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 lg:py-24">
        <div className="text-center mb-12">
          <Shield className="size-12 mx-auto mb-6 text-primary" />
          <h1 className="text-3xl md:text-5xl font-bold font-heading tracking-tight">
            Privacy Policy
          </h1>
          <p className="text-muted-foreground mt-4 text-sm md:text-base">
            Last updated: June 2026
          </p>
        </div>

        {/* Changelog */}
        <div className="mb-12 p-4 rounded-lg bg-muted/30 border border-border/60 text-sm text-muted-foreground">
          <h3 className="font-semibold text-foreground mb-2">
            Version Changelog
          </h3>
          <ul className="space-y-1 list-disc pl-5">
            <li>
              <strong>June 2026:</strong> Updated to include education level data
              collection, expanded retention periods, and DPO contact details.
            </li>
            <li>
              <strong>April 2026:</strong> Initial privacy policy published.
            </li>
          </ul>
        </div>

        <div className="space-y-8">
          {sections.map((section, index) => (
            <div
              key={index}
              className="p-6 md:p-8 rounded-xl border border-border/60 bg-card"
            >
              <div className="flex items-start gap-4">
                <div className="shrink-0 size-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <section.icon className="size-5 text-primary" />
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-bold font-heading mb-3">
                    {section.title}
                  </h2>
                  <ul className="space-y-2">
                    {section.content.map((item, i) => (
                      <li
                        key={i}
                        className="text-sm text-muted-foreground flex items-start gap-2"
                      >
                        <span className="text-primary mt-1.5 shrink-0">
                          &bull;
                        </span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 pt-8 border-t border-foreground/10 text-center">
          <Link
            href="/"
            className="text-primary hover:underline text-sm inline-flex items-center gap-1"
          >
            &larr; Back to home
          </Link>
        </div>
      </div>
    </section>
  );
}
