import Image from "next/image";
import { SECTION_SHELL_INNER } from "@/layouts/section-shell";

const budgetStats = [
  { label: "Total Budget", value: "KES 4.82T" },
  { label: "Deficit", value: "KES 1.15T" },
  { label: "Debt Interest", value: "KES 1.2T" },
];

export function BudgetReadingCard() {
  return (
    <section className="w-full py-20 md:py-32 bg-background border-b border-border/40">
      <div className={SECTION_SHELL_INNER}>
        <div className="relative overflow-hidden rounded-3xl border border-border/60 shadow-xl">
          <div className="relative aspect-[4/5] sm:aspect-[3/4] md:aspect-[2/3] w-full">
            <Image
              src="/images/landing/budget-reading-2026.jpg"
              alt="CS John Mbadi presents the KES 4.82 Trillion national budget at Parliament Buildings, Nairobi — June 11, 2026"
              fill
              className="object-cover object-[center_25%]"
              sizes="(max-width: 768px) 100vw, (max-width: 1400px) 90vw, 1400px"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/10" />
            <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-8 md:p-12">
              <div className="max-w-3xl space-y-4">
                <div className="space-y-1">
                  <p className="text-xs sm:text-sm font-semibold uppercase tracking-widest text-amber-400">
                    Budget Reading — June 11, 2026
                  </p>
                  <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white leading-tight">
                    CS John Mbadi Presents KES 4.82 Trillion Budget
                  </h2>
                </div>
                <p className="text-sm sm:text-base text-white/80 max-w-xl">
                  Revenue KES 3.63 trillion &middot; Deficit KES 1.15 trillion &middot; Debt interest KES 1.2 trillion
                </p>
              </div>
              <div className="mt-6 grid grid-cols-3 gap-3 sm:gap-4 md:gap-6">
                {budgetStats.map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-xl border border-white/15 bg-white/10 backdrop-blur-sm px-3 py-2.5 sm:px-4 sm:py-3 text-center"
                  >
                    <p className="text-xs sm:text-sm text-white/60">{stat.label}</p>
                    <p className="text-sm sm:text-lg md:text-2xl font-bold text-white tracking-tight">
                      {stat.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
