"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, PhoneCall } from "lucide-react";
import {
  LANDING_SECTION_SURFACE,
  LandingContent,
  LandingSection,
  LandingSectionHeader,
} from "@/layouts/landing-section";
import { Button } from "@/components/ui/button";
import { EmailObfuscator } from "@/components/global/email-obfuscator";

export function ProgrammesContactSection() {
  const [intent, setIntent] = useState("partner");

  return (
    <div className={LANDING_SECTION_SURFACE}>
      <LandingSection id="contact" aria-labelledby="contact-heading">
        <LandingSectionHeader
          title={
            <>
              <span className="text-primary">Partner with Budget Ndio Story</span>
            </>
          }
          description="Whether you are a funder, government agency, newsroom, or creator — connect with us to collaborate on civic impact."
          className="mb-10 md:mb-14"
        />
        <LandingContent>
          <div className="mx-auto max-w-2xl rounded-3xl border border-border/60 bg-card p-6 shadow-sm md:p-8">
            <h3 id="contact-heading" className="text-lg font-bold text-foreground">
              Choose your inquiry area
            </h3>
            <p className="mt-1 text-xs text-muted-foreground">
              We route each request to the right programme lead.
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              {[
                { id: "partner", label: "Partnership & Funding" },
                { id: "wanahabari-lab", label: "Wanahabari Lab Application" },
                { id: "commission", label: "Commission BNS Studios" },
                { id: "budget-tracker", label: "Become a Budget Tracker" },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setIntent(item.id)}
                  className={`rounded-xl border px-3.5 py-2 text-xs font-semibold transition-all ${
                    intent === item.id
                      ? "border-primary bg-primary text-primary-foreground shadow-sm"
                      : "border-border/60 bg-muted/30 text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            <div className="mt-6 space-y-4">
              <Button asChild size="lg" className="w-full gap-2 rounded-2xl font-semibold">
                <Link href={`/contact?intent=${intent}`}>
                  <Mail className="size-4" />
                  {intent === "partner"
                    ? "Contact partnerships team"
                    : intent === "commission"
                      ? "Commission BNS Studios"
                      : intent === "wanahabari-lab"
                        ? "Apply for Wanahabari Lab"
                        : "Apply to join tracker network"}
                </Link>
              </Button>
              <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border/40 pt-2 text-xs text-muted-foreground">
                <EmailObfuscator
                  email="info@budgetndiostory.org"
                  showIcon
                  className="flex items-center gap-1.5 transition-colors hover:text-primary"
                />
                <span className="flex items-center gap-1.5">
                  <PhoneCall className="size-3.5 text-primary" />
                  +254 790 631 623
                </span>
              </div>
            </div>
          </div>
        </LandingContent>
      </LandingSection>
    </div>
  );
}
