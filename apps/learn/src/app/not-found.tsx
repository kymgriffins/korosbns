import type { Metadata } from "next";
import Link from "next/link";
import DayNightSwitch from "@/components/marketing/day-night-switch";
import RetroTvCard from "@/components/marketing/retro-tv-card";

export const metadata: Metadata = {
  title: "Page Not Found | Budget Ndio Story",
  description: "The requested page could not be found. Browse budget literacy content on Kenya's Finance Bill, Appropriation Bill, and public finance.",
  robots: { index: false },
};

export default function NotFoundPage() {
  return (
    <section className="min-h-[80vh] w-full bg-background flex items-center justify-center px-4 py-14">
      <div className="max-w-3xl w-full rounded-3xl border border-white/10 bg-white/5 p-6 sm:p-8 text-center backdrop-blur-sm">
        <div className="mb-4 flex justify-center">
          <DayNightSwitch />
        </div>

        <p className="text-xs uppercase tracking-[0.25em] text-primary/80 mb-2">
          404
        </p>
        <h1 className="text-3xl sm:text-4xl font-bold mb-2">Page not found</h1>
        <p className="text-sm text-foreground/65 mb-4">
          We could not find that page. Try one of the key routes below.
        </p>

        <div className="mb-4 flex justify-center overflow-hidden rounded-2xl border border-white/10 bg-black/20 p-2">
          <RetroTvCard />
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/"
            className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary/90"
          >
            Home
          </Link>
          <Link
            href="/"
            className="rounded-full border border-white/20 px-5 py-2.5 text-sm font-semibold hover:bg-white/5"
          >
            Learn Hub
          </Link>
          <Link
            href="/"
            className="rounded-full border border-white/20 px-5 py-2.5 text-sm font-semibold hover:bg-white/5"
          >
            Learn
          </Link>
        </div>
      </div>
    </section>
  );
}
