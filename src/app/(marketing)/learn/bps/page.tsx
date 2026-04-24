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
    <section className="relative min-h-screen w-full overflow-x-hidden overflow-y-visible bg-background pt-16 sm:pt-20">
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

        <div className="animate-fade-up rounded-3xl border border-white/10 bg-white/[0.04] p-4 sm:p-6">
          <div className="grid gap-6 lg:grid-cols-[1.25fr_0.85fr]">
            <div className="min-w-0">
              <div className="mb-3 inline-flex max-w-full items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-primary">
                <BookOpen className="size-3.5" />
                BPS Deep Dive
              </div>

              <div className="card-shimmer min-w-0 rounded-2xl border border-white/15 bg-gradient-to-br from-slate-900 via-indigo-900 to-black p-4 sm:p-5">
                <div className="mb-4 flex flex-wrap items-center justify-between gap-2 text-[10px] uppercase tracking-wider text-white/70">
                  <span>BPS 2026 Visual Preview</span>
                  <span>Kenya Fiscal Story</span>
                </div>
                <h1 className="text-xl font-bold leading-tight text-white sm:text-3xl lg:text-4xl">
                  Budget Policy Statement 2026
                </h1>
                <p className="mt-2 text-sm text-white/75">
                  Growth vs debt pressure, explained in one guided learning path.
                </p>
                <div className="mt-5 overflow-x-auto pb-1 [scrollbar-width:thin]">
                  <div className="grid min-w-[300px] grid-cols-5 gap-1.5 sm:min-w-[360px] sm:gap-2">
                    {yearlyData.map((item, index) => (
                    <div
                      key={item.year}
                      className="animate-fade-up rounded-lg border border-white/15 bg-black/35 p-2"
                      style={{ animationDelay: `${index * 90}ms` }}
                    >
                      <p className="text-center text-[10px] text-white/70">{item.year}</p>
                      <div className="mt-2 flex h-20 items-end justify-center gap-1">
                        <div
                          className="w-2 rounded-t bg-cyan-400"
                          style={{
                            height: `${(item.budget / maxDebt) * 100}%`,
                            animation: `barRise 700ms cubic-bezier(0.22,1,0.36,1) ${index * 100}ms both`,
                          }}
                        />
                        <div
                          className="w-2 rounded-t bg-orange-300"
                          style={{
                            height: `${(item.debt / maxDebt) * 100}%`,
                            animation: `barRise 760ms cubic-bezier(0.22,1,0.36,1) ${index * 100 + 70}ms both`,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                  </div>
                </div>
              </div>

              <div className="mt-4 min-w-0">
                <h2 className="text-xl font-bold leading-tight sm:text-2xl lg:text-3xl">BPS Masterclass: Growth vs Debt Pressure</h2>
                <p className="mt-3 text-sm leading-relaxed text-foreground/70 sm:text-base">
                  This deep dive follows a simple flow: what is planned, where pressure is building, and how citizens can track outcomes.
                  It is designed to feel like a structured course page with one clear narrative.
                </p>
              </div>

              <div className="mt-4 rounded-2xl border border-white/10 bg-background/60 p-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-foreground/50">Course table of contents</p>
                <div className="mt-3 space-y-2 text-sm">
                  <div className="animate-fade-up deep-card deep-card-cyan" style={{ animationDelay: "120ms" }}>
                    <div className="deep-card-head">
                      <span className="deep-card-tag">Module 01</span>
                      <span className="deep-card-time">6 min</span>
                    </div>
                    <p className="deep-card-title">Budget Growth Signal</p>
                    <div className="deep-card-foot">
                      <span className="deep-card-kicker">Fiscal trend mapping</span>
                      <span className="deep-card-stat">3.31T to 4.30T</span>
                    </div>
                  </div>
                  <div className="animate-fade-up deep-card deep-card-orange" style={{ animationDelay: "220ms" }}>
                    <div className="deep-card-head">
                      <span className="deep-card-tag">Module 02</span>
                      <span className="deep-card-time">7 min</span>
                    </div>
                    <p className="deep-card-title">Debt Pressure & Fiscal Space</p>
                    <div className="deep-card-foot">
                      <span className="deep-card-kicker">Risk and obligation lens</span>
                      <span className="deep-card-stat">10.58T debt</span>
                    </div>
                  </div>
                  <div className="animate-fade-up deep-card deep-card-violet" style={{ animationDelay: "320ms" }}>
                    <div className="deep-card-head">
                      <span className="deep-card-tag">Module 03</span>
                      <span className="deep-card-time">5 min</span>
                    </div>
                    <p className="deep-card-title">Citizen Outcome Checklist</p>
                    <div className="deep-card-foot">
                      <span className="deep-card-kicker">Service delivery tracker</span>
                      <span className="deep-card-stat">3 key checks</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <aside className="animate-fade-up h-fit min-w-0 rounded-2xl border border-white/10 bg-background/70 p-4 sm:p-5" style={{ animationDelay: "150ms" }}>
              <p className="text-3xl font-bold tracking-tight">Free</p>
              <p className="text-xs uppercase tracking-widest text-foreground/50">Public civic learning article</p>

              <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                <div className="rounded-lg border border-white/10 bg-white/[0.03] px-2 py-1.5 text-center">
                  <p className="font-semibold">3 sections</p>
                  <p className="text-foreground/50">lesson units</p>
                </div>
                <div className="rounded-lg border border-white/10 bg-white/[0.03] px-2 py-1.5 text-center">
                  <p className="font-semibold">Beginner</p>
                  <p className="text-foreground/50">difficulty</p>
                </div>
              </div>

              <ul className="mt-4 space-y-2 text-sm text-foreground/75">
                <li>• Language: English</li>
                <li>• Format: Visual article + chart cards</li>
                <li>• Duration: 15-20 minutes</li>
                <li>• Includes: Fiscal trend visual + citizen checklist</li>
                <li>• Certificate: Completion badge style summary</li>
              </ul>

              <div className="mt-5 space-y-2">
                <Link
                  href="/learn"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary/90"
                >
                  Start Learning <ArrowRight className="size-4" />
                </Link>
                <a
                  href="https://api.budgetndiostory.org/docrepository/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-white/20 px-4 py-2.5 text-sm font-semibold hover:bg-white/5"
                >
                  Open Source Documents
                </a>
              </div>

              <div className="mt-5 rounded-xl border border-white/10 bg-white/[0.03] p-3 text-xs text-foreground/65">
                <p className="font-semibold text-foreground/80">Assignment</p>
                <p className="mt-1">
                  Compare one service promise against county-level outcomes and note whether allocation quality is improving.
                </p>
              </div>
            </aside>
          </div>
        </div>

        <div className="animate-fade-up mt-6 rounded-3xl border border-white/10 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4 sm:p-6" style={{ animationDelay: "200ms" }}>
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="text-sm font-semibold text-white/90 sm:text-base">Fiscal Pulse Board</h2>
            <span className="rounded-full bg-white/10 px-2.5 py-1 text-[10px] uppercase tracking-wide text-white/70">
              No-repeat summary
            </span>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="card-shimmer rounded-2xl border border-cyan-300/20 bg-cyan-500/10 p-4">
              <p className="text-xs uppercase tracking-wider text-cyan-200">Revenue power</p>
              <p className="mt-2 text-2xl font-bold text-cyan-100">KES 3.59T</p>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/15">
                <div className="h-full w-[76%] animate-load-x rounded-full bg-gradient-to-r from-cyan-400 to-blue-400" />
              </div>
            </div>
            <div className="card-shimmer rounded-2xl border border-orange-300/20 bg-orange-500/10 p-4">
              <p className="text-xs uppercase tracking-wider text-orange-200">Spending load</p>
              <p className="mt-2 text-2xl font-bold text-orange-100">KES 4.74T</p>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/15">
                <div className="h-full w-[93%] animate-load-x rounded-full bg-gradient-to-r from-orange-400 to-rose-400" />
              </div>
            </div>
            <div className="card-shimmer rounded-2xl border border-violet-300/20 bg-violet-500/10 p-4">
              <p className="text-xs uppercase tracking-wider text-violet-200">Deficit pressure</p>
              <p className="mt-2 text-2xl font-bold text-violet-100">KES 1.15T</p>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/15">
                <div className="h-full w-[42%] animate-load-x rounded-full bg-gradient-to-r from-violet-400 to-indigo-400" />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <article className="animate-fade-up rounded-2xl border border-white/10 bg-white/[0.03] p-4" style={{ animationDelay: "260ms" }}>
            <div className="mb-2 inline-flex items-center gap-2 text-primary">
              <TrendingUp className="size-4" />
              <h3 className="text-sm font-semibold">Growth Signal</h3>
            </div>
            <p className="text-sm text-foreground/70">
              Budget size has increased year-on-year, showing stronger fiscal ambition in service delivery.
            </p>
          </article>

          <article className="animate-fade-up rounded-2xl border border-white/10 bg-white/[0.03] p-4" style={{ animationDelay: "330ms" }}>
            <div className="mb-2 inline-flex items-center gap-2 text-orange-300">
              <Landmark className="size-4" />
              <h3 className="text-sm font-semibold">Debt Signal</h3>
            </div>
            <p className="text-sm text-foreground/70">
              Debt trajectory remains elevated, meaning borrowing costs and repayment obligations stay central.
            </p>
          </article>

          <article className="animate-fade-up rounded-2xl border border-white/10 bg-white/[0.03] p-4" style={{ animationDelay: "390ms" }}>
            <div className="mb-2 inline-flex items-center gap-2 text-teal-300">
              <BarChart3 className="size-4" />
              <h3 className="text-sm font-semibold">Citizen Lens</h3>
            </div>
            <p className="text-sm text-foreground/70">
              The real test is outcomes: better schools, clinics, jobs, and county services from each additional shilling.
            </p>
          </article>
        </div>

        <div className="animate-fade-up mt-8 rounded-2xl border border-primary/20 bg-primary/10 p-5 sm:p-6" style={{ animationDelay: "450ms" }}>
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
      <style>{`
        .animate-fade-up {
          opacity: 0;
          transform: translateY(14px);
          animation: fadeUp 620ms cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }
        .card-shimmer {
          position: relative;
          overflow: hidden;
        }
        .card-shimmer::after {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(110deg, transparent 0%, rgba(255, 255, 255, 0.1) 45%, transparent 80%);
          transform: translateX(-120%);
          animation: shimmer 4.2s ease-in-out infinite;
        }
        .animate-load-x {
          transform-origin: left center;
          animation: loadX 900ms cubic-bezier(0.22, 1, 0.36, 1) both;
        }
        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(14px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes barRise {
          from {
            transform: scaleY(0.08);
            opacity: 0.4;
            filter: saturate(0.8);
          }
          to {
            transform: scaleY(1);
            opacity: 1;
            filter: saturate(1);
          }
        }
        @keyframes shimmer {
          0% {
            transform: translateX(-120%);
          }
          40%,
          100% {
            transform: translateX(120%);
          }
        }
        @keyframes loadX {
          from {
            transform: scaleX(0.1);
            opacity: 0.5;
          }
          to {
            transform: scaleX(1);
            opacity: 1;
          }
        }
        .deep-card {
          position: relative;
          border-radius: 24px;
          border: 1px solid rgba(255, 255, 255, 0.14);
          background: linear-gradient(180deg, rgba(255, 255, 255, 0.08), rgba(10, 10, 12, 0.85));
          padding: 13px 14px;
          overflow: hidden;
          transition: transform 220ms ease, border-color 220ms ease;
        }
        .deep-card::before {
          content: "";
          position: absolute;
          left: 0;
          right: 0;
          top: 0;
          height: 42%;
          opacity: 0.95;
          z-index: 0;
        }
        .deep-card::after {
          content: "";
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at 85% 20%, rgba(255, 255, 255, 0.2), transparent 34%);
          opacity: 0.6;
          z-index: 0;
          pointer-events: none;
        }
        .deep-card:hover {
          transform: translateY(-2px);
        }
        .deep-card-cyan {
          border-color: rgba(34, 211, 238, 0.42);
        }
        .deep-card-cyan::before {
          background: linear-gradient(120deg, rgba(6, 182, 212, 0.9), rgba(14, 116, 144, 0.62));
        }
        .deep-card-orange {
          border-color: rgba(251, 146, 60, 0.42);
        }
        .deep-card-orange::before {
          background: linear-gradient(120deg, rgba(249, 115, 22, 0.9), rgba(190, 24, 93, 0.58));
        }
        .deep-card-violet {
          border-color: rgba(167, 139, 250, 0.42);
        }
        .deep-card-violet::before {
          background: linear-gradient(120deg, rgba(139, 92, 246, 0.9), rgba(67, 56, 202, 0.6));
        }
        .deep-card-head,
        .deep-card-title,
        .deep-card-foot {
          position: relative;
          z-index: 1;
        }
        .deep-card-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .deep-card-tag,
        .deep-card-time {
          font-size: 10px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.85);
          font-weight: 600;
        }
        .deep-card-title {
          margin-top: 18px;
          font-size: 16px;
          line-height: 1.25;
          font-weight: 700;
          color: white;
        }
        .deep-card-foot {
          margin-top: 30px;
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 8px;
        }
        .deep-card-kicker {
          font-size: 12px;
          color: rgba(255, 255, 255, 0.76);
          max-width: 100%;
        }
        .deep-card-stat {
          font-size: 12px;
          color: rgba(255, 255, 255, 0.92);
          font-weight: 700;
          text-align: left;
        }
        @media (min-width: 640px) {
          .deep-card-kicker {
            max-width: 60%;
          }
          .deep-card-stat {
            text-align: right;
          }
        }
      `}</style>
    </section>
  );
}

