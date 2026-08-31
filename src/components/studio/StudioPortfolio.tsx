"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import {
  X,
  TrendingUp,
  Building2,
  Layers,
  Sparkles,
  ExternalLink,
  CheckCircle2,
  Filter,
} from "lucide-react";
import {
  BNS_STUDIO_EVIDENCE,
  STUDIO_CONTENT_TYPES,
  STUDIO_ORGANIZATION_TYPES,
  type StudioContentType,
  type StudioOrganizationType,
  type StudioEvidenceItem,
} from "@/constants/bns-studio-content";
import { LANDING_TYPOGRAPHY as T } from "@/constants/landing-typography";
import {
  LandingContent,
  LandingSection,
  LandingSectionHeader,
} from "@/layouts/landing-section";
import { cn } from "@/utils";

export function StudioPortfolio() {
  const [selectedContentType, setSelectedContentType] = useState<string>("All Content Types");
  const [selectedOrgType, setSelectedOrgType] = useState<string>("All Organisations");
  const [activeItem, setActiveItem] = useState<StudioEvidenceItem | null>(null);

  const filteredEvidence = BNS_STUDIO_EVIDENCE.filter((item) => {
    const matchesContent =
      selectedContentType === "All Content Types" ||
      item.contentType === selectedContentType;
    const matchesOrg =
      selectedOrgType === "All Organisations" ||
      item.organizationType === selectedOrgType;
    return matchesContent && matchesOrg;
  });

  return (
    <LandingSection id="portfolio" className="bg-muted/20">
      <LandingSectionHeader
        eyebrow="Evidence of Recent Work"
        title={
          <>
            Impact evidence by <span className={T.highlight}>format & organisation</span>
          </>
        }
        description="Explore documented productions, policy multimedia briefs, and civic facilitations delivered for public institutions, development partners, CSOs, and community networks."
      />

      <LandingContent>
        {/* Dual Filtering Controls */}
        <div className="mb-8 space-y-5 rounded-2xl border border-border/80 bg-card/60 p-4 backdrop-blur-sm sm:p-6">
          {/* 1. Filter by Content Type */}
          <div>
            <div className="mb-3 flex items-center justify-between">
              <span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                <Layers className="size-3.5 text-primary" />
                Filter by Content Type ({STUDIO_CONTENT_TYPES.length} Formats)
              </span>
              {selectedContentType !== "All Content Types" && (
                <button
                  type="button"
                  onClick={() => setSelectedContentType("All Content Types")}
                  className="text-xs font-medium text-primary hover:underline"
                >
                  Reset Content Filter
                </button>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setSelectedContentType("All Content Types")}
                className={cn(
                  "rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors",
                  selectedContentType === "All Content Types"
                    ? "border-primary bg-primary text-primary-foreground font-semibold shadow-xs"
                    : "border-border/70 bg-background/80 text-muted-foreground hover:border-primary/50 hover:text-foreground",
                )}
              >
                All Formats
              </button>
              {STUDIO_CONTENT_TYPES.map((type) => {
                const Icon = type.icon;
                const isSelected = selectedContentType === type.id;
                return (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => setSelectedContentType(type.id)}
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors",
                      isSelected
                        ? "border-primary bg-primary text-primary-foreground font-semibold shadow-xs"
                        : "border-border/70 bg-background/80 text-muted-foreground hover:border-primary/50 hover:text-foreground",
                    )}
                  >
                    <Icon className={cn("size-3.5", isSelected ? "text-primary-foreground" : "text-primary")} />
                    <span>{type.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Filter by Organisation */}
          <div className="border-t border-border/60 pt-4">
            <div className="mb-3 flex items-center justify-between">
              <span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                <Building2 className="size-3.5 text-primary" />
                Filter by Organisation Sector
              </span>
              {selectedOrgType !== "All Organisations" && (
                <button
                  type="button"
                  onClick={() => setSelectedOrgType("All Organisations")}
                  className="text-xs font-medium text-primary hover:underline"
                >
                  Reset Sector Filter
                </button>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setSelectedOrgType("All Organisations")}
                className={cn(
                  "rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors",
                  selectedOrgType === "All Organisations"
                    ? "border-foreground/80 bg-foreground text-background font-semibold"
                    : "border-border/70 bg-background/80 text-muted-foreground hover:border-foreground/40 hover:text-foreground",
                )}
              >
                All Sectors
              </button>
              {STUDIO_ORGANIZATION_TYPES.map((org) => {
                const isSelected = selectedOrgType === org.id;
                return (
                  <button
                    key={org.id}
                    type="button"
                    onClick={() => setSelectedOrgType(org.id)}
                    className={cn(
                      "rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors",
                      isSelected
                        ? "border-foreground/80 bg-foreground text-background font-semibold"
                        : "border-border/70 bg-background/80 text-muted-foreground hover:border-foreground/40 hover:text-foreground",
                    )}
                  >
                    {org.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Results Counter & Active Filter Tags */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 text-xs text-muted-foreground">
          <p className="font-medium">
            Showing <span className="font-semibold text-foreground">{filteredEvidence.length}</span> evidence projects
          </p>
          {(selectedContentType !== "All Content Types" || selectedOrgType !== "All Organisations") && (
            <button
              type="button"
              onClick={() => {
                setSelectedContentType("All Content Types");
                setSelectedOrgType("All Organisations");
              }}
              className="inline-flex items-center gap-1 text-primary hover:underline"
            >
              <Filter className="size-3" /> Clear all filters
            </button>
          )}
        </div>

        {/* Evidence Grid */}
        {filteredEvidence.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border p-12 text-center">
            <Layers className="mb-3 size-8 text-muted-foreground/60" />
            <h4 className="text-base font-semibold text-foreground">No evidence items match this combination</h4>
            <p className="mt-1 text-xs text-muted-foreground max-w-md">
              Try selecting a different content format or organization sector to view our published works.
            </p>
            <button
              type="button"
              onClick={() => {
                setSelectedContentType("All Content Types");
                setSelectedOrgType("All Organisations");
              }}
              className="mt-4 rounded-full border border-primary bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <motion.div layout className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {filteredEvidence.map((item) => (
                <motion.article
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.22 }}
                  onClick={() => setActiveItem(item)}
                  className="group relative flex cursor-pointer flex-col overflow-hidden rounded-2xl border border-border/80 bg-card transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {/* Card Media Preview */}
                  <div className="relative aspect-16/10 w-full overflow-hidden bg-muted">
                    <Image
                      src={item.image_url}
                      alt={item.title}
                      fill
                      className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                    {/* Top Badges */}
                    <div className="absolute inset-x-3 top-3 flex items-center justify-between gap-2">
                      <span className="inline-flex items-center gap-1 rounded-full bg-black/75 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur-md">
                        <Sparkles className="size-3 text-primary" />
                        {item.contentType}
                      </span>
                      <span className="rounded-full bg-black/60 px-2 py-0.5 text-[10px] font-medium text-white/90 backdrop-blur-md">
                        {item.year}
                      </span>
                    </div>

                    {/* Bottom Partner Pill */}
                    <div className="absolute inset-x-3 bottom-3">
                      <p className="line-clamp-1 text-xs font-semibold text-white/90">
                        {item.organizationName}
                      </p>
                    </div>
                  </div>

                  {/* Card Content & Impact Metric */}
                  <div className="flex flex-1 flex-col justify-between p-5">
                    <div className="space-y-2.5">
                      <div className="flex items-center gap-1.5 text-[11px] font-medium text-primary">
                        <Building2 className="size-3" />
                        <span>{item.organizationType}</span>
                      </div>
                      <h3 className="text-base font-bold leading-snug tracking-tight text-foreground transition-colors group-hover:text-primary">
                        {item.title}
                      </h3>
                      <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                        {item.summary}
                      </p>
                    </div>

                    {/* Impact Metric Banner */}
                    <div className="mt-4 rounded-xl border border-primary/20 bg-primary/5 p-2.5">
                      <div className="flex items-start gap-2">
                        <TrendingUp className="mt-0.5 size-3.5 shrink-0 text-primary" />
                        <p className="text-[11px] font-medium leading-tight text-foreground">
                          {item.impactMetric}
                        </p>
                      </div>
                    </div>

                    {/* Footer CTA Hint */}
                    <div className="mt-4 flex items-center justify-between border-t border-border/50 pt-3 text-xs font-medium text-primary">
                      <span>View case brief</span>
                      <ExternalLink className="size-3.5 transition-transform group-hover:translate-x-0.5" />
                    </div>
                  </div>
                </motion.article>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        <div className="mt-12 flex justify-center">
          <button
            type="button"
            onClick={() => document.getElementById("booking")?.scrollIntoView({ behavior: "smooth" })}
            className={cn(T.btnPrimary, "px-8 py-3 rounded-full text-xs font-semibold shadow-md")}
          >
            Commission Work in Any Format
          </button>
        </div>
      </LandingContent>

      {/* Case Brief Lightbox Modal */}
      <AnimatePresence>
        {activeItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm"
            onClick={() => setActiveItem(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="relative max-w-3xl w-full max-h-[90vh] overflow-y-auto rounded-3xl border border-border bg-card shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Image Header */}
              <div className="relative aspect-16/9 w-full bg-muted">
                <Image
                  src={activeItem.image_url}
                  alt={activeItem.title}
                  fill
                  className="object-cover object-center"
                  sizes="(max-width: 896px) 100vw, 896px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-card via-black/30 to-transparent" />
                <button
                  type="button"
                  onClick={() => setActiveItem(null)}
                  className="absolute top-4 right-4 flex size-9 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-md transition-colors hover:bg-black/80"
                  aria-label="Close case study"
                >
                  <X className="size-4" />
                </button>
                <div className="absolute bottom-4 left-6 right-6">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
                      {activeItem.contentType}
                    </span>
                    <span className="rounded-full bg-black/70 px-3 py-1 text-xs font-medium text-white backdrop-blur-md">
                      {activeItem.organizationType}
                    </span>
                  </div>
                </div>
              </div>

              {/* Modal Body */}
              <div className="space-y-6 p-6 sm:p-8">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Client & Partner: <span className="text-foreground">{activeItem.organizationName}</span> • {activeItem.year}
                  </p>
                  <h2 className="mt-1 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                    {activeItem.title}
                  </h2>
                </div>

                {/* Impact Highlight Box */}
                <div className="rounded-2xl border border-primary/30 bg-primary/10 p-4 sm:p-5">
                  <div className="flex items-start gap-3">
                    <TrendingUp className="mt-1 size-5 shrink-0 text-primary" />
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-primary">
                        Documented Impact & Evidence
                      </p>
                      <p className="mt-1 text-sm font-semibold text-foreground">
                        {activeItem.impactMetric}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-3">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                    Project Brief & Execution
                  </h3>
                  <p className="text-sm leading-relaxed text-foreground/80">
                    {activeItem.description}
                  </p>
                </div>

                {/* Deliverables */}
                {activeItem.deliverables && activeItem.deliverables.length > 0 && (
                  <div className="space-y-3 border-t border-border pt-4">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                      Key Deliverables
                    </h3>
                    <ul className="grid gap-2 sm:grid-cols-2">
                      {activeItem.deliverables.map((del, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-xs text-foreground/80">
                          <CheckCircle2 className="size-4 shrink-0 text-primary" />
                          <span>{del}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Action CTA inside modal */}
                <div className="flex flex-wrap items-center justify-between gap-4 border-t border-border pt-5">
                  <p className="text-xs text-muted-foreground">
                    Need a similar production for your organization?
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveItem(null);
                      document.getElementById("booking")?.scrollIntoView({ behavior: "smooth" });
                    }}
                    className={cn(T.btnPrimary, "rounded-full px-6 py-2 text-xs font-semibold")}
                  >
                    Commission a Project
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </LandingSection>
  );
}

