"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Briefcase,
  ArrowRight,
  CheckCircle2,
  Users,
  Mic,
  Video,
  PenTool,
  Code,
  MapPin,
  Clock,
  Send,
  Heart,
  Globe,
  Award,
  Zap,
  ChevronRight,
  Share2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LANDING_TYPOGRAPHY as T } from "@/constants/landing-typography";
import { HERO_SECTION_PADDING, SECTION_SHELL_INNER, SECTION_SHELL_PADDING } from "@/layouts/section-shell";
import { GsapHeroChoreography } from "@/motion/gsap";
import { cn } from "@/utils";
import SectionBadge from "@/components/ui/section-badge";
import { careersContent } from "@/content";

const cultureIconMap: Record<string, React.ComponentType<{ className?: string }>> = { Globe, Zap, Users, Award };

type Department = "All" | "Media & Audio" | "Visual & Video" | "Research & Editorial" | "Creative Tech" | "Grassroots Outreach";

interface JobRole {
  id: string;
  title: string;
  department: Department;
  location: string;
  type: string;
  tagline: string;
  description: string;
  responsibilities: string[];
  requirements: string[];
  isFeatured?: boolean;
}

const OPEN_ROLES = careersContent.openRoles as JobRole[];

const CULTURE_PILLARS = careersContent.culturePillars;

export function CareersLanding() {
  const [selectedDept, setSelectedDept] = useState<Department>("All");
  const [selectedRole, setSelectedRole] = useState<JobRole | null>(null);

  const departments: Department[] = [
    "All",
    "Media & Audio",
    "Visual & Video",
    "Research & Editorial",
    "Creative Tech",
    "Grassroots Outreach",
  ];

  const filteredRoles = useMemo(() => {
    if (selectedDept === "All") return OPEN_ROLES;
    return OPEN_ROLES.filter((r) => r.department === selectedDept);
  }, [selectedDept]);

  return (
    <div className="w-full bg-background min-h-screen">
      {/* Hero Banner */}
      <section className={cn(HERO_SECTION_PADDING, "relative overflow-hidden border-b border-border/60 bg-muted/20")}>
        <div className={cn(SECTION_SHELL_INNER, "relative z-10")}>
          <GsapHeroChoreography className="mx-auto max-w-3xl space-y-6 text-center">
            <span
              data-gsap-hero-content
              className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-bold text-primary"
            >
              <Zap className="size-3.5" />
              {careersContent.hero.badge}
            </span>

            <h1
              data-gsap-hero-content
              className={cn(T.heroTitle, "text-balance text-foreground")}
            >
              {careersContent.hero.title}
            </h1>

            <p data-gsap-hero-content className={cn(T.lead, "text-foreground/75")}>
              {careersContent.hero.description}
            </p>

            <div data-gsap-hero-content className="flex flex-wrap items-center justify-center gap-3 pt-4">
              <Button asChild size="lg" className="gap-2 font-bold shadow-md">
                <a href="#open-roles">
                  <span>Explore Open Positions</span>
                  <ArrowRight className="size-4" />
                </a>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/about">
                  <span>About Our Mission</span>
                </Link>
              </Button>
            </div>
          </GsapHeroChoreography>
        </div>
      </section>

      {/* Why Work With Us */}
      <section className="py-16 lg:py-24 border-b border-border/40 bg-muted/20">
        <div className={SECTION_SHELL_INNER}>
          <div className="max-w-3xl mx-auto text-center mb-12 lg:mb-16 space-y-3">
            <SectionBadge title="Why Join BNS" />
            <h2 className="text-3xl md:text-4xl font-bold font-heading text-foreground tracking-tight">
              {careersContent.whyJoinSection.title}
            </h2>
            <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
              {careersContent.whyJoinSection.description}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {CULTURE_PILLARS.map((pillar, idx) => {
              const Icon = cultureIconMap[pillar.icon as string] || Globe;
              return (
                <div
                  key={idx}
                  className="p-6 rounded-2xl border border-border/70 bg-card hover:border-primary/40 hover:shadow-md transition-all duration-300 space-y-3"
                >
                  <div className="p-3 rounded-xl bg-primary/10 text-primary w-fit">
                    <Icon className="size-6" />
                  </div>
                  <h3 className="text-lg font-bold text-foreground font-heading">{pillar.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{pillar.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Open Positions Grid */}
      <section id="open-roles" className="py-16 lg:py-24">
        <div className={SECTION_SHELL_INNER}>
          <div className="max-w-3xl mx-auto text-center mb-10 space-y-3">
            <SectionBadge title="Open Positions" />
            <h2 className="text-3xl md:text-4xl font-bold font-heading text-foreground tracking-tight">
              {careersContent.openRolesSection.title}
            </h2>
            <p className="text-muted-foreground text-sm md:text-base">
              {careersContent.openRolesSection.description}
            </p>
          </div>

          {/* Department Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
            {departments.map((dept) => {
              const isSelected = selectedDept === dept;
              return (
                <button
                  key={dept}
                  type="button"
                  onClick={() => setSelectedDept(dept)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                    isSelected
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/80"
                  }`}
                >
                  {dept}
                </button>
              );
            })}
          </div>

          {/* Roles Cards */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredRoles.map((role) => (
              <div
                key={role.id}
                className={`flex flex-col justify-between p-6 rounded-2xl border transition-all duration-300 bg-card hover:shadow-md ${
                  role.isFeatured
                    ? "border-primary/40 ring-1 ring-primary/20"
                    : "border-border/70 hover:border-border"
                }`}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-2">
                    <Badge variant="outline" className="text-[11px] font-semibold bg-muted/50">
                      {role.department}
                    </Badge>
                    {role.isFeatured && (
                      <span className="text-[10px] uppercase font-bold text-amber-500 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full">
                        Hot Track
                      </span>
                    )}
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-foreground font-heading">{role.title}</h3>
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{role.tagline}</p>
                  </div>

                  <div className="flex flex-wrap gap-2 text-[11px] text-muted-foreground pt-1">
                    <span className="flex items-center gap-1 bg-muted/40 px-2 py-0.5 rounded-md">
                      <MapPin className="size-3 text-primary" />
                      {role.location}
                    </span>
                    <span className="flex items-center gap-1 bg-muted/40 px-2 py-0.5 rounded-md">
                      <Clock className="size-3 text-primary" />
                      {role.type}
                    </span>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-border/40">
                    <p className="text-[11px] font-semibold text-foreground">Key Focus:</p>
                    <ul className="space-y-1">
                      {role.responsibilities.slice(0, 2).map((resp, i) => (
                        <li key={i} className="text-xs text-muted-foreground flex items-start gap-1.5">
                          <CheckCircle2 className="size-3.5 text-emerald-500 shrink-0 mt-0.5" />
                          <span>{resp}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-6 mt-4 border-t border-border/40 flex items-center justify-between gap-3">
                  <Button
                    asChild
                    size="sm"
                    className="w-full font-bold gap-1.5 text-xs"
                  >
                    <Link href={`/contact?intent=careers&role=${encodeURIComponent(role.title)}`}>
                      <span>Apply For This Role</span>
                      <ArrowRight className="size-3.5" />
                    </Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {filteredRoles.length === 0 && (
            <div className="text-center py-12 text-muted-foreground text-sm">
              No positions open in this department right now. Reach out with a general application below!
            </div>
          )}
        </div>
      </section>

      {/* Application Process Section */}
      <section className="py-16 lg:py-24 border-t border-border/40 bg-muted/20">
        <div className={SECTION_SHELL_INNER}>
          <div className="max-w-3xl mx-auto text-center mb-12 space-y-3">
            <SectionBadge title="How It Works" />
            <h2 className="text-3xl md:text-4xl font-bold font-heading text-foreground tracking-tight">
              {careersContent.process.title}
            </h2>
            <p className="text-muted-foreground text-sm md:text-base">
              {careersContent.process.description}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {careersContent.process.steps.map((st) => (
              <div key={st.step} className="p-6 rounded-2xl border border-border/60 bg-card space-y-2">
                <span className="text-2xl font-bold font-mono text-primary/70">{st.step}</span>
                <h3 className="text-base font-bold text-foreground">{st.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{st.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* General Open Call Banner */}
      <section className="py-16 lg:py-20 border-t border-border/40">
        <div className={SECTION_SHELL_INNER}>
          <div className="p-8 sm:p-12 rounded-3xl border border-border/80 bg-card text-center max-w-4xl mx-auto space-y-6 shadow-xs">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1 text-xs font-bold text-primary mx-auto">
              <Send className="size-3.5" />
              <span>{careersContent.openCall.badge}</span>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-heading text-foreground tracking-tight">
              {careersContent.openCall.title}
            </h2>

            <p className="text-sm sm:text-base text-muted-foreground max-w-xl mx-auto leading-relaxed">
              {careersContent.openCall.description}
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <Button asChild size="lg" className="gap-2 font-bold shadow-md">
                <Link href="/contact?intent=general-creator">
                  <Send className="size-4" />
                  <span>Send Us Your Portfolio</span>
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/contact?intent=partner">
                  <span>Partner As An Organization</span>
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
