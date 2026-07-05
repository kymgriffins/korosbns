"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, TrendingUp, BookOpen } from "lucide-react";
import { fetchReportData } from "@/lib/reports-hub";
import type { BudgetSchema } from "@/lib/budget-schema";

const SECTOR_META: Record<string, { name: string; color: string; description: string }> = {
  education: { name: "Education", color: "#10b981", description: "Primary, secondary, TVET, and university education. Includes teacher recruitment, CBC infrastructure, and digital learning." },
  infrastructure: { name: "Infrastructure", color: "#3b82f6", description: "Roads, bridges, public works, and digital infrastructure projects." },
  health: { name: "Health", color: "#f59e0b", description: "Primary healthcare, hospitals, and universal health coverage programs." },
  security: { name: "Security", color: "#ef4444", description: "National defense, internal security, and policing." },
  agriculture: { name: "Agriculture", color: "#8b5cf6", description: "Food security, irrigation, and value addition programs." },
  housing: { name: "Housing", color: "#06b6d4", description: "Affordable housing and urban development." },
  "social protection": { name: "Social Protection", color: "#ec4899", description: "Cash transfers, elderly care, and safety nets." },
  governance: { name: "Governance", color: "#64748b", description: "Judiciary, devolution, and public administration." },
};

export default function SectorDetailPage() {
  const params = useParams();
  const code = params.code as string;
  const [data, setData] = useState<BudgetSchema | null>(null);

  useEffect(() => {
    fetchReportData().then((r) => setData(r.allYears[r.selectedYear] ?? null));
  }, []);

  const meta = SECTOR_META[code] ?? { name: code, color: "#64748b", description: "" };
  const sector = data?.sector_chart?.find((s) => s.name.toLowerCase() === code) ?? null;

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6 sm:py-8">
      <Link href="/budget/insights"
        className="mb-4 inline-flex items-center gap-1 text-xs text-[#5f6368] hover:text-[#020304]"
      ><ArrowLeft className="size-3" /> Back to Insights</Link>

      <div className="mb-1 flex items-center gap-2">
        <span className="size-3 rounded-full" style={{ backgroundColor: meta.color }} />
        <span className="text-xs font-medium text-[#5f6368]">Sector</span>
      </div>
      <h1 className="text-xl font-bold tracking-tight text-[#020304]">{meta.name}</h1>
      <p className="mt-1 text-sm text-[#5f6368]">{meta.description}</p>

      {sector && (
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-[#e1e4e8] bg-white p-5">
            <p className="text-[10px] font-medium uppercase tracking-wider text-[#5f6368]">Total Allocation</p>
            <p className="mt-1 text-2xl font-bold text-[#020304]">KES {sector.value}B</p>
            <div className="mt-2 flex items-center gap-1 text-xs font-medium text-[#006d37]">
              <TrendingUp className="size-3" />+15% vs prior year
            </div>
          </div>
          <div className="rounded-xl border border-[#e1e4e8] bg-white p-5">
            <p className="text-[10px] font-medium uppercase tracking-wider text-[#5f6368]">Share of Budget</p>
            <p className="mt-1 text-2xl font-bold text-[#020304]">
              {data?.sector_chart ? (sector.value / Math.max(...data.sector_chart.map((s) => s.value)) * 100).toFixed(1) : "—"}%
            </p>
            <p className="mt-1 text-xs text-[#5f6368]">of total sector allocation</p>
          </div>
        </div>
      )}

      <div className="mt-6 flex flex-col gap-3">
        <Link href={`/budget/learn?q=${code}`}
          className="flex items-center gap-2.5 rounded-xl border border-[#e1e4e8] bg-white p-3.5 transition-all hover:border-[#006d37]/30 active:scale-[0.98]"
        >
          <div className="flex size-8 items-center justify-center rounded-lg bg-[#e8f5e9]">
            <BookOpen className="size-4 text-[#006d37]" />
          </div>
          <div>
            <p className="text-xs font-semibold text-[#020304]">Learn about {meta.name}</p>
            <p className="text-[10px] text-[#5f6368]">Related modules and resources</p>
          </div>
        </Link>
      </div>
    </div>
  );
}
