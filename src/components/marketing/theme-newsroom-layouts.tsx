"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Play, Search } from "lucide-react";
import type {
  FeaturedProjectsContent,
  LandingContent,
} from "@/lib/cms-live-data";
import type { ProgrammeBlock } from "@/content";
import { CONSORTIUM_FOUNDERS, CONSORTIUM_SUMMARY } from "@/constants/consortium-founders";

type ThemeNewsroomProps = {
  landingData?: Partial<LandingContent>;
  featuredProjects?: Partial<FeaturedProjectsContent> | null;
};

type BrutalistProgrammesHubProps = {
  programmes: ProgrammeBlock[];
  landing: { headline?: string; body?: string };
  featuredProjects?: Partial<FeaturedProjectsContent> | null;
  closing: { headline: string; body: string; cta: { href: string; label: string } };
};

function getProjects(featuredProjects?: Partial<FeaturedProjectsContent> | null) {
  return Array.isArray(featuredProjects?.results) ? featuredProjects.results : [];
}

function getProgrammes(landingData?: Partial<LandingContent>) {
  return Array.isArray(landingData?.programmeExplains)
    ? landingData.programmeExplains
    : [];
}

function getImage(project: { thumbnail?: string } | undefined) {
  return project?.thumbnail || "/images/towwnhallmay/129A3912.jpg";
}

const ARK_SPEC_CELLS = [
  { n: "01", label: "Open budget literacy" },
  { n: "02", label: "Field investigations" },
  { n: "03", label: "Public participation" },
  { n: "04", label: "County tracking" },
  { n: "05", label: "Evidence-led stories" },
  { n: "06", label: "Citizen tools" },
] as const;

const EDITORIAL_DESKS = [
  {
    slug: "connect",
    eyebrow: "Connect",
    title: "National budget intelligence",
    lede: "Translate Treasury circulars, Budget Day theatre, and debt questions into youth-ready explainers.",
    href: "/programmes/connect",
  },
  {
    slug: "mashinani",
    eyebrow: "Mashinani",
    title: "County delivery evidence",
    lede: "Field snapshots from clinics, roads, and markets — what equitable share looks like on the ground.",
    href: "/programmes/mashinani",
  },
  {
    slug: "wanahabari-lab",
    eyebrow: "Wanahabari",
    title: "Newsroom verification",
    lede: "Train and co-produce with journalists so the spending story stays alive after Budget Day.",
    href: "/programmes/wanahabari-lab",
  },
] as const;

/**
 * Broadside editorial landing — newspaper composition.
 * When editorial theme is active, every section below is always on (not CMS-gated).
 */
export function EditorialNewsroom({ landingData, featuredProjects }: ThemeNewsroomProps) {
  const projects = getProjects(featuredProjects);
  const programmes = getProgrammes(landingData);
  const hero = landingData?.heroNarrative;
  const thesis = landingData?.thesis;
  const leadProject = projects[0];
  const feed = projects.slice(0, 6);
  const desks =
    programmes.length >= 3
      ? programmes.slice(0, 3).map((p) => ({
          slug: p.slug,
          eyebrow: p.eyebrow || p.title,
          title: p.title,
          lede: p.lede,
          href: p.href,
        }))
      : [...EDITORIAL_DESKS];

  const mastheadDate = new Date().toLocaleDateString("en-KE", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="min-h-dvh bg-background text-foreground [font-family:var(--font-heading)]">
      <header className="border-b border-border px-5 py-4 md:px-10">
        <div className="mx-auto flex max-w-[1280px] flex-col gap-3">
          <div className="flex items-center justify-between gap-4">
            <p className="hidden text-[10px] font-bold tracking-[0.18em] text-muted-foreground uppercase sm:block">
              {mastheadDate}
            </p>
            <Link href="/" className="text-center text-xl font-bold tracking-[-0.04em] md:text-3xl">
              BUDGET NDIO STORY
            </Link>
            <nav className="hidden items-center gap-6 text-[11px] font-bold tracking-[0.14em] uppercase md:flex">
              <Link href="/budgetnews" className="hover:text-primary">Desk</Link>
              <Link href="/projects" className="hover:text-primary">Archive</Link>
              <Link href="/programmes" className="hover:text-primary">Programmes</Link>
              <Link href="/contact" className="hover:text-primary">Contact</Link>
            </nav>
            <button type="button" aria-label="Search the newsroom" className="rounded-full border border-border p-2 md:hidden">
              <Search className="size-4" />
            </button>
          </div>
          <p className="text-center text-[10px] font-medium tracking-[0.12em] text-muted-foreground uppercase sm:hidden">
            {mastheadDate}
          </p>
        </div>
      </header>

      <div className="border-b border-border bg-primary px-5 py-2 text-center text-[10px] font-bold tracking-[0.18em] text-primary-foreground uppercase md:px-10">
        Youth-led civic newsroom · Kenya&apos;s public money · Connect · Mashinani · Wanahabari
      </div>

      <main className="mx-auto max-w-[1280px] px-5 md:px-10">
        <section className="grid gap-8 border-b border-border py-12 md:grid-cols-[1.25fr_0.75fr] md:py-16">
          <div>
            <p className="mb-4 text-xs font-bold tracking-[0.2em] text-primary uppercase">
              {hero?.eyebrow || "After Budget Day"}
            </p>
            <h1 className="max-w-4xl text-4xl font-black leading-[0.95] tracking-[-0.05em] sm:text-5xl md:text-7xl">
              {hero?.title || "The budget lands. Then the silence."}
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-relaxed md:text-lg">
              {hero?.lede ||
                "We follow the money from the Exchequer to the mwananchi — with video, podcasts, explainers, and community monitoring young people can actually use."}
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/budgetnews" className="inline-flex items-center gap-2 border-b-2 border-primary pb-1 text-sm font-bold tracking-[0.1em] text-primary uppercase">
                Enter the budget desk <ArrowUpRight className="size-4" />
              </Link>
              <Link href="/programmes" className="inline-flex items-center gap-2 border-b border-border pb-1 text-sm font-bold tracking-[0.1em] uppercase hover:border-foreground">
                Open programmes
              </Link>
            </div>
          </div>
          <div className="flex flex-col justify-end gap-6 border-t border-border pt-5 md:border-t-0 md:border-l md:pl-8 md:pt-0">
            <p className="max-w-sm text-xl leading-tight md:text-2xl">
              {thesis?.body || "Clear numbers. Reported evidence. A public record that stays alive after Budget Day."}
            </p>
            <p className="text-xs leading-relaxed text-muted-foreground">{CONSORTIUM_SUMMARY}</p>
          </div>
        </section>

        <section className="border-b border-border py-10 md:py-14" aria-label="Programme desks">
          <div className="mb-6 flex items-baseline justify-between gap-4">
            <h2 className="text-2xl font-bold tracking-[-0.03em] md:text-4xl">The three desks</h2>
            <Link href="/programmes" className="text-[11px] font-bold tracking-[0.14em] text-primary uppercase">
              All programmes <ArrowUpRight className="inline size-3" />
            </Link>
          </div>
          <div className="grid border-t border-border md:grid-cols-3">
            {desks.map((desk) => (
              <article key={desk.slug} className="border-b border-border py-6 md:border-r md:border-b-0 md:px-6 md:first:pl-0 md:last:border-r-0 md:last:pr-0">
                <p className="text-[11px] font-bold tracking-[0.16em] text-primary uppercase">{desk.eyebrow}</p>
                <h3 className="mt-3 text-xl font-bold leading-tight md:text-2xl">
                  <Link href={desk.href} className="hover:text-primary">{desk.title}</Link>
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{desk.lede}</p>
                <Link href={desk.href} className="mt-5 inline-flex items-center gap-1 text-[11px] font-bold tracking-[0.12em] text-primary uppercase">
                  Open desk <ArrowUpRight className="size-3" />
                </Link>
              </article>
            ))}
          </div>
        </section>

        <section className="border-b border-border py-10 md:py-14">
          <div className="mb-7 flex items-baseline justify-between gap-4">
            <h2 className="text-2xl font-bold tracking-[-0.03em] md:text-4xl">Latest from the field</h2>
            <Link href="/projects" className="text-[11px] font-bold tracking-[0.14em] text-primary uppercase">
              All stories <ArrowUpRight className="inline size-3" />
            </Link>
          </div>
          {leadProject ? (
            <article className="grid gap-6 md:grid-cols-[1.15fr_0.85fr]">
              <Link href={leadProject.href} className="group relative block aspect-[16/9] overflow-hidden bg-muted">
                <Image src={getImage(leadProject)} alt={leadProject.title} fill className="object-cover transition-transform duration-500 group-hover:scale-[1.03]" sizes="(max-width: 768px) 100vw, 60vw" />
              </Link>
              <div className="flex flex-col justify-center">
                <p className="text-[11px] font-bold tracking-[0.16em] text-primary uppercase">{leadProject.programmeLabel || "Investigation"}</p>
                <h3 className="mt-3 text-2xl font-bold leading-tight md:text-4xl">
                  <Link href={leadProject.href} className="hover:text-primary">{leadProject.title}</Link>
                </h3>
                <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground md:text-base">{leadProject.prose}</p>
              </div>
            </article>
          ) : null}
        </section>

        <section className="border-b border-border py-10 md:py-14" aria-label="Evidence feed">
          <div className="mb-7 flex items-baseline justify-between gap-4">
            <h2 className="text-2xl font-bold tracking-[-0.03em] md:text-4xl">Today&apos;s edition</h2>
            <span className="text-[11px] font-bold tracking-[0.14em] text-muted-foreground uppercase">Programme distribution</span>
          </div>
          <div className="grid gap-0 border-t border-border sm:grid-cols-2 lg:grid-cols-3">
            {feed.map((project) => (
              <Link key={project.id} href={project.href} className="group border-b border-border sm:border-r lg:[&:nth-child(3n)]:border-r-0">
                <article className="flex h-full flex-col">
                  <div className="relative aspect-[16/10] overflow-hidden bg-muted">
                    <Image src={getImage(project)} alt={project.title} fill className="object-cover transition-transform duration-500 group-hover:scale-[1.02]" sizes="(max-width: 640px) 100vw, 33vw" />
                  </div>
                  <div className="flex flex-1 flex-col gap-2 p-4">
                    <p className="text-[10px] font-bold tracking-[0.16em] text-primary uppercase">{project.programmeLabel || "Evidence"}</p>
                    <h3 className="text-lg font-bold leading-snug tracking-[-0.02em] group-hover:text-primary">{project.title}</h3>
                    <p className="line-clamp-3 text-sm leading-relaxed text-muted-foreground">{project.prose}</p>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </section>

        <section className="border-b border-border py-10 md:py-14" aria-label="Implementing partners">
          <p className="mb-2 text-[11px] font-bold tracking-[0.18em] text-primary uppercase">Implementing partners</p>
          <h2 className="max-w-2xl text-2xl font-bold tracking-[-0.03em] md:text-3xl">
            The Continental Pot · Colour Twist Media · Sen Media &amp; Events
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground">{CONSORTIUM_SUMMARY}</p>
          <ul className="mt-8 grid gap-6 border-t border-border pt-8 sm:grid-cols-3">
            {CONSORTIUM_FOUNDERS.map((partner) => (
              <li key={partner.id} className="space-y-2">
                <a href={partner.website} target="_blank" rel="noopener noreferrer" className="text-base font-bold tracking-[-0.02em] underline decoration-foreground/20 underline-offset-4 hover:decoration-foreground">
                  {partner.name}
                </a>
                <p className="text-xs font-medium tracking-[0.06em] text-muted-foreground uppercase">{partner.role}</p>
                <p className="text-sm leading-relaxed text-muted-foreground">{partner.description}</p>
              </li>
            ))}
          </ul>
        </section>

        <section className="py-12 md:py-16">
          <div className="flex flex-col gap-6 border-t border-border pt-10 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="max-w-xl text-2xl font-bold tracking-[-0.03em] md:text-3xl">
                One story. Three desks. Public evidence.
              </h2>
              <p className="mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
                Publish into Connect, Mashinani, or Wanahabari — and let the record travel across programmes, counties, and partners.
              </p>
            </div>
            <Link href="/contact?intent=partner" className="inline-flex w-fit border border-foreground bg-foreground px-5 py-2.5 text-xs font-bold tracking-[0.12em] text-background uppercase transition-colors hover:bg-transparent hover:text-foreground">
              Work with the newsroom
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}

export function BrutalistNewsroom({ landingData, featuredProjects }: ThemeNewsroomProps) {
  const projects = getProjects(featuredProjects);
  const programmes = getProgrammes(landingData);
  const hero = landingData?.heroNarrative;

  return (
    <div className="min-h-dvh bg-background text-foreground selection:bg-primary selection:text-primary-foreground">
      <header className="border-b-4 border-border bg-primary px-4 py-3 md:px-8"><div className="mx-auto flex max-w-[1440px] items-center justify-between gap-4"><Link href="/" className="text-xl font-black uppercase tracking-[-0.08em] md:text-3xl text-primary-foreground">BNS / WATCHDOG</Link><nav className="hidden gap-5 text-xs font-black uppercase md:flex text-primary-foreground"><Link href="/budgetnews">Budget</Link><Link href="/projects">Evidence</Link><Link href="/programmes">Action</Link></nav><span className="border-2 border-border bg-background px-2 py-1 text-[10px] font-black uppercase">Live desk</span></div></header>
      <div className="overflow-hidden border-b-4 border-border bg-foreground px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-background">Follow the money / name the gap / publish the evidence / follow the money / name the gap</div>
      <main className="mx-auto max-w-[1440px]">
        <section className="grid border-b-4 border-border md:grid-cols-[1.4fr_0.6fr]"><div className="border-b-4 border-border p-5 md:border-b-0 md:border-r-4 md:p-10"><p className="mb-5 inline-block bg-foreground px-2 py-1 text-xs font-black uppercase text-background">{hero?.eyebrow || "Public money, public record"}</p><h1 className="max-w-5xl text-6xl font-black uppercase leading-[0.82] tracking-[-0.09em] md:text-[clamp(5rem,12vw,11rem)]">{hero?.title || "The budget lands. Then the silence."}</h1><p className="mt-8 max-w-2xl border-l-4 border-primary pl-4 text-lg font-bold leading-tight md:text-2xl">{hero?.lede || "We turn Kenya's public budgets into evidence people can use."}</p><Link href="/budgetnews" className="mt-8 inline-flex border-2 border-border bg-primary px-5 py-3 text-sm font-black uppercase text-primary-foreground shadow-[5px_5px_0_0_var(--border)] transition-transform hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-none">Read the budget desk <ArrowUpRight className="ml-2 size-4" /></Link></div><aside className="flex flex-col justify-between bg-accent p-5 md:p-8"><p className="text-7xl font-black leading-none tracking-[-0.1em] md:text-9xl text-accent-foreground">01</p><div><p className="text-xs font-black uppercase text-accent-foreground">Operating principle</p><p className="mt-3 text-3xl font-black uppercase leading-[0.9] tracking-[-0.06em] text-accent-foreground">No estimates without receipts.</p></div></aside></section>
        <section className="border-b-4 border-border p-5 md:p-10"><div className="mb-7 flex items-end justify-between gap-4"><h2 className="text-4xl font-black uppercase leading-none tracking-[-0.08em] md:text-7xl">Evidence / now</h2><Link href="/projects" className="text-xs font-black uppercase underline decoration-2 underline-offset-4">Open archive</Link></div><div className="grid gap-6 md:grid-cols-3">{projects.slice(0, 3).map((project, index) => <Link href={project.href} key={project.id} className="group border-4 border-border bg-card"><div className="relative aspect-[4/3] overflow-hidden border-b-4 border-border bg-accent"><Image src={getImage(project)} alt={project.title} fill className="object-cover grayscale transition-[filter,transform] duration-200 group-hover:grayscale-0 group-hover:scale-105" sizes="(max-width: 768px) 100vw, 33vw" /><span className="absolute left-2 top-2 bg-primary px-2 py-1 text-xs font-black text-primary-foreground">0{index + 1}</span></div><div className="p-4"><p className="text-[10px] font-black uppercase">{project.programmeLabel || "Field report"}</p><h3 className="mt-2 text-2xl font-black uppercase leading-[0.9] tracking-[-0.06em]">{project.title}</h3><p className="mt-4 text-sm font-bold leading-tight">{project.prose}</p></div></Link>)}</div></section>
        <section className="grid border-b-4 border-border md:grid-cols-[0.4fr_1.6fr]"><div className="border-b-4 border-border bg-foreground p-5 text-background md:border-b-0 md:border-r-4 md:p-10"><p className="text-xs font-black uppercase text-primary">Our programmes</p><h2 className="mt-4 text-5xl font-black uppercase leading-[0.85] tracking-[-0.08em]">Three ways to make the record public.</h2></div><div className="grid md:grid-cols-3">{programmes.map((programme, index) => <Link href={programme.href} key={programme.slug} className="border-b-4 border-border p-5 hover:bg-accent md:border-b-0 md:border-r-4 md:p-8 md:last:border-r-0"><p className="text-5xl font-black tracking-[-0.1em]">0{index + 1}</p><h3 className="mt-7 text-2xl font-black uppercase leading-[0.9] tracking-[-0.06em]">{programme.title}</h3><p className="mt-4 text-sm font-bold leading-tight">{programme.lede}</p><span className="mt-8 inline-block text-xs font-black uppercase underline decoration-2 underline-offset-4">Open file <ArrowUpRight className="inline size-3" /></span></Link>)}</div></section>
      </main>
    </div>
  );
}

/**
 * Ark Shelter landing — premium minimalist composition inspired by ark-shelter.com:
 * full-bleed photography, thin rule grids, airy typography, soft pill CTAs.
 */
export function ArkShelterLanding({ landingData, featuredProjects }: ThemeNewsroomProps) {
  const projects = getProjects(featuredProjects);
  const programmes = getProgrammes(landingData);
  const hero = landingData?.heroNarrative;
  const thesis = landingData?.thesis;
  const leadProject = projects[0];
  const secondProject = projects[1];
  const heroImage = leadProject?.thumbnail || "/images/towwnhallmay/129A3912.jpg";
  const ctaImage = secondProject?.thumbnail || projects[2]?.thumbnail || heroImage;

  return (
    <div className="ark-shelter min-h-dvh bg-background text-foreground selection:bg-foreground selection:text-background">
      <section className="relative isolate min-h-[88dvh] w-full overflow-hidden md:min-h-dvh">
        <Image
          src={heroImage}
          alt={leadProject?.title || "Budget Ndio Story field work"}
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/25 to-black/50" aria-hidden />

        <header className="absolute inset-x-0 top-0 z-20 px-5 py-5 md:px-10 md:py-6">
          <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-6">
            <Link
              href="/"
              className="text-sm font-semibold tracking-[-0.02em] text-white md:text-base"
            >
              Budget Ndio Story
            </Link>
            <nav className="hidden items-center gap-8 text-[11px] font-medium tracking-[0.08em] text-white/90 md:flex">
              <Link href="/programmes" className="transition-opacity hover:opacity-70">
                Programmes
              </Link>
              <Link href="/projects" className="transition-opacity hover:opacity-70">
                The Story
              </Link>
              <Link href="/budgetnews" className="transition-opacity hover:opacity-70">
                Budget desk
              </Link>
            </nav>
            <Link
              href="/contact?intent=partner"
              className="rounded-full border border-white/40 bg-white/10 px-4 py-1.5 text-[11px] font-medium tracking-[0.06em] text-white backdrop-blur-sm transition-colors hover:bg-white hover:text-black"
            >
              Partner
            </Link>
          </div>
        </header>

        <div className="absolute inset-x-0 bottom-0 z-10 px-5 pb-14 pt-32 md:px-10 md:pb-20">
          <div className="mx-auto max-w-[1400px]">
            <p className="mb-4 text-lg font-semibold tracking-[-0.02em] text-white md:text-xl">
              Budget Ndio Story
            </p>
            <h1 className="max-w-3xl text-4xl font-bold leading-[1.05] tracking-[-0.03em] text-white sm:text-5xl md:text-7xl lg:text-[4.5rem]">
              {hero?.title || "A clearer way to read public money."}
            </h1>
            <p className="mt-5 max-w-xl text-sm leading-relaxed text-white/85 md:text-base">
              {hero?.lede ||
                "We turn Kenya's national and county budgets into stories, tools, and public evidence anyone can use."}
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-border" aria-label="What we build">
        <div className="mx-auto grid max-w-[1400px] sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {ARK_SPEC_CELLS.map((cell) => (
            <div
              key={cell.n}
              className="border-b border-border px-5 py-8 sm:border-r sm:border-b-0 last:border-r-0 [&:nth-child(2n)]:sm:border-r-0 [&:nth-child(2n)]:lg:border-r [&:nth-child(3n)]:lg:border-r-0 [&:nth-child(3n)]:xl:border-r [&:nth-child(6n)]:xl:border-r-0"
            >
              <p className="text-xs font-medium tracking-[0.08em] text-muted-foreground">{cell.n}</p>
              <p className="mt-3 text-sm font-medium leading-snug tracking-[-0.01em]">{cell.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-b border-border px-5 py-20 md:px-10 md:py-28">
        <div className="mx-auto grid max-w-[1400px] gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
          <h2 className="max-w-md text-3xl font-bold leading-[1.1] tracking-[-0.03em] md:text-5xl">
            {thesis?.title || "Join the public record."}
          </h2>
          <div className="grid gap-8 sm:grid-cols-2">
            <p className="text-sm leading-[1.75] text-muted-foreground md:text-[15px]">
              {thesis?.body ||
                "Budget Ndio Story sits between the Treasury documents and the mwananchi. We translate allocations, follow county spend, and keep a living archive after Budget Day."}
            </p>
            <p className="text-sm leading-[1.75] text-muted-foreground md:text-[15px]">
              Programmes, field reports, and learning tools share one spine: provenance-true numbers, free reading, and a clear next action for citizens who want to show up informed.
            </p>
            <ul className="col-span-full mt-2 flex flex-wrap gap-x-8 gap-y-3 border-t border-border pt-8">
              {programmes.slice(0, 4).map((programme) => (
                <li key={programme.slug}>
                  <Link
                    href={programme.href}
                    className="text-sm font-medium underline decoration-foreground/25 underline-offset-[6px] transition-colors hover:decoration-foreground"
                  >
                    {programme.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="relative isolate min-h-[56dvh] w-full overflow-hidden md:min-h-[70dvh]">
        <Image
          src={ctaImage}
          alt={secondProject?.title || "Configure your civic path"}
          fill
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-black/35" aria-hidden />
        <div className="absolute inset-0 flex items-center justify-center px-5">
          <Link
            href="/programmes"
            className="rounded-full bg-white px-8 py-3.5 text-xs font-semibold tracking-[0.14em] text-black uppercase transition-transform hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black/40"
          >
            Start with a programme
          </Link>
        </div>
      </section>

      {leadProject ? (
        <section className="border-b border-border px-5 py-20 md:px-10 md:py-28">
          <div className="mx-auto grid max-w-[1400px] items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <div>
              <h2 className="max-w-lg text-3xl font-bold leading-[1.1] tracking-[-0.03em] md:text-4xl">
                {leadProject.title}
              </h2>
              <p className="mt-6 max-w-md text-sm leading-[1.75] text-muted-foreground md:text-[15px]">
                {leadProject.prose}
              </p>
              <Link
                href={leadProject.href}
                className="mt-8 inline-flex items-center gap-2 text-sm font-medium underline decoration-foreground/25 underline-offset-[6px] hover:decoration-foreground"
              >
                Open the story <ArrowUpRight className="size-3.5" />
              </Link>
            </div>
            <div className="relative aspect-[3/4] overflow-hidden bg-muted md:aspect-[4/5]">
              <Image
                src={getImage(leadProject)}
                alt={leadProject.title}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </div>
        </section>
      ) : null}

      <section className="border-b border-border px-5 py-20 md:px-10 md:py-28">
        <div className="mx-auto grid max-w-[1400px] gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          <div className="relative aspect-[3/4] overflow-hidden bg-muted lg:aspect-auto lg:min-h-[640px]">
            <Image
              src={projects[2]?.thumbnail || heroImage}
              alt={projects[2]?.title || "Field evidence"}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 45vw"
            />
          </div>
          <div className="flex flex-col justify-center">
            <h2 className="max-w-md text-3xl font-bold leading-[1.1] tracking-[-0.03em] md:text-4xl">
              Built for citizens who want the full picture.
            </h2>
            <ol className="mt-10 divide-y divide-border border-y border-border">
              {(programmes.length > 0
                ? programmes.slice(0, 6).map((p) => ({
                    key: p.slug,
                    title: p.title,
                    lede: p.lede,
                  }))
                : ARK_SPEC_CELLS.map((c) => ({
                    key: c.n,
                    title: c.label,
                    lede: "Provenance-true civic tooling.",
                  }))
              ).map((item, index) => (
                <li key={item.key} className="grid grid-cols-[3rem_1fr] gap-4 py-5">
                  <span className="text-xs font-medium tracking-[0.08em] text-muted-foreground">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <p className="text-sm font-semibold tracking-[-0.01em]">{item.title}</p>
                    {item.lede ? (
                      <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{item.lede}</p>
                    ) : null}
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {secondProject ? (
        <section className="border-b border-border px-5 py-20 md:px-10 md:py-28">
          <div className="mx-auto grid max-w-[1400px] items-center gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:gap-16">
            <Link
              href={secondProject.href}
              className="group relative block aspect-[16/10] overflow-hidden bg-muted"
            >
              <Image
                src={getImage(secondProject)}
                alt={secondProject.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                sizes="(max-width: 1024px) 100vw, 60vw"
              />
              <span className="absolute inset-0 flex items-center justify-center">
                <span className="flex size-16 items-center justify-center rounded-full border border-white/50 bg-white/90 text-black shadow-sm transition-transform group-hover:scale-105 md:size-20">
                  <Play className="ml-1 size-6 fill-current md:size-7" aria-hidden />
                  <span className="sr-only">Open {secondProject.title}</span>
                </span>
              </span>
            </Link>
            <div>
              <h2 className="text-2xl font-bold leading-[1.15] tracking-[-0.03em] md:text-3xl">
                {secondProject.title}
              </h2>
              <p className="mt-5 text-sm leading-[1.75] text-muted-foreground md:text-[15px]">
                {secondProject.prose}
              </p>
              <Link
                href={secondProject.href}
                className="mt-8 inline-flex items-center gap-2 text-sm font-medium underline decoration-foreground/25 underline-offset-[6px] hover:decoration-foreground"
              >
                Watch the record <ArrowUpRight className="size-3.5" />
              </Link>
            </div>
          </div>
        </section>
      ) : null}

      <section className="px-5 py-20 md:px-10 md:py-28">
        <div className="mx-auto flex max-w-[1400px] flex-col gap-8 border-t border-border pt-16 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="max-w-xl text-3xl font-bold leading-[1.1] tracking-[-0.03em] md:text-4xl">
              Stay close to the money.
            </h2>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">
              Free reading. Provenance-true numbers. A public desk that does not go quiet after Budget Day.
            </p>
          </div>
          <Link
            href="/contact?intent=partner"
            className="inline-flex w-fit rounded-full bg-foreground px-7 py-3 text-xs font-semibold tracking-[0.12em] text-background uppercase transition-opacity hover:opacity-85"
          >
            Get in touch
          </Link>
        </div>
      </section>
    </div>
  );
}

export function BrutalistProgrammesHub({
  programmes,
  landing,
  featuredProjects,
  closing,
}: BrutalistProgrammesHubProps) {
  const projects = getProjects(featuredProjects).slice(0, 3);

  return (
    <div className="brutalist-newsroom min-h-dvh">
      <main className="mx-auto max-w-[1440px]">
        <section className="grid border-b-4 border-[var(--theme-news-ink)] md:grid-cols-[1.35fr_0.65fr]">
          <div className="border-b-4 border-[var(--theme-news-ink)] p-5 md:border-b-0 md:border-r-4 md:p-10">
            <p className="mb-5 inline-block bg-[var(--theme-news-ink)] px-2 py-1 text-xs font-black uppercase text-[var(--theme-news-paper)]">Programme desk / public action</p>
            <h1 className="max-w-5xl text-6xl font-black uppercase leading-[0.82] tracking-[-0.09em] md:text-[clamp(5rem,12vw,11rem)]">{landing.headline}</h1>
            <p className="mt-8 max-w-2xl border-l-4 border-[var(--theme-news-accent)] pl-4 text-lg font-bold leading-tight md:text-2xl">{landing.body}</p>
          </div>
          <aside className="flex flex-col justify-between bg-[var(--theme-news-accent)] p-5 md:p-8">
            <p className="text-7xl font-black leading-none tracking-[-0.1em] md:text-9xl">03</p>
            <p className="text-3xl font-black uppercase leading-[0.9] tracking-[-0.06em]">Three desks. One public record.</p>
          </aside>
        </section>

        <section className="border-b-4 border-[var(--theme-news-ink)] p-5 md:p-10">
          <div className="mb-7 flex items-end justify-between gap-4">
            <h2 className="text-4xl font-black uppercase leading-none tracking-[-0.08em] md:text-7xl">Open files</h2>
            <span className="text-xs font-black uppercase underline decoration-2 underline-offset-4">All desks active</span>
          </div>
          <div className="grid border-t-4 border-[var(--theme-news-ink)] md:grid-cols-3">
            {programmes.map((programme, index) => (
              <Link href={programme.href} key={programme.slug} className="border-b-4 border-[var(--theme-news-ink)] p-5 hover:bg-[var(--theme-news-accent)] md:border-b-0 md:border-r-4 md:p-8 md:last:border-r-0">
                <p className="text-5xl font-black tracking-[-0.1em]">0{index + 1}</p>
                <p className="mt-4 text-xs font-black uppercase">{programme.eyebrow}</p>
                <h3 className="mt-3 text-2xl font-black uppercase leading-[0.9] tracking-[-0.06em]">{programme.name}</h3>
                <p className="mt-4 text-sm font-bold leading-tight">{programme.body}</p>
                <span className="mt-8 inline-block text-xs font-black uppercase underline decoration-2 underline-offset-4">Open file <ArrowUpRight className="inline size-3" /></span>
              </Link>
            ))}
          </div>
        </section>

        {projects.length > 0 ? (
          <section className="border-b-4 border-[var(--theme-news-ink)] p-5 md:p-10">
            <h2 className="mb-7 text-4xl font-black uppercase leading-none tracking-[-0.08em] md:text-7xl">Evidence / now</h2>
            <div className="grid gap-6 md:grid-cols-3">
              {projects.map((project, index) => (
                <Link href={project.href} key={project.id} className="border-4 border-[var(--theme-news-ink)] bg-[var(--theme-news-paper)]">
                  <div className="relative aspect-[4/3] overflow-hidden border-b-4 border-[var(--theme-news-ink)] bg-[var(--theme-news-accent)]">
                    <Image src={getImage(project)} alt={project.title} fill className="object-cover grayscale" sizes="(max-width: 768px) 100vw, 33vw" />
                    <span className="absolute left-2 top-2 bg-[var(--theme-news-hot)] px-2 py-1 text-xs font-black">0{index + 1}</span>
                  </div>
                  <div className="p-4"><p className="text-[10px] font-black uppercase">{project.programmeLabel || "Field report"}</p><h3 className="mt-2 text-2xl font-black uppercase leading-[0.9] tracking-[-0.06em]">{project.title}</h3></div>
                </Link>
              ))}
            </div>
          </section>
        ) : null}

        <section className="grid border-b-4 border-[var(--theme-news-ink)] bg-[var(--theme-news-ink)] text-[var(--theme-news-paper)] md:grid-cols-[0.7fr_1.3fr]">
          <div className="p-5 md:p-10"><p className="text-xs font-black uppercase text-[var(--theme-news-hot)]">Next assignment</p><h2 className="mt-4 text-5xl font-black uppercase leading-[0.85] tracking-[-0.08em]">{closing.headline}</h2></div>
          <div className="border-t-4 border-[var(--theme-news-paper)] p-5 md:border-l-4 md:border-t-0 md:p-10"><p className="max-w-xl text-xl font-bold">{closing.body}</p><Link href={closing.cta.href} className="mt-8 inline-flex border-2 border-[var(--theme-news-paper)] bg-[var(--theme-news-hot)] px-5 py-3 text-sm font-black uppercase">{closing.cta.label}</Link></div>
        </section>
      </main>
    </div>
  );
}
