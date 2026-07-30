"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, Send, CheckCircle2, Sparkles, PhoneCall } from "lucide-react";
import { LANDING_SECTION_SURFACE, LandingContent, LandingSection, LandingSectionHeader } from "@/layouts/landing-section";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export function ProgrammesContactSection() {
  const [email, setEmail] = useState("");
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [intent, setIntent] = useState("partner");
  const [submittedNewsletter, setSubmittedNewsletter] = useState(false);

  function handleNewsletterSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!newsletterEmail) return;
    setSubmittedNewsletter(true);
    toast.success("Subscribed! You will receive our weekly budget explainers.");
  }

  return (
    <div className={LANDING_SECTION_SURFACE}>
      <LandingSection id="contact-and-newsletter" aria-labelledby="contact-heading">
        <LandingSectionHeader
          title={
            <>
              <span className="text-primary">Partner with Budget Ndio Story.</span> Get in touch.
            </>
          }
          description="Whether you are a funder seeking measurable civic impact, a government agency fulfilling public participation mandates, a newsroom building journalism capacity, or a creator following public money — connect with us to collaborate."
          className="mb-10 md:mb-14"
        />
        <LandingContent>
          <div className="grid gap-8 md:grid-cols-12">
            {/* Contact Form & Routing Panel */}
            <div className="rounded-3xl border border-border/60 bg-card p-6 shadow-sm md:col-span-7 md:p-8">
              <h3 id="contact-heading" className="text-xl font-bold text-foreground">
                Get in Touch to Partner
              </h3>
              <p className="mt-1 text-xs text-muted-foreground">
                Select your inquiry area below to connect directly with our programme leads.
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
                <Button asChild size="lg" className="w-full rounded-2xl gap-2 font-semibold">
                  <Link href={`/contact?intent=${intent}`}>
                    <Mail className="size-4" />
                    {intent === "partner"
                      ? "Get in Touch to Partner"
                      : intent === "commission"
                      ? "Commission BNS Studios"
                      : intent === "wanahabari-lab"
                      ? "Apply for Wanahabari Lab"
                      : "Apply to Join Tracker Network"}
                  </Link>
                </Button>
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground pt-2 border-t border-border/40">
                  <span className="flex items-center gap-1.5">
                    <Mail className="size-3.5 text-primary" />
                    info@budgetndiostory.org
                  </span>
                  <span className="flex items-center gap-1.5">
                    <PhoneCall className="size-3.5 text-primary" />
                    +254 790 631 623
                  </span>
                </div>
              </div>
            </div>

            {/* Newsletter Subscription Box */}
            <div className="flex flex-col justify-between rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/10 via-card to-card p-6 shadow-sm md:col-span-5 md:p-8">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/15 px-3 py-1 text-xs font-semibold text-primary mb-3">
                  <Sparkles className="size-3.5" />
                  <span>Stay Informed</span>
                </div>
                <h3 className="text-xl font-bold text-foreground">
                  Budget Stories in Your Inbox
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                  Subscribe to receive snackable budget explainers, county scorecards, and media opportunities every week.
                </p>
              </div>

              {submittedNewsletter ? (
                <div className="mt-6 rounded-2xl border border-primary/30 bg-primary/10 p-4 text-center">
                  <CheckCircle2 className="size-8 mx-auto text-primary mb-2" />
                  <h4 className="text-sm font-bold text-foreground">You're Subscribed!</h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    Check your inbox for our latest budget tracking briefs.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleNewsletterSubmit} className="mt-6 space-y-3">
                  <Input
                    type="email"
                    required
                    placeholder="Enter your email address..."
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    className="bg-card border-border/80 rounded-xl"
                  />
                  <Button type="submit" className="w-full rounded-xl gap-2 font-semibold">
                    <Send className="size-4" />
                    Subscribe to BNS Newsletter
                  </Button>
                  <p className="text-[10px] text-center text-muted-foreground">
                    No spam. Unsubscribe anytime in one click.
                  </p>
                </form>
              )}
            </div>
          </div>
        </LandingContent>
      </LandingSection>
    </div>
  );
}
