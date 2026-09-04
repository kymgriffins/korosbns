"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Send, Clapperboard, ShieldCheck, ChevronDown } from "lucide-react";
import { StudioReelHero } from "@/components/studio/theatre/studio-reel-hero";
import { StudioBookingForm } from "@/components/studio/StudioBookingForm";
import { EditorialPill, PillButtonGroup, PillButton } from "@/components/ui/editorial";
import { STUDIO_CONTENT_TYPES } from "@/constants/bns-studio-content";
import { studiosEvidenceData } from "@/data/studios-evidence";
import { BNS_MEDIA_IMAGES } from "@/constants/bns-media-images";
import { cn } from "@/utils";

export function BNSStudioPageClient() {
  const [bookingOpen, setBookingOpen] = useState(false);
  const featuredProjects = studiosEvidenceData.getFeaturedProjects().slice(0, 4);

  return (
    <div className="w-full bg-black text-white selection:bg-primary/30">
      {/* 01 — Full-screen cinematic format reel */}
      <div className="relative h-dvh w-full overflow-hidden bg-black">
        <StudioReelHero />
        <div className="absolute bottom-4 inset-x-0 z-20 flex justify-center pointer-events-none">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/50 px-3 py-1 text-[11px] font-medium text-white/80 backdrop-blur-md animate-bounce">
            <span>Scroll for double impact & work</span>
            <ChevronDown className="size-3" />
          </div>
        </div>
      </div>

      {/* 02 — The Double Impact Mission Engine */}
      <section className="relative border-t border-white/10 bg-zinc-950 px-6 py-20 md:py-28">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-7 space-y-6">
              <div>
                <EditorialPill dot pulse>
                  The Double Impact Model
                </EditorialPill>
              </div>
              <h2 className="text-3xl font-extrabold tracking-tight text-white md:text-5xl lg:leading-tight">
                High-craft production that funds <span className="text-primary">grassroots budget tracking</span>.
              </h2>
              <p className="text-base leading-relaxed text-zinc-400 md:text-lg">
                When development partners, institutions, and civil society commission BNS Studios for bilingual podcasts, documentaries, and campaigns, 100% of the operating surplus is reinvested into Budget Ndio Story’s civic mission: holding Kenya’s KES 4.8 Trillion budget accountable across 47 counties.
              </p>
              <div className="grid grid-cols-3 gap-6 border-t border-white/10 pt-6">
                <div>
                  <p className="text-2xl font-bold text-white md:text-3xl">08</p>
                  <p className="text-xs text-zinc-400 mt-1">Production Formats</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-primary md:text-3xl">47</p>
                  <p className="text-xs text-zinc-400 mt-1">Counties Subsidized</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-white md:text-3xl">2×</p>
                  <p className="text-xs text-zinc-400 mt-1">Mission Multiplier</p>
                </div>
              </div>
              <div className="pt-2 flex flex-wrap items-center gap-4">
                <PillButton
                  onClick={() => setBookingOpen(true)}
                  icon={<Send className="size-4" />}
                >
                  Commission the Studio
                </PillButton>
                <PillButtonGroup
                  href="/bns-studio/work"
                  label="Explore Featured Work"
                  variant="invert"
                />
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl border border-white/10 bg-zinc-900 shadow-2xl">
                <Image
                  src={BNS_MEDIA_IMAGES.productionA}
                  alt="On-set documentary production at BNS Studios"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 40vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <p className="text-xs font-bold uppercase tracking-wider text-primary">Location Scouting & Film</p>
                  <p className="text-sm font-semibold text-white">Documenting citizen town halls & budget forums across Kenya</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 03 — 8 Production Formats Matrix */}
      <section className="border-t border-white/10 bg-black px-6 py-20 md:py-28">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-primary">Capabilities</p>
              <h2 className="mt-2 text-3xl font-extrabold text-white md:text-4xl">
                Eight formats built for reach.
              </h2>
            </div>
            <Link
              href="/bns-studio/work"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-zinc-400 hover:text-white transition-colors"
            >
              Browse all productions by format
              <ArrowUpRight className="size-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {STUDIO_CONTENT_TYPES.map((type) => {
              const Icon = type.icon;
              return (
                <div
                  key={type.id}
                  className="group flex flex-col justify-between rounded-2xl border border-white/10 bg-zinc-950 p-6 transition-all duration-300 hover:border-primary/50 hover:bg-zinc-900"
                >
                  <div>
                    <div className="flex size-10 items-center justify-center rounded-xl border border-white/10 bg-black text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                      <Icon className="size-5" />
                    </div>
                    <h3 className="mt-4 text-base font-bold text-white group-hover:text-primary transition-colors">
                      {type.label}
                    </h3>
                    <p className="mt-2 text-xs leading-relaxed text-zinc-400">
                      {type.shortDesc}
                    </p>
                  </div>
                  <Link
                    href={`/bns-studio/work?format=${encodeURIComponent(type.id)}`}
                    className="mt-6 inline-flex items-center gap-1 text-[11px] font-bold text-primary transition-colors hover:text-primary/80"
                  >
                    View cases
                    <ArrowUpRight className="size-3" />
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 04 — Featured Commissions Showcase */}
      <section className="border-t border-white/10 bg-zinc-950 px-6 py-20 md:py-28">
        <div className="mx-auto max-w-6xl">
          <div className="flex items-center justify-between mb-12">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-primary">Evidence</p>
              <h2 className="mt-2 text-3xl font-extrabold text-white md:text-4xl">Featured Commissions</h2>
            </div>
            <PillButtonGroup
              href="/bns-studio/work"
              label={`See all ${studiosEvidenceData.getAllProjects().length} projects`}
              variant="invert"
              size="sm"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {featuredProjects.map((project) => (
              <Link
                key={project.id}
                href={`/bns-studio/${project.slug}`}
                className="group relative block overflow-hidden rounded-3xl border border-white/10 bg-zinc-900 transition-all duration-300 hover:border-primary/50"
              >
                <div className="relative aspect-video w-full overflow-hidden">
                  <Image
                    src={project.media.posterUrl}
                    alt={project.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent opacity-80" />
                  <div className="absolute top-4 left-4">
                    <EditorialPill variant="invert" size="xs">
                      {project.contentType}
                    </EditorialPill>
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-xs font-semibold text-primary">{project.organization.name} · {project.year}</p>
                  <h3 className="mt-1 text-lg font-bold text-white group-hover:text-primary transition-colors">
                    {project.title}
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-zinc-400 line-clamp-2">
                    {project.subtitle}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 05 — Conversion CTA Band */}
      <section className="border-t border-white/10 bg-black px-6 py-20 md:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-3xl border border-white/10 bg-zinc-950/80 p-8 sm:p-12 lg:p-16 backdrop-blur-md">
            <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-center">
              <div className="lg:col-span-7 space-y-5">
                <EditorialPill dot pulse>
                  Commission BNS Studio
                </EditorialPill>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
                  Tell us what you need to move.
                </h2>
                <p className="text-base sm:text-lg text-zinc-400 leading-relaxed max-w-2xl">
                  Podcasts, explainers, town halls, or multi-channel campaigns — we respond with verified scope, production team, and timeline within 24 hours.
                </p>
              </div>

              <div className="lg:col-span-5 flex flex-col items-start lg:items-end gap-4">
                <div className="flex flex-wrap gap-3">
                  <PillButton
                    onClick={() => setBookingOpen(true)}
                    size="lg"
                  >
                    Open Enquiry Form
                  </PillButton>
                  <PillButtonGroup
                    href="/programmes"
                    label="Explore All Programmes"
                    variant="invert"
                    size="lg"
                  />
                </div>
                <p className="text-xs text-zinc-500 lg:text-right">
                  100% of studio surplus directly subsidizes grassroots civic auditing.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <StudioBookingForm open={bookingOpen} onOpenChange={setBookingOpen} />
    </div>
  );
}
