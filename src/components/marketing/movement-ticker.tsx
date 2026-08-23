"use client";

import React from "react";

const TICKER_ITEMS = [
  "FOLLOW THE MONEY",
  "TRACK THE ALLOCATION",
  "DECODE THE BUDGET",
  "PARTICIPATE IN GOVERNANCE",
  "EMPOWER 47 COUNTIES",
  "DEMAND ECONOMIC JUSTICE",
];

export function MovementTicker() {
  return (
    <div className="relative w-full overflow-hidden border-y border-primary/20 bg-primary/10 py-3 backdrop-blur-sm select-none">
      <div className="flex w-max animate-marquee space-x-8 text-xs font-black uppercase tracking-[0.25em] text-primary">
        {[...TICKER_ITEMS, ...TICKER_ITEMS, ...TICKER_ITEMS].map((item, idx) => (
          <span key={idx} className="flex items-center gap-6">
            <span>{item}</span>
            <span className="text-primary/40">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}

export default MovementTicker;
