"use client";

import Link from "next/link";
import Image from "next/image";
import type { ProgrammeBlock } from "@/content";

type MagazineProgrammeDetailProps = {
  programme: ProgrammeBlock;
  civicProgrammes: ProgrammeBlock[];
  closing?: {
    seoTitle?: string;
    seoDescription?: string;
    headline?: string;
    body?: string;
    ctaText?: string;
    ctaHref?: string;
  };
  studiosEvidence?: {
    evidence?: Array<{
      id: string;
      title: string;
      slug?: string;
      lede?: string;
      programmeSlug?: string;
      thumbnail?: string;
      county?: string;
    }>;
  };
};

export function MagazineProgrammeDetail({
  programme,
  civicProgrammes,
  studiosEvidence,
}: MagazineProgrammeDetailProps) {
  const currentSlug = String(programme.slug);
  const otherProgrammes = civicProgrammes.filter(
    (p) => String(p.slug) !== currentSlug,
  );
  const evidenceList = (studiosEvidence?.evidence || []).filter(
    (e) => !e.programmeSlug || e.programmeSlug === currentSlug,
  );

  const displayName = programme.name || programme.headline;
  const displayBody = programme.body || programme.seoDescription;

  return (
    <div className="w-full bg-[#fbfaf6] text-[#111317]">
      {/* 1. DOSSIER HEADER */}
      <section className="border-b border-[#e4e0d4] pt-12 pb-16 md:pt-20 md:pb-24">
        <div className="magazine-container">
          <div className="max-w-5xl">
            <div className="flex items-center gap-3">
              <span className="magazine-kicker">Programme Dossier</span>
              <span className="h-px w-8 bg-[#e4e0d4]" />
              <span className="font-mono text-xs uppercase tracking-wider text-[#7a7e8a]">
                Public Wealth Intelligence
              </span>
            </div>

            <h1 className="magazine-headline-display mt-3">
              {displayName}
            </h1>

            <p className="magazine-deck mt-6 max-w-3xl">
              {displayBody}
            </p>

            <div className="magazine-byline mt-8">
              <span>Programme Lead: <strong>BNS Editorial Board</strong></span>
              <span>Scope: <strong>Kenya 47 Counties</strong></span>
              <span>Status: <strong>Active Public Record</strong></span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. THE EDITORIAL THESIS & FORENSIC PROBLEM */}
      <section className="border-b border-[#e4e0d4] py-16 md:py-20 bg-[#ffffff]">
        <div className="magazine-container">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            <div className="lg:col-span-7">
              <span className="magazine-kicker">Investigation Mandate</span>
              <h2 className="font-serif text-3xl md:text-4xl font-black text-[#111317] mt-2">
                Why this record matters.
              </h2>

              <div className="magazine-prose magazine-drop-cap mt-6">
                <p>
                  Public finances cannot protect citizen welfare if they remain confined to closed parliamentary committee rooms.
                  Through {displayName}, Budget Ndio Story monitors the lifecycle of public money,
                  publishing independent evidence that journalists, community leaders, and citizens can use immediately.
                </p>
                <p>
                  We cross-reference Treasury exchequer releases against county implementation reports,
                  highlighting discrepancies between approved appropriations and actual physical delivery.
                </p>
              </div>

              <blockquote className="magazine-quote-pull mt-8">
                Democracy is verified when citizens examine the invoice for themselves.
                <cite>BNS Field Methodology Charter</cite>
              </blockquote>
            </div>

            <div className="lg:col-span-5 space-y-6">
              <div className="magazine-card magazine-card-featured">
                <span className="magazine-kicker">Core Deliverables</span>
                <h3 className="font-serif text-xl font-bold text-[#111317] mt-1">
                  Outputs of Record
                </h3>
                <ul className="mt-4 space-y-3 font-serif text-sm text-[#525660]">
                  <li className="flex items-start gap-2">
                    <span className="text-[#96702e] font-bold">-</span>
                    <span>Quarterly fiscal tracking briefings and parliamentary policy dossiers</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#96702e] font-bold">-</span>
                    <span>Direct county clinic and infrastructure inspection audits</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#96702e] font-bold">-</span>
                    <span>Open access datasets published without licensing paywalls</span>
                  </li>
                </ul>
              </div>

              <div className="magazine-card">
                <span className="magazine-kicker">Get Involved</span>
                <h3 className="font-serif text-xl font-bold text-[#111317] mt-1">
                  Citizen Participation
                </h3>
                <p className="mt-3 text-sm font-serif leading-relaxed text-[#525660]">
                  Are you tracking a stalled dispensary, feeder road, or county bursary fund in your ward?
                  Submit evidence directly to our investigations desk.
                </p>
                <Link
                  href="/contact"
                  className="magazine-btn magazine-btn-outline mt-6 w-full text-center justify-center"
                >
                  Submit County Tip-Off
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. FIELD EVIDENCE & PUBLISHED STORIES */}
      {evidenceList.length > 0 ? (
        <section className="border-b border-[#e4e0d4] py-16 md:py-24 bg-[#fbfaf6]">
          <div className="magazine-container">
            <div className="border-b border-[#111317] pb-6 mb-12 flex flex-col md:flex-row md:items-end justify-between">
              <div>
                <span className="magazine-kicker">Field Evidence</span>
                <h2 className="font-serif text-3xl md:text-4xl font-black text-[#111317]">
                  Verified Files from {displayName}
                </h2>
              </div>
              <p className="mt-2 md:mt-0 font-serif italic text-sm text-[#525660]">
                Direct reports cross-referenced with county expenditure.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {evidenceList.slice(0, 3).map((item) => (
                <article key={item.id} className="magazine-card">
                  {item.thumbnail ? (
                    <div className="relative aspect-[16/10] w-full mb-4 overflow-hidden border border-[#e4e0d4]">
                      <Image
                        src={item.thumbnail}
                        alt={item.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                    </div>
                  ) : null}
                  <div>
                    <span className="magazine-kicker">{item.county || "Kenya County"}</span>
                    <h3 className="font-serif text-xl font-bold text-[#111317] mt-1 line-clamp-2">
                      <Link href={`/bns-project/${item.slug || item.id}`} className="hover:underline">
                        {item.title}
                      </Link>
                    </h3>
                    <p className="mt-3 text-sm font-serif leading-relaxed text-[#525660] line-clamp-3">
                      {item.lede || "Investigative evidence file from the field."}
                    </p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-[#e4e0d4]">
                    <Link
                      href={`/bns-project/${item.slug || item.id}`}
                      className="font-mono text-[11px] uppercase tracking-widest font-bold text-[#111317] hover:text-[#96702e]"
                    >
                      Read Evidence File -
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {/* 4. OTHER CIVIC PROGRAMMES NAVIGATION */}
      <section className="py-16 md:py-24 bg-[#ffffff]">
        <div className="magazine-container">
          <div className="border-b border-[#111317] pb-6 mb-12">
            <span className="magazine-kicker">Navigation Index</span>
            <h2 className="font-serif text-3xl md:text-4xl font-black text-[#111317]">
              Explore Other Programmes of Record
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {otherProgrammes.map((p) => (
              <div key={p.slug} className="magazine-card">
                <div>
                  <span className="magazine-kicker">Programme</span>
                  <h3 className="font-serif text-2xl font-bold text-[#111317] mt-1">
                    <Link href={`/programmes/${p.slug}`} className="hover:underline">
                      {p.name || p.headline}
                    </Link>
                  </h3>
                  <p className="mt-3 text-sm font-serif leading-relaxed text-[#525660]">
                    {p.body || "Explore Budget Ndio Story programmatic evidence."}
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-[#e4e0d4]">
                  <Link
                    href={`/programmes/${p.slug}`}
                    className="magazine-btn magazine-btn-outline w-full text-center justify-center"
                  >
                    View {p.name || p.headline} Dossier
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
