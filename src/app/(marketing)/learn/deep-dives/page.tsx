import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Deep Dives | Budget Ndio Story",
  description:
    "Explore additional deep-dive visual explainers on budget policy, debt pressure, and service delivery outcomes.",
};

const deepDiveCards = [
  {
    id: "growth-signal",
    title: "Budget Growth Signal",
    subtitle:
      "Track how projected spending scales and where growth should translate into public value.",
    image: "/images/gradient.svg",
    accent: "from-cyan-400/85 via-sky-400/80 to-blue-500/75",
  },
  {
    id: "debt-pressure",
    title: "Debt Pressure & Fiscal Space",
    subtitle:
      "Understand debt obligations, refinancing risk, and why fiscal room for services gets tighter.",
    image: "/images/project.svg",
    accent: "from-orange-400/85 via-rose-400/80 to-fuchsia-500/75",
  },
  {
    id: "citizen-checklist",
    title: "Citizen Outcome Checklist",
    subtitle:
      "Use practical checks for schools, health, and county delivery after allocations are approved.",
    image: "/images/invoices.svg",
    accent: "from-violet-400/85 via-indigo-400/80 to-blue-500/75",
  },
  {
    id: "county-value",
    title: "County Value Tracker",
    subtitle:
      "Follow whether county allocations are turning into visible local services.",
    image: "/images/blob.svg",
    accent: "from-emerald-400/85 via-teal-400/80 to-cyan-500/75",
  },
  {
    id: "fiscal-risks",
    title: "Fiscal Risk Radar",
    subtitle:
      "Spot debt, revenue, and climate risks early before they erode delivery quality.",
    image: "/images/gradient.svg",
    accent: "from-amber-400/85 via-orange-400/80 to-rose-500/75",
  },
  {
    id: "citizen-action",
    title: "Citizen Action Lens",
    subtitle:
      "Translate budget narratives into practical citizen follow-up actions.",
    image: "/images/project.svg",
    accent: "from-blue-400/85 via-indigo-400/80 to-violet-500/75",
  },
];

export default function DeepDivesPage() {
  return (
    <section className="relative min-h-screen w-full overflow-hidden bg-background pt-16 sm:pt-20">
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-20 -top-20 size-72 rounded-full bg-primary/20 blur-[120px]" />
        <div className="absolute -bottom-20 -right-20 size-72 rounded-full bg-violet-500/15 blur-[120px]" />
      </div>

      <div className="mx-auto w-full max-w-6xl px-4 pb-20 sm:px-6">
        <Link
          href="/learn"
          className="mb-6 inline-flex items-center gap-2 text-sm text-foreground/60 transition-colors hover:text-primary"
        >
          <ArrowLeft className="size-4" />
          Back to Learn
        </Link>

        <div className="mb-6 space-y-2">
          <h1 className="text-3xl font-bold sm:text-4xl">More Deep Dives</h1>
          <p className="max-w-3xl text-sm text-foreground/65 sm:text-base">
            Browse visual explainers in the same design system with varied color contrasts and focused topic narratives.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {deepDiveCards.map((card, index) => (
            <Link key={card.id} href="/learn/bps" className="group block">
              <div
                className="relative overflow-hidden rounded-[24px] bg-white/[0.055] shadow-[0_12px_40px_rgba(0,0,0,0.28)]"
                style={{ animation: `fadeUp 500ms cubic-bezier(0.22,1,0.36,1) ${index * 80}ms both` }}
              >
                <div className="relative m-2 h-44 overflow-hidden rounded-[22px]">
                  <Image
                    src={card.image}
                    alt={card.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-br ${card.accent}`} />
                  <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(8,8,12,0.72)_18%,rgba(8,8,12,0.16)_72%)]" />
                  <div className="absolute right-3 top-3 rounded-full bg-white/90 p-2 text-black shadow-[0_6px_18px_rgba(0,0,0,0.28)]">
                    <ArrowRight className="size-3.5" />
                  </div>
                </div>

                <div className="px-4 pb-4 pt-3">
                  <h2 className="text-[1.65rem] font-bold leading-tight tracking-tight">
                    {card.title}
                  </h2>
                  <p className="mt-2 text-[15px] leading-relaxed text-foreground/70">
                    {card.subtitle}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <style>{`
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
      `}</style>
    </section>
  );
}
