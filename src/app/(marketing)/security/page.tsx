import React from "react";
import { Metadata } from "next";
import { buildPageMetadata } from "@/utils/page-metadata";
import { legalContent } from "@/content";
import { Shield, Lock, Key, FileCheck, Eye, Mail } from "lucide-react";
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = { Shield, Lock, Key, FileCheck, Eye, Mail };

export const metadata: Metadata = buildPageMetadata({
  title: "Security | Budget Ndio Story",
  description:
    "Learn about Budget Ndio Story's security practices — encryption in-transit and at-rest, JWT authentication with refresh rotation, security headers, and vulnerability disclosure policy.",
  path: "/security",
});

const sections = (legalContent.security.sections as Array<{ icon: string; title: string; description: string }>).map(s => ({
  ...s,
  icon: iconMap[s.icon] || Shield,
}));

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
            {legalContent.security.title}
          </h1>
          <p className="text-muted-foreground text-sm md:text-base max-w-2xl mx-auto">
            {legalContent.security.description}
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
