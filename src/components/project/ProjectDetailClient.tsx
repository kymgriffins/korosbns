"use client";

import React from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Calendar, MapPin, Target, FileText, ExternalLink, Play, Sparkles } from "lucide-react";
import { useCohortImages } from "@/hooks/use-marketing";
import { BNS_R2_REELS } from "@/constants/bns-r2-reels";

const projectDetails: Record<string, {
  id: string;
  title: string;
  description: string;
  prose: string[];
  image: string;
  videoUrl?: string;
  location: string;
  gallery: string[];
  documents: { name: string; url: string }[];
  objectives: string[];
}> = {
  "terra": {
    id: "terra",
    title: "Project TERRA: Technology, Equality, Regulatory Risk Assessment",
    description: "In conjunction with House of Fiscal Wisdom & Luminate: A two-year pan-African research programme investigating algorithmic gender bias in platform labor and data center fiscal impact.",
    prose: [
      "Africa is experiencing rapid digital acceleration. From urban centers to rural markets, from ride-hailing and courier dispatch to mobile money rails, everyday economic exchange is being mapped, tracked, and monetized by algorithmic platforms. Yet behind every completed task, every delivery, and every digital checkout, there is an unspoken reality: a woman's labor powers this economy, yet remains structurally invisible to public fiscal systems.",
      "Too often, women's labor across Africa has been dismissed as 'informal', 'low-value', or unrequited care. Yet how can work be invisible when it keeps families, cities, and national economies moving? This invisibility is not a natural market failure or an administrative oversight awaiting a software patch.",
      "At the same time, hyperscale data centers, multinational cloud providers, and digital platforms are aggressively rewriting how public money, tax incentives, and natural resources are consumed. African governments are caught in a structural trap: extending open-ended tax holidays to foreign infrastructure conglomerates, while simultaneously presiding over labor platforms that shrink domestic payroll tax bases."
    ],
    image: "/images/marketing newsletter subcribe/Nelly with The Mic.jpg",
    videoUrl: BNS_R2_REELS[0].videoUrl,
    location: "Nairobi, Kenya & Pan-African",
    gallery: [
      "/images/towwnhallmay/129A3912.jpg",
      "/images/towwnhallmay/129A3863.jpg",
      "/images/towwnhallmay/129A3923.jpg",
    ],
    documents: [
      { name: "Project TERRA Transcript JSON", url: "/bns-project/terra" },
      { name: "House of Fiscal Wisdom Research Secretariat", url: "https://www.house-of-fiscal-wisdom.org" },
      { name: "Kenya Data Centre Risk Assessment Sandbox Protocol", url: "/bns-project/terra" },
    ],
    objectives: [
      "Interrogate algorithmic gender bias and the structural invisibility of women platform workers",
      "Quantify public revenue foregone and natural resource draw from hyperscale data center tax holidays",
      "Deploy the Kenya Data Centre Risk Assessment Sandbox to test fiscal accountability"
    ],
  },
  "budget-literacy": {
    id: "budget-literacy",
    title: "Budget Literacy Programme",
    description: "Interactive learning modules that break down the budget cycle, sector allocations, and parliamentary processes into digestible lessons for all Kenyans.",
    prose: [
      "Understanding the national budget is often treated as the exclusive domain of economists and politicians. Yet, the budget is the single most important policy document in any country—it dictates the quality of healthcare, the state of roads, and the availability of schools. Our Budget Literacy Programme exists to dismantle this exclusivity.",
      "Through grassroots workshops and interactive digital modules, we break down complex fiscal terminology into everyday language. We don't just teach what a 'fiscal deficit' is; we explain how it affects the price of unga and the availability of jobs.",
      "The true measure of a democracy is not just the right to vote, but the ability of its citizens to scrutinize how their taxes are spent. By equipping Kenyans with budget literacy, we are building a foundation for genuine public participation."
    ],
    image: "https://res.cloudinary.com/dn8lut2fc/image/upload/v1740749180/cohort-1_kcmbmm.jpg",
    videoUrl: BNS_R2_REELS[1].videoUrl,
    location: "Nationwide, Kenya",
    gallery: [
      "/images/towwnhallmay/129A3912.jpg",
      "/images/towwnhallmay/129A3863.jpg",
      "/images/towwnhallmay/129A3923.jpg",
    ],
    documents: [
      { name: "Budget Cycle Guide", url: "#" },
      { name: "Sector Allocation Breakdown", url: "#" },
      { name: "Learning Module Catalog", url: "#" },
    ],
    objectives: [
      "Demystify the national budget process for everyday citizens",
      "Provide interactive tools to understand sector allocations",
      "Bridge the gap between policy documents and public understanding"
    ],
  },
  "county-budget-tracking": {
    id: "county-budget-tracking",
    title: "County Budget Tracking",
    description: "County budget analysis where verified allocations exist. Missing counties show as unavailable — never invented.",
    prose: [
      "Devolution promised to bring resources closer to the people. But tracking exactly where those resources go remains a challenge. Our County Budget Tracking initiative cuts through the political rhetoric to follow the money, project by project, ward by ward.",
      "We rely exclusively on verified, published county documents. If a county has not published its budget estimates, we do not estimate; we show a blank slate, highlighting the transparency gap itself as a critical finding.",
      "By mapping allocations against actual development on the ground, citizens can move from anecdotal complaints to evidence-based advocacy, holding county executives and assemblies accountable to their constitutional mandates."
    ],
    image: "https://res.cloudinary.com/dn8lut2fc/image/upload/v1740749200/cohort-2_p9p1yi.jpg",
    videoUrl: BNS_R2_REELS[2].videoUrl,
    location: "Verified counties only",
    gallery: [
      "/images/towwnhallmay/129A4056.jpg",
      "/images/towwnhallmay/129A4094.jpg",
      "/images/towwnhallmay/129A3912.jpg",
    ],
    documents: [
      { name: "County Budget Toolkit", url: "#" },
      { name: "CRA Provenance Notes", url: "/reports" },
      { name: "Expenditure Tracking Template", url: "#" },
    ],
    objectives: [
      "Enable citizens to monitor county-level budget execution when data exists",
      "Show honest empty states instead of inventing 47-county coverage",
      "Track development project milestones from verified sources"
    ],
  },
  "public-participation": {
    id: "public-participation",
    title: "Public Participation Hub",
    description: "A centralized platform that notifies citizens about public comment windows and guides them through submitting memoranda on budget and finance bills.",
    prose: [
      "Public participation is enshrined in the Constitution, but the reality often feels like a rubber-stamping exercise. Citizens are given short notice, complex documents, and little guidance on how to submit meaningful input.",
      "The Public Participation Hub centralizes all open calls for memoranda, providing automated alerts for citizens based on their county and interests. We offer plain-language summaries of complex finance bills so citizens know exactly what they are commenting on.",
      "Our goal is to transform public participation from a procedural checkbox into a robust, substantive dialogue between the state and the people it serves."
    ],
    image: "https://res.cloudinary.com/dn8lut2fc/image/upload/v1740749218/cohort-3_ezpn3o.jpg",
    videoUrl: BNS_R2_REELS[3].videoUrl,
    location: "Nairobi & Online",
    gallery: [
      "/images/towwnhallmay/129A3863.jpg",
      "/images/towwnhallmay/129A3923.jpg",
      "/images/towwnhallmay/129A4056.jpg",
    ],
    documents: [
      { name: "Public Participation Guide", url: "#" },
      { name: "Memorandum Template", url: "#" },
      { name: "Finance Bill Summary", url: "#" },
    ],
    objectives: [
      "Notify citizens of upcoming public participation windows",
      "Simplify the memorandum submission process",
      "Increase civic engagement in budget making"
    ],
  },
};

// Map project-terra to terra
projectDetails["project-terra"] = projectDetails["terra"];

export function ProjectDetailClient() {
  const params = useParams();
  const id = String(params.id || "");
  const project = projectDetails[id];
  const { data: cohortData } = useCohortImages();
  const cohortImages = cohortData?.images ?? [];

  if (!project) {
    return (
      <div className="max-w-4xl mx-auto text-center py-20 px-4">
        <Target className="size-16 mx-auto text-muted-foreground/40 mb-6" />
        <h2 className="text-3xl font-bold mb-3">Project Not Found</h2>
        <p className="text-muted-foreground mb-8">The project you are looking for does not exist.</p>
        <Link
          href="/bns-project"
          className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
        >
          <ArrowLeft className="size-4" />
          Back to all projects
        </Link>
      </div>
    );
  }

  // Interleave gallery images into the prose paragraphs
  const allImages = [...project.gallery, ...cohortImages.slice(0, 3).map(i => i.src)].slice(0, 4);

  return (
    <article className="min-h-screen bg-background text-foreground selection:bg-primary/20 pb-24">
      {/* 1. Header */}
      <header className="relative border-b border-border/40 bg-muted/10 pt-24 pb-16 md:pt-32 md:pb-24">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-mono tracking-wider uppercase text-muted-foreground mb-8">
            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
            <span>/</span>
            <Link href="/bns-project" className="hover:text-primary transition-colors">Projects</Link>
            <span>/</span>
            <span className="text-foreground font-semibold">{project.title.split(":")[0]}</span>
          </nav>

          <div className="inline-flex flex-wrap items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3.5 py-1 text-xs font-medium text-primary mb-6">
            <Sparkles className="size-3.5" />
            <span>Active Investigation</span>
            <span className="text-muted-foreground/60">•</span>
            <span className="font-mono">{project.location}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground leading-[1.1] mb-6">
            {project.title.includes(":") ? (
              <>
                {project.title.split(":")[0]}:{" "}
                <span className="text-primary block mt-1 sm:inline sm:mt-0 font-normal italic">
                  {project.title.split(":")[1]}
                </span>
              </>
            ) : project.title}
          </h1>

          <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed font-light mb-10 max-w-3xl">
            {project.description}
          </p>
        </div>
      </header>

      {/* 2. Visual Hub (Video) */}
      {project.videoUrl && (
        <section className="py-12 border-b border-border/40 bg-card/40">
          <div className="max-w-4xl mx-auto px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 mb-6">
              <div>
                <span className="text-xs font-mono uppercase tracking-widest text-primary font-semibold block mb-1">
                  Field Intelligence
                </span>
                <h2 className="text-2xl font-bold tracking-tight">Project Dispatch</h2>
              </div>
            </div>
            
            <div className="relative overflow-hidden rounded-2xl border border-border/80 bg-black shadow-2xl aspect-video">
              <video
                src={project.videoUrl}
                poster={project.image}
                controls
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </section>
      )}

      {/* 3. Prose Narrative */}
      <main className="py-16 md:py-24 max-w-3xl mx-auto px-6 lg:px-8 font-serif text-lg leading-relaxed text-foreground/90 space-y-12">
        {project.prose.map((paragraph, idx) => (
          <React.Fragment key={idx}>
            <p className={idx === 0 ? "first-letter:text-5xl first-letter:font-bold first-letter:float-left first-letter:mr-3 first-letter:text-primary" : ""}>
              {paragraph}
            </p>
            {/* Interleave images after paragraphs */}
            {allImages[idx] && (
              <figure className="my-10 border border-border/40 p-2 rounded-2xl bg-muted/20">
                <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl">
                  <img
                    src={allImages[idx]}
                    alt={`${project.title} context ${idx}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              </figure>
            )}
          </React.Fragment>
        ))}

        <div className="my-12 p-8 bg-primary/5 border border-primary/20 rounded-2xl">
          <h3 className="text-lg font-bold font-sans mb-4">Strategic Objectives</h3>
          <ul className="space-y-3">
            {project.objectives.map((obj, i) => (
              <li key={i} className="flex items-start gap-3 font-sans text-base">
                <Target className="size-5 text-primary shrink-0 mt-0.5" />
                <span>{obj}</span>
              </li>
            ))}
          </ul>
        </div>
      </main>

      {/* 4. Documentation Footer */}
      <footer className="border-t border-border/40 bg-muted/15 py-16">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <h3 className="text-2xl font-bold mb-8">Project Documentation</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {project.documents.map((doc, i) => (
              <a
                key={i}
                href={doc.url}
                className="group flex items-center gap-3 p-4 rounded-xl border border-border/60 bg-card transition-all duration-300 hover:border-primary/30 hover:shadow-lg"
              >
                <div className="inline-flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <FileText className="size-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="font-semibold text-sm group-hover:text-primary transition-colors truncate">
                    {doc.name}
                  </h4>
                  <span className="inline-flex items-center gap-1 text-xs text-muted-foreground mt-1">
                    View <ExternalLink className="size-3" />
                  </span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </footer>
    </article>
  );
}
