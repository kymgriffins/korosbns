"use client";

import Link from "next/link";
import Image from "next/image";
import type {
  FeaturedProjectsContent,
  ProgrammesContent,
} from "@/lib/cms-live-data";

type MagazineProgrammesHubProps = {
  programmesData?: Partial<ProgrammesContent>;
  featuredProjects?: Partial<FeaturedProjectsContent> | null;
};

const PROGRAMME_DOSSIERS = [
  {
    slug: "connect",
    eyebrow: "National Intelligence",
    title: "BNS Connect",
    subhead: "Macro fiscal policy, debt amortization, and parliamentary scrutiny",
    lede: "Tracking national budget decisions before they become law. Connect investigates external debt burdens, Treasury revenue projections, and parliamentary Appropriations Bills to explain what fiscal policy means for ordinary Kenyans.",
    metrics: [
      { label: "Appropriations Tracked", value: "KSh 4.8T" },
      { label: "Parliamentary Sittings Monitored", value: "85+" },
      { label: "Policy Dossiers", value: "24 Files" },
    ],
    href: "/programmes/connect",
    accent: "National Fiscal Scope",
  },
  {
    slug: "mashinani",
    eyebrow: "Ground Verification",
    title: "BNS Mashinani",
    subhead: "County delivery, maternal clinics, and community public audits",
    lede: "Following funds past county treasury accounts to verify clinics, boreholes, feeder roads, and community bursaries. Mashinani brings auditors and citizens together to physically inspect public infrastructure.",
    metrics: [
      { label: "Counties Audited", value: "47 Counties" },
      { label: "Ground Inspections", value: "340+ Sites" },
      { label: "Citizen Assembly Turnout", value: "18,000+" },
    ],
    href: "/programmes/mashinani",
    accent: "County Grassroots Scope",
  },
  {
    slug: "wanahabari-lab",
    eyebrow: "Newsroom Support",
    title: "Wanahabari Lab",
    subhead: "Investigative forensics, journalist fellowships, and community radio toolkits",
    lede: "Equipping grassroots reporters and community radios with forensic data toolkits to investigate public procurement. Wanahabari Lab ensures the public record survives beyond official press conferences.",
    metrics: [
      { label: "Fellowship Journalists", value: "65 Reporters" },
      { label: "Investigative Reports Published", value: "120+ Stories" },
      { label: "Radio Stations Reached", value: "32 Outlets" },
    ],
    href: "/programmes/wanahabari-lab",
    accent: "Journalism & Media Scope",
  },
  {
    slug: "studios",
    eyebrow: "Documentary Production",
    title: "BNS Studio",
    subhead: "Commissioned evidence, documentary films, and visual records",
    lede: "Translating dense audit spreadsheets and procurement vouchers into compelling cinematic documentaries, town hall video records, and audio field dispatches for wide public access.",
    metrics: [
      { label: "Documentaries Produced", value: "14 Films" },
      { label: "Community Screenings", value: "52 Events" },
      { label: "Open Archive Access", value: "100% Free" },
    ],
    href: "/programmes/studios",
    accent: "Visual Evidence Scope",
  },
];

export function MagazineProgrammesHub({
  featuredProjects,
}: MagazineProgrammesHubProps) {
  const projectList = (featuredProjects as { results?: Array<{ id: string; title: string; href: string; prose?: string; thumbnail?: string; programmeLabel?: string }> })?.results || [];

  return (
    <div className="w-full bg-[#fbfaf6] text-[#111317]">
      {/* 1. INSTITUTIONAL MASTHEAD BANNER */}
      <section className="border-b border-[#e4e0d4] pt-12 pb-16 md:pt-20 md:pb-24">
        <div className="magazine-container">
          <div className="max-w-5xl">
            <span className="magazine-kicker">Institutional Framework</span>
            <h1 className="magazine-headline-display mt-3">
              Four Disciplines of Fiscal Accountability.
            </h1>
            <p className="magazine-deck mt-6 max-w-3xl">
              Budget Ndio Story organizes its public wealth tracking into four programmatic pillars,
              following money from national debt negotiations in Nairobi to county clinics and community newsrooms.
            </p>

            <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-6 pt-6 border-t border-[#e4e0d4]">
              <div>
                <span className="block font-serif text-3xl md:text-4xl font-black text-[#111317]">KSh 4.8T</span>
                <span className="block font-mono text-[10px] uppercase tracking-wider text-[#7a7e8a] mt-1">National Budget Monitored</span>
              </div>
              <div>
                <span className="block font-serif text-3xl md:text-4xl font-black text-[#111317]">47</span>
                <span className="block font-mono text-[10px] uppercase tracking-wider text-[#7a7e8a] mt-1">Counties Covered</span>
              </div>
              <div>
                <span className="block font-serif text-3xl md:text-4xl font-black text-[#111317]">120+</span>
                <span className="block font-mono text-[10px] uppercase tracking-wider text-[#7a7e8a] mt-1">Published Files</span>
              </div>
              <div>
                <span className="block font-serif text-3xl md:text-4xl font-black text-[#111317]">100%</span>
                <span className="block font-mono text-[10px] uppercase tracking-wider text-[#7a7e8a] mt-1">Open Public Record</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. PROGRAMME DOSSIERS */}
      <section className="border-b border-[#e4e0d4] py-16 md:py-24 bg-[#ffffff]">
        <div className="magazine-container">
          <div className="space-y-16">
            {PROGRAMME_DOSSIERS.map((dossier, idx) => (
              <article
                key={dossier.slug}
                className="border border-[#e4e0d4] bg-[#fbfaf6] p-8 md:p-12 hover:border-[#111317] transition-colors"
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
                  <div className="lg:col-span-8">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#96702e]">
                        0{idx + 1} / {dossier.eyebrow}
                      </span>
                      <span className="h-px w-8 bg-[#e4e0d4]" />
                      <span className="font-mono text-[11px] uppercase tracking-wider text-[#7a7e8a]">
                        {dossier.accent}
                      </span>
                    </div>

                    <h2 className="font-serif text-3xl md:text-5xl font-black text-[#111317] mt-3">
                      <Link href={dossier.href} className="hover:underline">
                        {dossier.title}
                      </Link>
                    </h2>

                    <p className="mt-2 font-serif text-lg italic text-[#525660]">
                      {dossier.subhead}
                    </p>

                    <p className="mt-5 font-serif text-base md:text-lg leading-relaxed text-[#111317] max-w-3xl">
                      {dossier.lede}
                    </p>

                    <div className="mt-8 pt-6 border-t border-[#e4e0d4] flex flex-wrap gap-8">
                      {dossier.metrics.map((m) => (
                        <div key={m.label}>
                          <span className="block font-serif text-2xl font-black text-[#111317]">{m.value}</span>
                          <span className="block font-mono text-[10px] uppercase tracking-wider text-[#7a7e8a] mt-0.5">{m.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="lg:col-span-4 flex flex-col justify-between h-full space-y-6">
                    <div className="bg-[#ffffff] p-6 border border-[#e4e0d4]">
                      <span className="magazine-kicker">Action Mandate</span>
                      <p className="text-sm font-serif leading-relaxed text-[#525660] mt-2">
                        Citizen participation requires accessible data. We publish all methodologies, raw filings, and interview records open-access.
                      </p>
                    </div>

                    <Link
                      href={dossier.href}
                      className="magazine-btn magazine-btn-primary w-full text-center justify-center"
                    >
                      Enter {dossier.title} Dossier
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 3. VERIFIED INVESTIGATION REPORTS */}
      {projectList.length > 0 ? (
        <section className="py-16 md:py-24 bg-[#fbfaf6]">
          <div className="magazine-container">
            <div className="border-b border-[#111317] pb-6 mb-12 flex flex-col md:flex-row md:items-end justify-between">
              <div>
                <span className="magazine-kicker">Forensic Evidence</span>
                <h2 className="font-serif text-3xl md:text-4xl font-black text-[#111317]">
                  Published Project Investigations
                </h2>
              </div>
              <p className="mt-2 md:mt-0 font-serif italic text-sm text-[#525660]">
                Verified reports filed across Kenya&apos;s 47 counties.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {projectList.slice(0, 3).map((item) => (
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
                    <span className="magazine-kicker">{item.programmeLabel || "Investigation File"}</span>
                    <h3 className="font-serif text-xl font-bold text-[#111317] mt-1 line-clamp-2">
                      <Link href={item.href || `/bns-project/${item.id}`} className="hover:underline">
                        {item.title}
                      </Link>
                    </h3>
                    <p className="mt-3 text-sm font-serif leading-relaxed text-[#525660] line-clamp-3">
                      {item.prose || "Verified investigation on public fund utilization."}
                    </p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-[#e4e0d4]">
                    <Link
                      href={item.href || `/bns-project/${item.id}`}
                      className="font-mono text-[11px] uppercase tracking-widest font-bold text-[#111317] hover:text-[#96702e]"
                    >
                      Read Investigation File -
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </div>
  );
}
