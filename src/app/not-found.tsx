import type { Metadata } from "next";
import Link from "next/link";
import { Search, Home, BookOpen, FileText, ArrowRight, Compass } from "lucide-react";
import DayNightSwitch from "@/components/marketing/day-night-switch";
import RetroTvCard from "@/components/marketing/retro-tv-card";

export const metadata: Metadata = {
  title: "404 - Page Not Found | Budget Ndio Story",
  description: "The requested budget story or civic learning route could not be found. Browse budget explainers, county scorecards, and public finance reports.",
  robots: { index: false },
};

export default function NotFoundPage() {
  return (
    <main className="min-h-screen w-full bg-background flex flex-col justify-between px-4 py-12">
      {/* Top Header Chrome */}
      <header className="max-w-5xl mx-auto w-full flex items-center justify-between py-4 border-b border-border/40">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl font-black tracking-tighter text-foreground">BNS<span className="text-primary">.</span></span>
          <span className="hidden sm:inline-block text-xs font-semibold uppercase tracking-widest text-muted-foreground border-l border-border pl-2">
            Civic Budget Hub
          </span>
        </Link>
        <div className="flex items-center gap-3">
          <DayNightSwitch />
          <Link
            href="/programmes"
            className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline"
          >
            <Compass className="size-3.5" />
            Explore programmes
          </Link>
        </div>
      </header>

      {/* Main 404 Card & Search Experience */}
      <section className="max-w-3xl mx-auto w-full my-12 rounded-3xl border border-border bg-card p-6 sm:p-10 text-center shadow-lg">
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-bold text-primary mb-4">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
          </span>
          HTTP 404 — Route Not Found
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold text-foreground tracking-tight mb-3">
          Lost in Kenya's Budget Matrix?
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground max-w-xl mx-auto mb-8">
          The page or civic story you were looking for doesn't exist or has moved. Search below or pick a popular destination to get back on track.
        </p>

        {/* Search Bar */}
        <form action="/programmes" method="GET" className="max-w-md mx-auto mb-8 relative">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <input
              type="text"
              name="q"
              placeholder="Search programmes, projects, county reports..."
              className="w-full rounded-xl border border-border bg-muted/40 pl-10 pr-24 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <button
              type="submit"
              className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-lg bg-primary px-3 py-1 text-xs font-semibold text-white hover:bg-primary/90 transition-colors"
            >
              Search
            </button>
          </div>
        </form>

        <div className="mb-8 flex justify-center overflow-hidden rounded-2xl border border-white/10 bg-black/20 p-3">
          <RetroTvCard />
        </div>

        {/* Navigation Quick Links */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-left">
          <Link
            href="/"
            className="group p-4 rounded-2xl border border-border bg-muted/20 hover:bg-primary/5 hover:border-primary/40 transition-all flex flex-col justify-between"
          >
            <div>
              <Home className="size-5 text-primary mb-2 group-hover:scale-110 transition-transform" />
              <h2 className="text-sm font-bold text-foreground">Homepage</h2>
              <p className="text-xs text-muted-foreground mt-0.5">Overview of Kenya's budget stories</p>
            </div>
            <span className="text-[10px] font-semibold text-primary mt-3 flex items-center gap-1">
              Go Home <ArrowRight className="size-3 group-hover:translate-x-1 transition-transform" />
            </span>
          </Link>

          <Link
            href="/projects"
            className="group p-4 rounded-2xl border border-border bg-muted/20 hover:bg-primary/5 hover:border-primary/40 transition-all flex flex-col justify-between"
          >
            <div>
              <BookOpen className="size-5 text-primary mb-2 group-hover:scale-110 transition-transform" />
              <h2 className="text-sm font-bold text-foreground">Flagship projects</h2>
              <p className="text-xs text-muted-foreground mt-0.5">TERRA, UON Cohort & studio dossiers</p>
            </div>
            <span className="text-[10px] font-semibold text-primary mt-3 flex items-center gap-1">
              View projects <ArrowRight className="size-3 group-hover:translate-x-1 transition-transform" />
            </span>
          </Link>

          <Link
            href="/reports"
            className="group p-4 rounded-2xl border border-border bg-muted/20 hover:bg-primary/5 hover:border-primary/40 transition-all flex flex-col justify-between"
          >
            <div>
              <FileText className="size-5 text-primary mb-2 group-hover:scale-110 transition-transform" />
              <h2 className="text-sm font-bold text-foreground">Budget Reports</h2>
              <p className="text-xs text-muted-foreground mt-0.5">Data briefs & county scorecards</p>
            </div>
            <span className="text-[10px] font-semibold text-primary mt-3 flex items-center gap-1">
              View Reports <ArrowRight className="size-3 group-hover:translate-x-1 transition-transform" />
            </span>
          </Link>
        </div>
      </section>

      {/* Bottom Footer Chrome */}
      <footer className="max-w-5xl mx-auto w-full text-center text-xs text-muted-foreground pt-4 border-t border-border/40 flex flex-col sm:flex-row items-center justify-between gap-2">
        <p>© 2026 Budget Ndio Story. All rights reserved.</p>
        <div className="flex gap-4">
          <Link href="/privacy" className="hover:underline">Privacy Policy</Link>
          <Link href="/terms" className="hover:underline">Terms of Service</Link>
          <Link href="/contact" className="hover:underline">Contact Support</Link>
        </div>
      </footer>
    </main>
  );
}
