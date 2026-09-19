"use client";

import Link from "next/link";

const MASTHEAD_TEAM = [
  {
    role: "Editorial Director & Founder",
    name: "Griffins Kimutai",
    bio: "Civic data investigative editor focusing on public debt frameworks, parliamentary fiscal accountability, and youth participation across Kenya.",
  },
  {
    role: "County Forensics Lead",
    name: "Faith Muthoni",
    bio: "Field investigation coordinator leading grassroots audit assemblies, dispensary tracking, and community town halls across 47 counties.",
  },
  {
    role: "Investigations Desk Editor",
    name: "Kaneo Editorial Bureau",
    bio: "Forensic document analysis, Public Procurement Information Portal (PPIP) auditing, and county budget verification.",
  },
  {
    role: "Newsroom & Radios Lead",
    name: "Wanahabari Fellowships",
    bio: "Training regional community radio producers and local reporters to parse County Integrated Development Plans (CIDPs).",
  },
];

const CORE_PRINCIPLES = [
  {
    num: "01",
    title: "Documentary Proof Over Political Rhetoric",
    body: "Every claim published by Budget Ndio Story is verified against primary Treasury documents, parliamentary Hansards, Controller of Budget reports, or physical ground photography.",
  },
  {
    num: "02",
    title: "Radical Public Transparency",
    body: "We do not place our investigative files behind commercial paywalls. Public money belongs to the citizenry, and civic knowledge must remain freely accessible to every Kenyan.",
  },
  {
    num: "03",
    title: "Strict Editorial Independence",
    body: "Our editorial decisions are made independently of government bodies, political parties, and corporate sponsors. We report the numbers as the record shows them.",
  },
];

export function MagazineAbout() {
  return (
    <div className="w-full bg-[#fbfaf6] text-[#111317]">
      {/* 1. MASTHEAD HERO */}
      <section className="border-b border-[#e4e0d4] pt-12 pb-16 md:pt-20 md:pb-24">
        <div className="magazine-container">
          <div className="max-w-5xl">
            <span className="magazine-kicker">The Masthead & Charter</span>
            <h1 className="magazine-headline-display mt-3">
              Independent Civic Journalism for Kenya&apos;s Public Money.
            </h1>
            <p className="magazine-deck mt-6 max-w-3xl">
              Budget Ndio Story is an independent civic media and public wealth intelligence publication,
              tracking Kenya&apos;s national budget, parliamentary bills, and county delivery from an editorial desk in Nairobi.
            </p>

            <div className="magazine-byline mt-8">
              <span>Founded: <strong>Nairobi, Kenya</strong></span>
              <span>Focus: <strong>Public Finance & Devolution</strong></span>
              <span>Charter: <strong>100% Non-Partisan</strong></span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. EDITORIAL CHARTER */}
      <section className="border-b border-[#e4e0d4] py-16 md:py-24 bg-[#ffffff]">
        <div className="magazine-container">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            <div className="lg:col-span-7">
              <span className="magazine-kicker">The Editorial Standard</span>
              <h2 className="font-serif text-3xl md:text-4xl font-black text-[#111317] mt-2">
                Our Investigative Charter
              </h2>

              <div className="magazine-prose magazine-drop-cap mt-6">
                <p>
                  Kenya allocates over four trillion shillings each fiscal year to national and county administrations.
                  Yet the majority of citizens learn about these fiscal commitments only when tax hikes,
                  medical supply stockouts, or stalled feeder roads disrupt their daily survival.
                </p>
                <p>
                  We believe that genuine public accountability begins when the budget is translated from
                  impenetrable bureaucratic accounting into clear, factual, and verified stories that citizens can read,
                  question, and use in their local town halls.
                </p>
              </div>

              <blockquote className="magazine-quote-pull mt-8">
                The public budget is not an administrative secret. It is the social contract between citizens and the state written in numbers.
                <cite>BNS Editorial Statement of Purpose</cite>
              </blockquote>
            </div>

            <div className="lg:col-span-5 space-y-6">
              {CORE_PRINCIPLES.map((principle) => (
                <div key={principle.num} className="magazine-card">
                  <span className="magazine-kicker">{principle.num} / Standard</span>
                  <h3 className="font-serif text-xl font-bold text-[#111317] mt-1">
                    {principle.title}
                  </h3>
                  <p className="mt-3 text-sm font-serif leading-relaxed text-[#525660]">
                    {principle.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 3. THE MASTHEAD ROSTER */}
      <section className="border-b border-[#e4e0d4] py-16 md:py-24 bg-[#fbfaf6]">
        <div className="magazine-container">
          <div className="border-b border-[#111317] pb-6 mb-12">
            <span className="magazine-kicker">Editorial Bureau</span>
            <h2 className="font-serif text-3xl md:text-4xl font-black text-[#111317]">
              The Editorial Roster
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {MASTHEAD_TEAM.map((member) => (
              <article key={member.name} className="magazine-card bg-[#ffffff]">
                <div>
                  <span className="magazine-kicker">{member.role}</span>
                  <h3 className="font-serif text-2xl font-bold text-[#111317] mt-1">
                    {member.name}
                  </h3>
                  <p className="mt-3 font-serif text-base leading-relaxed text-[#525660]">
                    {member.bio}
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-[#e4e0d4] flex items-center justify-between">
                  <span className="font-mono text-[10px] uppercase tracking-wider text-[#7a7e8a]">BNS Editorial Desk</span>
                  <span className="font-mono text-[10px] uppercase tracking-wider text-[#96702e] font-bold">Nairobi</span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 4. INSTITUTIONAL CONSORTIUM */}
      <section className="py-16 md:py-24 bg-[#ffffff]">
        <div className="magazine-container">
          <div className="max-w-3xl border border-[#111317] p-8 md:p-12 bg-[#fbfaf6]">
            <span className="magazine-kicker">Publishing Consortia</span>
            <h2 className="font-serif text-2xl md:text-3xl font-black text-[#111317] mt-2">
              Collaborative Civic Media
            </h2>
            <p className="mt-4 font-serif text-base leading-relaxed text-[#525660]">
              Budget Ndio Story collaborates with leading African media laboratories, including Sen Media & Events,
              The Continental Pot, and Colour Twist Media, to guarantee production excellence and nationwide distribution.
            </p>
            <div className="mt-8">
              <Link href="/contact" className="magazine-btn magazine-btn-primary">
                Contact Editorial Desk
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
