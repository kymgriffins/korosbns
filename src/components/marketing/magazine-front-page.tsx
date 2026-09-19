"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type {
  FeaturedProjectsContent,
  LandingContent,
} from "@/lib/cms-live-data";

type MagazineFrontPageProps = {
  landingData?: Partial<LandingContent>;
  featuredProjects?: Partial<FeaturedProjectsContent> | null;
};

type FrontPageStory = {
  id?: string;
  title: string;
  href: string;
  prose?: string;
  thumbnail?: string;
  programmeLabel?: string;
  authorName?: string;
  publishedAt?: string;
};

const defaultPillars = [
  {
    slug: "connect",
    eyebrow: "Macro Policy",
    title: "National Budget Intelligence",
    lede: "Tracking debt amortization, national appropriations, and parliamentary fiscal legislation before bills become binding law.",
    href: "/programmes/connect",
    stat: "KSh 4.8T",
    statLabel: "Appropriation Tracked",
  },
  {
    slug: "mashinani",
    eyebrow: "Ground Forensics",
    title: "County Delivery Evidence",
    lede: "Following funds past county treasury accounts to verify clinics, boreholes, feeder roads, and community bursaries across Kenya.",
    href: "/programmes/mashinani",
    stat: "47 Counties",
    statLabel: "Community Audits",
  },
  {
    slug: "wanahabari-lab",
    eyebrow: "Newsroom Support",
    title: "Investigative Journalism Lab",
    lede: "Equipping grassroots reporters and community radios with forensic data toolkits to investigate public procurement.",
    href: "/programmes/wanahabari-lab",
    stat: "120+ Stories",
    statLabel: "Published Investigations",
  },
  {
    slug: "studios",
    eyebrow: "Creative Evidence",
    title: "BNS Documentary Studios",
    lede: "Translating complex audit spreadsheets into compelling cinematic documentaries, short-form investigations, and public records.",
    href: "/bns-studio",
    stat: "100% Open",
    statLabel: "Public Record",
  },
] as const;

function getStories(
  featuredProjects?: Partial<FeaturedProjectsContent> | null,
): FrontPageStory[] {
  const results = (featuredProjects as { results?: FrontPageStory[] } | null | undefined)
    ?.results;
  return Array.isArray(results) && results.length > 0
    ? results
    : [
        {
          id: "project-terra",
          title: "Project TERRA: The Ground Truth of Rural Infrastructure Allocations",
          href: "/bns-project/project-terra",
          prose: "A six-month investigative audit cross-referencing county expenditure reports with ground photography, contractor filings, and citizen testimony.",
          thumbnail: "/images/towwnhallmay/129A3912.jpg",
          programmeLabel: "Mashinani Investigation",
          authorName: "BNS Investigations Desk",
          publishedAt: "September 2026",
        },
      ];
}

function getStoryImage(story: FrontPageStory | undefined) {
  return story?.thumbnail || "/images/towwnhallmay/129A3912.jpg";
}

export function MagazineFrontPage({
  landingData,
  featuredProjects,
}: MagazineFrontPageProps) {
  const stories = getStories(featuredProjects);
  const leadStory = stories[0];
  const secondaryStories = stories.slice(1, 4);
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterDone, setNewsletterDone] = useState(false);

  const hero = landingData?.heroNarrative;

  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail.trim().includes("@")) {
      setNewsletterDone(true);
    }
  };

  return (
    <div className="w-full bg-[#fbfaf6] text-[#111317]">
      {/* 1. COVER STORY HERO SPREAD */}
      <section className="border-b border-[#e4e0d4] pt-8 pb-16 md:pt-14 md:pb-24">
        <div className="magazine-container">
          <div className="max-w-5xl">
            <span className="magazine-kicker">
              {hero?.eyebrow || "Cover Investigation - Kenya Public Wealth"}
            </span>

            <h1 className="magazine-headline-display mt-3">
              {hero?.title || "The Journey of Kenya's KSh 4.8 Trillion."}
            </h1>

            <p className="magazine-deck mt-6 max-w-3xl">
              {hero?.lede ||
                "From Treasury appropriations in Nairobi to county dispensaries and rural roads, we track the verified trajectory of public money through independent reporting."}
            </p>

            <div className="magazine-byline mt-8">
              <span>By <strong>BNS Investigations Desk</strong></span>
              <span>Nairobi, Kenya</span>
              <span>Reading Time: 8 min</span>
              <span>Volume IV Edition</span>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                href={leadStory?.href || "/bns-project/project-terra"}
                className="magazine-btn magazine-btn-primary"
              >
                Read Cover Investigation
              </Link>
              <Link
                href="/programmes"
                className="magazine-btn magazine-btn-outline"
              >
                Explore Programmes
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 2. CINEMATIC INVESTIGATION STILL & ASYMMETRIC BRIEF */}
      {leadStory ? (
        <section className="border-b border-[#e4e0d4] bg-[#ffffff]">
          <div className="magazine-container py-12 md:py-16">
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-14 items-center">
              <div className="lg:col-span-7">
                <Link
                  href={leadStory.href}
                  className="group relative block aspect-[16/10] w-full overflow-hidden bg-[#e4e0d4] border border-[#e4e0d4]"
                  aria-label={`Read ${leadStory.title}`}
                >
                  <Image
                    src={getStoryImage(leadStory)}
                    alt={leadStory.title}
                    fill
                    priority
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 1024px) 100vw, 60vw"
                  />
                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-[#111317]/85 to-transparent p-6 text-[#ffffff]">
                    <span className="font-mono text-[10px] uppercase tracking-[0.2em] font-semibold text-[#d1ab65]">
                      {leadStory.programmeLabel || "Verified Field Evidence"}
                    </span>
                    <p className="mt-1 font-serif text-lg md:text-xl font-bold line-clamp-2">
                      {leadStory.title}
                    </p>
                  </div>
                </Link>
              </div>

              <div className="lg:col-span-5 flex flex-col justify-between">
                <div>
                  <span className="magazine-kicker">Editorial Thesis</span>
                  <h2 className="font-serif text-3xl md:text-4xl font-black tracking-[-0.03em] leading-tight text-[#111317]">
                    The public record is not a spectator sport.
                  </h2>
                  <p className="mt-5 font-serif text-lg leading-relaxed text-[#525660]">
                    Public budgets in Kenya have historically lived behind dense bureaucratic language,
                    releasing numbers only when policy decisions are already irreversible.
                    We open the paper trail, verify physical works, and hand the evidence back to citizens.
                  </p>
                </div>

                <div className="mt-8 pt-6 border-t border-[#e4e0d4] grid grid-cols-2 gap-6">
                  <div>
                    <span className="block font-serif text-3xl font-black text-[#111317]">47</span>
                    <span className="block font-mono text-[11px] uppercase tracking-wider text-[#7a7e8a] mt-1">
                      Counties Monitored
                    </span>
                  </div>
                  <div>
                    <span className="block font-serif text-3xl font-black text-[#111317]">KSh 4.8T</span>
                    <span className="block font-mono text-[11px] uppercase tracking-wider text-[#7a7e8a] mt-1">
                      National Budget Tracked
                    </span>
                  </div>
                </div>

                <div className="mt-8">
                  <Link
                    href={leadStory.href}
                    className="magazine-btn magazine-btn-outline w-full text-center justify-center"
                  >
                    Open Investigation Dossier
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {/* 3. THE BIG READ: 3-COLUMN EDITORIAL INTELLIGENCE SPREAD */}
      <section className="border-b border-[#e4e0d4] py-16 md:py-24 bg-[#fbfaf6]">
        <div className="magazine-container">
          <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-[#111317] pb-6 mb-12">
            <div>
              <span className="magazine-kicker">Public Wealth Intelligence</span>
              <h2 className="font-serif text-3xl md:text-5xl font-black tracking-[-0.04em] text-[#111317]">
                The Investigative Desks
              </h2>
            </div>
            <p className="mt-4 md:mt-0 font-serif italic text-[#525660] max-w-md text-sm md:text-base">
              Independent civic journalism tracking the journey of public money from Nairobi to the grassroots.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <article className="magazine-card">
              <div>
                <span className="magazine-kicker">National Intelligence</span>
                <h3 className="font-serif text-2xl font-bold tracking-tight text-[#111317] mt-2">
                  Debt Amortization vs. Public Service Delivery
                </h3>
                <p className="mt-4 font-serif text-base leading-relaxed text-[#525660]">
                  How statutory debt servicing claims over sixty percent of collected revenues before a single shilling reaches hospital drugs or school classrooms.
                </p>
              </div>
              <div className="mt-8 pt-4 border-t border-[#e4e0d4] flex items-center justify-between">
                <span className="font-mono text-[11px] uppercase tracking-wider text-[#7a7e8a]">Connect Desk</span>
                <Link
                  href="/programmes/connect"
                  className="font-mono text-[11px] uppercase tracking-widest font-bold text-[#111317] hover:text-[#96702e]"
                >
                  Read Brief -
                </Link>
              </div>
            </article>

            <article className="magazine-card">
              <div>
                <span className="magazine-kicker">County Accountability</span>
                <h3 className="font-serif text-2xl font-bold tracking-tight text-[#111317] mt-2">
                  The Mystery of Disbursed Yet Unfinished Clinics
                </h3>
                <p className="mt-4 font-serif text-base leading-relaxed text-[#525660]">
                  Our grassroots auditors surveyed maternal wards in Nakuru, Kisumu, and Mombasa to match bank debit transfers against actual roofing sheets.
                </p>
              </div>
              <div className="mt-8 pt-4 border-t border-[#e4e0d4] flex items-center justify-between">
                <span className="font-mono text-[11px] uppercase tracking-wider text-[#7a7e8a]">Mashinani Desk</span>
                <Link
                  href="/programmes/mashinani"
                  className="font-mono text-[11px] uppercase tracking-widest font-bold text-[#111317] hover:text-[#96702e]"
                >
                  Read Brief -
                </Link>
              </div>
            </article>

            <article className="magazine-card">
              <div>
                <span className="magazine-kicker">Forensic Toolkits</span>
                <h3 className="font-serif text-2xl font-bold tracking-tight text-[#111317] mt-2">
                  Equipping Community Radios to Question Procurement
                </h3>
                <p className="mt-4 font-serif text-base leading-relaxed text-[#525660]">
                  Wanahabari Lab trains community journalists to decode County Integrated Development Plans (CIDPs) and interview local officials with receipts.
                </p>
              </div>
              <div className="mt-8 pt-4 border-t border-[#e4e0d4] flex items-center justify-between">
                <span className="font-mono text-[11px] uppercase tracking-wider text-[#7a7e8a]">Wanahabari Lab</span>
                <Link
                  href="/programmes/wanahabari-lab"
                  className="font-mono text-[11px] uppercase tracking-widest font-bold text-[#111317] hover:text-[#96702e]"
                >
                  Read Brief -
                </Link>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* 4. CIVIC MOVEMENT: OBAMA.ORG INSPIRED SPREAD */}
      <section className="border-b border-[#e4e0d4] bg-[#f4f0e6] py-16 md:py-24">
        <div className="magazine-container">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            <div className="lg:col-span-7">
              <span className="magazine-kicker">Civic Movement Platform</span>
              <h2 className="magazine-headline-display mt-2 text-3xl sm:text-5xl md:text-6xl">
                Hope is not a passive sentiment. It is civic work.
              </h2>
              <p className="mt-6 font-serif text-lg md:text-xl leading-relaxed text-[#525660] max-w-2xl">
                True democratic oversight begins when citizens in community halls and marketplace assemblies understand exactly how public debt, taxes, and county expenditures shape their daily survival.
              </p>

              <blockquote className="magazine-quote-pull mt-8">
                Public wealth belongs to 55 million citizens, not backroom parliamentary committees.
                <cite>Faith Muthoni, BNS Grassroots Civic Fellow</cite>
              </blockquote>

              <div className="mt-8 flex flex-wrap gap-4">
                <Link href="/obama-org" className="magazine-btn magazine-btn-primary">
                  Explore Movement Platform
                </Link>
                <Link href="/programmes" className="magazine-btn magazine-btn-outline">
                  View Civic Catalog
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5 space-y-6">
              <div className="magazine-card magazine-card-dark">
                <span className="magazine-kicker">01 / Civic Literacy</span>
                <h3 className="font-serif text-2xl font-bold">Demystifying the Finance Bill</h3>
                <p className="mt-2 text-sm leading-relaxed">
                  Simplifying tax provisions, statutory levies, and public expenditure frameworks for everyday citizens.
                </p>
              </div>

              <div className="magazine-card magazine-card-dark">
                <span className="magazine-kicker">02 / Forensic Verification</span>
                <h3 className="font-serif text-2xl font-bold">Physical Audit Teams</h3>
                <p className="mt-2 text-sm leading-relaxed">
                  Cross-checking contractor payment vouchers against physical ground delivery in healthcare and water works.
                </p>
              </div>

              <div className="magazine-card magazine-card-dark">
                <span className="magazine-kicker">03 / People Assemblies</span>
                <h3 className="font-serif text-2xl font-bold">Community Town Halls</h3>
                <p className="mt-2 text-sm leading-relaxed">
                  Convening open citizen assemblies where local representatives answer directly to their constituents.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. THE FOUR PILLARS: BESPOKE PROGRAMMES SHOWCASE */}
      <section className="border-b border-[#e4e0d4] py-16 md:py-24 bg-[#ffffff]">
        <div className="magazine-container">
          <div className="border-b border-[#111317] pb-6 mb-12 flex flex-col md:flex-row md:items-end justify-between">
            <div>
              <span className="magazine-kicker">Institutional Framework</span>
              <h2 className="font-serif text-3xl md:text-5xl font-black tracking-tight text-[#111317]">
                Programmes of Record
              </h2>
            </div>
            <Link
              href="/programmes"
              className="mt-4 md:mt-0 font-mono text-xs uppercase tracking-widest font-bold text-[#111317] hover:underline"
            >
              All Programmes Index -
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {defaultPillars.map((pillar) => (
              <div key={pillar.slug} className="magazine-card">
                <div>
                  <span className="magazine-kicker">{pillar.eyebrow}</span>
                  <h3 className="font-serif text-2xl font-bold text-[#111317] mt-2">
                    <Link href={pillar.href} className="hover:underline">
                      {pillar.title}
                    </Link>
                  </h3>
                  <p className="mt-4 text-sm font-serif leading-relaxed text-[#525660]">
                    {pillar.lede}
                  </p>
                </div>
                <div className="mt-8 pt-4 border-t border-[#e4e0d4]">
                  <span className="block font-serif text-2xl font-black text-[#111317]">
                    {pillar.stat}
                  </span>
                  <span className="block font-mono text-[10px] uppercase tracking-wider text-[#7a7e8a] mt-0.5">
                    {pillar.statLabel}
                  </span>
                  <Link
                    href={pillar.href}
                    className="mt-4 inline-block font-mono text-[11px] uppercase tracking-widest font-bold text-[#111317] hover:text-[#96702e]"
                  >
                    Enter Programme -
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. WEEKLY DISPATCH SUBSCRIPTION */}
      <section className="py-16 md:py-24 bg-[#fbfaf6]">
        <div className="magazine-container">
          <div className="mx-auto max-w-3xl border border-[#111317] bg-[#ffffff] p-8 md:p-14 text-center">
            <span className="magazine-kicker">The Editorial Dispatch</span>
            <h2 className="font-serif text-3xl md:text-4xl font-black text-[#111317] mt-2">
              Receive the Weekly Public Wealth Briefing
            </h2>
            <p className="mt-4 font-serif text-base md:text-lg text-[#525660] max-w-xl mx-auto leading-relaxed">
              Curated investigative summaries, county budget alerts, and forensic breakdowns delivered every Friday morning.
            </p>

            {newsletterDone ? (
              <div className="mt-8 p-4 bg-[#f4f0e6] border border-[#e4e0d4] text-[#111317] font-serif text-base">
                You are now subscribed to the Budget Ndio Story weekly public wealth dispatch.
              </div>
            ) : (
              <form onSubmit={handleNewsletter} className="mt-8 flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
                <input
                  type="email"
                  required
                  placeholder="Enter your email address"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  className="flex-1 border border-[#111317] px-4 py-3 text-sm font-mono text-[#111317] placeholder:text-[#7a7e8a] focus:outline-none focus:ring-2 focus:ring-[#111317]"
                />
                <button
                  type="submit"
                  className="magazine-btn magazine-btn-primary whitespace-nowrap"
                >
                  Subscribe
                </button>
              </form>
            )}

            <p className="mt-4 font-mono text-[10px] uppercase tracking-wider text-[#7a7e8a]">
              No advertisements. No commercial sponsors. Verified civic facts only.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
