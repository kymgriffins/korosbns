"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { ProjectEditorialData } from "@/components/project/project-editorial-view";
import { renderWysiwygProseHtml } from "@/components/admin/WysiwygProseEditor";

type MagazineProjectDossierProps = {
  project: ProjectEditorialData;
  backHref?: string;
  backLabel?: string;
};

export function MagazineProjectDossier({
  project,
  backHref = "/programmes",
  backLabel = "Back to Programmes",
}: MagazineProjectDossierProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    if (typeof window !== "undefined") {
      try {
        await navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      } catch {
        // clipboard access fallback
      }
    }
  };

  const proseHtml = project.wysiwygProse
    ? renderWysiwygProseHtml(project.wysiwygProse)
    : null;

  return (
    <article className="w-full bg-[#fbfaf6] text-[#111317]">
      {/* 1. ARTICLE HEADER / LEDE SPREAD */}
      <header className="border-b border-[#e4e0d4] pt-10 pb-12 md:pt-16 md:pb-20">
        <div className="magazine-container">
          <div className="max-w-5xl">
            <div className="flex items-center gap-3 mb-4">
              <Link
                href={backHref}
                className="font-mono text-xs font-bold uppercase tracking-widest text-[#7a7e8a] hover:text-[#111317]"
              >
                - {backLabel}
              </Link>
              <span className="h-px w-6 bg-[#e4e0d4]" />
              <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#96702e]">
                {project.programmeLabel || "Field Investigation Dossier"}
              </span>
            </div>

            <h1 className="magazine-headline-display mt-2">
              {project.title}
            </h1>

            {project.subtitle ? (
              <p className="magazine-deck mt-6 max-w-3xl">
                {project.subtitle}
              </p>
            ) : null}

            <div className="magazine-byline mt-8">
              <span>By <strong>{project.authorName || "BNS Investigations Desk"}</strong></span>
              <span>Nairobi, Kenya</span>
              <span>Date: <strong>{project.publishedAt || "September 2026"}</strong></span>
              <span>Status: <strong>Verified Public Record</strong></span>
            </div>
          </div>
        </div>
      </header>

      {/* 2. FEATURED INVESTIGATION MEDIA */}
      {project.thumbnail ? (
        <section className="border-b border-[#e4e0d4] bg-[#ffffff] py-8">
          <div className="magazine-container">
            <figure className="max-w-5xl">
              <div className="relative aspect-[16/9] w-full overflow-hidden border border-[#e4e0d4] bg-[#e4e0d4]">
                <Image
                  src={project.thumbnail}
                  alt={project.title}
                  fill
                  priority
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 1100px"
                />
              </div>
              {project.mediaCaption ? (
                <figcaption className="mt-3 font-mono text-xs text-[#525660] italic">
                  {project.mediaCaption}
                </figcaption>
              ) : (
                <figcaption className="mt-3 font-mono text-[11px] uppercase tracking-wider text-[#7a7e8a]">
                  Figure 1.0 - Photographic field evidence catalogued by Budget Ndio Story auditors.
                </figcaption>
              )}
            </figure>
          </div>
        </section>
      ) : null}

      {/* 3. ASYMMETRIC INVESTIGATIVE DOSSIER BODY */}
      <section className="py-14 md:py-20 bg-[#fbfaf6]">
        <div className="magazine-container">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            {/* Primary Longform Article */}
            <div className="lg:col-span-8">
              <div className="magazine-prose magazine-drop-cap">
                {proseHtml ? (
                  <div
                    dangerouslySetInnerHTML={{ __html: proseHtml }}
                    className="space-y-6 [&_h2]:font-serif [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-[#111317] [&_h2]:mt-8 [&_h2]:mb-3 [&_h3]:font-serif [&_h3]:text-xl [&_h3]:font-bold [&_h3]:text-[#111317] [&_h3]:mt-6 [&_h3]:mb-2 [&_p]:text-lg [&_p]:leading-relaxed [&_p]:text-[#111317] [&_p]:mb-6 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-2 [&_ul]:text-base [&_blockquote]:border-l-2 [&_blockquote]:border-[#96702e] [&_blockquote]:pl-4 [&_blockquote]:italic"
                  />
                ) : project.prose ? (
                  <p className="text-lg leading-relaxed text-[#111317]">
                    {project.prose}
                  </p>
                ) : (
                  <p className="text-lg leading-relaxed text-[#111317]">
                    This dossier details field evidence, expenditure tracking, and citizen interviews conducted under Budget Ndio Story&apos;s public record framework.
                  </p>
                )}
              </div>

              {/* Forensic Pull-Quote */}
              <blockquote className="magazine-quote-pull mt-12">
                When public money leaves the national exchequer, its true destination can only be verified by boots on the ground.
                <cite>BNS Field Methodology Report</cite>
              </blockquote>

              <div className="mt-12 pt-8 border-t border-[#e4e0d4] flex items-center justify-between">
                <button
                  type="button"
                  onClick={handleShare}
                  className="magazine-btn magazine-btn-outline text-xs"
                >
                  {copied ? "Link Copied to Clipboard" : "Share Investigation Dossier"}
                </button>

                <Link
                  href="/contact"
                  className="font-mono text-xs font-bold uppercase tracking-widest text-[#96702e] hover:underline"
                >
                  Submit Corroborating Evidence -
                </Link>
              </div>
            </div>

            {/* Right Dossier Sidebar */}
            <aside className="lg:col-span-4 space-y-6">
              <div className="magazine-card bg-[#ffffff]">
                <span className="magazine-kicker">Investigation Metadata</span>
                <h3 className="font-serif text-xl font-bold text-[#111317] mt-1">
                  Docket Details
                </h3>

                <dl className="mt-6 divide-y divide-[#e4e0d4] text-xs font-mono">
                  <div className="py-3 flex justify-between">
                    <dt className="text-[#7a7e8a] uppercase">Record ID</dt>
                    <dd className="font-bold text-[#111317]">{project.id}</dd>
                  </div>
                  <div className="py-3 flex justify-between">
                    <dt className="text-[#7a7e8a] uppercase">Programme</dt>
                    <dd className="font-bold text-[#111317]">{project.programmeLabel || "General"}</dd>
                  </div>
                  <div className="py-3 flex justify-between">
                    <dt className="text-[#7a7e8a] uppercase">Institution</dt>
                    <dd className="font-bold text-[#111317]">{project.hostInstitution || "House of Fiscal Wisdom"}</dd>
                  </div>
                  <div className="py-3 flex justify-between">
                    <dt className="text-[#7a7e8a] uppercase">Consortium</dt>
                    <dd className="font-bold text-[#111317]">{project.funder || "Public Wealth Network"}</dd>
                  </div>
                  <div className="py-3 flex justify-between">
                    <dt className="text-[#7a7e8a] uppercase">Access</dt>
                    <dd className="font-bold text-[#96702e]">100% Open Access</dd>
                  </div>
                </dl>
              </div>

              {project.metrics && project.metrics.length > 0 ? (
                <div className="magazine-card magazine-card-featured">
                  <span className="magazine-kicker">Forensic Indicators</span>
                  <div className="mt-4 space-y-4">
                    {project.metrics.map((m) => (
                      <div key={m.label}>
                        <span className="block font-serif text-2xl font-black text-[#111317]">{m.value}</span>
                        <span className="block font-mono text-[10px] uppercase tracking-wider text-[#7a7e8a] mt-0.5">{m.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}

              <div className="magazine-card magazine-card-dark">
                <span className="magazine-kicker">Public Audit Guarantee</span>
                <h4 className="font-serif text-lg font-bold text-[#ffffff] mt-1">
                  Integrity Protocol
                </h4>
                <p className="mt-3 text-xs font-serif leading-relaxed text-[#b0b4c0]">
                  Every published claim is cross-referenced with primary government budget records,
                  contractor filings, and verified community testimony.
                </p>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </article>
  );
}
