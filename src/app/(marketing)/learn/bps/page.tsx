import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowRight, BarChart3, BookOpen, Landmark, TrendingUp } from "lucide-react";

export const metadata: Metadata = {
  title: "BPS Deep Dive | Budget Ndio Story",
  description:
    "A cohesive, visual-first deep dive into Kenya's Budget Policy Statement: priorities, debt pressure, and what it means for citizens.",
};

const yearlyData = [
  { year: "2022", budget: 3.31, debt: 8.62 },
  { year: "2023", budget: 3.68, debt: 9.10 },
  { year: "2024", budget: 3.99, debt: 9.72 },
  { year: "2025", budget: 4.26, debt: 10.20 },
  { year: "2026", budget: 4.30, debt: 10.58 },
];

export default function BpsArticlePage() {
  const maxDebt = Math.max(...yearlyData.map((d) => d.debt));

  return (
    <section className="relative min-h-screen w-full overflow-hidden bg-background pt-16 sm:pt-20">
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-20 -top-20 size-72 rounded-full bg-primary/20 blur-[120px]" />
        <div className="absolute -bottom-20 -right-20 size-72 rounded-full bg-orange-500/15 blur-[120px]" />
      </div>

      <div className="mx-auto w-full max-w-5xl px-4 pb-20 sm:px-6">
        <Link
          href="/learn"
          className="mb-6 inline-flex items-center gap-2 text-sm text-foreground/60 transition-colors hover:text-primary"
        >
          <ArrowLeft className="size-4" />
          Back to Learn
        </Link>

        <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 sm:p-8">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-primary">
            <BookOpen className="size-3.5" />
            Deep Dive Article
          </div>

          <h1 className="text-3xl font-bold leading-tight sm:text-5xl">
            Budget Policy Statement 2026:
            <span className="block bg-gradient-to-r from-primary to-orange-300 bg-clip-text text-transparent">
              Growth vs Debt Pressure
            </span>
          </h1>

          <p className="mt-4 max-w-3xl text-sm leading-relaxed text-foreground/70 sm:text-base">
            This is the flagship BPS article experience. One clean theme, one narrative:
            Kenya&apos;s budget is growing, but debt obligations are also rising. The key question is
            whether growth is fast enough to improve services and reduce fiscal pressure over time.
          </p>
        </div>

        <div className="mt-6 rounded-3xl border border-white/10 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4 sm:p-6">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="text-sm font-semibold text-white/90 sm:text-base">Budget Growth vs Kenya Public Debt (KES Trillions)</h2>
            <span className="rounded-full bg-white/10 px-2.5 py-1 text-[10px] uppercase tracking-wide text-white/70">
              Visual Summary
            </span>
          </div>

          <div className="grid grid-cols-5 gap-2 sm:gap-3">
            {yearlyData.map((item) => (
              <div key={item.year} className="rounded-xl border border-white/10 bg-black/30 p-2 sm:p-3">
                <div className="mb-2 text-center text-[10px] text-white/70 sm:text-xs">{item.year}</div>
                <div className="flex h-36 items-end justify-center gap-1.5 sm:h-44">
                  <div className="flex w-4/12 flex-col items-center">
                    <div
                      className="w-full rounded-t bg-gradient-to-t from-cyan-500 to-primary"
                      style={{ height: `${(item.budget / maxDebt) * 100}%` }}
                    />
                    <span className="mt-1 text-[9px] text-cyan-200">B</span>
                  </div>
                  <div className="flex w-4/12 flex-col items-center">
                    <div
                      className="w-full rounded-t bg-gradient-to-t from-rose-600 to-orange-300"
                      style={{ height: `${(item.debt / maxDebt) * 100}%` }}
                    />
                    <span className="mt-1 text-[9px] text-orange-200">D</span>
                  </div>
                </div>
                <div className="mt-2 space-y-0.5 text-[10px] text-white/70">
                  <p>Budget: {item.budget.toFixed(2)}</p>
                  <p>Debt: {item.debt.toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <article className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
            <div className="mb-2 inline-flex items-center gap-2 text-primary">
              <TrendingUp className="size-4" />
              <h3 className="text-sm font-semibold">Growth Signal</h3>
            </div>
            <p className="text-sm text-foreground/70">
              Budget size has increased year-on-year, showing stronger fiscal ambition in service delivery.
            </p>
          </article>

          <article className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
            <div className="mb-2 inline-flex items-center gap-2 text-orange-300">
              <Landmark className="size-4" />
              <h3 className="text-sm font-semibold">Debt Signal</h3>
            </div>
            <p className="text-sm text-foreground/70">
              Debt trajectory remains elevated, meaning borrowing costs and repayment obligations stay central.
            </p>
          </article>

          <article className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
            <div className="mb-2 inline-flex items-center gap-2 text-teal-300">
              <BarChart3 className="size-4" />
              <h3 className="text-sm font-semibold">Citizen Lens</h3>
            </div>
            <p className="text-sm text-foreground/70">
              The real test is outcomes: better schools, clinics, jobs, and county services from each additional shilling.
            </p>
          </article>
        </div>

        <div className="mt-8 rounded-2xl border border-primary/20 bg-primary/10 p-5 sm:p-6">
          <h2 className="text-xl font-bold sm:text-2xl">What this means next</h2>
          <p className="mt-2 text-sm text-foreground/75 sm:text-base">
            Future deep dives for ADP, BROP, CFSP, CIDP and others will use this same cohesive article style so the entire
            document ecosystem feels connected, not fragmented.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              href="/learn"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary/90"
            >
              Explore Learn Hub <ArrowRight className="size-4" />
            </Link>
            <a
              href="https://api.budgetndiostory.org/docrepository/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-white/20 px-5 py-2.5 text-sm font-semibold hover:bg-white/5"
            >
              Open Document Repository
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

