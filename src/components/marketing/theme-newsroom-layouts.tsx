"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Search } from "lucide-react";
import type {
  FeaturedProjectsContent,
  LandingContent,
} from "@/lib/cms-live-data";
import type { ProgrammeBlock } from "@/content";

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

export function EditorialNewsroom({ landingData, featuredProjects }: ThemeNewsroomProps) {
  const projects = getProjects(featuredProjects);
  const programmes = getProgrammes(landingData);
  const hero = landingData?.heroNarrative;
  const leadProject = projects[0];

  return (
    <div className="min-h-dvh bg-[#fbf9f4] text-[#211d1a] [font-family:Georgia,Cambria,serif]">
      <header className="border-b border-[#211d1a] px-5 py-4 md:px-10">
        <div className="mx-auto flex max-w-[1280px] items-center justify-between gap-6">
          <Link href="/" className="text-lg font-bold tracking-[-0.04em] md:text-2xl">BUDGET NDIO STORY</Link>
          <nav className="hidden items-center gap-7 text-xs font-bold uppercase tracking-[0.16em] md:flex">
            <Link href="/budgetnews" className="hover:text-[#881337]">Budget desk</Link>
            <Link href="/projects" className="hover:text-[#881337]">Investigations</Link>
            <Link href="/programmes" className="hover:text-[#881337]">Programmes</Link>
          </nav>
          <button type="button" aria-label="Search the newsroom" className="rounded-full border border-[#211d1a] p-2"><Search className="size-4" /></button>
        </div>
      </header>
      <div className="border-b border-[#211d1a] bg-[#881337] px-5 py-2 text-center text-[10px] font-bold uppercase tracking-[0.2em] text-white md:px-10">The civic newsroom for Kenya&apos;s public money</div>

      <main className="mx-auto max-w-[1280px] px-5 md:px-10">
        <section className="grid gap-8 border-b border-[#211d1a] py-14 md:grid-cols-[1.25fr_0.75fr] md:py-20">
          <div>
            <p className="mb-5 text-xs font-bold uppercase tracking-[0.22em] text-[#881337]">{hero?.eyebrow || "After Budget Day"}</p>
            <h1 className="max-w-4xl text-5xl font-black leading-[0.92] tracking-[-0.06em] md:text-8xl">{hero?.title || "The budget lands. Then the silence."}</h1>
            <p className="mt-8 max-w-2xl text-lg leading-relaxed md:text-xl">{hero?.lede || "We follow the money from the Exchequer to the mwananchi."}</p>
            <Link href="/budgetnews" className="mt-8 inline-flex items-center gap-2 border-b-2 border-[#881337] pb-1 text-sm font-bold uppercase tracking-[0.12em] text-[#881337]">Enter the budget desk <ArrowUpRight className="size-4" /></Link>
          </div>
          <div className="flex items-end border-t border-[#211d1a] pt-5 md:border-l md:border-t-0 md:pl-8 md:pt-0"><p className="max-w-sm text-2xl leading-tight md:text-3xl">Clear numbers. Reported evidence. A public record that stays alive after Budget Day.</p></div>
        </section>

        <section className="border-b border-[#211d1a] py-10 md:py-14">
          <div className="mb-7 flex items-baseline justify-between gap-4"><h2 className="text-3xl font-bold tracking-[-0.04em] md:text-5xl">Latest from the field</h2><Link href="/projects" className="text-xs font-bold uppercase tracking-[0.16em] text-[#881337]">All stories <ArrowUpRight className="inline size-3" /></Link></div>
          {leadProject ? <article className="grid gap-6 md:grid-cols-[1.15fr_0.85fr]">
            <Link href={leadProject.href} className="group relative block aspect-[16/9] overflow-hidden bg-[#e7e0d3]"><Image src={getImage(leadProject)} alt={leadProject.title} fill className="object-cover transition-transform duration-500 group-hover:scale-[1.03]" sizes="(max-width: 768px) 100vw, 60vw" /></Link>
            <div className="flex flex-col justify-center"><p className="text-xs font-bold uppercase tracking-[0.16em] text-[#881337]">{leadProject.programmeLabel || "Investigation"}</p><h3 className="mt-3 text-3xl font-bold leading-tight md:text-5xl"><Link href={leadProject.href} className="hover:text-[#881337]">{leadProject.title}</Link></h3><p className="mt-5 max-w-xl text-base leading-relaxed text-[#57504a]">{leadProject.prose}</p></div>
          </article> : null}
        </section>

        <section className="py-10 md:py-14"><p className="mb-7 text-xs font-bold uppercase tracking-[0.2em] text-[#881337]">The reporting beats</p><div className="grid border-t border-[#211d1a] md:grid-cols-3">{programmes.map((programme) => <article key={programme.slug} className="border-b border-[#211d1a] py-6 md:border-b-0 md:border-r md:px-6 md:first:pl-0 md:last:border-r-0 md:last:pr-0"><p className="text-xs font-bold uppercase tracking-[0.16em] text-[#881337]">{programme.eyebrow}</p><h3 className="mt-3 text-2xl font-bold leading-tight"><Link href={programme.href} className="hover:text-[#881337]">{programme.title}</Link></h3><p className="mt-3 text-sm leading-relaxed text-[#57504a]">{programme.lede}</p><Link href={programme.href} className="mt-5 inline-flex items-center gap-1 text-xs font-bold uppercase tracking-[0.14em] text-[#881337]">Read the beat <ArrowUpRight className="size-3" /></Link></article>)}</div></section>
      </main>
    </div>
  );
}

export function BrutalistNewsroom({ landingData, featuredProjects }: ThemeNewsroomProps) {
  const projects = getProjects(featuredProjects);
  const programmes = getProgrammes(landingData);
  const hero = landingData?.heroNarrative;

  return (
    <div className="min-h-dvh bg-[#fffdf5] text-black selection:bg-[#ff4d00] selection:text-black [font-family:Arial,sans-serif]">
      <header className="border-b-4 border-black bg-[#ff4d00] px-4 py-3 md:px-8"><div className="mx-auto flex max-w-[1440px] items-center justify-between gap-4"><Link href="/" className="text-xl font-black uppercase tracking-[-0.08em] md:text-3xl">BNS / WATCHDOG</Link><nav className="hidden gap-5 text-xs font-black uppercase md:flex"><Link href="/budgetnews">Budget</Link><Link href="/projects">Evidence</Link><Link href="/programmes">Action</Link></nav><span className="border-2 border-black bg-[#fffdf5] px-2 py-1 text-[10px] font-black uppercase">Live desk</span></div></header>
      <div className="overflow-hidden border-b-4 border-black bg-black px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-[#fffdf5]">Follow the money / name the gap / publish the evidence / follow the money / name the gap</div>
      <main className="mx-auto max-w-[1440px]">
        <section className="grid border-b-4 border-black md:grid-cols-[1.4fr_0.6fr]"><div className="border-b-4 border-black p-5 md:border-b-0 md:border-r-4 md:p-10"><p className="mb-5 inline-block bg-black px-2 py-1 text-xs font-black uppercase text-[#fffdf5]">{hero?.eyebrow || "Public money, public record"}</p><h1 className="max-w-5xl text-6xl font-black uppercase leading-[0.82] tracking-[-0.09em] md:text-[clamp(5rem,12vw,11rem)]">{hero?.title || "The budget lands. Then the silence."}</h1><p className="mt-8 max-w-2xl border-l-4 border-[#ff4d00] pl-4 text-lg font-bold leading-tight md:text-2xl">{hero?.lede || "We turn Kenya's public budgets into evidence people can use."}</p><Link href="/budgetnews" className="mt-8 inline-flex border-2 border-black bg-[#ff4d00] px-5 py-3 text-sm font-black uppercase shadow-[5px_5px_0_#000] transition-transform hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-none">Read the budget desk <ArrowUpRight className="ml-2 size-4" /></Link></div><aside className="flex flex-col justify-between bg-[#d9ff00] p-5 md:p-8"><p className="text-7xl font-black leading-none tracking-[-0.1em] md:text-9xl">01</p><div><p className="text-xs font-black uppercase">Operating principle</p><p className="mt-3 text-3xl font-black uppercase leading-[0.9] tracking-[-0.06em]">No estimates without receipts.</p></div></aside></section>
        <section className="border-b-4 border-black p-5 md:p-10"><div className="mb-7 flex items-end justify-between gap-4"><h2 className="text-4xl font-black uppercase leading-none tracking-[-0.08em] md:text-7xl">Evidence / now</h2><Link href="/projects" className="text-xs font-black uppercase underline decoration-2 underline-offset-4">Open archive</Link></div><div className="grid gap-6 md:grid-cols-3">{projects.slice(0, 3).map((project, index) => <Link href={project.href} key={project.id} className="group border-4 border-black bg-white"><div className="relative aspect-[4/3] overflow-hidden border-b-4 border-black bg-[#d9ff00]"><Image src={getImage(project)} alt={project.title} fill className="object-cover grayscale transition-[filter,transform] duration-200 group-hover:grayscale-0 group-hover:scale-105" sizes="(max-width: 768px) 100vw, 33vw" /><span className="absolute left-2 top-2 bg-[#ff4d00] px-2 py-1 text-xs font-black">0{index + 1}</span></div><div className="p-4"><p className="text-[10px] font-black uppercase">{project.programmeLabel || "Field report"}</p><h3 className="mt-2 text-2xl font-black uppercase leading-[0.9] tracking-[-0.06em]">{project.title}</h3><p className="mt-4 text-sm font-bold leading-tight">{project.prose}</p></div></Link>)}</div></section>
        <section className="grid border-b-4 border-black md:grid-cols-[0.4fr_1.6fr]"><div className="border-b-4 border-black bg-black p-5 text-[#fffdf5] md:border-b-0 md:border-r-4 md:p-10"><p className="text-xs font-black uppercase text-[#ff4d00]">Our programmes</p><h2 className="mt-4 text-5xl font-black uppercase leading-[0.85] tracking-[-0.08em]">Three ways to make the record public.</h2></div><div className="grid md:grid-cols-3">{programmes.map((programme, index) => <Link href={programme.href} key={programme.slug} className="border-b-4 border-black p-5 hover:bg-[#d9ff00] md:border-b-0 md:border-r-4 md:p-8 md:last:border-r-0"><p className="text-5xl font-black tracking-[-0.1em]">0{index + 1}</p><h3 className="mt-7 text-2xl font-black uppercase leading-[0.9] tracking-[-0.06em]">{programme.title}</h3><p className="mt-4 text-sm font-bold leading-tight">{programme.lede}</p><span className="mt-8 inline-block text-xs font-black uppercase underline decoration-2 underline-offset-4">Open file <ArrowUpRight className="inline size-3" /></span></Link>)}</div></section>
      </main>
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