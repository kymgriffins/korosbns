"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, ExternalLink, Loader2, Calendar, MapPin, Send, Mail, CheckCircle2, Building2 } from "lucide-react";
import Wrapper from "@/components/global/wrapper";
import { HERO_SECTION_PADDING } from "@/layouts/section-shell";
import { Routes } from "@/constants/routes";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { motion } from "motion/react";
import { useEvent } from "@/hooks/use-events";
import { formatInNairobi } from "@/lib/datetime";
import { sanitizeHtml, stripHtml } from "@/lib/sanitize";
import { cn } from "@/utils";

export default function EventDetailPage() {
  const params = useParams();
  const id = String(params.id || "");
  const { data: event, isLoading, error } = useEvent(id);
  
  // Community Email Form State
  const [email, setEmail] = useState("");
  const [submittingEmail, setSubmittingEmail] = useState(false);
  const [emailRegistered, setEmailRegistered] = useState(false);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      toast.error("Please enter a valid email address.");
      return;
    }

    setSubmittingEmail(true);
    // Simulate API registration call
    try {
      await new Promise((resolve) => setTimeout(resolve, 1200));
      setEmailRegistered(true);
      toast.success("Successfully joined the attendee community hub!");
      setEmail("");
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setSubmittingEmail(false);
    }
  };

  return (
    <Wrapper className={cn(HERO_SECTION_PADDING, "relative min-h-screen")}>
      {/* Background decorations */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 pointer-events-none">
        <div className="absolute top-20 left-1/4 size-[30rem] bg-primary/5 rounded-full blur-[10rem] opacity-70" />
        <div className="absolute top-40 right-1/4 size-[25rem] bg-blue-500/5 rounded-full blur-[10rem] opacity-40" />
      </div>

      <div className="max-w-5xl mx-auto relative z-10">
        <Link
          href={Routes.Events}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors group"
        >
          <ArrowLeft className="size-4 group-hover:-translate-x-1 transition-transform" />
          Back to all events
        </Link>

        {isLoading && (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <Loader2 className="size-10 animate-spin text-primary" />
            <p className="text-muted-foreground text-sm">Loading event details...</p>
          </div>
        )}

        {error && (
          <div className="p-4 rounded-xl border border-destructive/20 bg-destructive/5 text-destructive text-center">
            {error?.message ?? "An error occurred"}
          </div>
        )}

        {event && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Event Body Content */}
            <div className="lg:col-span-8 space-y-8">
              {event.image_url && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4 }}
                  className="relative w-full h-72 sm:h-80 overflow-hidden rounded-2xl bg-muted border border-border/40 shadow-sm"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={event.image_url}
                    alt={event.title}
                    className="w-full h-full object-cover object-center sm:object-top"
                  />
                </motion.div>
              )}

              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <Badge variant="default" className="text-xs font-semibold uppercase px-2.5 py-0.5 tracking-wider">
                    Event details
                  </Badge>
                  {event.starts_at && (
                    <Badge variant="outline" className="text-xs font-semibold px-2.5 py-0.5 border-primary/20 text-primary">
                      {new Date(event.starts_at) > new Date() ? "Upcoming" : "Past"}
                    </Badge>
                  )}
                </div>

                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight mt-2 leading-tight">
                  {event.title}
                </h1>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 p-5 rounded-2xl border border-border/80 bg-card">
                  {event.starts_at && (
                    <div className="flex gap-3 items-start">
                      <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0 border border-primary/20">
                        <Calendar className="size-5" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground font-medium">DATE & TIME</p>
                        <p className="text-sm font-semibold mt-0.5">{formatInNairobi(event.starts_at)}</p>
                      </div>
                    </div>
                  )}

                  {event.location && (
                    <div className="flex gap-3 items-start">
                      <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0 border border-primary/20">
                        <MapPin className="size-5" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground font-medium">LOCATION</p>
                        <p className="text-sm font-semibold mt-0.5">{event.location}</p>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="prose dark:prose-invert max-w-none border-t border-border/60 pt-8"
              >
                {event.body_html ? (
                  <div
                    className="notion-content-wrapper"
                    dangerouslySetInnerHTML={{ __html: sanitizeHtml(event.body_html) }}
                  />
                ) : (
                  <div className="whitespace-pre-wrap leading-relaxed text-muted-foreground">
                    {stripHtml(event.body || event.snippet)}
                  </div>
                )}
              </motion.div>
            </div>

            {/* Right Column: Sidebar (Sponsors & Community Connect) */}
            <div className="lg:col-span-4 space-y-6">
              {/* Community Connect Form */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                className="rounded-2xl border border-border/80 bg-card p-6 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-linear-to-bl from-primary/5 to-transparent -z-10" />
                
                <div className="flex items-center gap-3 mb-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="https://res.cloudinary.com/dn8lut2fc/image/upload/v1779284830/logo_d9hbsp.svg"
                    alt="Budget Ndio Story"
                    className="h-8 object-contain"
                  />
                  <div className="h-6 w-px bg-border/80" />
                  <span className="text-xs font-bold uppercase tracking-wider text-primary">Community Hub</span>
                </div>
                
                <p className="text-xs text-muted-foreground leading-relaxed mb-4">
                  Identify yourself in the photos or just attended? Enter your email to connect with fellow citizens and receive shared event updates.
                </p>

                {emailRegistered ? (
                  <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 text-center">
                    <CheckCircle2 className="size-8 text-primary mx-auto mb-2" />
                    <p className="text-sm font-semibold text-primary">You are Connected!</p>
                    <p className="text-xs text-muted-foreground mt-1">We'll alert you as soon as new photos or community boards are available.</p>
                  </div>
                ) : (
                  <form onSubmit={handleEmailSubmit} className="space-y-3">
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                      <Input
                        type="email"
                        required
                        placeholder="yourname@domain.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-9 bg-cardbox/60 rounded-xl"
                      />
                    </div>
                    <Button
                      type="submit"
                      disabled={submittingEmail}
                      className="w-full rounded-xl flex items-center justify-center gap-2"
                    >
                      {submittingEmail ? (
                        <Loader2 className="size-4 animate-spin" />
                      ) : (
                        <>
                          <span>Join Hub</span>
                          <Send className="size-4" />
                        </>
                      )}
                    </Button>
                  </form>
                )}
              </motion.div>



              {/* Sponsors Section */}
              {event.sponsors && event.sponsors.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.3 }}
                  className="rounded-2xl border border-border/80 bg-card p-6 space-y-4"
                >
                  <h3 className="text-lg font-bold flex items-center gap-2 mb-2">
                    <Building2 className="size-5 text-primary" />
                    Sponsored By
                  </h3>

                  {event.sponsors.map((sponsor, idx) => (
                    <div key={idx} className="space-y-3 p-4 rounded-xl border border-border/60 bg-cardbox/50">
                      <div className="flex items-center gap-3">
                        {sponsor.logo_url ? (
                          <div className="relative size-12 rounded-lg bg-white p-1 flex items-center justify-center shrink-0 border border-border overflow-hidden">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={sponsor.logo_url}
                              alt={sponsor.name}
                              className="object-contain size-full"
                            />
                          </div>
                        ) : (
                          <div className="size-12 rounded-lg bg-muted flex items-center justify-center text-muted-foreground shrink-0">
                            <Building2 className="size-6" />
                          </div>
                        )}
                        <div>
                          <h4 className="text-sm font-bold truncate max-w-[160px]">{sponsor.name}</h4>
                          {sponsor.tier && (
                            <Badge variant="secondary" className="text-[10px] uppercase font-semibold px-2 mt-0.5">
                              {sponsor.tier}
                            </Badge>
                          )}
                        </div>
                      </div>

                      {sponsor.description && (
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          {sponsor.description}
                        </p>
                      )}

                      {sponsor.website_url && (
                        <a
                          href={sponsor.website_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs text-primary font-semibold hover:underline"
                        >
                          Visit Sponsor Website
                          <ExternalLink className="size-3" />
                        </a>
                      )}
                    </div>
                  ))}
                </motion.div>
              )}
            </div>
          </div>
        )}
      </div>
    </Wrapper>
  );
}
