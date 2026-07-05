"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, MapPin, Star, TrendingUp, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { seedCountyProfiles } from "@/lib/reports-api";

export default function CountyDetailPage() {
  const params = useParams();
  const countyName = params.county as string;
  const profiles = seedCountyProfiles();
  const key = countyName.toLowerCase().replace(/['\s]/g, "");
  const profile = profiles[key];

  if (!profile) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <MapPin className="mx-auto mb-3 size-8 text-[#5f6368]/40" />
        <p className="text-sm text-[#5f6368]">County not found</p>
        <Link href="/budget/insights" className="mt-3 inline-flex items-center gap-1 text-xs text-[#006d37] hover:underline">
          <ArrowLeft className="size-3" /> Back to Insights
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6 sm:py-8">
      <Link href="/budget/insights"
        className="mb-4 inline-flex items-center gap-1 text-xs text-[#5f6368] hover:text-[#020304]"
      ><ArrowLeft className="size-3" /> Back to Insights</Link>

      <div className="mb-6 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-lg bg-[#e8f5e9]">
              <MapPin className="size-4 text-[#006d37]" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-[#020304]">{profile.name}</h1>
          </div>
          <p className="mt-1 text-sm text-[#5f6368] ml-10">{profile.tagline}</p>
        </div>
        <span className={cn(
          "rounded-full px-2.5 py-0.5 text-xs font-medium",
          profile.transparency_rating === "High" ? "bg-[#e8f5e9] text-[#006d37]" :
          profile.transparency_rating === "Moderate" ? "bg-[#fef7e0] text-[#735c00]" :
          "bg-[#fce8e6] text-[#c5221f]",
        )}>
          {profile.transparency_rating} Transparency
        </span>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-[#e1e4e8] bg-white p-4">
          <p className="text-[10px] font-medium uppercase tracking-wider text-[#5f6368]">Total Allocation</p>
          <p className="mt-1 text-xl font-bold text-[#020304]">KES {profile.total_allocation.toLocaleString()}B</p>
        </div>
        <div className="rounded-xl border border-[#e1e4e8] bg-white p-4">
          <p className="text-[10px] font-medium uppercase tracking-wider text-[#5f6368]">Per Capita</p>
          <p className="mt-1 text-xl font-bold text-[#020304]">KES {profile.allocation_per_capita.toLocaleString()}</p>
        </div>
        <div className="rounded-xl border border-[#e1e4e8] bg-white p-4">
          <p className="text-[10px] font-medium uppercase tracking-wider text-[#5f6368]">Citizen Rating</p>
          <p className="mt-1 text-xl font-bold text-[#020304] flex items-center gap-1">
            {profile.citizen_rating} <Star className="size-4 fill-[#cea700] text-[#cea700]" />
          </p>
        </div>
      </div>

      {profile.sector_breakdown.length > 0 && (
        <div className="mt-5 rounded-xl border border-[#e1e4e8] bg-white p-4 sm:p-5">
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-[#5f6368]">Sector Allocation</h2>
          <div className="space-y-2.5">
            {profile.sector_breakdown.map((s) => (
              <div key={s.name} className="flex items-center gap-2">
                <span className="size-2 rounded-full shrink-0" style={{ backgroundColor: s.fill }} />
                <span className="flex-1 text-xs text-[#5f6368]">{s.name}</span>
                <span className="text-xs font-medium text-[#020304]">{s.value}%</span>
                <div className="h-1.5 w-20 overflow-hidden rounded-full bg-[#e1e4e8]">
                  <div className="h-full rounded-full" style={{ width: `${s.value}%`, backgroundColor: s.fill }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
