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
  Search,
  ArrowRight,
  Mic,
  Video,
  FileText,
  Film,
  Share2,
  Users,
  MessagesSquare,
  MapPin,
  Calendar,
  ChevronRight,
} from "lucide-react";
import {
  studiosEvidenceData,
  STUDIO_ORGANIZATIONS,
  type StudioContentType,
  type StudioSectorType,
  type StudioProjectEvidence,
  type StudioPartnerOrg,
} from "@/data/studios-evidence";
import { STUDIO_CONTENT_TYPES } from "@/constants/bns-studio-content";
import { LANDING_TYPOGRAPHY as T } from "@/constants/landing-typography";
import {
  LandingContent,
  LandingSection,
  LandingSectionHeader,
} from "@/layouts/landing-section";
import { cn } from "@/utils";

type NavigationMode = "all" | "content-type" | "organisation";

type Props = {
  selectedProject?: StudioProjectEvidence | null;
  onCloseProject?: () => void;
  onOpenProject?: (project: StudioProjectEvidence) => void;
};

export function StudioPortfolio({
  selectedProject: externalSelectedProject,
  onCloseProject: externalOnCloseProject,
  onOpenProject: externalOnOpenProject,
}: Props) {
  const allProjects = studiosEvidenceData.getAllProjects();
  const allOrganizations = studiosEvidenceData.getAllOrganizations();

  const [navMode, setNavMode] = useState<NavigationMode>("all");
  const [selectedContentType, setSelectedContentType] = useState<string>("All");
  const [selectedOrgSlug, setSelectedOrgSlug] = useState<string>("All");
  const [selectedSector, setSelectedSector] = useState<string>("All Sectors");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [internalActiveItem, setInternalActiveItem] = useState<StudioProjectEvidence | null>(null);

  const activeModalItem = externalSelectedProject !== undefined ? externalSelectedProject : internalActiveItem;

  const handleOpenProject = (item: StudioProjectEvidence) => {
    if (externalOnOpenProject) {
      externalOnOpenProject(item);
    } else {
      setInternalActiveItem(item);
    }
  };

  const handleCloseProject = () => {
    if (externalOnCloseProject) {
      externalOnCloseProject();
    } else {
      setInternalActiveItem(null);
    }
  };

  // Filter projects according to current active mode & criteria
  const filteredProjects = allProjects.filter((item) => {
    const matchesSearch =
      !searchQuery.trim() ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.organization.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.briefChallenge.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesContent =
      navMode === "content-type"
        ? selectedContentType === "All" || item.contentType === selectedContentType
        : selectedContentType === "All" || item.contentType === selectedContentType;

    const matchesOrg =
      navMode === "organisation"
        ? selectedOrgSlug === "All" || item.organization.slug === selectedOrgSlug
        : true;

    const matchesSector =
      selectedSector === "All Sectors" || item.organization.sector === selectedSector;

    return matchesSearch && matchesContent && matchesOrg && matchesSector;
  });

  const selectedOrgData =
    selectedOrgSlug !== "All"
      ? allOrganizations.find((o) => o.slug === selectedOrgSlug)
      : null;

  const currentContentConfig =
    selectedContentType !== "All"
      ? STUDIO_CONTENT_TYPES.find((c) => c.id === selectedContentType)
      : null;

  return (
    <LandingSection id="portfolio" className="border-t-0 bg-muted/20">
      <LandingSectionHeader
        eyebrow="Explore the Evidence"
        title={
          <>
            Curated evidence library: <span className={T.highlight}>Work that speaks</span>
          </>
        }
        description="Here is the work. Here is who we did it for. Here is what we made. Here is the verifiable evidence across 8 specialized content formats and our partners."
      />

      <LandingContent>
        {/* Top 3 Navigation Mode Switcher */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border/80 pb-6">
          <div className="flex items-center gap-1 rounded-2xl border border-border/80 bg-card p-1.5 shadow-xs">
            <button
              type="button"
              onClick={() => {
                setNavMode("all");
                setSelectedContentType("All");
                setSelectedOrgSlug("All");
              }}
              className={cn(
                "rounded-xl px-4 py-2 text-xs font-semibold transition-all",
                navMode === "all"
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              All Work ({allProjects.length})
            </button>
            <button
              type="button"
              onClick={() => {
                setNavMode("content-type");
                if (selectedContentType === "All") setSelectedContentType("Podcast & Audio");
              }}
              className={cn(
                "rounded-xl px-4 py-2 text-xs font-semibold transition-all",
                navMode === "content-type"
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              By Content Type (8)
            </button>
            <button
              type="button"
              onClick={() => {
                setNavMode("organisation");
                if (selectedOrgSlug === "All") setSelectedOrgSlug("national-treasury-youth");
              }}
              className={cn(
                "rounded-xl px-4 py-2 text-xs font-semibold transition-all",
                navMode === "organisation"
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              By Organisation ({allOrganizations.length})
            </button>
          </div>

          {/* Global Search Bar */}
          <div className="relative w-full max-w-xs">
            <Search className="absolute left-3.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search evidence, topics, partners..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-10 w-full rounded-2xl border border-border/80 bg-card pl-9 pr-4 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-foreground"
              >
                <X className="size-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* MODE 1: ALL WORK VIEW */}
        {navMode === "all" && (
          <div className="mb-8 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border/80 bg-card/60 p-4 backdrop-blur-sm">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold text-muted-foreground">Filter Format:</span>
              <button
                type="button"
                onClick={() => setSelectedContentType("All")}
                className={cn(
                  "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                  selectedContentType === "All"
                    ? "border-primary bg-primary text-primary-foreground font-semibold"
                    : "border-border/70 bg-background/80 text-muted-foreground hover:border-primary/50",
                )}
              >
                All Formats
              </button>
              {STUDIO_CONTENT_TYPES.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setSelectedContentType(t.id)}
                  className={cn(
                    "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                    selectedContentType === t.id
                      ? "border-primary bg-primary text-primary-foreground font-semibold"
                      : "border-border/70 bg-background/80 text-muted-foreground hover:border-primary/50",
                  )}
                >
                  {t.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-muted-foreground">Sector:</span>
              <select
                value={selectedSector}
                onChange={(e) => setSelectedSector(e.target.value)}
                className="h-8 rounded-xl border border-border bg-background px-2.5 text-xs text-foreground focus:outline-none"
              >
                <option value="All Sectors">All Sectors</option>
                <option value="Governments & Public Sector">Governments & Public Sector</option>
                <option value="Development Partners & INGOs">Development Partners & INGOs</option>
                <option value="Civil Society & CSOs">Civil Society & CSOs</option>
                <option value="Private Sector & ESG">Private Sector & ESG</option>
                <option value="Grassroots & Community Alliances">Grassroots & Community Alliances</option>
              </select>
            </div>
          </div>
        )}

        {/* MODE 2: BY CONTENT TYPE TABS VIEW */}
        {navMode === "content-type" && (
          <div className="mb-10 space-y-6">
            {/* 8 Horizontal Nav Tabs */}
            <div className="flex flex-wrap gap-2 rounded-2xl border border-border/80 bg-card p-3 shadow-xs">
              {STUDIO_CONTENT_TYPES.map((format) => {
                const Icon = format.icon;
                const isSelected = selectedContentType === format.id;
                const count = allProjects.filter((p) => p.contentType === format.id).length;
                return (
                  <button
                    key={format.id}
                    type="button"
                    onClick={() => setSelectedContentType(format.id)}
                    className={cn(
                      "flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-semibold transition-all",
                      isSelected
                        ? "bg-primary text-primary-foreground shadow-xs"
                        : "border border-border/60 bg-background text-muted-foreground hover:border-primary/50 hover:text-foreground",
                    )}
                  >
                    <Icon className="size-3.5" />
                    <span>{format.label}</span>
                    <span
                      className={cn(
                        "rounded-full px-1.5 py-0.2 text-[10px]",
                        isSelected ? "bg-primary-foreground/20 text-white" : "bg-muted text-muted-foreground",
                      )}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Selected Format Explanatory Banner */}
            {currentContentConfig && (
              <div className="flex flex-col gap-2 rounded-2xl border border-primary/25 bg-primary/5 p-4 sm:p-5">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary">
                  <Sparkles className="size-3.5" />
                  <span>Production Capability & Framework</span>
                </div>
                <h3 className="text-lg font-bold text-foreground sm:text-xl">
                  {currentContentConfig.label}
                </h3>
                <p className="text-xs leading-relaxed text-muted-foreground sm:text-sm">
                  {currentContentConfig.shortDesc}
                </p>
              </div>
            )}
          </div>
        )}

        {/* MODE 3: BY ORGANISATION VIEW */}
        {navMode === "organisation" && (
          <div className="mb-10 space-y-6">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {allOrganizations.map((org) => {
                const isSelected = selectedOrgSlug === org.slug;
                const orgWorkCount = allProjects.filter((p) => p.organization.slug === org.slug).length;
                return (
                  <button
                    key={org.id}
                    type="button"
                    onClick={() => setSelectedOrgSlug(org.slug)}
                    className={cn(
                      "flex flex-col justify-between rounded-2xl border p-4 text-left transition-all",
                      isSelected
                        ? "border-primary bg-primary/10 shadow-md ring-1 ring-primary"
                        : "border-border bg-card hover:border-primary/50 hover:bg-muted/30",
                    )}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <span className="rounded-full bg-muted px-2.5 py-0.5 text-[10px] font-semibold text-foreground/80">
                          {org.sector}
                        </span>
                        <span className="text-[11px] font-semibold text-primary">
                          {orgWorkCount} {orgWorkCount === 1 ? "project" : "projects"}
                        </span>
                      </div>
                      <h4 className="mt-2 text-sm font-bold text-foreground line-clamp-1">
                        {org.name}
                      </h4>
                      <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
                        {org.description}
                      </p>
                    </div>
                    <div className="mt-3 flex items-center gap-1.5 text-[11px] text-muted-foreground border-t border-border/50 pt-2">
                      <MapPin className="size-3" />
                      <span>{org.location}</span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Selected Organization Profile Banner */}
            {selectedOrgData && (
              <div className="rounded-2xl border border-border bg-card p-5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-primary">
                      Selected Partner / Client Dossier
                    </span>
                    <h3 className="text-xl font-bold text-foreground">
                      {selectedOrgData.name}
                    </h3>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {selectedOrgData.description} • {selectedOrgData.location}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedOrgSlug("All")}
                    className="text-xs font-semibold text-primary hover:underline"
                  >
                    View all organisations
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Results Counter & Search indicator */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
          <p className="font-medium">
            Showing <span className="font-bold text-foreground">{filteredProjects.length}</span> evidence projects
            {selectedContentType !== "All" && ` in ${selectedContentType}`}
            {selectedOrgData && ` for ${selectedOrgData.name}`}
          </p>
          {(searchQuery || selectedContentType !== "All" || selectedSector !== "All Sectors") && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setSelectedContentType("All");
                setSelectedSector("All Sectors");
                setSelectedOrgSlug("All");
              }}
              className="inline-flex items-center gap-1 text-primary hover:underline"
            >
              <Filter className="size-3" /> Reset all active filters
            </button>
          )}
        </div>

        {/* Evidence Grid */}
        {filteredProjects.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-border p-12 text-center">
            <Layers className="mb-3 size-8 text-muted-foreground/60" />
            <h4 className="text-base font-bold text-foreground">No evidence projects match your criteria</h4>
            <p className="mt-1 text-xs text-muted-foreground max-w-md">
              Try adjusting your search terms or selecting another format or organization to view documented work.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setSelectedContentType("All");
                setSelectedSector("All Sectors");
                setSelectedOrgSlug("All");
              }}
              className="mt-4 rounded-full border border-primary bg-primary px-5 py-2 text-xs font-semibold text-primary-foreground"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <motion.div layout className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {filteredProjects.map((project) => (
                <motion.article
                  key={project.id}
                  layout
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ duration: 0.2 }}
                  onClick={() => handleOpenProject(project)}
                  className="group relative flex cursor-pointer flex-col overflow-hidden rounded-3xl border border-border/80 bg-card transition-all duration-300 hover:-translate-y-1 hover:border-primary/60 hover:shadow-xl hover:shadow-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {/* Poster Thumbnail */}
                  <div className="relative aspect-16/10 w-full overflow-hidden bg-muted">
                    <Image
                      src={project.media.posterUrl}
                      alt={project.title}
                      fill
                      className={cn(
                        "object-cover transition-transform duration-500 group-hover:scale-105",
                        project.media.posterPosition || "object-center",
                      )}
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />

                    {/* Top Badges */}
                    <div className="absolute inset-x-3.5 top-3.5 flex items-center justify-between gap-2">
                      <span className="inline-flex items-center gap-1 rounded-full bg-black/80 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur-md">
                        <Sparkles className="size-3 text-primary" />
                        {project.contentType}
                      </span>
                      <span className="rounded-full bg-black/60 px-2 py-0.5 text-[10px] font-medium text-white/90 backdrop-blur-md">
                        {project.year}
                      </span>
                    </div>

                    {/* Bottom Client Tag */}
                    <div className="absolute inset-x-3.5 bottom-3">
                      <p className="line-clamp-1 text-xs font-semibold text-white/95">
                        {project.organization.name}
                      </p>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="flex flex-1 flex-col justify-between p-5 sm:p-6">
                    <div className="space-y-2.5">
                      <div className="flex items-center gap-1.5 text-[11px] font-semibold text-primary">
                        <Building2 className="size-3" />
                        <span>{project.organization.sector}</span>
                      </div>
                      <h3 className="text-base font-bold leading-snug tracking-tight text-foreground transition-colors group-hover:text-primary">
                        {project.title}
                      </h3>
                      <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                        {project.briefChallenge}
                      </p>
                    </div>

                    {/* Verified Outcome Banner */}
                    <div className="mt-4 rounded-2xl border border-primary/25 bg-primary/10 p-3">
                      <div className="flex items-start gap-2">
                        <TrendingUp className="mt-0.5 size-3.5 shrink-0 text-primary" />
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-wider text-primary">
                            Measurable Evidence
                          </p>
                          <p className="text-xs font-bold leading-tight text-foreground">
                            {project.impactEvidence.primaryMetric}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Footer Trigger */}
                    <div className="mt-4 flex items-center justify-between border-t border-border/50 pt-3 text-xs font-semibold text-primary">
                      <span>View case dossier & outputs</span>
                      <ChevronRight className="size-4 transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                </motion.article>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Global Commission Trigger */}
        <div className="mt-14 flex flex-col items-center justify-center rounded-3xl border border-border/80 bg-card/60 p-8 text-center sm:p-12">
          <h3 className="text-xl font-bold text-foreground sm:text-2xl">
            Have a project or policy evidence to translate?
          </h3>
          <p className="mt-2 max-w-xl text-xs sm:text-sm text-muted-foreground">
            We partner with governments, INGOs, CSOs, and commercial leaders to produce high-trust content across all 8 formats.
          </p>
          <div className="mt-6 flex flex-wrap gap-3 justify-center">
            <button
              type="button"
              onClick={() => document.getElementById("booking")?.scrollIntoView({ behavior: "smooth" })}
              className={cn(T.btnPrimary, "rounded-full px-8 py-3 text-xs font-semibold shadow-md")}
            >
              Commission BNS Studios
            </button>
            <a
              href="mailto:info@budgetndiostory.org"
              className="inline-flex items-center justify-center rounded-full border border-input bg-background px-6 py-3 text-xs font-semibold hover:bg-accent"
            >
              Contact Producers Directly
            </a>
          </div>
        </div>
      </LandingContent>

      {/* Deep Case / Evidence Dossier Modal */}
      <AnimatePresence>
        {activeModalItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md"
            onClick={handleCloseProject}
          >
            <motion.div
              initial={{ scale: 0.94, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.94, opacity: 0, y: 15 }}
              transition={{ duration: 0.22 }}
              className="relative max-w-4xl w-full max-h-[92vh] overflow-y-auto rounded-3xl border border-border bg-card shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Media Header Banner */}
              <div className="relative aspect-16/9 w-full bg-muted sm:aspect-21/9">
                <Image
                  src={activeModalItem.media.posterUrl}
                  alt={activeModalItem.title}
                  fill
                  className={cn(
                    "object-cover",
                    activeModalItem.media.posterPosition || "object-center",
                  )}
                  sizes="(max-width: 1024px) 100vw, 1024px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-card via-black/40 to-transparent" />
                <button
                  type="button"
                  onClick={handleCloseProject}
                  className="absolute top-4 right-4 flex size-9 items-center justify-center rounded-full bg-black/70 text-white backdrop-blur-md transition-colors hover:bg-black/90"
                  aria-label="Close dossier"
                >
                  <X className="size-4" />
                </button>
                <div className="absolute bottom-4 left-6 right-6">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
                      {activeModalItem.contentType}
                    </span>
                    <span className="rounded-full bg-black/70 px-3 py-1 text-xs font-medium text-white backdrop-blur-md">
                      {activeModalItem.organization.sector}
                    </span>
                    <span className="rounded-full bg-black/60 px-2.5 py-1 text-xs font-medium text-white/80 backdrop-blur-md">
                      {activeModalItem.year}
                    </span>
                  </div>
                </div>
              </div>

              {/* Dossier Body */}
              <div className="space-y-6 p-6 sm:p-8">
                {/* Title & Client Summary */}
                <div>
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
                    <Building2 className="size-3.5" />
                    <span>{activeModalItem.organization.name}</span>
                  </div>
                  <h2 className="mt-1 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                    {activeModalItem.title}
                  </h2>
                  {activeModalItem.subtitle && (
                    <p className="mt-1 text-sm font-medium text-muted-foreground">
                      {activeModalItem.subtitle}
                    </p>
                  )}
                </div>

                {/* Evidence & Metric Highlight Box */}
                <div className="rounded-2xl border border-primary/30 bg-primary/10 p-5">
                  <div className="flex items-start gap-3">
                    <TrendingUp className="mt-1 size-5 shrink-0 text-primary" />
                    <div className="space-y-1">
                      <p className="text-xs font-bold uppercase tracking-wider text-primary">
                        Measurable Impact & Reach
                      </p>
                      <p className="text-base font-bold text-foreground">
                        {activeModalItem.impactEvidence.primaryMetric}
                        {activeModalItem.impactEvidence.secondaryMetric && ` • ${activeModalItem.impactEvidence.secondaryMetric}`}
                      </p>
                      <p className="text-xs leading-relaxed text-muted-foreground">
                        {activeModalItem.impactEvidence.context}
                      </p>
                      {activeModalItem.impactEvidence.verificationOutcome && (
                        <p className="text-xs font-medium text-foreground/90 pt-1">
                          <span className="font-bold text-primary">Verification: </span>
                          {activeModalItem.impactEvidence.verificationOutcome}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Challenge vs Solution Breakdown */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl border border-border bg-muted/20 p-4 space-y-2">
                    <p className="text-xs font-bold uppercase tracking-wider text-foreground">
                      The Brief & Challenge
                    </p>
                    <p className="text-xs leading-relaxed text-muted-foreground">
                      {activeModalItem.briefChallenge}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-border bg-muted/20 p-4 space-y-2">
                    <p className="text-xs font-bold uppercase tracking-wider text-foreground">
                      What BNS Studios Produced
                    </p>
                    <p className="text-xs leading-relaxed text-muted-foreground">
                      {activeModalItem.whatWeProduced}
                    </p>
                  </div>
                </div>

                {/* Full Editorial Description */}
                <div className="space-y-2">
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Project Narrative & Strategy
                  </p>
                  <p className="text-sm leading-relaxed text-foreground/80">
                    {activeModalItem.description}
                  </p>
                </div>

                {/* Outputs Checklist */}
                {activeModalItem.outputs && activeModalItem.outputs.length > 0 && (
                  <div className="space-y-3 border-t border-border pt-4">
                    <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Delivered Outputs & Formats
                    </p>
                    <ul className="grid gap-2 sm:grid-cols-2">
                      {activeModalItem.outputs.map((output, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-xs text-foreground/85">
                          <CheckCircle2 className="mt-0.5 size-3.5 shrink-0 text-primary" />
                          <span>{output}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Related Work from the same Organisation or Format */}
                <div className="space-y-3 border-t border-border pt-5">
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Related Evidence Works
                  </p>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {studiosEvidenceData.getRelatedProjects(activeModalItem.id, 2).map((rel) => (
                      <button
                        key={rel.id}
                        type="button"
                        onClick={() => handleOpenProject(rel)}
                        className="flex items-center gap-3 rounded-2xl border border-border bg-card p-3 text-left transition-all hover:border-primary/50 hover:bg-muted/30"
                      >
                        <div className="relative size-12 shrink-0 overflow-hidden rounded-xl bg-muted">
                          <Image
                            src={rel.media.posterUrl}
                            alt={rel.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <span className="text-[10px] font-semibold text-primary line-clamp-1">
                            {rel.contentType}
                          </span>
                          <p className="text-xs font-bold text-foreground line-clamp-1">
                            {rel.title}
                          </p>
                          <p className="text-[11px] text-muted-foreground line-clamp-1">
                            {rel.organization.name}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Action Footer */}
                <div className="flex flex-wrap items-center justify-between gap-4 border-t border-border pt-5">
                  <div className="text-xs text-muted-foreground">
                    Need a similar production for your team?
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      handleCloseProject();
                      document.getElementById("booking")?.scrollIntoView({ behavior: "smooth" });
                    }}
                    className={cn(T.btnPrimary, "rounded-full px-6 py-2.5 text-xs font-semibold shadow-sm")}
                  >
                    Commission this Format
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


