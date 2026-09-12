import Link from "next/link";
import { Metadata } from "next";
import { buildPageMetadata } from "@/utils/page-metadata";
import { legalContent } from "@/content";
import { Shield, Database, Users, Clock, Cookie, Mail } from "lucide-react";
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = { Shield, Database, Users, Clock, Cookie, Mail };

export const metadata: Metadata = buildPageMetadata({
  title: "Privacy Policy | Budget Ndio Story",
  description:
    "Privacy policy for Budget Ndio Story users and visitors engaging with Kenya budget content, Finance Bill explainers, and civic education resources.",
  path: "/privacy",
});

const sections = (legalContent.privacy.sections as Array<{ icon: string; title: string; content: string[] }>).map(s => ({
  ...s,
  icon: iconMap[s.icon] || Shield,
}));

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
            {legalContent.privacy.title}
          </h1>
          <p className="text-muted-foreground mt-4 text-sm md:text-base">
            Last updated: {legalContent.privacy.lastUpdated}
          </p>
        </div>

        {/* Changelog */}
        <div className="mb-12 p-4 rounded-lg bg-muted/30 border border-border/60 text-sm text-muted-foreground">
          <h3 className="font-semibold text-foreground mb-2">
            Version Changelog
          </h3>
          <ul className="space-y-1 list-disc pl-5">
            {(legalContent.privacy.changelog as Array<{ version: string; changes: string }>).map((entry) => (
              <li key={entry.version}>
                <strong>{entry.version}:</strong> {entry.changes}
              </li>
            ))}
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
