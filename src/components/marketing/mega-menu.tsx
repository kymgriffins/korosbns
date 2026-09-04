"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import {
  Layers,
  MapPin,
  Newspaper,
  Clapperboard,
  BookOpen,
  Film,
  FileText,
  HelpCircle,
  FileBarChart,
  Compass,
  ArrowUpRight,
  ChevronDown,
  Sparkles,
  ShieldCheck,
  Users,
  Target,
  Send,
  Briefcase,
  Flame,
} from "lucide-react";
import { cn } from "@/utils";

export type MegaMenuItem = {
  title: string;
  href: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
};

export type MegaMenuSection = {
  id: string;
  label: string;
  href: string;
  eyebrow: string;
  ctaLabel: string;
  ctaHref: string;
  featured?: {
    title: string;
    description: string;
    badge: string;
    href: string;
  };
  items: MegaMenuItem[];
};

export const MEGA_MENU_DATA: MegaMenuSection[] = [
  {
    id: "programmes",
    label: "Programmes",
    href: "/programmes",
    eyebrow: "The 4 Operational Desks",
    ctaLabel: "Explore All 4 Programmes",
    ctaHref: "/programmes",
    featured: {
      title: "47 Counties Monitored",
      description: "From national debt tracking to Kakamega & Kilifi county town halls.",
      badge: "Active Mission",
      href: "/programmes",
    },
    items: [
      {
        title: "BNS Connect",
        href: "/programmes/bns-connect",
        description: "National budget tracking, citizen bills, and Finance Act scrutiny.",
        icon: Compass,
        badge: "National",
      },
      {
        title: "BNS Mashinani",
        href: "/programmes/bns-mashinani",
        description: "County-level budget tracking & citizen scorecards in 4 focus hubs.",
        icon: MapPin,
        badge: "Counties",
      },
      {
        title: "Wanahabari Lab",
        href: "/programmes/wanahabari-lab",
        description: "Newsroom training, investigative reporting, and whistleblower briefs.",
        icon: Newspaper,
        badge: "Journalism",
      },
      {
        title: "BNS Studios",
        href: "/bns-studio",
        description: "Commissioned audio-visual media, podcasts, animations & documentaries.",
        icon: Clapperboard,
        badge: "Impact Media",
      },
    ],
  },
  {
    id: "learn",
    label: "Learn",
    href: "/learn",
    eyebrow: "Free Civic Budget Academy",
    ctaLabel: "Start Learning for Free",
    ctaHref: "/learn",
    featured: {
      title: "No Paywalls. Ever.",
      description: "Step-by-step masterclasses translating KSh 4.8T into plain citizen language.",
      badge: "Open Academy",
      href: "/learn",
    },
    items: [
      {
        title: "Civic Modules",
        href: "/learn",
        description: "Self-paced guides on Kenya's budget cycle, BPS, and public participation.",
        icon: BookOpen,
        badge: "Modules",
      },
      {
        title: "Mtaani Video Series",
        href: "/learn?tab=videos",
        description: "Bilingual YouTube explainers and TikTok breakdowns made to scroll.",
        icon: Film,
        badge: "Watch",
      },
      {
        title: "Citizen Document Vault",
        href: "/learn/documents",
        description: "Simplified bills, acts, county CIDPs, and budget scorecards.",
        icon: FileText,
        badge: "Vault",
      },
      {
        title: "Quests & Community Forum",
        href: "/learn/forum",
        description: "Test your fiscal knowledge and debate budget priorities with peers.",
        icon: HelpCircle,
        badge: "Interactive",
      },
    ],
  },
  {
    id: "reports",
    label: "Reports",
    href: "/reports",
    eyebrow: "Verified Fiscal Intelligence",
    ctaLabel: "Browse All Intelligence Briefs",
    ctaHref: "/reports",
    featured: {
      title: "FY2026/27 Budget Audited",
      description: "KES 4.82T spending breakdown: ordinary revenue vs KES 1.20T debt service.",
      badge: "Primary Data",
      href: "/reports",
    },
    items: [
      {
        title: "National Budget Bulletin",
        href: "/reports",
        description: "Authoritative analysis of Kenya's KES 4.82 Trillion national budget.",
        icon: FileBarChart,
        badge: "National",
      },
      {
        title: "County Devolution Scorecards",
        href: "/reports#county-explorer",
        description: "Revenue vs development execution in Kakamega, Kilifi, Nakuru & Wajir.",
        icon: MapPin,
        badge: "Scorecards",
      },
      {
        title: "Follow the Money Pipeline",
        href: "/reports#follow-money",
        description: "Tracking capital infrastructure investments and project delivery.",
        icon: Target,
        badge: "Investigative",
      },
      {
        title: "Citizen Intelligence FAQ",
        href: "/reports#citizen-faq",
        description: "Instant, verified answers to top public finance questions.",
        icon: HelpCircle,
        badge: "Q&A",
      },
    ],
  },
  {
    id: "studios",
    label: "Studios",
    href: "/bns-studio",
    eyebrow: "Impact Production Engine",
    ctaLabel: "Commission the Studio",
    ctaHref: "/bns-studio/about#contact",
    featured: {
      title: "The Double Impact Engine",
      description: "100% of studio surplus directly subsidizes grassroots budget tracking in 47 counties.",
      badge: "Civic Model",
      href: "/bns-studio/about",
    },
    items: [
      {
        title: "Reel & 8 Formats",
        href: "/bns-studio",
        description: "Documentaries, podcasts, visual explainers, town halls & animations.",
        icon: Clapperboard,
        badge: "Formats",
      },
      {
        title: "Featured Work",
        href: "/work",
        description: "Commissioned campaigns and verified evidence across partners.",
        icon: Flame,
        badge: "Portfolio",
      },
      {
        title: "Why BNS Studios",
        href: "/bns-studio/about",
        description: "Mission-aligned production house with nationwide youth reach.",
        icon: ShieldCheck,
        badge: "About",
      },
      {
        title: "Start a Commission",
        href: "/bns-studio/about#contact",
        description: "Book our team for your next documentary, campaign, or convening.",
        icon: Send,
        badge: "Hire Us",
      },
    ],
  },
  {
    id: "about",
    label: "About",
    href: "/about",
    eyebrow: "The Movement & People",
    ctaLabel: "Read Institutional Profile",
    ctaHref: "/about",
    featured: {
      title: "100% Youth-Led",
      description: "From the 2024 Finance Bill crisis to Kenya's leading civic budget watchdog.",
      badge: "Origins",
      href: "/about",
    },
    items: [
      {
        title: "Our Story & Origins",
        href: "/about",
        description: "Why we started and how we hold public money accountable.",
        icon: BookOpen,
        badge: "Manifesto",
      },
      {
        title: "Theory of Change",
        href: "/about#theory-of-change",
        description: "How investigative data transforms into citizen power and policy shifts.",
        icon: Sparkles,
        badge: "Impact",
      },
      {
        title: "Methodology & Charter",
        href: "/about#methodology",
        description: "Primary source verification (OCOB, Treasury) and non-partisan rigor.",
        icon: ShieldCheck,
        badge: "Ethics",
      },
      {
        title: "Team & Consortium",
        href: "/about#team",
        description: "Meet the researchers, journalists, and founding allies behind BNS.",
        icon: Users,
        badge: "People",
      },
    ],
  },
];

export function MegaMenu() {
  const pathname = usePathname();
  const [activeTab, setActiveTab] = useState<string | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = (id: string) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setActiveTab(id);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setActiveTab(null);
    }, 180);
  };

  useEffect(() => {
    setActiveTab(null);
  }, [pathname]);

  const activeSection = MEGA_MENU_DATA.find((s) => s.id === activeTab);

  return (
    <div
      className="relative flex items-center"
      onMouseLeave={handleMouseLeave}
    >
      <nav aria-label="Main Navigation" className="flex items-center gap-1">
        {MEGA_MENU_DATA.map((section) => {
          const isActive =
            pathname === section.href || pathname.startsWith(`${section.href}/`);
          const isOpen = activeTab === section.id;

          return (
            <div
              key={section.id}
              className="relative"
              onMouseEnter={() => handleMouseEnter(section.id)}
            >
              <Link
                href={section.href}
                className={cn(
                  "group inline-flex items-center gap-1 rounded-full px-3.5 py-2 text-xs font-semibold tracking-tight transition-all duration-200 outline-none",
                  "focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
                  isOpen
                    ? "bg-muted text-foreground"
                    : isActive
                    ? "bg-primary/10 text-primary font-bold"
                    : "text-muted-foreground hover:bg-muted/70 hover:text-foreground"
                )}
                aria-expanded={isOpen}
              >
                <span>{section.label}</span>
                <ChevronDown
                  className={cn(
                    "size-3 transition-transform duration-200 text-muted-foreground/70 group-hover:text-foreground",
                    isOpen && "rotate-180 text-foreground"
                  )}
                  aria-hidden
                />
              </Link>
            </div>
          );
        })}
      </nav>

      {/* Flyout animated panel */}
      <AnimatePresence>
        {activeSection && (
          <motion.div
            key="mega-menu-flyout"
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.98 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className="absolute left-1/2 top-full mt-2 w-[620px] -translate-x-1/2 z-50 origin-top overflow-hidden rounded-3xl border border-border/60 bg-background/95 p-5 shadow-2xl backdrop-blur-2xl ring-1 ring-black/5 dark:ring-white/10"
            onMouseEnter={() => {
              if (timeoutRef.current) clearTimeout(timeoutRef.current);
            }}
            onMouseLeave={handleMouseLeave}
          >
            {/* Top header strip */}
            <div className="flex items-center justify-between border-b border-border/40 pb-3">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                {activeSection.eyebrow}
              </span>
              <Link
                href={activeSection.ctaHref}
                className="inline-flex items-center gap-1 text-xs font-semibold text-primary transition-colors hover:text-primary/80"
              >
                {activeSection.ctaLabel}
                <ArrowUpRight className="size-3.5" />
              </Link>
            </div>

            {/* Grid of options + featured side card */}
            <div className="mt-4 grid grid-cols-12 gap-4">
              <div className="col-span-8 grid grid-cols-1 gap-1.5">
                {activeSection.items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.title}
                      href={item.href}
                      className="group flex items-start gap-3 rounded-2xl p-2.5 transition-all duration-200 hover:bg-muted/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                    >
                      <div className="flex size-8 shrink-0 items-center justify-center rounded-xl border border-border/50 bg-card text-foreground transition-colors group-hover:border-primary/40 group-hover:bg-primary group-hover:text-primary-foreground">
                        <Icon className="size-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold tracking-tight text-foreground transition-colors group-hover:text-primary">
                            {item.title}
                          </span>
                          {item.badge && (
                            <span className="rounded-full border border-border/40 bg-muted px-2 py-0.5 text-[9px] font-semibold text-muted-foreground">
                              {item.badge}
                            </span>
                          )}
                        </div>
                        <p className="mt-0.5 line-clamp-1 text-[11px] leading-relaxed text-muted-foreground">
                          {item.description}
                        </p>
                      </div>
                    </Link>
                  );
                })}
              </div>

              {/* Featured side pillar */}
              {activeSection.featured && (
                <div className="col-span-4 flex flex-col justify-between rounded-2xl border border-border/50 bg-muted/40 p-4 transition-colors hover:border-border">
                  <div>
                    <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[9px] font-bold text-primary uppercase tracking-wider">
                      <Sparkles className="size-2.5" />
                      {activeSection.featured.badge}
                    </span>
                    <h4 className="mt-2 text-xs font-bold leading-snug text-foreground">
                      {activeSection.featured.title}
                    </h4>
                    <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">
                      {activeSection.featured.description}
                    </p>
                  </div>
                  <Link
                    href={activeSection.featured.href}
                    className="mt-3 inline-flex items-center gap-1 text-[11px] font-bold text-foreground transition-colors hover:text-primary"
                  >
                    Learn more
                    <ArrowUpRight className="size-3" />
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
