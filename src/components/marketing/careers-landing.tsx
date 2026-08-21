"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "motion/react";
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
import Wrapper from "@/components/global/wrapper";
import SectionBadge from "@/components/ui/section-badge";
import { ease } from "@/motion/variants";

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

const OPEN_ROLES: JobRole[] = [
  {
    id: "podcast-host-budget-mtaani",
    title: "Lead Podcast Host — 'Budget Mtaani'",
    department: "Media & Audio",
    location: "Nairobi / Studio",
    type: "Open Call / Retainer",
    isFeatured: true,
    tagline: "Be the charismatic voice translating national fiscal debates into relatable street talk.",
    description:
      "Host weekly episodes of 'Budget Mtaani', interviewing policymakers, market vendors, and student leaders to break down tax legislation, public debt, and county allocations.",
    responsibilities: [
      "Host, co-produce, and moderate weekly podcast recordings in both Sheng and English.",
      "Conduct field vox-pops and interactive street interviews across Nairobi.",
      "Collaborate with research teams to craft engaging interview discussion guides.",
      "Engage with listeners via live call-ins and social media Q&As.",
    ],
    requirements: [
      "Dynamic on-mic presence, audio charisma, and deep familiarity with youth culture & Sheng.",
      "Passion for public finance, citizen rights, and community empowerment.",
      "Prior experience in audio broadcasting, radio, podcasting, or spoken word is an asset.",
    ],
  },
  {
    id: "short-form-video-creator",
    title: "Short-Form Video Creator (TikTok & Reels)",
    department: "Visual & Video",
    location: "Nairobi / Hybrid",
    type: "Open Call / Contract",
    isFeatured: true,
    tagline: "Make complex public budgets go viral with witty, educational short videos.",
    description:
      "Design, shoot, and edit high-impact short-form videos (TikTok, Instagram Reels, YouTube Shorts) transforming budget line items into must-watch civic content.",
    responsibilities: [
      "Script and produce 3–5 short-form videos weekly breaking down Kenya's budget trends.",
      "Experiment with trends, audio memes, hooks, and kinetic captions to maximize engagement.",
      "Track analytics, viewer retention, and comment trends to refine storytelling formats.",
    ],
    requirements: [
      "Proven track record creating engaging short-form video on TikTok or Instagram.",
      "Proficiency with mobile video editing apps (CapCut, Premiere Pro, DaVinci).",
      "Ability to distill dense government documents into 60-second punchy narratives.",
    ],
  },
  {
    id: "motion-graphics-animator",
    title: "2D Motion Graphics Animator",
    department: "Visual & Video",
    location: "Remote / Kenya",
    type: "Project Fellowship",
    tagline: "Bring economic indicators to life with compelling 2D animations and visual metaphors.",
    description:
      "Turn budgetary charts, tax breakdowns, and county revenue metrics into beautiful, easy-to-understand motion graphics and infographic explainer videos.",
    responsibilities: [
      "Create 2D vector animations, character motion, and data visualizations for explainer series.",
      "Collaborate with scriptwriters and audio engineers to match visuals with voiceovers.",
      "Maintain consistent BNS visual style, color palettes, and typographic identity.",
    ],
    requirements: [
      "Strong portfolio demonstrating 2D animation, kinetic typography, and data visualization.",
      "Expertise in Adobe After Effects, Illustrator, and Premiere Pro.",
      "Speed, creativity, and keen eye for pacing and storytelling.",
    ],
  },
  {
    id: "fiscal-scriptwriter-editor",
    title: "Fiscal Policy Scriptwriter & Fact-Checker",
    department: "Research & Editorial",
    location: "Remote / Hybrid",
    type: "Part-time / Fellowship",
    tagline: "Turn complex government bills into compelling, fact-checked scripts for our studios.",
    description:
      "Analyze Finance Bills, Appropriation Acts, and Auditor General reports, translating technical legislative text into accurate, engaging scripts for video and audio production.",
    responsibilities: [
      "Read, verify, and summarize national and county fiscal documents.",
      "Draft concise, narrative-driven scripts for YouTube documentaries, podcasts, and carousels.",
      "Fact-check claims, data tables, and graphics against primary Treasury publications.",
    ],
    requirements: [
      "Background in economics, law, journalism, public policy, or political science.",
      "Flawless written English and ability to write in natural, conversational speaking tone.",
      "Uncompromising attention to accuracy, citations, and data integrity.",
    ],
  },
  {
    id: "civic-tech-engineer",
    title: "Civic-Tech Frontend / Full-Stack Engineer",
    department: "Creative Tech",
    location: "Remote / Hybrid (Kenya)",
    type: "Fellowship / Contract",
    tagline: "Build open data platforms, interactive budget trackers, and civic learning tools.",
    description:
      "Work with the technology team to expand the BNS Headless CMS, interactive county budget explorers, quizzes, and community participation tools.",
    responsibilities: [
      "Develop responsive, accessible web interfaces in Next.js, React, Tailwind, and TypeScript.",
      "Integrate open data APIs, automated verification pipelines, and offline-first capabilities.",
      "Collaborate on UX design to ensure data tools are intuitive for youth on mobile devices.",
    ],
    requirements: [
      "Strong knowledge of Next.js / React, TypeScript, Tailwind CSS, and REST/GraphQL APIs.",
      "Passion for open source, open data, and civic technology.",
      "Experience with data visualization libraries (Recharts, D3, Chart.js) is a big plus.",
    ],
  },
  {
    id: "youth-campus-facilitator",
    title: "Youth Campus & Community Facilitator",
    department: "Grassroots Outreach",
    location: "Nationwide (47 Counties)",
    type: "Network Partner / Stipend",
    tagline: "Lead budget literacy dialogues and townhalls on university campuses and community halls.",
    description:
      "Coordinate local BNS budget clubs, facilitate youth civic dialogues, organize campus screenings of BNS documentaries, and gather grassroots feedback on local budget priorities.",
    responsibilities: [
      "Organize and facilitate on-ground fiscal literacy workshops and debate circles.",
      "Distribute BNS educational guides, infographics, and toolkits to youth networks.",
      "Collect citizen feedback and budget questions for the 'Budget Mtaani' broadcast team.",
    ],
    requirements: [
      "Energetic community organizer, student leader, or youth activist.",
      "Excellent public speaking and group facilitation skills.",
      "Deep ties to local university student unions or grassroots community groups.",
    ],
  },
];

const CULTURE_PILLARS = [
  {
    icon: Globe,
    title: "National Civic Impact",
    description: "Every story, video, and data tool you create helps millions of Kenyans hold their public institutions accountable.",
  },
  {
    icon: Zap,
    title: "Creative Autonomy",
    description: "High-energy multimedia studios, cutting-edge formats, and the freedom to experiment with bold storytelling.",
  },
  {
    icon: Users,
    title: "Youth-Led & Collaborative",
    description: "Work alongside passionate peers aged 18–34, supported by seasoned economists, legal mentors, and media pioneers.",
  },
  {
    icon: Award,
    title: "Fellowship & Growth",
    description: "Build a standout civic-tech & media portfolio, with competitive project stipends and national visibility.",
  },
];

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
      <section className="relative overflow-hidden border-b border-border/60 bg-muted/20 py-20 lg:py-28">
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:32px]" />
        <Wrapper className="relative z-10">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-bold text-primary">
              <Zap className="size-3.5" />
              <span>Careers &amp; Creative Open Call (Ages 18–34)</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-heading text-foreground tracking-tight leading-tight">
              Shape How Kenya Talks About the National Budget
            </h1>

            <p className="text-base sm:text-lg lg:text-xl text-muted-foreground leading-relaxed">
              Budget Ndio Story is expanding its youth-led creator network. We are looking for fearless storytellers, animators, podcast hosts, civic researchers, and technologists to make fiscal governance transparent, relatable, and impossible to ignore.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
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
          </div>
        </Wrapper>
      </section>

      {/* Why Work With Us */}
      <section className="py-16 lg:py-24 border-b border-border/40 bg-muted/20">
        <Wrapper>
          <div className="max-w-3xl mx-auto text-center mb-12 lg:mb-16 space-y-3">
            <SectionBadge title="Why Join BNS" />
            <h2 className="text-3xl md:text-4xl font-bold font-heading text-foreground tracking-tight">
              A Platform Built For Young Change-Makers
            </h2>
            <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
              We provide the mentorship, creative freedom, and digital distribution power you need to produce work that matters.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {CULTURE_PILLARS.map((pillar, idx) => {
              const Icon = pillar.icon;
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
        </Wrapper>
      </section>

      {/* Open Positions Grid */}
      <section id="open-roles" className="py-16 lg:py-24">
        <Wrapper>
          <div className="max-w-3xl mx-auto text-center mb-10 space-y-3">
            <SectionBadge title="Open Positions" />
            <h2 className="text-3xl md:text-4xl font-bold font-heading text-foreground tracking-tight">
              Find Your Place In The Story
            </h2>
            <p className="text-muted-foreground text-sm md:text-base">
              Choose your creative or technical domain below to view current fellowship, contract, and open-call tracks.
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
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
        </Wrapper>
      </section>

      {/* Application Process Section */}
      <section className="py-16 lg:py-24 border-t border-border/40 bg-muted/20">
        <Wrapper>
          <div className="max-w-3xl mx-auto text-center mb-12 space-y-3">
            <SectionBadge title="How It Works" />
            <h2 className="text-3xl md:text-4xl font-bold font-heading text-foreground tracking-tight">
              Our 4-Step Creative Selection Process
            </h2>
            <p className="text-muted-foreground text-sm md:text-base">
              We care more about your portfolio, voice, and passion for civic storytelling than formal credentials.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {[
              {
                step: "01",
                title: "Apply Online",
                desc: "Send your portfolio, links (TikTok, YouTube, GitHub, articles), and why you want to work with BNS.",
              },
              {
                step: "02",
                title: "Creative Brief",
                desc: "Selected candidates receive a short, fun sample brief (e.g. 60-second budget script or mock infograph).",
              },
              {
                step: "03",
                title: "Alignment Chat",
                desc: "A casual chat with team leads to discuss vision, creative styles, and stipend/collaboration terms.",
              },
              {
                step: "04",
                title: "Production Kickoff",
                desc: "Get plugged into the BNS Studio workflow, shoots, podcasts, or data research pipelines!",
              },
            ].map((st) => (
              <div key={st.step} className="p-6 rounded-2xl border border-border/60 bg-card space-y-2">
                <span className="text-2xl font-bold font-mono text-primary/70">{st.step}</span>
                <h3 className="text-base font-bold text-foreground">{st.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{st.desc}</p>
              </div>
            ))}
          </div>
        </Wrapper>
      </section>

      {/* General Open Call Banner */}
      <section className="py-16 lg:py-20 border-t border-border/40">
        <Wrapper>
          <div className="p-8 sm:p-12 rounded-3xl border border-border/80 bg-card text-center max-w-4xl mx-auto space-y-6 shadow-xs">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1 text-xs font-bold text-primary mx-auto">
              <Send className="size-3.5" />
              <span>Spontaneous Applications Welcome</span>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-heading text-foreground tracking-tight">
              Don&apos;t see your specific role?
            </h2>

            <p className="text-sm sm:text-base text-muted-foreground max-w-xl mx-auto leading-relaxed">
              If you have a unique skill in investigative research, Sheng translation, sound design, or grassroots mobilization, we want to hear from you.
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
        </Wrapper>
      </section>
    </div>
  );
}
