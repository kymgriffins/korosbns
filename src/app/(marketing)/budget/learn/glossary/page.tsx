"use client";

import { useState } from "react";
import { Search, BookA, Star } from "lucide-react";
import { cn } from "@/lib/utils";

const TERMS = [
  { term: "Appropriation Bill", en: "A proposed law that authorizes expenditure of government funds.", sw: "Muswada unaoidhinisha matumizi ya fedha za serikali.", category: "Legislative" },
  { term: "Equalization Fund", en: "Fund to provide basic services to marginalized areas to bring them to par with the rest of the nation.", sw: "Mfuko wa kutoa huduma za msingi kwa maeneo yaliyotengwa.", category: "Fiscal" },
  { term: "Supplementary Budget", en: "A mid-year adjustment to the original budget allocation.", sw: "Marekebisho ya bajeti ya katikati ya mwaka.", category: "Budget Process" },
  { term: "Division of Revenue", en: "The division of national revenue between national and county governments.", sw: "Mgawanyo wa mapato kati ya serikali kuu na za kaunti.", category: "Fiscal" },
  { term: "Public Participation", en: "Constitutional requirement for citizen input in budget processes.", sw: "Ushirikishwaji wa wananchi katika michakato ya bajeti.", category: "Civic" },
  { term: "Conditional Grant", en: "Funds allocated to counties for specific purposes with conditions attached.", sw: "Ruzuku yenye masharti kwa kaunti.", category: "Fiscal" },
  { term: "Contingency Fund", en: "A reserve fund for urgent and unforeseen expenditures.", sw: "Mfuko wa dharura kwa matumizi yasiyotarajiwa.", category: "Budget Process" },
  { term: "Audit Report", en: "Official examination of government accounts by the Auditor General.", sw: "Ukaguzi rasmi wa hesabu za serikali na Mdhibiti wa Fedha.", category: "Oversight" },
  { term: "Revenue Allocation", en: "The distribution of collected revenue among national and county governments.", sw: "Mgawanyo wa mapato kati ya serikali kuu na za kaunti.", category: "Fiscal" },
  { term: "Mwananchi", en: "Citizen; ordinary person whose interests the budget serves.", sw: "Mwananchi; mtu wa kawaida ambaye maslahi yake bajeti hutumikia.", category: "Civic" },
];

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

export default function BudgetGlossaryPage() {
  const [search, setSearch] = useState("");
  const [letter, setLetter] = useState("");

  const filtered = TERMS.filter((t) => {
    const matchesSearch = !search || t.term.toLowerCase().includes(search.toLowerCase()) || t.en.toLowerCase().includes(search.toLowerCase());
    const matchesLetter = !letter || t.term[0].toUpperCase() === letter;
    return matchesSearch && matchesLetter;
  });

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6 sm:py-8">
      <div className="mb-5">
        <h1 className="text-xl font-bold tracking-tight text-[#020304]">Budget Glossary</h1>
        <p className="mt-0.5 text-sm text-[#5f6368]">Key terms explained in English & Swahili</p>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-[#5f6368]" />
        <input
          placeholder="Search terms..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-xl border border-[#e1e4e8] bg-white py-2.5 pl-10 pr-4 text-sm text-[#020304] outline-none placeholder:text-[#5f6368] focus:border-[#006d37]/40"
        />
      </div>

      {/* A-Z Nav */}
      <div className="mb-5 flex gap-1 overflow-x-auto hide-scrollbar">
        {ALPHABET.map((l) => (
          <button key={l} onClick={() => setLetter(letter === l ? "" : l)}
            className={cn(
              "shrink-0 size-7 rounded-full text-xs font-medium transition-all",
              letter === l ? "bg-[#006d37] text-white" : "bg-[#f1f3f4] text-[#5f6368] hover:bg-[#e1e4e8]",
            )}
          >
            {l}
          </button>
        ))}
      </div>

      {/* Glossary Cards */}
      <div className="grid gap-3 sm:grid-cols-2">
        {filtered.map((t) => (
          <div key={t.term} className="rounded-xl border border-[#e1e4e8] bg-white p-4">
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-sm font-semibold text-[#020304]">{t.term}</h3>
              <span className="rounded bg-[#f1f3f4] px-1.5 py-0.5 text-[10px] font-medium text-[#5f6368]">{t.category}</span>
            </div>
            <p className="text-xs text-[#5f6368] leading-relaxed">{t.en}</p>
            <p className="mt-1.5 text-xs text-[#006d37] leading-relaxed italic">{t.sw}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
