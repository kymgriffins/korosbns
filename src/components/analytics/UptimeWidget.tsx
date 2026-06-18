"use client";

import { motion } from "motion/react";
import { fadeInUp, staggerContainer } from "@/motion/variants";
import { CheckCircle, XCircle } from "lucide-react";

type Props = {
  uptimePercentage: number;
  data?: { date: string; status: "up" | "down" }[];
};

export function UptimeWidget({ uptimePercentage, data }: Props) {
  const isGood = uptimePercentage >= 99;
  const days = data || [];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        {isGood ? (
          <CheckCircle className="size-8 text-green-500" />
        ) : (
          <XCircle className="size-8 text-destructive" />
        )}
        <div>
          <div className="text-2xl font-bold font-heading">
            {uptimePercentage.toFixed(2)}%
          </div>
          <div className="text-xs text-muted-foreground">Uptime (30 days)</div>
        </div>
      </div>

      {days.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {days.map((day, i) => (
            <div
              key={i}
              className={`size-3 rounded-sm ${
                day.status === "up" ? "bg-green-500/60" : "bg-destructive/60"
              }`}
              title={`${day.date}: ${day.status}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
