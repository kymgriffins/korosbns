"use client";

import {
  PROJECT_TERRA_METADATA as meta,
  projectTerraTranscript,
} from "@/content/projects";
import {
  ArrowRight,
  Building2,
  Cpu,
  Database,
  ExternalLink,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

export function ProjectTerraEditorial() {
  const [activeTab, setActiveTab] = useState<"segments" | "prose">("segments");
  const [searchQuery, setSearchQuery] = useState("");
  const [copied, setCopied] = useState(false);

  // Filter segments by search query
  const filteredSegments = useMemo(() => {
    if (!searchQuery.trim()) return projectTerraTranscript.segments;
    const query = searchQuery.toLowerCase();
    return projectTerraTranscript.segments.filter((seg) =>
      seg.text.toLowerCase().includes(query),
    );
  }, [searchQuery]);

  const handleCopy = () => {
    navigator.clipboard.writeText(projectTerraTranscript.full_transcript);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownloadJson = () => {
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(projectTerraTranscript, null, 2),
    )}`;
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", jsonString);
    downloadAnchor.setAttribute("download", "project-terra-transcript.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <article className="min-h-screen bg-background text-foreground selection:bg-primary/20">
      {/* 1. Masthead & Header */}
      <header className="relative border-b border-border/40 bg-muted/10 pt-24 pb-16 md:pt-32 md:pb-24">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          {/* Breadcrumb navigation */}
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-2 text-xs font-mono tracking-wider uppercase text-muted-foreground mb-8"
          >
            <Link href="/" className="hover:text-primary transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link
              href="/bns-project"
              className="hover:text-primary transition-colors"
            >
              Projects
            </Link>
            <span>/</span>
            <span className="text-foreground font-semibold">Project TERRA</span>
          </nav>

          {/* Institutional Eyebrow */}
          <div className="inline-flex flex-wrap items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3.5 py-1 text-xs font-medium text-primary mb-6">
            <Sparkles className="size-3.5" />
            <span>House of Fiscal Wisdom</span>
            <span className="text-muted-foreground/60">•</span>
            <span>Supported by Luminate</span>
            <span className="text-muted-foreground/60">•</span>
            <span className="font-mono">2026 – 2027</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground leading-[1.1] mb-6">
            Project TERRA:{" "}
            <span className="text-primary block mt-1 sm:inline sm:mt-0 font-normal italic">
              Technology, Equality, Regulatory Risk Assessment
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed font-light mb-10 max-w-3xl">
            How platform architectures, rating algorithms, and open-ended tax
            concessions systematically exclude African women workers from public
            fiscal systems — and how empirical sandboxes can invert digital
            governance across the continent.
          </p>

          {/* Institutional Metadata Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-8 border-t border-border/60 text-xs">
            <div>
              <span className="block text-muted-foreground uppercase tracking-wider mb-1 font-mono">
                Principal Investigator
              </span>
              <p className="font-semibold text-foreground text-sm">
                {meta.leadInvestigator.name}
              </p>
              <p className="text-muted-foreground">Public Finance Law</p>
            </div>
            <div>
              <span className="block text-muted-foreground uppercase tracking-wider mb-1 font-mono">
                Institutional Host
              </span>
              <p className="font-semibold text-foreground text-sm">
                {meta.institutionalHost.name}
              </p>
              <p className="text-muted-foreground">Nairobi, Kenya</p>
            </div>
            <div>
              <span className="block text-muted-foreground uppercase tracking-wider mb-1 font-mono">
                Programme Grant
              </span>
              <p className="font-semibold text-foreground text-sm">
                {meta.funder.name}
              </p>
              <p className="text-muted-foreground">Digital Rights & Tax</p>
            </div>
            <div>
              <span className="block text-muted-foreground uppercase tracking-wider mb-1 font-mono">
                Timeframe & Focus
              </span>
              <p className="font-semibold text-foreground text-sm">
                2026 – 2027 (Two-Year)
              </p>
              <p className="text-muted-foreground">Pan-African & Kenya Pilot</p>
            </div>
          </div>
        </div>
      </header>

      {/* 2. Video Documentary & Interactive Transcript Hub */}
      <section className="py-12 md:py-20 border-b border-border/40 bg-card/40">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 mb-6">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-primary font-semibold block mb-1">
                Visual Intelligence
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
                Documentary Announcement & Audio Intelligence
              </h2>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground font-mono">
              <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
              Runtime: {meta.video.durationFormatted} • 1080p Master
            </div>
          </div>

          {/* Video Player Frame */}
          <div className="relative overflow-hidden rounded-2xl border border-border/80 bg-black shadow-2xl aspect-video mb-8">
            <iframe
              src={meta.video.embedUrl}
              title={meta.video.title}
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>

          {/* Transcript Control Center (Verbatim) */}
          <div className="rounded-2xl border border-border/70 bg-background/60 p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => setActiveTab("segments")}
                  aria-pressed={activeTab === "segments"}
                  className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-mono font-bold transition-colors ${
                    activeTab === "segments"
                      ? "border-primary/40 bg-primary/10 text-primary"
                      : "border-border/60 bg-card text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Verbatim cards
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("prose")}
                  aria-pressed={activeTab === "prose"}
                  className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-mono font-bold transition-colors ${
                    activeTab === "prose"
                      ? "border-primary/40 bg-primary/10 text-primary"
                      : "border-border/60 bg-card text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Full transcript
                </button>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopy}
                  className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card px-4 py-2 text-xs font-mono font-bold text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors"
                >
                  <span>{copied ? "Copied" : "Copy full transcript"}</span>
                </button>
                <button
                  type="button"
                  onClick={handleDownloadJson}
                  className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background px-4 py-2 text-xs font-mono font-bold text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors"
                >
                  Download JSON
                </button>
              </div>
            </div>

            {activeTab === "segments" ? (
              <>
                <label className="block mb-3">
                  <span className="block mb-1 text-[11px] font-mono font-bold uppercase tracking-widest text-muted-foreground">
                    Search verbatim
                  </span>
                  <input
                    type="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="e.g. women, algorithm, rules, ledger…"
                    className="w-full rounded-xl border border-border/60 bg-card px-4 py-2 text-sm font-medium text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </label>

                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {filteredSegments.slice(0, 10).map((seg) => (
                    <div
                      key={seg.id}
                      className="rounded-xl border border-border/60 bg-card p-4 hover:border-primary/40 transition-colors"
                    >
                      <div className="flex items-center justify-between gap-3 mb-2">
                        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-muted-foreground">
                          {formatTime(seg.start)}–{formatTime(seg.end)}
                        </span>
                        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-primary/90">
                          {String(seg.id).padStart(2, "0")}
                        </span>
                      </div>
                      <p className="text-sm leading-relaxed text-foreground/90 font-serif">
                        {seg.text}
                      </p>
                    </div>
                  ))}
                </div>

                {filteredSegments.length > 10 ? (
                  <p className="mt-3 text-xs text-muted-foreground font-mono">
                    Showing 10 of {filteredSegments.length} segments. Use search to narrow.
                  </p>
                ) : null}
              </>
            ) : (
              <div className="mt-2 max-h-96 overflow-auto rounded-xl border border-border/60 bg-card p-4">
                <pre className="text-sm leading-relaxed whitespace-pre-wrap font-serif">
                  {projectTerraTranscript.full_transcript}
                </pre>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 3. Executive Analysis: The Core Thesis */}
      <section className="py-16 md:py-24 max-w-4xl mx-auto px-6 lg:px-8 font-serif text-lg leading-relaxed text-foreground/90 space-y-8">
        <div>
          <span className="font-sans text-xs font-mono uppercase tracking-widest text-primary font-bold block mb-2">
            The Analytical Problem
          </span>
          <h2 className="font-sans text-2xl sm:text-4xl font-extrabold tracking-tight text-foreground leading-tight">
            The Digital Economy Has an Address:{" "}
            <span className="font-normal italic text-primary">
              Why Africa&apos;s Women Workers Are Written Out of the Ledger
            </span>
          </h2>
        </div>

        <p className="first-letter:text-5xl first-letter:font-bold first-letter:float-left first-letter:mr-3 first-letter:text-primary font-serif">
          Africa is experiencing rapid digital acceleration. From urban centers
          to rural markets, from ride-hailing and courier dispatch to mobile
          money rails, everyday economic exchange is being mapped, tracked, and
          monetized by algorithmic platforms. Yet behind every completed task,
          every delivery, and every digital checkout, there is an unspoken
          reality: a woman&apos;s labor powers this economy, yet remains
          structurally invisible to public fiscal systems.
        </p>

        <p>
          Too often, women&apos;s labor across Africa has been dismissed as
          &ldquo;informal,&rdquo; &ldquo;low-value,&rdquo; or unrequited care.
          Yet how can work be invisible when it keeps families, cities, and
          national economies moving? This invisibility is not a natural market
          failure or an administrative oversight awaiting a software patch. As
          Dr. Lyla Latif demonstrates, it reflects deliberate choices made by
          platform architects, fiscal legislators, and international financial
          institutions about whose labor is legible to the sovereign state.
        </p>

        {/* Pull Quote Block */}
        <div className="my-10 border-l-4 border-primary pl-6 py-2 bg-primary/5 rounded-r-xl not-italic font-sans">
          <blockquote className="text-xl sm:text-2xl font-bold text-foreground leading-snug">
            &ldquo;The question is not whether Africa should go digital. The
            question is who benefits, who is protected, and who gets to write
            the rules.&rdquo;
          </blockquote>
          <cite className="block text-sm text-muted-foreground mt-3 font-medium">
            — Dr. Lyla Latif, Director, House of Fiscal Wisdom
          </cite>
        </div>

        <p>
          At the same time, hyperscale data centers, multinational cloud
          providers, and digital platforms are aggressively rewriting how public
          money, tax incentives, and natural resources (including municipal
          water and grid power) are consumed. African governments, under extreme
          pressure from external sovereign creditors to demonstrate fiscal
          credibility, are caught in a structural trap: they extend open-ended
          10-to-20 year tax holidays and duty-free exemptions to foreign
          infrastructure conglomerates, while simultaneously presiding over
          labor platforms that shrink domestic payroll tax bases.
        </p>
      </section>

      {/* 4. The Three Interlocking Research Pillars */}
      <section className="py-16 md:py-24 border-y border-border/40 bg-muted/20">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <div className="mb-12">
            <span className="text-xs font-mono uppercase tracking-widest text-primary font-bold block mb-2">
              Research Architecture
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-foreground">
              The Three Interlocking Pillars of Project TERRA
            </h2>
            <p className="text-muted-foreground mt-2 text-base font-sans">
              Bridging jurisprudence, fiscal economics, and computational
              governance across a two-year investigative cycle.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {meta.pillars.map((pillar, idx) => (
              <div
                key={pillar.id}
                className="rounded-2xl border border-border/60 bg-card p-5 sm:p-6 shadow-xs"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                  <span className="font-mono text-xs font-bold text-primary uppercase tracking-wider bg-primary/10 px-3 py-1 rounded-full">
                    Pillar {idx + 1} • {pillar.tag}
                  </span>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-foreground mb-1">
                  {pillar.title}
                </h3>
                <p className="text-sm font-medium text-muted-foreground italic mb-4">
                  {pillar.subtitle}
                </p>
                <p className="text-sm text-foreground/90 leading-relaxed font-sans mb-5">
                  {pillar.body}
                </p>

                {/* Key Research Questions */}
                <div className="rounded-xl bg-muted/40 p-4 border border-border/50">
                  <h4 className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-3 font-semibold">
                    Investigative Questions:
                  </h4>
                  <ul className="space-y-2">
                    {pillar.keyQuestions.map((q, qIdx) => (
                      <li
                        key={qIdx}
                        className="flex items-start gap-2.5 text-xs sm:text-sm text-foreground/80"
                      >
                        <span className="size-1.5 rounded-full bg-primary mt-2 shrink-0" />
                        <span>{q}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. The Five Analytical Mechanisms of Algorithmic Fiscal Exclusion */}
      <section className="py-16 md:py-24 max-w-4xl mx-auto px-6 lg:px-8">
        <div className="mb-12">
          <span className="text-xs font-mono uppercase tracking-widest text-primary font-bold block mb-2">
            Theoretical Core
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            The Five Mechanisms of Algorithmic Fiscal Exclusion
          </h2>
          <p className="text-muted-foreground mt-2 text-base font-sans">
            At the analytical foundation of Project TERRA is a framework
            unmasking how code, contractual classification, and tax statutes
            systematically produce fiscal invisibility.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {meta.analyticalMechanisms.map((mech) => (
            <div
              key={mech.number}
              className="rounded-2xl border border-border/70 bg-card p-5 sm:p-6 hover:border-primary/40 transition-colors"
            >
              <div className="flex items-baseline gap-4 mb-3">
                <span className="font-mono text-2xl sm:text-3xl font-black text-primary/80">
                  {mech.number}
                </span>
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-foreground">
                    {mech.title}
                  </h3>
                  <span className="text-xs text-muted-foreground font-mono uppercase tracking-wider">
                    {mech.subtitle}
                  </span>
                </div>
              </div>

              <p className="text-sm sm:text-base text-foreground/90 font-serif leading-relaxed mb-6">
                {mech.definition}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-sans border-t border-border/50 pt-4">
                <div className="rounded-lg bg-muted/40 p-3">
                  <span className="font-mono text-muted-foreground uppercase font-semibold block mb-1">
                    Platform Operation
                  </span>
                  <p className="text-foreground/85 leading-relaxed">
                    {mech.platformImpact}
                  </p>
                </div>
                <div className="rounded-lg bg-red-500/5 border border-red-500/10 p-3">
                  <span className="font-mono text-red-500 uppercase font-semibold block mb-1">
                    Fiscal & Sovereign Consequence
                  </span>
                  <p className="text-foreground/85 leading-relaxed">
                    {mech.fiscalConsequence}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. Case Study in Focus: Domestic Labour Platforms */}
      <section className="py-16 md:py-24 border-t border-border/40 bg-muted/15">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <div className="mb-10">
            <span className="text-xs font-mono uppercase tracking-widest text-primary font-bold block mb-2">
              Empirical Evidence
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-foreground">
              Case Study: South Africa&apos;s Domestic Worker Platform
            </h2>
            <p className="text-muted-foreground mt-2 text-base">
              Moving from theoretical modeling to empirical audits of live gig
              architectures.
            </p>
          </div>

          <div className="rounded-2xl border border-border/70 bg-card p-6 sm:p-8 space-y-6">
            <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-muted-foreground">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-muted font-semibold text-foreground">
                <Building2 className="size-3.5" /> South Africa Case File #1
              </span>
              <span>•</span>
              <span>Demographic: Predominantly Black Women Workers</span>
              <span>•</span>
              <span>Status: Active Investigation</span>
            </div>

            <p className="font-serif text-base sm:text-lg leading-relaxed text-foreground/90">
              Project TERRA&apos;s primary empirical case study examines South
              Africa&apos;s largest on-demand domestic cleaning platform, which
              mediates employment between tens of thousands of women workers and
              urban households. The platform commands significant market share,
              sets pricing algorithms, deducts performance penalties, and
              collects transaction fees.
            </p>

            <p className="font-serif text-base sm:text-lg leading-relaxed text-foreground/90">
              Yet, because the platform categorizes workers as
              &ldquo;independent service providers,&rdquo; it disclaims all
              employer-side unemployment insurance (UIF), workers&apos;
              compensation, and payroll tax withholding obligations. The revenue
              authority cannot trace these earnings without audited physical
              books that low-wage informal workers cannot afford to maintain.
              Workers thus occupy a fiscal no-man&apos;s-land: unprotected by
              statutory labour laws, ineligible for public safety nets, yet
              continuously taxed through regressive VAT on basic goods.
            </p>

            <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 sm:p-6 text-sm">
              <h4 className="font-bold text-foreground mb-1">
                Comparative Expansion: East African Logistics & Care
              </h4>
              <p className="text-muted-foreground leading-relaxed">
                A second comparative investigation is underway across Kenya and
                Uganda, auditing ride-hailing and delivery apps to trace how
                intellectual property management fees are shifted offshore to
                tax havens while domestic drivers and gig workers bear the full
                burden of rising fuel levies and municipal operating licenses.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Open Public Tools & Methodological Innovation */}
      <section className="py-16 md:py-24 max-w-4xl mx-auto px-6 lg:px-8">
        <div className="mb-10">
          <span className="text-xs font-mono uppercase tracking-widest text-primary font-bold block mb-2">
            Civic Infrastructure
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            Tools for Sovereign Accountability
          </h2>
          <p className="text-muted-foreground mt-2 text-base font-sans">
            Beyond academic publications, Project TERRA delivers open-access
            computational tools to put empirical proof in the hands of
            journalists, parliamentarians, and grassroots organizers.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {meta.toolsAndOutputs.map((tool, idx) => (
            <div
              key={idx}
              className="rounded-xl border border-border/70 bg-card p-5 hover:border-primary/40 transition-colors"
            >
              <div className="flex items-center gap-2 mb-2">
                <Database className="size-4 text-primary shrink-0" />
                <h3 className="font-bold text-sm text-foreground">
                  {tool.name}
                </h3>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {tool.description}
              </p>
            </div>
          ))}
        </div>

        {/* Regulatory Sandbox Spotlight */}
        <div className="mt-8 rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-6 sm:p-8">
          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-mono text-xs uppercase tracking-wider font-semibold mb-3">
            <Cpu className="size-4" />
            <span>Methodological Innovation</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-3">
            The Kenya Data Centre Risk Assessment Sandbox
          </h3>
          <p className="text-foreground/90 font-serif leading-relaxed text-sm sm:text-base mb-4">
            Conventional technology governance fails because of statutory lag:
            parliaments pass vague legislation, regulatory bodies lack technical
            telemetry, and corporate capture sets in long before negative
            externalities are discovered.
          </p>
          <p className="text-foreground/90 font-serif leading-relaxed text-sm sm:text-base">
            The Data Centre Risk Assessment Sandbox inverts this broken
            chronology. By assembling tax authorities, environmental regulators,
            community representatives, and data infrastructure operators into a
            live simulation environment, policies can be stress-tested against
            real kilowatt-hour consumption, cooling water draws, and profit
            shifting routes *before* they are set in permanent statute.
          </p>
        </div>
      </section>

      {/* 8. Institutional Context: House of Fiscal Wisdom */}
      <section className="py-16 md:py-24 border-t border-border/40 bg-muted/20">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            <div className="md:col-span-8">
              <span className="text-xs font-mono uppercase tracking-widest text-primary font-bold block mb-2">
                Institutional Genesis
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground mb-4">
                Headquartered at the House of Fiscal Wisdom
              </h2>
              <div className="space-y-4 font-serif text-foreground/90 leading-relaxed text-base">
                <p>
                  Project TERRA is hosted and administered at the{" "}
                  <strong>House of Fiscal Wisdom</strong>, a Global Commission
                  on Financing Development headquartered in Nairobi, Kenya.
                  Co-founded by Dr. Lyla Latif alongside Prof. Attiya Waris (UN
                  Independent Expert on Foreign Debt and Human Rights), the
                  House establishes an autonomous African counterweight to
                  orthodox Bretton Woods paradigms.
                </p>
                <p>
                  The institution bridges the technical mechanics of public
                  expenditure, tax justice, and platform economics with the
                  lived realities of African citizens. By aligning empirical
                  investigation with civic mobilization through Budget Ndio
                  Story, research ceases to remain in academic paywalls and
                  becomes actionable political literacy.
                </p>
              </div>

              <div className="mt-6 flex flex-wrap items-center gap-4 text-xs font-mono">
                <a
                  href="https://www.house-of-fiscal-wisdom.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-foreground text-background font-semibold hover:bg-foreground/90 transition-colors"
                >
                  <span>Visit House of Fiscal Wisdom</span>
                  <ExternalLink className="size-3" />
                </a>

                <a
                  href="https://lai-latif.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-border/80 bg-card hover:border-primary/50 transition-colors font-medium"
                >
                  <span>Visit Dr. Lyla Latif</span>
                  <ExternalLink className="size-3" />
                </a>

                <a
                  href="mailto:director@house-of-fiscal-wisdom.org"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-border/80 bg-card hover:border-primary/50 transition-colors font-medium"
                >
                  <span>director@house-of-fiscal-wisdom.org</span>
                </a>
              </div>
            </div>

            <div className="md:col-span-4 rounded-2xl border border-border/70 bg-card p-6 text-xs">
              <h3 className="font-mono uppercase font-bold text-muted-foreground tracking-wider mb-4">
                Lead Dossier
              </h3>
              <div className="space-y-4">
                <div>
                  <span className="text-muted-foreground block text-[11px]">
                    Lead Specialist
                  </span>
                  <p className="font-bold text-foreground text-sm">
                    {meta.leadInvestigator.name}
                  </p>
                  <p className="text-muted-foreground mt-0.5">
                    {meta.leadInvestigator.role}
                  </p>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[11px]">
                    Institutional Mandate
                  </span>
                  <p className="text-foreground/90">
                    Public Finance Law & Computational Fiscal Ontology
                  </p>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[11px]">
                    Project Status
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold mt-1">
                    <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Active (2026–2027)
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 9. Next Steps & Navigation */}
      <footer className="py-16 max-w-4xl mx-auto px-6 lg:px-8">
        <div className="rounded-2xl border border-border/70 bg-card p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-lg font-bold text-foreground">
              Explore More Civic & Studio Dossiers
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              Discover investigations, explainers, and forensic evidence
              produced by Budget Ndio Story.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <Link
              href="/bns-studio"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-colors"
            >
              <span>Explore BNS Studios</span>
              <ArrowRight className="size-3.5" />
            </Link>
            <Link
              href="/work"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-border/80 bg-background text-xs font-medium hover:border-primary/50 transition-colors"
            >
              <span>All Work</span>
            </Link>
          </div>
        </div>
      </footer>
    </article>
  );
}
